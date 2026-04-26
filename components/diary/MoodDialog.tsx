"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDiaryStore } from "@/lib/store/diary";
import { useUIStore } from "@/lib/store/ui";

export function MoodDialog() {
	const { isMoodDialogOpen, setIsMoodDialogOpen } = useUIStore();

	const { pendingStatus, statusNote, setStatusNote, addStatusCheck } =
		useDiaryStore();

	return (
		<Dialog open={isMoodDialogOpen} onOpenChange={setIsMoodDialogOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 capitalize">
						{pendingStatus === "mejor" && (
							<TrendingUp className="w-5 h-5 text-green-600" />
						)}
						{pendingStatus === "igual" && (
							<Minus className="w-5 h-5 text-yellow-600" />
						)}
						{pendingStatus === "peor" && (
							<TrendingDown className="w-5 h-5 text-red-600" />
						)}
						Te sientes {pendingStatus}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-2">
					<Label htmlFor="status-note">¿Por qué te sientes así?</Label>
					<Textarea
						id="status-note"
						placeholder="Explica brevemente la razón de este cambio..."
						value={statusNote}
						onChange={(e) => setStatusNote(e.target.value)}
						className="resize-none"
						rows={3}
					/>
				</div>
				<DialogFooter>
					<Button variant="ghost" onClick={() => setIsMoodDialogOpen(false)}>
						Cancelar
					</Button>
					<Button onClick={addStatusCheck}>Guardar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
