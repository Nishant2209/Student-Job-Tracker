import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";

interface NavbarProps {
  userEmail?: string;
  onAuthClick: () => void;
  onLogout: () => void;
  isAuthenticated?: boolean;
}

export function Navbar({
  userEmail,
  onAuthClick,
  onLogout,
  isAuthenticated,
}: NavbarProps) {
  return (
    <nav className="flex justify-between items-center mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold gradient-text"
      >
        Student Job Tracker
      </motion.h1>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="neo-button flex items-center gap-2"
            >
              <User size={20} className="text-indigo-400" />
              <span className="gradient-text">{userEmail}</span>
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="neo-button flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAuthClick}
          className="neo-button gradient-text"
        >
          Login
        </motion.button>
      )}
    </nav>
  );
}
