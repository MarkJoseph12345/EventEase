"use client";

import { useEffect, useState } from "react";
import NavBar from "./Comps/NavBar";
import Link from "next/link";
import Footer from "./Comps/Footer";
import { fetchEventPicture, getEventNow, getEvents } from "@/utils/apiCalls";
import { Event } from '@/utils/interfaces';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "./Loader/Loading";

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
        <p className="mx-4 mb-2 font-poppins text-lg font-medium laptop:text-center">Happening this week!</p>
        {eventsThisWeek.length ? (
          <div className="mx-auto max-w-6xl ">
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
                    className={`relative transition-transform duration-500 ease-in-out ${scaleClass} `}
                  >
                    <img
                      src={event.eventPicture}
                      className="w-full h-48 tablet:h-64 object-fill rounded-lg shadow-lg"
                      alt={event.eventName}
                    />
                    <div className="absolute bottom-6 left-0 bg-customYellow p-2 pr-5">
                      <p className="text-lg font-bold truncate  text-black">{event.eventName}</p>
                      <p className="text-sm text-white">{event.eventType}</p>
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
            <Link href={"/SignUp"} className="box-border h-9 w-32 tablet:w-48 bg-customYellow px-4 py-2 text-center font-bold hover:text-white flex items-center justify-center">Join</Link>
            <Link href={"/Events"} className="box-border h-9 w-32 tablet:w-48 border-2 border-black px-4 py-2 text-center font-bold hover:text-customYellow flex items-center justify-center">Explore</Link>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
