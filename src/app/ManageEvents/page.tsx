"use client";
import { useEffect, useRef, useState } from "react";
import { Event } from "../../utils/interfaces";
import AdminEventDetailModal from "../Modals/AdminEventDetailModal";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { fetchEventPicture, getEvents } from "@/utils/apiCalls";
import { formatDate } from "@/utils/data";

const ManageEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<{ types: string[], departments: string[], classification: string[] }>({ types: [], departments: [], classification: [] });
    const [showFilters, setShowFilters] = useState<boolean>(false);


    const types = Array.from(new Set(events.flatMap(event => event.eventType || []).map(type => type.split(", ")[0])));
    const classifications = Array.from(new Set(events.flatMap(event => event.eventType || []).map(type => type.split(", ")[1])));
    const departments = Array.from(new Set(events.flatMap(event => event.department)));

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };


    const handleFilterChange = (filterCategory: 'types' | 'departments' | 'classification', filterValue: string) => {
        const updatedFilters = selectedFilters[filterCategory].includes(filterValue)
            ? selectedFilters[filterCategory].filter(filter => filter !== filterValue)
            : [...selectedFilters[filterCategory], filterValue];
        setSelectedFilters({ ...selectedFilters, [filterCategory]: updatedFilters });
    };
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const fetchedEvents = await getEvents();

                if (Array.isArray(fetchedEvents) && fetchedEvents.length === 0) {
                    setError(true);
                } else {
                    setError(false);

                    const processedEvents = await Promise.all(fetchedEvents.map(async (event) => {
                        if (event.eventType && Array.isArray(event.eventType)) {
                            const eventTypeString = event.eventType[0];
                            event.eventType = eventTypeString.split(", ");
                        }
                        event.eventPicture = await fetchEventPicture(event.id!);
                        return event;
                    }));

                    setEvents(processedEvents);
                }
            } catch (error) {
                console.error('Error loading events:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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
        const matchesClassification = selectedFilters.classification.length === 0 || selectedFilters.classification.includes(type[1]);
        const matchesDepartment = selectedFilters.departments.length === 0 || selectedFilters.departments.some(department => event.department.includes(department));

        return matchesSearch && matchesType && matchesClassification && matchesDepartment;
    });

    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Sidebar />
            <div className="mt-[6rem] mx-2 mb-5 ml-[2rem]">
                <p className="text-xl font-semibold font-bevietnam mb-2 tablet:text-3xl">Manage Events</p>
                <div>
                    <div className="flex items-center mb-5">
                        <div className="relative mr-3">
                            <div onClick={toggleFilters} className="cursor-pointer">
                                <img src="/filter.png" className="h-6 w-6" />
                            </div>
                            {showFilters && (
                                <div ref={dropdownRef} className="absolute top-10 left-0 bg-white border border-gray-200 shadow-md rounded-md p-2">
                                    <div className="flex items-center justify-between mb-2 flex-col">
                                        <button className="text-sm text-customYellow" onClick={() => setSelectedFilters({ types: [], departments: [], classification: [] })}>Clear Filters</button>
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
                                    <div className="mb-2">
                                        <p className="font-semibold">Classification</p>
                                        {classifications.map((classification, index) => (
                                            <div key={index} className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={selectedFilters.classification.includes(classification)} onChange={() => handleFilterChange('classification', classification)} className="mr-2 cursor-pointer accent-customYellow" />
                                                    {classification}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Departments</p>
                                        {departments.map((department, index) => (
                                            <div key={index} className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={selectedFilters.departments.includes(department)} onChange={() => handleFilterChange('departments', department)} className="mr-2 cursor-pointer accent-customYellow" />
                                                    {department}</label>
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
                    <div className="tablet:flex tablet:justify-center tablet:gap-5 tablet:flex-wrap">
                        {error ? (
                            <div className="flex flex-col items-center gap pt-2">
                                <img src="no-event-image.png" alt="No events today" className="mb-4 w-32 h-32" />
                                <p className="font-poppins text-center text-gray-700 mx-4">Oops! Looks like there are no events found.</p>
                            </div>
                        ) : (
                            filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <div key={event.id} className="flex items-center border border-gray-200 rounded-md p-4 mt-2 tablet:flex-col tablet:text-center" onClick={() => handleEventClick(event)}>
                                        <img src={event.eventPicture} alt={event.eventName} className="w-16 h-16 object-cover rounded-md mr-4 tablet:mr-0 tablet:w-72 tablet:h-56 tablet:object-fill" />
                                        <div>
                                            <p className="font-semibold">{event.eventName}</p>
                                            <p className="text-gray-600">{formatDate(event.eventStarts)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <img src="no-event-image.png" className="mb-4 w-44 h-44" />
                                    <p className="text-center">No event found. Please adjust your filters or try a different search term.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            {selectedEvent && <AdminEventDetailModal event={selectedEvent} onClose={handleClosePopup} />}
        </div>
    );
};

export default ManageEvents;
