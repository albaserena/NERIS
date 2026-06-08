import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './components/Layout';

import Home from './pages/Home';
import Dogs from './pages/Dogs';
import DogDetail from './pages/DogDetail';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

import { useAuth } from './context/AuthContext';

export default function App() {

  const { user, loading } = useAuth();

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Cargando...</p>
      </div>
    );

  }

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="/auth"
        element={
          !user
            ? <Auth />
            : <Navigate to="/" replace />
        }
      />

      {/* APP PRIVADA */}
      {user && (

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/dogs/:id" element={<DogDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      )}

      {/* REDIRECCIÓN AUTOMÁTICA */}
      <Route
        path="*"
        element={
          <Navigate
            to={user ? '/' : '/auth'}
            replace
          />
        }
      />
    </Routes>

  );
}