'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
//import { withAuth } from '../protection';
import CreateEvent from '../createevent/page';


const AdminSideBar = () => {

  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      
      <div className={`fixed  w-44 h-full bg-customYellow transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`fixed ml-44 w-[.5px] h-full bg-customGray transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}></div>
        <img src="/honeyc.png" className=" relative ml-[10.6rem] h-[20rem] w-full -mt-1 " />
        <button style={{ width: '8rem' }} className={`bg-black mt-[80pxaria-hidden="true"] h-[32px] -mt-[15rem]  ml-[19px] -mr-30 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out ${isVisible ? 'w-full' : 'w-0'}`} onClick={handleModalOpen}>
          <img src="/plusicon.png" alt="Plus Icon" className="w-6 h-6 -ml-2.5" />
          <span className="text-white font-regular  font-poppins text-[13px] ml-[3px]">Create Event</span>
        </button>
        <CreateEvent visible={isModalOpen} onClose={handleModalClose} />
        <button className='mt-5 ml-[4rem]'>Home</button>
        <button onClick={() => { handleLogout() }}>Log out</button>
      </div>
      <img src="/menuicon.png" alt="Menu Icon" className="fixed w-13 h-13 p-2 -ml-5 -mt-4 cursor-pointer" onClick={toggleVisibility} />

    </div>
  );
}
export default AdminSideBar;
