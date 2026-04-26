"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", label: "Diario" },
	{ href: "/lists", label: "Listas" },
	{ href: "/tasks", label: "Tareas" },
	{ href: "/projects", label: "Proyectos" },
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className="border-b">
			<nav className="flex items-center gap-1 p-2">
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
			</nav>
		</header>
	);
}
