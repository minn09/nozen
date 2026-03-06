"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useTaskStore } from "@/lib/store/task"
import { Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export default function ProjectsPage() {
  const areas = useTaskStore((s) => s.areas)
  const projects = useTaskStore((s) => s.projects)
  const tasks = useTaskStore((s) => s.tasks)
  const createProject = useTaskStore((s) => s.createProject)
  const updateProject = useTaskStore((s) => s.updateProject)
  const deleteProject = useTaskStore((s) => s.deleteProject)
  const areaId = useTaskStore((s) => s.areaId)

  const getProjectTaskCount = (projectId: string) => {
    return Object.values(tasks).filter((t) => t.projectId === projectId).length
  }

  const handleDeleteProject = (projectId: string, projectName: string) => {
    deleteProject(projectId)
    toast.success(`Proyecto "${projectName}" eliminado`)
  }

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
                    <div
                      key={project.id}
                      className="group relative p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Link href={`/projects/${project.id}`} className="block">
                        <ProjectName project={project} onUpdate={updateProject} />
                        <p className="text-sm text-muted-foreground">
                          {getProjectTaskCount(project.id)} tarea{getProjectTaskCount(project.id) !== 1 ? "s" : ""}
                        </p>
                      </Link>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ConfirmDialog
                          title="Eliminar proyecto"
                          description={`¿Estás seguro de eliminar "${project.name}" y todas sus tareas? Esta acción no se puede deshacer.`}
                          onConfirm={() => handleDeleteProject(project.id, project.name)}
                        >
                          <button
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded"
                            title="Eliminar proyecto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </ConfirmDialog>
                      </div>
                    </div>
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

function ProjectName({ project, onUpdate }: { project: { id: string; name: string }, onUpdate: (id: string, u: { name: string }) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(() => project.name)

  const handleBlur = () => {
    setIsEditing(false)
    if (name.trim() && name !== project.name) {
      onUpdate(project.id, { name: name.trim() })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur()
    } else if (e.key === "Escape") {
      setName(project.name)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="font-medium bg-transparent border-b border-primary focus:outline-none w-full"
      />
    )
  }

  return (
    <h3 
      className="font-medium cursor-pointer hover:text-primary"
      onClick={(e) => {
        e.preventDefault()
        setIsEditing(true)
      }}
    >
      {project.name}
    </h3>
  )
}
