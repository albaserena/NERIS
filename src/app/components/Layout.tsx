import {
  Outlet,
  Link,
  useLocation
} from 'react-router-dom';

import {
  Home,
  Dog,
  Calendar,
  FileText,
  User
} from 'lucide-react';

export default function Layout() {

  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Inicio'
    },

    {
      path: '/dogs',
      icon: Dog,
      label: 'Perros'
    },

    {
      path: '/calendar',
      icon: Calendar,
      label: 'Agenda'
    },

    {
      path: '/documents',
      icon: FileText,
      label: 'Docs'
    },

    {
      path: '/profile',
      icon: User,
      label: 'Perfil'
    },
  ];

  return (

    <div className="min-h-screen w-full bg-slate-900 flex flex-col">

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto pb-20">

        <Outlet />

      </main>

      {/* NAVBAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700">

        <div className="max-w-lg mx-auto px-4">

          <div className="flex items-center justify-around py-3">

            {navItems.map((item) => {

              const Icon = item.icon;

              const isActive =
                location.pathname === item.path;

              return (

                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-white bg-slate-700'
                      : 'text-slate-300 hover:text-slate-200'
                  }`}
                >

                  <Icon className="w-5 h-5" />

                  <span className="text-xs">
                    {item.label}
                  </span>

                </Link>

              );
            })}

          </div>

        </div>

      </nav>

    </div>

  );
}