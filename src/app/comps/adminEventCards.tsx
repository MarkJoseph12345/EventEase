'use client'

interface EventCard {
    id: number;
    imageUrl: string;
    date: string;
    eventName: string;
    location: string;
    eventStartsDate: string;
    eventStartsHour: string;
    eventPicture: string;
    eventDescription: string;
    department: string;
    eventType: string;
    eventStarts: string;
    eventEnds: string;
}


import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../api';
import UpdateEventModal from './updateEvent';

const EventPopup = ({ event, onClose }: { event: EventCard; onClose: () => void }) => {
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const starthours = new Date(event.eventStarts).getHours();
    const startminutes = new Date(event.eventStarts).getMinutes();

    let formattedStartHours: number | string = starthours % 12 || 12;
    const startamPm = starthours >= 12 ? 'PM' : 'AM';
    formattedStartHours = formattedStartHours < 10 ? '0' + formattedStartHours : formattedStartHours;

    const formattedStartTime = `${formattedStartHours}:${startminutes < 10 ? '0' + startminutes : startminutes} ${startamPm}`;

    const endhours = new Date(event.eventEnds).getHours();
    const endminutes = new Date(event.eventEnds).getMinutes();

    let formattedEndHours: number | string = endhours % 12 || 12;
    const endamPm = endhours >= 12 ? 'PM' : 'AM';
    formattedEndHours = formattedEndHours < 10 ? '0' + formattedEndHours : formattedEndHours;

    const formattedEndTime = `${formattedEndHours}:${endminutes < 10 ? '0' + endminutes : endminutes} ${endamPm}`;

    return (
        <div className="fixed top-0 left-0 w-full  h-full flex flex-col justify-center items-center backdrop-blur-[4px] z-50">
            <div className="bg-white flex flex-col border border-gray-200 justify-center items-center  p-8 rounded-3xl relative gap-3">
                <button className="absolute top-[1px] right-2 px-2 py-1 font-bold text-2xl" onClick={onClose}>X</button>
                <div className=" relative flex flex-col items-center">
                    <div className='relative mt-3'>
                        <img className="h-[250px] w-[250px]  object-fill" src={event.eventPicture} />
                        <div className="absolute -mt-5 -ml-5 top-0 left-0 bg-customYellow rounded-full text-sm font-bold w-12 h-12 flex justify-center items-center text-center flex-col">
                            <div >{new Date(event.eventStarts).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                            <div className='text-[12px]'>{new Date(event.eventStarts).getDate()}</div>
                        </div>
                    </div>
                    <div className="w-[500px] h-[200px] border-2 rounded-3xl border-customYellow p-4 mt-[1rem]">
                        <div className="flex flex-col items-center">
                            <p className="underline font-bold text-2xl">{event.eventName}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold">Event Details: <span className="font-normal">{event.eventDescription}</span></p>
                            <p className="font-bold">Event Type: <span className="font-normal">{event.eventType}</span></p>
                            <p className="font-bold">Department: <span className="font-normal">{event.department}</span></p>
                            <p className="mt-.7 flex items-center gap-2"><span className='font-bold'>Time:</span> {new Date(event.eventStarts).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="mt-.7 flex items-center gap-2"><span className='font-bold'>Date:</span> {formattedStartTime} - {formattedEndTime}</p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end w-full mt-2'>
                    <button className='font-bold rounded px-3 py-1 bg-customYellow' onClick={handleModalOpen}>Manage Details</button>
                    <UpdateEventModal visible={isModalOpen} onClose={handleModalClose} id={event.id}/>
                </div>
            </div>
        </div>
    );
};

const AdminEventCards = () => {

    const [popupEvent, setPopupEvent] = useState<EventCard | null>(null);

    const openPopup = (event: EventCard) => {
        setPopupEvent(event);
    };

    const closePopup = () => {
        setPopupEvent(null);
    };


    const [adminPageCards, setAdminPageCards] = useState<EventCard[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_ALL_EVENTS);
                if (response.status >= 200 && response.status < 300) {
                    const data = response.data;
                    const today = new Date();
                    const todayDateString = today.toISOString().split('T')[0];

                    const cardsWithPictures = await Promise.all(data.map(async (event: any) => {
                        try {
                            const imgResponse = await axios.get(`${API_ENDPOINTS.GET_EVENT_PICTURE}${event.id}`, {
                                responseType: 'arraybuffer'
                            });
                            if (imgResponse.status >= 200 && imgResponse.status < 300) {
                                const base64Image = Buffer.from(imgResponse.data, 'binary').toString('base64');
                                const eventStartsDate = new Date(event.eventStarts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                                const eventStartsHour = new Date(event.eventStarts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                                return {
                                    ...event,
                                    eventStartsDate,
                                    eventStartsHour,
                                    eventPicture: `data:image/png;base64,${base64Image}`
                                };
                            } else {
                                return event;
                            }
                        } catch (error) {
                            console.error(`Error fetching image for event with ID ${event.id}:`, error);
                            return event;
                        }
                    }));
                    const todayEvents = cardsWithPictures.filter((event: any) => {
                        const eventDate = new Date(event.eventStarts).toISOString().split('T')[0];
                        return eventDate === todayDateString;
                    });

                    setAdminPageCards(todayEvents);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);



    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-4 max-w-[90%] mx-auto">
                {adminPageCards.map((card, index) => (
                    <div key={index} className="border p-8 rounded-lg flex flex-col items-start gap-4 shadow-xl relative">
                        <div className='self-center relative'>
                            <img className="self-center  h-[10.938rem] w-[15.625rem] object-fill" src={card.eventPicture} />
                            <div className="absolute -mt-5 -ml-5 top-0 left-0 bg-customYellow rounded-full text-base w-16 h-16 font-bold flex justify-center items-center text-center flex-col">
                                <div>{new Date(card.eventStartsDate).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                                <div>{new Date(card.eventStartsDate).getDate()}</div>
                            </div>

                        </div>
                        <div className='flex flex-col'>
                            <p>Event Name: {card.eventName}</p>
                            <div className="flex items-center">
                                <p className="-ml-1.6">Time: {card.eventStartsHour}</p>
                            </div>
                        </div>
                        <div className='self-end'>
                            <button className='font-bold rounded px-3 py-1 bg-customYellow' onClick={() => openPopup(card)}>View</button>
                        </div>
                    </div>
                ))}
            </div>
            {popupEvent && <EventPopup event={popupEvent} onClose={closePopup} />}
        </div>
    );
};



export default AdminEventCards;