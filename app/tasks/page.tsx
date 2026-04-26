"use client";

import { Suspense } from "react";
import { SearchBar } from "@/components/tasks/SearchBar";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { useTaskStore } from "@/lib/store/task";
import type { Area, List, Project, Task } from "@/lib/types/task";

function TasksContent() {
	const areas = useTaskStore((s) => s.areas);
	const projects = useTaskStore((s) => s.projects);
	const lists = useTaskStore((s) => s.lists);
	const tasksMap = useTaskStore((s) => s.tasks);
	const allTasks = Object.values(tasksMap);

	const tags = [...new Set(allTasks.flatMap((t) => t.tags))];

	return (
		<>
			<header className="flex items-center justify-between p-4 border-b gap-4">
				<h1 className="text-xl font-bold">Tareas</h1>
				<div className="w-80">
					<SearchBar />
				</div>
				<div className="text-sm text-muted-foreground">
					{allTasks.length} tarea{allTasks.length !== 1 ? "s" : ""}
				</div>
			</header>
			<div className="flex-1 flex overflow-hidden">
				<TaskFilters
					areas={areas}
					projects={projects}
					lists={lists}
					tags={tags}
				/>
				<main className="flex-1 p-4 overflow-auto">
					<TaskList tasks={allTasks} projects={projects} lists={lists} />
				</main>
			</div>
		</>
	);
}

export default function TasksPage() {
	return (
		<div className="h-screen flex flex-col">
			<Suspense fallback={<div className="p-4">Cargando...</div>}>
				<TasksContent />
			</Suspense>
		</div>
	);
}
