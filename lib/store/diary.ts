import { create } from "zustand"
import type { DayMetadata, MoodType, StatusChange } from "@/types/diary"
import { getDateKey, getTimeString } from "../utils/date"
import { useUIStore } from "./ui"
import {
  loadMetadataFromStorage,
  loadNotesFromStorage,
  saveMetadataToStorage,
  saveNotesToStorage,
} from "../services/storage"

interface DiaryState {
  currentDate: Date
  direction: number
  pendingStatus: StatusChange
  statusNote: string
  metadata: Record<string, DayMetadata>
  noteContent: Record<string, string>

  setCurrentDate: (date: Date) => void
  setDirection: (dir: number) => void
  navigateDay: (delta: number) => void
  setPendingStatus: (status: StatusChange) => void
  setStatusNote: (note: string) => void

  getCurrentMetadata: () => DayMetadata

  updateMood: (mood: MoodType) => void
  addStatusCheck: () => void
  handleStatusClick: (status: StatusChange) => void

  setNoteContent: (content: Record<string, string>) => void
  updateNote: (content: string) => void

  loadFromStorage: () => void
  saveMetadataToStorage: () => void
  saveNotesToStorage: () => void
}

const getDefaultMetadata = (): DayMetadata => ({
  mood: null,
  statusChecks: [],
  energy: null,
  tags: [],
})

export const useDiaryStore = create<DiaryState>((set, get) => ({
  currentDate: new Date(),
  direction: 0,
  pendingStatus: null,
  statusNote: "",
  metadata: {},
  noteContent: {},

  setCurrentDate: (date) => set({ currentDate: date }),
  setDirection: (dir) => set({ direction: dir }),

  navigateDay: (delta) =>
    set((state) => ({
      direction: delta,
      currentDate: new Date(
        state.currentDate.getFullYear(),
        state.currentDate.getMonth(),
        state.currentDate.getDate() + delta
      ),
    })),

  setPendingStatus: (status) => set({ pendingStatus: status }),
  setStatusNote: (note) => set({ statusNote: note }),

  getCurrentMetadata: () => {
    const { currentDate, metadata } = get()
    const key = getDateKey(currentDate)
    return metadata[key] || getDefaultMetadata()
  },

  updateMood: (mood) =>
    set((state) => {
      const key = getDateKey(state.currentDate)
      const current = state.metadata[key] || getDefaultMetadata()
      return {
        metadata: {
          ...state.metadata,
          [key]: { ...current, mood },
        },
      }
    }),

  addStatusCheck: () =>
    set((state) => {
      const { pendingStatus, statusNote } = state
      if (!pendingStatus) return state

      const key = getDateKey(state.currentDate)
      const current = state.metadata[key] || getDefaultMetadata()

      useUIStore.getState().setIsMoodDialogOpen(false)

      return {
        metadata: {
          ...state.metadata,
          [key]: {
            ...current,
            statusChecks: [
              ...current.statusChecks,
              { time: getTimeString(), status: pendingStatus, note: statusNote },
            ],
          },
        },
        pendingStatus: null,
        statusNote: "",
      }
    }),

  handleStatusClick: (status) => {
    set({ pendingStatus: status, statusNote: "" })
    useUIStore.getState().setIsMoodDialogOpen(true)
  },

  setNoteContent: (content) => set({ noteContent: content }),

  updateNote: (content) =>
    set((state) => {
      const key = getDateKey(state.currentDate)
      return {
        noteContent: {
          ...state.noteContent,
          [key]: content,
        },
      }
    }),

  loadFromStorage: () => {
    if (typeof window === "undefined") return
    try {
      const metadata = loadMetadataFromStorage()
      const notes = loadNotesFromStorage()
      set({ metadata, noteContent: notes })
    } catch (e) {
      console.error("Failed to load from storage:", e)
    }
  },

  saveMetadataToStorage: () => {
    const { metadata } = get()
    saveMetadataToStorage(metadata)
  },

  saveNotesToStorage: () => {
    const { noteContent } = get()
    saveNotesToStorage(noteContent)
  },
}))
