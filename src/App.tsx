import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { Calendar } from './components/Calendar';
import { useAuthStore } from './store/auth';
import { supabase } from './lib/supabase';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchedulePage from './routes/page';
import { ScheduleForm } from './routes/components/ScheduleForm';
import PublicSchedule from './routes/schedule/ScheduleView.tsx';
import { HelmetProvider } from 'react-helmet-async';
function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser(data);
            }
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser(data);
            }
          });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);




  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          {!user ? (
            <Routes>
              <Route path="/schedule/:slug" element={<PublicSchedule />} />
              <Route path="*" element={<AuthForm />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/schedule/:slug" element={<PublicSchedule />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/form-schedule" element={<ScheduleForm />} />
              <Route path="/" element={<Calendar />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;