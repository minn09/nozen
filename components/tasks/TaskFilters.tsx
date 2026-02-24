"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { Area, Project, List, Priority } from "@/lib/types/task"

interface TaskFiltersProps {
  areas: Area[]
  projects: Project[]
  lists: List[]
  tags: string[]
}

export function TaskFilters({ areas, projects, lists, tags }: TaskFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentProject = searchParams.get("project")
  const currentArea = searchParams.get("area")
  const currentStatus = searchParams.get("status")
  const currentPriority = searchParams.get("priority")
  const currentTag = searchParams.get("tag")
  const isToday = searchParams.get("today") === "true"

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/tasks?${params.toString()}`)
  }

  const toggleToday = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (isToday) {
      params.delete("today")
    } else {
      params.set("today", "true")
    }
    router.push(`/tasks?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/tasks")
  }

  const hasFilters = currentProject || currentArea || currentStatus || currentPriority || currentTag || isToday

  const priorities: Priority[] = ["baja", "media", "alta", "urgente"]

  return (
    <div className="w-64 flex-shrink-0 space-y-6 p-4 bg-muted/20 rounded-lg">
      <div>
        <button
          onClick={toggleToday}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            isToday
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          ☀ Mi Día
        </button>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Limpiar filtros
        </button>
      )}

      <div>
        <h3 className="font-medium mb-2">Área</h3>
        <select
          value={currentArea || ""}
          onChange={(e) => updateFilter("area", e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Todas las áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-medium mb-2">Proyecto</h3>
        <select
          value={currentProject || ""}
          onChange={(e) => updateFilter("project", e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Todos los proyectos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-medium mb-2">Estado</h3>
        <select
          value={currentStatus || ""}
          onChange={(e) => updateFilter("status", e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Todos los estados</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-medium mb-2">Prioridad</h3>
        <select
          value={currentPriority || ""}
          onChange={(e) => updateFilter("priority", e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Todas las prioridades</option>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {tags.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Etiqueta</h3>
          <select
            value={currentTag || ""}
            onChange={(e) => updateFilter("tag", e.target.value || null)}
            className="w-full p-2 border rounded"
          >
            <option value="">Todas las etiquetas</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
