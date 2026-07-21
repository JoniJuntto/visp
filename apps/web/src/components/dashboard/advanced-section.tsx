import { Collapsible } from "@astryxdesign/core/Collapsible";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import type { ReactNode } from "react";
import { DocsHelpLink } from "@/components/docs-help-link";
import type { AdvancedSectionId } from "./types";

export function AdvancedSection({
	id,
	value,
	tag,
	title,
	action,
	docsHref,
	docsLabel,
	children,
}: {
	id?: string;
	value: AdvancedSectionId;
	tag: string;
	title: string;
	action?: ReactNode;
	docsHref?: string;
	docsLabel?: string;
	children: ReactNode;
}) {
	return (
		<Collapsible
			defaultIsOpen={false}
			trigger={
				<VStack gap={0.5}>
					<Text color="secondary" id={id} type="supporting">
						{tag}
					</Text>
					<HStack gap={2} vAlign="center" wrap="wrap">
						<HStack gap={1.5} vAlign="center">
							<Text type="label">{title}</Text>
							{docsHref && docsLabel ? (
								<DocsHelpLink href={docsHref} label={docsLabel} />
							) : null}
						</HStack>
						{action}
					</HStack>
				</VStack>
			}
			value={value}
		>
			<VStack gap={4} paddingBlock={2}>
				{children}
			</VStack>
		</Collapsible>
	);
}
