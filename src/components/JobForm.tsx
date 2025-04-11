import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { DatePickerInput } from "./DatePickerInput";
import { format } from "date-fns";
import { JobApplication } from "../types";

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<JobApplication, "id">) => Promise<void>;
  initialData?: JobApplication;
  isEditing?: boolean;
}

export function JobForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: JobFormProps) {
  const [formData, setFormData] = useState({
    company: initialData?.company || "",
    role: initialData?.role || "",
    status: initialData?.status || "Applied",
    applicationDate: initialData?.applicationDate || new Date(),
    link: initialData?.link || "",
    _id: initialData?._id || "",
  });

  useEffect(() => {
    setFormData({
      company: initialData?.company || "",
      role: initialData?.role || "",
      status: initialData?.status || "Applied",
      applicationDate: initialData?.applicationDate || new Date(),
      link: initialData?.link || "",
      _id: initialData?._id || "",
    });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
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
        <form
          onSubmit={handleSubmit}
          className="neo-card space-y-4 w-full max-w-2xl"
        >
          <DialogTitle className="text-2xl font-semibold gradient-text mb-4">
            {isEditing ? "Edit Application" : "Add New Application"}
          </DialogTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Company</label>
              <input
                type="text"
                className="neo-input"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Role</label>
              <input
                type="text"
                className="neo-input"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Status</label>
              <select
                className="neo-input"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as JobApplication["status"],
                  })
                }
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <DatePickerInput
              label="Application Date"
              value={format(formData.applicationDate, "yyyy-MM-dd")}
              onChange={(date) =>
                setFormData({ ...formData, applicationDate: new Date(date) })
              }
            />

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Application Link</label>
              <input
                type="url"
                className="neo-input"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="neo-button text-gray-400"
            >
              Cancel
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="gradient-border"
            >
              <button type="submit" className="px-6 py-2">
                {isEditing ? "Update" : "Submit"}
              </button>
            </motion.div>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
