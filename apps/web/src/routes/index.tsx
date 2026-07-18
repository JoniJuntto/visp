import { Button } from "@VISP/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const scenarios = [
	[
		"On location",
		"Street, venue, or travel coverage that still looks like a produced show — because OBS is running it.",
	],
	[
		"No phone-app limits",
		"Alerts, scenes, stingers, and layout control. The phone feeds OBS instead of going live on its own.",
	],
	[
		"Guest cam",
		"A friend's phone or a co-host on the road shows up as a proper scene, not a call window.",
	],
	[
		"Venue Wi-Fi is trash",
		"The camera rides mobile data. The actual stream leaves your stable home connection.",
	],
	[
		"Signal dips",
		"A short mobile blip doesn't end the broadcast. Viewers stay in the stream while the phone recovers.",
	],
	[
		"Multiplatform",
		"One phone feed; OBS sends the show to Twitch and anywhere else at once.",
	],
] as const;

function HomeComponent() {
	const { data: session, isPending } = authClient.useSession();
	const signedIn = Boolean(session);

	return (
		<main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:py-24">
			<div className="flex flex-col gap-5">
				<div aria-hidden className="smpte-bars h-1.5 w-28" />
				<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
					IRL relay for OBS
				</p>
				<h1 className="font-bold font-display text-6xl uppercase leading-[0.92] tracking-tight sm:text-7xl">
					Phone is the camera.
					<br />
					Home is the studio.
				</h1>
				<p className="max-w-prose text-lg text-muted-foreground">
					You're out with a phone on mobile data. Your OBS — overlays, alerts,
					scene switches — stays on the PC at home. VISP carries the feed
					between them, so going mobile never means giving up your production.
				</p>
			</div>

			<dl className="flex flex-col border-t">
				{scenarios.map(([term, detail]) => (
					<div
						className="grid gap-1 border-b py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
						key={term}
					>
						<dt className="font-mono text-muted-foreground text-xs uppercase tracking-[0.2em] sm:pt-0.5">
							{term}
						</dt>
						<dd>{detail}</dd>
					</div>
				))}
			</dl>

			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap gap-3">
					{isPending ? (
						<Button disabled>Loading...</Button>
					) : signedIn ? (
						<Link to="/dashboard">
							<Button>Open dashboard</Button>
						</Link>
					) : (
						<Link to="/login">
							<Button>Continue with Twitch</Button>
						</Link>
					)}
				</div>
				<p className="font-mono text-muted-foreground/70 text-xs uppercase tracking-[0.2em]">
					SRT/RTMP · no re-encode · your stream key never leaves OBS
				</p>
			</div>
		</main>
	);
}
