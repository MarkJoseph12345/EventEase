"use client"

import { useEffect, useState } from "react";
import { Event } from "../../utils/interfaces";
import AdminEventDetailModal from "../Modals/AdminEventDetailModal";
import Sidebar from "../Comps/Sidebar";
import { fetchEventPicture, getEvents } from "@/utils/apiCalls";
import Loading from "../Loader/Loading";
import { formatDate } from "@/utils/data";

const AdminDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState(false);
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };


  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await getEvents();

        if (Array.isArray(fetchedEvents) && fetchedEvents.length === 0) {
          setError(true);
        } else {
          setError(false);

          const currentTime = new Date();

          const processedEvents = await Promise.all(
            fetchedEvents.map(async (event) => {
              if (event.eventType && Array.isArray(event.eventType)) {
                const eventTypeString = event.eventType[0];
                event.eventType = eventTypeString.split(", ");
              }
              event.eventPicture = await fetchEventPicture(event.id!);
              return event;
            })
          );

          const upcomingEvents = processedEvents.filter(
            (event) => new Date(event.eventEnds!).getTime() > currentTime.getTime()
          );

          const sortedEvents = upcomingEvents.sort((a, b) =>
            new Date(a.eventStarts!).getTime() - new Date(b.eventStarts!).getTime()
          );

          const closestEvents = sortedEvents.slice(0, 3);

          setEvents(closestEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        setError(true);
      }
    };

    loadEvents();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="mt-[6rem] mx-2 mb-4 ml-[2rem]">
        <p className="text-xl font-semibold tablet:text-3xl font-bevietnam">Hello, admin</p>
        <p className="tablet:text-xl text-[10px] font-poppins">Manage your events!</p>
        <div className="w-full border-t my-4" />
        <p className="text-xl font-medium font-poppins underline">Closest Events</p>

        <div className="tablet:flex tablet:justify-center tablet:gap-5 tablet:flex-wrap">
          {error ? (
            <div className="flex flex-col items-center gap pt-2">
              <img src="no-event-image.png" alt="No events today" className="mb-4 w-32 h-32" />
              <p className="font-poppins text-center text-gray-700 mx-4">Oops! Looks like there are no events found.</p>
            </div>
          ) : (
            events.map(event => (
              <div
                key={event.id}
                className="flex items-center border border-gray-200 rounded-md p-4 mt-2 tablet:flex-col tablet:text-center"
                onClick={() => handleEventClick(event)}
              >
                <img
                  src={event.eventPicture}
                  alt={event.eventName}
                  className="w-16 h-16 object-cover rounded-md mr-4 tablet:mr-0 tablet:w-72 tablet:h-56 tablet:object-fill"
                />
                <div>
                  <p className="font-semibold">{event.eventName}</p>
                  <p className="text-gray-600">{formatDate(event.eventStarts)}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
      {selectedEvent && <AdminEventDetailModal event={selectedEvent} onClose={handleClosePopup} />}
    </div>
  )
}

export default AdminDashboard;