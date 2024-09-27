"use client"
import { useEffect, useRef, useState } from "react";
import { Event, User } from "../../utils/interfaces";
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
    const [error, setError] = useState<string | null>(null);const [user, setUser] = useState<User | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<{ types: string[], createdBy: string[] }>({ types: [], createdBy: [] });
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const types = Array.from(new Set(events.flatMap(event => event.eventType || []).map(type => type.split(", ")[0])));
    const createdBy = Array.from(new Set(events.flatMap(event => event.createdBy)));

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleFilterChange = (filterCategory: 'types' | 'createdBy', filterValue: string) => {
        const updatedFilters = selectedFilters[filterCategory].includes(filterValue)
            ? selectedFilters[filterCategory].filter(filter => filter !== filterValue)
            : [...selectedFilters[filterCategory], filterValue];
        setSelectedFilters({ ...selectedFilters, [filterCategory]: updatedFilters });
    };

    const dropdownRef = useRef<HTMLDivElement>(null);
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

    const filteredEvents = events.filter(event => {
        const type = event.eventType.toString().split(', ')
        const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedFilters.types.length === 0 || selectedFilters.types.includes(type[0]);
        const matchesCreatedBy = selectedFilters.createdBy.length === 0 || selectedFilters.createdBy.includes(event.createdBy!);

        return matchesSearch && matchesType && matchesCreatedBy;
    });

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Sidebar />
            <div className="mt-[6rem] mx-[2rem]">
                <p className="text-2xl mb-2 font-semibold tablet:text-3xl">Attended Events</p>
                <div className="">
                    <div className="flex items-center mb-5">
                        <div className="relative mr-3">
                            <div onClick={toggleFilters} className="cursor-pointer">
                                <img src="/filter.png" className="h-6 w-6" />
                            </div>
                            {showFilters && (
                                <div ref={dropdownRef} className="absolute top-10 left-0 bg-white border border-gray-200 shadow-md rounded-md p-2">
                                    <div className="flex items-center justify-between mb-2 flex-col">
                                        <button className="text-sm text-customYellow" onClick={() => setSelectedFilters({ types: [], createdBy: [] })}>Clear Filters</button>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-semibold">Type</p>
                                        {types.map((type, index) => (
                                            <div key={index} className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={selectedFilters.types.includes(type)} onChange={() => handleFilterChange('types', type)} className="mr-2 cursor-pointer accent-customYellow" />
                                                    {type}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Creator</p>
                                        {createdBy.map((createdBy, index) => (
                                            <div key={index} className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={selectedFilters.createdBy.includes(createdBy!)} onChange={() => handleFilterChange('createdBy', createdBy!)} className="mr-2 cursor-pointer accent-customYellow" />
                                                    {createdBy}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative w-full">
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
                    </div>
                    <StudentEventsFilteredList
                        events={filteredEvents}
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
