'use client'

interface EventCard {
    imageUrl: string;
    date: string;
    eventName: string;
    location: string;
    eventStartsDate: string;
    eventStartsHour: string;
    eventPicture: string;
}

import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../api';

const AdminEventCards = () => {
    const [homePageCards, setHomePageCards] = useState<EventCard[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_ALL_EVENTS);
                if (response.status >= 200 && response.status < 300) {
                    const data = response.data;
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
                    setHomePageCards(cardsWithPictures);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        console.log("Cards", homePageCards);
    }, [homePageCards]);

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-4 max-w-[90%] mx-auto">
                {homePageCards.map((card, index) => (
                    <div key={index} className="border p-8 rounded-lg flex flex-col items-start gap-4 shadow-xl relative">
                        <div className='self-center relative'>
                            <img className="self-center min-h-[250px] min-w-[250px] object-fill" src={card.eventPicture} />
                            <div className="absolute -mt-5 -ml-5 top-0 left-0 bg-customYellow rounded-full text-2xl w-20 h-20 font-bold flex justify-center items-center text-center flex-col">
                            <div>{new Date(card.eventStartsDate).toLocaleString('default', { month: 'short' })}</div>
                            <div>{new Date(card.eventStartsDate).getDate()}</div>
                            </div>

                        </div>Z
                        <div className='flex flex-col'>
                            <p>Event Name: {card.eventName}</p>
                            <div className="flex items-center">
                                <img src="location.png" className="h-4 w-4" alt="Location Icon" />
                                <p className="ml-2">Location: {card.location}</p>
                            </div>
                            <div className="flex items-center">
                                <img src="time.png" className="h-4 w-4" alt="Time Icon" />
                                <p className="ml-2">Time: {card.eventStartsHour}</p>
                            </div>
                        </div>
                        <div className='self-end'>
                            <button className='font-bold rounded px-3 py-1 bg-customYellow'>View</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEventCards;