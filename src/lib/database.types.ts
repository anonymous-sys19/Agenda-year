export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string | null;
          updated_at: string | null;
          is_online: boolean | null;
          last_seen: string | null;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_online?: boolean | null;
          last_seen?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          is_online?: boolean | null;
          last_seen?: string | null;
        };
      };
      calendar_events: {
        Row: {
          // date: string | number | Date | null;
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          event_date: string;
          created_at: string | null;
          updated_at: string | null;
          category: 'Trabajo' | 'Personal' | 'Iglesia' | 'Other';
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          event_date: string;
          created_at?: string | null;
          updated_at?: string | null;
          category?: 'Trabajo' | 'Personal' | 'Iglesia' | 'Other';
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          created_at?: string | null;
          updated_at?: string | null;
          category?: 'Trabajo' | 'Personal' | 'Iglesia' | 'Other';
        };
      };
    };
  };
}