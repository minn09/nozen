"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useTaskStore } from "@/lib/store/task"
import { TaskCard } from "@/components/kanban/TaskCard"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const projects = useTaskStore((s) => s.projects)
  const lists = useTaskStore((s) => s.lists)
  const tasks = useTaskStore((s) => s.tasks)

  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="p-8">
        <p>Proyecto no encontrado</p>
        <Link href="/projects" className="text-primary hover:underline">
          Volver a proyectos
        </Link>
      </div>
    )
  }

  const projectLists = lists.filter((l) => l.projectId === projectId)
  const projectTaskIds = projectLists.flatMap((l) => l.taskIds)
  const projectTasks = projectTaskIds.map((id) => tasks[id]).filter(Boolean)

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-4 p-4 border-b">
        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{project.name}</h1>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {projectLists.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Listas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/lists/${list.id}`}
                    className="p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <h3 className="font-medium">{list.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {list.taskIds.length} tareas
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3">Todas las tareas</h2>
            <div className="space-y-2 max-w-2xl">
              {projectTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {projectTasks.length === 0 && (
                <p className="text-muted-foreground">No hay tareas en este proyecto</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
