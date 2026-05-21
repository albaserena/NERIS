import { useState } from 'react';

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  PawPrint,
  User,
  ArrowLeft,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import { auth, db } from "../../firebase";
import fondoLogin from '../../imports/idea_login4.jpeg';

import {
  doc,
  setDoc
} from "firebase/firestore";

export default function Auth() {

  const [showRegister, setShowRegister] = useState(false);

  // LOGIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  // RESET PASSWORD
  const [loadingReset, setLoadingReset] = useState(false);

  // REGISTER
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [kennel, setKennel] = useState('');

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // MENSAJES
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setMessage('');

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setMessageType('success');

      setMessage('Inicio de sesión correcto');

    } 

    catch (error: any) {

      console.error(error);

      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {

        setError('Correo o contraseña incorrectos.');

      } else if (error.code === 'auth/user-not-found') {

        setError('No existe ninguna cuenta con este correo.');

      } else if (error.code === 'auth/invalid-email') {

        setError('Correo electrónico inválido.');

      } else {

        setError('Error al iniciar sesión.');

      }

    }
  };

  // RESET PASSWORD
  const handleForgotPassword = async () => {

    setMessage('');

    if (!email) {

      setMessageType('error');

      setMessage(
        'Introduce tu correo electrónico primero'
      );

      return;
    }

    try {

      setLoadingReset(true);

      await sendPasswordResetEmail(
        auth,
        email
      );

      setMessageType('success');

      setMessage(
        'Te hemos enviado un correo para restablecer la contraseña'
      );

    } catch (error: any) {

      console.error(error);

      setMessageType('error');

      if (error.code === 'auth/user-not-found') {

        setMessage(
          'No existe ninguna cuenta con ese correo'
        );

      } else if (error.code === 'auth/invalid-email') {

        setMessage(
          'Correo electrónico inválido'
        );

      } else {

        setMessage(
          'No se pudo enviar el correo de recuperación'
        );
      }

    } finally {

      setLoadingReset(false);
    }
  };

  // REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (registerPassword !== confirmPassword) {
      setMessageType('error');
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: registerEmail,
        phone: phone,
        address: address,
        kennel: kennel,
        createdAt: new Date(),
      });

      setMessageType('success');

      setMessage(
        'Cuenta creada correctamente. Ahora inicia sesión.'
      );

    } catch (error: any) {     

      setMessageType('error');

      if (error.code === 'auth/email-already-in-use') {
        setMessage('Ya existe una cuenta con este correo.');

      } else if (error.code === 'auth/weak-password') {
        setMessage(
          'La contraseña debe tener al menos 6 caracteres'
        );

      } else {
        setMessage('Error al registrarse');
      }
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${fondoLogin})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 z-0" />

      <div className="relative z-10 w-full max-w-md">

        <div
          className="rounded-3xl p-8 shadow-2xl border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >

          {message && (

            <div
              className={`mb-6 p-4 rounded-xl text-sm border backdrop-blur-md ${
                messageType === 'success'
                  ? 'bg-green-500/20 border-green-400/30 text-green-100'
                  : 'bg-red-500/20 border-red-400/30 text-red-100'
              }`}
            >
              {message}
            </div>

          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm border backdrop-blur-md bg-red-500/20 border-red-400/30 text-red-100">
              {error}
            </div>
          )}

          {!showRegister ? (

            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30">
                  <PawPrint
                    className="w-8 h-8 text-white"
                    strokeWidth={2}
                  />
                </div>

                <h1 className="text-white text-4xl font-bold mb-1">
                  NERIS
                </h1>

                <p className="text-white/70 text-sm">
                  Gestión integral de criadores
                </p>

              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                <div className="space-y-2">

                  <label
                    htmlFor="email"
                    className="text-white/90 text-sm block"
                  >
                    Correo electrónico
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                      required
                    />

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-white/90 text-sm block">
                    Contraseña
                  </label>

                  <div className="relative">

                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loadingReset}
                  className="w-full text-sm text-white/70 hover:text-white transition-all"
                >
                  ¿Has olvidado tu contraseña?
                </button>

                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="w-full text-sm text-white/80 hover:text-white transition-all"
                >
                  ¿No tienes cuenta? Regístrate
                </button>

              </form>
            </>

          ) : (

            <>
              <button
                onClick={() => setShowRegister(false)}
                className="flex items-center gap-2 text-white/70 hover:text-white mb-6"
              >
                <ArrowLeft size={18} />
                Volver
              </button>

              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >

                <div className="relative">

                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <div className="relative">

                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <div className="relative">

                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <div className="relative">

                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Dirección"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <div className="relative">

                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type="text"
                    value={kennel}
                    onChange={(e) => setKennel(e.target.value)}
                    placeholder="Nombre del criadero"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <div className="relative">

                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <div className="relative">

                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
                >
                  Crear cuenta
                </button>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}