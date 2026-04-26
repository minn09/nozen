import type {
	Area,
	List,
	Priority,
	Project,
	Task,
	Workspace,
} from "@/lib/types/task";
import {
	areaSchema,
	listSchema,
	projectSchema,
	taskSchema,
	workspaceSchema,
} from "@/lib/types/task";

export function isTask(value: unknown): value is Task {
	return taskSchema.safeParse(value).success;
}

export function isList(value: unknown): value is List {
	return listSchema.safeParse(value).success;
}

export function isProject(value: unknown): value is Project {
	return projectSchema.safeParse(value).success;
}

export function isArea(value: unknown): value is Area {
	return areaSchema.safeParse(value).success;
}

export function isWorkspace(value: unknown): value is Workspace {
	return workspaceSchema.safeParse(value).success;
}

export function isPriority(value: unknown): value is Priority {
	const priorities = ["baja", "media", "alta", "urgente"];
	return typeof value === "string" && priorities.includes(value);
}
