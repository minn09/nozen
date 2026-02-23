"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useDiaryStore } from "@/lib/store"
import { useUIStore } from "@/lib/uiStore"
import { MOOD_OPTIONS } from "@/lib/constants"

export function RightSidebar() {
  const { 
    rightSidebarOpen, 
    setRightSidebarOpen, 
    isMobile 
  } = useUIStore()

  const { 
    getCurrentMetadata,
    updateMood,
    handleStatusClick,
  } = useDiaryStore()

  const metadata = getCurrentMetadata()

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0, x: isMobile ? 320 : 0 }}
      animate={{
        width: 320,
        opacity: 1,
        x: 0,
        position: isMobile ? "fixed" : "relative",
        right: 0,
        zIndex: isMobile ? 50 : 0,
        height: "100%",
      }}
      exit={{
        width: 0,
        opacity: 0,
        x: isMobile ? 320 : 0,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-card border-l border-border flex flex-col overflow-hidden shrink-0 shadow-xl"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground">Detalles</h3>
        <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(false)}>
          <PanelRightClose className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-card-foreground">¿Cómo te sientes hoy?</Label>
          <div className="grid grid-cols-2 gap-2">
            {MOOD_OPTIONS.map((option) => {
              const Icon = option.icon
              const isSelected = metadata.mood === option.value
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateMood(option.value)}
                  className={`justify-start gap-2 ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${!isSelected ? option.color : ""}`} />
                  <span className="text-xs">{option.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium text-card-foreground">¿Cómo te encuentras ahora?</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusClick("mejor")}
              className="flex-1 gap-2 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs">Mejor</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusClick("igual")}
              className="flex-1 gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-950"
            >
              <Minus className="w-4 h-4 text-yellow-600" />
              <span className="text-xs">Igual</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusClick("peor")}
              className="flex-1 gap-2 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs">Peor</span>
            </Button>
          </div>

          {metadata.statusChecks.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground">Historial del día:</p>
              <div className="space-y-1.5">
                {metadata.statusChecks.map((check, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-xs bg-accent/50 rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono">{check.time}</span>
                      <span className="text-card-foreground font-medium">
                        {check.status === "mejor" && "📈 Mejor"}
                        {check.status === "igual" && "➡️ Igual"}
                        {check.status === "peor" && "📉 Peor"}
                      </span>
                    </div>
                    {check.note && (
                      <p className="text-muted-foreground italic ml-2 border-l-2 border-primary/20 pl-2">
                        "{check.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium text-card-foreground">Otros detalles</Label>
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="bg-muted/50 rounded-md p-3">
              <p className="font-medium mb-1">Nivel de energía</p>
              <p className="text-muted-foreground">Próximamente...</p>
            </div>
            <div className="bg-muted/50 rounded-md p-3">
              <p className="font-medium mb-1">Etiquetas</p>
              <p className="text-muted-foreground">Próximamente...</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
