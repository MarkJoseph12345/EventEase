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
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative text-pretty tablet:max-w-[50rem]">
                <div className="flex justify-end">
                    <span className="sticky text-gray-500 font-bold text-2xl cursor-pointer mr-4 mt-2" onClick={onClose}>✖</span>
                </div>
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
                        <button className="bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md my-4" onClick={() => { setClickedFeedback(true) }}>View Feedbacks</button>
                        <button className="bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md my-4 mr-8" onClick={() => { setClickedManage(true) }}>Manage</button>
                    </div>

                </div>

            </div>
            {clickedManage && <ManageEvent event={event} onClose={() => setClickedManage(false)} />}
            {clickedFeedback && <ViewFeedback event={event} onClose={() => setClickedFeedback(false)} />}
            {clickedJoined && <ViewJoined event={event} onClose={() => setClickedJoined(false)} />}
        </div>
    );
};

export default AdminEventDetailModal;