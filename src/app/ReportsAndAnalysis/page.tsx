"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { getAllUsersAfterAttendance, getAllUsersJoinedToEvent, getEvents } from '@/utils/apiCalls';
import { Event } from '@/utils/interfaces';
import ViewJoined from '../Modals/ViewJoined';

const ReportsAndAnalysis: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchUsersAndAttendance = async () => {
            setLoading(true);
            try {
                const fetchedEvents = await getEvents();

                const eventsWithUserCounts = await Promise.all(fetchedEvents.map(async (event) => {
                    const eventId = event.id;

                    const usersData = await getAllUsersJoinedToEvent(eventId!);
                    const attendedUsers = await getAllUsersAfterAttendance(eventId!);

                    const registeredCount = usersData.length;
                    const attendedCount = attendedUsers.length;

                    return {
                        ...event,
                        registeredCount,
                        attendedCount,
                    };
                }));
                setData(eventsWithUserCounts);
                setFilteredData(eventsWithUserCounts);
            } catch (error) {
                console.error('Error fetching users or attendance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndAttendance();
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

        const filtered = data.filter(event =>
            event.eventName.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Sidebar />
            <div className="mt-5 mx-2 flex flex-col items-center">
                <h2 className="text-2xl font-semibold font-bevietnam">Reports and Analysis</h2>
                <div className="mt-5 w-full max-w-[80rem] flex flex-col items-center">
                    <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] relative laptop:max-w-[50rem]">
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

                        <div className="overflow-x-auto">
                            <div className="relative max-h-[80vh]">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0 ">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                Event Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                Registered
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                Attended
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                Likes/Dislikes
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                Participants
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredData.length > 0 ? (
                                            filteredData.map(event => (
                                                <tr key={event.id}>
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
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                    No events match the search criteria.
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
