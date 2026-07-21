import type { ReactNode } from "react";

// Shared eyebrow: mono, tracked-out, muted — the lander's caption voice.
export const EYEBROW =
	"font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground";

// Page framing that carries the lander's language into the app: a mono
// eyebrow, a Barlow-Condensed uppercase title, and a hairline baseline.
export function PageHeader({
	eyebrow,
	title,
	subtitle,
	actions,
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
}) {
	return (
		<header className="flex flex-col gap-4 border-border border-b pb-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="flex max-w-xl flex-col gap-2">
					{eyebrow ? <span className={EYEBROW}>{eyebrow}</span> : null}
					<h1 className="font-display font-semibold text-4xl uppercase leading-none tracking-tight sm:text-5xl">
						{title}
					</h1>
					{subtitle ? (
						<p className="text-muted-foreground text-sm leading-relaxed">
							{subtitle}
						</p>
					) : null}
				</div>
				{actions ? <div className="shrink-0">{actions}</div> : null}
			</div>
		</header>
	);
}
