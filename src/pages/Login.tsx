import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import RotatableCard from "../components/RotatableCard";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log("Mock login:", data);
    alert("✅ Logged in successfully (mock)!");
    setTimeout(() => navigate("/"), 600); // chuyển về Home có animation
  };

  return (
    <motion.div
      className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-400 to-blue-600"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <RotatableCard>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-blue-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="hover:underline font-medium">Sign Up</Link>
        </p>
      </RotatableCard>
    </motion.div>
  );
}
