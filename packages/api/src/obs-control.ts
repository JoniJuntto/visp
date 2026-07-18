import { db } from "@VISP/db";
import { appUser } from "@VISP/db/schema/index";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { eq, sql } from "drizzle-orm";

const CONNECTED_FOR_MS = 10_000;
const TOKEN_ID_BYTES = 12;
const TOKEN_SECRET_BYTES = 32;

function hashToken(secret: string) {
	return createHash("sha256").update(secret).digest("hex");
}

export function parseObsControlToken(value: string | undefined) {
	if (!value?.startsWith("Bearer ")) return null;
	const [id, secret, extra] = value.slice(7).split(".");
	return !extra &&
		/^[a-f0-9]{24}$/.test(id ?? "") &&
		/^[a-f0-9]{64}$/.test(secret ?? "")
		? { id: id as string, secret: secret as string }
		: null;
}

function controlStatus(owner: typeof appUser.$inferSelect) {
	const connected = Boolean(
		owner.obsLastSeenAt &&
			Date.now() - owner.obsLastSeenAt.getTime() < CONNECTED_FOR_MS,
	);
	return {
		configured: Boolean(owner.obsControlTokenHash),
		connected,
		streaming: owner.obsStreaming,
		desiredStreaming: owner.obsDesiredStreaming,
		pending: owner.obsAppliedVersion < owner.obsCommandVersion,
		lastSeenAt: owner.obsLastSeenAt?.toISOString() ?? null,
	};
}

export async function getObsControlStatus(userId: string) {
	const owner = await db.query.appUser.findFirst({
		where: eq(appUser.id, userId),
	});
	if (!owner) throw new Error("Relay user not found");
	return controlStatus(owner);
}

export async function rotateObsControlToken(userId: string) {
	const id = randomBytes(TOKEN_ID_BYTES).toString("hex");
	const secret = randomBytes(TOKEN_SECRET_BYTES).toString("hex");
	const hash = hashToken(secret);
	const [owner] = await db
		.update(appUser)
		.set({
			obsControlTokenId: id,
			obsControlTokenHash: hash,
			obsDesiredStreaming: false,
			obsStreaming: false,
			obsCommandVersion: 0,
			obsAppliedVersion: 0,
			obsLastSeenAt: null,
		})
		.where(eq(appUser.id, userId))
		.returning();
	if (!owner) throw new Error("Relay user not found");
	return { token: `${id}.${secret}`, status: controlStatus(owner) };
}

export async function setObsStreaming(userId: string, streaming: boolean) {
	const [owner] = await db
		.update(appUser)
		.set({
			obsDesiredStreaming: streaming,
			obsCommandVersion: sql`${appUser.obsCommandVersion} + 1`,
		})
		.where(eq(appUser.id, userId))
		.returning();
	if (!owner) throw new Error("Relay user not found");
	return controlStatus(owner);
}

export async function pollObsControl(
	authorization: string | undefined,
	input: { appliedVersion: number; streaming: boolean },
) {
	const token = parseObsControlToken(authorization);
	if (!token) return null;
	const owner = await db.query.appUser.findFirst({
		where: eq(appUser.obsControlTokenId, token.id),
	});
	if (!owner?.obsControlTokenHash) return null;
	const providedHash = Buffer.from(hashToken(token.secret), "hex");
	const storedHash = Buffer.from(owner.obsControlTokenHash, "hex");
	if (
		storedHash.length !== providedHash.length ||
		!timingSafeEqual(providedHash, storedHash)
	) {
		return null;
	}

	// ponytail: one heartbeat write per poll is fine for v1; use leases or long-polling when connection count becomes material.
	const appliedVersion = Math.min(
		input.appliedVersion,
		owner.obsCommandVersion,
	);
	const [updated] = await db
		.update(appUser)
		.set({
			obsAppliedVersion: appliedVersion,
			obsStreaming: input.streaming,
			obsLastSeenAt: new Date(),
		})
		.where(eq(appUser.id, owner.id))
		.returning();
	if (!updated) return null;
	return {
		commandVersion: updated.obsCommandVersion,
		desiredStreaming: updated.obsDesiredStreaming,
		pollAfterMs: 2000,
	};
}
