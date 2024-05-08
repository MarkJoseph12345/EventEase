import React, { useState } from 'react';
import AdminSideBar from '../comps/adminSidebar';
import AdminEventCards from '../comps/adminEventCards';

const AdminDashboard = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("In Progress");
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleItemClick = (ItemId: React.SetStateAction<string>) => {
        setActiveItem(ItemId);
        toggleDropdown();
    };
    return (
        <div className='flex gap-1 w-full h-screen '>
            <div className='w-44'>
                <AdminSideBar />
            </div>
            <div className='flex flex-col flex-1 h-full'>
                <div className="flex flex-col  justify-end min-h-[300px] pl-8 -mt-[3rem]">
                    <p className=' absolute ml-3 text-4xl font-bold'>WELCOME, ADMIN!</p>
                    <div >
                    <p className='absolute mt-[.1rem] ml-4 text-sm'>EventEase a portal for discovering and exploring university events.</p>
                    </div>
                </div>
                <div className='absolute flex items-end mr-[20em] justify-center flex-col'>
                    <button className="inline-flex ml-[40rem] mt-[16rem] mb-4 w-[10rem] h-8 gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded={isDropdownOpen} aria-haspopup="true" onClick={toggleDropdown}>
                        <img src="/filter.png" className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className=''>{activeItem}</span>
                        <img src="/dropdown.png" className='text-gray-400' aria-hidden="true" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute  mt-[30rem] z-10 ml-[30rem] w-[10rem] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                <button
                                    className={`${activeItem === "In Progress" ? "bg-gray-200" : "text-gray-900"
                                        } block w-full text-left px-4 py-2 text-sm`}
                                    role="menuitem"
                                    onClick={() => handleItemClick("In Progress")}
                                >
                                    In Progress
                                </button>
                                <button
                                    className={`${activeItem === "Future" ? "bg-gray-200" : "text-gray-900"
                                        } block w-full text-left px-4 py-2 text-sm`}
                                    role="menuitem"
                                    onClick={() => handleItemClick("Future")}
                                >
                                    Future
                                </button>
                                <button
                                    className={`${activeItem === "Past" ? "bg-gray-200" : "text-gray-900"
                                        } block w-full text-left px-4 py-2 text-sm`}
                                    role="menuitem"
                                    onClick={() => handleItemClick("Past")}
                                >
                                    Past
                                </button>
                                <button
                                    className={`${activeItem === "Series" ? "bg-gray-200" : "text-gray-900"
                                        } block w-full text-left px-4 py-2 text-sm`}
                                    role="menuitem"
                                    onClick={() => handleItemClick("Series")}
                                >
                                    Series
                                </button>
                                <button
                                    className={`${activeItem === "All" ? "bg-gray-200" : "text-gray-900"
                                        } block w-full text-left px-4 py-2 text-sm`}
                                    role="menuitem"
                                    onClick={() => handleItemClick("All")}
                                >
                                    All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className='bg-customWhite ml-[2rem] flex-1 mt-[2.6rem]'>
                    <p className='mt-20 ml-10 text-2xl font-bold'>Today's Events!</p>
                    <AdminEventCards />
                </div>
               
            </div>
        </div>
    );
}

export default AdminDashboard;
