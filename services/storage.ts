import type { DayMetadata } from "@/types/diary";

export const STORAGE_KEYS = {
	METADATA: "diary-metadata",
	NOTES: "diary-notes",
} as const;

export function saveToStorage(
	key: string,
	data: Record<string, DayMetadata> | Record<string, string>,
): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage(key: string): Record<string, unknown> {
	if (typeof window === "undefined") return {};
	try {
		const saved = localStorage.getItem(key);
		return saved ? JSON.parse(saved) : {};
	} catch {
		return {};
	}
}

export function saveMetadataToStorage(
	metadata: Record<string, DayMetadata>,
): void {
	saveToStorage(STORAGE_KEYS.METADATA, metadata);
}

export function saveNotesToStorage(notes: Record<string, string>): void {
	saveToStorage(STORAGE_KEYS.NOTES, notes);
}

export function loadMetadataFromStorage(): Record<string, DayMetadata> {
	return loadFromStorage(STORAGE_KEYS.METADATA) as Record<string, DayMetadata>;
}

export function loadNotesFromStorage(): Record<string, string> {
	return loadFromStorage(STORAGE_KEYS.NOTES) as Record<string, string>;
}
