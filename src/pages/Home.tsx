import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHeroText from "../components/FloatingHeroText";
import FloatingHearts from "../components/FloatingHearts";

export default function Home() {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 text-gray-800 overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 text-gray-800 overflow-hidden">
      {/* 🌟 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-600">Auth3D Demo</h1>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* 💫 Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <FloatingHeroText
          title="Welcome to Auth3D 🌐"
          subtitle="Experience smooth, interactive 3D login and sign-up forms built with React + Framer Motion. Explore modern UI animation, form validation, and responsive design."
        />

        {/* 🎯 CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="flex gap-4 mt-10"
        >
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition"
          >
            Create Account
          </Link>
        </motion.div>

        {/* 🪩 Floating 3D Elements */}
        <motion.div
          className="absolute top-32 left-10 w-24 h-24 bg-indigo-400/30 rounded-full blur-2xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-10 w-32 h-32 bg-blue-300/40 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            rotate: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-500/20 rounded-full blur-2xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
          }}
        />
      </main>

      <FloatingHearts />

      {/* ⚙️ Footer */}
      <footer className="bg-white/70 backdrop-blur-md text-center py-4 shadow-inner text-gray-600 text-sm">
        <p>
          © {new Date().getFullYear()} Auth3D Demo — built with ❤️ by{" "}
          <span className="font-medium text-indigo-500">Phạm Chí Thuần</span>
        </p>
      </footer>
    </div>
     </motion.div>
  );
}
