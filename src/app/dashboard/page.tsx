'use client'

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useState } from "react";

const Dashboard = () => {
    const [isVisible, setIsVisible] = useState(true); 

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    return (
        <div className="max-w-[2000px] mx-auto relative">
            <div className={`fixed left-0 top-0 w-48 h-full bg-customYellow transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            <button className={`bg-black mt-[60px] w-[9rem] h-[32px]  ml-6 -mr-30 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out ${isVisible ? 'w-full' : 'w-0'}`}>
                    <img src="/plusicon.png" alt="Plus Icon" className="w-6 h-6 -ml-2.5" /> 
                    <span className="text-white font-regular  font-poppins text-base ml-[4px]">Create Event</span>
                </button>
            </div>
            <img src="/menuicon.png" alt="Menu Icon" className="absolute left-0 w-21 h-22 p-2 -ml-5 -mt-4 cursor-pointer" onClick={toggleVisibility} />
           
        </div>
    );
};

export default Dashboard;
