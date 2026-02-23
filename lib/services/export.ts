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

function serializeToJson(metadata: MetadataRecord, notes: NotesRecord): ExportData {
  return {
    metadata,
    notes,
    exportDate: new Date().toISOString(),
    version: "1.0",
  }
}

function generateJsonBlob(data: ExportData): Blob {
  return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
}

function generateTxtBlob(text: string): Blob {
  return new Blob([text], { type: "text/plain" })
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function getExportFilename(extension: string): string {
  const date = new Date().toISOString().split("T")[0]
  return `diario-export-${date}.${extension}`
}

export function exportToJson(metadata: MetadataRecord, notes: NotesRecord): void {
  const data = serializeToJson(metadata, notes)
  const blob = generateJsonBlob(data)
  const filename = getExportFilename("json")
  downloadBlob(blob, filename)
}

export function exportToTxtFile(metadata: MetadataRecord, notes: NotesRecord): void {
  const txt = exportToTxt(metadata, notes)
  const blob = generateTxtBlob(txt)
  const date = new Date().toISOString().split("T")[0]
  downloadBlob(blob, `diario-${date}.txt`)
}
