import React, { useEffect, useState } from 'react';
import StudentSideBar from '../comps/studentSidebar';
import StudentEventCards from '../comps/studentEventCards';

const StudentDashboard = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("In Progress");


    const [userName, setUserName] = useState('')

    useEffect(() => {
        const name = window.localStorage.getItem('name');
        if (name) {
            setUserName(name)
        }
    }, []);


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleItemClick = (ItemId: React.SetStateAction<string>) => {
        setActiveItem(ItemId);
        toggleDropdown();
    };

    
    return (
        <div className='flex w-full h-screen 'style={{ overflowY: 'hidden' }}>
            <div className='w-48'>
                <StudentSideBar isOpen={true}/>
                <img src="/honeyc.png" className="fixed w-[20rem] h-[20rem] p-2 ml-[10.4rem] -mt-3 " />
                <img src="/honeyd.png" className="fixed bottom-0 right-0 w-[30rem] h-[30rem] p-2 ml-[10.4rem] -mt-3" />
            </div>
            <div className='flex flex-col w-full'>
                <div className="flex flex-col h-80 pl-8 ">
                    <div className='mt-60 flex flex-col z-[-1]'>
                        <p className='ml-3 text-4xl font-bold'>WELCOME, {userName}!</p>
                        <div >
                            <p className=' ml-4 text-sm'>EventEase a portal for discovering and exploring university events.</p>
                        </div>
                    </div>
                    <div className=' flex items-end justify-center flex-col mr-1 lg:mr-32 z-10'>
                        <button className="cursor-pointer inline-flex ml-[40rem] mb-4 w-[10rem] h-8 gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-black hover:bg-gray-50" id="menu-button" aria-expanded={isDropdownOpen} aria-haspopup="true" onClick={toggleDropdown}>
                            <img src="/filter.png" className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            <span className=''>{activeItem}</span>
                            <img src="/dropdown.png" className='text-gray-400' aria-hidden="true" />
                        </button>
                        {isDropdownOpen && (
                            <div className=" ml-[30rem] w-[10rem] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
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
                </div>
                <div className='bg-customWhite flex-1 mt-[2.6rem]' style={{ overflowY: 'auto' }}>
                    <p className='mt-20 ml-10 text-2xl font-bold'>Today&apos;s Events!</p>
                    <StudentEventCards />
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;