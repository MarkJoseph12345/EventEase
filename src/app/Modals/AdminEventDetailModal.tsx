"use client"
import React, { useEffect, useState } from 'react';
import { EventDetailModal, User } from '@/utils/interfaces';
import ManageEvent from './ManageEvent';
import ViewFeedback from './ViewFeedback';
import { formatDate } from '@/utils/data';
import { getAllUsersJoinedToEvent } from '@/utils/apiCalls';
import ViewJoined from './ViewJoined';

const AdminEventDetailModal = ({ event, onClose }: EventDetailModal) => {
    const [clickedManage, setClickedManage] = useState(false);
    const [clickedFeedback, setClickedFeedback] = useState(false);
    const [clickedJoined, setClickedJoined] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const hasLongDescription = (description: string) => {
        return description.split(' ').length > 50;
    };

    const truncateDescription = (description: string) => {
        const words = description.split(' ');
        return words.slice(0, 50).join(' ') + '...';
    };

    const [usersJoinedToEvent, setUsersJoinedToEvent] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsersJoinedToEvent = async () => {
            try {
                const usersArrays = await getAllUsersJoinedToEvent(event.id!);
                const allUsers = usersArrays.flat();
                setUsersJoinedToEvent(allUsers);
            } catch (error) {
                console.error("Error fetching users joined to event:", error);
            }
        };
        fetchUsersJoinedToEvent()
    }, [])

    const availableSlots = event.eventLimit! - usersJoinedToEvent.length;
    const type = event.eventType.toString().split(', ');

    const showFullDescription = isExpanded || !hasLongDescription(event.eventDescription);

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative text-pretty tablet:max-w-[70rem]">
                <div className="flex justify-end">
                    <span className="sticky text-gray-500 font-bold text-2xl cursor-pointer mr-4 mt-2" onClick={onClose}>✖</span>
                </div>
                <div className="flex flex-col overflow-auto mx-20">
                    <div className="flex flex-col w-full ">
                        <div
                            className=" relative overflow-hidden text-white rounded-sm mx-auto">
                            <img src={event.eventPicture} alt={event.eventName} className="max-h-96 max-w-full" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold my-2 text-center">{event.eventName}</h2>
                    <div className="flex overflow-hidden bg-gray-100 rounded-xl p-4">
                        <div className=" w-full">
                        <div className="grid grid-cols-2 gap-2 mb-2 ">
                                <p className=""><strong>Event Type:</strong> {type[0]}</p>
                                <p className=""><strong>Department(s):</strong> {event.department.join(', ')}</p>
                                <p className=""><strong>Gender:</strong> {event.allowedGender}</p>
                                <p className=""><strong>Slots left:</strong> {availableSlots}</p>
                                <p className=""><strong>Start Date:</strong> {formatDate(event.eventStarts)}</p>
                                <p className=""><strong>End Date:</strong> {formatDate(event.eventEnds)}</p>
                            </div>
                            <p className="col-span-4 text-pretty">
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

                        {/* <div className="flex flex-col gap-2">
                            <p><strong>Event Description:</strong></p>  
                            <p><strong>Event Type:</strong></p>
                            <p><strong>Department(s):</strong></p>
                            <p><strong>Event Classification:</strong></p>
                            <p><strong>Start Date:</strong></p>
                            <p><strong>End Date:</strong></p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-pretty truncate overflow-hidden'>{event.eventDescription}</p>
                            <p>{type[0]}</p>
                            <p>{event.department.join(', ')}</p>
                            <p>{type[1]}</p>
                            <p>{formatDate(event.eventStarts)}</p>
                            <p>{formatDate(event.eventEnds)}</p>
                        </div> */}
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <div className=" flex gap-3">
                        <button className="bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md my-4" onClick={() => { setClickedJoined(true) }}>View Participants</button>
                        {/* <button className="bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md my-4" onClick={() => { setClickedFeedback(true) }}>View Feedbacks</button> */}
                        <button className="bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md my-4 mr-8" onClick={() => { setClickedManage(true) }}>Manage</button>
                    </div>

                </div>

            </div>
            {clickedManage && <ManageEvent event={event} onClose={() => setClickedManage(false)} />}
            {/* {clickedFeedback && <ViewFeedback event={event} onClose={() => setClickedFeedback(false)} />} */}
            {clickedJoined && <ViewJoined event={event} onClose={() => setClickedJoined(false)} />}
        </div>
    );
};

export default AdminEventDetailModal;