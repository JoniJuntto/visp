import type { AppRouter } from "@VISP/api/routers/index";
import { env } from "@VISP/env/web";
import { Bubble, BubbleContent } from "@VISP/ui/components/bubble";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@VISP/ui/components/input-group";
import { Message, MessageContent } from "@VISP/ui/components/message";
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "@VISP/ui/components/message-scroller";
import { useChat } from "@ai-sdk/react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { Collapsible } from "@astryxdesign/core/Collapsible";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { List, ListItem } from "@astryxdesign/core/List";
import { Heading, Text } from "@astryxdesign/core/Text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import type { inferRouterOutputs } from "@trpc/server";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
	ArrowLeftIcon,
	DownloadIcon,
	RotateCcwIcon,
	SendIcon,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import {
	downloadSceneCollection,
	RevealedValue,
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

const SEPPO_MESSAGES: UIMessage[] = [
	{
		id: "seppo-welcome",
		role: "assistant",
		parts: [
			{
				type: "text",
				text: "Hi, I'm Seppo. Tell me what you want to stream and what gear or apps you already have, and I'll help you choose the simplest setup.",
			},
		],
	},
];

const seppoTransport = new DefaultChatTransport({
	api: import.meta.env.PROD
		? "/api/setup-assistant"
		: new URL("/api/setup-assistant", env.VITE_SERVER_URL).toString(),
	credentials: "include",
});

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
		<ClickableCard label={title} onClick={onClick}>
			<VStack gap={1}>
				<Text type="label">{title}</Text>
				<Text color="secondary" type="supporting">
					{description}
				</Text>
			</VStack>
		</ClickableCard>
	);
}

function BackButton({ onBack }: { onBack: () => void }) {
	return (
		<Button
			icon={<Icon color="inherit" icon={ArrowLeftIcon} size="sm" />}
			label="Back"
			variant="ghost"
			onClick={onBack}
		/>
	);
}

function StepIntro({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<VStack gap={1}>
			<Heading level={2}>{title}</Heading>
			<Text color="secondary">{description}</Text>
		</VStack>
	);
}

function DeviceStep({
	onPick,
	onTalkToSeppo,
}: {
	onPick: (count: number) => void;
	onTalkToSeppo: () => void;
}) {
	const [pickingCount, setPickingCount] = useState(false);

	return (
		<VStack gap={4}>
			<StepIntro
				description="A device is anything that sends video — a phone, a camera rig, a laptop. You can add more later."
				title="How many devices will stream at the same time?"
			/>
			<OptionCard
				description="One phone or one computer sends the video."
				title="Just one device"
				onClick={() => onPick(1)}
			/>
			{pickingCount ? (
				<Card variant="muted">
					<VStack gap={2}>
						<Text type="label">How many?</Text>
						<HStack gap={2} wrap="wrap">
							{[2, 3, 4].map((count) => (
								<Button
									key={count}
									label={`${count} devices`}
									onClick={() => onPick(count)}
								/>
							))}
						</HStack>
					</VStack>
				</Card>
			) : (
				<OptionCard
					description="For example a main phone plus a backup phone or second angle."
					title="Multiple at the same time"
					onClick={() => setPickingCount(true)}
				/>
			)}
			<OptionCard
				description="Chat about your devices, streaming app, or any other setup question."
				title="Not sure, talk with Seppo"
				onClick={onTalkToSeppo}
			/>
		</VStack>
	);
}

function SeppoChat({ onBack }: { onBack: () => void }) {
	const [input, setInput] = useState("");
	const { clearError, error, messages, regenerate, sendMessage, status } =
		useChat({ messages: SEPPO_MESSAGES, transport: seppoTransport });
	const isPending = status === "submitted" || status === "streaming";

	function submit(event: FormEvent) {
		event.preventDefault();
		const text = input.trim();
		if (!text || isPending) return;
		clearError();
		setInput("");
		void sendMessage({ text });
	}

	return (
		<VStack gap={4}>
			<StepIntro
				description="Ask about devices, streaming apps, OBS, or what happens next."
				title="Talk with Seppo"
			/>
			<div
				className="h-[min(60vh,32rem)] min-h-80 border bg-card"
				aria-live="polite"
			>
				<MessageScrollerProvider>
					<MessageScroller>
						<MessageScrollerViewport>
							<MessageScrollerContent className="p-4">
								{messages.map((message) => (
									<MessageScrollerItem key={message.id}>
										<Message align={message.role === "user" ? "end" : "start"}>
											<MessageContent>
												{message.parts.map((part, index) =>
													part.type === "text" ? (
														<Bubble
															key={`${message.id}-${index}`}
															align={message.role === "user" ? "end" : "start"}
															variant={
																message.role === "user" ? "default" : "muted"
															}
														>
															<BubbleContent className="whitespace-pre-wrap">
																{part.text}
															</BubbleContent>
														</Bubble>
													) : null,
												)}
											</MessageContent>
										</Message>
									</MessageScrollerItem>
								))}
								{status === "submitted" ? (
									<MessageScrollerItem>
										<Message>
											<MessageContent>
												<Bubble variant="muted">
													<BubbleContent>Thinking…</BubbleContent>
												</Bubble>
											</MessageContent>
										</Message>
									</MessageScrollerItem>
								) : null}
							</MessageScrollerContent>
						</MessageScrollerViewport>
						<MessageScrollerButton />
					</MessageScroller>
				</MessageScrollerProvider>
			</div>
			{error ? (
				<Banner
					description="The assistant could not respond. You can retry without losing this conversation."
					status="error"
					title="Seppo is unavailable right now"
				/>
			) : null}
			<form onSubmit={submit}>
				<InputGroup>
					<InputGroupTextarea
						aria-label="Message Seppo"
						disabled={isPending}
						maxLength={2_000}
						placeholder="Describe your streaming setup…"
						rows={2}
						value={input}
						onChange={(event) => setInput(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && !event.shiftKey) submit(event);
						}}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							aria-label="Send message"
							disabled={!input.trim() || isPending}
							size="icon-sm"
							type="submit"
						>
							<SendIcon />
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</form>
			<HStack gap={2} wrap="wrap">
				<BackButton onBack={onBack} />
				{error ? (
					<Button
						icon={<Icon color="inherit" icon={RotateCcwIcon} size="sm" />}
						label="Retry"
						onClick={() => {
							clearError();
							void regenerate();
						}}
					/>
				) : null}
			</HStack>
		</VStack>
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
		<VStack gap={4}>
			<StepIntro
				description="We'll tailor the instructions to your app."
				title="Which app will you stream with?"
			/>
			{(Object.keys(SOFTWARE_INFO) as Software[]).map((value) => (
				<OptionCard
					key={value}
					description={SOFTWARE_INFO[value].description}
					title={SOFTWARE_INFO[value].name}
					onClick={() => onPick(value)}
				/>
			))}
			<HStack>
				<BackButton onBack={onBack} />
			</HStack>
		</VStack>
	);
}

function NumberedSteps({ steps }: { steps: string[] }) {
	return (
		<List listStyle="decimal">
			{steps.map((step) => (
				<ListItem key={step} label={step} />
			))}
		</List>
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
	return (
		<VStack gap={2}>
			<RevealedValue label={`Device ${index + 1}`} value={primary} />
			<Collapsible
				defaultIsOpen={false}
				trigger={
					<Text color="secondary" type="supporting">
						Link not working? Show a backup link
					</Text>
				}
			>
				<RevealedValue label={fallbackLabel} value={fallback} />
			</Collapsible>
		</VStack>
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
	const navigate = useNavigate();
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
			<VStack gap={4}>
				<StepIntro
					description={`${deviceCount === 1 ? "One device" : `${deviceCount} devices`} · ${info.name}`}
					title="Ready to create your stream links"
				/>
				<Text color="secondary">
					You'll get one link per device to paste into {info.name}, plus a
					ready-made file for OBS on your streaming PC.
				</Text>
				{redo ? (
					<Banner
						status="warning"
						title="Legacy paths will receive independent device URLs."
						description="Existing linked devices keep their current URLs."
					/>
				) : null}
				<HStack gap={2} wrap="wrap">
					<Button
						isLoading={complete.isPending}
						label="Create my stream links"
						variant="primary"
						onClick={() => complete.mutate({ deviceCount, software })}
					/>
					<BackButton onBack={onBack} />
				</HStack>
			</VStack>
		);
	}

	const publishUrls = bundle.urls.publish ?? [];

	return (
		<VStack gap={6}>
			<Banner
				description="They stay hidden on the dashboard until you choose Reveal, and each device can be rotated independently."
				status="success"
				title="Your device links are ready"
			/>

			<VStack gap={3}>
				<StepIntro
					description={
						deviceCount === 1
							? "Paste this link into your app:"
							: "Each device gets its own link — don't share one link between two devices."
					}
					title={
						deviceCount === 1
							? "On your streaming device"
							: "On each streaming device"
					}
				/>
				<NumberedSteps steps={info.steps} />
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
			</VStack>

			<VStack gap={3}>
				<StepIntro
					description={`Choose how you want to add your ${deviceCount === 1 ? "feed" : "feeds"} to OBS.`}
					title="On your streaming PC (OBS)"
				/>
				<Grid columns={{ minWidth: 280, repeat: "fit" }} gap={3}>
					<Card>
						<VStack gap={3}>
							<Heading level={3}>By hand</Heading>
							<NumberedSteps
								steps={[
									"In OBS, add a Media Source.",
									"Turn off the “Local File” checkbox.",
									'Paste the URL below into the "Input" field.',
								]}
							/>
							{bundle.urls.read.slice(0, deviceCount).map((url, index) => (
								<RevealedValue
									key={url.slug}
									label={
										deviceCount === 1
											? "Media source URL"
											: `Device ${index + 1}`
									}
									value={url.srt}
								/>
							))}
						</VStack>
					</Card>

					<Card>
						<VStack gap={3}>
							<Heading level={3}>Download the scene file</Heading>
							<NumberedSteps
								steps={[
									"Download the file below.",
									"In OBS, open Scene Collection → Import and pick the downloaded file.",
									`Your ${deviceCount === 1 ? "device shows" : "devices show"} up as ready-made scenes.`,
								]}
							/>
							{bundle.sceneCollection ? (
								<HStack>
									<Button
										icon={
											<Icon color="inherit" icon={DownloadIcon} size="sm" />
										}
										label="Download OBS scene file"
										onClick={() =>
											downloadSceneCollection(bundle.sceneCollection)
										}
									/>
								</HStack>
							) : null}
						</VStack>
					</Card>
				</Grid>
			</VStack>

			<HStack>
				<Button
					label="Go to my dashboard"
					variant="primary"
					onClick={() => navigate({ to: "/dashboard" })}
				/>
			</HStack>
		</VStack>
	);
}

function SetupWizard() {
	const { redo } = Route.useSearch();
	const [step, setStep] = useState(0);
	const [talkingToSeppo, setTalkingToSeppo] = useState(false);
	const [deviceCount, setDeviceCount] = useState(1);
	const [software, setSoftware] = useState<Software>("obs");

	return (
		<Center axis="horizontal">
			<VStack gap={6} maxWidth={680} padding={4} width="100%">
				<VStack gap={1}>
					<Text color="secondary" type="supporting">
						Step {step + 1} of 3
					</Text>
					<Heading level={1}>Let's get you streaming</Heading>
					<Text color="secondary">
						Three quick questions, then you get your stream links.
					</Text>
				</VStack>
				{step === 0 && talkingToSeppo ? (
					<SeppoChat onBack={() => setTalkingToSeppo(false)} />
				) : null}
				{step === 0 && !talkingToSeppo ? (
					<DeviceStep
						onPick={(count) => {
							setDeviceCount(count);
							setStep(1);
						}}
						onTalkToSeppo={() => setTalkingToSeppo(true)}
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
			</VStack>
		</Center>
	);
}
