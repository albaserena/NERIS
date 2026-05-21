import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Calendar, Weight, FileText } from 'lucide-react';
import { useState } from 'react';
import { useDogs } from '../context/DogsContext';
import AddDogModal from '../components/AddDogModal';

export default function Dogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { dogs, addDog } = useDogs();

  const handleAddDog = (newDog: any) => {
    addDog(newDog);
  };

  const filteredDogs = dogs.filter(
    (dog) =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.chip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl">Mis Perros</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, chip..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center hover:bg-slate-600 transition-colors">
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Dogs Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDogs.map((dog) => (
            <Link
              key={dog.id}
              to={`/dogs/${dog.id}`}
              className="group bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              {/* Header: Image, Name, Breed, Status */}
              <div className="flex gap-3 p-3 border-b border-slate-700/50">
                {/* Dog Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Name, Breed, Status */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-white font-semibold text-base mb-0.5 truncate">
                    {dog.name}
                  </h3>
                  <p className="text-slate-400 text-sm truncate mb-1">{dog.breed}</p>
                  <span
                    className={`self-start px-2 py-0.5 rounded-full text-xs font-medium ${
                      dog.status === 'Activo'
                        ? 'bg-green-500/20 text-green-300'
                        : dog.status === 'En gestación'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-500/20 text-slate-300'
                    }`}
                  >
                    {dog.status}
                  </span>
                </div>
              </div>

              {/* Important Info Cards */}
              <div className="p-3 space-y-2">
                {/* Edad */}
                <div className="bg-slate-700/30 rounded-lg p-2.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-500 text-xs">Edad</p>
                    <p className="text-white font-semibold text-sm truncate">{dog.age}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Peso */}
                  {dog.weight && (
                    <div className="bg-slate-700/30 rounded-lg p-2.5 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Weight className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mb-0.5">Peso</p>
                      <p className="text-white font-semibold text-sm truncate">{dog.weight}</p>
                    </div>
                  )}

                  {/* Género */}
                  <div className="bg-slate-700/30 rounded-lg p-2.5 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-400 text-xs font-semibold">
                          {dog.gender === 'Macho' ? 'M' : 'F'}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mb-0.5">Género</p>
                    <p className="text-white font-semibold text-sm truncate">{dog.gender}</p>
                  </div>
                </div>

                {/* Microchip */}
                {dog.chip && (
                  <div className="bg-slate-700/30 rounded-lg p-2.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-xs">Microchip</p>
                      <p className="text-white font-semibold text-sm font-mono truncate">{dog.chip}</p>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredDogs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg">No se encontraron perros</p>
            <p className="text-slate-500 text-sm mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>

      {/* Add Dog Modal */}
      <AddDogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddDog}
      />
    </div>
  );
}
