'use client';

import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';


const JoinEventModal = ({ visible, onClose }: any) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: any) => {
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
      <div className='bg-white p-4 rounded-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[48rem] relative h-[26rem]'>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <button type="submit" style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <img
              src="/search.png"
              alt="Search"
             className='absolute w-6 ml-[1rem] -mt-[3.5px]'
              onClick={handleSearchSubmit}
            />
          </button>
          <img src='/filter.png' className='absolute mt-4 ml-[19rem]'></img>
          <input
            type="text"
            placeholder="Search events..."
            value={searchValue}
            onChange={handleSearchChange}
            className=' p-3 indent-5 w-[20rem] h-8 border-black border-[1.5px] rounded-2xl mt-4  text-[13px]'
          />
        </form>
        <Button onClick={onClose} style={{ color: 'black', fontSize: '25px', marginLeft: '43rem' , marginTop: '-6rem'}}>
         X
        </Button>
       
      </div>
    </Modal>
  );
};

export default JoinEventModal;