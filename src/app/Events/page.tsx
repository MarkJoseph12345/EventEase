"use client"

import { useEffect, useState } from "react";
import { EventDetailModal, Event } from "../../utils/interfaces";
import { fetchEventPicture, getEvents } from "@/utils/apiCalls";
import Loading from "../Loader/Loading";
import NavBar from "../Comps/NavBar";
import { formatDate } from "@/utils/data";

const EventDetail = ({ event, onClose }: EventDetailModal) => {
    const type = event.eventType.toString().split(', ');
    const [isExpanded, setIsExpanded] = useState(false);
    

    const hasLongDescription = (description: string) => {
        return description.split(' ').length > 50;
    };

    const truncateDescription = (description: string) => {
        const words = description.split(' ');
        return words.slice(0, 50).join(' ') + '...';
    };
    
    const showFullDescription = isExpanded || !hasLongDescription(event.eventDescription);

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white relative p-4 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative text-pretty tablet:max-w-[50rem]">
                <div className=" sticky top-0 z-10 flex justify-end">
                    <span className="text-gray-500 font-bold text-2xl cursor-pointer mr-4 mt-2" onClick={onClose}>✖</span>
                </div>
                <div className="flex flex-col overflow-auto tablet:mx-20">
                    <div className="flex flex-col items-center w-full">
                        <div
                            className=" relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-sm bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40 h-44 w-72">
                            <img src={event.eventPicture} alt={event.eventName} className="h-full w-full" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold my-2 text-center">{event.eventName}</h2>
                     <div className="flex overflow-hidden bg-gray-100 rounded-xl p-4">
                        <div className=" w-full">
                            <div className="grid tablet:grid-cols-2 gap-4 mb-2 ">
                                <p className=""><strong>Event Type:</strong> {type[0]}</p>
                                <p className=""><strong>Gender:</strong> {event.allowedGender}</p>
                                <p className=""><strong>Slots:</strong> {event.eventLimit}</p>
                                <p className="tablet:col-span-2"><strong>Department(s):</strong> {event.department.join(', ')}</p>
                                <p className=""><strong>Start Date:</strong> {formatDate(event.eventStarts)}</p>
                                <p className=""><strong>End Date:</strong> {formatDate(event.eventEnds)}</p>
                                <p className=""><strong>Created By:</strong> {event.createdBy}</p>
                            </div>
                            <p className="tablet:col-span-4 text-pretty">
                                {showFullDescription ? event.eventDescription : truncateDescription(event.eventDescription)}
                            </p>
                            {hasLongDescription(event.eventDescription) && (
                                <button
                                    className="font-bold"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? 'See less' : 'See more'}
                                </button>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const fetchedEvents = await getEvents();

                if (Array.isArray(fetchedEvents) && fetchedEvents.length === 0) {
                    setError(true);
                } else {
                    setError(false);

                    const processedEvents = await Promise.all(
                        fetchedEvents.map(async (event) => {
                            event.eventPicture = await fetchEventPicture(event.id!);
                            return event;
                        })
                    );

                    const currentTime = new Date();
                    const upcomingEvents = processedEvents.filter(
                        (event) => new Date(event.eventEnds!).getTime() > currentTime.getTime()
                    );

                    const sortedEvents = upcomingEvents.sort((a, b) =>
                        new Date(a.eventStarts!).getTime() - new Date(b.eventStarts!).getTime()
                    );


                    setEvents(sortedEvents);
                }
            } catch (error) {
                console.error("Error loading events:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setModalOpen(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <NavBar />
            <div className="mt-[6rem] mx-2 mb-4 ml-[2rem]">
                {/* <p className="text-xl font-semibold tablet:text-3xl font-bevietnam">Events</p> */}
                {/* <p className="tablet:text-xl text-[10px] font-poppins">Upcoming events near you!</p> */}
                {/* <div className="w-full border-t my-4" /> */}
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
                                onClick={() => handleEventClick(event)}
                                className="flex items-center border border-gray-200 rounded-md p-4 mt-2 tablet:flex-col tablet:text-center"
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
            {modalOpen && selectedEvent && (
                <EventDetail event={selectedEvent} onClose={closeModal} />
            )}
        </div>
    );
};

export default Events;