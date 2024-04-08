'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    {name: "Home", href: "/"},
    {name: "About Us", href: "/aboutus"},
    {name: "Login", href: "/login"},
    {name: "Sign Up", href: "/signup"},
]


const NavBar = () => {
    const pathname = usePathname();
    return (
        <div className="bg-customYellow p-4">
            <div className="mx-10 items-center flex">
            <div><img src="/logo.png" className="bg-black m-4" /></div>
            <div className="justify-end flex flex-1 w-full gap-32">
               {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                    <Link href={link.href} key={link.name} className={isActive? "font-bold": "font-regular"}>
                        {link.name}
                    </Link>
                )
               })}
            </div>
            </div>
        </div>
    );
}
export default NavBar