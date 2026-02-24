"use client"

import Link from "next/link"
import { useTaskStore } from "@/lib/store/task"

export default function ProjectsPage() {
  const areas = useTaskStore((s) => s.areas)
  const projects = useTaskStore((s) => s.projects)
  const createProject = useTaskStore((s) => s.createProject)
  const areaId = useTaskStore((s) => s.areaId)

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Proyectos</h1>
        <button
          onClick={() => areaId && createProject(areaId, "Nuevo proyecto")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          + Nuevo proyecto
        </button>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {areas.map((area) => {
            const areaProjects = projects.filter((p) => p.areaId === area.id)
            if (areaProjects.length === 0) return null

            return (
              <div key={area.id}>
                <h2 className="text-lg font-semibold mb-3">{area.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {areaProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.listIds.length} listas
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
