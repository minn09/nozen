"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { TaskCard } from "@/components/kanban/TaskCard";
import { useTaskStore } from "@/lib/store/task";

export default function ProjectDetailPage() {
	const params = useParams();
	const router = useRouter();
	const projectId = params.projectId as string;

	const projects = useTaskStore((s) => s.projects);
	const lists = useTaskStore((s) => s.lists);
	const tasks = useTaskStore((s) => s.tasks);
	const createTask = useTaskStore((s) => s.createTask);
	const updateProject = useTaskStore((s) => s.updateProject);

	const [isEditingName, setIsEditingName] = useState(false);
	const [projectName, setProjectName] = useState(() => {
		const project = projects.find((p) => p.id === projectId);
		return project?.name ?? "";
	});
	const [newTaskContent, setNewTaskContent] = useState("");

	const project = projects.find((p) => p.id === projectId);
	const defaultList = lists[0];

	if (!project) {
		return (
			<div className="p-8">
				<p>Proyecto no encontrado</p>
				<Link href="/projects" className="text-primary hover:underline">
					Volver a proyectos
				</Link>
			</div>
		);
	}

	const projectTasks = Object.values(tasks).filter(
		(t) => t.projectId === projectId,
	);

	const handleUpdateName = () => {
		if (projectName.trim() && projectName !== project.name) {
			updateProject(projectId, { name: projectName.trim() });
		}
		setIsEditingName(false);
	};

	const handleCreateTask = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTaskContent.trim() || !defaultList) return;
		createTask(defaultList.id, newTaskContent.trim(), projectId);
		setNewTaskContent("");
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectName(e.target.value);
	};

	const handleNameKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleUpdateName();
		} else if (e.key === "Escape") {
			setProjectName(project.name);
			setIsEditingName(false);
		}
	};

	return (
		<div className="h-screen flex flex-col">
			<header className="flex items-center gap-4 p-4 border-b">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-muted rounded"
				>
					<ArrowLeft className="w-5 h-5" />
				</button>
				{isEditingName ? (
					<input
						autoFocus
						value={projectName}
						onChange={handleNameChange}
						onBlur={handleUpdateName}
						onKeyDown={handleNameKeyDown}
						className="text-xl font-bold bg-transparent border-b border-primary focus:outline-none"
					/>
				) : (
					<h1
						className="text-xl font-bold cursor-pointer hover:text-primary"
						onClick={() => setIsEditingName(true)}
					>
						{project.name}
					</h1>
				)}
			</header>
			<main className="flex-1 p-4 overflow-auto">
				<div>
					<h2 className="text-lg font-semibold mb-3">Tareas</h2>
					<form
						onSubmit={handleCreateTask}
						className="mb-4 flex gap-2 max-w-xl"
					>
						<input
							type="text"
							value={newTaskContent}
							onChange={(e) => setNewTaskContent(e.target.value)}
							placeholder={`Nueva tarea en "${defaultList?.name || "Por hacer"}"...`}
							className="flex-1 p-2 border rounded"
						/>
						<button
							type="submit"
							disabled={!newTaskContent.trim()}
							className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
						>
							<Plus className="w-5 h-5" />
						</button>
					</form>
					<div className="space-y-2 max-w-2xl">
						{projectTasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
						{projectTasks.length === 0 && (
							<p className="text-muted-foreground">
								No hay tareas en este proyecto
							</p>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
