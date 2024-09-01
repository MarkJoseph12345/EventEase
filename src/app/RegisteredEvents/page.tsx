"use client"
import { useEffect, useState } from "react";
import { Event, User } from "../../utils/interfaces";
import StudentEventDetailModal from "../Modals/StudentEventDetailModal";
import StudentEventsFilteredList from "../Comps/StudentEvents";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { fetchEventPicture, getEventsJoinedByUser, me } from "../../utils/apiCalls";

const RegisteredEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userData = await me();
            setUser(userData);
          } catch (error) {
            console.error('Failed to fetch user:', error);
          }
        };
    
        fetchUser();
      }, []);


    useEffect(() => {
        if (!user?.id) {
            return;
        }
        const fetchJoinedEvents = async () => {
            try {
                const events = await getEventsJoinedByUser(user!.id!);
                const currentTime = new Date();
                const filteredEvents = events.filter(event => new Date(event.eventEnds!).getTime() > currentTime.getTime());

                const processedEvents = await Promise.all(
                    filteredEvents.map(async (event) => {
                        if (event.eventType && Array.isArray(event.eventType)) {
                            const eventTypeString = event.eventType[0];
                            event.eventType = eventTypeString.split(", ");
                        }
                        event.eventPicture = await fetchEventPicture(event.id!);
                        return event;
                    })
                );
                setJoinedEvents(processedEvents);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching joined events:", error);
                setLoading(false);
            }
        };

        fetchJoinedEvents();
    }, [user]);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
    };

    const handleClosePopup = () => {
        setSelectedEvent(null);
    };

    if (loading) {
        return <Loading />;
    }
    
    const removeUnjoinedEvent = (eventId: number) => {
        setJoinedEvents(joinedEvents.filter(event => event.id !== eventId));
        window.location.reload()
    };
    

    return (
        <div>
            <Sidebar />
            <div className="mt-[6rem] mx-2 ml-[2rem]">
                <p className="text-2xl mb-2 font-semibold font-bevietnam tablet:text-3xl">Registered Events</p>
                <div className="mb-5">
                    <div className="relative mb-5 z-0">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" className="block w-full p-2 ps-10 border rounded-md" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <StudentEventsFilteredList events={joinedEvents} searchTerm={searchTerm} onEventClick={handleEventClick} eventType="registered" />
                </div>
            </div>
            {selectedEvent && <StudentEventDetailModal event={selectedEvent} onClose={handleClosePopup} onJoinUnjoin={removeUnjoinedEvent} />}
        </div>
    );
}

export default RegisteredEvents;