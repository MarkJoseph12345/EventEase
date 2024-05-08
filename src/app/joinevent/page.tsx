'use client';

import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';


const JoinEventModal = ({ visible, onClose }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchValue);
    
  };

  return (
    <Modal
      open={visible}
      onClose={onClose}
      aria-labelledby="join-event-modal-title"
      aria-describedby="join-event-modal-description"
    >
      <div className='bg-white p-4 rounded-3xl mt-20 ml-[20rem] w-[48rem] h-[26.5rem] relative'>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <button type="submit" style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <img
              src="/search.png"
              alt="Search"
             className='absolute w-6 ml-[18.6rem] -mt-[4px]'
              onClick={handleSearchSubmit}
            />
          </button>
          <input
            type="text"
            placeholder="Search events..."
            value={searchValue}
            onChange={handleSearchChange}
            className=' p-2 w-[20rem] h-8 border-black border-[1.5px] rounded-2xl mt-4  text-[13px]'
          />
        </form>
        <Button onClick={onClose} style={{ color: 'black', fontSize: '25px', marginLeft: '43rem', marginTop: '-5rem' }}>
         X
        </Button>
        <div className='ml-[37rem] h-[2rem] mt-[17rem] bg-customYellow rounded-xl w-[6rem] text-center textcolor-white'>
              <Button style={{ color: 'black', fontWeight: 'bold', fontSize: '14px', outline: 'none' }} >JOIN</Button>
            </div>
      </div>
    </Modal>
  );
};

export default JoinEventModal;