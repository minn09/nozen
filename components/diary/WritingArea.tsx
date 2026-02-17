"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useDiaryStore } from "@/lib/store"
import { getDateKey } from "@/lib/constants"

export function WritingArea() {
  const { currentDate, direction, noteContent, updateNote } = useDiaryStore()

  const dateKey = getDateKey(currentDate)
  const content = noteContent[dateKey] || ""

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={dateKey}
          initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <textarea
            value={content}
            onChange={(e) => updateNote(e.target.value)}
            placeholder="Escribe aquí tus pensamientos del día..."
            className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg leading-relaxed p-0"
            style={{ fontFamily: "inherit" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
