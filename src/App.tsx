import { useState, useCallback, useMemo, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format, isWithinInterval, parseISO } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { JobApplication } from "./types";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { JobForm } from "./components/JobForm";
import { JobList } from "./components/JobList";
import { DatePickerInput } from "./components/DatePickerInput";
import { BACKEND_URL } from "./services";

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const verifyAuth = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/check-auth`, {
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        await fetchJobs();
      } else {
        setIsAuthenticated(false);
        setApplications([]);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setIsAuthenticated(false);
      setUserEmail(undefined);
      setApplications([]);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const jobs = await response.json();
      setApplications(jobs);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    }
  }, []);

  const handleJobSubmit = async (data: Omit<JobApplication, "_id">) => {
    if (!isAuthenticated) {
      toast.error("Please login to add applications");
      setShowAuthModal(true);
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${BACKEND_URL}/api/jobs/${editingId}`
        : `${BACKEND_URL}/api/jobs`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save job application");
      }

      await fetchJobs();
      toast.success(editingId ? "Application updated!" : "Application added!");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to save job application");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      await fetchJobs();
      toast.success("Application deleted!");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: JobApplication["status"]
  ) => {
    try {
      const job = applications.find((app) => app._id === id);
      if (!job) return;

      const response = await fetch(`${BACKEND_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...job, status: newStatus }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchJobs();
      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const statusMatch = filter === "all" || app.status === filter;

        if (!dateRange.startDate || !dateRange.endDate) {
          return statusMatch;
        }

        const appDate = parseISO(format(app.applicationDate, "yyyy-MM-dd"));
        const start = parseISO(dateRange.startDate);
        const end = parseISO(dateRange.endDate);

        return statusMatch && isWithinInterval(appDate, { start, end });
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return (
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
          );
        }
        return (
          new Date(a.applicationDate).getTime() -
          new Date(b.applicationDate).getTime()
        );
      });
  }, [applications, filter, sortBy, dateRange]);

  const clearDateFilter = () => {
    setDateRange({
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <div className="neo-card mb-8">
          <Navbar
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onAuthClick={() => setShowAuthModal(true)}
            onLogout={handleLogout}
          />

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            mode={authMode}
            onModeChange={setAuthMode}
            setIsAuthenticated={setIsAuthenticated}
            setUserEmail={setUserEmail}
          />

          <div className="flex justify-between items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please login to add applications");
                  setShowAuthModal(true);
                  return;
                }
                setShowForm(true);
                setEditingId(null);
              }}
              className="neo-button flex items-center gap-2 gradient-text"
            >
              <PlusCircle size={20} />
              Add Application
            </motion.button>
          </div>

          <JobForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            onSubmit={handleJobSubmit}
            initialData={applications.find((app) => app._id === editingId)}
            isEditing={!!editingId}
          />

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm text-gray-400">Status Filter</label>
              <select
                className="neo-input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm text-gray-400">Sort By</label>
              <select
                className="neo-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Date Range</label>
                {(dateRange.startDate || dateRange.endDate) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearDateFilter}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Clear
                  </motion.button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePickerInput
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(date) =>
                    setDateRange({ ...dateRange, startDate: date })
                  }
                />
                <DatePickerInput
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(date) =>
                    setDateRange({ ...dateRange, endDate: date })
                  }
                />
              </div>
            </div>
          </div>

          <JobList
            jobs={filteredApplications}
            onEdit={(job) => {
              setEditingId(job._id);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
