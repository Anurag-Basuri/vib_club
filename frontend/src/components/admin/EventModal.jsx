import React from "react";
import Modal from "./Modal";

const EventModal = ({
  isEdit = false,
  open,
  onClose,
  eventFields,
  setEventFields,
  onSubmit,
  loading,
}) => {
  if (!open) return null;
  return (
    <Modal title={isEdit ? "Edit Event" : "Create Event"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Event Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
            value={eventFields.title}
            onChange={(e) =>
              setEventFields({ ...eventFields, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Date & Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventFields.date}
            onChange={(e) =>
              setEventFields({ ...eventFields, date: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Location</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter location"
            value={eventFields.location}
            onChange={(e) =>
              setEventFields({ ...eventFields, location: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            rows="3"
            value={eventFields.description}
            onChange={(e) =>
              setEventFields({ ...eventFields, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Status</label>
          <select
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventFields.status}
            onChange={(e) =>
              setEventFields({ ...eventFields, status: e.target.value })
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
            {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;