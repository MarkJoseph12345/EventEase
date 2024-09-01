"use client"

import { useState } from "react";
import NavBar from "./Comps/NavBar";
import Link from "next/link";
import Footer from "./Comps/Footer";



const Home = () => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date().getDay();
  const [startIndex, setStartIndex] = useState(today);
  const [selectedDay, setSelectedDay] = useState(days[today]);

  const handleNextClick = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % days.length);
  };

  const handleBackClick = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + days.length) % days.length);
  };

  const displayedDays = [];
  for (let i = 0; i < 4; i++) {
    displayedDays.push(days[(startIndex + i) % days.length]);
  }

  const handleDayClick = (day: string) => {
    setSelectedDay(day)
  };

  return (
    <div>
      <NavBar />
      <div>
        <img src="/wil4 1.png" className="w-full" />
      </div>
      <p className="text-center font-poppins text-2xl font-bold mt-10">EventEase</p>
      <p className="text-center font-regular font-poppins text-pretty">A platform for tracking events in Wildcat Innovation Labs</p>
      <div className="mt-9 mx-4">
        <p className="font-poppins text-lg font-medium laptop:text-center">Closest Event</p>
        <div className="mt-2 flex justify-center items-center gap-10">
          <img src="/wil4 1.png" className="w-44 h-44 object-cover" />
          <div className="flex flex-col items-center">
            <p className="font-poppins font-bold text-2xl">Event Name</p>
            <p className="text-customRed text-2xl font-bold font-poppins"> 50 <span className="text-black text-base font-semibold">Slots left</span></p>
            <p className="font-medium font-poppins"> CCS Only!</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <p className="mx-4 mb-2 font-poppins text-lg font-medium laptop:text-center">Happening this week!</p>
        <div>
          <div className="flex justify-center gap-3">
            <button onClick={handleBackClick} className="text-base font-bold">&lt;</button>
            {displayedDays.map((day, index) => (
              <span
                key={index}
                className={`text-xs cursor-pointer border-black border px-5 py-1 font-bold flex justify-center z-10 ${selectedDay === day ? "bg-customYellow border-none shadow-lg shadow-customYellow" : ""
                  }`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </span>
            ))}

            <button onClick={handleNextClick} className="text-base font-bold">&gt;</button>
          </div>
          <div className="flex flex-col items-center gap pt-2">
            <img src="no-event-image.png" alt="No events today" className="mb-4 w-32 h-32" />
            <p className="font-poppins text-center text-gray-700 mx-4">Oops! Looks like there are no events scheduled for today. Check back later or explore our upcoming events.</p>
            <Link href={"/Events"} className="mt-4 bg-customYellow font-poppins font-medium px-4 py-2 rounded">Explore Upcoming Events</Link>
          </div>
        </div>
        <div className="bg-cover bg-no-repeat bg-center bg-[url('/discover.png')] my-10 px-10 py-2 flex flex-col items-center laptop:py-20 laptop:bg-bottom">
          <p className="text-center font-poppins font-bold text-lg bg-white laptop:bg-transparent	   ">Explore thrilling events at Wildcat Innovation Labs</p>
          <p className="text-center font-poppins font-medium bg-white laptop:bg-transparent	">Stay informed about the newest happenings at Wildcat Innovation Labs</p>
          <div className=" flex justify-center items-center gap-3 bg-white laptop:bg-transparent	  ">
            <Link href={"/signup"} className="box-border h-9 w-32 bg-customYellow px-4 py-1 text-center font-bold">JOIN</Link>
            <Link href={"/Events"} className="box-border h-9 w-32 border-2 border-black px-4 py-1 text-center font-bold">EXPLORE</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
