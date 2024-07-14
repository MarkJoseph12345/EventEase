"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { role, userid } from "@/utils/data"
import { deleteCookie } from '@/utils/cookies';
import { User } from '@/utils/interfaces';
import { fetchProfilePicture, getUserById } from '@/utils/apiCalls';
import Loading from '../Loader/Loading';

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

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserById(userid);
            setUser(userData);
        };

        const fetchImage = async () => {
            const url = await fetchProfilePicture(userid);
            setImageUrl(url);
        };

        fetchUser();
        fetchImage();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setOpenProfile(false)
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

    const sideBarLinks = role === "ADMIN" ? adminSideBarLinks : studentSideBarLinks;

    if (!user) {
        return (
            <div className="flex items-center bg-customYellow">
                <p className="ml-2 text-4xl font-bold cursor-pointer tracking-widest">≡</p>
                <img src="/logo.png" alt="Logo" className="h-10 w-40 object-cover  ml-4 cursor-pointer tablet:h-16 tablet:w-56" />
            </div>
        )
    }


    return (
        <div className="w-full sticky top-0 z-10">
            <div className="flex items-center bg-customYellow">
                <p className="ml-2 text-4xl font-bold cursor-pointer" onClick={toggleSidebar}>≡</p>
                <img src="/logo.png" alt="Logo" className="h-10 w-40 object-cover  ml-4 cursor-pointer tablet:h-16 tablet:w-56" onClick={handleLogoClick} />
            </div>
            <div className={`min-h-dvh ${isSidebarOpen ? "w-3/4 border-r border-black smartphone:w-72 tablet:w-96" : "w-0"} bg-white fixed inset-0  transition-all duration-100 ease-in-out`} ref={sidebarRef}>
                <div className={`min-h-dvh ${isSidebarOpen ? "block" : "hidden"} `}>
                    <div>
                        <img src="/logo.png" alt="Logo" className="m-3 h-10 w-40 object-cover bg-customYellow cursor-pointer tablet:h-14 tablet:w-44" onClick={handleLogoClick} />
                        <p className=" font-bold absolute top-1 right-4 cursor-pointer tablet:text-3xl" onClick={toggleSidebar}>✖</p>
                    </div>
                    <div className="grid mx-10 gap-5 mt-5 smartphone:w-fit smartphone:mx-auto ">
                        {sideBarLinks.map((link, index) => (
                            <Link href={link.href} key={index} className={`rounded-xl font-bold bg-customYellow flex items-center justify-center py-2 smartphone:py-0 smartphone:px-4 tablet:py-2 tablet:text-xl`} onClick={() => handleClick(link.href)}>
                                {link.imageUrl && <img src={link.imageUrl} alt={link.name} className="h-6 w-6 mr-2" />}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="absolute bottom-0 mx-5 flex items-center gap-2" onClick={() => setOpenProfile(!openProfile)}>
                        <img src={imageUrl || "/defaultpic.png"} className="rounded-full cursor-pointer object-fill w-16 h-16 tablet:h-20 tablet:w-20" />
                        <div className="font-semibold text-lg flex flex-col items-start tablet:text-2xl">
                            <p>{user!.firstName}</p>
                            <p>{user!.lastName}</p>
                        </div>
                    </div>
                    {openProfile && (
                        <div ref={profileRef} className="border border-black w-[90%] bg-white rounded-2xl absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col">
                            <div className="flex items-center gap-3">
                                <div>
                                    <img src={imageUrl || "/defaultpic.png"} className="rounded-full object-fill w-12 h-12 tablet:h-16 tablet:w-16" />
                                </div>
                                <div className="flex flex-col items-start tablet:text-xl">
                                    <p>{user!.firstName} {user!.lastName}</p>
                                    <p className='text-sm text-gray-500 tablet:text-base'>{user!.username}</p>
                                </div>
                            </div>
                            <div className="flex flex-col tablet:text-xl" onClick={() => setOpenProfile(false)}>
                                <Link href="Profile" className="text-start cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1" onClick={() => handleClick("/Profile")}>Profile</Link>
                                <p className="text-start cursor-pointer hover:bg-black hover:text-customYellow indent-3 py-1">Delete Account</p>
                                <p className="text-start cursor-pointer hover:bg-black hover:rounded-b-2xl hover:text-customYellow indent-3 py-1" onClick={() => { deleteCookie("token"); deleteCookie("role"); window.location.href = "/" }}>Sign Out</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;