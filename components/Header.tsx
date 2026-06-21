"use client";

import { Focus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui";
import { cn } from "@/utils";

const navItems = [
	{ href: "/", label: "Diario" },
	{ href: "/tasks", label: "Tareas" },
];

function ZenToggle() {
	const { zenMode, toggleZenMode } = useUIStore();

	return (
		<button
			type="button"
			onClick={toggleZenMode}
			className={cn(
				"px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
				zenMode
					? "bg-primary text-primary-foreground shadow-sm"
					: "text-muted-foreground hover:text-foreground hover:bg-muted",
			)}
			title={zenMode ? "Salir del modo zen" : "Modo zen"}
		>
			<Focus
				className={cn(
					"w-4 h-4 transition-transform duration-300",
					zenMode && "scale-110",
				)}
			/>
		</button>
	);
}

export function Header() {
	const pathname = usePathname();

	return (
		<header id="layout-header" className="border-b">
			<nav className="flex items-center justify-between p-2">
				<div className="flex items-center gap-1">
					{navItems.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/" && pathname.startsWith(item.href));

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"px-4 py-2 rounded-md text-sm font-medium transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted",
								)}
							>
								{item.label}
							</Link>
						);
					})}
				</div>
				<div className="flex items-center gap-1">
					<ZenToggle />
					<Link
						href="/settings"
						className={cn(
							"px-3 py-2 rounded-md text-sm font-medium transition-colors",
							pathname === "/settings"
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground hover:bg-muted",
						)}
					>
						<Settings className="w-4 h-4" />
					</Link>
				</div>
			</nav>
		</header>
	);
}
