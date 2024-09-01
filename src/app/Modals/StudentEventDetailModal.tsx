import React, { useEffect, useState } from 'react';
import type { EventDetailModal, User } from '@/utils/interfaces';
import { formatDate } from '@/utils/data';
import { getAllUsersJoinedToEvent, getEventsJoinedByUser, joinEvent, me, unjoinEvent } from '@/utils/apiCalls';

const POLL_INTERVAL = 10000;

const StudentEventDetailModal: React.FC<EventDetailModal> = ({ event, onClose, onJoinUnjoin }: EventDetailModal) => {
    const [isJoined, setIsJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [usersJoinedToEvent, setUsersJoinedToEvent] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [genderMismatch, setGenderMismatch] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await me();
                setUser(userData);
                if (event.allowedGender && userData.gender && event.allowedGender !== 'ALL' && userData.gender !== event.allowedGender) {
                    setGenderMismatch(true);
                } else {
                    setGenderMismatch(false);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [event]);

    useEffect(() => {
        if (!user?.id || !event?.id) {
            setIsLoading(false);
            return;
        }

        const checkIfJoined = async () => {
            try {
                const joinedEvents = await getEventsJoinedByUser(user.id!);
                const hasJoined = joinedEvents.some(joinedEvent => joinedEvent.id === event.id);
                setIsJoined(hasJoined);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to check if user joined event:", error);
                setIsLoading(false);
            }
        };

        const fetchUsersJoinedToEvent = async () => {
            try {
                const usersArrays = await getAllUsersJoinedToEvent(event.id!);
                const allUsers = usersArrays.flat();
                setUsersJoinedToEvent(allUsers);
            } catch (error) {
                console.error("Error fetching users joined to event:", error);
            }
        };

        const fetchData = async () => {
            await Promise.all([checkIfJoined(), fetchUsersJoinedToEvent()]);
        };

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [event?.id, user?.id]);

    const handleJoinUnjoin = async () => {
        try {
            if (isJoined) {
                setUsersJoinedToEvent(prev => prev.filter(u => u.id !== user!.id));
                const success = await unjoinEvent(user!.id!, event.id!);
                if (success) {
                    setIsJoined(false);
                    if (onJoinUnjoin) {
                        onJoinUnjoin(event.id!);
                    }
                }
            } else {
                const success = await joinEvent(user!.id!, event.id!);
                if (success) {
                    setUsersJoinedToEvent(prev => [...prev, user!]);
                    setIsJoined(true);
                    if (onJoinUnjoin) {
                        onJoinUnjoin(event.id!);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to join/unjoin event:", error);
        }
    };

    const type = event.eventType.toString().split(', ');
    const availableSlots = event.eventLimit! - usersJoinedToEvent.length;
    const isJoinDisabled = genderMismatch || (!isJoined && availableSlots <= 0);

    if (isLoading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative text-pretty tablet:max-w-[50rem]">
                <p className="sticky top-0 text-end text-gray-500 font-bold text-2xl cursor-pointer mr-4 mt-2" onClick={onClose}>✖</p>
                <div className="flex flex-col overflow-auto mx-20">
                    <div className="flex flex-col items-center w-full">
                        <div
                            className=" relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-sm bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40 h-44 w-72">
                            <img src={event.eventPicture} alt={event.eventName} className="h-full w-full" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold my-2 text-center">{event.eventName}</h2>
                    <div className="flex overflow-hidden">
                        <div className="grid grid-cols-6 gap-5">
                            <p className="col-span-2"><strong>Event Description:</strong></p>
                            <p className="col-span-4 text-pretty">{event.eventDescription}</p>
                            <p className="col-span-2"><strong>Event Type:</strong></p>
                            <p className="col-span-4">{type[0]}</p>
                            <p className="col-span-2"><strong>Department(s):</strong></p>
                            <p className="col-span-4">{event.department.join(', ')}</p>
                            <p className="col-span-2"><strong>Gender:</strong></p>
                            <p className="col-span-4">{event.allowedGender}</p>
                            <p className="col-span-2"><strong>Slots left:</strong></p>
                            <p className="col-span-4">{availableSlots}</p>
                            <p className="col-span-2"><strong>Start Date:</strong></p>
                            <p className="col-span-4">{formatDate(event.eventStarts)}</p>
                            <p className="col-span-2"><strong>End Date:</strong></p>
                            <p className="col-span-4">{formatDate(event.eventEnds)}</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <button
                        onClick={handleJoinUnjoin}
                        className={`font-poppins font-bold px-4 py-2 rounded-md self-end my-4 mr-8 ${isJoinDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-customYellow'}`}
                        disabled={isJoinDisabled}
                    >
                        {isJoined ? 'Unjoin' : 'Join'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentEventDetailModal;