'use client';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';

const CreateEvent = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({ 
    firstName: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal
      open={visible}
      onClose={onClose}
    >
      <div className='bg-white p-4 rounded-3xl mt-20 ml-[20rem] w-[48rem] h-[25rem]'>
        <h2 className='text-lg font-bold -mt-4 p-4'>Create Event</h2>
        <div className="w-[63%] -mt-1">
          <p className="font-poppins text-sm font-regular ml-1 mt-2">First Name<span className="text-red-800">*</span></p>
          <input 
            type='text' 
            placeholder='Enter Text' 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange} 
            className="w-full h-[37px] rounded-2xl border-2 border-black"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/inno.png" alt="Inno Logo" className="w-[20rem] h-[20rem] ml-[30rem]" />
        </div>
        <Button onClick={onClose}>Close modal</Button>
      </div>
    </Modal>
  );
};

export default CreateEvent;
