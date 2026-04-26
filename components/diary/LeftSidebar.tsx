"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Calendar,
	Download,
	File,
	PanelLeftClose,
	Plus,
	Trash2,
	Upload,
} from "lucide-react";
import { useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { exportToJson, exportToTxtFile } from "@/services/export";
import { importFromJson } from "@/services/import";
import { useDiaryStore } from "@/store/diary";
import { useNoteStore } from "@/store/note";
import { useUIStore } from "@/store/ui";

export function LeftSidebar() {
	const { leftSidebarOpen, setLeftSidebarOpen, isMobile } = useUIStore();

	const { setCurrentDate, metadata, noteContent } = useDiaryStore();

	const {
		notes,
		activeNoteId,
		setActiveNote,
		newNote: newNoteStore,
		deleteNote,
		loadFromStorage,
	} = useNoteStore();

	useEffect(() => {
		loadFromStorage();
	}, [loadFromStorage]);

	const handleNoteClick = (noteId: string) => {
		setActiveNote(noteId);
		if (isMobile) setLeftSidebarOpen(false);
	};

	const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
		e.stopPropagation();
		if (confirm("¿Eliminar esta nota?")) {
			deleteNote(noteId);
		}
	};

	const handleExportJson = () => {
		exportToJson(metadata, noteContent);
	};

	const handleExportTxt = () => {
		exportToTxtFile(metadata, noteContent);
	};

	const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		importFromJson(
			file,
			(data) => {
				if (
					confirm("Esto reemplazará tus datos actuales. ¿Deseas continuar?")
				) {
					useDiaryStore.setState({
						metadata: data.metadata,
						noteContent: data.notes,
					});
					alert("Datos importados con éxito.");
				}
			},
			(error) => alert(error),
		);
		event.target.value = "";
	};

	const handleGoToToday = () => {
		setCurrentDate(new Date());
		if (isMobile) setLeftSidebarOpen(false);
	};

	return (
		<motion.aside
			initial={{ width: 0, opacity: 0, x: isMobile ? -256 : 0 }}
			animate={{
				width: 256,
				opacity: 1,
				x: 0,
				position: isMobile ? "fixed" : "relative",
				zIndex: isMobile ? 50 : 0,
				height: "100%",
			}}
			exit={{
				width: 0,
				opacity: 0,
				x: isMobile ? -256 : 0,
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
					<Button
						variant="ghost"
						className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
						onClick={handleGoToToday}
					>
						<Calendar className="w-4 h-4 mr-2" />
						Hoy
					</Button>
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
								<Button
									variant="ghost"
									size="icon"
									className="opacity-0 group-hover:opacity-100 text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
									onClick={(e) => handleDeleteNote(e, note.id)}
								>
									<Trash2 className="w-3 h-3" />
								</Button>
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
				</div>
			</div>
		</motion.aside>
	);
}
