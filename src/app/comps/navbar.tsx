'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutus" },
    { name: "Events", href: "/events" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
]


const NavBar = () => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
    
    return (
        <div className="bg-customYellow h-20 p-4">
            <div className="mx-9 items-center flex">
                <div><img src="/logo.png " alt="Logo" className="h-32 w-40 -mt-10 -ml-10" /></div>
                <div className="justify-end items-center flex flex-1 w-full gap-20 -mt-10 -mr-5 hidden lg:flex">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link href={link.href} key={link.name} className={isActive ? "font-bold" : "font-regular"}>
                                {link.name}
                            </Link>
                        )
                    })}
                </div>
                <div className="justify-end items-center flex flex-1 w-full gap-20 -mt-10 -mr-5 lg:hidden">
                    <img src="/menuicon.png" onClick={toggleSidebar} />
                </div>
            </div>
            {isSidebarOpen && (
                <div className="fixed z-10 top-0 right-0 bottom-0 bg-gray-200 w-64 px-4 lg:hidden">
                    <img src="/menuicon.png" onClick={toggleSidebar} />
                    <div className="flex flex-col">
                        {navLinks.map((link) => (
                            <Link href={link.href} key={link.name} className="py-2">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
export default NavBar
