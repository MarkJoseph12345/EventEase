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
import Loading from "./Loader/Loading";
import { formatDateHome } from "@/utils/data";

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
  const [loading, setLoading] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const handleMouseEnter = (event: Event) => {
    setHoveredEvent(event);
    setAutoScroll(false);
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
    setAutoScroll(true);
  };

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
      setLoading(false)
    };

    fetchEventNow();
    fetchEventsThisWeek();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderSettings = {
    centerMode: false,
    centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 1500,
    infinite: eventsThisWeek.length > 1,
    slidesToShow: Math.min(eventsThisWeek.length, 3),
    speed: 500,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
  };
  if (loading) {
    return <Loading />
  }

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
        <p className="mx-4 mb-2 font-poppins text-lg font-medium text-center">Happening this week!</p>
        {eventsThisWeek.length ? (
          <div className={`mx-auto ${eventsThisWeek.length <= 2 ? 'max-w-xl' : 'max-w-6xl'}`}>
            <Slider {...sliderSettings}>
              {eventsThisWeek.map((event, index) => {
                const isNextSlide = index === (currentSlide + 1) % eventsThisWeek.length;
                const isFirstSlide = index === 0 && currentSlide + 1 >= eventsThisWeek.length;

                const scaleClass =
                  eventsThisWeek.length === 1 ? 'scale-100' :
                    eventsThisWeek.length === 2 ? 'scale-90' :
                      isNextSlide || isFirstSlide ? 'scale-110' : 'scale-75';

                return (
                  <div
                    key={event.id}
                    className={`relative transition-transform duration-500 ease-in-out ${scaleClass}`}
                    onMouseEnter={() => handleMouseEnter(event)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoveredEvent === event && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 rounded-lg shadow-xl transition-opacity duration-300 opacity-100 px-5">
                        <div className="bg-[rgba(255,255,255,0.7)] p-4 rounded-lg shadow-md px-8">
                          <h3 className="text-sm tablet:text-lg text-center font-bold text-customYelloww">{event.eventName}</h3>
                          {/* <p className="text-gray-700 text-sm">{event.eventDescription}</p> */}
                          <p className="text-xs text-center text-white">{formatDateHome(event.eventStarts)}</p>
                        </div>

                      </div>
                    )}

                    <img
                      src={event.eventPicture}
                      className="w-full h-48 tablet:h-64 object-fill rounded-lg shadow-lg"
                      alt={event.eventName}
                    />
                    <div className="absolute bottom-0 left-0 bg-customYellow p-2 pr-5 z-10  hidden tablet:block w-56">
                      <p className="text-xs font-bold truncate text-black">{event.eventName}</p>
                    </div>

                  </div>
                );
              })}
            </Slider>

          </div>
        ) : (
          <div className="items-center flex flex-col">
            <img src="/no-event-image.png" className="mb-4 w-44 h-44" alt="No events" />
            <p>No events this week</p>
          </div>
        )}
        <div className="bg-cover bg-no-repeat bg-center bg-[url('/discover.png')] my-10 px-10 py-2 flex flex-col items-center laptop:py-20 laptop:bg-bottom laptop:gap-6">
          <p className="text-center font-poppins font-bold text-lg bg-white laptop:bg-transparent laptop:text-3xl">Explore thrilling events at Wildcat Innovation Labs</p>
          <p className="text-center font-poppins font-medium bg-white laptop:bg-transparent laptop:text-xl">Stay informed about the newest happenings at Wildcat Innovation Labs</p>
          <div className="flex justify-center items-center gap-3 bg-white laptop:bg-transparent">
            <Link href={"/SignUp"} className="box-border h-9 w-32 bg-customYellow px-4 py-2 text-center font-bold hover:text-white flex items-center justify-center">Join</Link>
            <Link href={"/Events"} className="box-border h-9 w-32 border-2 border-black px-4 py-2 text-center font-bold hover:text-customYellow flex items-center justify-center">Explore</Link>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
