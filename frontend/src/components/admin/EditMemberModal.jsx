import React from "react";
import Modal from "./Modal";

const EditMemberModal = ({
  open,
  onClose,
  editFields,
  setEditFields,
  onSubmit,
  loading,
}) => {
  if (!open) return null;
  return (
    <Modal title="Edit Member" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Department</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter department"
            value={editFields.department}
            onChange={(e) =>
              setEditFields({ ...editFields, department: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Designation</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter designation"
            value={editFields.designation}
            onChange={(e) =>
              setEditFields({ ...editFields, designation: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">LPU ID</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter LPU ID"
            value={editFields.LpuId}
            onChange={(e) =>
              setEditFields({ ...editFields, LpuId: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2"
            onClick={onSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? "Updating..." : "Update Member"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMemberModal;