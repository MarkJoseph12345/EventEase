import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import JoinEvent from './JoinEvent';
import Link from 'next/link';
import axios from 'axios';
import { API_ENDPOINTS } from '../api';

interface User {
  name: string;
  username: string;
  firstName: string;
}

const StudentSideBar = ({ isOpen = true }) => {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);


  useEffect(() => {
    const userid = window.localStorage.getItem('userid');

    const fetchUserById = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_USER_BY_ID + userid);

        const { name, ...userData } = response.data;
        const lastSpaceIndex = name.lastIndexOf(' ');
        const firstName = name.substring(0, lastSpaceIndex);
        const lastName = name.substring(lastSpaceIndex + 1);

        setUser({ ...userData, name, firstName, lastName });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserById();
  }, []);


  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  const profileClicked = () => {
    setOpenProfile(!openProfile)
  }

  const profileRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (e: { target: any; }) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setOpenProfile(false);
    }
  };

  useEffect(() => {
    if (openProfile) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [openProfile]);

  return (
    <div>
      <div className={`fixed w-[13rem] h-full bg-customYellow transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
      <img src="/honeyc.png" className="fixed w-[35rem] h-[20rem] p-2 ml-[12.4rem] -mt-3 " />
        <div className={`fixed ml-44 w-[px] h-full bg-customGray transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}></div>
        <button style={{ width: '9rem' }} className={`bg-black mt-[80px] h-[32px]  ml-[30px] -mr-30 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out ${isVisible ? 'w-full' : 'w-0'}`} onClick={handleModalOpen}>
          <img src="/join.png" alt="Plus Icon" className="w-5 h-5 -ml-4.5" />
          <span className="text-white font-regular  font-poppins text-[13px] ml-[8px]">Join Event</span>
        </button>
        <JoinEvent visible={isModalOpen} onClose={handleModalClose} />
        <Link href="/dashboard" className='mt-5 ml-[4.5rem]'>Home</Link>
        <p onClick={profileClicked} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center w-full font-bold text-sm cursor-pointer"><img src="defaultpic.png" className="w-19 h-19" />{user?.name}</p>
        {openProfile && (
          <div ref={profileRef} className='w-[90%] bg-white rounded absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col'>
            <div className='flex items-center'>
              <div>
                <img src="defaultpic.png" className="w-12 h-12" />
              </div>
              <div className="flex flex-col items-center">
                <p>{user?.firstName}</p>
                <p className='text-sm'>Email</p>
              </div>
            </div>
            <div className='flex flex-col'>
              <Link href="profile" className="cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1">Profile</Link>
              <p className="cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1">Delete Account</p>
              <p className="cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1" onClick={handleLogout}>Sign Out</p>
            </div>
          </div>
        )}
      </div>
      <img src="/menuicon.png" alt="Menu Icon" className="fixed w-13 h-13 p-2 -ml-5 -mt-4 cursor-pointer" onClick={toggleVisibility} />
    </div>
  );
};

export default StudentSideBar;
