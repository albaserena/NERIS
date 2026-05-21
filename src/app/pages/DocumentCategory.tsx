import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  Plus,
  Search
} from 'lucide-react';

import { useState, useEffect } from 'react';

import { db, storage } from '../../firebase';

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import {
  collection,
  addDoc,
  getDocs
} from 'firebase/firestore';

export default function DocumentCategory() {

  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
    useEffect(() => {

      const loadDocuments = async () => {

        try {

          const snapshot = await getDocs(
            collection(db, 'documents')
          );

          const docsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const filteredDocs = docsData.filter(
            (doc: any) => doc.dogId === categoryId
          );

          setDocuments(filteredDocs);

        } catch (error) {

          console.error('Error cargando documentos:', error);

        }
      };

      loadDocuments();

    }, 
  []);

  // TODO VACÍO PARA USUARIOS NUEVOS
  const categoryData: { [key: string]: any } = {

    pedigree: {
      title: 'Certificados LOE y Pedigrí',
      color: 'bg-blue-500',
      documents: [],
    },

    health: {
      title: 'Certificados Oficiales de Salud',
      color: 'bg-teal-500',
      documents: [],
    },

    'health-records': {
      title: 'Cartillas Sanitarias',
      color: 'bg-green-500',
      documents: [],
    },

    contracts: {
      title: 'Contratos',
      color: 'bg-purple-500',
      documents: [],
    },

  };

  const category = categoryData[categoryId || ''];

  if (!category) {

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">
          Categoría no encontrada
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {

    switch (status.toLowerCase()) {

      case 'completo':
      case 'actualizado':
      case 'firmado':
      case 'a/a':
      case '0/0':
      case 'clear':

        return 'bg-green-500/20 text-green-400';

      case 'pendiente':

        return 'bg-orange-500/20 text-orange-400';

      case 'negativo':

        return 'bg-blue-500/20 text-blue-400';

      default:

        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredDocuments = documents.filter((doc: any) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.dog.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="min-h-screen bg-slate-900">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-6">

        <div className="flex items-center gap-4 mb-6">

          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex-1">

            <h1 className="text-white text-2xl">
              {category.title}
            </h1>

            <p className="text-slate-300 text-sm">
              {documents.length} documentos
            </p>

          </div>

          {/* SUBIR ARCHIVO */}
          <label className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={(e) => {

                const files = Array.from(e.target.files || []);

                if (files.length > 0) {

                  const newDocuments = files.map((file, index) => ({
                    id: Date.now() + index,
                    name: file.name,
                    dog: 'Ajax',
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    date: new Date().toLocaleDateString(),
                    status: 'Subido',
                    file
                  }));

                  setDocuments(prev => [...prev, ...newDocuments]);
                }
              }}
            />

            <Plus className="w-5 h-5 text-white" />

          </label>

        </div>

        {/* SEARCH */}
        <div className="relative">

          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar documentos..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
          />

        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="px-6 py-6 space-y-3">

        {filteredDocuments.length > 0 ? (

          filteredDocuments.map((doc: any) => (

            <div
              key={doc.id}
              onClick={() => {

                const url = URL.createObjectURL(doc.file);

                window.open(url);

              }}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >

              <div className="flex items-start gap-3">

                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center flex-shrink-0`}>

                  <FileText className="w-6 h-6 text-white" />

                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-white font-medium mb-1">
                    {doc.name}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">

                    <span>{doc.dog}</span>

                    <span>•</span>

                    <span>{doc.size}</span>

                    <span>•</span>

                    <span>{doc.date}</span>

                  </div>

                  <span
                    className={`inline-block px-2 py-1 rounded-md text-xs ${getStatusColor(doc.status)}`}
                  >
                    {doc.status}
                  </span>

                </div>

                <div className="flex flex-col gap-2">

                  <button className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors">

                    <Download className="w-5 h-5 text-slate-200" />

                  </button>

                  <button className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-red-500 transition-colors">

                    <Trash2 className="w-5 h-5 text-slate-200" />

                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">

            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />

            <p className="text-slate-400 mb-2">
              No hay documentos todavía
            </p>

            <p className="text-slate-500 text-sm">
              Sube tu primer archivo usando el botón +
            </p>

          </div>

        )}

      </div>

    </div>
  );
}