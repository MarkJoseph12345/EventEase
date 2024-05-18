'use client'

import Link from "next/link";

const navLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacypolicy" },
    { name: "Terms and Conditions", href: "/termsandconditions" },
]




const Footer = () => {
    return (
        <div className="mt-4">
            <div className="flex flex-col lg:flex-row lg:px-32 lg:justify-between">
                <div className="flex items-center flex-col mt-4 gap-2">
                    <div className="h-8 w-32 lg:h-8 lg:w-32">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover bg-customYellow" />
                    </div>
                    <div>
                        <p className="font-medium">Get in touch</p>
                    </div>
                    <div className="flex gap-2">
                        <img src="/Facebook.png" alt="Facebook" className="h-8 w-8 object-cover cursor-pointer" />
                        <img src="/Instagram.png" alt="Instagram" className="h-8 w-8 object-cover cursor-pointer" />
                        <img src="/TwitterX.png" alt="X, Formerly Twitter" className="h-8 w-8 object-cover cursor-pointer" />
                    </div>

                    <div>
                        <div className="flex box-border items-center">
                            <img src="/search2.png" alt="Search" className="w-12 h-12 object-cover hover:cursor-pointer" />
                            <input type="text" placeholder="Search" className="h-10 border-2 border-gray-300 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-col mt-4 lg:items-start">
                    <div className="flex flex-col items-center lg:flex-row lg:gap-32">
                        {navLinks.map((link) => {
                            return (
                                <Link href={link.href} key={link.name} className="hover:underline font-bold">
                                    {link.name}
                                </Link>
                            )
                        })}
                    </div>
                    <div className="flex flex-col mt-4 gap-1 ">
                        <div className="flex gap-2 items-center">
                            <img src="/location.png" alt="Location" className="h-5 w-5 object-cover" />
                            <p className="w-52 text-wrap text-center">N. Bacalso-Avenue, Cebu City, Philippines 6000</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <img src="/phone.png" alt="Number" className="h-5 w-5 object-cover" />
                            <p>+12 12 123 2000</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <img src="/letter.png" alt="Email" className="h-5 w-5 object-cover" />
                            <p>eventease.cit.edu</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full border mt-14"></div>
            <p className="flex justify-center">2024  EventEase. All rights reserved</p>
        </div>
    );
}
export default Footer