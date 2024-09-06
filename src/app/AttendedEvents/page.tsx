"use client"
import { useEffect, useState } from "react";
import { Event } from "../../utils/interfaces";
import StudentEventDetailModal from "../Modals/StudentEventDetailModal";
import StudentEventsFilteredList from "../Comps/StudentEvents";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { fetchEventPicture, getAllEventsAfterAttendance, me } from "../../utils/apiCalls";

const AttendedEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await me();
                if (userData && userData.id) {
                    const eventsData = await getAllEventsAfterAttendance(userData.id);
                    const processedEvents = await Promise.all(
                        eventsData.map(async (event: { eventType: any[]; eventPicture: string; id: number; }) => {
                            if (event.eventType && Array.isArray(event.eventType)) {
                                const eventTypeString = event.eventType[0];
                                event.eventType = eventTypeString.split(", ");
                            }
                            event.eventPicture = await fetchEventPicture(event.id!);
                            return event;
                        })
                    );
                    
                    setEvents(processedEvents);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
    };

    const handleClosePopup = () => {
        setSelectedEvent(null);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Sidebar />
            <div className="mt-[6rem] mx-2 ml-[2rem]">
                <p className="text-2xl mb-2 font-semibold tablet:text-3xl">Attended Events</p>
                <div className="mb-5">
                    <div className="relative mb-5 z-0">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            className="block w-full p-2 ps-10 border rounded-md"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <StudentEventsFilteredList
                        events={events}
                        searchTerm={searchTerm}
                        onEventClick={handleEventClick}
                        eventType="attended"
                    />
                </div>
            </div>
            {selectedEvent && <StudentEventDetailModal event={selectedEvent} onClose={handleClosePopup} eventType="attended" />}
        </div>
    );
};

export default AttendedEvents;
