import { Button } from "@VISP/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@VISP/ui/components/card";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { authApiURL, authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/device")({
	validateSearch: z.object({ user_code: z.string().optional() }),
	beforeLoad: async ({ location }) => {
		const session = await authClient.getSession();
		if (!session.data) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
	},
	component: DeviceApproval,
});

type State = "checking" | "ready" | "approved" | "denied" | "error";

async function deviceRequest(path: string, init?: RequestInit) {
	return fetch(authApiURL(path), {
		...init,
		credentials: "include",
		headers: {
			...(init?.body ? { "content-type": "application/json" } : {}),
			...init?.headers,
		},
	});
}

function DeviceApproval() {
	const { user_code: userCode } = Route.useSearch();
	const [state, setState] = useState<State>("checking");
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!userCode) {
			setMessage("The OBS authorization code is missing.");
			setState("error");
			return;
		}
		void deviceRequest(
			`/device?user_code=${encodeURIComponent(userCode)}`,
		).then(async (response) => {
			if (response.ok) {
				setState("ready");
				return;
			}
			const error = (await response.json().catch(() => null)) as {
				message?: string;
			} | null;
			setMessage(error?.message ?? "This OBS authorization has expired.");
			setState("error");
		});
	}, [userCode]);

	const decide = async (decision: "approve" | "deny") => {
		if (!userCode) return;
		setState("checking");
		const response = await deviceRequest(`/device/${decision}`, {
			method: "POST",
			body: JSON.stringify({ userCode }),
		});
		if (!response.ok) {
			const error = (await response.json().catch(() => null)) as {
				message?: string;
			} | null;
			setMessage(error?.message ?? "Could not update this authorization.");
			setState("error");
			return;
		}
		setState(decision === "approve" ? "approved" : "denied");
	};

	const finished = state === "approved" || state === "denied";
	return (
		<main className="mx-auto flex w-full max-w-lg items-center px-4 py-12">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Connect OBS to VISP</CardTitle>
					<CardDescription>
						Approve the OBS plugin running on your computer.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{state === "ready" ? (
						<>
							<p>OBS will be able to:</p>
							<ul className="list-disc space-y-1 pl-5 text-muted-foreground">
								<li>See your active publishing devices.</li>
								<li>Create a publishing device for this OBS installation.</li>
								<li>Add your relay feeds as OBS Media Sources.</li>
								<li>Receive your existing remote-control commands.</li>
							</ul>
							<p className="text-muted-foreground text-sm">
								Approving replaces any previously paired OBS plugin for this
								account.
							</p>
						</>
					) : finished ? (
						<p>
							{state === "approved"
								? "OBS is approved. You can close this page and return to OBS."
								: "OBS access was denied. You can close this page."}
						</p>
					) : state === "error" ? (
						<p className="text-destructive">{message}</p>
					) : (
						<p className="text-muted-foreground">Checking authorization…</p>
					)}
				</CardContent>
				{state === "ready" ? (
					<CardFooter className="gap-2">
						<Button onClick={() => void decide("approve")}>Approve</Button>
						<Button variant="outline" onClick={() => void decide("deny")}>
							Deny
						</Button>
					</CardFooter>
				) : null}
			</Card>
		</main>
	);
}
