'use client'

const HomePageCards = [
    { imageUrl: "/card1.png" },
    { imageUrl: "/card2.png" },
    { imageUrl: "/card2.png" },
    { imageUrl: "/card3.png" }
];

import { useState } from 'react';

const HomePageCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % HomePageCards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + HomePageCards.length) % HomePageCards.length);
    };

    return (
        <div className="relative">
            <div className="flex justify-between max-w-[90%] mx-auto">
                {HomePageCards.slice(currentIndex, currentIndex + 3).map((card, index) => (
                    <div className="border p-8 rounded-lg flex flex-col items-center gap-4 shadow-xl">
                        <img key={index} src={card.imageUrl} alt={`Image ${currentIndex + index + 1}`} />
                        <button className="rounded bg-customYellow text-2xl w-[100px]">Details</button>
                    </div>
                ))}
            </div>
            <button className={`text-5xl absolute left-0 top-0 bottom-0 m-auto w-10 h-10 text-black rounded-full flex justify-center items-center ${currentIndex === 0 ? 'hidden' : ''}`} onClick={handlePrev}>
                &lt;
            </button>
            <button className={`text-5xl absolute right-0 top-0 bottom-0 m-auto w-10 h-10 text-black rounded-full flex justify-center items-center ${currentIndex + 3 >= HomePageCards.length ? 'hidden' : ''}`} onClick={handleNext}>
                &gt;
            </button>
        </div>
    );
};

export default HomePageCard;
