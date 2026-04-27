export type MoodType =
	| "excelente"
	| "bien"
	| "neutral"
	| "mal"
	| "terrible"
	| null;
export type StatusChange = "mejor" | "igual" | "peor" | null;

export interface StatusCheck {
	time: string;
	status: StatusChange;
	note?: string;
}

export interface DayMetadata {
	mood: MoodType;
	statusChecks: StatusCheck[];
	energy: number | null;
	tags: string[];
}
