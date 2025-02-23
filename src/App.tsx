import  { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { Calendar } from './components/Calendar';
import { useAuthStore } from './store/auth';
import { supabase } from './lib/supabase';

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



  // 


  // 


  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {!user ? <AuthForm /> :
        <>
          
          <Calendar />


        </>

      }
    </div>
  );
}

export default App;