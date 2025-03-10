import { format, parseISO } from "date-fns"
import { CalendarIcon, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import type { Database } from "../../lib/database.types"
import React from "react"

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"]

const CATEGORY_BADGE_COLORS = {
  Trabajo: "bg-gradient-to-r from-blue-600 to-blue-400 text-white",
  Personal: "bg-gradient-to-r from-cyan-600 to-cyan-400 text-white",
  Iglesia: "bg-gradient-to-r from-purple-600 to-purple-400 text-white",
  Other: "bg-gradient-to-r from-gray-600 to-gray-400 text-white",
} as const
interface EventDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
}
export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  if (!event) return null

  const eventDate = parseISO(event.event_date)

  const handleShare = () => {
    const formattedText = `
📅 *${event.title}*
📌 ${event.category}
📆 ${format(eventDate, "MMMM d, yyyy")}
${event.description ? `\n📝 ${event.description}` : ''}

_Shared from Agenda 2025_
    `.trim()

    navigator.clipboard.writeText(formattedText)
    toast.success("Content copied to clipboard!")

    // Open WhatsApp with formatted text
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(formattedText)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] sm:max-h-screen bg-[#0f0f1e]/80 backdrop-blur-xl text-white border border-white/10 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mt-5">
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {event.title}
            </DialogTitle>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-xl text-xs font-medium ${CATEGORY_BADGE_COLORS[event.category]} shadow-lg`}>
                {event.category}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300 rounded-xl border border-white/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          <DialogDescription className="flex items-center gap-2 text-sm text-cyan-400">
            <CalendarIcon className="h-4 w-4" />
            {format(eventDate, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          {event.description && (
            <div className="space-y-4">
              <h4 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Description
              </h4>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-sm text-gray-300 space-y-3 w-auto max-h-[400px] overflow-auto scrollbar-hide">
                  {event.description.split("\n").slice(0, 80).map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
