"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDiaryStore } from "@/lib/store/diary";
import { useNoteStore } from "@/lib/store/note";
import { getDateKey } from "@/utils/date";

export function WritingArea() {
	const { currentDate, direction, noteContent, updateNote } = useDiaryStore();
	const {
		notes,
		activeNoteId,
		updateNote: updateNoteStore,
		updateNoteTitle,
	} = useNoteStore();

	const dateKey = getDateKey(currentDate);
	const content = noteContent[dateKey] || "";

	const activeNote = activeNoteId ? notes[activeNoteId] : null;

	if (activeNote) {
		return (
			<div className="flex-1 p-8 overflow-y-auto">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="h-full flex flex-col"
				>
					<input
						type="text"
						value={activeNote.title}
						onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
						className="bg-transparent border-none outline-none text-2xl font-semibold text-foreground placeholder:text-muted-foreground mb-4 p-0"
						placeholder="Título de la nota..."
					/>
					<textarea
						value={activeNote.content}
						onChange={(e) => updateNoteStore(activeNote.id, e.target.value)}
						placeholder="Escribe tu nota..."
						className="w-full flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg leading-relaxed p-0"
						style={{ fontFamily: "inherit" }}
					/>
				</motion.div>
			</div>
		);
	}

	return activeNoteId === null ? (
		<div className="flex-1 p-8 overflow-y-auto">
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={dateKey}
					initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
					transition={{ duration: 0.3 }}
					className="h-full"
				>
					<textarea
						value={content}
						onChange={(e) => updateNote(e.target.value)}
						placeholder="Escribe aquí tus pensamientos del día..."
						className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg leading-relaxed p-0"
						style={{ fontFamily: "inherit" }}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	) : null;
}
