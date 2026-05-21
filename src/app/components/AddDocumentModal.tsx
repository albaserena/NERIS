import { X, Upload } from 'lucide-react';
import { useState } from 'react';

import { auth, db, storage } from '../../firebase';

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

interface Props {
  onClose: () => void;
}

export default function AddDocumentModal({
  onClose
}: Props) {
                                     //GUARDO:
  const [name, setName] = useState('');//nom de usuario
  const [category, setCategory] = useState('pedigree');//cat.x defecto
  const [file, setFile] = useState<File | null>(null);//selección de archivo
  //deshabilitar botón mientras se sube el archivo
  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    //comprobacion campos
    if (!file || !name) {
      alert('Completa todos los campos');
      return;
    }

    try {

      setLoading(true);
      const user = auth.currentUser;
      console.log('USUARIO:', user);
      if (!user) {
        alert('No hay usuario autenticado');
        return;
      }

      // en esta ruta se guarda el archivo en storage con un nombre único para evitar colisiones
      const storageRef = ref(
        storage,
        `documents/${user.uid}/${Date.now()}_${file.name}`
      );

      // subida del archivo a storage
      await uploadBytes(storageRef, file);

      // obtener URL de descarga del archivo subido
      const downloadURL = await getDownloadURL(storageRef);
      console.log('URL PDF:', downloadURL);

      // guardar al info en firestore en la colección 'documents'
      // con el uid del usuario para asociarlo
            await addDoc(collection(db, 'documents'), {

        uid: user.uid,
        name,
        category,
        fileName: file.name,
        url: downloadURL,
        status: 'Pendiente',
        createdAt: serverTimestamp()

      });

      alert('Documento subido correctamente');
 
      // cerrar modal después de un breve retraso para mostrar el mensaje
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {

      console.error(error);
      alert('Error al subir documento');

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-800 border border-slate-700 p-6">

        {/*cabezera*/ }
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">
            Añadir documento
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* input nombre */}
        <div className="mb-4">
          <label className="block text-sm text-slate-300 mb-2">
            Nombre del documento
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Pedigrí Thor"
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* select categoría */}
        <div className="mb-4">

          <label className="block text-sm text-slate-300 mb-2">
            Categoría
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="pedigree">
              Certificados LOE y Pedigrí
            </option>

            <option value="health">
              Certificados Oficiales de Salud
            </option>

            <option value="health-records">
              Cartillas Sanitarias
            </option>

            <option value="contracts">
              Contratos
            </option>

          </select>

        </div>

        {/* SUBIR ARCHIVO */}
        <div className="mb-6">

          <label className="block text-sm text-slate-300 mb-2">
            Archivo
          </label>

          <label className="w-full h-36 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">

            <Upload className="w-8 h-8 text-slate-400 mb-2" />

            <p className="text-slate-300 text-sm">
              Pulsa para subir archivo
            </p>

            <p className="text-slate-500 text-xs mt-1">
              PDF, JPG, PNG...
            </p>

            {/* mostrar (si ya hay) el nombre del archivo seleccionado*/ }
            {file && (

              <p className="text-green-400 text-xs mt-3">
                {file.name}
              </p>

            )}

            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {

                //el archivo seleccionado se guarda en el estado para luego subirlo a storage
                if (e.target.files?.[0]) {

                  setFile(e.target.files[0]);

                }

              }}
            />

          </label>

        </div>

        {/* BOTONES */}
        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Subiendo...' : 'Guardar'}
          </button>

        </div>
      </div>
    </div>
  );
}