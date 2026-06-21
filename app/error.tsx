"use client";

import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

function classifyError(message: string): {
	type: string;
	variant: "build" | "runtime" | "network";
} {
	if (
		/module not found|can't resolve|failed to compile|build error/i.test(
			message,
		)
	)
		return { type: "Build Error", variant: "build" };
	if (/network|fetch|request|timeout|abort|connection/i.test(message))
		return { type: "Network Error", variant: "network" };
	return { type: "Runtime Error", variant: "runtime" };
}

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [showStack, setShowStack] = useState(false);

	useEffect(() => {
		console.error(error);
	}, [error]);

	const { type, variant } = classifyError(error.message);

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			<div className="max-w-2xl w-full space-y-6">
				{/* Header */}
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"size-10 rounded-full flex items-center justify-center",
							variant === "build" && "bg-red-500/10 text-red-500",
							variant === "runtime" && "bg-amber-500/10 text-amber-500",
							variant === "network" && "bg-blue-500/10 text-blue-500",
						)}
					>
						{variant === "build" ? (
							<XCircle className="size-5" />
						) : (
							<AlertTriangle className="size-5" />
						)}
					</div>
					<div>
						<p
							className={cn(
								"text-xs font-semibold uppercase tracking-wider",
								variant === "build" && "text-red-500",
								variant === "runtime" && "text-amber-500",
								variant === "network" && "text-blue-500",
							)}
						>
							{type}
						</p>
						<h2 className="text-lg font-bold text-foreground">
							Algo salió mal
						</h2>
					</div>
				</div>

				{/* Error Message */}
				<div className="rounded-lg border border-border bg-muted/50 p-4">
					<pre className="text-sm text-foreground whitespace-pre-wrap break-all font-mono leading-relaxed">
						{error.message}
					</pre>
					{error.digest && (
						<p className="mt-2 text-xs text-muted-foreground font-mono">
							digest: {error.digest}
						</p>
					)}
				</div>

				{/* Stack Trace */}
				{error.stack && (
					<div className="space-y-2">
						<button
							type="button"
							onClick={() => setShowStack((v) => !v)}
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{showStack ? "Ocultar" : "Mostrar"} stack trace
						</button>
						{showStack && (
							<pre className="rounded-lg border border-border bg-muted/50 p-4 text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
								{error.stack}
							</pre>
						)}
					</div>
				)}

				{/* Actions */}
				<div className="flex items-center gap-3">
					<Button onClick={reset}>
						<RefreshCw className="size-4 mr-2" />
						Intentar de nuevo
					</Button>
				</div>
			</div>
		</div>
	);
}
