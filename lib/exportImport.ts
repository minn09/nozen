import type { DayMetadata } from "@/types/diary"
import { exportToTxt } from "./exportTxt"

export type MetadataRecord = Record<string, DayMetadata>
export type NotesRecord = Record<string, string>

export interface ExportData {
  metadata: MetadataRecord
  notes: NotesRecord
  exportDate: string
  version: string
}

export function exportToJson(metadata: MetadataRecord, notes: NotesRecord): void {
  const data: ExportData = {
    metadata,
    notes,
    exportDate: new Date().toISOString(),
    version: "1.0",
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `diario-export-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToTxtFile(metadata: MetadataRecord, notes: NotesRecord): void {
  const txt = exportToTxt(metadata, notes)
  const blob = new Blob([txt], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `diario-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importFromJson(
  file: File,
  onSuccess: (data: ExportData) => void,
  onError: (message: string) => void
): void {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      if (json.metadata && json.notes) {
        onSuccess(json as ExportData)
      } else {
        onError("El archivo no tiene el formato correcto.")
      }
    } catch {
      onError("Error al leer el archivo JSON.")
    }
  }
  reader.onerror = () => onError("Error al leer el archivo.")
  reader.readAsText(file)
}
