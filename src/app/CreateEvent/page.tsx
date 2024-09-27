"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Event } from "@/utils/interfaces";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { createEvent, fetchEventPicture, updateEventPicture, me, getEventById } from "@/utils/apiCalls";
import PopUps from "../Modals/PopUps";
import AdminEventDetailModal from "../Modals/AdminEventDetailModal";
import { User } from '@/utils/interfaces';

const departments = ["CEA", "CMBA", "CASE", "CNAHS", "CCS", "CCJ"];
const types = ["Workshop", "Seminar", "Networking",  "Other"];


const CreateEvent = () => {
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [event, setEvent] = useState<Event>({
    eventName: "",
    eventPicture: "",
    eventDescription: "",
    eventStarts: null,
    eventEnds: null,
    eventType: "Workshop",
    department: [],
    eventLimit: 50,
    allowedGender: "ALL",
    preRegisteredUsers: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>();
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdEvent, setCreatedEvent] = useState<Event | null>()
  
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await me();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);


  useEffect(() => {
    if (showModal == false) {
      setEvent({
        eventName: "",
        eventPicture: "",
        eventDescription: "",
        eventStarts: null,
        eventEnds: null,
        eventType: "Workshop",
        department: [],
        eventLimit: 50,
        allowedGender: "ALL",
        preRegisteredUsers: []
      });
      setNewPicture(null);
    }
  }, [showModal]);

  const handleCheckboxChange = (department: string) => {
    setEvent((prevEvent) => {
      const updatedDepartments = prevEvent.department.includes(department)
        ? prevEvent.department.filter((dep) => dep !== department)
        : [...prevEvent.department, department];
      updatedDepartments.sort();
      return {
        ...prevEvent,
        department: updatedDepartments,
      };
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === "preRegisteredUsers") {
      const usersArray = value.split(',').map(user => user.trim()).filter(user => user !== "");
      setEvent(prevEvent => ({
        ...prevEvent,
        [name]: usersArray
      }));
    } else {
      setEvent(prevEvent => ({
        ...prevEvent,
        [name]: value
      }));
    }
  };


  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        eventStarts: date,
      }));
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        eventEnds: date,
      }));
    }
  };

  const filterStartPassedTime = (time: string | number | Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate!.getTime() < selectedDate.getTime();
  };

  const filterEndPassedTime = (time: string | number | Date) => {
    const currentDate = event.eventStarts;
    const selectedDate = new Date(time);

    return currentDate!.getTime() < selectedDate.getTime();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCreateEvent = async () => {
    setIsCreating(true);
    const {
      eventName,
      eventDescription,
      eventStarts,
      eventEnds,
      department,
    } = event;
    if (!eventName || !eventDescription || !eventStarts || !eventEnds || department.length === 0) {
      setMessage({ text: "Please fill in all fields.", type: "error" });
      setIsCreating(false);
      return;
    }
    console.log(user!.username!)
    const result: any = await createEvent(user!.username!,event);
    setIsCreating(false);

    if (result.success) {
      setMessage({ text: result.message, type: "success" });
      if (newPicture instanceof File) {
        await updateEventPicture(result.id, newPicture);

      }

      const eventCreated = await getEventById(result.id);
      setCreatedEvent(eventCreated);
      if (createdEvent) {
        const picture = await fetchEventPicture(result.id!);
        createdEvent.eventPicture = picture;
      }
      setShowModal(true);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Sidebar />
      <div className="mt-2 mx-2 mb-5">
        <p className="text-2xl mt-10 font-poppins font-bold text-center">
          Create Event
        </p>
        <div className="min-h-10 rounded-2xl mt-4 border-2 p-2 bg-customWhite w-fit mx-auto flex flex-col gap-5 ">
          <div className="relative w-full flex flex-col items-center justify-center">
            {newPicture && (
              <img
                src={preview}
                className="mx-auto max-w-72 max-h-72 object-scale-down"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className="bg-customYellow font-poppins font-medium px-4 py-2 rounded-md mt-4"
            >
              {newPicture ? "Change Event Image" : "Upload Event Image"}
            </button>
          </div>
          <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <input
              placeholder="Event Name"
              name="eventName"
              value={event.eventName}
              onChange={handleInputChange}
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Event Name <span className="text-customRed">*</span>
            </label>
          </div>
          <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <select
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              value={event.eventType}
              onChange={(e) => { handleInputChange(e); e.target.blur(); }}
              name="eventType"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-black peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-black peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-black peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Event Type
            </label>
          </div>
          <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <textarea
              placeholder="Event Description"
              name="eventDescription"
              value={event.eventDescription}
              onChange={handleInputChange}
              className="peer h-32 w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Event Description <span className="text-customRed">*</span>
            </label>
          </div>
          <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <input
              placeholder="Event Limit"
              name="eventLimit"
              value={event.eventLimit}
              onChange={handleInputChange}
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Event Limit <span className="text-customRed">*</span>
            </label>
          </div>
          <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <input
              placeholder="Pre-registered Users (comma-separated)"
              name="preRegisteredUsers"
              value={event.preRegisteredUsers}
              onChange={handleInputChange}
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Pre-registered Users
            </label>
          </div>


          <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <select
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={event.allowedGender} onChange={(e) => { handleInputChange(e); e.target.blur(); }} name="allowedGender">
              <option value="ALL">ALL</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-black peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-black peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-black peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Gender
            </label>
          </div>
          <div className="relative flex w-full max-w-[24rem] mx-auto flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md tablet:max-w-[90%]">
            <p className="m-2">Department(s)</p>
            <nav className="flex flex-wrap gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
              {departments.map((department, index) => (
                <div
                  key={index}
                  role="button"
                  className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                >
                  <label
                    htmlFor={`horizontal-list-${department}`}
                    className="flex items-center w-full px-3 py-2 cursor-pointer"
                  >
                    <div className="grid mr-3 place-items-center">
                      <div className="inline-flex items-center">
                        <label
                          className="relative flex items-center p-0 rounded-full cursor-pointer"
                          htmlFor={`horizontal-list-${department}`}
                        >
                          <input
                            id={`horizontal-list-${department}`}
                            type="checkbox"
                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                            checked={event.department.includes(department)}
                            onChange={() => handleCheckboxChange(department)}
                          />
                          <span
                            onClick={() => handleCheckboxChange(department)}
                            className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        </label>
                      </div>
                    </div>
                    <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                      {department}
                    </p>
                  </label>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mx-auto tablet:flex-row tablet:max-w-[90%]">
            <div>
              <p>Start Date</p>
              <DatePicker
                showIcon
                selected={event.eventStarts}
                onChange={(date) => handleStartDateChange(date)}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                filterTime={filterStartPassedTime}
                minDate={new Date()}
                placeholderText="Start Date"
                className="bg-white border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p>End Date</p>
              <DatePicker
                disabled={event.eventStarts === null}
                showIcon
                selected={event.eventEnds}
                onChange={(date) => handleEndDateChange(date)}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={event.eventStarts}
                filterTime={filterEndPassedTime}
                placeholderText="End Date"
                className="bg-white border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              className={`bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md mt-4 ${isCreating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={handleCreateEvent}
              disabled={isCreating}
            >
              {isCreating ? "Creating event..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
      {showModal && (<AdminEventDetailModal from="create" event={createdEvent!} onClose={() => setShowModal(false)} />)}
      {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
    </div>
  );
};

export default CreateEvent;