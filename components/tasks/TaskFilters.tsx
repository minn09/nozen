"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Area, List, Priority, Project } from "@/types/task";

interface TaskFiltersProps {
	areas: Area[];
	projects: Project[];
	lists: List[];
	tags: string[];
}

export function TaskFilters({
	areas,
	projects,
	lists,
	tags,
}: TaskFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentProject = searchParams.get("project");
	const currentArea = searchParams.get("area");
	const currentStatus = searchParams.get("status");
	const currentPriority = searchParams.get("priority");
	const currentTag = searchParams.get("tag");
	const isToday = searchParams.get("today") === "true";

	const updateFilter = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value && value !== "__all__") {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		router.push(`/tasks?${params.toString()}`);
	};

	const toggleToday = () => {
		const params = new URLSearchParams(searchParams.toString());
		if (isToday) {
			params.delete("today");
		} else {
			params.set("today", "true");
		}
		router.push(`/tasks?${params.toString()}`);
	};

	const clearFilters = () => {
		router.push("/tasks");
	};

	const hasFilters =
		currentProject ||
		currentArea ||
		currentStatus ||
		currentPriority ||
		currentTag ||
		isToday;

	const priorities: Priority[] = ["baja", "media", "alta", "urgente"];

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
				<Select
					value={currentArea || "__all__"}
					onValueChange={(v) => updateFilter("area", v)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Todas las áreas" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="__all__">Todas las áreas</SelectItem>
						{areas.map((area) => (
							<SelectItem key={area.id} value={area.id}>
								{area.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<h3 className="font-medium mb-2">Proyecto</h3>
				<Select
					value={currentProject || "__all__"}
					onValueChange={(v) => updateFilter("project", v)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Todos los proyectos" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="__all__">Todos los proyectos</SelectItem>
						{projects.map((project) => (
							<SelectItem key={project.id} value={project.id}>
								{project.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<h3 className="font-medium mb-2">Estado</h3>
				<Select
					value={currentStatus || "__all__"}
					onValueChange={(v) => updateFilter("status", v)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Todos los estados" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="__all__">Todos los estados</SelectItem>
						{lists.map((list) => (
							<SelectItem key={list.id} value={list.id}>
								{list.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<h3 className="font-medium mb-2">Prioridad</h3>
				<Select
					value={currentPriority || "__all__"}
					onValueChange={(v) => updateFilter("priority", v)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Todas las prioridades" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="__all__">Todas las prioridades</SelectItem>
						{priorities.map((p) => (
							<SelectItem key={p} value={p}>
								{p.charAt(0).toUpperCase() + p.slice(1)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{tags.length > 0 && (
				<div>
					<h3 className="font-medium mb-2">Etiqueta</h3>
					<Select
						value={currentTag || "__all__"}
						onValueChange={(v) => updateFilter("tag", v)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Todas las etiquetas" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__all__">Todas las etiquetas</SelectItem>
							{tags.map((tag) => (
								<SelectItem key={tag} value={tag}>
									#{tag}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	);
}
