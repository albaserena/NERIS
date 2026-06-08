import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import DatePicker from './DatePicker';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: {
    id?: number | string;
    title: string;
    date: string | number;
    time: string;
    type: string;
    notes?: string;
    source?: string;
    dogId?: number;
    dogName?: string;
    dogEventIndex?: number;
  };
  dogs?: Array<{ id: number; name: string }>;
  onSave: (data: any) => void;
  onDelete?: (event: any) => void;
  isNew?: boolean;
}

export default function EditEventModal({ isOpen, onClose, event, onSave, onDelete, isNew = false, dogs = [] }: EditEventModalProps) {
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseEventDate = (dateStr: string | number | undefined): Date | null => {
    if (!dateStr) return null;

    if (typeof dateStr === 'number') {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), dateStr);
    }

    const normalized = String(dateStr).trim();
    const isoMatch = normalized.match(/^\d{4}-\d{2}-\d{2}$/);
    if (isoMatch) {
      const [year, month, day] = normalized.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const isoDate = new Date(normalized);
    if (!isNaN(isoDate.getTime())) {
      return new Date(isoDate.getFullYear(), isoDate.getMonth(), isoDate.getDate());
    }

    const months: { [key: string]: number } = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
      'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    const parts = normalized.split(' ');
    if (parts.length >= 2) {
      const day = parseInt(parts[0], 10);
      const month = months[parts[1]];
      const year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }

    return null;
  };

  const formatEventDate = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const [eventDate, setEventDate] = useState<Date | null>(parseEventDate(event?.date || ''));
  const [selectedDogId, setSelectedDogId] = useState<number | undefined>(event?.dogId ?? dogs[0]?.id);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    time: event?.time || '',
    type: event?.type || 'vaccine',
    notes: event?.notes || '',
  });

  const selectedDog = dogs.find((dog) => dog.id === selectedDogId);

  useEffect(() => {
    if (event?.dogId) {
      setSelectedDogId(event.dogId);
    } else if (dogs.length > 0) {
      setSelectedDogId(dogs[0].id);
    } else {
      setSelectedDogId(undefined);
    }
  }, [event?.dogId, dogs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) {
      alert('Por favor selecciona una fecha');
      return;
    }
    onSave({
      ...formData,
      date: formatLocalDate(eventDate),
      id: event?.id || Date.now(),
      dogId: selectedDogId,
      dogName: selectedDog?.name
    });
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      if (confirm(`¿Eliminar "${formData.title}"?`)) {
        onDelete(event);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const eventTypes = [
    { value: 'vaccine', label: 'Vacunación', color: 'text-green-400' },
    { value: 'checkup', label: 'Revisión veterinaria', color: 'text-blue-400' },
    { value: 'heat', label: 'Celo', color: 'text-pink-400' },
    { value: 'birth', label: 'Parto', color: 'text-red-400' },
    { value: 'show', label: 'Exposición', color: 'text-purple-400' },
    { value: 'medicine', label: 'Medicación', color: 'text-yellow-400' },
    { value: 'grooming', label: 'Peluquería', color: 'text-orange-400' },
    { value: 'training', label: 'Entrenamiento', color: 'text-cyan-400' },
    { value: 'other', label: 'Otro', color: 'text-slate-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-600/50 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600/50 bg-gradient-to-r from-slate-800/60 to-transparent">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">{isNew ? 'Nuevo evento' : 'Editar evento'}</h2>
            <p className="text-slate-400 text-sm">
              {isNew ? 'Añade un nuevo evento al calendario' : 'Modifica los detalles del evento'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="text-slate-300 text-sm block mb-2">
                Título del evento
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Vacuna antirrábica - Luna"
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Dog */}
            {dogs.length > 0 && (
              <div>
                <label htmlFor="dog" className="text-slate-300 text-sm block mb-2">
                  Perro asociado
                </label>
                <select
                  id="dog"
                  value={selectedDogId ?? ''}
                  onChange={(e) => setSelectedDogId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                >
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type */}
            <div>
              <label htmlFor="type" className="text-slate-300 text-sm block mb-2">
                Tipo de evento
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                required
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <DatePicker
              label="Fecha"
              value={eventDate}
              onChange={setEventDate}
              placeholder="Seleccionar fecha"
              allowFuture={true}
            />

            {/* Time */}
            <div>
              <label htmlFor="time" className="text-slate-300 text-sm block mb-2">
                Hora
              </label>
              <input
                id="time"
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="10:00"
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="text-slate-300 text-sm block mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional sobre el evento..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-600">
            {/* Delete button for existing events */}
            {!isNew && event?.id && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full mb-3 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar evento</span>
              </button>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-700/50 text-white hover:bg-slate-700 transition-all font-medium border border-slate-600/50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all font-medium shadow-lg shadow-blue-500/30"
              >
                {isNew ? 'Crear evento' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
