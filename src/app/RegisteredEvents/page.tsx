"use client"
import { useEffect, useRef, useState } from "react";
import { Event, User } from "../../utils/interfaces";
import StudentEventDetailModal from "../Modals/StudentEventDetailModal";
import StudentEventsFilteredList from "../Comps/StudentEvents";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { fetchEventPicture, getEventsJoinedByUser, me, getAllEventsAfterAttendance } from "../../utils/apiCalls";

const RegisteredEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<User | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<{ types: string[], createdBy: string[] }>({ types: [], createdBy: [] });
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const types = Array.from(new Set(joinedEvents.flatMap(event => event.eventType || []).map(type => type.split(", ")[0])));
    const createdBy = Array.from(new Set(joinedEvents.flatMap(event => event.createdBy)));

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await me();
                setUser(userData);
            } catch (error) {

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
                const events = await getEventsJoinedByUser(user.id!);
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
                
                const sortedEvents = processedEvents.sort((a, b) => {
                    const aStartDate = new Date(a.eventStarts!);
                    const bStartDate = new Date(b.eventStarts!);
                    if (isNaN(aStartDate.getTime()) || isNaN(bStartDate.getTime())) {
                        return 0;
                    }
    
                    return aStartDate.getTime() - bStartDate.getTime();
                });
    


                const attendedEvents = await getAllEventsAfterAttendance(user.id!);
                const attendedEventIds = attendedEvents.map((event: Event) => event.id);
                const finalEvents = sortedEvents.filter(event => !attendedEventIds.includes(event.id));

                setJoinedEvents(finalEvents);
                setLoading(false);
            } catch (error) {
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

    const removeUnjoinedEvent = (eventId: number) => {
        setJoinedEvents(joinedEvents.filter(event => event.id !== eventId));
        window.location.reload();
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

            }
        };

        fetchUser();
    }, []);

    const filteredEvents = joinedEvents.filter(event => {
        const type = event.eventType.toString().split(', ')
        const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedFilters.types.length === 0 || selectedFilters.types.includes(type[0]);
        const matchesCreatedBy = selectedFilters.createdBy.length === 0 || selectedFilters.createdBy.includes(event.createdBy!);

        return matchesSearch && matchesType && matchesCreatedBy;
    });


    if (loading) {
        return <Loading />;
    }


    return (
        <div>
            <Sidebar />
            <div className="mt-[6rem] mx-[2rem]">
                <p className="text-2xl mb-2 font-semibold font-bevietnam tablet:text-3xl">Registered Events</p>
                <div className="">
                    <div className="flex items-center">
                        <div className="relative mr-3 z-10">
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
                            <input type="search" className="block w-full p-2 ps-10 border rounded-md" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <StudentEventsFilteredList events={filteredEvents} searchTerm={searchTerm} onEventClick={handleEventClick} eventType="registered" />
                </div>

            </div>
            {selectedEvent && <StudentEventDetailModal event={selectedEvent} onClose={handleClosePopup} onJoinUnjoin={removeUnjoinedEvent} />}
        </div>
    );
}

export default RegisteredEvents;
