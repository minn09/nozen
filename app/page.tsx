"use client"

import { useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDiaryStore } from "@/lib/store/diary"
import { useUIStore } from "@/lib/store/ui"
import { LeftSidebar } from "@/components/diary/LeftSidebar"
import { RightSidebar } from "@/components/diary/RightSidebar"
import { DateNavigation } from "@/components/diary/DateNavigation"
import { WritingArea } from "@/components/diary/WritingArea"
import { MoodDialog } from "@/components/diary/MoodDialog"

export default function AgendaPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    setLeftSidebarOpen,
    setRightSidebarOpen,
    setIsMobile,
  } = useUIStore()

  const {
    loadFromStorage,
    saveMetadataToStorage,
    saveNotesToStorage,
    navigateDay,
    metadata,
    noteContent,
  } = useDiaryStore()

  useEffect(() => {
    setIsMobile(isMobile)
  }, [isMobile, setIsMobile])

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    saveMetadataToStorage()
  }, [metadata, saveMetadataToStorage])

  useEffect(() => {
    saveNotesToStorage()
  }, [noteContent, saveNotesToStorage])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (document.activeElement instanceof HTMLTextAreaElement || document.activeElement instanceof HTMLInputElement) {
      return
    }

    if (e.key === "ArrowLeft") {
      navigateDay(-1)
    } else if (e.key === "ArrowRight") {
      navigateDay(1)
    } else if (e.key.toLowerCase() === "t") {
      useDiaryStore.getState().setCurrentDate(new Date())
    }
  }, [navigateDay])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      <AnimatePresence initial={false}>
        {leftSidebarOpen && (
          <>
            <LeftSidebar />
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLeftSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
              />
            )}
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative min-w-0">
        <DateNavigation />
        <WritingArea />
      </main>

      <AnimatePresence initial={false}>
        {rightSidebarOpen && (
          <>
            <RightSidebar />
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRightSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
              />
            )}
          </>
        )}
      </AnimatePresence>

      <MoodDialog />
    </div>
  )
}
