'use client'
import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../api';


interface EventCard {
    id: number;
    eventPicture: string;
    imageUrl: string;
    date: string;
    eventName: string;
    location: string;
    eventDescription: string;
    department: string;
    eventType: string;
    eventStarts: string;
    eventEnds: string;
}

const EventPopup = ({ event, onClose }: { event: EventCard; onClose: () => void }) => {
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
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-[4px] z-50">
            <div className="bg-white p-8 rounded-3xl relative flex flex-col items-center">
                <button className="absolute top-0 right-0 px-2 py-1 font-black text-4xl" onClick={onClose}>X</button>
                <div className='relative'>
                    <img className="h-[250px] w-[250px]  object-fill" src={event.eventPicture} />
                    <div className="absolute -mt-5 -ml-5 top-0 left-0 bg-customYellow rounded-full text-sm font-bold w-12 h-12 flex justify-center items-center text-center flex-col">
                        <div>{new Date(event.eventStarts).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                        <div>{new Date(event.eventStarts).getDate()}</div>
                    </div>
                </div>
                <div className="w-[500px] h-[200px] border-4 rounded-3xl border-customYellow p-4">
                    <div className="flex flex-col items-center">
                        <p className="underline font-bold text-2xl">{event.eventName}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Event Details: <span className="font-normal">{event.eventDescription}</span></p>
                        <p className="font-bold">Event Type: <span className="font-normal">{event.eventType}</span></p>
                        <p className="font-bold">Department: <span className="font-normal">{event.department}</span></p>
                        <p className="ml-10 mt-2 flex items-center gap-2"><img src="calendar.png" className='w-4 h-4' /> : {new Date(event.eventStarts).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="ml-10 mt-2 flex items-center gap-2"><img src="time.png" className='w-4 h-4' /> : {formattedStartTime} - {formattedEndTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomePageCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
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

                                return {
                                    ...event,
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
                    const sortedEvents = cardsWithPictures.sort((a: { eventEnds: string | number | Date; }, b: { eventEnds: string | number | Date; }) => new Date(b.eventEnds).getTime() - new Date(a.eventEnds).getTime());
                    setHomePageCards(sortedEvents);
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
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 1024;
            if (newIsMobile !== isMobile) {
                setIsMobile(newIsMobile);
                setCurrentIndex(0);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobile]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % homePageCards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + homePageCards.length) % homePageCards.length);
    };

    const handleCircleClick = (circleIndex: SetStateAction<number>) => {
        setCurrentIndex(circleIndex);
    };

    const numVisibleCards = isMobile ? 1 : 4;
    const numCircles = Math.max(homePageCards.length - numVisibleCards + 1, 1);

    const [popupEvent, setPopupEvent] = useState<EventCard | null>(null);

    const openPopup = (event: EventCard) => {
        setPopupEvent(event);
    };

    const closePopup = () => {
        setPopupEvent(null);
    };

    return (
        <div className="relative">
            <div className={`flex lg:${homePageCards.length <= 3 ? 'justify-center gap-5' : 'justify-between'} justify-center max-w-[90%] mx-auto`}>
                {homePageCards.slice(currentIndex, currentIndex + numVisibleCards).map((card) => (
                    <div key={card.id} className="border p-8 rounded-lg flex flex-col items-center shadow-xl">
                        <img src={card.eventPicture} alt={`Image ${card.id}`} className="w-[250px] h-[200px] cursor-pointer" onClick={() => openPopup(card)} />
                    </div>
                ))}
            </div>
            <button className={`text-5xl absolute left-0 top-0 bottom-0 m-auto w-10 h-10 text-black rounded-full flex justify-center items-center ${currentIndex === 0 ? 'hidden' : ''}`} onClick={handlePrev}>
                &lt;
            </button>
            <button className={`text-5xl absolute right-0 top-0 bottom-0 m-auto w-10 h-10 text-black rounded-full flex justify-center items-center ${currentIndex + numVisibleCards >= homePageCards.length ? 'hidden' : ''}`} onClick={handleNext}>
                &gt;
            </button>
            <div className="flex justify-center mt-4">
                {[...Array(numCircles)].map((_, index) => (
                    <button key={index} onClick={() => handleCircleClick(index)} className={`w-5 h-5 mx-1 rounded-full border-black border ${index === currentIndex ? 'bg-customYellow' : ''}`}></button>
                ))}
            </div>
            {popupEvent && <EventPopup event={popupEvent} onClose={closePopup} />}
        </div>
    );
};

export default HomePageCard;
