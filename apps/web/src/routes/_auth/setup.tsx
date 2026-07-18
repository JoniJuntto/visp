import type { AppRouter } from "@VISP/api/routers/index";
import { Button, buttonVariants } from "@VISP/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@VISP/ui/components/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import type { inferRouterOutputs } from "@trpc/server";
import { ArrowLeftIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	CopyButton,
	downloadSceneCollection,
} from "@/components/credential-reveal";
import { useTRPC } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/setup")({
	validateSearch: (search: Record<string, unknown>) => ({
		redo: search.redo === true || search.redo === "true" || search.redo === "1",
	}),
	beforeLoad: async ({ context, search }) => {
		const status = await context.queryClient.ensureQueryData(
			context.trpc.secrets.status.queryOptions(),
		);
		if (status.onboardedAt && !search.redo) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SetupWizard,
});

type Outputs = inferRouterOutputs<AppRouter>;
type SecretBundle = Outputs["onboarding"]["complete"];
type Software = "obs" | "larix" | "moblin" | "other";

const SOFTWARE_INFO: Record<
	Software,
	{
		name: string;
		description: string;
		primary: "srt" | "rtmp";
		steps: string[];
	}
> = {
	obs: {
		name: "OBS Studio",
		description: "Streaming from a PC or laptop",
		primary: "srt",
		steps: [
			"On the device that films, open OBS and go to Settings → Stream.",
			'Set Service to "Custom..." and paste your link into the Server field.',
			"Leave Stream Key empty and click OK.",
		],
	},
	larix: {
		name: "Larix Broadcaster",
		description: "IRL streaming from a phone",
		primary: "srt",
		steps: [
			"Open Larix and go to Settings → Connections → New connection.",
			"Paste your link into the URL field and tap Save.",
			"Streaming on mobile data? Turn on adaptive bitrate so the stream stays smooth when the signal dips.",
		],
	},
	moblin: {
		name: "Moblin",
		description: "IRL streaming from an iPhone",
		primary: "srt",
		steps: [
			"Open Moblin and go to Settings → Streams → Create stream.",
			"Paste your link as the stream URL and save.",
		],
	},
	other: {
		name: "Streamlabs / something else",
		description: "Any app with a custom server option",
		primary: "rtmp",
		steps: [
			'In your app\'s stream settings, choose "Custom" or "Custom RTMP" as the service.',
			"Paste your link as the server or URL. The link includes your password, so keep it private.",
			'If your app supports SRT, use the link under "Backup link" instead — it handles shaky networks better.',
		],
	},
};

function OptionCard({
	title,
	description,
	onClick,
}: {
	title: string;
	description: string;
	onClick: () => void;
}) {
	return (
		<button
			className="flex flex-col gap-1 border p-4 text-left transition-colors hover:border-primary hover:bg-accent"
			type="button"
			onClick={onClick}
		>
			<strong>{title}</strong>
			<span className="text-muted-foreground">{description}</span>
		</button>
	);
}

function DeviceStep({ onPick }: { onPick: (count: number) => void }) {
	const [pickingCount, setPickingCount] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle>How many devices will stream at the same time?</CardTitle>
				<CardDescription>
					A device is anything that sends video — a phone, a camera rig, a
					laptop. You can add more later.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<OptionCard
					description="One phone or one computer sends the video."
					title="Just one device"
					onClick={() => onPick(1)}
				/>
				{pickingCount ? (
					<div className="flex flex-col gap-2 border p-4">
						<strong>How many?</strong>
						<div className="flex gap-2">
							{[2, 3, 4].map((count) => (
								<Button
									key={count}
									variant="outline"
									onClick={() => onPick(count)}
								>
									{count} devices
								</Button>
							))}
						</div>
					</div>
				) : (
					<OptionCard
						description="For example a main phone plus a backup phone or second angle."
						title="Multiple at the same time"
						onClick={() => setPickingCount(true)}
					/>
				)}
			</CardContent>
		</Card>
	);
}

function SoftwareStep({
	onBack,
	onPick,
}: {
	onBack: () => void;
	onPick: (software: Software) => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Which app will you stream with?</CardTitle>
				<CardDescription>
					We'll tailor the instructions to your app.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{(Object.keys(SOFTWARE_INFO) as Software[]).map((value) => (
					<OptionCard
						key={value}
						description={SOFTWARE_INFO[value].description}
						title={SOFTWARE_INFO[value].name}
						onClick={() => onPick(value)}
					/>
				))}
				<Button className="self-start" variant="ghost" onClick={onBack}>
					<ArrowLeftIcon data-icon="inline-start" />
					Back
				</Button>
			</CardContent>
		</Card>
	);
}

function DeviceLinkBlock({
	index,
	primary,
	fallback,
	fallbackLabel,
}: {
	index: number;
	primary: string;
	fallback: string;
	fallbackLabel: string;
}) {
	const [showFallback, setShowFallback] = useState(false);

	return (
		<div className="flex flex-col gap-3 border p-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<strong>Device {index + 1}</strong>
				<CopyButton size="default" value={primary} variant="default">
					Copy link for device {index + 1}
				</CopyButton>
			</div>
			<code className="break-all text-muted-foreground text-xs">{primary}</code>
			{showFallback ? (
				<div className="flex flex-col gap-2 border-t pt-3">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<span className="text-muted-foreground">{fallbackLabel}</span>
						<CopyButton value={fallback} />
					</div>
					<code className="break-all text-muted-foreground text-xs">
						{fallback}
					</code>
				</div>
			) : (
				<button
					className="self-start text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
					type="button"
					onClick={() => setShowFallback(true)}
				>
					Link not working? Show a backup link
				</button>
			)}
		</div>
	);
}

function CredentialsStep({
	deviceCount,
	software,
	redo,
	onBack,
}: {
	deviceCount: number;
	software: Software;
	redo: boolean;
	onBack: () => void;
}) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [bundle, setBundle] = useState<SecretBundle | null>(null);
	const complete = useMutation(
		trpc.onboarding.complete.mutationOptions({
			onSuccess: async (result) => {
				setBundle(result);
				await queryClient.invalidateQueries();
			},
			onError: (error) => toast.error(error.message),
		}),
	);
	const info = SOFTWARE_INFO[software];

	if (!bundle) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Ready to create your stream links</CardTitle>
					<CardDescription>
						{deviceCount === 1 ? "One device" : `${deviceCount} devices`} ·{" "}
						{info.name}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<p className="text-muted-foreground">
						You'll get one link per device to paste into {info.name}, plus a
						ready-made file for OBS on your streaming PC.
					</p>
					{redo ? (
						<p className="border border-caution/40 bg-caution/10 p-3 text-caution">
							Legacy paths will receive independent device URLs. Existing linked
							devices keep their current URLs.
						</p>
					) : null}
					<div className="flex flex-wrap gap-2">
						<Button
							disabled={complete.isPending}
							onClick={() => complete.mutate({ deviceCount, software })}
						>
							{complete.isPending
								? "Creating links..."
								: "Create my stream links"}
						</Button>
						<Button variant="ghost" onClick={onBack}>
							<ArrowLeftIcon data-icon="inline-start" />
							Back
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	const publishUrls = bundle.urls.publish ?? [];

	return (
		<div className="flex flex-col gap-6">
			<div className="border p-4">
				<strong>Your device links are ready</strong>
				<p className="mt-1 text-muted-foreground">
					They stay hidden on the dashboard until you choose Reveal, and each
					device can be rotated independently.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{deviceCount === 1
							? "On your streaming device"
							: "On each streaming device"}
					</CardTitle>
					<CardDescription>
						{deviceCount === 1
							? "Paste this link into your app:"
							: "Each device gets its own link — don't share one link between two devices."}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<ol className="list-decimal pl-5 text-muted-foreground">
						{info.steps.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
					{publishUrls.slice(0, deviceCount).map((url, index) => (
						<DeviceLinkBlock
							key={url.slug}
							fallback={info.primary === "srt" ? url.rtmp : url.srt}
							fallbackLabel={
								info.primary === "srt"
									? "Backup link (RTMP — use if the main one won't connect)"
									: "Backup link (SRT — better for shaky networks, if your app supports it)"
							}
							index={index}
							primary={info.primary === "srt" ? url.srt : url.rtmp}
						/>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>On your streaming PC (OBS)</CardTitle>
					<CardDescription>
						Choose how you want to add your{" "}
						{deviceCount === 1 ? "feed" : "feeds"} to OBS.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<Card size="sm">
						<CardHeader>
							<CardTitle>By hand</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<ol className="list-decimal pl-5 text-muted-foreground">
								<li>In OBS, add a Media Source.</li>
								<li>Turn off the “Local File” checkbox.</li>
								<li>Paste the URL below. To "Input" field</li>
							</ol>
							{bundle.urls.read.slice(0, deviceCount).map((url, index) => (
								<div className="flex flex-col gap-2" key={url.slug}>
									<div className="flex items-center justify-between gap-2">
										<strong>
											{deviceCount === 1
												? "Media source URL"
												: `Device ${index + 1}`}
										</strong>
										<CopyButton value={url.srt} />
									</div>
									<code className="break-all text-muted-foreground text-xs">
										{url.srt}
									</code>
								</div>
							))}
						</CardContent>
					</Card>

					<Card size="sm">
						<CardHeader>
							<CardTitle>Download the scene file</CardTitle>
						</CardHeader>
						<CardContent className="flex h-full flex-col gap-4">
							<ol className="list-decimal pl-5 text-muted-foreground">
								<li>Download the file below.</li>
								<li>
									In OBS, open Scene Collection → Import and pick the downloaded
									file.
								</li>
								<li>
									Your {deviceCount === 1 ? "device shows" : "devices show"} up
									as ready-made scenes.
								</li>
							</ol>
							{bundle.sceneCollection ? (
								<Button
									className="mt-auto self-start"
									variant="secondary"
									onClick={() =>
										downloadSceneCollection(bundle.sceneCollection)
									}
								>
									<DownloadIcon data-icon="inline-start" />
									Download OBS scene file
								</Button>
							) : null}
						</CardContent>
					</Card>
				</CardContent>
			</Card>

			<Link className={`${buttonVariants()} self-start`} to="/dashboard">
				Go to my dashboard
			</Link>
		</div>
	);
}

function SetupWizard() {
	const { redo } = Route.useSearch();
	const [step, setStep] = useState(0);
	const [deviceCount, setDeviceCount] = useState(1);
	const [software, setSoftware] = useState<Software>("obs");

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
			<header className="flex flex-col gap-1">
				<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
					Step {step + 1} of 3
				</p>
				<h1 className="font-bold font-display text-3xl uppercase tracking-tight">
					Let's get you streaming
				</h1>
				<p className="text-muted-foreground">
					Three quick questions, then you get your stream links.
				</p>
			</header>
			{step === 0 ? (
				<DeviceStep
					onPick={(count) => {
						setDeviceCount(count);
						setStep(1);
					}}
				/>
			) : null}
			{step === 1 ? (
				<SoftwareStep
					onBack={() => setStep(0)}
					onPick={(picked) => {
						setSoftware(picked);
						setStep(2);
					}}
				/>
			) : null}
			{step === 2 ? (
				<CredentialsStep
					deviceCount={deviceCount}
					redo={redo}
					software={software}
					onBack={() => setStep(1)}
				/>
			) : null}
		</main>
	);
}
