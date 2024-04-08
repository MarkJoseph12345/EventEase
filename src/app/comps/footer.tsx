'use client'

import Link from "next/link";

const navLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Event Calendar", href: "/eventcalendar" },
    { name: "Privacy Policy", href: "/privacypolicy" },
    { name: "Terms and Conditions", href: "/termsandconditions" },
]


const Footer = () => {
    return (
        <div>
            <div className="pt-32 gap-32 flex flex-col">
                <div className="justify-end px-32 flex flex-1 w-full gap-64">
                    {navLinks.map((link) => {
                        return (
                            <Link href={link.href} key={link.name}>
                                {link.name}
                            </Link>
                        )
                    })}
                </div>
                <div className="w-full border"></div>
            </div>
            <p className="flex justify-center">2024  EventEase. All rights reserved</p>
        </div>
    );
}
export default Footer