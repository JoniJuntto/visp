import { randomBytes } from "node:crypto";

const TICKET_TTL_MS = 30_000;

type Ticket = { expiresAt: number; userId: string };

export class ChatTicketStore {
	private readonly tickets = new Map<string, Ticket>();

	issue(userId: string, now = Date.now()) {
		this.prune(now);
		const ticket = randomBytes(32).toString("base64url");
		const expiresAt = now + TICKET_TTL_MS;
		this.tickets.set(ticket, { expiresAt, userId });
		return { ticket, expiresAt: new Date(expiresAt).toISOString() };
	}

	consume(ticket: string, now = Date.now()) {
		const value = this.tickets.get(ticket);
		this.tickets.delete(ticket);
		if (!value || value.expiresAt <= now) return null;
		return value.userId;
	}

	private prune(now: number) {
		for (const [ticket, value] of this.tickets) {
			if (value.expiresAt <= now) this.tickets.delete(ticket);
		}
	}
}

export const chatTickets = new ChatTicketStore();
