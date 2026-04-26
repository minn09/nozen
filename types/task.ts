import { z } from "zod";

export type Priority = "baja" | "media" | "alta" | "urgente";

export const prioritySchema = z.enum(["baja", "media", "alta", "urgente"]);

export const taskSchema = z.object({
	id: z.string(),
	listId: z.string(),
	projectId: z.string().optional(),
	content: z.string().min(1),
	tags: z.array(z.string()),
	priority: prioritySchema,
	dueDate: z.string().optional(),
	createdAt: z.string(),
	completedAt: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;

export const listSchema = z.object({
	id: z.string(),
	name: z.string(),
	projectId: z.string().optional(),
	taskIds: z.array(z.string()),
});

export type List = z.infer<typeof listSchema>;

export const projectSchema = z.object({
	id: z.string(),
	areaId: z.string(),
	name: z.string(),
	listIds: z.array(z.string()),
});

export type Project = z.infer<typeof projectSchema>;

export const areaSchema = z.object({
	id: z.string(),
	workspaceId: z.string(),
	name: z.string(),
	projectIds: z.array(z.string()),
});

export type Area = z.infer<typeof areaSchema>;

export const workspaceSchema = z.object({
	id: z.string(),
	name: z.string(),
	areaIds: z.array(z.string()),
});

export type Workspace = z.infer<typeof workspaceSchema>;

export interface TaskBoardData {
	workspaces: Workspace[];
	areas: Area[];
	projects: Project[];
	lists: List[];
	tasks: Record<string, Task>;
}
