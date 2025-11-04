import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/userApi";
import RotatableCard from "../components/RotatableCard";
import { useAuthContext } from '../auth/AuthProvider';
import api from '../api/apiClient';
import { tokenService } from '../auth/tokenService';

interface FormData {
  email: string;
  password: string;
}

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!accessToken) return;
      try {
        await api.get('/user/me');
        if (mounted) navigate('/');
      } catch (e) {
        tokenService.setToken(null);
      }
    };
    check();
    return () => { mounted = false; };
  }, [accessToken, navigate]);

  // Listen for login events from other tabs and validate session then redirect
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'auth_event' && e.newValue && e.newValue.startsWith('login')) {
        (async () => {
          try {
            await api.get('/user/me');
            navigate('/');
          } catch (err) {
            tokenService.setToken(null);
          }
        })();
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // UI success state đã được hiển thị bên dưới
      setTimeout(() => navigate("/"), 800);
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <motion.div
      className="flex h-screen items-center justify-center bg-linear-to-br from-green-400 to-teal-500"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <RotatableCard>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {mutation.isPending ? "Registering..." : "Sign Up"}
          </button>

          {mutation.isSuccess && (
            <p className="text-green-700 text-sm mt-2">
              ✅ {mutation.data?.message || "Registration successful!"}
            </p>
          )}

          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              ❌ {(mutation.error as Error).message}
            </p>
          )}
        </form>

        <p className="mt-4 text-sm text-blue-600">
          Already have an account?{" "}
          <Link to="/login" className="hover:underline font-medium">
            Login
          </Link>
        </p>
      </RotatableCard>
    </motion.div>
  );
}
