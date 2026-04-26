"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<h2 className="text-2xl font-bold text-foreground">Error crítico</h2>
			<p className="text-muted-foreground">{error.message}</p>
			<Button onClick={reset}>Recargar</Button>
		</div>
	);
}
