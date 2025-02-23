import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
  loading: boolean;
  setSelectedDate: (date: Date) => void;
  fetchEvents: (userId: string) => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'updated_at'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  selectedDate: new Date(new Date().getTime()), // Inicializa con la fecha actual sin hora
  loading: false,
  setSelectedDate: (date) => {
    const normalizedDate = new Date(date.getTime()); // Normaliza la fecha sin hora
    set({ selectedDate: normalizedDate });
  },
  fetchEvents: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    set({ events: data || [], loading: false });
  },
  addEvent: async (event) => {
    const adjustedEvent = {
      ...event,
      event_date: event.event_date ? new Date(event.event_date) : new Date(), // Guarda en UTC
    };

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([adjustedEvent])
      .select()
      .single();

    if (error) throw error;
    set({ events: [...get().events, data] });
  },
  updateEvent: async (id, event) => {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set({
      events: get().events.map((e) => (e.id === id ? data : e)),
    });
  },
  deleteEvent: async (id) => {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set({
      events: get().events.filter((e) => e.id !== id),
    });
  },
}));