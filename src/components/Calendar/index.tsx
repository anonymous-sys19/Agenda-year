import { useState, useEffect } from "react"
import { CalendarIcon, Menu, Plus } from "lucide-react"
import { CalendarGrid } from "./CalendarGrid"
import { EventList } from "./EventList"
import { EventForm } from "./EventForm"
import { EventDialog } from "./EventDialog"
import { useCalendarStore } from "../../store/calendar"
import { useAuthStore } from "../../store/auth"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import type { Database } from "../../lib/database.types"
import Sidebar from "../sidebar"

export type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>()
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null)
  const [activeTab, setActiveTab] = useState("daily")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)

  const { user, signOut } = useAuthStore()
  const { fetchEvents } = useCalendarStore()

  useEffect(() => {
    if (user) {
      fetchEvents(user.id)
    }
  }, [user, fetchEvents])

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventFormOpen(true)
  }

  const handleViewEvent = (event: CalendarEvent) => {
    setViewEvent(event)
  }

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false)
    setSelectedEvent(undefined)
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsEventFormOpen(true)
      } else if (event.code === "Escape") {
        setIsEventFormOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white overflow-hidden">
      <div className="flex">
        <Sidebar
          user={{ display_name: user?.display_name || "", avatar_url: user?.avatar_url || "" }}
          onNewEvent={() => setIsEventFormOpen(true)}
          onSignOut={signOut}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 relative">
          {/* Animated background with enhanced effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
          <div className="absolute inset-0 backdrop-blur-3xl"></div>

          {/* Header with glass effect */}
          <header className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <CalendarIcon className="h-8 w-8 text-cyan-400" />
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    TU AGENDA {new Date().getFullYear()} 👌
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Main content with enhanced glass effects */}
          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!isEventFormOpen && (
              <div className="fixed bottom-32 right-4 z-40">
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => setIsEventFormOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors duration-300">
                <CalendarGrid currentDate={currentDate} onDateChange={setCurrentDate} />
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors duration-300">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-black/20">
                    <TabsTrigger
                      value="daily"
                      className="px-3 py-2 data-[state=active]:bg-gradient-to-r from-blue-600 to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 transition-all duration-300"
                    >
                      Daily View
                    </TabsTrigger>
                    <TabsTrigger
                      value="all"
                      className="px-3 py-2 data-[state=active]:bg-gradient-to-r from-blue-600 to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 transition-all duration-300"
                    >
                      All Events
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily" className="p-4">
                    <EventList onEditEvent={handleEditEvent} onViewEvent={handleViewEvent} />
                  </TabsContent>
                  <TabsContent value="all" className="p-4">
                    <EventList onEditEvent={handleEditEvent} onViewEvent={handleViewEvent} showAllEvents />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>

          <EventForm isOpen={isEventFormOpen} onClose={handleCloseEventForm} event={selectedEvent} />
          <EventDialog event={viewEvent} isOpen={!!viewEvent} onClose={() => setViewEvent(null)} />
        </div>
      </div>
    </div>
  )
}
