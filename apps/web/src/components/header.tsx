import { Link } from "@tanstack/react-router";

import UserMenu from "./user-menu";

export default function Header() {
	return (
		<header className="border-b">
			<div className="flex flex-row items-center justify-between px-4 py-3">
				<nav className="flex items-center gap-6 text-sm">
					<Link to="/" className="flex flex-col gap-1">
						<span className="font-bold font-display text-base uppercase leading-none tracking-[0.3em]">
							VISP
						</span>
						<span aria-hidden className="smpte-bars h-0.5" />
					</Link>
					<Link
						to="/dashboard"
						className="text-muted-foreground hover:text-foreground"
					>
						Dashboard
					</Link>
				</nav>
				<div className="flex items-center gap-2">
					<UserMenu />
				</div>
			</div>
		</header>
	);
}
