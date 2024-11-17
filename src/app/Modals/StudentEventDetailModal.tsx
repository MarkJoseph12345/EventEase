import React, { useEffect, useState } from 'react';
import type { EventDetailModal, User } from '@/utils/interfaces';
import { formatDate } from '@/utils/data';
import { dislikeEvent, getAllUsersJoinedToEvent, getEventById, getEventsJoinedByUser, joinEvent, likeEvent, me, unjoinEvent } from '@/utils/apiCalls';
import PopUps from './PopUps';

const POLL_INTERVAL = 10000;

interface StudentEventDetailModalProps extends EventDetailModal {
    eventType?: string;
}

const StudentEventDetailModal: React.FC<StudentEventDetailModalProps> = ({
    event,
    onClose,
    onJoinUnjoin,
    eventType = "join"
}) => {
    const [isJoined, setIsJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [usersJoinedToEvent, setUsersJoinedToEvent] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [genderMismatch, setGenderMismatch] = useState(false);
    const [eventEnded, setEventEnded] = useState(false);
    const currentTime = new Date();
    const [activeButton, setActiveButton] = useState<'like' | 'dislike' | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>();

    const hasLongDescription = (description: string) => {
        return description.split(' ').length > 30;
    };

    const truncateDescription = (description: string) => {
        const words = description.split(' ');
        return words.slice(0, 30).join(' ')
    };

    const type = event.eventType.toString().split(', ');
    const availableSlots = event.eventLimit! - usersJoinedToEvent.length;
    const isJoinDisabled = genderMismatch || (!isJoined && availableSlots <= 0) || eventEnded;
    const showFullDescription = isExpanded || !hasLongDescription(event.eventDescription);



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
                if(new Date(event.eventEnds!).getTime() < currentTime.getTime()) {
                    setEventEnded(true)
                }else {
                    setEventEnded(false)
                }
            } catch (error) {

            }
        };

        fetchUser();
    }, [event]);

    useEffect(() => {
        const checkUserStatus = async () => {
            const currentEvent = await getEventById(event!.id!)
            if (!user || !currentEvent) return;

            const userHasLiked = currentEvent.usersLiked?.includes(user.username!) ?? false;
            const userHasDisliked = currentEvent.usersDisliked?.includes(user.username!) ?? false;

            if (userHasLiked) {
                setActiveButton('like');
            } else if (userHasDisliked) {
                setActiveButton('dislike');
            } else {
                setActiveButton(null);
            }
        };

        checkUserStatus();
    }, [event, user]);


    useEffect(() => {
        if (!user?.id || !event?.id) {
            return;
        }

        const checkIfJoined = async () => {
            try {
                const joinedEvents = await getEventsJoinedByUser(user.id!);
                const hasJoined = joinedEvents.some(joinedEvent => joinedEvent.id === event.id);
                setIsJoined(hasJoined);
            } finally {
                setIsLoading(false);
            }
        };


        const fetchUsersJoinedToEvent = async () => {
            try {
                const usersArrays = await getAllUsersJoinedToEvent(event.id!);
                const allUsers = usersArrays.flat();
                setUsersJoinedToEvent(allUsers);
            } catch (error) {

            }
        };

        const fetchData = async () => {
            await Promise.all([checkIfJoined(), fetchUsersJoinedToEvent()]);
        };

        fetchData();
        // const interval = setInterval(() => {
        //     fetchData();
        // }, POLL_INTERVAL);

        // return () => clearInterval(interval);
    }, [event?.id, user?.id]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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
                    setMessage({ text: "Successfully unjoined event", type: "success" });
                }
            } else {
                const success = await joinEvent(user!.id!, event.id!);
                if (success) {
                    setUsersJoinedToEvent(prev => [...prev, user!]);
                    setIsJoined(true);
                    if (onJoinUnjoin) {
                        onJoinUnjoin(event.id!);
                    }
                    setMessage({ text: "Successfully joined event", type: "success" });
                }
            }
        } catch (error) {

        }
    };

    const handleLike = async () => {
        setActiveButton('like');
        const res = await likeEvent(event.id!, user!.id!)
    };

    const handleDislike = async () => {
        setActiveButton('dislike');
        const res = await dislikeEvent(event.id!, user!.id!)
    };
    return (
        <div className={`fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative text-pretty tablet:max-w-[50rem]">
                <p className="sticky top-0 z-10  text-end text-gray-500 font-bold text-2xl cursor-pointer tablet:mr-4 tablet:mt-2" onClick={() => { setIsLoading(true); setTimeout(onClose, 300); }}>✖</p>
                <div className="flex flex-col overflow-auto tablet:mx-20">
                    <div className="flex flex-col w-full ">
                        <div
                            className=" relative overflow-hidden text-white rounded-sm mx-auto">
                            <img src={event.eventPicture} alt={event.eventName} className="max-w-full h-96 object-contain" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold my-2 text-center">{event.eventName}</h2>
                    <div className="flex overflow-hidden bg-gray-100 rounded-xl p-4">
                        <div className=" w-full">
                            <div className="grid tablet:grid-cols-2 gap-2 mb-2 ">
                                <p className=""><strong>Event Type:</strong> {type[0]}</p>
                                <p className=""><strong>Created By:</strong> {event.createdBy}</p>
                                <p className=""><strong>Gender:</strong> {event.allowedGender}</p>
                                <p className=""><strong>Slots left:</strong> {availableSlots}</p>
                                <p className=""><strong>Start Date:</strong> {formatDate(event.eventStarts)}</p>
                                <p className=""><strong>End Date:</strong> {formatDate(event.eventEnds)}</p>
                                <p className="tablet:col-span-2"><strong>Department(s):</strong> {event.department.join(', ')}</p>
                            </div>
                            <p className="tablet:col-span-4 text-pretty">
                                <strong>Description: </strong>{showFullDescription ? event.eventDescription : truncateDescription(event.eventDescription)} {hasLongDescription(event.eventDescription) && (
                                    <>{isExpanded ? <span></span> : <span className='font-bold'>... </span>}
                                        < button
                                            className="font-bold underline"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                        >
                                            {isExpanded ? 'See less' : 'See more'}
                                        </button>
                                    </>
                                )}
                            </p>



                        </div>
                        {/* <div className="flex flex-col items-center w-full">
                        <div
                            className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-sm bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40 h-44 w-72">
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
                        </div> */}
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    {eventType === "attended" ? (
                        <div className="flex gap-4 my-4">
                            <div className="group">
                                <button
                                    onClick={handleLike}
                                    className="font-poppins font-bold px-4 py-2 rounded-md bg-green-500 text-white flex items-center transition-colors group-hover:bg-green-600"
                                >
                                    <svg
                                        className="w-6 h-6 transition-transform duration-300 transform group-hover:scale-110"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill={activeButton === 'like' ? '#FDCC01' : ''}
                                        stroke={activeButton === 'like' ? '#FDCC01' : ''}
                                    >
                                        <path d="M11 0h1v3l3 7v8a2 2 0 0 1-2 2H5c-1.1 0-2.31-.84-2.7-1.88L0 12v-2a2 2 0 0 1 2-2h7V2a2 2 0 0 1 2-2zm6 10h3v10h-3V10z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="group">
                                <button
                                    onClick={handleDislike}
                                    className="font-poppins font-bold px-4 py-2 rounded-md bg-red-500 text-white flex items-center transition-colors group-hover:bg-red-600"
                                >
                                    <svg
                                        className="w-6 h-6 transition-transform duration-300 transform group-hover:scale-110"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill={activeButton === 'dislike' ? '#FDCC01' : ''}
                                        stroke={activeButton === 'dislike' ? '#FDCC01' : ''}
                                    >
                                        <path d="M11 20a2 2 0 0 1-2-2v-6H2a2 2 0 0 1-2-2V8l2.3-6.12A3.11 3.11 0 0 1 5 0h8a2 2 0 0 1 2 2v8l-3 7v3h-1zm6-10V0h3v10h-3z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleJoinUnjoin}
                            className={`font-poppins font-bold px-4 py-2 rounded-md self-end my-4 mr-8 ${isJoinDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-customYellow'}`}
                            disabled={isJoinDisabled}
                        >
                            {isJoined ? 'Unjoin' : 'Join'}
                        </button>
                    )}
                </div>
            </div>

            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div >
    );
};

export default StudentEventDetailModal;
