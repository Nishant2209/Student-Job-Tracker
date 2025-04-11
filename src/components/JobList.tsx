import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Link as LinkIcon,
  Trash2,
  Edit2,
} from "lucide-react";
import { format } from "date-fns";
import { JobApplication } from "../types";

interface JobListProps {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: JobApplication["status"]) => void;
}

const statusColors = {
  Applied: "from-blue-500 to-blue-600",
  Interview: "from-yellow-500 to-yellow-600",
  Offer: "from-green-500 to-green-600",
  Rejected: "from-red-500 to-red-600",
};

export const JobList = memo(function JobList({
  jobs,
  onEdit,
  onDelete,
  onStatusUpdate,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-8"
      >
        No applications found. Start by adding your first job application!
      </motion.div>
    );
  }

  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {jobs.map((job) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="neo-card hover-scale"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {job.company}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Briefcase size={18} />
                  <span>{job.role}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar size={18} />
                  <span>
                    {format(new Date(job.applicationDate), "MMM dd, yyyy")}
                  </span>
                </div>
                {job.link && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                  >
                    <LinkIcon size={18} />
                    View Application
                  </motion.a>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-1 rounded-full bg-gradient-to-r ${
                      statusColors[job.status]
                    } text-white text-sm font-medium`}
                  >
                    {job.status}
                  </motion.button>
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {(
                      ["Applied", "Interview", "Offer", "Rejected"] as const
                    ).map((status) => (
                      <motion.button
                        key={status}
                        whileHover={{ backgroundColor: "#1f2937" }}
                        onClick={() => onStatusUpdate(job._id, status)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          job.status === status
                            ? "bg-gradient-to-r " +
                              statusColors[status] +
                              " text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {status}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(job)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <Edit2 size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(job._id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});
