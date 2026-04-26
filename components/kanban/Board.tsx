"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { useTaskStore } from "@/lib/store/task";
import type { Task } from "@/types/task";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

export function Board() {
	const lists = useTaskStore((s) => s.lists);
	const tasksMap = useTaskStore((s) => s.tasks);
	const moveTask = useTaskStore((s) => s.moveTask);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragStart(event: DragStartEvent) {
		const task = tasksMap[event.active.id as string];
		if (task) setActiveTask(task);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveTask(null);
		if (!over) return;

		const taskId = active.id as string;
		const overId = over.id as string;

		// Dropped over a column droppable (col:listId)
		if (overId.startsWith("col:")) {
			const targetListId = overId.replace("col:", "");
			const listTasks = lists.find((l) => l.id === targetListId)?.taskIds ?? [];
			moveTask(taskId, targetListId, listTasks.length);
			return;
		}

		// Dropped over another task
		const overTask = tasksMap[overId];
		if (overTask) {
			const targetList = lists.find((l) => l.id === overTask.listId);
			if (targetList) {
				const taskIndex = targetList.taskIds.indexOf(overId);
				moveTask(taskId, overTask.listId, taskIndex);
			}
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex gap-4 p-4 overflow-x-auto h-full justify-center">
				{lists.map((list) => {
					const tasks = list.taskIds
						.map((id) => tasksMap[id])
						.filter((t): t is Task => t !== undefined);
					return (
						<Column
							key={list.id}
							list={list}
							tasks={tasks}
							isDragging={!!activeTask}
						/>
					);
				})}
			</div>

			<DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
				{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
			</DragOverlay>
		</DndContext>
	);
}
