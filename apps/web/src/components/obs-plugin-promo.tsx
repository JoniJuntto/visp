import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { List, ListItem } from "@astryxdesign/core/List";
import { Heading, Text } from "@astryxdesign/core/Text";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import { legalEntity } from "@/lib/legal";
import type { ObsPluginRelease } from "@/lib/obs-releases";

export function ObsPluginPromo({
	release,
	destinationLabel,
}: {
	release: ObsPluginRelease | null;
	destinationLabel: string;
}) {
	const docsUrl = `${legalEntity.docsUrl}/docs/obs-remote-control`;

	return (
		<Card>
			<VStack gap={3}>
				<VStack gap={1}>
					<Text color="secondary" type="supporting">
						Recommended
					</Text>
					<Heading level={3}>VISP OBS plugin</Heading>
					<Text color="secondary" type="supporting">
						Sign in from OBS in your browser, see your publishing devices, add a
						Media Source to the current scene in one click, and start/stop going
						live to {destinationLabel} — without pasting relay URLs by hand.
					</Text>
				</VStack>
				<List listStyle="decimal">
					<ListItem label="Install the VISP OBS plugin for your OS (beta)." />
					<ListItem label="In OBS, open Tools → VISP and sign in with Twitch or Kick in your browser." />
					<ListItem label='Approve the plugin, then use “Add to current scene” for your phone or other device.' />
					<ListItem label="Go live from OBS as usual — your provider stream key never enters VISP." />
				</List>
				<HStack gap={2} wrap="wrap">
					{release?.assets.length ? (
						release.assets.map((asset) => (
							<Button
								key={asset.platform}
								icon={<Icon color="inherit" icon={DownloadIcon} size="sm" />}
								label={asset.label}
								variant="primary"
								onClick={() =>
									window.open(asset.downloadUrl, "_blank", "noreferrer")
								}
							/>
						))
					) : (
						<Button
							icon={<Icon color="inherit" icon={DownloadIcon} size="sm" />}
							label="Download from GitHub Releases"
							variant="primary"
							onClick={() =>
								window.open(legalEntity.releasesUrl, "_blank", "noreferrer")
							}
						/>
					)}
					<Button
						icon={<Icon color="inherit" icon={ExternalLinkIcon} size="sm" />}
						label="Plugin docs"
						variant="secondary"
						onClick={() => window.open(docsUrl, "_blank", "noreferrer")}
					/>
					<Button
						icon={<Icon color="inherit" icon={ExternalLinkIcon} size="sm" />}
						label="All downloads"
						variant="ghost"
						onClick={() => window.location.assign("/download")}
					/>
				</HStack>
				{release ? (
					<Text color="secondary" type="supporting">
						Latest beta: {release.tagName}
					</Text>
				) : null}
			</VStack>
		</Card>
	);
}
