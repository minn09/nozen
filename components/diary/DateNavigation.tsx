"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Focus,
	PanelLeftOpen,
	PanelRightOpen,
	Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDiaryStore } from "@/store/diary";
import { useNoteStore } from "@/store/note";
import { useUIStore } from "@/store/ui";
import { cn } from "@/utils";
import { formatSpanishDate, getDateKey } from "@/utils/date";

export function DateNavigation() {
	const { currentDate, direction, navigateDay } = useDiaryStore();

	const {
		leftSidebarOpen,
		rightSidebarOpen,
		zenMode,
		serifMode,
		toggleSerifMode,
		setLeftSidebarOpen,
		setRightSidebarOpen,
	} = useUIStore();

	const { activeNoteId, setActiveNote, notes } = useNoteStore();

	const dateKey = getDateKey(currentDate);
	const activeNote = activeNoteId ? notes[activeNoteId] : null;

	const handleBackToDiary = () => {
		useDiaryStore.getState().setCurrentDate(new Date());
		setActiveNote(null);
	};

	return (
		<header
			className={cn(
				"border-b border-border px-4 py-4 flex items-center justify-between shrink-0 gap-4 transition-all duration-300",
				zenMode && "border-transparent bg-background/80 backdrop-blur-sm",
			)}
		>
			<div className="flex items-center gap-2">
				{!zenMode && !leftSidebarOpen && (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setLeftSidebarOpen(true)}
						className="text-foreground hover:bg-accent"
						aria-label="Abrir menú lateral"
					>
						<PanelLeftOpen className="w-5 h-5" />
					</Button>
				)}
				{activeNote ? (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleBackToDiary}
						className="text-foreground hover:bg-accent"
						aria-label="Volver al diario"
					>
						<ArrowLeft className="w-5 h-5" />
					</Button>
				) : (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigateDay(-1)}
						className={cn(
							"text-foreground hover:bg-accent transition-opacity",
							zenMode && "opacity-60 hover:opacity-100",
						)}
						aria-label="Día anterior"
					>
						<ChevronLeft className="w-5 h-5" />
					</Button>
				)}
			</div>

			<div className="flex items-center gap-3">
				{zenMode && (
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-xs text-muted-foreground/50 flex items-center gap-1.5"
					>
						<Focus className="w-3 h-3" />
						Zen
					</motion.span>
				)}
				<AnimatePresence mode="wait" initial={false}>
					{activeNote ? (
						<motion.h2
							key="note-title"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className={cn(
								"text-xl font-medium text-foreground truncate max-w-[300px] transition-all",
								zenMode && "text-2xl",
							)}
						>
							{activeNote.title}
						</motion.h2>
					) : (
						<motion.h2
							key={dateKey}
							initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
							transition={{ duration: 0.2 }}
							className={cn(
								"text-xl font-medium text-foreground capitalize transition-all",
								zenMode && "text-2xl",
							)}
						>
							{formatSpanishDate(currentDate)}
						</motion.h2>
					)}
				</AnimatePresence>
			</div>

			<div className="flex items-center gap-2">
				{activeNote ? (
					<div className={zenMode ? "w-6" : "w-9"} />
				) : (
					<>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigateDay(1)}
							className={cn(
								"text-foreground hover:bg-accent transition-opacity",
								zenMode && "opacity-60 hover:opacity-100",
							)}
							aria-label="Día siguiente"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
						{zenMode ? (
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleSerifMode}
								className={cn(
									"transition-all",
									serifMode
										? "text-primary bg-primary/10"
										: "text-muted-foreground/50 hover:text-foreground",
								)}
								aria-label="Alternar fuente serif"
								title={serifMode ? "Fuente sans-serif" : "Fuente serif"}
							>
								<Pencil className="w-4 h-4" />
							</Button>
						) : !rightSidebarOpen ? (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setRightSidebarOpen(true)}
								className="text-foreground hover:bg-accent"
								aria-label="Abrir panel de detalles"
							>
								<PanelRightOpen className="w-5 h-5" />
							</Button>
						) : null}
					</>
				)}
			</div>
		</header>
	);
}
