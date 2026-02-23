import { Smile, Meh, Frown } from "lucide-react"
import type { MoodType } from "@/types/diary"

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
