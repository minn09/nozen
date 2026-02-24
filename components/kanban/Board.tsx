"use client"

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useState } from "react"
import { Column } from "./Column"
import { TaskCard } from "./TaskCard"
import { useTaskStore } from "@/lib/store/task"
import type { Task } from "@/lib/types/task"

export function Board() {
  const lists = useTaskStore((s) => s.lists)
  const tasksMap = useTaskStore((s) => s.tasks)
  const moveTask = useTaskStore((s) => s.moveTask)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = tasksMap[active.id as string]
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    const overList = lists.find((l) => l.id === overId)
    if (overList) {
      const listTasks = lists.find((l) => l.id === overId)?.taskIds || []
      moveTask(taskId, overId, listTasks.length)
      return
    }

    const overTask = tasksMap[overId]
    if (overTask) {
      const targetList = lists.find((l) => l.id === overTask.listId)
      if (targetList) {
        const taskIndex = targetList.taskIds.indexOf(overId)
        moveTask(taskId, overTask.listId, taskIndex)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 overflow-x-auto h-full">
        {lists.map((list) => {
          const tasks = list.taskIds.map((id) => tasksMap[id]).filter(Boolean)
          return <Column key={list.id} list={list} tasks={tasks} />
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
