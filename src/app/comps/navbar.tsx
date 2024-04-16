'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    {name: "Home", href: "/"},
    {name: "About Us", href: "/dashboard"},
    {name: "Login", href: "/login"},
    {name: "Sign Up", href: "/signup"},
]


const NavBar = () => {
    const pathname = usePathname();
    return (
        <div className="bg-customYellow  h-20 p-4">
            <div className="mx-9 items-center flex">
            <div><img src="/logo.png "  alt="Logo" className="h-32 w-40 -mt-10 -ml-10" /></div>
            <div className="justify-end flex flex-1 w-full gap-20 -mt-5 -mr-5">
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