import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	Area,
	List,
	Priority,
	Project,
	Task,
	Workspace,
} from "@/types/task";
import { generateId } from "@/utils/id";

interface TaskBoardState {
	workspaces: Workspace[];
	areas: Area[];
	projects: Project[];
	lists: List[];
	tasks: Record<string, Task>;

	workspaceId: string | null;
	areaId: string | null;

	setActiveWorkspace: (workspaceId: string) => void;
	setActiveArea: (areaId: string) => void;

	createWorkspace: (name: string) => Workspace;
	createArea: (workspaceId: string, name: string) => Area;
	createProject: (areaId: string, name: string) => Project;
	createList: (name: string, projectId?: string) => List;
	createTask: (listId: string, content: string, projectId?: string) => Task;

	updateTask: (taskId: string, updates: Partial<Task>) => void;
	deleteTask: (taskId: string) => void;
	toggleTaskComplete: (taskId: string) => void;
	moveTask: (taskId: string, targetListId: string, newIndex: number) => void;

	updateList: (listId: string, updates: Partial<List>) => void;
	deleteList: (listId: string) => void;

	updateProject: (projectId: string, updates: Partial<Project>) => void;
	deleteProject: (projectId: string) => void;

	getTasksByList: (listId: string) => Task[];
	getListsByProject: (projectId: string) => List[];
	getProjectsByArea: (areaId: string) => Project[];
	getAreasByWorkspace: (workspaceId: string) => Area[];
	getTodayTasks: () => Task[];
	searchTasks: (query: string) => Task[];
	getAllTasks: () => Task[];
	getTasksByProject: (projectId: string) => Task[];
	getTasksByArea: (areaId: string) => Task[];
	getTasksByPriority: (priority: Priority) => Task[];
	getTasksByTag: (tag: string) => Task[];
	getAllTags: () => string[];
}

const defaultWorkspaceId = generateId();
const defaultAreaId = generateId();
const defaultProjectId = generateId();

const defaultLists: List[] = [
	{ id: generateId(), name: "Por hacer", taskIds: [] },
	{ id: generateId(), name: "En progreso", taskIds: [] },
	{ id: generateId(), name: "Hecho", taskIds: [] },
];

const defaultState = {
	workspaces: [
		{ id: defaultWorkspaceId, name: "Mi Workspace", areaIds: [defaultAreaId] },
	],
	areas: [
		{
			id: defaultAreaId,
			workspaceId: defaultWorkspaceId,
			name: "General",
			projectIds: [defaultProjectId],
		},
	],
	projects: [
		{
			id: defaultProjectId,
			areaId: defaultAreaId,
			name: "Proyecto inicial",
			listIds: [],
		},
	],
	lists: defaultLists,
	tasks: {} as Record<string, Task>,
	workspaceId: defaultWorkspaceId,
	areaId: defaultAreaId,
};

export const useTaskStore = create<TaskBoardState>()(
	persist(
		(set, get) => ({
			...defaultState,

			setActiveWorkspace: (workspaceId) => set({ workspaceId }),
			setActiveArea: (areaId) => set({ areaId }),

			createWorkspace: (name) => {
				const id = generateId();
				const newWorkspace: Workspace = { id, name, areaIds: [] };
				set((state) => ({ workspaces: [...state.workspaces, newWorkspace] }));
				return newWorkspace;
			},

			createArea: (workspaceId, name) => {
				const id = generateId();
				const newArea: Area = { id, workspaceId, name, projectIds: [] };
				set((state) => ({
					areas: [...state.areas, newArea],
					workspaces: state.workspaces.map((w) =>
						w.id === workspaceId ? { ...w, areaIds: [...w.areaIds, id] } : w,
					),
				}));
				return newArea;
			},

			createProject: (areaId, name) => {
				const id = generateId();
				const newProject: Project = { id, areaId, name, listIds: [] };
				set((state) => ({
					projects: [...state.projects, newProject],
					areas: state.areas.map((a) =>
						a.id === areaId ? { ...a, projectIds: [...a.projectIds, id] } : a,
					),
				}));
				return newProject;
			},

			createList: (name, projectId) => {
				const id = generateId();
				const newList: List = { id, name, projectId, taskIds: [] };
				set((state) => ({
					lists: [...state.lists, newList],
					projects: projectId
						? state.projects.map((p) =>
								p.id === projectId ? { ...p, listIds: [...p.listIds, id] } : p,
							)
						: state.projects,
				}));
				return newList;
			},

			createTask: (listId, content, projectId) => {
				const id = generateId();
				const newTask: Task = {
					id,
					listId,
					projectId,
					content,
					tags: [],
					priority: "media",
					createdAt: new Date().toISOString(),
				};
				set((state) => ({
					tasks: { ...state.tasks, [id]: newTask },
					lists: state.lists.map((l) =>
						l.id === listId ? { ...l, taskIds: [...l.taskIds, id] } : l,
					),
				}));
				return newTask;
			},

			updateTask: (taskId, updates) =>
				set((state) => {
					const existing = state.tasks[taskId];
					if (!existing) return state;
					return {
						tasks: {
							...state.tasks,
							[taskId]: { ...existing, ...updates },
						},
					};
				}),

			deleteTask: (taskId) =>
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;
					const { [taskId]: _, ...remainingTasks } = state.tasks;
					return {
						tasks: remainingTasks,
						lists: state.lists.map((l) =>
							l.id === task.listId
								? { ...l, taskIds: l.taskIds.filter((id) => id !== taskId) }
								: l,
						),
					};
				}),

			toggleTaskComplete: (taskId) =>
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;
					const completedAt = task.completedAt
						? undefined
						: new Date().toISOString();
					return {
						tasks: {
							...state.tasks,
							[taskId]: { ...task, completedAt },
						},
					};
				}),

			moveTask: (taskId, targetListId, newIndex) =>
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;
					const sourceListId = task.listId;

					const updatedLists = state.lists.map((list) => {
						if (list.id === sourceListId && sourceListId !== targetListId) {
							return {
								...list,
								taskIds: list.taskIds.filter((id) => id !== taskId),
							};
						}
						if (list.id === targetListId) {
							const newTaskIds = list.taskIds.filter((id) => id !== taskId);
							newTaskIds.splice(newIndex, 0, taskId);
							return { ...list, taskIds: newTaskIds };
						}
						return list;
					});

					return {
						lists: updatedLists,
						tasks: {
							...state.tasks,
							[taskId]: { ...task, listId: targetListId },
						},
					};
				}),

			updateList: (listId, updates) =>
				set((state) => ({
					lists: state.lists.map((l) =>
						l.id === listId ? { ...l, ...updates } : l,
					),
				})),

			deleteList: (listId) =>
				set((state) => {
					const list = state.lists.find((l) => l.id === listId);
					if (!list) return state;
					const { ...remainingTasks } = state.tasks;
					list.taskIds.forEach((taskId) => {
						delete remainingTasks[taskId];
					});
					return {
						lists: state.lists.filter((l) => l.id !== listId),
						tasks: remainingTasks,
					};
				}),

			updateProject: (projectId, updates) =>
				set((state) => ({
					projects: state.projects.map((p) =>
						p.id === projectId ? { ...p, ...updates } : p,
					),
				})),

			deleteProject: (projectId) =>
				set((state) => {
					const projectTasks = Object.values(state.tasks).filter(
						(t) => t.projectId === projectId,
					);
					const projectTaskIds = projectTasks.map((t) => t.id);
					const remainingTasks: Record<string, Task> = {};
					Object.entries(state.tasks).forEach(([id, task]) => {
						if (!projectTaskIds.includes(id)) {
							remainingTasks[id] = task;
						}
					});
					return {
						projects: state.projects.filter((p) => p.id !== projectId),
						areas: state.areas.map((a) => ({
							...a,
							projectIds: a.projectIds.filter((id) => id !== projectId),
						})),
						tasks: remainingTasks,
					};
				}),

			getTasksByList: (listId) => {
				const state = get();
				const list = state.lists.find((l) => l.id === listId);
				if (!list) return [];
				return list.taskIds
					.map((id) => state.tasks[id])
					.filter((t): t is Task => t !== undefined);
			},

			getListsByProject: (projectId) => {
				const state = get();
				return state.lists.filter((l) => l.projectId === projectId);
			},

			getProjectsByArea: (areaId) => {
				const state = get();
				return state.projects.filter((p) => p.areaId === areaId);
			},

			getAreasByWorkspace: (workspaceId) => {
				const state = get();
				return state.areas.filter((a) => a.workspaceId === workspaceId);
			},

			getTodayTasks: () => {
				const state = get();
				const today = new Date().toISOString().slice(0, 10);
				return Object.values(state.tasks).filter(
					(t) => t.dueDate && t.dueDate.startsWith(today),
				);
			},

			searchTasks: (query) => {
				const state = get();
				const lowerQuery = query.toLowerCase();
				return Object.values(state.tasks).filter(
					(t) =>
						t.content.toLowerCase().includes(lowerQuery) ||
						t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
				);
			},

			getAllTasks: () => {
				const state = get();
				return Object.values(state.tasks);
			},

			getTasksByProject: (projectId) => {
				const state = get();
				return Object.values(state.tasks).filter(
					(t) => t.projectId === projectId,
				);
			},

			getTasksByArea: (areaId) => {
				const state = get();
				const projectIds = state.projects
					.filter((p) => p.areaId === areaId)
					.map((p) => p.id);
				return Object.values(state.tasks).filter(
					(t) => t.projectId && projectIds.includes(t.projectId),
				);
			},

			getTasksByPriority: (priority) => {
				const state = get();
				return Object.values(state.tasks).filter(
					(t) => t.priority === priority,
				);
			},

			getTasksByTag: (tag) => {
				const state = get();
				return Object.values(state.tasks).filter((t) => t.tags.includes(tag));
			},

			getAllTags: () => {
				const state = get();
				const allTags = Object.values(state.tasks).flatMap((t) => t.tags);
				return [...new Set(allTags)];
			},
		}),
		{
			name: "task-board-storage",
		},
	),
);
