"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStandaloneTasksStore } from "@/store/standalone-tasks";

export default function TasksPage() {
	const { tasks, addTask, toggleTask, deleteTask } = useStandaloneTasksStore();
	const [newTaskText, setNewTaskText] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTaskText.trim()) {
			addTask(newTaskText.trim());
			setNewTaskText("");
		}
	};

	const activeTasks = tasks.filter((t) => !t.done);
	const completedTasks = tasks.filter((t) => t.done);

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-xl mx-auto space-y-8">
				<h1 className="text-3xl font-bold text-foreground">Tareas</h1>

				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						type="text"
						value={newTaskText}
						onChange={(e) => setNewTaskText(e.target.value)}
						placeholder="Nueva tarea..."
						className="flex-1 bg-background border border-input rounded-md px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					/>
					<Button type="submit" variant="default">
						<Plus className="w-4 h-4 mr-2" />
						Agregar
					</Button>
				</form>

				{activeTasks.length > 0 && (
					<div className="space-y-2">
						<h2 className="text-sm font-medium text-muted-foreground">
							Por hacer ({activeTasks.length})
						</h2>
						<div className="space-y-2">
							{activeTasks.map((task) => (
								<div
									key={task.id}
									className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
								>
									<input
										type="checkbox"
										checked={false}
										onChange={() => toggleTask(task.id)}
										className="w-5 h-5 rounded"
									/>
									<span className="flex-1 text-foreground">{task.text}</span>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteTask(task.id)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				)}

				{completedTasks.length > 0 && (
					<div className="space-y-2">
						<h2 className="text-sm font-medium text-muted-foreground">
							Completadas ({completedTasks.length})
						</h2>
						<div className="space-y-2">
							{completedTasks.map((task) => (
								<div
									key={task.id}
									className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
								>
									<input
										type="checkbox"
										checked
										onChange={() => toggleTask(task.id)}
										className="w-5 h-5 rounded"
									/>
									<span className="flex-1 text-muted-foreground line-through">
										{task.text}
									</span>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteTask(task.id)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				)}

				{tasks.length === 0 && (
					<p className="text-center text-muted-foreground py-8">
						No hay tareas. Agrega una arriba.
					</p>
				)}
			</div>
		</div>
	);
}
