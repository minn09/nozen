"use client";

import { ArrowLeft, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTaskStore } from "@/lib/store/task";
import type { Priority } from "@/types/task";

const priorities: Priority[] = ["baja", "media", "alta", "urgente"];

export default function TaskDetailPage() {
	const params = useParams();
	const router = useRouter();
	const taskId = params.taskId as string;

	const tasks = useTaskStore((s) => s.tasks);
	const lists = useTaskStore((s) => s.lists);
	const projects = useTaskStore((s) => s.projects);
	const updateTask = useTaskStore((s) => s.updateTask);
	const deleteTask = useTaskStore((s) => s.deleteTask);
	const toggleTaskComplete = useTaskStore((s) => s.toggleTaskComplete);

	const task = tasks[taskId];

	const [content, setContent] = useState(task?.content || "");
	const [tagInput, setTagInput] = useState("");

	if (!task) {
		return (
			<div className="p-8">
				<p>Tarea no encontrada</p>
				<Link href="/lists" className="text-primary hover:underline">
					Volver a listas
				</Link>
			</div>
		);
	}

	const project = task.projectId
		? projects.find((p) => p.id === task.projectId)
		: null;
	const list = lists.find((l) => l.id === task.listId);

	const handleSave = () => {
		updateTask(taskId, { content });
	};

	const handleAddTag = () => {
		if (tagInput.trim() && !task.tags.includes(tagInput.trim())) {
			updateTask(taskId, { tags: [...task.tags, tagInput.trim()] });
			setTagInput("");
		}
	};

	const handleRemoveTag = (tag: string) => {
		updateTask(taskId, { tags: task.tags.filter((t) => t !== tag) });
	};

	const handlePriorityChange = (priority: Priority) => {
		updateTask(taskId, { priority });
	};

	const handleDelete = () => {
		deleteTask(taskId);
		router.push("/lists");
	};

	return (
		<div className="h-screen flex flex-col">
			<header className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-muted rounded"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-xl font-bold">Detalle de tarea</h1>
				</div>
				<button
					onClick={handleDelete}
					className="p-2 text-destructive hover:bg-destructive/10 rounded"
				>
					<Trash2 className="w-5 h-5" />
				</button>
			</header>
			<main className="flex-1 p-6 overflow-auto">
				<div className="max-w-2xl space-y-6">
					<div className="flex items-start gap-4">
						<button
							onClick={() => toggleTaskComplete(taskId)}
							className={`
                mt-1 w-6 h-6 rounded border-2 flex items-center justify-center
                transition-colors flex-shrink-0
                ${
									task.completedAt
										? "bg-green-500 border-green-500 text-white"
										: "border-border hover:border-primary"
								}
              `}
						>
							{task.completedAt && <Check className="w-4 h-4" />}
						</button>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							onBlur={handleSave}
							className="flex-1 text-xl p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
							rows={3}
						/>
					</div>

					<div className="flex gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">Proyecto</label>
							{project ? (
								<Link
									href={`/projects/${project.id}`}
									className="px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 inline-block"
								>
									{project.name}
								</Link>
							) : (
								<span className="text-muted-foreground">Sin proyecto</span>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">Lista</label>
							<span className="px-3 py-1 rounded bg-muted inline-block">
								{list?.name || "Lista no encontrada"}
							</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Prioridad</label>
						<div className="flex gap-2">
							{priorities.map((p) => (
								<button
									key={p}
									onClick={() => handlePriorityChange(p)}
									className={`
                    px-3 py-1 rounded text-sm capitalize
                    ${
											task.priority === p
												? "bg-primary text-primary-foreground"
												: "bg-muted hover:bg-muted/80"
										}
                  `}
								>
									{p}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Etiquetas</label>
						<div className="flex flex-wrap gap-2 mb-2">
							{task.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary text-secondary-foreground"
								>
									#{tag}
									<button
										onClick={() => handleRemoveTag(tag)}
										className="hover:text-destructive"
									>
										×
									</button>
								</span>
							))}
						</div>
						<div className="flex gap-2">
							<input
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && (e.preventDefault(), handleAddTag())
								}
								placeholder="Añadir etiqueta..."
								className="flex-1 p-2 border rounded text-sm"
							/>
							<button
								onClick={handleAddTag}
								className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
							>
								Añadir
							</button>
						</div>
					</div>

					<div className="text-sm text-muted-foreground">
						<p>Creada: {new Date(task.createdAt).toLocaleString()}</p>
						{task.completedAt && (
							<p>Completada: {new Date(task.completedAt).toLocaleString()}</p>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
