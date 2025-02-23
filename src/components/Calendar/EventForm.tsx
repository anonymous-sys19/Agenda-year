import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { useCalendarStore } from '../../store/calendar';
import { useAuthStore } from '../../store/auth';
import { toast } from 'react-hot-toast';
import type { Database } from '../../lib/database.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
type Category = CalendarEvent['category'];

const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: 'Trabajo', label: 'Trabajo', color: 'bg-blue-500' },
  { value: 'Personal', label: 'Personal', color: 'bg-green-500' },
  { value: 'Iglesia', label: 'Iglesia', color: 'bg-purple-500' },
  { value: 'Other', label: 'Other', color: 'bg-gray-500' },
];

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
}

export function EventForm({ isOpen, onClose, event }: EventFormProps) {
  const { user } = useAuthStore();
  const { addEvent, updateEvent, selectedDate } = useCalendarStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<Category>('Personal');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setDate(new Date(event.event_date).toISOString().split('T')[0]);
      setCategory(event.category);
    } else {
      setTitle('');
      setDescription('');
      setDate(selectedDate.toISOString().split('T')[0]);
      setCategory('Personal');
    }
  }, [event, selectedDate]);

  // Wrap handleSubmit in useCallback to stabilize the function reference
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!user) return;

      try {
        const formattedDate = new Date(date);
        formattedDate.setMinutes(formattedDate.getMinutes() + formattedDate.getTimezoneOffset());
        const isoDate = formattedDate.toISOString().split('T')[0];

        if (event) {
          await updateEvent(event.id, {
            title,
            description,
            event_date: isoDate,
            category,
          });
          toast.success('Event updated successfully');
        } else {
          await addEvent({
            user_id: user.id,
            title,
            description,
            event_date: isoDate,
            category,
            created_at: null,
          });
          toast.success('Event created successfully');
        }
        onClose();
      } catch (error) {
        toast.error('Failed to save event');
        console.error(error);
      }
    },
    [user, date, title, description, category, event, updateEvent, addEvent, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleSubmit]); // handleSubmit is now stable thanks to useCallback

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md transform transition-all text-white">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">
            {event ? 'Edit Event' : 'New Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-300">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full bg-gray-800 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-300">
              Category
            </label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {CATEGORIES.map(({ value, label, color }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-300" />
            Description

            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full bg-gray-800 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-300" />
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full bg-gray-800 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}