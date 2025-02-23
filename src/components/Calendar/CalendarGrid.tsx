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

const CATEGORY_COLORS = {
  Trabajo: "bg-blue-500",
  Personal: "bg-green-500",
  Iglesia: "bg-purple-500",
  Other: "bg-gray-500",
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
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 text-white">
      {/* <div className="fixed bottom-4 right-4 z-40">

        <Button
          variant="default"
          size="icon"
          onClick={() => setIsEventFormOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <CalendarIcon className="h-6 w-6 text-white" />
        </Button>
      </div> */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>

      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
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
                relative h-14 p-1 text-sm border rounded-md transition-all duration-200
                ${isCurrentMonth ? "bg-gray-800" : "bg-gray-900"}
                ${isSelected ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-700"}
                ${dayIsToday ? "font-bold bg-gray-700" : ""}
                hover:bg-gray-700 cursor-pointer
              `}
            >
              <span
                className={`
                ${isCurrentMonth ? "text-gray-100" : "text-gray-500"}
                ${isSelected ? "text-indigo-300" : ""}
                ${dayIsToday ? "text-indigo-300" : ""}
              `}
              >
                {format(day, "d")}
              </span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[event.category]}`} />
                  ))}
                  {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
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


