import { AppShell } from "@astryxdesign/core/AppShell";
import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { Link as AstryxLink } from "@astryxdesign/core/Link";
import { Section } from "@astryxdesign/core/Section";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TopNav } from "@astryxdesign/core/TopNav";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	type ComponentProps,
	type CSSProperties,
	forwardRef,
	useEffect,
	useState,
} from "react";

import { authClient } from "@/lib/auth-client";
import { legalEntity } from "@/lib/legal";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [{ title: "VISP — streaming without the leash" }],
	}),
	component: HomeComponent,
});

// Adapter so astryx Link renders through the router for SPA navigation.
const RouterAnchor = forwardRef<HTMLAnchorElement, ComponentProps<"a">>(
	function RouterAnchor({ href = "", ...props }, ref) {
		return <Link ref={ref} to={href} {...props} />;
	},
);

const WORDS = [
	"the street.",
	"the venue.",
	"the crowd.",
	"the road.",
	"anywhere.",
] as const;
const GLYPHS = "#@$%&*+=<>/\\|~";

// Inline color only: the scrambled word inherits the display heading's
// size/weight, which no Text type reproduces.
const accentInline: CSSProperties = { color: "var(--color-text-accent)" };

function ScrambleWord() {
	const [word, setWord] = useState<string>(WORDS[WORDS.length - 1]);

	useEffect(() => {
		let wi = 0;
		let anim: ReturnType<typeof setInterval> | undefined;
		const tick = setInterval(() => {
			const target = WORDS[wi];
			wi = (wi + 1) % WORDS.length;
			let frame = 0;
			const total = 12;
			clearInterval(anim);
			anim = setInterval(() => {
				frame++;
				if (frame >= total) {
					clearInterval(anim);
					setWord(target);
					return;
				}
				const reveal = Math.floor((frame / total) * target.length);
				let out = target.slice(0, reveal);
				for (let i = reveal; i < target.length; i++) {
					out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
				}
				setWord(out);
			}, 45);
		}, 2600);
		return () => {
			clearInterval(tick);
			clearInterval(anim);
		};
	}, []);

	return <span style={accentInline}>{word}</span>;
}

const productShots = [
	{
		src: "/marketing/app-live.jpg",
		alt: "VISP app live on a phone — Stop control with OBS status",
	},
	{
		src: "/marketing/app-ready.jpg",
		alt: "VISP app ready to go live with Twitch chat overlay",
	},
	{
		src: "/marketing/app-camera-settings.jpg",
		alt: "VISP camera settings — resolution, frame rate, and relay",
	},
] as const;

// Image fill + corner radius: AspectRatio has no objectFit/radius props.
const shotImage: CSSProperties = {
	width: "100%",
	height: "100%",
	objectFit: "cover",
};
const shotClip: CSSProperties = {
	borderRadius: "var(--radius-container)",
	overflow: "hidden",
};

function ProductShots() {
	return (
		<Grid columns={{ minWidth: 160, repeat: "fit" }} gap={3}>
			{productShots.map((shot) => (
				<AspectRatio key={shot.src} ratio={9 / 16} style={shotClip}>
					<img
						alt={shot.alt}
						decoding="async"
						loading="lazy"
						src={shot.src}
						style={shotImage}
					/>
				</AspectRatio>
			))}
		</Grid>
	);
}

function SignalAnimation() {
	const uplink = "M 112 148 C 210 178, 270 178, 358 148";
	const branches = [
		"M 442 148 C 540 148, 560 70, 680 70",
		"M 442 156 C 520 156, 560 152, 680 152",
		"M 442 164 C 540 164, 560 234, 680 234",
	];
	const nodeYs = [70, 152, 234];
	const accent = "var(--color-accent)";
	const surface = "var(--color-background-surface)";
	const secondary = "var(--color-text-secondary)";
	return (
		<Section padding={6}>
			<svg
				aria-hidden="true"
				role="presentation"
				viewBox="0 0 800 270"
				style={{
					display: "block",
					margin: "0 auto",
					width: "100%",
					maxWidth: 900,
				}}
			>
				{/* phone */}
				<rect
					x="62"
					y="86"
					width="44"
					height="84"
					rx="10"
					fill={surface}
					stroke={accent}
					strokeOpacity="0.7"
					strokeWidth="2"
				/>
				<circle cx="84" cy="102" r="3" fill="#ff5c5c" className="tally-pulse" />
				<line
					x1="76"
					y1="160"
					x2="92"
					y2="160"
					stroke={accent}
					strokeOpacity="0.5"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				{[12, 22, 32].map((r, i) => (
					<path
						key={r}
						d={`M 104 ${86 - r} A ${r} ${r} 0 0 1 ${104 + r} 86`}
						fill="none"
						stroke={accent}
						strokeWidth="2"
						strokeLinecap="round"
						className="radio-arc"
						style={{ animationDelay: `${i * 0.35}s` }}
					/>
				))}

				{/* uplink */}
				<path
					d={uplink}
					fill="none"
					stroke={accent}
					strokeOpacity="0.15"
					strokeWidth="2"
				/>
				<path
					d={uplink}
					fill="none"
					stroke={accent}
					strokeWidth="3"
					strokeLinecap="round"
					className="flow-line"
				/>

				{/* home studio */}
				<polyline
					points="358,134 400,102 442,134"
					fill="none"
					stroke={accent}
					strokeOpacity="0.7"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				<rect
					x="364"
					y="134"
					width="72"
					height="52"
					fill={surface}
					stroke={accent}
					strokeOpacity="0.7"
					strokeWidth="2"
				/>
				<rect
					x="386"
					y="148"
					width="28"
					height="18"
					rx="2"
					fill="none"
					stroke={accent}
					strokeOpacity="0.5"
					strokeWidth="2"
				/>

				{/* fan-out to platforms */}
				{branches.map((d, i) => (
					<g key={d}>
						<path
							d={d}
							fill="none"
							stroke={accent}
							strokeOpacity="0.15"
							strokeWidth="2"
						/>
						<path
							d={d}
							fill="none"
							stroke={accent}
							strokeWidth="3"
							strokeLinecap="round"
							className="flow-line"
							style={{ animationDelay: `${i * 0.25}s` }}
						/>
					</g>
				))}
				{nodeYs.map((y, i) => (
					<g key={y}>
						<circle
							cx="690"
							cy={y}
							r="6"
							fill={surface}
							stroke={accent}
							strokeWidth="2"
						/>
						<circle
							cx="690"
							cy={y}
							r="2.5"
							fill={accent}
							className="tally-pulse"
							style={{ animationDelay: `${i * 0.5}s` }}
						/>
					</g>
				))}

				{/* labels */}
				<text x="84" y="198" textAnchor="middle" fill={secondary} fontSize="13">
					phone
				</text>
				<text
					x="400"
					y="212"
					textAnchor="middle"
					fill={secondary}
					fontSize="13"
				>
					home studio
				</text>
				<text
					x="690"
					y="262"
					textAnchor="middle"
					fill={secondary}
					fontSize="13"
				>
					everywhere.
				</text>
			</svg>
		</Section>
	);
}

function TryCta({ size = "md" }: { size?: "md" | "lg" }) {
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();
	return (
		<Button
			label="Try VISP free"
			size={size}
			variant="primary"
			onClick={() => navigate({ to: session ? "/dashboard" : "/login" })}
		/>
	);
}

const bentoCards = [
	{
		title: "their studio, untouched",
		body: "scenes, alerts, graphics, and years of muscle memory keep working. nothing to rebuild — VISP plugs into the OBS setup you already have. the OBS plugin is live in beta.",
	},
	{
		title: "two cameras, one stream",
		body: "run multiple phone cameras — each with its own mic — feeding the same broadcast. a second phone becomes a real scene, not a video-call window.",
	},
	{
		title: "streams that survive",
		body: "a short signal drop doesn't end the broadcast — the home studio keeps the show alive.",
	},
	{
		title: "keys that stay home",
		body: "every camera gets its own private access you can revoke anytime. your broadcast key never enters VISP.",
	},
];

const footerLinks = [
	{ label: "Docs", href: legalEntity.docsUrl, external: true },
	{ label: "Download", href: "/download", external: false },
	{ label: "GitHub", href: legalEntity.sourceUrl, external: true },
	{ label: "Privacy", href: "/privacy", external: false },
	{ label: "Contact", href: "/contact", external: false },
	{ label: "Terms", href: "/terms", external: false },
	{ label: "Cookies", href: "/cookies", external: false },
];

function HomeComponent() {
	return (
		<AppShell
			contentPadding={4}
			height="auto"
			topNav={
				<TopNav
					heading={
						<img alt="VISP" src="/visp-logo.png" style={{ height: 36 }} />
					}
					label="Main"
					endContent={
						<HStack gap={4} vAlign="center">
							<AstryxLink
								href={legalEntity.docsUrl}
								isExternalLink
								isStandalone
							>
								Docs
							</AstryxLink>
							<AstryxLink as={RouterAnchor} href="/download" isStandalone>
								Download
							</AstryxLink>
							<AstryxLink
								href={legalEntity.sourceUrl}
								isExternalLink
								isStandalone
							>
								GitHub
							</AstryxLink>
							<AstryxLink as={RouterAnchor} href="/contact" isStandalone>
								Contact
							</AstryxLink>
							<TryCta />
						</HStack>
					}
				/>
			}
		>
			<VStack gap={10} paddingBlock={8}>
				<Center axis="horizontal">
					<VStack gap={6} hAlign="center" maxWidth={820}>
						<VStack gap={3} hAlign="center">
							<Heading
								justify="center"
								level={1}
								textWrap="balance"
								type="display-1"
							>
								go live from <ScrambleWord />
							</Heading>
							<Text
								color="secondary"
								justify="center"
								textWrap="balance"
								type="large"
							>
								Run multiple phone cams with their own mics, pull a friend onto
								the stream, and keep broadcasting when the signal dips.
							</Text>
							<Text
								justify="center"
								textWrap="balance"
								type="large"
								weight="semibold"
							>
								Full production. Zero leash.
							</Text>
						</VStack>
						<VStack gap={2} hAlign="center">
							<TryCta size="lg" />
							<Text color="secondary" type="supporting">
								free while in beta · no credit card required
							</Text>
						</VStack>
					</VStack>
				</Center>

				<SignalAnimation />

				<Center axis="horizontal">
					<VStack gap={6} maxWidth={1080} width="100%">
						<Heading
							justify="center"
							level={2}
							textWrap="balance"
							type="display-3"
						>
							not for everyone. for creators who want…
						</Heading>
						<Card>
							<VStack gap={3}>
								<Heading level={3}>the whole show, from a phone</Heading>
								<Text color="secondary" textWrap="pretty">
									the VISP app — or the camera app you already love — becomes a
									proper camera for your full production. not a smaller
									substitute for it.
								</Text>
								<ProductShots />
							</VStack>
						</Card>
						<Grid columns={{ minWidth: 260, repeat: "fit" }} gap={3}>
							{bentoCards.map((card) => (
								<Card key={card.title}>
									<VStack gap={2}>
										<Heading level={3}>{card.title}</Heading>
										<Text color="secondary" textWrap="pretty">
											{card.body}
										</Text>
									</VStack>
								</Card>
							))}
						</Grid>
					</VStack>
				</Center>

				<Divider />

				<VStack gap={4} hAlign="center" paddingBlock={8}>
					<Heading justify="center" level={2} type="display-2">
						join the beta
					</Heading>
					<Text justify="center" type="display-2" weight="bold">
						<span style={accentInline}>it's free</span>
					</Text>
					<TryCta size="lg" />
					<Text color="secondary" justify="center" type="supporting">
						no credit card required · setup takes three questions, not three
						weekends
					</Text>
					<Text
						color="secondary"
						justify="center"
						textWrap="balance"
						type="supporting"
					>
						Phone apps, browser publisher, and OBS plugin — see{" "}
						<AstryxLink as={RouterAnchor} href="/download">
							Download &amp; beta
						</AstryxLink>
						. You do not need to self-host to try the hosted beta.
					</Text>
				</VStack>

				<Divider />

				<VStack gap={3} hAlign="center">
					<HStack gap={3} hAlign="center" wrap="wrap">
						{footerLinks.map((item) =>
							item.external ? (
								<AstryxLink
									href={item.href}
									isExternalLink
									isStandalone
									key={item.label}
								>
									{item.label}
								</AstryxLink>
							) : (
								<AstryxLink
									as={RouterAnchor}
									href={item.href}
									isStandalone
									key={item.label}
								>
									{item.label}
								</AstryxLink>
							),
						)}
					</HStack>
					<Text color="secondary" justify="center" type="supporting">
						© 2026 VISP · Pöhinä Group Oy · phone is the camera. home is the
						studio.
					</Text>
				</VStack>
			</VStack>
		</AppShell>
	);
}
