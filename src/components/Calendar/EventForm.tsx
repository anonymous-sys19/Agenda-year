import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { X, Calendar, Clock, AlignLeft, Tag, Sparkles, CheckCircle2 } from "lucide-react"
import { useCalendarStore } from "../../store/calendar"
import { useAuthStore } from "../../store/auth"
import { toast } from "react-hot-toast"
import type { Database } from "../../lib/database.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"]
type Category = CalendarEvent["category"]

const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: "Trabajo", label: "Trabajo", color: "bg-blue-500" },
  { value: "Personal", label: "Personal", color: "bg-green-500" },
  { value: "Iglesia", label: "Iglesia", color: "bg-purple-500" },
  { value: "Other", label: "Other", color: "bg-gray-500" },
]

interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent
}

export function EventForm({ isOpen, onClose, event }: EventFormProps) {
  const { user } = useAuthStore()
  const { addEvent, updateEvent, selectedDate } = useCalendarStore()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState<Category>("Personal")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || "")
      setDate(new Date(event.event_date).toISOString().split("T")[0])
      setCategory(event.category)
    } else {
      setTitle("")
      setDescription("")
      setDate(selectedDate.toISOString().split("T")[0])
      setCategory("Personal")
    }
  }, [event, selectedDate])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      if (!user) return

      setIsSubmitting(true)

      try {
        const formattedDate = new Date(date)
        formattedDate.setMinutes(formattedDate.getMinutes() + formattedDate.getTimezoneOffset())
        const isoDate = formattedDate.toISOString().split("T")[0]

        if (event) {
          await updateEvent(event.id, {
            title,
            description,
            event_date: isoDate,
            category,
          })
          toast.success("Event updated successfully")
        } else {
          await addEvent({
            user_id: user.id,
            title,
            description,
            event_date: isoDate,
            category,
            created_at: null,
            date: isoDate,
          })
          toast.success("Event created successfully")
        }
        onClose()
      } catch (error) {
        toast.error("Failed to save event")
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [user, date, title, description, category, event, updateEvent, addEvent, onClose],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleSubmit])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#0f0f1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with gradient border */}
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>
              <div className="flex justify-between items-center p-5">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    {event ? "Edit Event" : "New Event"}
                  </h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Title field with icon */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent rounded-lg"
                  required
                  placeholder="Enter event title"
                />
              </div>

              {/* Category field with icon */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  Category
                </label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent rounded-lg">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                    {CATEGORIES.map(({ value, label, color }) => (
                      <SelectItem key={value} value={value} className="focus:bg-white/10">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description field with icon */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-cyan-400" />
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent rounded-lg"
                  placeholder="Add details about your event"
                />
              </div>

              {/* Date field with icon */}
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Date
                </label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent rounded-lg"
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="text-gray-300 bg-white/5 border-white/10 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {event ? "Update" : "Create"}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </div>

              {/* Keyboard shortcut hint */}
              <div className="text-xs text-gray-500 text-center mt-4">
                Pro tip: Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd> to save
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
