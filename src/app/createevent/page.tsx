'use client';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateEvent = ({ visible, onClose }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({ 
    eventName: "",
    typeofEvent: "One-Time",
    eventDescription: "",
    startDate: null, 
    startTime: null, 
    endDate: null, 
    endTime: null, 
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeofEventChange = (e) => {
    setFormData({
      ...formData,
      typeofEvent: e.target.value
    });
  };
 

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setFormData({
        ...formData,
        startDate: date
      });
    } else {
      setFormData({
        ...formData,
        endDate: date
      });
    }
  };

  const handleTimeChange = (time, type) => {
    if (type === 'start') {
      setFormData({
        ...formData,
        startTime: time
      });
    } else {
      setFormData({
        ...formData,
        endTime: time
      });
    }
  };

  const toggleCalendar = (type) => {
    if (showCalendar === type) {
      setShowCalendar(false);
    } else {
      setShowCalendar(type);
    }
  };
  return (
    <Modal
      open={visible}
      onClose={onClose}
    >
      <div 
        className='bg-white p-4 rounded-3xl mt-20 ml-[20rem] w-[48rem] h-[25rem] relative' 
        style={{ backgroundImage: "url('/inno.png')", backgroundSize: 'cover' }}
      >
        <h2 className='text-lg font-bold -mt-4 p-4'>Create Event</h2>
        <div className="grid grid-cols-1 gap-5">
          <div className="relative p-5 -mt-1">
            <p className="font-poppins text-sm font-regular -mt-6">Event Name <span className="text-red-800">*</span></p>
            <input 
              type='text' 
              placeholder='Enter Text' 
              name="eventName" 
              value={formData.eventName} 
              onChange={handleInputChange} 
              className="p-2 w-[20rem] h-[32px] rounded-2xl border-2 border-black"
              style={{ zIndex: 1, backgroundClip: 'padding-box', fontSize: '12px' }}
            />
          </div>
          <div className="relative p-5 -mt-7">
            <p className="font-poppins text-sm font-regular -mt-6">Type of Event<span className="text-red-800">*</span></p>
            <select
              value={formData.typeofEvent}
              onChange={handleTypeofEventChange}
              className="p-2 w-[20rem] h-[32px] rounded-2xl border-2 border-black" 
              style={{ zIndex: 1, backgroundClip: 'padding-box', fontSize: '12px' }}
            >
              <option value="One-Time">One-Time</option>
              <option value="Series">Series</option>
            </select>
          </div>
          <div className="relative p-5 -mt-7">
            <p className="font-poppins text-sm font-regular -mt-6">Event Description <span className="text-red-800">*</span></p>
            <textarea 
              placeholder='Enter Description' 
              name="eventDescription" 
              value={formData.eventDescription} 
              onChange={handleInputChange} 
              className="p-2 w-[20rem] h-[60px] rounded-2xl border-2 border-black resize-none"
              style={{ zIndex: 1, backgroundClip: 'padding-box', fontSize: '12px' }}
            />
          </div>
           {/* Start Date */}
           <div className="relative p-5 -mt-8">
            <p className="font-poppins text-sm font-regular -mt-6">Start Date <span className="text-red-800">*</span></p>
            <div className="relative">
              <input 
                type='text' 
                placeholder='Select Date and Time' 
                value={
                  formData.startDate && formData.startTime
                    ? `${formData.startDate.toLocaleDateString()} ${formData.startTime.toLocaleTimeString()}`
                    : ''
                }
                readOnly
                className="p-1 w-[9rem] h-[32px] rounded-2xl border-2 border-black"
                style={{ zIndex: 1, backgroundClip: 'padding-box', fontSize: '10px' }}
              />
              <img 
                src="/calendar.png"
                alt="Calendar" 
                className="absolute top-0 right-20 m-2 cursor-pointer w-[15px] mr-[30rem]"
                onClick={() => toggleCalendar('start')}
              />
              {showCalendar === 'start' && (
                <div className="absolute top-full w-[5rem] h-[32px] -left-1 -mt-3 p-4">
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange(date, 'start')}
                    dateFormat="MM/dd/yyyy"
                    className="border-2 border-customYellow mt-[5px] w-[7rem] font-regular text-[10px] rounded-2xl text-center"
                  />
                  <DatePicker
                    selected={formData.startTime}
                    onChange={(time) => handleTimeChange(time, 'start')}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={1}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="border-2 border-customYellow mt-[5px] w-[7rem] font-regular text-[10px] rounded-2xl text-center"
                  />
                </div>
              )}
            </div>
          </div>
          {/* End Date */}
          <div className="relative p-5 -mt-[5.5rem] ml-[11rem]">
            <p className="font-poppins text-sm font-regular -mt-6">End Date <span className="text-red-800">*</span></p>
            <div className="relative">
              <input 
                type='text' 
                placeholder='Select Date and Time' 
                value={
                  formData.endDate && formData.endTime
                    ? `${formData.endDate.toLocaleDateString()} ${formData.endTime.toLocaleTimeString()}`
                    : ''
                }
                readOnly
                className="p-1 w-[9rem] h-[32px] rounded-2xl border-2 border-black"
                style={{ zIndex: 1, backgroundClip: 'padding-box', fontSize: '10px' }}
              />
              <img 
                src="/calendar.png"
                alt="Calendar" 
                className="absolute top-0 right-[254px] m-2 cursor-pointer w-[15px] mr-[8rem]"
                onClick={() => toggleCalendar('end')}
              />
              {showCalendar === 'end' && (
                <div className="absolute top-full w-[5rem] h-[32px] -left-1 -mt-3 p-4">
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, 'end')}
                    dateFormat="MM/dd/yyyy"
                    className="border-2 border-customYellow mt-[5px] w-[7rem] font-regular text-[10px] rounded-2xl text-center"
                  />
                  <DatePicker
                    selected={formData.endTime}
                    onChange={(time) => handleTimeChange(time, 'end')}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={1}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="border-2 border-customYellow mt-[5px] w-[7rem] font-regular text-[10px] rounded-2xl text-center"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=' font-bold -mt-[22rem] ' >
          <Button onClick={onClose} style={{ color: 'black', fontSize:'25px', marginLeft:'43rem' }}>X</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEvent;
