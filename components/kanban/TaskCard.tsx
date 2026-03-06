"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check } from "lucide-react"
import type { Task } from "@/lib/types/task"
import { useTaskStore } from "@/lib/store/task"

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

const priorityColors = {
  baja: "bg-green-500/10 border-green-500/30 dark:bg-green-500/20 dark:border-green-500/40",
  media: "bg-blue-500/10 border-blue-500/30 dark:bg-blue-500/20 dark:border-blue-500/40",
  alta: "bg-orange-500/10 border-orange-500/30 dark:bg-orange-500/20 dark:border-orange-500/40",
  urgente: "bg-red-500/10 border-red-500/30 dark:bg-red-500/20 dark:border-red-500/40",
}

export function TaskCard({ task, isOverlay = false }: TaskCardProps) {
  const toggleTaskComplete = useTaskStore((s) => s.toggleTaskComplete)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const projects = useTaskStore((s) => s.projects)

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
    transition: transition ?? "transform 150ms ease",
    opacity: isDragging ? 0 : 1,
  }

  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null

  return (
    <div
      ref={setNodeRef}
      style={isOverlay ? undefined : style}
      {...(isOverlay ? {} : { ...attributes, ...listeners })}
      className={`
        group relative p-3 rounded-lg border bg-card shadow-sm
        ${isOverlay ? "cursor-grabbing shadow-xl rotate-1 scale-105" : "cursor-grab active:cursor-grabbing"}
        ${task.completedAt ? "opacity-60" : ""}
        ${priorityColors[task.priority]}
      `}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleTaskComplete(task.id)
          }}
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
          {project && (
            <span className="text-xs text-primary font-medium">
              {project.name}
            </span>
          )}
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
          onClick={(e) => {
            e.stopPropagation()
            deleteTask(task.id)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <span className="text-xs">×</span>
        </button>
      </div>
    </div>
  )
}
