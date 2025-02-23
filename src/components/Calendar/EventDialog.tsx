import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Database } from "../../lib/database.types"
import React from "react"

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"]

const CATEGORY_BADGE_COLORS = {
  Trabajo: "bg-blue-900 text-blue-200",
  Personal: "bg-green-900 text-green-200",
  Iglesia: "bg-purple-900 text-purple-200",
  Other: "bg-gray-700 text-gray-200",
} as const

interface EventDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
}

export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  if (!event) return null

  const eventDate = parseISO(event.event_date)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] sm:max-h-screen bg-gray-900 text-white border border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between mt-5">
            <DialogTitle className="text-xl font-semibold text-gray-100">{event.title}</DialogTitle>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BADGE_COLORS[event.category]}`}>
              {event.category}
            </span>
          </div>
          <DialogDescription className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="h-4 w-4" />
            {format(eventDate, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {event.description && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-200">Description</h4>
              <p className="text-sm text-gray-300 space-y-3 w-auto max-h-[400px] overflow-auto scrollbar-hide">
                {event.description.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

