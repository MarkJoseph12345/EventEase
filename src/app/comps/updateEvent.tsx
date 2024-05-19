'use client';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { styled } from '@mui/joy';
import { API_ENDPOINTS } from '../api';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface FormErrors {
  eventName?: string;
  eventType?: string;
  eventDescription?: string;
  department?: string;
  selectedFile?: string;
  startDate?: string;
  endDate?: string;
}


const UpdateEventModal = ({ visible, onClose, id }: { visible: boolean; onClose: () => void; id: number; }) => {
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "One-Time",
    eventDescription: "",
    department: "CEA",
    startDate: null as Date | null,
    endDate: null as Date | null,
    eventPicture: null as string | ArrayBuffer | null,
    eventStarts: null as Date | null,
    eventEnds: null as Date | null,
  });



  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.GET_EVENT_BY_ID}${id}`);
        const eventData = response.data;
        setFormData({
          eventName: eventData.eventName || "",
          eventType: eventData.eventType || "One-Time",
          eventDescription: eventData.eventDescription || "",
          department: eventData.department || "CEA",
          startDate: eventData.startDate ? new Date(eventData.startDate) : null,
          endDate: eventData.endDate ? new Date(eventData.endDate) : null,
          eventPicture: null,
          eventStarts: eventData.eventStarts ? new Date(eventData.eventStarts) : null,
          eventEnds: eventData.eventEnds ? new Date(eventData.eventEnds) : null,
        });
        const imgResponse = await axios.get(`${API_ENDPOINTS.GET_EVENT_PICTURE}${id}`, {
          responseType: 'arraybuffer'
        });
        if (imgResponse.status >= 200 && imgResponse.status < 300) {
          const base64Image = Buffer.from(imgResponse.data, 'binary').toString('base64');
          setFormData(prevData => ({
            ...prevData,
            eventPicture: `data:image/png;base64,${base64Image}`
          }));
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    if (visible && id) {
      fetchEventData();
    }
  }, [visible, id]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {

    const { name, value } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'eventName':
        errorMessage = !value.trim() ? 'Event name is required' : '';
        break;
      case 'eventDescription':
        errorMessage = !value.trim() ? 'Event description is required' : '';
        break;
      default:
        errorMessage = '';
    }

    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }));


    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeofEventChange = (e: { target: { value: any; }; }) => {
    setFormData({
      ...formData,
      eventType: e.target.value
    });
  };

  const handleDepartmentChange = (e: { target: { value: any; }; }) => {
    setFormData({
      ...formData,
      department: e.target.value
    });
  };



  const handleDateChange = (date: Date | null, type: string) => {
    if (!date) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [type === 'start' ? 'startDate' : 'endDate']: 'Please select a valid date'
      }));
    } else {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [type === 'start' ? 'startDate' : 'endDate']: ''
      }));
    }

    const currentDate = new Date();
    if (type === 'start' && date && date < currentDate) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        startDate: 'Start date cannot be before the current date'
      }));
    }

    if (type === 'end' && date && formData.startDate && date < formData.startDate) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        endDate: 'End date cannot be before the start date'
      }));
    }

    if (type === 'start') {
      setFormData({
        ...formData,
        eventStarts: date
      });
    } else {
      setFormData({
        ...formData,
        eventEnds: date
      });
    }

    if (formData.startDate && type === 'start') {
      if (date && date.getTime()) {
        setShowStartCalendar(false);
      }
    }

    if (formData.endDate && type === 'end') {
      if (date && date.getTime()) {
        setShowEndCalendar(false);
      }
    }
  };

  const [secFormData, setSecFormData] = useState(new FormData());
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const imageDataUrl = reader.result;
        setFormData({
          ...formData,
          eventPicture: imageDataUrl,
        });
      }
    };

    if (file) {
      const newSecFormData = new FormData();
      newSecFormData.append('eventImage', file);
      setSecFormData(newSecFormData);

      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        eventPicture: null,
      });
      setSecFormData(new FormData());
    }
  };


  const [loading, setLoading] = useState(false);


  const createEventFunction = async () => {
    setLoading(true);
    const requiredErrorMessages: FormErrors = {
      eventName: !formData.eventName ? 'Event name is required' : '',
      eventDescription: !formData.eventDescription ? 'Event description is required' : '',
      selectedFile: !selectedFile ? 'File is required' : '',
    };

    if (!formData.eventName || !formData.eventDescription || !formData.eventStarts || !formData.eventEnds || !selectedFile) {
      setFormErrors(requiredErrorMessages)
      setLoading(false);
      return;
    }


    const currentDateTime = new Date();
    if (formData.eventStarts <= currentDateTime) {
      setFormErrors({
        ...requiredErrorMessages,
        startDate: "Start date and time must be in the future",
      });
      console.log("Start time")
      setLoading(false);
      return;
    }
    else {
      setFormErrors({
        ...requiredErrorMessages,
        startDate: "",
      });
    }

    if (formData.eventEnds <= formData.eventStarts) {
      setFormErrors({
        ...requiredErrorMessages,
        endDate: "End date must be after start date",
      });
      console.log("End time")
      setLoading(false);
      return;
    }
    else {
      setFormErrors({
        ...requiredErrorMessages,
        endDate: "",
      });
    }
    const { eventPicture, ...formDataWithoutPicture } = formData;


    const eventStarts = new Date(formData.eventStarts.getFullYear(), formData.eventStarts.getMonth(), formData.eventStarts.getDate(), formData.eventStarts.getHours(), formData.eventStarts.getMinutes(), formData.eventStarts.getSeconds())


    const eventEnds = new Date(formData.eventEnds.getFullYear(), formData.eventEnds.getMonth(), formData.eventEnds.getDate(), formData.eventEnds.getHours(), formData.eventEnds.getMinutes(), formData.eventEnds.getSeconds())


    const updatedFormData = {
      ...formDataWithoutPicture,
      eventStarts,
      eventEnds,
    };

    try {
      const response = await axios.put(`${API_ENDPOINTS.UPDATE_EVENT}${id}`, updatedFormData);
      console.log("Update successful:", response.data);

      if (selectedFile) {
        const pictureResponse = await axios.put(`${API_ENDPOINTS.UPDATE_EVENTPICTURE}${id}`, secFormData);
        console.log("Image upload successful:", pictureResponse.data);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };

  const [formErrors, setFormErrors] = useState<FormErrors>({});



  return (
    <Modal
      open={visible}
      onClose={onClose}
      className="backdrop-blur-[4px]"
    >
      <div
        className='bg-white p-4 rounded-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[48rem] relative h-[26rem]'

      >
        <h2 className='text-lg font-bold -mt-4 p-4'>Update Event</h2>

        <div className="grid grid-cols-1 gap-5">
          <div className="relative p-5 -mt-1">
            <p className="font-poppins text-sm font-regular -mt-6">Event Name <span className="text-red-800">*</span></p>
            <input
              type='text'
              placeholder='Enter Text'
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="p-2 w-[20rem] h-[32px] rounded-2xl border-[1.5px] border-black text-[12px]"
            />
            {formErrors.eventName && (
              <p className="text-red-800 text-xs font-poppins">
                {formErrors.eventName}
              </p>
            )}
          </div>

          <div className="relative p-5 -mt-7">
            <p className="font-poppins text-sm font-regular -mt-6">Type of Event<span className="text-red-800">*</span></p>
            <select
              value={formData.eventType}
              onChange={handleTypeofEventChange}
              className="p-2 w-[20rem] h-[32px] rounded-2xl border-[1.5px] border-black text-[12px]"

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
              className="p-2 w-[20rem] h-[60px] rounded-2xl border-[1.5px] border-black resize-none text-[12px]"
            />

            {formErrors.eventDescription && (
              <p className="text-red-800 text-xs font-poppins">
                {formErrors.eventDescription}
              </p>
            )}
          </div>

          <div className="relative p-5 -mt-10">
            <p className="font-poppins text-sm font-regular -mt-5">Department<span className="text-red-800">*</span></p>
            <select
              value={formData.department}
              onChange={handleDepartmentChange}
              className="p-2 w-[20rem] h-[32px] rounded-2xl  border-[1.5px] border-black text-[12px]"

            >
              <option value="CEA">CEA</option>
              <option value="CMBA">CMBA</option>
              <option value="CASE">CASE</option>
              <option value="CNAHS">CNAHS</option>
              <option value="CCS">CCS</option>
              <option value="CCJ">CCJ</option>
              <option value="ALL">ALL</option>
            </select>
          </div>

          <div className="relative p-5 -mt-7">
            <p className="font-poppins text-sm font-regular -mt-6 ">Start Date <span className="text-red-800">*</span></p>
            <div className='relative'></div>
            {formErrors.startDate && (
              <div className="relative  left-0 mt-2">
                <p className=" text-red-800 text-xs font-poppins w-40">
                  {formErrors.startDate}
                </p>
              </div>
            )}
            <div className="relative">
              <input
                type='text'
                placeholder='Select Date and Time'
                value={formData.eventStarts ? `${formData.eventStarts.toLocaleDateString()} ${formData.eventStarts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                readOnly
                className="p-1 w-[9rem] h-[32px] rounded-2xl border-[1.5px] border-black text-[10px]"
              />
              <img
                src="/calendar.png"
                alt="Calendar"
                className="absolute top-0 right-20 m-2 cursor-pointer w-[15px] mr-[30rem]"
                onClick={() => {
                  setShowStartCalendar(!showStartCalendar);
                  setShowEndCalendar(false);
                }}
              />
              {showStartCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <DatePicker
                    inline
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange(date, 'start')}
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="border-[1px] border-black mt-[5px] w-[16rem] font-regular text-[10px] rounded-2xl text-center"
                  />
                </div>
              )}
              {showEndCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <DatePicker
                    inline
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, 'end')}
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="border-[1px] border-black mt-[5px] w-[16rem] font-regular text-[10px] rounded-2xl text-center"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="absolute  p-5 mt-[16.4rem] ml-[11rem]">
            <p className="font-poppins text-sm font-regular -mt-6">End Date <span className="text-red-800">*</span></p>
            {formErrors.endDate && (
              <div className="relative  left-0 mt-2">
                <p className=" text-red-800 text-xs font-poppins w-40">
                  {formErrors.endDate}
                </p>
              </div>
            )}
            <div className="relative">
              <input
                type='text'
                placeholder='Select Date and Time'
                value={formData.eventEnds ? `${formData.eventEnds.toLocaleDateString()} ${formData.eventEnds.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                readOnly
                className="p-1 w-[9rem] h-[32px] rounded-2xl border-[1.5px] border-black text-[10px]"
              />
              <img
                src="/calendar.png"
                alt="Calendar"
                className="relative -top-[2rem] right-[254px] m-2 cursor-pointer w-[15px] ml-[23.5rem]"
                onClick={() => {
                  setShowEndCalendar(!showEndCalendar);
                  setShowStartCalendar(false);
                }}
              />
            </div>
          </div>
        </div>


        <div className=' font-bold -mt-[25rem] ' >
          <Button
            onClick={() => {
              onClose();
              setFormErrors({});
              setShowStartCalendar(false);
              setShowEndCalendar(false);
            }} style={{ color: 'black', fontSize: '25px', marginLeft: '43rem' }}>X</Button>

          <div className="grid grid-cols-1 gap-5">

            <div className="relative p-5 mt-[1rem] ml-[28.5rem] rounded-2xl border-[2px] border-customYellow" style={{ width: '12rem', height: '12rem' }}>
              <div className="relative" style={{ width: '100%', height: '100%' }}>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {formData.eventPicture && (
                  <img
                    src={formData.eventPicture.toString()}
                    alt="Uploaded"
                    className="absolute top-0 left-0 w-full h-full object-cover rounded"
                    style={{ objectFit: 'cover' }}
                  />
                )}

                {!formData.eventPicture && (
                  <div className="absolute top-0 left-0 w-full h-full"></div>
                )}
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  style={{
                    marginTop: '10.5rem',
                    fontSize: '11px',
                    color: 'black',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textTransform: 'none',
                    marginRight: '-1.5rem',
                    outline: 'none'
                  }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Upload Event Picture
                </Button>
              </div>
            </div>
            <div className=' ml-[37rem] h-[2rem] mt-[3rem] bg-customYellow rounded-xl w-[6rem] text-center textcolor-white'>
              <Button style={{ color: 'black', fontWeight: 'bold', fontSize: '14px', outline: 'none' }} onClick={() => { createEventFunction() }} disabled={loading} className={`${loading ? 'text-sm' : 'text-xl'}`}>{loading ? "UPDATING..." : "UPDATE"}</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};



export default UpdateEventModal;