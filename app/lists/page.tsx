"use client"

import { Board } from "@/components/kanban/Board"
import { QuickEntry } from "@/components/kanban/QuickEntry"
import { useTaskStore } from "@/lib/store/task"

export default function ListsPage() {
  const createList = useTaskStore((s) => s.createList)

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Mis Listas</h1>
        <button
          onClick={() => createList("Nueva lista")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          + Nueva lista
        </button>
      </header>
      <div className="flex-1 overflow-hidden">
        <Board />
      </div>
      <QuickEntry />
    </div>
  )
}
