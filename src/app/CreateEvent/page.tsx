"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Event } from "@/utils/interfaces";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { createEvent, fetchEventPicture, updateEventPicture, me, getEventById, getAllUsers, fetchProfilePicture } from "@/utils/apiCalls";
import PopUps from "../Modals/PopUps";
import AdminEventDetailModal from "../Modals/AdminEventDetailModal";
import { User } from '@/utils/interfaces';

const departments = ["CEA", "CMBA", "CASE", "CNAHS", "CCS", "CCJ"];
const types = ["Networking Event", "Seminar", "Workshop", "Others"];


const CreateEvent = () => {
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [event, setEvent] = useState<Event>({
    eventName: "",
    eventPicture: "",
    eventDescription: "",
    eventStarts: null,
    eventEnds: null,
    eventType: "Networking Event",
    department: [],
    eventLimit: 50,
    allowedGender: "MALE",
    preRegisteredUsers: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>();
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdEvent, setCreatedEvent] = useState<Event | null>()
  const [users, setUsers] = useState<User[]>([]);
  const [userImages, setUserImages] = useState<{ [key: string]: string }>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showGenderExclusive, setShowGenderExclusive] = useState(false);
  const [showDepartmentExclusive, setShowDepartmentExclusive] = useState(false);
  const suggestionRef = useRef(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await me();
        setUser(userData);
      } catch (error) {
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        const userData = await me();
        const filteredUsers = fetchedUsers.filter(user => user.id !== userData.id && user.role === "STUDENT");
        setUsers(filteredUsers);
        await fetchUserImages(filteredUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserImages = async (users: User[]) => {
    const imagePromises = users.map(async (user) => {
      if (user.id) {
        const url = await fetchProfilePicture(user.id);
        return { [user.id]: url };
      }
      return {};
    });

    const images = await Promise.all(imagePromises);
    const imagesMap = images.reduce((acc, image) => ({ ...acc, ...image }), {});
    setUserImages(imagesMap);
  };


  useEffect(() => {
    if (showModal == false) {
      setEvent({
        eventName: "",
        eventPicture: "",
        eventDescription: "",
        eventStarts: null,
        eventEnds: null,
        eventType: "Networking Event",
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
      setInputValue(value);
      if (value.trim() === '') {
        setSelectedIndex(0);
        setSuggestions([]);
      }
      else {
        const usersArray = value.split(',').map(user => user.trim()).filter(user => user !== "");

        setDropdownOpen(true);
        if (value) {
          const lastUser = usersArray[usersArray.length - 1];
          if (lastUser) {
            const filteredSuggestions = users.filter(user =>
              user.username!.toLowerCase().includes(lastUser.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      }
    } else {
      setEvent(prevEvent => ({
        ...prevEvent,
        [name]: value
      }));
    }
  };

  const addUser = (username: string) => {
    if (!selectedUsers.includes(username)) {
      setSelectedUsers([...selectedUsers, username]);
    }

    setEvent(prevEvent => ({
      ...prevEvent,
      preRegisteredUsers: [...(prevEvent.preRegisteredUsers || []), username],
    }));


    setSuggestions([]);
    setDropdownOpen(false);
    setSelectedIndex(0);
    setInputValue('');
  };


  const removeUser = (username: string) => {
    setSelectedUsers(selectedUsers.filter(user => user !== username));
    setEvent(prevEvent => ({
      ...prevEvent,
      preRegisteredUsers: prevEvent.preRegisteredUsers!.filter(user => user !== username),
    }));
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
    const isInTheFuture = currentDate.getTime() < selectedDate.getTime();
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const isDuringDisabledTime = (hours === 12) || (hours === 13 && minutes === 0);
    return isInTheFuture && !isDuringDisabledTime;
  };

  const filterEndPassedTime = (time: string | number | Date) => {
    const currentDate = new Date(event.eventStarts!);
    const selectedDate = new Date(time);
    const isInTheFuture = currentDate.getTime() < selectedDate.getTime();
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const isDuringDisabledTime = (hours === 12) || (hours === 13 && minutes === 0);
    return isInTheFuture && !isDuringDisabledTime;
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
      allowedGender,
      department,
    } = event;
    if (!eventName || !eventDescription || !eventStarts || !eventEnds) {
      setMessage({ text: "Please fill in all the required fields.", type: "error" });
      setIsCreating(false);
      return;
    }
    if (showGenderExclusive) {
      event.allowedGender = allowedGender;
    } else {
      event.allowedGender = "ALL";
    }

    if (showDepartmentExclusive) {
      event.department = department;
    } else {
      event.department = ['Open to All'];
    }
    const result: any = await createEvent(user!.username!, event);
    setIsCreating(false);
    if (result.success) {
      setMessage({ text: result.message, type: "success" });
      if (newPicture instanceof File) {
        await updateEventPicture(result.id, newPicture);

      }
      const eventCreated = await getEventById(result.id);
      if (eventCreated) {
        const picture = await fetchEventPicture(result.id!);
        eventCreated.eventPicture = picture;
      }
      setCreatedEvent(eventCreated);
      setShowModal(true);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };


  const handleBlur = () => {
    setDropdownOpen(false);
    setSuggestions([]);
    setSelectedIndex(0);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setDropdownOpen(true);
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'ArrowDown' || event.key === 'Tab') {
      event.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        addUser(suggestions[selectedIndex].username!);
      } else {
        const trimmedInputValue = inputValue.trim();
        if (trimmedInputValue && !selectedUsers.includes(trimmedInputValue)) {
          addUser(trimmedInputValue);
        }
      }
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
      <div className="mt-2 mx-2 mb-5 ">
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
          <div className="relative w-full mx-auto ">
            <input
              placeholder="Event Name"
              name="eventName"
              value={event.eventName}
              onChange={handleInputChange}
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 "
            >
              Event Name <span className="text-customRed">*</span>
            </label>
          </div>
          <div className="relative w-full mx-auto">
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
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 "
            >
              Event Type
            </label>
          </div>
          <div className="relative w-full mx-auto">
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
          <div className="relative w-full mx-auto">
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

          <div className="relative w-full mx-auto">
            <input
              placeholder="Pre-registered Users"
              name="preRegisteredUsers"
              value={inputValue}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Pre-registered Users
            </label>
            {suggestions.length > 0 && isDropdownOpen && (
              <ul
                ref={suggestionRef}
                className="absolute w-full z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-40 overflow-auto"
              >
                {suggestions.map((user, index) => (
                  <li
                    key={user.id}
                    onMouseDown={() => addUser(user.username!)}
                    className={`flex w-full cursor-pointer hover:bg-customYellow px-2 py-1 hover:bg-opacity-20 ${selectedIndex === index ? 'bg-customYellow bg-opacity-20' : ''}`}
                  >
                    <img src={userImages[user.id!] || "/defaultpic.png"} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </div>


          {selectedUsers.length > 0 && (
            <div className="w-full max-w-[24rem] tablet:max-w-[32rem] mx-auto flex flex-wrap mb-2 max-h-32 overflow-auto">
              {selectedUsers.map((username, index) => (
                <div key={index} className="flex items-center bg-customYellow rounded-full px-2 py-1 mr-2 mb-2">
                  {username}
                  <button
                    onClick={() => removeUser(username)}
                    className="ml-2 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}



          <div className="flex flex-col items-center justify-center gap-2 tablet:flex-row  max-w-[24rem] mx-auto tablet:max-w-[90%]">
            <div>
              <p className="text-center">Start Date</p>
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
              <p className="text-center">End Date</p>
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

          <div className="relative w-full flex justify-evenly items-center mx-auto">
            <div>
              <label
                className="flex items-center w-full py-2 cursor-pointer"
              >
                <div className="grid mr-3 place-items-center">
                  <div className="inline-flex items-center">
                    <label
                      className="relative flex items-center p-0 rounded-full cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-0"
                        checked={showGenderExclusive}
                        onChange={() => setShowGenderExclusive(!showGenderExclusive)}
                      />
                      <span
                        onClick={() => setShowGenderExclusive(!showGenderExclusive)}
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
                <p className="">
                  Gender Exclusive
                </p>
              </label>
            </div>
            <div>
              <label
                className="flex items-center w-full py-2 cursor-pointer"
              >
                <div className="grid mr-3 place-items-center">
                  <div className="inline-flex items-center">
                    <label
                      className="relative flex items-center p-0 rounded-full cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-0"
                        checked={showDepartmentExclusive}
                        onChange={() => setShowDepartmentExclusive(!showDepartmentExclusive)}
                      />
                      <span
                        onClick={() => setShowDepartmentExclusive(!showDepartmentExclusive)}
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
                <p className="">
                  Department Exclusive
                </p>
              </label>
            </div>
          </div>
          {showGenderExclusive && (
            <div className="relative w-full mx-auto">
              <select
                className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={event.allowedGender} onChange={(e) => { handleInputChange(e); e.target.blur(); }} name="allowedGender">
                {/* <option value="ALL">ALL</option> */}
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-black peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-black peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-black peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Gender
              </label>
            </div>
          )}
          {showDepartmentExclusive && (
            <div className="relative flex w-full mx-auto flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md ">
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
                      className="flex items-center w-full py-2 cursor-pointer"
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
                              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-0"
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
          )}

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