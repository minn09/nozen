"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function ClientToaster() {
	const { theme = "system" } = useTheme();

	return (
		<SonnerToaster
			position="bottom-right"
			theme={theme as "light" | "dark" | "system"}
			className="[&>button]:right-2 [&>button]:left-auto"
		/>
	);
}
