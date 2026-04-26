"use client";

import { Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
	title: string;
	description: string;
	onConfirm: () => void;
	children?: ReactNode;
}

export function ConfirmDialog({
	title,
	description,
	onConfirm,
	children,
}: ConfirmDialogProps) {
	const [open, setOpen] = useState(false);

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				{children || (
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
