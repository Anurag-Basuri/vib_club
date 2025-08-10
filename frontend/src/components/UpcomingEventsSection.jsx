import React from "react";
import { Clock, Plus, Edit, Trash2, Ticket } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import StatusBadge from "./StatusBadge";

const UpcomingEventsSection = ({
  eventsLoading,
  upcomingEvents,
  setShowCreateEvent,
  openEditEventModal,
  handleDeleteEvent,
  tickets,
  setSelectedEventId,
  setActiveTab,
}) => (
  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Clock className="h-5 w-5 text-cyan-400" />
        Upcoming Events
      </h2>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        onClick={() => setShowCreateEvent(true)}
      >
        <Plus className="h-4 w-4" />
        Create Event
      </button>
    </div>
    {eventsLoading ? (
      <LoadingSpinner />
    ) : upcomingEvents.length === 0 ? (
      <div className="text-gray-400 text-center py-8">No upcoming events found</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event) => (
          <div
            key={event._id}
            className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition cursor-pointer"
            onClick={() => {
              setSelectedEventId(event._id);
              setActiveTab("tickets");
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-lg mb-1">{event.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <StatusBadge status={event.status} />
                  <span className="text-gray-400 text-sm">
                    {event.date ? new Date(event.date).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditEventModal(event);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="p-2 rounded-full bg-gray-700 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event._id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {event.description || "No description"}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{event.location || "No location"}</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Ticket className="h-4 w-4" />
                {tickets.filter((t) => t.event === event._id).length} tickets
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default UpcomingEventsSection;