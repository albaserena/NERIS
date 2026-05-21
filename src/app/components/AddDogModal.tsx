import { useState } from 'react';
import { X } from 'lucide-react';
import DatePicker from './DatePicker';

interface AddDogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dog: any) => void;
}

export default function AddDogModal({
  isOpen,
  onClose,
  onSave
}: AddDogModalProps) {

  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const dogBreeds = [
    'Cocker Spaniel Inglés',
    'Cocker Spaniel Americano',
    'Golden Retriever',
    'Labrador Retriever',
    'Pastor Alemán',
    'Border Collie',
    'Caniche',
    'Bulldog Francés',
    'Bulldog Inglés',
    'Chihuahua',
    'Teckel',
    'Yorkshire Terrier',
    'Pomerania',
    'Husky Siberiano',
    'Shiba Inu',
    'Akita Inu',
    'Beagle',
    'Dálmata',
    'Rottweiler',
    'Doberman',
    'Boxer',
    'Mestizo',
    'Otro'
  ];

  const [formData, setFormData] = useState({
    name: '',
    breed: 'Cocker Spaniel Inglés',
    gender: 'Hembra',
    weight: '',
    color: '',
    chip: '',
    pedigree: '',
    status: 'Activo',
  });

  const formatDate = (date: Date | null) => {

    if (!date) return '';

    const day = date.getDate();

    const months = [
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

    const month = months[date.getMonth()];

    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!birthDate) {

      alert('Por favor selecciona la fecha de nacimiento');

      return;
    }

    // CALCULAR EDAD
    const today = new Date();

    const birth = birthDate;

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff =
      today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (
        monthDiff === 0 &&
        today.getDate() < birth.getDate()
      )
    ) {

      age--;

    }

    const ageString =
      age === 0
        ? 'Menos de 1 año'
        : `${age} año${age !== 1 ? 's' : ''}`;

    const newDog = {

      id: Date.now(),

      ...formData,

      birthDate: formatDate(birthDate),

      age: ageString,

      image: '/src/imports/idea_login1.jpeg',

      appointments: [],

      medicalHistory: [],

      litters: [],

      awards: [],

      documents: [],
    };

    onSave(newDog);

    // RESET FORM
    setBirthDate(null);

    setFormData({
      name: '',
      breed: 'Cocker Spaniel Inglés',
      gender: 'Hembra',
      weight: '',
      color: '',
      chip: '',
      pedigree: '',
      status: 'Activo',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-t-3xl sm:rounded-3xl border border-slate-700 max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">

          <h2 className="text-white text-xl font-semibold">
            Registrar nuevo perro
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >

          <div className="p-6 space-y-4">

            {/* NAME */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Nombre *
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                required
              />

            </div>

            {/* BREED */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Raza *
              </label>

              <select
                value={formData.breed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    breed: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                required
              >

                {dogBreeds.map((breed) => (

                  <option
                    key={breed}
                    value={breed}
                  >
                    {breed}
                  </option>

                ))}

              </select>

            </div>

            {/* BIRTH DATE */}
            <DatePicker
              label="Fecha de nacimiento *"
              value={birthDate}
              onChange={setBirthDate}
              placeholder="Seleccionar fecha de nacimiento"
              allowFuture={false}
            />

            {/* GENDER */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Género *
              </label>

              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                required
              >

                <option value="Macho">
                  Macho
                </option>

                <option value="Hembra">
                  Hembra
                </option>

              </select>

            </div>

            {/* WEIGHT */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Peso
              </label>

              <input
                type="text"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: e.target.value
                  })
                }
                placeholder="12.5 kg"
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
              />

            </div>

            {/* COLOR */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Color
              </label>

              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    color: e.target.value
                  })
                }
                placeholder="Dorado"
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
              />

            </div>

            {/* CHIP */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Microchip
              </label>

              <input
                type="text"
                value={formData.chip}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chip: e.target.value
                  })
                }
                placeholder="ES-123456789"
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
              />

            </div>

            {/* PEDIGREE */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Pedigrí
              </label>

              <input
                type="text"
                value={formData.pedigree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pedigree: e.target.value
                  })
                }
                placeholder="LOE-2345678"
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
              />

            </div>

            {/* STATUS */}
            <div>

              <label className="text-slate-300 text-sm block mb-2">
                Estado
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
              >

                <option value="Activo">
                  Activo
                </option>

                <option value="En gestación">
                  En gestación
                </option>

                <option value="De baja">
                  De baja
                </option>

              </select>

            </div>

          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-700 flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Registrar perro
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}