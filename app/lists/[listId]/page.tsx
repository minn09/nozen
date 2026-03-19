"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useTaskStore } from "@/lib/store/task"
import { TaskCard } from "@/components/kanban/TaskCard"

export default function ListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params.listId as string

  const lists = useTaskStore((s) => s.lists)
  const list = lists.find((l) => l.id === listId)
  const tasks = useTaskStore((s) => s.getTasksByList(listId))

  if (!list) {
    return (
      <div className="p-8">
        <p>Lista no encontrada</p>
        <Link href="/lists" className="text-primary hover:underline">
          Volver a listas
        </Link>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-4 p-4 border-b">
        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{list.name}</h1>
        <span className="text-muted-foreground">({tasks.length} tareas)</span>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="space-y-2 max-w-2xl">
          {tasks.map((task) => (
            <Link key={task.id} href={`/lists/${listId}/tasks/${task.id}`}>
              <TaskCard task={task} />
            </Link>
          ))}
          {tasks.length === 0 && (
            <p className="text-muted-foreground">No hay tareas en esta lista</p>
          )}
        </div>
      </main>
    </div>
  )
}
