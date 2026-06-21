"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { DateNavigation } from "@/components/diary/DateNavigation";
import { LeftSidebar } from "@/components/diary/LeftSidebar";
import { MoodDialog } from "@/components/diary/MoodDialog";
import { RightSidebar } from "@/components/diary/RightSidebar";
import { WritingArea } from "@/components/diary/WritingArea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDiaryStore } from "@/store/diary";
import { useUIStore } from "@/store/ui";

export default function AgendaPage() {
	const isMobile = useMediaQuery("(max-width: 768px)");

	const {
		leftSidebarOpen,
		rightSidebarOpen,
		zenMode,
		setLeftSidebarOpen,
		setRightSidebarOpen,
		setIsMobile,
	} = useUIStore();

	const {
		loadFromStorage,
		saveMetadataToStorage,
		saveNotesToStorage,
		navigateDay,
		metadata,
		noteContent,
	} = useDiaryStore();

	useEffect(() => {
		setIsMobile(isMobile);
	}, [isMobile, setIsMobile]);

	useEffect(() => {
		loadFromStorage();
	}, [loadFromStorage]);

	useEffect(() => {
		saveMetadataToStorage();
	}, [metadata, saveMetadataToStorage]);

	useEffect(() => {
		saveNotesToStorage();
	}, [noteContent, saveNotesToStorage]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (
				document.activeElement instanceof HTMLTextAreaElement ||
				document.activeElement instanceof HTMLInputElement
			) {
				return;
			}

			if (e.key === "ArrowLeft") {
				navigateDay(-1);
			} else if (e.key === "ArrowRight") {
				navigateDay(1);
			} else if (e.key.toLowerCase() === "t") {
				useDiaryStore.getState().setCurrentDate(new Date());
			} else if (e.key.toLowerCase() === "z") {
				useUIStore.getState().toggleZenMode();
			}
		},
		[navigateDay],
	);

	// Sincronizar zen mode con el body para que el Header reaccione
	useEffect(() => {
		document.body.dataset.zenMode = zenMode ? "true" : undefined;
		return () => {
			delete document.body.dataset.zenMode;
		};
	}, [zenMode]);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<div
			className="flex w-full h-screen overflow-hidden bg-background"
			data-zen-mode={zenMode || undefined}
		>
			<AnimatePresence initial={false}>
				{leftSidebarOpen && !zenMode && (
					<>
						<LeftSidebar />
						{isMobile && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setLeftSidebarOpen(false)}
								className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
							/>
						)}
					</>
				)}
			</AnimatePresence>

			<main className="flex-1 flex flex-col relative min-w-0">
				<DateNavigation />
				<WritingArea />
			</main>

			<AnimatePresence initial={false}>
				{rightSidebarOpen && !zenMode && (
					<>
						<RightSidebar />
						{isMobile && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setRightSidebarOpen(false)}
								className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
							/>
						)}
					</>
				)}
			</AnimatePresence>

			<MoodDialog />
		</div>
	);
}
