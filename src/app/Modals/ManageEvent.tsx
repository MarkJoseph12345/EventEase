"use client"
import { SetStateAction, useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Event, EventDetailModal } from '@/utils/interfaces';
import { deleteEvent, updateEvent, updateEventPicture } from '@/utils/apiCalls';
import PopUps from './PopUps';
import Confirmation from './Confirmation';

const departments = ['CEA', 'CMBA', 'CASE', 'CNAHS', 'CCS', 'CCJ'];
const types = ["Workshop", "Seminar", "Networking Events", "Other"];


const ManageEvent = ({ event, onClose }: EventDetailModal) => {
    const currentTime = new Date();

    const isEventEnded = new Date(event.eventEnds!) < currentTime;
    const [newPicture, setNewPicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(event.eventPicture || "");
    const [updateEventData, setUpdateEventData] = useState<any>({
        ...event,
        // eventType: event.eventType ? event.eventType.toString().split(', ') : [],
        eventStarts: event.eventStarts ? new Date(event.eventStarts) : null,
        eventEnds: event.eventEnds ? new Date(event.eventEnds) : null,
    });
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>();
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState<'delete' | 'update' | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showGenderExclusive, setShowGenderExclusive] = useState(event.allowedGender !== "ALL");
    const [showDepartmentExclusive, setShowDepartmentExclusive] = useState(event.department.some(dept => dept !== "Open To All"));

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleCheckboxChange = (department: string) => {
        setUpdateEventData((prevEvent: { department: string[]; }) => {
            const updatedDepartments = prevEvent.department.includes(department)
                ? prevEvent.department.filter(dep => dep !== department)
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
            setUpdateEventData((prevEvent: any) => ({
                ...prevEvent,
                [name]: usersArray
            }));
        } else {
            setUpdateEventData((prevEvent: any) => ({
                ...prevEvent,
                [name]: value
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

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setUpdateEventData((prevEvent: any) => ({
                ...prevEvent,
                eventStarts: date,
            }));
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setUpdateEventData((prevEvent: any) => ({
                ...prevEvent,
                eventEnds: date,
            }));
        }
    };


    const handleUpdateEvent = async () => {
        if (event.id === undefined) {
            return;
        }

        const updatedEventData = {
            ...updateEventData,
            eventPicture: newPicture || event.eventPicture,
        };
        const {
            allowedGender,
            department,
        } = updatedEventData;
        if (showGenderExclusive) {
            updatedEventData.allowedGender = allowedGender;
        } else {
            updatedEventData.allowedGender = "ALL";
        }

        if (showDepartmentExclusive) {
            updatedEventData.department = department;
            updatedEventData.department = updatedEventData.department.filter((dep: string) => dep !== "Open To All");
        } else {
            updatedEventData.department = ["Open To All"];
        }
        const result = await updateEvent(event.id, updatedEventData);

        if (newPicture instanceof File) {
            await updateEventPicture(event.id, newPicture);
        }

        if (result.success) {
            setMessage({ text: "Successfully updated event", type: "success" });
            window.location.reload();
        } else {
            setMessage({ text: result.messages, type: "error" });
        }
    };

    const handleConfirmation = (action: 'delete' | 'update', event: Event) => {
        setConfirmationAction(action);
        setIsConfirmationOpen(true);
        setSelectedEvent(event);
    };


    const handleDeleteEvent = async () => {
        if (event.id === undefined) {
            return;
        }
        const success = await deleteEvent(event.id);
        if (success) {
            setMessage({ text: "Successfully deleted event", type: "success" });
            window.location.reload();
        } else {
            setMessage({ text: "Failed to delete event", type: "error" });
        }
    };

    const confirmAction = () => {
        if (confirmationAction === 'delete') {
            handleDeleteEvent();
        } else if (confirmationAction === 'update') {
            handleUpdateEvent();
        }
        setConfirmationAction(null);
        setIsConfirmationOpen(false);
    };

    const cancelAction = () => {
        setIsConfirmationOpen(false);
        setConfirmationAction(null);
    };


    return (
        <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative laptop:max-w-[50rem]">
                <div className="flex justify-end sticky top-0">
                    <span className="text-gray-500 font-bold text-2xl z-10 cursor-pointer" onClick={onClose}>✖</span>
                </div>
                <p className="text-2xl font-poppins font-bold text-center">Manage Event</p>
                <div className="min-h-10 rounded-2xl mt-4 border-2 p-2 bg-customWhite  flex flex-col gap-5 ">
                    <div className="relative w-full flex flex-col items-center justify-center h-fit">
                        {preview &&
                            <div
                                className="h-44 w-72">
                                <img src={preview || event.eventPicture} className="h-full w-full object-contain" />
                            </div>
                        }
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="bg-customYellow font-poppins font-medium px-4 py-2 rounded-md mt-4">Change Event Image</button>
                    </div>
                    <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
                        <input placeholder="Event Name"
                            name="eventName"
                            defaultValue={updateEventData.eventName}
                            onChange={handleInputChange}
                            className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Event Name <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
                        <select
                            className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            defaultValue={updateEventData.eventType}
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
                        <textarea placeholder="Event Description"
                            name="eventDescription"
                            defaultValue={updateEventData.eventDescription}
                            onChange={handleInputChange}
                            className="peer h-32 w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Event Description <span className="text-customRed">*</span>
                        </label>
                    </div><div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
                        <input
                            placeholder="Event Limit"
                            name="eventLimit"
                            defaultValue={updateEventData.eventLimit}
                            onChange={handleInputChange}
                            className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                        />
                        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Event Limit <span className="text-customRed">*</span>
                        </label>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-10 mx-auto tablet:flex-row w-full">
                        <div>
                            <p>Start Date</p>
                            <DatePicker
                                showIcon
                                selected={updateEventData.eventStarts}
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
                                disabled={updateEventData.eventStarts === null}
                                showIcon
                                selected={updateEventData.eventEnds}
                                onChange={(date) => handleEndDateChange(date)}
                                showTimeSelect
                                timeFormat="h:mm aa"
                                timeIntervals={30}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={updateEventData.eventStarts}
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
                                                onChange={() => {
                                                    setShowGenderExclusive(!showGenderExclusive);

                                                    if (event.allowedGender === "ALL" && !showGenderExclusive) {
                                                        setUpdateEventData((prevEvent: any) => ({
                                                            ...prevEvent,
                                                            allowedGender: "MALE"
                                                        }))
                                                    }
                                                }}
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
                        <div className="relative w-full max-w-[24rem] mx-auto tablet:max-w-[90%]">
                            <select
                                className="peer h-full w-full rounded-[7px] border border-black border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-black focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                                defaultValue={event.allowedGender === "ALL" ? "MALE" : event.allowedGender}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    e.target.blur();
                                }}
                                name="allowedGender"
                            >
                                {/* Option for "ALL" can be uncommented if needed */}
                                {/* <option value="ALL">ALL</option> */}
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                            </select>
                            <label
                                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-black before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-black after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-black peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-black peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-black peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                            >
                                Gender
                            </label>
                        </div>
                    )}

                    {showDepartmentExclusive && (
                        <div className="relative flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md self-center tablet:max-w-[90%]">
                            <p className="m-2">Department(s)</p>
                            <nav className="flex flex-wrap gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                                {departments.map((department, index) => (
                                    <div key={index} role="button"
                                        className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                        <label htmlFor={`horizontal-list-${department}`} className="flex items-center w-full px-3 py-2 cursor-pointer">
                                            <div className="grid mr-3 place-items-center">
                                                <div className="inline-flex items-center">
                                                    <label className="relative flex items-center p-0 rounded-full cursor-pointer"
                                                        htmlFor={`horizontal-list-${department}`}>
                                                        <input id={`horizontal-list-${department}`} type="checkbox"
                                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                                                            checked={updateEventData.department.includes(department)}
                                                            onChange={() => handleCheckboxChange(department)}
                                                        />
                                                        <span
                                                            onClick={() => handleCheckboxChange(department)}
                                                            className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                                                stroke="currentColor" strokeWidth="1">
                                                                <path fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"></path>
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
                    <div className="flex items-center justify-center gap-2 self-end">
                        <button className="bg-customRed text-white font-poppins font-semibold px-4 py-2 rounded-md mt-4" onClick={(e) => {
                            handleConfirmation('delete', event);
                        }}>Delete Event</button>
                        <button     className={`font-poppins font-semibold px-4 py-2 rounded-md mt-4 ${isEventEnded ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-customYellow'}`} disabled={isEventEnded} onClick={(e) => {
                            handleConfirmation('update', event);
                        }}>Update Event</button>
                    </div>
                </div>
            </div>
            <Confirmation
                isOpen={isConfirmationOpen}
                message={
                    confirmationAction === "delete"
                        ? `Are you sure you want to delete ${selectedEvent?.eventName}?`
                        : `Are you sure you want to update  ${selectedEvent?.eventName}?`
                }
                actionType={
                    confirmationAction === 'delete'
                        ? "NEGATIVE"
                        : "NEUTRAL"
                }
                onConfirm={() => confirmAction()}
                onCancel={cancelAction}
            />
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div>
    )
}

export default ManageEvent;