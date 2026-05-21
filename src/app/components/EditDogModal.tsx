import { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import DatePicker from './DatePicker';

interface EditDogModalProps {
  isOpen: boolean;
  onClose: () => void;
  dog: any;
  onSave: (data: any) => void;
}

export default function EditDogModal({ isOpen, onClose, dog, onSave }: EditDogModalProps) {
  const [activeTab, setActiveTab] = useState('basic');

  // Helper to parse date string to Date object
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const months: { [key: string]: number } = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
      'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const [birthDate, setBirthDate] = useState<Date | null>(parseDate(dog.birthDate || ''));

  const [formData, setFormData] = useState({
    // Información básica
    name: dog.name || '',
    breed: dog.breed || '',
    gender: dog.gender || 'Hembra',
    weight: dog.weight || '',
    color: dog.color || '',
    chip: dog.chip || '',
    pedigree: dog.pedigree || '',
    status: dog.status || 'Activo',

    // Próximas citas
    appointments: dog.appointments || [
      { label: 'Vacuna antirrábica', date: '15 Mayo 2026' },
      { label: 'Revisión anual', date: '20 Mayo 2026' },
    ],

    // Historial médico
    medicalHistory: dog.medicalHistory || [
      { label: 'Última vacunación', date: '15 Enero 2026' },
      { label: 'Desparasitación', date: '1 Marzo 2026' },
    ],

    // Camadas
    litters: dog.litters || [
      { label: 'Camada #1', date: '10 Marzo 2024', puppies: 5 },
      { label: 'Camada #2', date: '5 Agosto 2025', puppies: 4 },
    ],

    // Puntos
    awards: dog.awards || [
      {
        event: 'Expo Nacional 2024',
        championship: 'españa',
        exc: true,
        exc1: true,
        cac: true,
        cacib: false,
        bob_bos: 'ninguna'
      },
      {
        event: 'Expo Internacional 2025',
        championship: 'españa',
        exc: true,
        exc1: true,
        cac: true,
        cacib: true,
        bob_bos: 'ninguna'
      },
    ],
  });

  // Función para ordenar por fecha (más reciente primero)
  const sortByDate = (items: Array<any>) => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ordenar todas las listas por fecha antes de guardar
    const sortedData = {
      ...formData,
      birthDate: formatDate(birthDate),
      appointments: sortByDate(formData.appointments),
      medicalHistory: sortByDate(formData.medicalHistory),
      litters: sortByDate(formData.litters),
    };

    onSave(sortedData);
    onClose();
  };

  const [appointmentDates, setAppointmentDates] = useState<(Date | null)[]>(
    (dog.appointments || []).map((a: any) => parseDate(a.date))
  );

  const addAppointment = () => {
    setFormData({
      ...formData,
      appointments: [...formData.appointments, { label: '', date: '' }],
    });
    setAppointmentDates([...appointmentDates, null]);
  };

  const removeAppointment = (index: number) => {
    setFormData({
      ...formData,
      appointments: formData.appointments.filter((_, i) => i !== index),
    });
    setAppointmentDates(appointmentDates.filter((_, i) => i !== index));
  };

  const updateAppointment = (index: number, field: string, value: string | Date | null) => {
    if (field === 'date' && value instanceof Date) {
      const updated = [...formData.appointments];
      updated[index] = { ...updated[index], date: formatDate(value) };
      setFormData({ ...formData, appointments: updated });
      const updatedDates = [...appointmentDates];
      updatedDates[index] = value;
      setAppointmentDates(updatedDates);
    } else {
      const updated = [...formData.appointments];
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, appointments: updated });
    }
  };

  const [medicalDates, setMedicalDates] = useState<(Date | null)[]>(
    (dog.medicalHistory || []).map((m: any) => parseDate(m.date))
  );

  const addMedicalRecord = () => {
    setFormData({
      ...formData,
      medicalHistory: [...formData.medicalHistory, { label: '', date: '' }],
    });
    setMedicalDates([...medicalDates, null]);
  };

  const removeMedicalRecord = (index: number) => {
    setFormData({
      ...formData,
      medicalHistory: formData.medicalHistory.filter((_, i) => i !== index),
    });
    setMedicalDates(medicalDates.filter((_, i) => i !== index));
  };

  const updateMedicalRecord = (index: number, field: string, value: string | Date | null) => {
    if (field === 'date' && value instanceof Date) {
      const updated = [...formData.medicalHistory];
      updated[index] = { ...updated[index], date: formatDate(value) };
      setFormData({ ...formData, medicalHistory: updated });
      const updatedDates = [...medicalDates];
      updatedDates[index] = value;
      setMedicalDates(updatedDates);
    } else {
      const updated = [...formData.medicalHistory];
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, medicalHistory: updated });
    }
  };

  const [litterDates, setLitterDates] = useState<(Date | null)[]>(
    (dog.litters || []).map((l: any) => parseDate(l.date))
  );

  const addLitter = () => {
    setFormData({
      ...formData,
      litters: [...formData.litters, { label: '', date: '', puppies: 0 }],
    });
    setLitterDates([...litterDates, null]);
  };

  const removeLitter = (index: number) => {
    setFormData({
      ...formData,
      litters: formData.litters.filter((_, i) => i !== index),
    });
    setLitterDates(litterDates.filter((_, i) => i !== index));
  };

  const updateLitter = (index: number, field: string, value: any) => {
    if (field === 'date' && value instanceof Date) {
      const updated = [...formData.litters];
      updated[index] = { ...updated[index], date: formatDate(value) };
      setFormData({ ...formData, litters: updated });
      const updatedDates = [...litterDates];
      updatedDates[index] = value;
      setLitterDates(updatedDates);
    } else {
      const updated = [...formData.litters];
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, litters: updated });
    }
  };

  const addAward = () => {
    setFormData({
      ...formData,
      awards: [...formData.awards, {
        event: '',
        championship: 'españa',
        exc: false,
        exc1: false,
        cac: false,
        cacib: false,
        bob_bos: 'ninguna'
      }],
    });
  };

  const removeAward = (index: number) => {
    setFormData({
      ...formData,
      awards: formData.awards.filter((_, i) => i !== index),
    });
  };

  const updateAward = (index: number, field: string, value: string | boolean) => {
    const updated = [...formData.awards];
    const award = { ...updated[index] };

    // Lógica jerárquica de checkboxes
    if (field === 'exc' && !value) {
      // Si se desmarca EXC, desmarcar todo
      award.exc = false;
      award.exc1 = false;
      award.cac = false;
      award.cacib = false;
      award.bob_bos = 'ninguna';
    } else if (field === 'exc1' && !value) {
      // Si se desmarca EXC 1º, desmarcar CAC, CACIB y BOB/BOS
      award.exc1 = false;
      award.cac = false;
      award.cacib = false;
      award.bob_bos = 'ninguna';
    } else if (field === 'cac' && !value) {
      // Si se desmarca CAC, desmarcar CACIB y BOB/BOS
      award.cac = false;
      award.cacib = false;
      award.bob_bos = 'ninguna';
    } else if (field === 'cacib' && !value) {
      // Si se desmarca CACIB, resetear BOB/BOS
      award.cacib = false;
      award.bob_bos = 'ninguna';
    } else {
      // Actualización normal
      award[field] = value;
    }

    updated[index] = award;
    setFormData({ ...formData, awards: updated });
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Básico' },
    { id: 'appointments', label: 'Citas' },
    { id: 'medical', label: 'Médico' },
    { id: 'litters', label: 'Camadas' },
    { id: 'awards', label: 'Exposiciones' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-600/50 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600/50 bg-gradient-to-r from-slate-800/60 to-transparent">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">Editar información</h2>
            <p className="text-slate-400 text-sm">Añade o modifica la información del perro</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Información Básica */}
            {activeTab === 'basic' && (
              <>
                <div className="mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-blue-400" />
                    Información básica del perro
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Raza</label>
                    <input
                      type="text"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={birthDate}
                    onChange={setBirthDate}
                    placeholder="Seleccionar fecha"
                    allowFuture={false}
                  />
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Género</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <option value="Macho">Macho</option>
                      <option value="Hembra">Hembra</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Peso</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="ej: 12.5 kg"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="ej: Dorado"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Microchip</label>
                    <input
                      type="text"
                      value={formData.chip}
                      onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                      placeholder="ej: ES-123456789"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Pedigrí</label>
                    <input
                      type="text"
                      value={formData.pedigree}
                      onChange={(e) => setFormData({ ...formData, pedigree: e.target.value })}
                      placeholder="ej: LOE-2345678"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium block mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="Activo">Activo</option>
                    <option value="En gestación">En gestación</option>
                    <option value="De baja">De baja</option>
                  </select>
                </div>
              </>
            )}

            {/* Próximas Citas */}
            {activeTab === 'appointments' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Próximas citas</h3>
                  <button
                    type="button"
                    onClick={addAppointment}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir cita
                  </button>
                </div>
                {formData.appointments.length === 0 ? (
                  <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm">No hay citas registradas</p>
                    <p className="text-slate-500 text-xs mt-1">Haz clic en "Añadir cita" para crear una</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.appointments.map((appointment, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-400 text-xs">Editando cita #{index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAppointment(index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={appointment.label}
                          onChange={(e) => updateAppointment(index, 'label', e.target.value)}
                          placeholder="Descripción de la cita (ej: Vacuna antirrábica)"
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <DatePicker
                          value={appointmentDates[index]}
                          onChange={(date) => updateAppointment(index, 'date', date)}
                          placeholder="Seleccionar fecha"
                          allowFuture={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Historial Médico */}
            {activeTab === 'medical' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Historial médico</h3>
                  <button
                    type="button"
                    onClick={addMedicalRecord}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir registro
                  </button>
                </div>
                {formData.medicalHistory.length === 0 ? (
                  <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm">No hay registros médicos</p>
                    <p className="text-slate-500 text-xs mt-1">Haz clic en "Añadir registro" para crear uno</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.medicalHistory.map((record, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-green-400" />
                            <span className="text-slate-400 text-xs">Editando registro #{index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedicalRecord(index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={record.label}
                          onChange={(e) => updateMedicalRecord(index, 'label', e.target.value)}
                          placeholder="Ej: Vacuna antirrábica, Desparasitación..."
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <DatePicker
                          value={medicalDates[index]}
                          onChange={(date) => updateMedicalRecord(index, 'date', date)}
                          placeholder="Seleccionar fecha"
                          allowFuture={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Camadas */}
            {activeTab === 'litters' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Camadas</h3>
                  <button
                    type="button"
                    onClick={addLitter}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir camada
                  </button>
                </div>
                {formData.litters.length === 0 ? (
                  <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm">No hay camadas registradas</p>
                    <p className="text-slate-500 text-xs mt-1">Haz clic en "Añadir camada" para crear una</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.litters.map((litter, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-pink-400" />
                            <span className="text-slate-400 text-xs">Editando camada #{index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLitter(index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={litter.label}
                          onChange={(e) => updateLitter(index, 'label', e.target.value)}
                          placeholder="Nombre de la camada (ej: Camada #1)"
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <DatePicker
                            value={litterDates[index]}
                            onChange={(date) => updateLitter(index, 'date', date)}
                            placeholder="Fecha parto"
                            allowFuture={false}
                          />
                          <input
                            type="number"
                            value={litter.puppies}
                            onChange={(e) => updateLitter(index, 'puppies', parseInt(e.target.value))}
                            placeholder="N° cachorros"
                            className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Exposiciones */}
            {activeTab === 'awards' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Resultados de Exposiciones</h3>
                  <button
                    type="button"
                    onClick={addAward}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir exposición
                  </button>
                </div>
                {formData.awards.length === 0 ? (
                  <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm">No hay exposiciones registradas</p>
                    <p className="text-slate-500 text-xs mt-1">Haz clic en "Añadir exposición" para crear una</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.awards.map((award, index) => (
                      <div key={index} className="bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-yellow-400" />
                            <span className="text-slate-400 text-xs">Editando exposición #{index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAward(index)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Exposición */}
                        <input
                          type="text"
                          value={award.event}
                          onChange={(e) => updateAward(index, 'event', e.target.value)}
                          placeholder="Exposición (ej: Expo Nacional Madrid 2025)"
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />

                        {/* Campeonato */}
                        <div>
                          <label className="text-slate-300 text-sm font-medium block mb-2">Campeonato</label>
                          <select
                            value={award.championship || 'españa'}
                            onChange={(e) => updateAward(index, 'championship', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          >
                            <option value="españa">Campeonato de España</option>
                            <option value="otro">Otro país</option>
                          </select>
                        </div>

                        {/* Resultados jerárquicos */}
                        <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                          <p className="text-slate-300 text-sm font-medium mb-2">Resultados obtenidos</p>

                          {/* EXC */}
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`exc-${index}`}
                              checked={award.exc || false}
                              onChange={(e) => updateAward(index, 'exc', e.target.checked)}
                              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor={`exc-${index}`} className="text-slate-300 text-sm font-medium">
                              EXC (Excelente)
                            </label>
                          </div>

                          {/* EXC 1º */}
                          {award.exc && (
                            <div className="flex items-center gap-3 ml-6">
                              <input
                                type="checkbox"
                                id={`exc1-${index}`}
                                checked={award.exc1 || false}
                                onChange={(e) => updateAward(index, 'exc1', e.target.checked)}
                                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-green-500 focus:ring-green-500"
                              />
                              <label htmlFor={`exc1-${index}`} className="text-slate-300 text-sm font-medium">
                                EXC 1º (Excelente primero)
                              </label>
                            </div>
                          )}

                          {/* CAC */}
                          {award.exc && award.exc1 && (
                            <div className="flex items-center gap-3 ml-12">
                              <input
                                type="checkbox"
                                id={`cac-${index}`}
                                checked={award.cac || false}
                                onChange={(e) => updateAward(index, 'cac', e.target.checked)}
                                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-yellow-500 focus:ring-yellow-500"
                              />
                              <label htmlFor={`cac-${index}`} className="text-slate-300 text-sm font-medium">
                                CAC
                              </label>
                            </div>
                          )}

                          {/* CACIB */}
                          {award.exc && award.exc1 && award.cac && (
                            <div className="flex items-center gap-3 ml-12">
                              <input
                                type="checkbox"
                                id={`cacib-${index}`}
                                checked={award.cacib || false}
                                onChange={(e) => updateAward(index, 'cacib', e.target.checked)}
                                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
                              />
                              <label htmlFor={`cacib-${index}`} className="text-slate-300 text-sm font-medium">
                                CACIB
                              </label>
                            </div>
                          )}

                          {/* BOB/BOS */}
                          {award.exc && award.exc1 && award.cac && award.cacib && (
                            <div className="ml-12">
                              <label className="text-slate-300 text-xs font-medium block mb-2">
                                Best of Breed / Best of Opposite Sex
                              </label>
                              <select
                                value={award.bob_bos || 'ninguna'}
                                onChange={(e) => updateAward(index, 'bob_bos', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                              >
                                <option value="ninguna">Ninguna</option>
                                <option value="bob">BOB (Best of Breed)</option>
                                <option value="bos">BOS (Best of Opposite Sex)</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-600/50 flex gap-3 bg-gradient-to-r from-slate-800/60 to-transparent">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-700/50 text-white hover:bg-slate-700 transition-all font-medium border border-slate-600/30"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all font-medium shadow-lg shadow-blue-500/30"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
