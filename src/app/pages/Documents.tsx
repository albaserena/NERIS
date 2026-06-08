import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocs, type DocumentCategory } from '../context/DocsContext';
import { useDogs } from '../context/DogsContext';
import { storage } from '../../firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  FileText,
  Trash2,
  ArrowUpRight,
  Upload,
  FolderOpen
} from 'lucide-react';

const documentCategories = [
  {
    id: 'cartilla_sanitaria',
    label: 'Cartilla sanitaria'
  },
  {
    id: 'certificado_oficial',
    label: 'Certificado oficial'
  },
  {
    id: 'pedigree',
    label: 'Pedigree'
  },
  {
    id: 'contrato',
    label: 'Contrato'
  }
] as const;

export default function Documents() {
  const location = useLocation();
  const { user } = useAuth();
  const { documents, setDocuments, addDocument, removeDocument } = useDocs();
  const { dogs, updateDog } = useDogs();
  const [selectedDogId, setSelectedDogId] = useState<number | null>(
    location.state?.dogId ? Number(location.state.dogId) : null
  );
  const selectedDog = dogs.find((dog) => dog.id === selectedDogId) ?? null;
  const [selectedCategory, setSelectedCategory] = useState<'cartilla_sanitaria' | 'certificado_oficial' | 'pedigree' | 'contrato'>('cartilla_sanitaria');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groupedDocuments = useMemo(
    () =>
      documentCategories.map((category) => ({
        ...category,
        items: documents.filter(
          (document) => document.categoryId === category.id
        )
      })),
    [documents]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!user) {
      setError('Debes iniciar sesión para subir documentos.');
      return;
    }

    if (!selectedFile) {
      setError('Selecciona un archivo para subir.');
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const safeName = selectedFile.name.replace(/[\\/:*?"<>|]+/g, '_');
      const timestamp = Date.now();
      const path = `documents/${user.uid}/${selectedCategory}/${timestamp}_${safeName}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, selectedFile);

      const url = await getDownloadURL(storageRef);
      const categoryLabel = documentCategories.find(
        (category) => category.id === selectedCategory
      )?.label ?? 'Documento';

      const newDocument = {
        id: `${timestamp}-${safeName}`,
        name: selectedFile.name,
        categoryId: selectedCategory,
        categoryLabel,
        type: selectedFile.type || 'application/octet-stream',
        createdAt: new Date().toISOString(),
        path,
        url,
        dogId: selectedDogId ?? undefined,
        dogName: selectedDog?.name
      };

      addDocument(newDocument);

      if (selectedDogId && selectedDog) {
        const updatedDocuments = [
          {
            id: newDocument.id,
            name: newDocument.name,
            type: newDocument.type,
            categoryId: newDocument.categoryId,
            createdAt: newDocument.createdAt,
            url: newDocument.url,
            path: newDocument.path
          },
          ...(selectedDog.documents || [])
        ];

        updateDog(selectedDogId, { documents: updatedDocuments });
      }
      setSelectedFile(null);
      setMessage('Documento subido correctamente.');
    } catch (uploadError) {
      console.error(uploadError);
      setError('Error al subir el archivo. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (document: any) => {
    try {
      const storageRef = ref(storage, document.path);

      await deleteObject(storageRef);
    } catch (storageError) {
      console.warn('No se pudo borrar el archivo en Storage:', storageError);
    }

    removeDocument(document.id);
    setMessage('Documento eliminado.');
    setError(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-slate-700 bg-slate-950/70 p-8 text-center">
          <h1 className="text-white text-2xl font-semibold mb-3">Documentos</h1>
          <p className="text-slate-400">Inicia sesión para acceder a tu apartado de documentación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 rounded-3xl border border-slate-700/80 bg-slate-950/70 p-5 shadow-inner shadow-slate-950/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Documentación</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Mis archivos</h1>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FolderOpen className="w-5 h-5 text-blue-400" />
              <span>{documents.length} archivos guardados</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-4">
                <p className="text-slate-300 font-medium">Clasifica los archivos por tipo</p>
                <p className="mt-2 text-sm text-slate-500">
                  Usa las categorías para separar cartillas sanitarias, certificados oficiales, pedigrees y contratos.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-4">
                <label className="text-sm font-medium text-slate-100">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as DocumentCategory)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500"
                >
                  {documentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-4 space-y-4">
                <label className="text-sm font-medium text-slate-100">Documento asignado a</label>
                <select
                  value={selectedDogId ?? ''}
                  onChange={(event) => setSelectedDogId(event.target.value ? Number(event.target.value) : null)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {dogs.map((dogOption) => (
                    <option key={dogOption.id} value={dogOption.id}>
                      {dogOption.name}
                    </option>
                  ))}
                </select>
                <p className="text-slate-400 text-xs">
                  {selectedDog ? `Se guardará también en ${selectedDog.name}` : 'Sube el documento sin asignar a un perro.'}
                </p>
                <label className="text-sm font-medium text-slate-100">Archivo</label>
                <input
                  type="file"
                  accept="*/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-sm file:text-white"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Subiendo...' : 'Subir documento'}
                </button>

                {message && (
                  <p className="mt-3 text-sm text-emerald-300">{message}</p>
                )}

                {error && (
                  <p className="mt-3 text-sm text-rose-300">{error}</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-4">
              <p className="text-slate-300 font-medium">Resumen rápido</p>
              <div className="mt-4 grid gap-3">
                {documentCategories.map((category) => {
                  const count = documents.filter(
                    (document) => document.categoryId === category.id
                  ).length;

                  return (
                    <div
                      key={category.id}
                      className="rounded-3xl bg-slate-950/90 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-slate-200 text-sm">{category.label}</p>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {groupedDocuments.map((group) => (
            <div
              key={group.id}
              className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{group.label}</h2>
                  <p className="text-slate-500 text-sm">
                    {group.items.length} archivo{group.items.length === 1 ? '' : 's'} en esta categoría
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-300">
                  <FileText className="w-4 h-4 text-slate-300" />
                  {group.items.length}
                </div>
              </div>

              {group.items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-700/60 bg-slate-900/80 p-6 text-center text-slate-500">
                  No hay documentos en esta categoría.
                </div>
              ) : (
                <div className="space-y-3">
                  {group.items.map((document) => (
                    <div
                      key={document.id}
                      className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <p className="text-slate-200 font-semibold truncate">{document.name}</p>
                          <p className="text-slate-500 text-sm truncate">
                            Subido el {new Date(document.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(document.url, '_blank')}
                            className="inline-flex items-center gap-2 rounded-2xl border border-blue-500/50 bg-blue-500/10 px-3 py-2 text-sm text-blue-200 transition hover:bg-blue-500/20"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            Abrir
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(document)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
