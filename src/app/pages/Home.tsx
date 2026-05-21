import { Link } from 'react-router-dom';

import {
  Bell,
  Dog,
  Syringe,
  CalendarIcon,
  FileText,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

import { useDogs } from '../context/DogsContext';

export default function Home() {

  const { dogs } = useDogs();

  // SOLO MOSTRAR 3
  const displayDogs = dogs.slice(0, 3);

  // VACUNAS DINÁMICAS
  const upcomingVaccines = dogs.flatMap(
    (dog: any) =>
      dog.appointments?.map((item: any, index: number) => ({
        id: `${dog.id}-vac-${index}`,
        ...item,
        dog: dog.name
      })) || []
  );

  // EVENTOS DINÁMICOS
  const upcomingEvents = dogs.flatMap(
    (dog: any) => [

      ...(dog.litters?.map((item: any, index: number) => ({
        id: `${dog.id}-lit-${index}`,
        title: item.title || `Camada - ${dog.name}`,
        date: item.date,
        dog: dog.name
      })) || []),

      ...(dog.events?.map((item: any, index: number) => ({
        id: `${dog.id}-event-${index}`,
        title: item.title,
        date: item.date,
        dog: dog.name
      })) || [])

    ]
  );

  // DOCUMENTOS DINÁMICOS
  const pendingDocs = dogs.flatMap(
    (dog: any) =>
      dog.documents?.map((item: any, index: number) => ({
        id: `${dog.id}-doc-${index}`,
        ...item,
        dog: dog.name
      })) || []
  );

  return (

    <div className="min-h-screen bg-slate-900">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-white text-2xl mb-1">
              Resumen
            </h1>

            <p className="text-slate-300 text-sm">
              Vista general de tu criadero
            </p>

          </div>

          <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center relative hover:bg-slate-600 transition-colors">

            <Bell className="w-5 h-5 text-white" />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

          </button>

        </div>

      </div>

      {/* CONTENT */}
      <div className="px-6 py-4 space-y-4">

        {/* PERROS */}
        <Link
          to="/dogs"
          className="block bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 hover:border-blue-500/40 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.99]"
        >

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">

              <Dog className="w-6 h-6 text-white" />

            </div>

            <div className="flex-1">

              <h2 className="text-white text-lg">
                Mis Perros
              </h2>

              <p className="text-blue-300 text-sm">
                {dogs.length} perros registrados
              </p>

            </div>

            <ChevronRight className="w-5 h-5 text-blue-400" />

          </div>

          {/* SI NO HAY PERROS */}
          {dogs.length === 0 ? (

            <div className="bg-slate-700/30 rounded-xl border border-dashed border-slate-600 p-6 text-center">

              <Dog className="w-10 h-10 text-slate-500 mx-auto mb-3" />

              <p className="text-slate-300 text-sm mb-1">
                Todavía no tienes perros registrados
              </p>

              <p className="text-slate-500 text-xs">
                Añade tu primer perro para comenzar
              </p>

            </div>

          ) : (

            <div className="flex gap-2 overflow-x-auto pb-1">

              {displayDogs.map((dog) => (

                <div
                  key={dog.id}
                  className="flex-shrink-0 bg-slate-700/40 rounded-lg p-3 border border-slate-600/40 min-w-[140px]"
                >

                  <div className="w-full h-20 rounded-lg overflow-hidden mb-2 bg-slate-700">

                    <img
                      src={dog.image}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <p className="text-white text-sm">
                    {dog.name}
                  </p>

                  <p className="text-slate-300 text-xs">
                    {dog.status}
                  </p>

                </div>

              ))}

            </div>

          )}

        </Link>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* VACUNAS */}
          <Link
            to="/calendar"
            className="block bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 hover:border-green-500/40 hover:bg-slate-800/80 transition-all"
          >

            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">

                <Syringe className="w-6 h-6 text-white" />

              </div>

              <div className="flex-1">

                <h2 className="text-white text-lg">
                  Vacunas
                </h2>

                <p className="text-green-300 text-sm">
                  {upcomingVaccines.length} próximas
                </p>

              </div>

            </div>

            {upcomingVaccines.length === 0 ? (

              <div className="bg-slate-700/30 rounded-xl border border-dashed border-slate-600 p-4 text-center">

                <p className="text-slate-400 text-sm">
                  No hay vacunas pendientes
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {upcomingVaccines.slice(0, 2).map((vaccine) => (

                  <div
                    key={vaccine.id}
                    className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/40"
                  >

                    {vaccine.urgent && (

                      <AlertCircle className="w-4 h-4 text-red-400 mb-1" />

                    )}

                    <p className="text-white text-sm font-medium">
                      {vaccine.dog}
                    </p>

                    <p className="text-slate-300 text-xs">
                      {vaccine.vaccine}
                    </p>

                    <p className="text-slate-400 text-xs mt-1">
                      {vaccine.date}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </Link>

          {/* EVENTOS */}
          <Link
            to="/calendar"
            className="block bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 hover:border-purple-500/40 hover:bg-slate-800/80 transition-all"
          >

            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">

                <CalendarIcon className="w-6 h-6 text-white" />

              </div>

              <div className="flex-1">

                <h2 className="text-white text-lg">
                  Eventos
                </h2>

                <p className="text-purple-300 text-sm">
                  {upcomingEvents.length} próximos
                </p>

              </div>

            </div>

            {upcomingEvents.length === 0 ? (

              <div className="bg-slate-700/30 rounded-xl border border-dashed border-slate-600 p-4 text-center">

                <p className="text-slate-400 text-sm">
                  No hay eventos próximos
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {upcomingEvents.slice(0, 2).map((event) => (

                  <div
                    key={event.id}
                    className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/40"
                  >

                    <p className="text-white text-sm font-medium">
                      {event.title}
                    </p>

                    <p className="text-slate-300 text-xs mt-1">
                      {event.date}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </Link>

        </div>

        {/* DOCUMENTOS */}
        <Link
          to="/documents"
          className="block bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 hover:border-orange-500/40 hover:bg-slate-800/80 transition-all"
        >

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">

              <FileText className="w-6 h-6 text-white" />

            </div>

            <div className="flex-1">

              <h2 className="text-white text-lg">
                Documentos
              </h2>

              <p className="text-orange-300 text-sm">
                {pendingDocs.length} registrados
              </p>

            </div>

            <ChevronRight className="w-5 h-5 text-orange-400" />

          </div>

          {pendingDocs.length === 0 ? (

            <div className="bg-slate-700/30 rounded-xl border border-dashed border-slate-600 p-4 text-center">

              <p className="text-slate-400 text-sm">
                No tienes documentos todavía
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-2">

              {pendingDocs.slice(0, 4).map((doc) => (

                <div
                  key={doc.id}
                  className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/40"
                >

                  <p className="text-white text-sm mb-2 truncate">
                    {doc.title || doc.name}
                  </p>

                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    Guardado
                  </span>

                </div>

              ))}

            </div>

          )}

        </Link>

      </div>

    </div>
  );
}