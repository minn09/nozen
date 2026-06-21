"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useDiaryStore } from "@/store/diary";
import { useNoteStore } from "@/store/note";
import { useUIStore } from "@/store/ui";
import { cn } from "@/utils";
import { getDateKey } from "@/utils/date";

function countWords(text: string): number {
	return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function WordCount({ text, visible }: { text: string; visible: boolean }) {
	const words = useMemo(() => countWords(text), [text]);

	if (!visible) return null;

	return (
		<motion.p
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="text-xs text-muted-foreground/40 select-none pointer-events-none"
		>
			{words} {words === 1 ? "palabra" : "palabras"}
		</motion.p>
	);
}

function ZenTextarea({
	value,
	onChange,
	placeholder,
	zenMode,
}: {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder: string;
	zenMode: boolean;
}) {
	return (
		<textarea
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={cn(
				"w-full flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground p-0 transition-all duration-300",
				zenMode
					? "text-2xl leading-[2] max-w-3xl mx-auto focus:text-foreground"
					: "text-lg leading-relaxed",
			)}
			style={{ fontFamily: "inherit" }}
		/>
	);
}

export function WritingArea() {
	const { currentDate, direction, noteContent, updateNote } = useDiaryStore();
	const {
		notes,
		activeNoteId,
		updateNote: updateNoteStore,
		updateNoteTitle,
	} = useNoteStore();
	const { zenMode } = useUIStore();

	const dateKey = getDateKey(currentDate);
	const content = noteContent[dateKey] || "";

	const activeNote = activeNoteId ? notes[activeNoteId] : null;

	if (activeNote) {
		return (
			<div
				className={cn(
					"flex-1 overflow-y-auto transition-all duration-300",
					zenMode ? "p-12 flex items-start justify-center" : "p-8",
				)}
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className={cn(
						"h-full flex flex-col",
						zenMode && "w-full max-w-3xl mx-auto",
					)}
				>
					<input
						type="text"
						value={activeNote.title}
						onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
						className={cn(
							"bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground mb-6 p-0 transition-all duration-300",
							zenMode
								? "text-3xl font-light text-center"
								: "text-2xl font-semibold",
						)}
						placeholder="Título de la nota..."
					/>
					<div className="flex-1 flex flex-col gap-4">
						<ZenTextarea
							value={activeNote.content}
							onChange={(e) => updateNoteStore(activeNote.id, e.target.value)}
							placeholder="Escribe tu nota..."
							zenMode={zenMode}
						/>
						<div
							className={cn("flex", zenMode ? "justify-center" : "justify-end")}
						>
							<WordCount text={activeNote.content} visible={zenMode} />
						</div>
					</div>
				</motion.div>
			</div>
		);
	}

	return activeNoteId === null ? (
		<div
			className={cn(
				"flex-1 overflow-y-auto transition-all duration-300",
				zenMode ? "p-12 flex items-start justify-center" : "p-8",
			)}
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={dateKey}
					initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
					transition={{ duration: 0.3 }}
					className={cn(
						"h-full flex flex-col gap-4",
						zenMode && "w-full max-w-3xl mx-auto",
					)}
				>
					<ZenTextarea
						value={content}
						onChange={(e) => updateNote(e.target.value)}
						placeholder="Escribe aquí tus pensamientos del día..."
						zenMode={zenMode}
					/>
					<div
						className={cn("flex", zenMode ? "justify-center" : "justify-end")}
					>
						<WordCount text={content} visible={zenMode} />
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	) : null;
}
