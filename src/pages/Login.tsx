import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import RotatableCard from '../components/RotatableCard';
import { useAuthContext } from '../auth/AuthProvider';
import api from '../api/apiClient';
import { tokenService } from '../auth/tokenService';

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const { login, accessToken } = useAuthContext();

  // If already logged in in this tab (or after refresh), validate and redirect
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!accessToken) return;
      try {
        await api.get('/user/me');
        if (mounted) navigate('/');
      } catch {
        tokenService.setToken(null);
      }
    };
    check();
    return () => { mounted = false; };
  }, [accessToken, navigate]);

  // Listen login from other tabs and redirect
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'auth_event' && e.newValue?.startsWith('login')) {
        (async () => {
          try {
            await api.get('/user/me');
            navigate('/');
          } catch {
            tokenService.setToken(null);
          }
        })();
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [navigate]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);

    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;

        if (status === 401) {
          setError('❌ Incorrect email or password.');
        } else if (status === 404) {
          setError('🚫 Email does not exist.');
        } else if (msg) {
          setError(`⚠️ ${msg}`);
        } else {
          setError('⚠️ Login failed. Please try again.');
        }
      } else {
        setError('🌐 Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex h-screen items-center justify-center bg-linear-to-br from-indigo-400 to-blue-600"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <RotatableCard>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>

        {/* Info Box Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md text-sm mb-2"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
          <input
            {...register('email', { required: 'Email is required' })}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-blue-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="hover:underline font-medium">Sign Up</Link>
        </p>
      </RotatableCard>
    </motion.div>
  );
}
