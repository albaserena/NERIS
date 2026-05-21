import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit
} from 'lucide-react';

import {
  signOut,
  onAuthStateChanged,
  deleteUser
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

import { auth, db } from "../../firebase";

import EditProfileModal from '../components/EditProfileModal';

export default function Profile() {

  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [userUid, setUserUid] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    kennel: '',
  });

  // CARGAR DATOS USUARIO
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {
          return;
        }

        try {

          setUserUid(user.uid);

          const docRef = doc(
            db,
            "users",
            user.uid
          );

          const docSnap = await getDoc(docRef);

          // SI EXISTE
          if (docSnap.exists()) {

            const data = docSnap.data();

            setProfileData({
              name: data.name || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              address: data.address || '',
              kennel: data.kennel || '',
            });

          } else {

            // CREAR NUEVO PERFIL
            const newUserData = {

              name: '',
              email: user.email || '',
              phone: '',
              address: '',
              kennel: '',
            };

            await setDoc(
              doc(db, "users", user.uid),
              newUserData
            );

            setProfileData(newUserData);
          }

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      }
    );

    return () => unsubscribe();

  }, [navigate]);

  // LOGOUT
  const handleLogout = async () => {

    try {

      await signOut(auth);

    } catch (error) {

      console.error(error);
    }
  };

  // ELIMINAR CUENTA
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {

    try {

      setDeleteLoading(true);

      const user = auth.currentUser;

      if (!user) return;

      // BORRAR DATOS FIRESTORE
      await deleteDoc(
        doc(db, "users", user.uid)
      );

      // LIMPIAR STORAGE
      localStorage.clear();

      // ELIMINAR USUARIO AUTH
      await deleteUser(user);

      // REDIRECCIÓN
      window.location.href = '/';

    } catch (error: any) {

      console.error(error);

      // FIREBASE PIDE VOLVER A INICIAR SESIÓN
      if (error.code === 'auth/requires-recent-login') {
        await signOut(auth);
        window.location.href = '/auth';
        return;
      }

    }
  };

  // GUARDAR PERFIL
  const handleSaveProfile = async (data: any) => {

    try {

      const user = auth.currentUser;

      if (!user) return;

      await setDoc(
        doc(db, "users", user.uid),
        {
          ...data,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      setProfileData(data);

      setIsEditModalOpen(false);

    } catch (error) {

      console.error(error);

    }
  };

  // STATS
  const stats = useMemo(() => {

    return {
      dogs: 0,
      litters: 0,
      awards: 0,
    };

  }, []);

  const menuSections = [

    {
      title: 'Información Personal',
      items: [
        {
          icon: User,
          label: 'Nombre completo',
          value: profileData.name || 'Sin configurar',
          action: null
        },
        {
          icon: Mail,
          label: 'Email',
          value: profileData.email || 'Sin configurar',
          action: null
        },
        {
          icon: Phone,
          label: 'Teléfono',
          value: profileData.phone || 'Sin configurar',
          action: null
        },
        {
          icon: MapPin,
          label: 'Dirección',
          value: profileData.address || 'Sin configurar',
          action: null
        },
        {
          icon: Building,
          label: 'Criadero',
          value: profileData.kennel || 'Sin configurar',
          action: null
        },
      ],
    },

    {
      title: 'Configuración',
      items: [
        {
          icon: Bell,
          label: 'Notificaciones',
          value: null,
          action: () => {}
        },
        {
          icon: Shield,
          label: 'Privacidad y seguridad',
          value: null,
          action: () => {}
        },
        {
          icon: Settings,
          label: 'Preferencias',
          value: null,
          action: () => {}
        },
      ],
    },

    {
      title: 'Soporte',
      items: [
        {
          icon: FileText,
          label: 'Términos y condiciones',
          value: null,
          action: () => {}
        },
        {
          icon: HelpCircle,
          label: 'Ayuda y soporte',
          value: null,
          action: () => {}
        },
      ],
    },
  ];

  // LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-slate-900 flex items-center justify-center">

        <p className="text-white text-lg">
          Cargando perfil...
        </p>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-900">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 pt-8 pb-8">

        <div className="flex justify-end mb-4">

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >

            <Edit className="w-5 h-5 text-white" />

          </button>

        </div>

        <div className="flex flex-col items-center">

          {/* FOTO */}
          <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mb-4 border-4 border-slate-700">

            <User className="w-12 h-12 text-slate-300" />

          </div>

          {/* NOMBRE */}
          <h1 className="text-white text-2xl mb-1">

            {profileData.name || 'Nuevo usuario'}

          </h1>

          <p className="text-slate-300 text-sm">

            Criador profesional

          </p>

          {/* STATS */}
          <div className="flex gap-6 mt-6">

            <div className="text-center">

              <p className="text-white text-xl">
                {stats.dogs}
              </p>

              <p className="text-slate-300 text-xs">
                Perros
              </p>

            </div>

            <div className="w-px bg-slate-700"></div>

            <div className="text-center">

              <p className="text-white text-xl">
                {stats.litters}
              </p>

              <p className="text-slate-300 text-xs">
                Camadas
              </p>

            </div>

            <div className="w-px bg-slate-700"></div>

            <div className="text-center">

              <p className="text-white text-xl">
                {stats.awards}
              </p>

              <p className="text-slate-300 text-xs">
                Premios
              </p>

            </div>

          </div>

        </div>
      </div>

      {/* MENUS */}
      <div className="px-6 py-6 space-y-8">

        {menuSections.map((section) => (

          <div key={section.title}>

            <h2 className="text-slate-300 text-xs uppercase tracking-wider mb-3 px-1">

              {section.title}

            </h2>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">

              {section.items.map((item, index) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.label}
                    onClick={item.action || undefined}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-slate-700 transition-colors ${
                      index !== section.items.length - 1
                        ? 'border-b border-slate-700'
                        : ''
                    }`}
                  >

                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">

                      <Icon className="w-5 h-5 text-slate-300" />

                    </div>

                    <div className="flex-1 text-left min-w-0">

                      <p className="text-white text-sm">

                        {item.label}

                      </p>

                      {item.value && (

                        <p className="text-slate-300 text-xs truncate">

                          {item.value}

                        </p>

                      )}

                    </div>

                    {item.action && (

                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />

                    )}

                  </button>

                );
              })}
            </div>
          </div>
        ))}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-red-500/20 transition-colors"
        >

          <LogOut className="w-5 h-5 text-red-400" />

          <span className="text-red-400">

            Cerrar sesión

          </span>

        </button>

        {/* DELETE ACCOUNT */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-center hover:bg-slate-700 transition-colors"
        >

          <span className="text-slate-300">

            Eliminar cuenta

          </span>

        </button>

        {/* VERSION */}
        <p className="text-center text-slate-500 text-xs">

          NERIS v1.0.0

        </p>

      </div>

      {/* DELETE MODAL */}

{showDeleteModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

    <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-slate-900 shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-800">

        <h2 className="text-white text-xl font-semibold mb-2">

          Eliminar cuenta

        </h2>

        <p className="text-slate-400 text-sm leading-relaxed">

          Esta acción eliminará permanentemente tu cuenta,
          tus datos y toda la información almacenada en NERIS.

        </p>

      </div>

      {/* WARNING */}
      <div className="px-6 py-5">

        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">

          <p className="text-red-300 text-sm">

            Esta acción no se puede deshacer.

          </p>

        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 p-6 pt-0">

        <button
          onClick={() => setShowDeleteModal(false)}
          className="flex-1 h-12 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
        >

          Cancelar

        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="flex-1 h-12 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
        >

          {deleteLoading
            ? 'Eliminando...'
            : 'Eliminar'}

        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}