"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check, GripVertical } from "lucide-react"
import type { Task } from "@/lib/types/task"
import { useTaskStore } from "@/lib/store/task"

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  baja: "bg-green-100 border-green-300",
  media: "bg-yellow-100 border-yellow-300",
  alta: "bg-orange-100 border-orange-300",
  urgente: "bg-red-100 border-red-300",
}

export function TaskCard({ task }: TaskCardProps) {
  const toggleTaskComplete = useTaskStore((s) => s.toggleTaskComplete)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative p-3 rounded-lg border bg-card shadow-sm
        ${task.completedAt ? "opacity-60" : ""}
        ${isDragging ? "shadow-lg z-50 opacity-90" : ""}
        ${priorityColors[task.priority]}
      `}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <button
          onClick={() => toggleTaskComplete(task.id)}
          className={`
            mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center
            transition-colors flex-shrink-0
            ${task.completedAt 
              ? "bg-green-500 border-green-500 text-white" 
              : "border-border hover:border-primary"
            }
          `}
        >
          {task.completedAt && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm break-words ${task.completedAt ? "line-through text-muted-foreground" : ""}`}>
            {task.content}
          </p>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <span className="text-xs">×</span>
        </button>
      </div>
    </div>
  )
}
