"use client";
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { getAllUsersAfterAttendance, getAllUsersJoinedToEvent, getEvents, getEventPopularity, getJoinRate, getEventTypeDistribution, getEventSchedulingTrends, getAverageEventDuration, getDepartmentEngagement } from '@/utils/apiCalls';
import { Event } from '@/utils/interfaces';
import ViewJoined from '../Modals/ViewJoined';
import EventTypeDistributionChart from '../Charts/EventTypeDistribution';
import EventSchedulingTrends from '../Charts/EventScheduleTrends';
import DepartmentEngagement from '../Charts/DepartmentEngagement';

const ReportsAndAnalysis: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState<any[]>([]);
    const [filteredEventData, setFilteredEventData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventTypeDistribution, setEventTypeDistribution] = useState<any>();
    const [eventSchedulingTrends, setEventSchedulingTrends] = useState<any>();
    const [averageEventDuration, setAverageEventDuration] = useState<any>();
    const [departmentEngagement, setDepartmentEngagement] = useState<any>();
    const [isWrapped, setIsWrapped] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const initialYRef = useRef<number | null>(null);
    const reportsDivRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const checkWrapping = () => {
            const container = containerRef.current;
            const reportsDiv = reportsDivRef.current;

            if (!container || !reportsDiv) return;

            const firstChild = container as HTMLElement;
            const secondChild = reportsDiv as HTMLElement;

            if (firstChild && secondChild) {
                const currentY = firstChild.offsetTop;
                const reportY = secondChild.offsetTop;

                if (initialYRef.current === null) {
                    initialYRef.current = currentY;
                }

                const isWrapped = currentY > initialYRef.current || reportY !== currentY;
                setIsWrapped(isWrapped);
            }
        };

        checkWrapping();

        window.addEventListener('resize', checkWrapping);
        return () => {
            window.removeEventListener('resize', checkWrapping);
        };
    }, [containerRef, initialYRef, loading]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedEvents = await getEvents();

                const eventsWithUserCounts = await Promise.all(fetchedEvents.map(async (event) => {
                    const eventId = event.id;

                    const usersData = await getAllUsersJoinedToEvent(eventId!);
                    const attendedUsers = await getAllUsersAfterAttendance(eventId!);
                    const eventPopularity = await getEventPopularity(eventId!);
                    const joinRate = await getJoinRate(eventId!);
                    const registeredCount = usersData.length;
                    const attendedCount = attendedUsers.length;

                    return {
                        ...event,
                        registeredCount,
                        attendedCount,
                        eventPopularity,
                        joinRate,
                    };
                }));
                setEventData(eventsWithUserCounts);
                setFilteredEventData(eventsWithUserCounts);
                setEventTypeDistribution(await getEventTypeDistribution())
                //setEventSchedulingTrends(await getEventSchedulingTrends())
                setAverageEventDuration(await getAverageEventDuration())
                setDepartmentEngagement(await getDepartmentEngagement())

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewParticipants = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = eventData.filter(event =>
            event.eventName.toLowerCase().includes(query)
        );
        setFilteredEventData(filtered);
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        const hoursDisplay = hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : '';
        const minutesDisplay = minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : '';

        return {
            hoursDisplay,
            minutesDisplay: minutesDisplay || '0 mins'
        };
    };

    const { hoursDisplay, minutesDisplay } = formatDuration(averageEventDuration);
    const [hoursNumber, hoursLabel] = hoursDisplay.split(' ');
    const [minutesNumber, minutesLabel] = minutesDisplay.split(' ');

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Sidebar />
            <div className="flex flex-col tablet:flex-row tablet:mx-[2rem]  justify-stretch flex-wrap gap-4">
                <div className="tablet:flex-1 w-full" ref={reportsDivRef}>
                    <h2 className="mt-5 text-center text-2xl font-semibold font-poppins">Reports and Analysis</h2>
                    <div className="mt-5 w-11/12 mx-auto tablet:w-full flex flex-col items-center">
                        <div className="bg-white tablet:p-2 rounded-md shadow-md w-full max-h-[95%] relative ">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by event name..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="block w-full p-2 ps-10 border rounded-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customYellow transition-all duration-300 w-full mb-4"
                                />
                            </div>
                            <div className="overflow-x-auto w-full">
                                <div className="relative max-h-[75vh]">
                                    <table className="min-w-full">
                                        <thead className="bg-black sticky top-0 ">
                                            <tr>
                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                ID
                                            </th> */}
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Event Name
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Registered
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Attended
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Likes/Dislikes
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Popularity
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Join Rate
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium text-customYellow uppercase tracking-wider text-center">
                                                    Participants
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredEventData.length > 0 ? (
                                                filteredEventData.map(event => (
                                                    <tr key={event.id}>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {event.id}
                                                    </td> */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {event.eventName}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {event.registeredCount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {event.attendedCount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span className="text-green-500">{event.likes || 0}</span>/
                                                            <span className="text-red-500">{event.dislikes || 0}</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {event.eventPopularity.likesDislikesRatio.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {event.joinRate.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => handleViewParticipants(event)}
                                                                className="bg-customYellow px-4 py-2 rounded"
                                                            >
                                                                View Participants
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                        No events found...
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={containerRef} className={`flex w-full tablet:w-fit flex-wrap items-center tablet:p-2 gap-2 ${isWrapped ? 'flex-row flex-1 justify-evenly' : 'flex-col flex-none'}`}>
                    <EventTypeDistributionChart eventTypeDistribution={eventTypeDistribution} />
                    {/* <EventSchedulingTrends eventSchedulingTrends={eventSchedulingTrends} /> */}
                    <DepartmentEngagement departmentEngagement={departmentEngagement} />
                    <div className="w-full max-w-96 tablet:w-96 h-64 bg-gray-100 flex items-center justify-center flex-col ">
                        <h2 className="px-3 py-3 text-xs font-medium text-customYellow uppercase tracking-wider bg-black w-full">Average Event Duration</h2>
                        <div className="w-full mx-auto flex-1 flex items-center justify-center ">
                            <p className="flex items-baseline">
                                {hoursDisplay && (
                                    <>
                                        <span className="text-red-600 text-5xl font-bold">{hoursNumber}</span>
                                        <span className="text-customYellow text-3xl font-semibold">{hoursLabel}</span>
                                    </>
                                )}
                                <span className="text-red-600 text-5xl font-bold">{minutesNumber}</span>
                                <span className="text-customYellow text-3xl font-semibold">{minutesLabel}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedEvent && (
                <ViewJoined
                    event={selectedEvent}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ReportsAndAnalysis;
