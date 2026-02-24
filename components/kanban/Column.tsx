"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TaskCard } from "./TaskCard"
import { useTaskStore } from "@/lib/store/task"
import type { List, Task } from "@/lib/types/task"

interface ColumnProps {
  list: List
  tasks: Task[]
}

export function Column({ list, tasks }: ColumnProps) {
  const createTask = useTaskStore((s) => s.createTask)
  const updateList = useTaskStore((s) => s.updateList)
  const [isAdding, setIsAdding] = useState(false)
  const [newTaskContent, setNewTaskContent] = useState("")

  const { setNodeRef, isOver } = useDroppable({ id: list.id })

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      createTask(list.id, newTaskContent.trim())
      setNewTaskContent("")
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    } else if (e.key === "Escape") {
      setIsAdding(false)
      setNewTaskContent("")
    }
  }

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className="flex items-center justify-between p-2 mb-2">
        <input
          value={list.name}
          onChange={(e) => updateList(list.id, { name: e.target.value })}
          className="font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
        />
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`
          flex-1 p-2 rounded-lg bg-muted/30 min-h-[100px]
          ${isOver ? "bg-muted/50 ring-2 ring-primary" : ""}
        `}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {isAdding ? (
          <div className="mt-2">
            <input
              autoFocus
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddTask}
              placeholder="Escribe una tarea..."
              className="w-full p-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir tarea
          </button>
        )}
      </div>
    </div>
  )
}
