"use client"

import { SetStateAction, useEffect, useState } from "react";
import Footer from "./comps/footer";
import HomePageCard from "./comps/hompageCards";
import NavBar from "./comps/navbar";
import axios from "axios";
import { API_ENDPOINTS } from "./api";
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import Link from "next/link";

interface EventCard {
  hour: number;
  description: string;
}
interface Latest {
  attendees: string;
}


const Home = () => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [startIndex, setStartIndex] = useState(getCurrentDayIndex());
  const [selectedDay, setSelectedDay] = useState(days[startIndex]);
  const [homePageCards, setHomePageCards] = useState<EventCard[]>([]);
  const [closestEventImageUrl, setClosestEventImageUrl] = useState<string>('');
  const [latestCompletedEvent, setLatestCompletedEvent] = useState<Latest>();

  function getCurrentDayIndex() {
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    return currentDayIndex;
  }

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 1, days.length - 2));
  };

  const handleBack = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    fetchData(day);
  };

  const fetchData = async (selectedDay: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_ALL_EVENTS);

      if (response.status >= 200 && response.status < 300) {
        const allEvents = response.data;
        const today = new Date();
        const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });
        const endOfWeekDate = endOfWeek(today, { weekStartsOn: 0 });

        const eventsForThisWeek = allEvents.filter((event: any) =>
          isWithinInterval(new Date(event.eventStarts), { start: startOfWeekDate, end: endOfWeekDate })
        );

        const eventsForSelectedDay = eventsForThisWeek.filter((event: any) => {
          const eventStartDate = new Date(event.eventStarts);
          return eventStartDate.getDay() === days.indexOf(selectedDay);

        });

        const updatedHomePageCards: EventCard[] = eventsForSelectedDay.map((event: any) => {
          const eventStartsHour = new Date(event.eventStarts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          return {
            hour: eventStartsHour,
            description: event.eventDescription,
          };
        });
        setHomePageCards(updatedHomePageCards);

        const completedEvents = allEvents.filter((event: { eventEnds: string | number | Date; }) => new Date(event.eventEnds) < new Date());

        completedEvents.sort((a: { eventEnds: string | number | Date }, b: { eventEnds: string | number | Date }) => new Date(b.eventEnds).getTime() - new Date(a.eventEnds).getTime());

        const latestCompletedEventId = completedEvents[0].id;

        try {
          const imgResponse = await axios.get(`${API_ENDPOINTS.GET_EVENT_PICTURE}${latestCompletedEventId}`, {
            responseType: 'arraybuffer'
          });
          if (imgResponse.status >= 200 && imgResponse.status < 300) {
            const base64Image = Buffer.from(imgResponse.data, 'binary').toString('base64');
            setClosestEventImageUrl(`data:image/png;base64,${base64Image}`);
          } else {
            console.error('Failed to fetch image for closest event');
          }
        } catch (error) {
          console.error("Error retrieving image:", error);
        }

      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  useEffect(() => {
    fetchData(days[startIndex]);
  }, []);





  return (
    <div className="max-w-[2000px] mx-auto">
      <NavBar />
      <img src="/wil4 1.png" className="w-full" />
      <div className="mx-[3%] my-[1%] ">
        <p className="font-poppins font-medium mt-8 text-xl">Latest Event</p>
        <div className="my-[1%] py-[3%] grid justify-center border px-14 rounded-3xl relative lg:flex lg:justify-between">
          <div>
            <img src={closestEventImageUrl} className="object-cover rounded-lg h-[275px] w-[275px]" />
          </div>
          <div className="py-16 gap-6 flex flex-col items-center lg:items-start">
            <div className="flex items-center">
              <div>
                <img src="/groupicon.png" />
              </div>
              <div className="-mt-5">
                <span className="text-customRed text-5xl font-bold">35+</span>
                <p className="font-semibold">Attendees</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={"/signup"} className="border rounded-3xl text-customYellow bg-black px-6 py-1 flex justify-center items-center">Join Now!</Link>
              <span className="border-2 rounded-3xl border-customYellow px-6 py-1">Open To All</span>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-2xl">Happening this week!</p>
              <div className="flex justify-center gap-3">
                <button onClick={handleBack} className="text-base font-bold">&lt;</button>
                {days.slice(startIndex === days.length - 1 ? startIndex - 1 : startIndex, startIndex + 2).map((day, index) => (
                  <span
                    key={index}
                    className={`text-xs cursor-pointer border-black border px-5 py-1 font-bold flex justify-center ${selectedDay === day ? "bg-customYellow border-none" : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </span>
                ))}

                <button onClick={handleNext} className="text-base font-bold">&gt;</button>
              </div>
              <div>
                {homePageCards.length > 0 ? (
                  homePageCards.map((event, index) => (
                    <div key={index} className="text-ellipsis overflow-hidden">
                      {event.hour.toString()} {event.description}
                    </div>
                  ))
                ) : (
                  <span>No events this day</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-[3%] my-[3%]">
        <p className="font-poppins text-xl font-medium">Discover More Events</p>
        <div className=" my-[1%]">
          <HomePageCard />
        </div>
      </div>
      <div className="relative">
        <img src="/discover.png" className="w-full" alt="Discover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white px-4 py-2 rounded-lg lg:mt-[5%] mt-[10%] flex lg:gap-10 gap-2 text-2xl flex-col lg:flex-row">
          <Link href={"/signup"} className="bg-black w-[100px] text-black bg-customYellow lg:w-[150px] lg:h-[40px] text-sm lg:text-2xl font-bold flex justify-center items-center">JOIN</Link>
          <div className="box-border bg-black lg:w-[150px] w-[100px] lg:h-[40px] p-[3px] text-sm lg:text-2xl">
            <button className="bg-white text-black w-full h-full font-bold">EXPLORE</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
