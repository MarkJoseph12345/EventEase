'use client'
import { SetStateAction, useEffect, useState } from 'react';

const HomePageCards = [
    { id: 1, imageUrl: "/card1.png" },
    { id: 2, imageUrl: "/card2.png" },
    { id: 3, imageUrl: "/card3.png" },
    { id: 4, imageUrl: "/card2.png" },
];

const HomePageCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % HomePageCards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + HomePageCards.length) % HomePageCards.length);
    };
    
    const handleCircleClick = (circleIndex: SetStateAction<number>) => {
        setCurrentIndex(circleIndex);
    };
    
    const numVisibleCards = isMobile ? 1 : 3;
    const numCircles = Math.max(HomePageCards.length - numVisibleCards + 1, 1);

    return (
        <div className="relative">
            <div className="flex justify-center lg:justify-between max-w-[90%] mx-auto">
                {HomePageCards.slice(currentIndex, currentIndex + numVisibleCards).map((card) => (
                    <div key={card.id} className="border p-8 rounded-lg flex flex-col items-center gap-4 shadow-xl">
                        <img src={card.imageUrl} alt={`Image ${card.id}`} className="w-[250px] h-[200px]" />
                        <button className="rounded bg-customYellow text-2xl w-[100px]">Details</button>
                    </div>
                ))}
            </div>
            <button className={`text-5xl absolute left-0 top-0 bottom-0 m-auto w-10 h-10 text-black rounded-full flex justify-center items-center ${currentIndex === 0 ? 'hidden' : ''}`} onClick={handlePrev}>
                &lt;
            </button>
            <button className={`text-5xl absolute right-0 top-0 bottom-0 m-auto w-10 h-10 text-black rounded-full flex justify-center items-center ${currentIndex + numVisibleCards >= HomePageCards.length ? 'hidden' : ''}`} onClick={handleNext}>
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
