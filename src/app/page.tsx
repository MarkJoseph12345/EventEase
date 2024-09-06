"use client";

import { SetStateAction, useEffect, useState } from "react";
import NavBar from "./Comps/NavBar";
import Link from "next/link";
import Footer from "./Comps/Footer";
import { fetchEventPicture, getEventNow, getEvents } from "@/utils/apiCalls";
import { Event } from '@/utils/interfaces';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const isDateInCurrentWeek = (date: Date): boolean => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return date >= startOfWeek && date <= endOfWeek;
};

const Home = () => {
  const [eventNow, setEventNow] = useState<Event | null>(null);
  const [eventsThisWeek, setEventsThisWeek] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEventNow = async () => {
      const event = await getEventNow();
      if (event && event.id) {
        event.eventPicture = await fetchEventPicture(event.id);
        setEventNow(event);
      }
    };

    const fetchEventsThisWeek = async () => {
      const events = await getEvents();
      const eventsInWeek = events.filter(event => event.eventStarts && isDateInCurrentWeek(new Date(event.eventStarts)));
      const processedEvents = await Promise.all(
        eventsInWeek.map(async (event) => {
          if (event.eventType && Array.isArray(event.eventType)) {
            const eventTypeString = event.eventType[0];
            event.eventType = eventTypeString.split(", ");
          }
          event.eventPicture = await fetchEventPicture(event.id!);
          return event;
        })
      );
      setEventsThisWeek(processedEvents);
    };

    fetchEventNow();
    fetchEventsThisWeek();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderSettings = {
    centerMode: true,
    centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    slidesToShow: 3,
    speed: 500,
    arrows:false,
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
  };


  return (
    <div>
      <NavBar />
      <div>
        <img src="/wil4 1.png" className="w-full" />
      </div>
      <p className="text-center font-poppins text-2xl font-bold mt-10">EventEase</p>
      <p className="text-center font-regular font-poppins text-pretty">A platform for tracking events in Wildcat Innovation Labs</p>
      {eventNow ? (
        <div className="mt-9 mx-4">
          <p className="font-poppins text-lg font-medium laptop:text-center">Happening now</p>
          <div className="mt-2 flex justify-center items-center gap-10">
            <img src={eventNow.eventPicture || "/wil4 1.png"} className="w-44 h-44 object-cover" />
            <div className="flex flex-col items-center">
              <p className="font-poppins font-bold text-2xl">{eventNow.eventName}</p>
              <p className="text-customRed text-2xl font-bold font-poppins">{eventNow.eventLimit} <span className="text-black text-base font-semibold">Slots</span></p>
              <p className="font-medium font-poppins">{eventNow.eventType}</p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mt-10">
        <p className="mx-4 mb-2 font-poppins text-lg font-medium laptop:text-center">Happening this week!</p>
        {eventsThisWeek.length > 0 ? (
          <div className="mx-auto max-w-5xl">
            <Slider {...sliderSettings}>
              {eventsThisWeek.map((event, index) => (
                <div
                  key={event.id}
                  className={` outline-none transition-transform duration-500 ease-in-out ${index === (currentSlide % eventsThisWeek.length) || (currentSlide % eventsThisWeek.length) === (index + 1) % eventsThisWeek.length ? 'scale-75' : 'scale-110'
                    }`}
                >
                  <img
                    src={event.eventPicture}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                    alt={event.eventName}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
                    <p className="text-lg font-bold truncate">{event.eventName}</p>
                    <p className="text-sm mt-1">{event.eventType}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="items-center flex flex-col">
            <img src="/no-event-image.png" className="mb-4 w-44 h-44" alt="No events" />
            <p>No events this week</p>
          </div>
        )}
        <div className="bg-cover bg-no-repeat bg-center bg-[url('/discover.png')] my-10 px-10 py-2 flex flex-col items-center laptop:py-20 laptop:bg-bottom">
          <p className="text-center font-poppins font-bold text-lg bg-white laptop:bg-transparent">Explore thrilling events at Wildcat Innovation Labs</p>
          <p className="text-center font-poppins font-medium bg-white laptop:bg-transparent">Stay informed about the newest happenings at Wildcat Innovation Labs</p>
          <div className="flex justify-center items-center gap-3 bg-white laptop:bg-transparent">
            <Link href={"/SignUp"} className="box-border h-9 w-32 bg-customYellow px-4 py-1 text-center font-bold">JOIN</Link>
            <Link href={"/Events"} className="box-border h-9 w-32 border-2 border-black px-4 py-1 text-center font-bold">EXPLORE</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
