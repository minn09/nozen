"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Calendar,
	ChevronDown,
	ChevronUp,
	Download,
	File,
	PanelLeftClose,
	Plus,
	TestTube,
	Trash2,
	Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { exportToJson, exportToTxtFile } from "@/services/export";
import { importFromJson } from "@/services/import";
import { useDiaryStore } from "@/store/diary";
import { useNoteStore } from "@/store/note";
import { useStandaloneTasksStore } from "@/store/standalone-tasks";
import { useUIStore } from "@/store/ui";
import { useUserPreferencesStore } from "@/store/user-preferences";
import type { Note } from "@/types/note";
import { StreakCalendar } from "./StreakCalendar";

export function LeftSidebar() {
	const { leftSidebarOpen, setLeftSidebarOpen, isMobile } = useUIStore();
	const { confirmBeforeDelete } = useUserPreferencesStore();
	const [showCalendar, setShowCalendar] = useState(true);

	const { currentDate, setCurrentDate, metadata, noteContent } =
		useDiaryStore();

	const {
		notes,
		activeNoteId,
		setActiveNote,
		newNote: newNoteStore,
		deleteNote,
	} = useNoteStore();

	const { tasks: standaloneTasks } = useStandaloneTasksStore();

	const handleNoteClick = (noteId: string) => {
		setActiveNote(noteId);
		if (isMobile) setLeftSidebarOpen(false);
	};

	const handleDeleteNote = (noteId: string) => {
		deleteNote(noteId);
		toast.success("Nota eliminada");
	};

	const handleExportJson = () => {
		const notesArray = Object.values(notes);
		exportToJson(metadata, noteContent, notesArray, standaloneTasks);
		toast.success("Datos exportados correctamente");
	};

	const handleExportTxt = () => {
		const notesArray = Object.values(notes);
		exportToTxtFile(metadata, noteContent, notesArray, standaloneTasks);
		toast.success("Datos exportados correctamente");
	};

	const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		importFromJson(
			file,
			(data) => {
				useDiaryStore.setState({
					metadata: data.metadata,
					noteContent: data.notes,
				});
				if (data.standaloneNotes?.length > 0) {
					const notesMap: Record<string, Note> = {};
					data.standaloneNotes.forEach((n) => {
						notesMap[n.id] = n;
					});
					useNoteStore.setState({ notes: notesMap });
				}
				if (data.standaloneTasks?.length > 0) {
					useStandaloneTasksStore.setState({
						tasks: data.standaloneTasks,
					});
				}
				toast.success("Datos importados correctamente");
			},
			(error) => toast.error(error),
		);
		event.target.value = "";
	};

	const handleDateSelect = (date: Date) => {
		setActiveNote(null);
		if (isMobile) setLeftSidebarOpen(false);
	};

	return (
		<motion.aside
			initial={{ width: 0, opacity: 0, x: isMobile ? -340 : 0 }}
			animate={{
				width: 340,
				opacity: 1,
				x: 0,
				position: isMobile ? "fixed" : "relative",
				zIndex: isMobile ? 50 : 0,
				height: "100%",
			}}
			exit={{
				width: 0,
				opacity: 0,
				x: isMobile ? -340 : 0,
				transition: { duration: 0.2 },
			}}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden shrink-0"
		>
			<div className="p-6 border-b border-sidebar-border flex items-center justify-between">
				<div className="flex items-center gap-2 text-sidebar-foreground">
					<BookOpen className="w-5 h-5" />
					<h1 className="font-semibold text-lg">Mi Diario</h1>
				</div>
				<div className="flex items-center gap-1">
					<ModeToggle />
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setLeftSidebarOpen(false)}
						className="text-sidebar-foreground hover:bg-sidebar-accent"
					>
						<PanelLeftClose className="w-4 h-4" />
					</Button>
				</div>
			</div>

			<div className="flex-1 p-4 overflow-y-auto space-y-6">
				<div className="space-y-2">
					<button
						type="button"
						onClick={() => setShowCalendar((v) => !v)}
						className="w-full flex items-center justify-between text-xs font-semibold text-sidebar-foreground/50 uppercase px-2"
					>
						<span className="flex items-center gap-1.5">
							<Calendar className="w-3.5 h-3.5" />
							Calendario
						</span>
						{showCalendar ? (
							<ChevronUp className="w-3 h-3" />
						) : (
							<ChevronDown className="w-3 h-3" />
						)}
					</button>
					{showCalendar && (
						<div className="px-1">
							<StreakCalendar onDateSelect={handleDateSelect} />
						</div>
					)}
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold text-sidebar-foreground/50 uppercase flex items-center gap-2">
						Notas
						<Button
							variant="ghost"
							className="text-sidebar-foreground hover:bg-sidebar-accent"
							onClick={() => newNoteStore()}
						>
							<Plus className="w-4 h-4" />
						</Button>
					</p>
					<div className="flex items-start justify-start flex-col gap-1">
						{Object.values(notes).map((note) => (
							<div
								key={note.id}
								className={`flex items-center gap-1 w-full group ${
									activeNoteId === note.id ? "bg-accent rounded-md" : ""
								}`}
							>
								<Button
									variant="ghost"
									className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
									onClick={() => handleNoteClick(note.id)}
								>
									<File className="w-4 h-4 mr-2" />
									<span className="truncate">{note.title}</span>
								</Button>
								{confirmBeforeDelete ? (
									<ConfirmDialog
										title="Eliminar nota"
										description={`¿Estás seguro de que quieres eliminar "${note.title}"? Esta acción no se puede deshacer.`}
										onConfirm={() => handleDeleteNote(note.id)}
									>
										<Button
											variant="ghost"
											size="icon"
											className="opacity-0 group-hover:opacity-100 text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
										>
											<Trash2 className="w-3 h-3" />
										</Button>
									</ConfirmDialog>
								) : (
									<Button
										variant="ghost"
										size="icon"
										className="opacity-0 group-hover:opacity-100 text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
										onClick={() => handleDeleteNote(note.id)}
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								)}
							</div>
						))}
					</div>
				</div>

				<Separator className="my-4" />

				<div className="space-y-2">
					<p className="text-xs font-semibold text-sidebar-foreground/50 uppercase px-2">
						Datos
					</p>
					<Button
						variant="ghost"
						className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
						onClick={handleExportJson}
					>
						<Download className="w-4 h-4 mr-2" />
						Exportar JSON
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
						onClick={handleExportTxt}
					>
						<Download className="w-4 h-4 mr-2" />
						Exportar TXT
					</Button>
					<div className="relative">
						<Button
							variant="ghost"
							className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
						>
							<Upload className="w-4 h-4 mr-2" />
							Importar JSON
						</Button>
						<input
							type="file"
							accept=".json"
							onChange={handleImportJson}
							className="absolute inset-0 opacity-0 cursor-pointer"
							title="Importar archivo JSON"
						/>
					</div>
					{process.env.NODE_ENV === "development" && (
						<>
							<Separator className="my-4" />
							<a
								href="/sandbox"
								className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors rounded-md hover:bg-sidebar-accent"
							>
								<TestTube className="w-3.5 h-3.5" />
								Sandbox
							</a>
						</>
					)}
				</div>
			</div>
		</motion.aside>
	);
}
