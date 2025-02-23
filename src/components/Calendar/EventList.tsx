import { format, isPast, parseISO } from "date-fns"
import { Edit2, Trash2, CalendarIcon, InfoIcon } from "lucide-react"
import { useCalendarStore } from "../../store/calendar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Database } from "../../lib/database.types"

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"]

const CATEGORY_COLORS = {
  Trabajo: "border-blue-500 bg-blue-900/30",
  Personal: "border-green-500 bg-green-900/30",
  Iglesia: "border-purple-500 bg-purple-900/30",
  Other: "border-gray-500 bg-gray-800/50",
} as const

const CATEGORY_TEXT_COLORS = {
  Trabajo: "text-blue-300",
  Personal: "text-green-300",
  Iglesia: "text-purple-300",
  Other: "text-gray-300",
} as const

const CATEGORY_BADGE_COLORS = {
  Trabajo: "bg-blue-900 text-blue-200",
  Personal: "bg-green-900 text-green-200",
  Iglesia: "bg-purple-900 text-purple-200",
  Other: "bg-gray-700 text-gray-200",
} as const

interface EventListProps {
  onEditEvent: (event: CalendarEvent) => void
  onViewEvent: (event: CalendarEvent) => void
  showAllEvents?: boolean
}

export function EventList({ onEditEvent, onViewEvent, showAllEvents = false }: EventListProps) {
  const { events, selectedDate, deleteEvent } = useCalendarStore()

  const filteredEvents = showAllEvents
    ? events.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    : events.filter((event) => {
        const eventDate = parseISO(event.event_date)
        return format(eventDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      })

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id)
    }
  }

  const groupEventsByMonth = (events: CalendarEvent[]) => {
    return events.reduce(
      (groups, event) => {
        const monthYear = format(parseISO(event.event_date), "MMMM yyyy")
        if (!groups[monthYear]) {
          groups[monthYear] = []
        }
        groups[monthYear].push(event)
        return groups
      },
      {} as Record<string, CalendarEvent[]>,
    )
  }

  if (!showAllEvents) {
    return (
      <div className="space-y-4 bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-100">Events for {format(selectedDate, "MMMM d, yyyy")}</h3>

        {filteredEvents.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No events for this date</p>
        ) : (
          <div className="space-y-3 w-auto h-80 overflow-auto scrollbar-hide">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={onEditEvent}
                onView={onViewEvent}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const groupedEvents = groupEventsByMonth(filteredEvents)

  return (
    <div className="space-y-8 bg-gray-900 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-100">All Events</h3>
      <div className="w-auto h-96 overflow-auto scrollbar-hide">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className="space-y-4">
            <h4 className="text-md font-medium text-gray-300 border-b border-gray-700 pb-2">{monthYear}</h4>
            <div className="space-y-3">
              {monthEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={onEditEvent}
                  onView={onViewEvent}
                  onDelete={handleDelete}
                  showDate
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface EventCardProps {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onView: (event: CalendarEvent) => void
  onDelete: (id: string) => void
  showDate?: boolean
}

function EventCard({ event, onEdit, onView, onDelete, showDate = false }: EventCardProps) {
  const eventDate = parseISO(event.event_date)
  const isEventPast = isPast(eventDate)

  return (
    <div
      className={`
      p-4 rounded-lg shadow-md border-l-4 transition-all cursor-pointer
      backdrop-blur-sm backdrop-filter
      ${isEventPast ? "opacity-60" : ""}
      ${CATEGORY_COLORS[event.category]}
    `}
      onClick={() => onView(event)}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <h4 className={`font-medium ${CATEGORY_TEXT_COLORS[event.category]} truncate flex-grow`}>{event.title}</h4>
          <div className="flex items-center space-x-2 ml-2">
            <div className="hidden md:flex ">
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-400 hover:text-gray-100 hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(event)
                }}
              >
                <Edit2 className="h-4 w-4 bg-transparent" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(event.id)
                }}
              >
                <Trash2 className="h-4 w-4 bg-transparent" />
              </Button>
            </div>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InfoIcon className="h-4 w-4 text-red-400 hover:text-red-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation()
                      onEdit(event)
                    }}
                  >
                    <Edit2 className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation()
                      onDelete(event.id)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {showDate && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <CalendarIcon className="h-3 w-3" />
            {format(eventDate, "MMM d, yyyy")}
          </div>
        )}
        {event.description && (
          <p className={`text-sm line-clamp-2 ${isEventPast ? "text-gray-500" : "text-gray-300"}`}>
            {event.description}
          </p>
        )}
        <div className="flex justify-end items-center mt-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BADGE_COLORS[event.category]}`}>
            {event.category}
          </span>
        </div>
      </div>
    </div>
  )
}

