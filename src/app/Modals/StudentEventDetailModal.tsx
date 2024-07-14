import React, { useEffect, useState } from 'react';
import type { EventDetailModal } from '@/utils/interfaces';
import { formatDate, userid } from '@/utils/data';
import { getEventsJoinedByUser, joinEvent, unjoinEvent } from '@/utils/apiCalls';

const StudentEventDetailModal: React.FC<EventDetailModal> = ({ event, onClose, onJoinUnjoin }: EventDetailModal) => {
    const [isJoined, setIsJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkIfJoined = async () => {
            try {
                const joinedEvents = await getEventsJoinedByUser(userid);
                const hasJoined = joinedEvents.some(joinedEvent => joinedEvent.id === event.id);
                setIsJoined(hasJoined);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to check if user joined event:", error);
                setIsLoading(false);
            }
        };
        checkIfJoined();
    }, [event.id, userid]);

    const handleJoinUnjoin = async () => {
        try {
            if (isJoined) {
                const success = await unjoinEvent(userid, event.id!);
                if (success) {
                    setIsJoined(false);
                    if (onJoinUnjoin) {
                        onJoinUnjoin(event.id!);
                    }
                }
            } else {
                const success = await joinEvent(userid, event.id!);
                if (success) {
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
                            <p className="col-span-2"><strong>Event Classification:</strong></p>
                            <p className="col-span-4">{type[1]}</p>
                            <p className="col-span-2"><strong>Start Date:</strong></p>
                            <p className="col-span-4">{formatDate(event.eventStarts)}</p>
                            <p className="col-span-2"><strong>End Date:</strong></p>
                            <p className="col-span-4">{formatDate(event.eventEnds)}</p>
                        </div>

                        {/* <div className="flex flex-col gap-2">
                            <p><strong>Event Description:</strong></p>
                            <p><strong>Event Type:</strong></p>
                            <p><strong>Department(s):</strong></p>
                            <p><strong>Event Classification:</strong></p>
                            <p><strong>Start Date:</strong></p>
                            <p><strong>End Date:</strong></p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-pretty '>{event.eventDescription}</p>
                            <p>{type[0]}</p>
                            <p>{event.department.join(', ')}</p>
                            <p>{type[1]}</p>
                            <p>{formatDate(event.eventStarts)}</p>
                            <p>{formatDate(event.eventEnds)}</p>
                        </div> */}
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <button
                        onClick={handleJoinUnjoin}
                        className="bg-customYellow font-poppins font-bold px-4 py-2 rounded-md self-end my-4 mr-8"
                    >
                        {isJoined ? 'Unjoin' : 'Join'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentEventDetailModal;
