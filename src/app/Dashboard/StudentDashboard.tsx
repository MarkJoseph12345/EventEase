"use client"

import { useEffect, useState } from "react";
import { Event, User } from "../../utils/interfaces";
import StudentEventDetailModal from "../Modals/StudentEventDetailModal";
import Sidebar from "../Comps/Sidebar";
import { fetchEventPicture, getEvents, me, getAllEventsAfterAttendance } from "@/utils/apiCalls";
import { formatDate } from "@/utils/data";
import Loading from "../Loader/Loading";

const StudentDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const fetchedUser = await me();
        setUser(fetchedUser);
      } catch (error) {

      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.id) return;

      try {
        const fetchedEvents = await getEvents();

        if (Array.isArray(fetchedEvents) && fetchedEvents.length === 0) {
          return;
        }
        const attendedEvents = await getAllEventsAfterAttendance(user.id);
        const attendedEventIds = new Set(attendedEvents.map((event: Event) => event.id));

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
          (event) => {
            if (user.department != 'N/A') {
              return (
                new Date(event.eventEnds!).getTime() > currentTime.getTime() &&
                event.department.includes(user.department!) || event.department.includes("Open To All") &&
                !attendedEventIds.has(event.id)
              )
            }
            else {
              return (
                new Date(event.eventEnds!).getTime() > currentTime.getTime() &&
                event.department.includes("Open To All") &&
                !attendedEventIds.has(event.id)
              )
            }
          }
        );

        const sortedEvents = upcomingEvents.sort((a, b) =>
          new Date(a.eventStarts!).getTime() - new Date(b.eventStarts!).getTime()
        );

        const closestEvents = sortedEvents.slice(0, 3);

        setEvents(closestEvents);
      } finally {
        setLoading(false)
      }
    };

    loadEvents();
  }, [user]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Sidebar />
      <div className="mt-[6rem] mx-2 mb-4 ml-[2rem]">
        <p className="text-xl font-semibold font-bevietnam tablet:text-3xl">Hello, {user.firstName}</p>
        <p className="tablet:text-xl font-poppins">
          {user.department === "N/A"
            ? "Discover exciting events in Wildcats Innovation Labs!"
            : "Discover exciting events for your department!"}
        </p>
        <div className="w-full border-t my-4" />
        <p className="text-xl font-medium font-poppins underline">
          {user.department === "N/A"
            ? "Closest Events"
            : `Closest ${user.department} Events`}
        </p>
        <div className="tablet:flex tablet:justify-center tablet:gap-5 tablet:flex-wrap">
          {events.length == 0 ? (
            <div className="flex flex-col items-center gap pt-2">
              <img src="no-event-image.png" alt="No events today" className="mb-4 w-32 h-32" />
              <p className="font-poppins text-center text-gray-700 mx-4">Oops! Looks like there are no events found.</p>
            </div>
          ) : (
            events.map(event => (
              <div
                key={event.id}
                className="flex items-center border border-gray-200 rounded-md p-4 mt-2 tablet:flex-col tablet:text-center cursor-pointer transition-transform transform hover:-translate-y-1"
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
      {selectedEvent && <StudentEventDetailModal event={selectedEvent} onClose={handleClosePopup} />}
    </div>
  );
};

export default StudentDashboard;
