import { Smile, Meh, Frown } from "lucide-react"
import type { MoodType } from "@/types/diary"

export const STORAGE_KEYS = {
  METADATA: "diary-metadata",
  NOTES: "diary-notes",
} as const

export const MOOD_OPTIONS: {
  value: MoodType
  label: string
  icon: typeof Smile
  color: string
}[] = [
  { value: "excelente", label: "Excelente", icon: Smile, color: "text-green-600" },
  { value: "bien", label: "Bien", icon: Smile, color: "text-green-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-yellow-600" },
  { value: "mal", label: "Mal", icon: Frown, color: "text-orange-600" },
  { value: "terrible", label: "Terrible", icon: Frown, color: "text-red-600" },
]

export const formatSpanishDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("es-ES", options)
}

export const getDateKey = (date: Date): string => date.toISOString().split("T")[0]

export const getTimeString = (): string => {
  return new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
