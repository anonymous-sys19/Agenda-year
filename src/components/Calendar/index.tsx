import { useState, useEffect } from 'react';
import { CalendarIcon, Menu } from 'lucide-react';
import { CalendarGrid } from './CalendarGrid';
import { EventList } from './EventList';
import { EventForm } from './EventForm';
import { EventDialog } from './EventDialog';
import { useCalendarStore } from '../../store/calendar';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import type { Database } from '../../lib/database.types';
import Sidebar from '../sidebar';

import { useGesture } from "@use-gesture/react"; // Importamos el hook de gestures


export type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { user, signOut } = useAuthStore();
  const { fetchEvents } = useCalendarStore();

  useEffect(() => {
    if (user) {
      fetchEvents(user.id);
    }
  }, [user, fetchEvents]);

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    setViewEvent(event);
  };

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
    setSelectedEvent(undefined);
  };
  // 

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
// Estados para manejar los temporizadores
const [openPressTimer, setOpenPressTimer] = useState<NodeJS.Timeout | null>(null);
const [closePressTimer, setClosePressTimer] = useState<NodeJS.Timeout | null>(null);


// Detectamos la tecla de espacio (abre el formulario) y escape (cierra el formulario)
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      setIsEventFormOpen(true);
    } else if (event.code === "Escape") {
      setIsEventFormOpen(false);
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => {
    window.removeEventListener("keydown", handleKeyPress);
  };
}, []);



// Gestos de mantener presionado para abrir el formulario
const bindPress = useGesture({
  onPointerDown: () => {
    if (!isEventFormOpen) { // Solo abrir si está cerrado
      const timer = setTimeout(() => {
        setIsEventFormOpen(true);
      }, 500); // 0.50 segundos para abrir
      setOpenPressTimer(timer);
    }
  },
  onPointerUp: () => {
    if (openPressTimer) {
      clearTimeout(openPressTimer);
      setOpenPressTimer(null);
    }
  },
  onPointerCancel: () => {
    if (openPressTimer) {
      clearTimeout(openPressTimer);
      setOpenPressTimer(null);
    }
  },
});

// Gestos de mantener presionado para cerrar el formulario
const bindLongPress = useGesture({
  onPointerDown: () => {
    if (isEventFormOpen) { // Solo cerrar si está abierto
      const timer = setTimeout(() => {
        setIsEventFormOpen(false);
      }, 700); // 0.70 segundos para cerrar
      setClosePressTimer(timer);
    }
  },
  onPointerUp: () => {
    if (closePressTimer) {
      clearTimeout(closePressTimer);
      setClosePressTimer(null);
    }
  },
  onPointerCancel: () => {
    if (closePressTimer) {
      clearTimeout(closePressTimer);
      setClosePressTimer(null);
    }
  },
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white"

    >
      <div className="flex">
        <Sidebar
          user={{ display_name: user?.display_name || '', avatar_url: user?.avatar_url || '' }}
          onNewEvent={() => setIsEventFormOpen(true)}
          onSignOut={signOut}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1"
          {...bindPress()} // Aplicamos el gesto de mantener presionado para abrir
          {...bindLongPress()} // Aplicamos el gesto de mantener presionado para cerrar
        // Asegúrate de que el div ocupe toda la pantalla
        >

          <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden"
                  >
                    <Menu className="h-6 w-6 text-white" />
                  </Button>
                  <CalendarIcon className="h-8 w-8 text-indigo-400" />
                  <h1 className="text-2xl font-bold text-white">TU AGENDA {new Date().getFullYear()} 👌</h1>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 "  >
            {!isEventFormOpen && (
              // Si el formulario no está abierto, mostramos el botón flotante
              <div className="fixed bottom-32 right-4 z-40">

                <Button
                  variant="default"
                  size="icon"
                  onClick={() => setIsEventFormOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <CalendarIcon className="h-7 w-7 text-white" />
                </Button>
              </div>
            )}
            {/* Aquí puedes agregar el resto de tu aplicación */}
            {isEventFormOpen && (
              <EventForm onClose={() => setIsEventFormOpen(false)} isOpen={true} />
            )}



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-black/30 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10">
                <CalendarGrid currentDate={currentDate} onDateChange={setCurrentDate} />
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-indigo-900/50">
                    <TabsTrigger value="daily" className="px-3 py-2 data-[state=active]:bg-indigo-600">
                      Daily View
                    </TabsTrigger>
                    <TabsTrigger value="all" className="px-3 py-2 data-[state=active]:bg-indigo-600">
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
  );
}