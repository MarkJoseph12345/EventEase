'use client'

const HomePageCards = [
    { imageUrl: "/card1.png" },
    { imageUrl: "/card2.png" },
    { imageUrl: "/card3.png" },
    { imageUrl: "/card2.png" },
];

import { SetStateAction, useEffect, useState } from 'react';

const HomePageCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % HomePageCards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + HomePageCards.length) % HomePageCards.length);
    };
    
    const handleCircleClick = (circleIndex: SetStateAction<number>) => {
        setCurrentIndex(circleIndex);
    };
    
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
    });

    const numVisibleCards = isMobile ? 1 : 3;

    const numCircles = Math.max(HomePageCards.length - numVisibleCards + 1, 1);

    return (
        <div className="relative">
            <div className="flex justify-center lg:justify-between max-w-[90%] mx-auto">
                {HomePageCards.slice(currentIndex, currentIndex + numVisibleCards).map((card, index) => (
                    <div className="border p-8 rounded-lg flex flex-col items-center gap-4 shadow-xl">
                        <img key={index} src={card.imageUrl} alt={`Image ${currentIndex + index + 1}`} />
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
