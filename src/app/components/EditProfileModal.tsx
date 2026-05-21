import { useState, useEffect } from 'react';

import { X } from 'lucide-react';

interface EditProfileModalProps {

  isOpen: boolean;

  onClose: () => void;

  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    kennel: string;
  };

  onSave: (data: any) => void;
}

export default function EditProfileModal({

  isOpen,
  onClose,
  profile,
  onSave

}: EditProfileModalProps) {

  const [formData, setFormData] = useState({

    name: '',
    email: '',
    phone: '',
    address: '',
    kennel: '',
  });

  // SINCRONIZAR FIREBASE -> MODAL
  useEffect(() => {

    setFormData({

      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      kennel: profile.kennel || '',
    });

  }, [profile, isOpen]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    await onSave(formData);
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
      <div className="relative w-full max-w-lg bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">

          <h2 className="text-white text-xl">

            Editar perfil

          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
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

              <label
                htmlFor="name"
                className="text-slate-300 text-sm block mb-2"
              >

                Nombre completo

              </label>

              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />

            </div>

            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="text-slate-300 text-sm block mb-2"
              >

                Correo electrónico

              </label>

              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />

            </div>

            {/* PHONE */}
            <div>

              <label
                htmlFor="phone"
                className="text-slate-300 text-sm block mb-2"
              >

                Teléfono

              </label>

              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />

            </div>

            {/* ADDRESS */}
            <div>

              <label
                htmlFor="address"
                className="text-slate-300 text-sm block mb-2"
              >

                Dirección

              </label>

              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />

            </div>

            {/* KENNEL */}
            <div>

              <label
                htmlFor="kennel"
                className="text-slate-300 text-sm block mb-2"
              >

                Nombre del criadero

              </label>

              <input
                id="kennel"
                type="text"
                value={formData.kennel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kennel: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />

            </div>

          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-800 flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >

              Cancelar

            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >

              Guardar cambios

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}