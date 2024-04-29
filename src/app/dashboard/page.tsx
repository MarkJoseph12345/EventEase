'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
//import { withAuth } from '../protection';
import CreateEvent from '../createevent/page';

const Dashboard= () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  /* const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    }*/
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleItemClick = (ItemId) => {
    setActiveItem(ItemId);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={`fixed left-0 top-0 w-44 h-full bg-customYellow transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`fixed left-0 top-0 ml-44 w-[1px] h-full bg-customGray transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}></div>
        <button className={`bg-black mt-[80px] w-[7.9rem] h-[32px]  ml-[19px] -mr-30 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out ${isVisible ? 'w-full' : 'w-0'}`} onClick={handleModalOpen}>
          <img src="/plusicon.png" alt="Plus Icon" className="w-6 h-6 -ml-2.5" />
          <span className="text-white font-regular  font-poppins text-sm ml-[3px]">Create Event</span>
        </button>
        <CreateEvent visible={isModalOpen} onClose={handleModalClose} />
        <button className='mt-5 ml-[4rem]'>Home</button>
      </div>
      <img src="/menuicon.png" alt="Menu Icon" className="absolute w-13 h-13 p-2 -ml-5 -mt-4 cursor-pointer" onClick={toggleVisibility} />

      <div className='progress'>
        <div>
          <button className="inline-flex mt-[8rem] ml-[60rem] w-[10rem] h-8 gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded={isDropdownOpen} aria-haspopup="true" onClick={toggleDropdown}>
            <img src="/filter.png" className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className='ml-6'>Options</span>
            <img src="/dropdown.png" className='ml-4 h-6 w-8 -mt-[1px] text-gray-400' aria-hidden="true" />
          </button>
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 ml-[60rem] w-[10rem] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
            <div className="py-1" role="none">
              <a href="#" className={` px-4 py-2 text-xs flex justify-center h-7 w-auto ${activeItem === "In-Progress" ? "bg-customYellow text-black" : "text-gray-700"}`} role="menuitem" id="In-Progress" onClick={() => handleItemClick("In-Progress")}>In Progress</a>
            </div>
            <div className="py-1" role="none">
              <a href="#" className={`px-4 py-2 text-xs flex justify-center  h-7 w-auto ${activeItem === "Future" ? "bg-customYellow text-black" : "text-gray-700"}`} role="menuitem" id="Future" onClick={() => handleItemClick("Future")}>Future</a>
            </div>
            <div className="py-1" role="none">
              <a href="#" className={`px-4 py-2 text-xs flex justify-center  h-7 w-auto ${activeItem === "Series" ? "bg-customYellow text-black" : "text-gray-700"}`} role="menuitem" id="Future" onClick={() => handleItemClick("Series")}>Series</a>
            </div>
            <div className="py-1" role="none">
              <a href="#" className={`px-4 py-2 text-xs flex justify-center h-7 w-auto ${activeItem === "Past" ? "bg-customYellow text-black" : "text-gray-700"}`} role="menuitem" id="Past" onClick={() => handleItemClick("Past")}>Past</a>
            </div>
            <div className="py-1" role="none">
              <a href="#" className={`px-4 py-2 text-xs flex justify-center h-7 w-auto ${activeItem === "All" ? "bg-customYellow text-black" : "text-gray-700"}`} role="menuitem" id="All" onClick={() => handleItemClick("All")}>All</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default /*withAuth  <button onClick={handleLogout}>Log out</button>*/(Dashboard);
