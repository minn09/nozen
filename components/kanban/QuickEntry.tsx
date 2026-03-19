"use client"

import { useState, useEffect, useRef } from "react"
import { useTaskStore } from "@/lib/store/task"

export function QuickEntry() {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const lists = useTaskStore((s) => s.lists)
  const createTask = useTaskStore((s) => s.createTask)
  const projects = useTaskStore((s) => s.projects)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const parseCommand = (text: string) => {
    let projectId: string | undefined
    let tags: string[] = []
    let taskContent = text

    const projectMatch = text.match(/\+(\S+)/g)
    if (projectMatch) {
      const projectName = projectMatch[0].slice(1)
      const project = projects.find((p) => p.name.toLowerCase() === projectName.toLowerCase())
      if (project) {
        projectId = project.id
        taskContent = taskContent.replace(projectMatch[0], "")
      }
    }

    const tagMatch = text.match(/#(\S+)/g)
    if (tagMatch) {
      tags = tagMatch.map((t) => t.slice(1))
      taskContent = taskContent.replace(/#[^\s]+/g, "")
    }

    return {
      content: taskContent.trim(),
      projectId,
      tags,
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const { content: taskContent, projectId, tags } = parseCommand(content)

    if (lists.length > 0) {
      const task = createTask(lists[0].id, taskContent, projectId)
      if (tags.length > 0) {
        useTaskStore.getState().updateTask(task.id, { tags })
      }
    }

    setContent("")
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      >
        <span className="text-xl">+</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50" onClick={() => setIsOpen(false)}>
      <div className="bg-background rounded-lg shadow-xl w-full max-w-xl p-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe una tarea... (#tag +proyecto)"
            className="w-full text-lg p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-2">
            Presiona Enter para crear • #tag para etiquetas • +proyecto para asignar
          </p>
        </form>
      </div>
    </div>
  )
}
