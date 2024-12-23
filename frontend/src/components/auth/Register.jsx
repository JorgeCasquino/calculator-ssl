import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from '../../components/ui/alert';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones locales
    if (!userData.username || !userData.email || !userData.password) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando datos:', {
        username: userData.username,
        email: userData.email,
        password: userData.password
      });

      const response = await register({
        username: userData.username,
        email: userData.email,
        password: userData.password
      });

      console.log('Respuesta:', response);
      navigate('/login');
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.response?.data?.error || 'Error al registrar usuario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-6 shadow-md">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Registro
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={userData.confirmPassword}
                onChange={(e) =>
                  setUserData({ ...userData, confirmPassword: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;