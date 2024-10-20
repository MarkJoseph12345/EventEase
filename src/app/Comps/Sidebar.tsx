"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { deleteCookie } from '@/utils/cookies';
import { deleteUser, fetchProfilePicture, me } from '@/utils/apiCalls';
import { User } from '@/utils/interfaces';
import PopUps from '../Modals/PopUps';

const studentSideBarLinks = [
    { name: 'Join Events', imageUrl: "/join.png", href: "/JoinEvents" },
    { name: "Registered Events", href: "/RegisteredEvents" },
    { name: "Events Attended", href: "/AttendedEvents" },
    { name: "QR Code", href: "/QRCode" },
];

const adminSideBarLinks = [
    { name: 'Create Event', imageUrl: "/plusicon.png", href: "/CreateEvent" },
    { name: "Manage Events", href: "/ManageEvents" },
    { name: "Manage Users", href: "/ManageUsers" },
    { name: "Reports And Analysis", href: "/ReportsAndAnalysis" },
];

const Sidebar = () => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await me();
                setUser(userData);
            } catch (error) {

            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            if (user && user.id) {
                try {
                    const url = await fetchProfilePicture(user.id);
                    setImageUrl(url);
                } catch (error) {

                }
            }
        };

        fetchImage();
    }, [user]);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setOpenProfile(false);
    };

    const handleClick = (href: string) => {
        if (pathname === href) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            toggleSidebar();
        }
    };

    const handleLogoClick = () => {
        const pathname = window.location.pathname;
        if (pathname === "/Dashboard") {
            if (isSidebarOpen) {
                window.location.reload();
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else {
            window.location.href = "/Dashboard";
        }
    };

    const profileRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (e: { target: any; }) => {
        if (profileRef.current && !profileRef.current.contains(e.target)) {
            setOpenProfile(false);
        }
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        if (isSidebarOpen || openProfile) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isSidebarOpen, openProfile]);

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
        setOpenProfile(false);
    };

    const handleConfirmDelete = async () => {
        const response = await deleteUser(user!.id!)
        if (response) {
            setShowDeleteConfirmation(false);
            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
            window.location.reload();
        } else {
            setMessage({ text: "Failed to delete account", type: "error" });
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const sideBarLinks = user?.role === "ADMIN" ? adminSideBarLinks : studentSideBarLinks;

    if (!user) {
        return (
            <div className="flex items-center bg-customYellow">
                <p className="ml-2 text-4xl font-bold cursor-pointer">≡</p>
                <img src="/logo.png" alt="Logo" className="h-10 object-cover ml-4 cursor-pointer m-3 " />
            </div>
        );
    }

    return (
        <div className="w-full sticky top-0 z-20">
            <div className="flex items-center bg-customYellow">
                <p className="ml-2 text-4xl font-bold cursor-pointer" onClick={toggleSidebar}>≡</p>
                <img src="/logo.png" alt="Logo" className="h-10 object-cover ml-4 cursor-pointer m-3 " onClick={handleLogoClick} />
            </div>
            <div className={`min-h-dvh ${isSidebarOpen ? "w-3/4 border-r smartphone:w-72 tablet:w-96" : "w-0"} bg-white fixed inset-0 transition-all duration-100 ease-in-out`} ref={sidebarRef}>
                <div className={`min-h-dvh ${isSidebarOpen ? "block" : "hidden"} `}>
                    <div>
                        <img src="/logo.png" alt="Logo" className="m-3 object-cover cursor-pointer" onClick={handleLogoClick} />
                        <p className="font-semibold absolute top-1 right-4 cursor-pointer tablet:text-3xl" onClick={toggleSidebar}>✖</p>
                    </div>
                    <div className="grid mx-10 gap-5 mt-10 smartphone:w-fit smartphone:mx-auto ">
                        {sideBarLinks.map((link, index) => (
                            <Link href={link.href} key={index} className={`rounded-xl font-regular font-poppins bg-customYellow flex items-center justify-center py-2 smartphone:py-0 smartphone:px-4 tablet:py-2 tablet:text-xl`} onClick={() => handleClick(link.href)}>
                                {link.imageUrl && <img src={link.imageUrl} alt={link.name} className="h-6 w-6 mr-2" />}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="absolute bottom-0 mx-5 flex items-center gap-2" onClick={() => setOpenProfile(!openProfile)}>
                        <img src={imageUrl || "/defaultpic.png"} className="rounded-full cursor-pointer object-fill ml-2 mb-5 w-10 h-10 tablet:h-16 tablet:w-16" />
                        <div className="font-regular font-bebas mb-4 text-lg flex flex-col items-start tablet:text-2xl">
                            <p className='cursor-pointer'>{user!.firstName} {user!.lastName}</p>
                        </div>
                    </div>
                    {openProfile && (
                        <div ref={profileRef} className="border mb-5 border-black w-[90%] bg-white rounded-2xl absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col">
                            <div className="flex items-center gap-3">
                                <div>
                                    <img src={imageUrl || "/defaultpic.png"} className="rounded-full object-fill ml-2 mt-2 w-10 h-10 tablet:h-16 tablet:w-16" />
                                </div>
                                <div className="flex flex-col items-start tablet:text-xl">
                                    <p>{user!.firstName} {user!.lastName}</p>
                                    <p className='text-sm text-gray-500 tablet:text-base'>{user!.username}</p>
                                </div>
                            </div>
                            <div className="flex flex-col tablet:text-xl" onClick={() => setOpenProfile(false)}>
                                <Link href="Profile" className="text-start cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1" onClick={() => handleClick("/Profile")}>Profile</Link>
                                <p className={`text-start cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1 ${user.role === "ADMIN" ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={user.role === "ADMIN" ? undefined : handleDeleteClick}>Delete Account</p>
                                <p className="text-start cursor-pointer hover:rounded-b-2xl hover:bg-black hover:text-customYellow indent-3 py-1" onClick={() => { deleteCookie("token"); window.location.href = "/" }}>Sign Out</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-customYellow border-2">
                        <p className="mb-4">Are you sure you want to delete the account?</p>
                        <div className="flex justify-center space-x-2">
                            <button
                                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                                onClick={handleConfirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-yellow rounded hover:bg-black-400"
                                onClick={handleCancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-black border-[2px]">
                        <p className="my-4 font-poppins text-[18px] font-regular text-customYellow ">Account Successfully Deleted!</p>
                    </div>
                </div>
            )}
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div>
    )
}

export default Sidebar;