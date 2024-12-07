"use client"
import React, { useEffect, useState } from 'react';
import { EventDetailModal, User } from '@/utils/interfaces';
import ManageEvent from './ManageEvent';
import { formatDate } from '@/utils/data';
import { getAllUsersJoinedToEvent } from '@/utils/apiCalls';
import ViewJoined from './ViewJoined';
import Comments from './Comments';
const AdminEventDetailModal = ({ event, onClose, from }: EventDetailModal & { from?: string }) => {
    const [clickedManage, setClickedManage] = useState(false);
    const [clickedFeedback, setClickedFeedback] = useState(false);
    const [clickedJoined, setClickedJoined] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const hasLongDescription = (description: string) => {
        return description.split(' ').length > 30;
    };

    const truncateDescription = (description: string) => {
        const words = description.split(' ');
        return words.slice(0, 30).join(' ') + '...';
    };

    const [usersJoinedToEvent, setUsersJoinedToEvent] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsersJoinedToEvent = async () => {
            try {
                const usersArrays = await getAllUsersJoinedToEvent(event.id!);
                const allUsers = usersArrays.flat();
                setUsersJoinedToEvent(allUsers);
            } finally {
                setIsLoading(false)
            }
        };
        fetchUsersJoinedToEvent()
    }, [])

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);


    const availableSlots = event.eventLimit! - usersJoinedToEvent.length;
    const type = event.eventType.toString().split(', ');

    const showFullDescription = isExpanded || !hasLongDescription(event.eventDescription);

    return (
        <div className={`fixed inset-0 z-50 flex justify-center items-center ${!(clickedManage || clickedJoined || clickedFeedback) ? 'bg-black': 'bg-none'} bg-opacity-50 transition-all duration-300 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            {!(clickedManage || clickedJoined || clickedFeedback) && (
                <div className="bg-white relative p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto text-pretty tablet:max-w-[70rem]">
                    <div className=" sticky top-0 z-10 flex justify-end">
                        <span className=" text-gray-500 font-bold text-2xl cursor-pointer tablet:mr-4 tablet:mt-2" onClick={() => { setIsLoading(true); setTimeout(onClose, 300); }}>✖</span>
                    </div>
                    <div className="flex flex-col overflow-auto mx-1 tablet:mx-20">
                        <div className="flex flex-col w-full ">
                            <div
                                className=" relative overflow-hidden text-white rounded-sm mx-auto">
                                <img src={event.eventPicture} alt={event.eventName} className="max-w-full h-96 object-contain" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold my-2 text-center">{event.eventName}</h2>
                        <div className="flex overflow-hidden bg-gray-100 rounded-xl p-4">
                            <div className="w-full">
                                <div className="grid tablet:grid-cols-2 gap-2 mb-2 ">
                                    <p className=""><strong>Event Type:</strong> {type[0]}</p>
                                    <p className=""><strong>Created By:</strong> {event.createdBy}</p>
                                    <p className=""><strong>Gender:</strong> {event.allowedGender}</p>
                                    <p className=""><strong>{from === "analytics" ? "Slots: " : "Slots left: "}</strong>{from === "analytics" ? event.eventLimit : availableSlots}</p>
                                    <p className=""><strong>Start Date:</strong> {formatDate(event.eventStarts)}</p>
                                    <p className=""><strong>End Date:</strong> {formatDate(event.eventEnds)}</p>
                                    <p className="col-span-2"><strong>Department(s):</strong> {event.department.join(', ')}</p>
                                </div>
                                <p className="tablet:col-span-4 text-pretty">
                                    <strong>Description: </strong>{showFullDescription ? event.eventDescription : truncateDescription(event.eventDescription)}
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
                    <div className={`flex w-full justify-end ${from === "analytics" ? "mb-5" : ""}`}>
                        {from !== "analytics" && (
                            <div className=" flex gap-3">
                                {from !== "create" && (
                                    <button
                                        className="bg-customYellow font-poppins font-semibold px-2 tablet:px-4 tablet:py-2 rounded-md tablet:my-4"
                                        onClick={() => { setClickedJoined(true); }}
                                    >
                                        View Participants
                                    </button>
                                )}
                                <button className="bg-customYellow font-poppins font-semibold px-2 tablet:px-4 tablet:py-2 rounded-md tablet:my-4" onClick={() => { setClickedFeedback(true) }}>View Comments</button>
                                <button className="bg-customYellow font-poppins font-semibold px-2 tablet:px-4 tablet:py-2 rounded-md tablet:my-4 tablet:mr-8" onClick={() => { setClickedManage(true) }}>Manage</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {clickedManage && <ManageEvent event={event} onClose={() => setClickedManage(false)} />}
            {clickedFeedback && <Comments event={event} onClose={() => setClickedFeedback(false)} />}
            {clickedJoined && <ViewJoined event={event} onClose={() => setClickedJoined(false)} />}
        </div>
    );
};

export default AdminEventDetailModal;