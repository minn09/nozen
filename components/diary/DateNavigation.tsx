"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, PanelLeftOpen, PanelRightOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDiaryStore } from "@/lib/store"
import { useNoteStore } from "@/store/note"
import { formatSpanishDate, getDateKey } from "@/lib/constants"

export function DateNavigation() {
  const { 
    currentDate, 
    direction, 
    navigateDay, 
    leftSidebarOpen, 
    rightSidebarOpen,
    setLeftSidebarOpen,
    setRightSidebarOpen 
  } = useDiaryStore()

  const { activeNoteId, setActiveNote, notes } = useNoteStore()

  const dateKey = getDateKey(currentDate)
  const activeNote = activeNoteId ? notes[activeNoteId] : null

  const handleBackToDiary = () => {
    setActiveNote(null)
  }

  return (
    <header className="border-b border-border px-4 py-4 flex items-center justify-between shrink-0 gap-4">
      <div className="flex items-center gap-2">
        {!leftSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftSidebarOpen(true)}
            className="text-foreground hover:bg-accent"
            aria-label="Abrir menú lateral"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </Button>
        )}
        {activeNote ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDiary}
            className="text-foreground hover:bg-accent"
            aria-label="Volver al diario"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDay(-1)}
            className="text-foreground hover:bg-accent"
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {activeNote ? (
          <motion.h2
            key="note-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl font-medium text-foreground truncate max-w-[300px]"
          >
            {activeNote.title}
          </motion.h2>
        ) : (
          <motion.h2
            key={dateKey}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-medium text-foreground capitalize"
          >
            {formatSpanishDate(currentDate)}
          </motion.h2>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {activeNote ? (
          <div className="w-9" />
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(1)}
              className="text-foreground hover:bg-accent"
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            {!rightSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRightSidebarOpen(true)}
                className="text-foreground hover:bg-accent"
                aria-label="Abrir panel de detalles"
              >
                <PanelRightOpen className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  )
}
