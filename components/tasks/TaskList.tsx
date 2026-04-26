"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TaskCard } from "@/components/kanban/TaskCard";
import type { List, Project, Task } from "@/types/task";

interface TaskListProps {
	tasks: Task[];
	projects: Project[];
	lists: List[];
}

export function TaskList({ tasks, projects, lists }: TaskListProps) {
	const searchParams = useSearchParams();

	const query = searchParams.get("q");
	const projectId = searchParams.get("project");
	const areaId = searchParams.get("area");
	const statusId = searchParams.get("status");
	const priority = searchParams.get("priority");
	const tag = searchParams.get("tag");
	const isToday = searchParams.get("today") === "true";

	let filteredTasks = [...tasks];

	if (query) {
		const lowerQuery = query.toLowerCase();
		filteredTasks = filteredTasks.filter(
			(t) =>
				t.content.toLowerCase().includes(lowerQuery) ||
				t.tags.some((tg) => tg.toLowerCase().includes(lowerQuery)),
		);
	}

	if (isToday) {
		const today = new Date().toISOString().slice(0, 10);
		filteredTasks = filteredTasks.filter(
			(t) => t.dueDate && t.dueDate.startsWith(today),
		);
	}

	if (projectId) {
		filteredTasks = filteredTasks.filter(
			(t) => t.projectId && t.projectId === projectId,
		);
	}

	if (areaId) {
		const projectIds = projects
			.filter((p) => p.areaId === areaId)
			.map((p) => p.id);
		filteredTasks = filteredTasks.filter(
			(t) => t.projectId && projectIds.includes(t.projectId),
		);
	}

	if (priority) {
		filteredTasks = filteredTasks.filter((t) => t.priority === priority);
	}

	if (tag) {
		filteredTasks = filteredTasks.filter((t) => t.tags.includes(tag));
	}

	if (statusId) {
		filteredTasks = filteredTasks.filter((t) => t.listId === statusId);
	}

	const getProjectName = (projectId?: string) => {
		if (!projectId) return null;
		return projects.find((p) => p.id === projectId)?.name;
	};

	const getListName = (listId: string) => {
		return lists.find((l) => l.id === listId)?.name;
	};

	if (filteredTasks.length === 0) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				<p>No hay tareas</p>
				<p className="text-sm">Crea una en /lists o presiona Ctrl+K</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{filteredTasks.map((task) => {
				const projectName = getProjectName(task.projectId);
				const listName = getListName(task.listId);
				const isHighlighted = projectId && task.projectId === projectId;

				return (
					<div
						key={task.id}
						className={`flex items-center gap-2 ${isHighlighted ? "ring-2 ring-primary ring-offset-1 rounded-lg" : ""}`}
					>
						<div className="flex-1">
							<Link href={`/lists/${task.listId}/tasks/${task.id}`}>
								<TaskCard task={task} />
							</Link>
						</div>
						<div className="text-xs text-muted-foreground whitespace-nowrap">
							{projectName && (
								<span
									className={`px-2 py-1 rounded ${isHighlighted ? "bg-primary text-primary-foreground" : "bg-muted"}`}
								>
									{projectName}
								</span>
							)}
							{listName && (
								<span className="px-2 py-1 bg-muted rounded ml-1">
									{listName}
								</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
