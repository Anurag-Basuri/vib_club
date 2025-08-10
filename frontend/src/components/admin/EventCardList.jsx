import React from "react";
import { Edit, Trash2, CalendarDays } from "lucide-react";
import StatusBadge from "./StatusBadge";

const EventCardList = ({
  events,
  eventsLoading,
  handleDeleteEvent,
  openEditEventModal,
}) => {
  if (eventsLoading)
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!events || events.length === 0)
    return (
      <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
        <CalendarDays className="h-12 w-12 mx-auto text-gray-500" />
        <h3 className="text-xl font-bold text-gray-400 mt-4">No events found</h3>
        <p className="text-gray-500 mt-2">
          Create your first event to get started
        </p>
      </div>
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 hover:border-blue-500/50 transition"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-white text-lg">{event.title}</h3>
            <StatusBadge status={event.status} />
          </div>
          <div className="text-gray-400 text-sm mb-4">
            {event.date ? new Date(event.date).toLocaleString() : ""}
          </div>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description || "No description"}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              {event.location || "No location"}
            </span>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => openEditEventModal(event)}
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-gray-700 hover:bg-red-600"
                onClick={() => handleDeleteEvent(event._id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCardList;