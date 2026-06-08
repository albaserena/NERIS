import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Edit2,
  Trash2
} from 'lucide-react';

import EditEventModal from '../components/EditEventModal';
import { useDogs } from '../context/DogsContext';

export default function Calendar() {
  
  // FECHA ACTUAL REAL
  const { dogs, updateDog } = useDogs();
  const location = useLocation();

  const eventDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : new Date();

  const today = eventDate;
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>(() => {
    const stored = localStorage.getItem('neris_calendar_events');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('neris_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseEventDate = (date: string | number | undefined): Date | null => {
    if (typeof date === 'number') {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    }

    if (!date) return null;

    const dateString = String(date).trim();

    const isoMatch = dateString.match(/^\d{4}-\d{2}-\d{2}$/);
    if (isoMatch) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const fullIsoDate = new Date(dateString);
    if (!isNaN(fullIsoDate.getTime())) {
      return new Date(fullIsoDate.getFullYear(), fullIsoDate.getMonth(), fullIsoDate.getDate());
    }

    const months: { [key: string]: number } = {
      'Enero': 0,
      'Febrero': 1,
      'Marzo': 2,
      'Abril': 3,
      'Mayo': 4,
      'Junio': 5,
      'Julio': 6,
      'Agosto': 7,
      'Septiembre': 8,
      'Octubre': 9,
      'Noviembre': 10,
      'Diciembre': 11
    };

    const parts = dateString.split(' ');
    if (parts.length >= 2) {
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]];
      const year = parts[2] ? parseInt(parts[2], 10) : currentDate.getFullYear();
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }

    return null;
  };

  const getISODate = (date: Date) => formatLocalDate(date);

  // EVENTOS VACÍOS PARA NUEVOS USUARIOS
  const dogEvents = dogs.flatMap((dog) => [
    ...(dog.appointments || []).map((appointment: any, index: number) => ({
      id: `${dog.id}-appointment-${index}`,
      title: appointment.label,
      date: appointment.date,
      dogName: dog.name,
      type: appointment.type || 'appointment',
      dogId: dog.id,
      source: 'appointment',
      dogEventIndex: index
    })),
    ...(dog.events || []).map((event: any, index: number) => ({
      id: `${dog.id}-event-${index}`,
      title: event.title || event.label || 'Evento',
      date: event.date,
      dogName: dog.name,
      type: event.type || 'other',
      dogId: dog.id,
      source: 'event',
      dogEventIndex: index
    }))
  ]);

  const events = [...dogEvents, ...calendarEvents];

  const handleSaveEvent = (data: any) => {
    if (selectedEvent?.source === 'appointment') {
      const dog = dogs.find((dog) => dog.id === selectedEvent.dogId);
      if (dog) {
        const updatedAppointments = (dog.appointments || []).map((item: any, index: number) =>
          index === selectedEvent.dogEventIndex
            ? { ...item, label: data.title, date: data.date, type: data.type }
            : item
        );
        updateDog(dog.id, { appointments: updatedAppointments });
      }
    } else if (selectedEvent?.source === 'event') {
      const dog = dogs.find((dog) => dog.id === selectedEvent.dogId);
      if (dog) {
        const updatedEvents = (dog.events || []).map((item: any, index: number) =>
          index === selectedEvent.dogEventIndex
            ? { ...item, title: data.title, date: data.date, type: data.type }
            : item
        );
        updateDog(dog.id, { events: updatedEvents });
      }
    } else if (selectedEvent?.source === 'custom' && selectedEvent?.id) {
      setCalendarEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? { ...event, ...data, source: 'custom' }
            : event
        )
      );
    } else {
      setCalendarEvents((prev) => [
        ...prev,
        {
          id: selectedEvent?.id || Date.now(),
          ...data,
          source: 'custom'
        }
      ]);
    }

    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };


  // NUEVO EVENTO
  const handleNewEvent = () => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    setSelectedEvent({
      title: '',
      date: getISODate(selectedDate),
      time: '',
      type: 'vaccine',
      notes: '',
      source: 'custom',
      dogId: location.state?.dogId,
      dogName: location.state?.dogName
    });
    setIsEventModalOpen(true);
  };

  // EDITAR EVENTO
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  // ELIMINAR EVENTO
  const handleDeleteEvent = (eventToDelete?: any) => {
    const event = eventToDelete || selectedEvent;
    if (!event) return;

    if (event.source === 'custom') {
      setCalendarEvents((prev) => prev.filter((item) => item.id !== event.id));
    } else if (event.source === 'appointment') {
      const dog = dogs.find((dog) => dog.id === event.dogId);
      if (dog) {
        const updatedAppointments = (dog.appointments || []).filter((_, index: number) => index !== event.dogEventIndex);
        updateDog(dog.id, { appointments: updatedAppointments });
      }
    } else if (event.source === 'event') {
      const dog = dogs.find((dog) => dog.id === event.dogId);
      if (dog) {
        const updatedEvents = (dog.events || []).filter((_, index: number) => index !== event.dogEventIndex);
        updateDog(dog.id, { events: updatedEvents });
      }
    }

    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  // DIAS DEL MES
  const getDaysInMonth = (date: Date) => {

    const year = date.getFullYear();

    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // VACÍOS
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // DIAS
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  const weekDays = [
    'Dom',
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb'
  ];

  const days = getDaysInMonth(currentDate);

  const currentMonth = monthNames[currentDate.getMonth()];

  const currentYear = currentDate.getFullYear();

  // MES ANTERIOR
  const previousMonth = () => {

    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1
      )
    );
  };

  // SIGUIENTE MES
  const nextMonth = () => {

    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      )
    );
  };

  // CATEGORIAS
  const eventCategories = [

    {
      type: 'vaccine',
      label: 'Vacunas',
      color: 'bg-green-500',
    },

    {
      type: 'checkup',
      label: 'Revisiones',
      color: 'bg-blue-500',
    },

    {
      type: 'heat',
      label: 'Celos',
      color: 'bg-pink-500',
    },

    {
      type: 'birth',
      label: 'Partos',
      color: 'bg-red-500',
    },

    {
      type: 'show',
      label: 'Exposiciones',
      color: 'bg-purple-500',
    },

    {
      type: 'medicine',
      label: 'Medicación',
      color: 'bg-yellow-500',
    },

    {
      type: 'grooming',
      label: 'Peluquería',
      color: 'bg-orange-500',
    },

    {
      type: 'training',
      label: 'Entrenamiento',
      color: 'bg-cyan-500',
    },

    {
      type: 'other',
      label: 'Otros',
      color: 'bg-slate-500',
    },
  ];

  // COLOR EVENTO
  const getEventColor = (type: string) => {

    return (
      eventCategories.find(
        (cat) => cat.type === type
      ) || eventCategories[0]
    );
  };

  // FILTROS
  const toggleFilter = (type: string) => {

    setActiveFilters((prev) =>

      prev.includes(type)

        ? prev.filter((t) => t !== type)

        : [...prev, type]
    );
  };

  // EVENTOS FILTRADOS
  const getFilteredEvents = (day: number | null) => {
    if (!day) return [];

    const allEvents = events.filter((event: any) => {
      const eventDate = parseEventDate(event.date);
      if (!eventDate) return false;

      const matchesDay =
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear();

      if (!matchesDay) return false;
      if (activeFilters.length === 0) return true;

      return activeFilters.includes(event.type || 'other');
    });

    return allEvents;
  };

  return (

    <div className="min-h-screen bg-slate-900">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-5">

        <div className="flex items-center justify-between mb-5">

          <h1 className="text-white text-2xl font-bold">
            Calendario
          </h1>

          <button
            onClick={handleNewEvent}
            className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-all"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>

        </div>

        {/* NAVEGACION */}
        <div className="flex items-center justify-between mb-5">

          <button
            onClick={previousMonth}
            className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <h2 className="text-white text-xl font-semibold">
            {currentMonth} {currentYear}
          </h2>

          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

        </div>

        {/* FILTROS */}
        <div className="flex gap-2 overflow-x-auto pb-1">

          {eventCategories.map((category) => (

            <button
              key={category.type}
              onClick={() => toggleFilter(category.type)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                activeFilters.includes(category.type)
                  ? `${category.color} text-white`
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
              }`}
            >

              <span
                className={`w-2 h-2 rounded-full ${
                  activeFilters.includes(category.type)
                    ? 'bg-white'
                    : category.color
                }`}
              />

              {category.label}

            </button>

          ))}

        </div>

      </div>

      {/* CALENDARIO */}
      <div className="px-6 py-4 pb-6">

        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden">

          {/* DIAS SEMANA */}
          <div className="grid grid-cols-7 gap-px bg-slate-700/50">

            {weekDays.map((day) => (

              <div
                key={day}
                className="bg-slate-800 text-center text-slate-400 text-xs font-bold py-3 uppercase"
              >
                {day}
              </div>

            ))}

          </div>

          {/* GRID */}
          <div className="grid grid-cols-7 gap-px bg-slate-700/50">

            {days.map((day, index) => {

              const dayEvents = getFilteredEvents(day);

              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              const isSelected = day === selectedDay;

              return (

                <button
                  key={index}
                  onClick={() => day && setSelectedDay(day)}
                  disabled={!day}
                  className={`min-h-[110px] p-2.5 flex flex-col items-start transition-all ${
                    day === null
                      ? 'invisible'
                      : isSelected
                      ? 'bg-blue-500/10 border-2 border-blue-500'
                      : 'bg-slate-800/80 border-2 border-transparent'
                  }`}
                >

                  {day !== null && (

                    <>

                      {/* DIA */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1.5 ${
                          isToday
                            ? 'bg-blue-500 text-white'
                            : isSelected
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {day}
                      </div>

                      {/* EVENTOS */}
                      <div className="w-full space-y-1 flex-1 overflow-hidden">

                        {dayEvents.slice(0, 2).map((event) => {

                          const eventColor = getEventColor(event.type);

                          return (

                            <div
                              key={event.id}
                              className={`${eventColor.color} rounded-md px-2 py-1 text-[11px] font-semibold text-white truncate`}
                            >
                              {event.title}
                            </div>

                          );
                        })}

                        {dayEvents.length > 2 && (

                          <div className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.5">
                            +{dayEvents.length - 2} más
                          </div>

                        )}

                      </div>

                    </>

                  )}

                </button>

              );
            })}

          </div>

        </div>

      </div>

      {/* EVENTOS DIA */}
      <div className="px-6 pb-8">

        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">

          <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">

            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
            </div>

            <div>

              <h2 className="text-white text-lg font-semibold">
                {selectedDay} de {currentMonth}
              </h2>

              <p className="text-slate-400 text-xs">
                {getFilteredEvents(selectedDay).length} eventos
              </p>

            </div>

          </div>

          <div className="p-4">

            {getFilteredEvents(selectedDay).length > 0 ? (

              <div className="space-y-2.5">

                {getFilteredEvents(selectedDay).map((event) => {

                  const eventColor = getEventColor(event.type);

                  return (

                    <div
                      key={event.id}
                      className="bg-slate-700/30 rounded-xl p-3"
                    >

                      <div className="flex items-center gap-3">

                        <div className={`w-1 h-12 rounded-full ${eventColor.color}`} />

                        <div className="flex-1">

                          <h3 className="text-white font-semibold text-sm">
                            {event.title}
                          </h3>

                          <p className="text-slate-400 text-xs">
                            {event.dogName}
                          </p>

                        </div>

                        <div className="flex gap-1">

                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                    </div>

                  );
                })}

              </div>

            ) : (

              <div className="text-center py-12">

                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-700/30 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-slate-500" />
                </div>

                <p className="text-slate-500 text-sm mb-3">
                  No hay eventos para este día
                </p>

                <button
                  onClick={handleNewEvent}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium"
                >
                  Añadir evento
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* MODAL */}
      <EditEventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        dogs={dogs}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        isNew={!selectedEvent?.id}
      />

    </div>
  );
}