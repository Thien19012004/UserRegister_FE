import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import "./index.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FloatingTextOverlay from "./components/FloatingTextOverlay";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <FloatingTextOverlay
          phrases={["Authorization", "Login", "Sign Up", "Thien", "Haha", "Hoho", "Hehe"]}
          rows={7}
          density={5}
          speedMin={22}
          speedMax={42}
        />
        <AnimatedRoutes/>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
