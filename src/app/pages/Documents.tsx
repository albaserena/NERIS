import { useMemo, useState, useEffect } from 'react';

import {
  FileText,
  Plus,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

import { Link } from 'react-router-dom';

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from 'firebase/firestore';

import { db, auth } from '../../firebase';

import AddDocumentModal from '../components/AddDocumentModal';

export default function Documents() {

  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [documents, setDocuments] = useState<any[]>([]);

  // CARGAR DOCUMENTOS EN TIEMPO REAL
  useEffect(() => {

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {

      if (!user) {

        console.log('NO HAY USUARIO');

        return;
      }

      console.log('USUARIO ACTIVO:', user.uid);

      const q = query(
        collection(db, 'documents'),
        where('uid', '==', user.uid)
      );

      const unsubscribeDocs = onSnapshot(q, (snapshot) => {

        const docsData = snapshot.docs.map(doc => ({

          id: doc.id,
          ...doc.data()

        }));

        console.log('DOCUMENTOS:', docsData);

        setDocuments(docsData);

      });

      return () => unsubscribeDocs();

    });

    return () => unsubscribeAuth();

  }, []);

  // CATEGORÍAS
  const documentCategories = [

    {
      id: 'pedigree',
      title: 'Certificados LOE y Pedigrí',
      color: 'bg-blue-500',

      documents: documents.filter(
        (doc: any) => doc.category === 'pedigree'
      ),
    },

    {
      id: 'health',
      title: 'Certificados Oficiales de Salud',
      color: 'bg-teal-500',

      documents: documents.filter(
        (doc: any) => doc.category === 'health'
      ),
    },

    {
      id: 'health-records',
      title: 'Cartillas Sanitarias',
      color: 'bg-green-500',

      documents: documents.filter(
        (doc: any) => doc.category === 'health-records'
      ),
    },

    {
      id: 'contracts',
      title: 'Contratos',
      color: 'bg-purple-500',

      documents: documents.filter(
        (doc: any) => doc.category === 'contracts'
      ),
    },
  ];

  // FILTRAR
  const filteredCategories = useMemo(() => {

    if (!searchTerm.trim()) {

      return documentCategories;

    }

    return documentCategories.filter((category) =>
      category.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  }, [searchTerm, documents]);

  // TOTAL DOCUMENTOS
  const totalDocuments = documentCategories.reduce(
    (total, category) => total + category.documents.length,
    0
  );

  // DOCUMENTOS PENDIENTES
  const pendingDocuments = documentCategories.reduce(
    (total, category) => {

      return (
        total +
        category.documents.filter(
          (doc: any) => doc.status === 'Pendiente'
        ).length
      );

    },
    0
  );

  // COLOR STATUS
  const getStatusColor = (status: string) => {

    switch (status?.toLowerCase()) {

      case 'completo':
      case 'actualizado':
      case 'firmado':

        return 'bg-green-500/20 text-green-400';

      case 'pendiente':

        return 'bg-orange-500/20 text-orange-400';

      default:

        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (

    <div className="min-h-screen bg-slate-900">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-6">

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-white text-2xl font-semibold">
            Documentación
          </h1>

          {/* BOTÓN AÑADIR */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
          >

            <Plus className="w-5 h-5 text-white" />

          </button>

        </div>

        {/* SEARCH */}
        <div className="flex gap-3">

          <div className="flex-1 relative">

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar documentos..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />

          </div>

          <button className="w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">

            <Filter className="w-5 h-5 text-white" />

          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mt-6">

          <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">

            <p className="text-slate-300 text-xs mb-1">
              Total documentos
            </p>

            <p className="text-white text-2xl font-semibold">
              {totalDocuments}
            </p>

          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">

            <p className="text-slate-300 text-xs mb-1">
              Pendientes
            </p>

            <p className="text-white text-2xl font-semibold">
              {pendingDocuments}
            </p>

          </div>

        </div>

      </div>

      {/* CATEGORIES */}
      <div className="px-6 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {filteredCategories.map((category) => (

            <Link
              key={category.id}
              to={`/documents/${category.id}`}
              className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all group cursor-pointer"
            >

              {/* HEADER */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">

                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>

                  <FileText className="w-6 h-6 text-white" />

                </div>

                <div className="flex-1">

                  <h2 className="text-white text-lg font-medium">
                    {category.title}
                  </h2>

                  <p className="text-slate-300 text-xs">
                    {category.documents.length} documentos
                  </p>

                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />

              </div>

              {/* DOCUMENTOS */}
              {category.documents.length > 0 ? (

                <div className="space-y-2">

                  {category.documents.slice(0, 3).map((doc: any) => (

                    <div
                      key={doc.id}
                      className="bg-slate-800 rounded-xl p-3 border border-slate-700"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">

                          <FileText className="w-4 h-4 text-slate-200" />

                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-white text-sm font-medium truncate">
                            {doc.name}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-slate-400">

                            <span>{doc.fileName}</span>

                          </div>

                        </div>

                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs"
                        >
                          Ver PDF
                        </a>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="flex flex-col items-center justify-center py-10 text-center">

                  <div className="w-14 h-14 rounded-2xl bg-slate-700/40 flex items-center justify-center mb-3">

                    <FileText className="w-7 h-7 text-slate-500" />

                  </div>

                  <p className="text-slate-300 text-sm mb-1">
                    No hay documentos todavía
                  </p>

                  <p className="text-slate-500 text-xs">
                    Pulsa para añadir documentos
                  </p>

                </div>

              )}

            </Link>

          ))}

        </div>

      </div>

      {/* MODAL */}
      {showAddModal && (

        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
        />

      )}

    </div>
  );
}