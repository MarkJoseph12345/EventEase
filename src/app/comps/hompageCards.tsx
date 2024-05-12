'use client'
import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../api';


interface EventCard {
    id: number;
    eventPicture: string;
}
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
    
    const numVisibleCards = isMobile ? 1 : 3;
    const numCircles = Math.max(homePageCards.length - numVisibleCards + 1, 1);

    return (
        <div className="relative">
            <div className="flex justify-center lg:justify-between max-w-[90%] mx-auto">
                {homePageCards.slice(currentIndex, currentIndex + numVisibleCards).map((card) => (
                    <div key={card.id} className="border p-8 rounded-lg flex flex-col items-center gap-4 shadow-xl">
                        <img src={card.eventPicture} alt={`Image ${card.id}`} className="w-[250px] h-[200px]" />
                        <button className="rounded bg-customYellow text-2xl w-[100px]">Details</button>
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
        </div>
    );
};

export default HomePageCard;
