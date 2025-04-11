import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { Mail, Lock, X } from "lucide-react";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../services";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUserEmail: (email: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  onModeChange,
  setIsAuthenticated,
  setUserEmail,
}: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      onClose();
      if (mode === "login") {
        setIsAuthenticated(true);
        setUserEmail(data.data.user.email);
      }
      setFormData({ email: "", password: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="neo-card w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <DialogTitle className="text-2xl font-semibold gradient-text">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  className="neo-input pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  className="neo-input pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="gradient-border"
            >
              <button type="submit" className="w-full py-2">
                {mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            </motion.div>

            <p className="text-center text-gray-400 text-sm">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={() =>
                  onModeChange(mode === "login" ? "register" : "login")
                }
                className="ml-2 text-indigo-400 hover:text-indigo-300"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
