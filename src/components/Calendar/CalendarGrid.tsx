import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import {  ChevronLeft, ChevronRight } from "lucide-react"
import { useCalendarStore } from "../../store/calendar"

import { useState } from "react"
import { EventForm } from "./EventForm"
import { EventDialog } from "./EventDialog"
import { CalendarEvent } from "."

// const CATEGORY_COLORS = {
//   Trabajo: "bg-blue-500",
//   Personal: "bg-green-500",
//   Iglesia: "bg-purple-500",
//   Other: "bg-gray-500",
// } as const
// Actualiza también los colores de categoría para que coincidan con el tema
const CATEGORY_COLORS = {
  Trabajo: "bg-gradient-to-r from-blue-600 to-blue-400",
  Personal: "bg-gradient-to-r from-cyan-600 to-cyan-400",
  Iglesia: "bg-gradient-to-r from-purple-600 to-purple-400",
  Other: "bg-gradient-to-r from-gray-600 to-gray-400",
} as const


interface CalendarGridProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarGrid({ currentDate, onDateChange }: CalendarGridProps) {
  const { events, selectedDate, setSelectedDate } = useCalendarStore()
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(undefined)
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null);
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.event_date)
      return isSameDay(eventDate, date)
    })
  }

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
    setSelectedEvent(undefined);
  };


  return (
    <div className="bg-[#0f0f1e]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 group"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          </button>
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 group"
          >
            <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-cyan-400 py-2">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isSelected = isSameDay(day, selectedDate)
          const dayEvents = getEventsForDate(day)
          const dayIsToday = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`
                relative h-16 p-1 text-sm rounded-xl transition-all duration-300
                border border-white/10 backdrop-blur-sm
                ${isCurrentMonth ? "bg-white/5" : "bg-white/[0.02]"}
                ${isSelected ? "ring-2 ring-cyan-400/50 border-cyan-400" : ""}
                ${dayIsToday ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20" : ""}
                hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10
                group
              `}
            >
              <span
                className={`
                  ${isCurrentMonth ? "text-gray-100" : "text-gray-500"}
                  ${isSelected ? "text-cyan-400" : ""}
                  ${dayIsToday ? "font-bold text-cyan-400" : ""}
                  group-hover:text-cyan-300
                `}
              >
                {format(day, "d")}
              </span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div 
                      key={event.id} 
                      className={`
                        w-1.5 h-1.5 rounded-full 
                        ${CATEGORY_COLORS[event.category]}
                        shadow-glow
                      `} 
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <EventForm isOpen={isEventFormOpen} onClose={handleCloseEventForm} event={selectedEvent} />
      <EventDialog event={viewEvent} isOpen={!!viewEvent} onClose={() => setViewEvent(null)} />
    </div>
  )
}

