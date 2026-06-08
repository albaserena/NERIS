import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  Edit,
  Calendar as CalendarIcon,
  Heart,
  Syringe,
  FileText,
  Award,
  Trash2,
  Trophy,
  Cake,
  Weight
} from 'lucide-react';

import EditDogModal from '../components/EditDogModal';
import { useDogs } from '../context/DogsContext';

// ORDENAR POR FECHA
const sortByDate = (items: Array<{ date: string }>) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB.getTime() - dateA.getTime();
  });
};

export default function DogDetail() {

  const navigate = useNavigate();

  const { id } = useParams();

  const {
    getDogById,
    updateDog,
    deleteDog,
    dogs
  } = useDogs();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocDogId, setSelectedDocDogId] = useState<number>(Number(id));

  const dog = getDogById(Number(id));

  useEffect(() => {

    if (!dog) {
      navigate('/dogs');
    }

  }, [dog, navigate]);

  useEffect(() => {
    if (dog) {
      setSelectedDocDogId(dog.id);
    }
  }, [dog]);

  if (!dog) return null;

  const handleSaveDog = (data: any) => {
    updateDog(Number(id), data);
  };

  const handleDeleteDog = () => {

    deleteDog(Number(id));

    navigate('/dogs');
  };

  // SECCIONES
  const sections = [

    {
      title: 'Próximas citas',
      icon: CalendarIcon,
      color: 'bg-purple-500',
      items: sortByDate(dog.appointments || []),
    },

    {
      title: 'Historial médico',
      icon: Syringe,
      color: 'bg-green-500',
      items: sortByDate(dog.medicalHistory || []),
    },

    {
      title: 'Camadas',
      icon: Heart,
      color: 'bg-pink-500',
      items: sortByDate(
        (dog.litters || []).map((l: any) => ({
          label: l.label,
          date: `${l.date} (${l.puppies} cachorros)`
        }))
      ),
    },
  ];

  // EXPOSICIONES
  const expositionResults = (dog.awards || []).map(
    (award: any, index: number) => {

      const badges: string[] = [];

      if (award.exc) badges.push('EXC');
      if (award.exc1) badges.push('EXC 1º');
      if (award.cac) badges.push('CAC');
      if (award.cacib) badges.push('CACIB');
      
      if (award.bob_bos === 'bob') badges.push('BOB');
      if (award.bob_bos === 'bos') badges.push('BOS');
    

      return {
        id: index,
        title: award.event,
        badges,
      };
    }
  );

  return (

    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">

      {/* HEADER */}
      <div className="relative h-80 bg-slate-900">
        {dog.image ? (
          <img
            src={dog.image}
            alt={dog.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              img.onerror = null;
              img.style.display = 'none';
            }}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-900/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* EDIT */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>

        {/* INFO */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">

          <div className="flex items-end justify-between">

            <div>

              <h1 className="text-white text-3xl font-bold mb-1">
                {dog.name || 'Sin nombre'}
              </h1>

              <p className="text-slate-200 text-base">
                {dog.breed || 'Sin raza'}
              </p>

            </div>

            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white">
              {dog.status || 'Activo'}
            </span>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="px-6 py-6 space-y-5">

        {/* INFO PRINCIPAL */}
        <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50">

          <h3 className="text-white font-semibold text-sm mb-4">
            Información Principal
          </h3>

          <div className="grid grid-cols-2 gap-3">

            {/* FECHA */}
            <div className="bg-slate-700/40 rounded-xl p-4 col-span-2">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Cake className="w-5 h-5 text-white" />
                </div>

                <div>

                  <p className="text-slate-400 text-xs">
                    Fecha de nacimiento
                  </p>

                  <p className="text-white font-semibold">
                    {dog.birthDate || 'No registrada'}
                  </p>

                  <p className="text-blue-400 text-xs">
                    {dog.age || ''}
                  </p>

                </div>

              </div>

            </div>

            {/* PESO */}
            <div className="bg-slate-700/40 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                  <Weight className="w-4 h-4 text-white" />
                </div>

                <div>

                  <p className="text-slate-400 text-xs">
                    Peso
                  </p>

                  <p className="text-white font-semibold">
                    {dog.weight || 'No registrado'}
                  </p>

                </div>

              </div>

            </div>

            {/* GENERO */}
            <div className="bg-slate-700/40 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {dog.gender === 'Macho' ? 'M' : 'F'}
                  </span>
                </div>

                <div>

                  <p className="text-slate-400 text-xs">
                    Género
                  </p>

                  <p className="text-white font-semibold">
                    {dog.gender || 'No registrado'}
                  </p>

                </div>

              </div>

            </div>

            {/* CHIP */}
            <div className="bg-slate-700/40 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>

                <div>

                  <p className="text-slate-400 text-xs">
                    Microchip
                  </p>

                  <p className="text-white font-semibold">
                    {dog.chip || 'No registrado'}
                  </p>

                </div>

              </div>

            </div>

            {/* PEDIGREE */}
            <div className="bg-slate-700/40 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>

                <div>

                  <p className="text-slate-400 text-xs">
                    Pedigrí
                  </p>

                  <p className="text-white font-semibold">
                    {dog.pedigree || 'No registrado'}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {sections.map((section) => {

            const Icon = section.icon;

            return (

              <div
                key={section.title}
                className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden"
              >

                <div className="flex items-center gap-3 p-4">

                  <div className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div>

                    <h2 className="text-white font-semibold">
                      {section.title}
                    </h2>

                    <p className="text-slate-400 text-xs">
                      {section.items.length} registros
                    </p>

                  </div>

                </div>

                <div className="p-4">

                  {section.items.length > 0 ? (

                    <div className="space-y-2">

                      {section.items.map((item: any, index: number) => (

                        <div
                          key={index}
                          onClick={() => {

                            if (section.title === 'Próximas citas') {

                              navigate('/calendar', {
                                state: {
                                  selectedDate: item.date,
                                  dogId: dog.id,
                                  dogName: dog.name
                                }
                              });

                            }

                          }}
                          className="bg-slate-700/30 rounded-xl p-3 cursor-pointer hover:bg-slate-700 transition-colors"
                        >

                          <p className="text-white text-sm font-semibold">
                            {item.label}
                          </p>

                          <p className="text-slate-400 text-xs">
                            {item.date}
                          </p>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <div className="text-center py-12">

                      <div className={`w-12 h-12 mx-auto mb-2 rounded-xl ${section.color} opacity-20 flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <p className="text-slate-500 text-xs">
                        No hay registros aún
                      </p>

                    </div>

                  )}

                </div>

              </div>

            );
          })}

          {/* EXPOSICIONES */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">

            <div className="flex items-center gap-3 p-4">

              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>

              <div>

                <h2 className="text-white font-semibold">
                  Resultados de Exposiciones
                </h2>

                <p className="text-slate-400 text-xs">
                  {expositionResults.length} resultados
                </p>

              </div>

            </div>

            <div className="p-4">

              {expositionResults.length > 0 ? (

                <div className="space-y-2">

                  {expositionResults.map((expo: any) => (

                    <div
                      key={expo.id}
                      className="bg-slate-700/30 rounded-xl p-3"
                    >

                      <p className="text-white text-sm font-semibold mb-2">
                        {expo.title}
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {expo.badges.map((badge: string, index: number) => (

                          <span
                            key={index}
                            className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs"
                          >
                            {badge}
                          </span>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="text-center py-12">

                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>

                  <p className="text-slate-500 text-xs">
                    No hay exposiciones registradas
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* DOCUMENTACIÓN */}
          <div className="md:col-span-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">

            <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">

              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>

              <div>

                <h2 className="text-white font-semibold">
                  Documentación
                </h2>

                <p className="text-slate-400 text-xs">
                  Archivos y documentos relacionados con este perro y la vista de inicio.
                </p>

              </div>

            </div>

            <div className="p-4">

              <div className="rounded-xl border border-slate-700/50 bg-slate-700/30 p-4 space-y-4">

                <p className="text-slate-300 text-sm">
                  En esta sección puedes elegir el perro responsable del documento antes de ir al área de Documentos.
                </p>

                <div>
                  <label className="text-slate-400 text-xs block mb-2">Documento asignado a:</label>
                  <select
                    value={selectedDocDogId}
                    onChange={(e) => setSelectedDocDogId(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  >
                    {dogs.map((dogOption) => (
                      <option key={dogOption.id} value={dogOption.id}>
                        {dogOption.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => navigate('/documents', {
                    state: {
                      dogId: selectedDocDogId,
                      dogName: dogs.find((dogOption) => dogOption.id === selectedDocDogId)?.name
                    }
                  })}
                  className="w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Abrir Documentos para {dogs.find((dogOption) => dogOption.id === selectedDocDogId)?.name}
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Documents UI removed */}

        {/* DELETE */}
        <button
          onClick={handleDeleteDog}
          className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          <span>Eliminar perro</span>
        </button>

      </div>

      {/* MODAL */}
      <EditDogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        dog={dog}
        onSave={handleSaveDog}
      />

    </div>
  );
}