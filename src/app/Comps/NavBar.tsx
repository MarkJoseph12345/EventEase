"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";


const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/AboutUs" },
  { name: "Events", href: "/Events" },
  { name: "Login", href: "/Login" },
  { name: "Sign Up", href: "/SignUp" },
]


const NavBar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = (href: string) => {
    if (pathname === href) {
      window.location.reload();
    }
  };

  const handleLogoClick = () => {
    const pathname = window.location.pathname;
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full sticky top-0 z-20 ">
      {isSidebarOpen && (
        <div className="flex items-center justify-between flex-col bg-white min-h-dvh w-full smartphone:hidden">
          <p className="text-3xl font-bold fixed top-1 right-4" onClick={toggleSidebar}>✖</p>
          <div className="flex flex-col mt-20 items-center gap-20">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.name} className="w-full text-center px-4 font-bold text-2xl h-fit border-black border-2 bg-customYellow" onClick={() => handleClick(link.href)}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className={`flex items-center justify-between bg-customYellow ${isSidebarOpen ? "hidden" : "block"} tablet:h-[4rem]`}>
        <img src="/logo.png" alt="Logo" className="h-10 w-40 object-cover" onClick={() => handleLogoClick()} />
        <p className="mr-4 text-4xl font-bold smartphone:hidden" onClick={toggleSidebar}>≡</p>
        <div className="flex items-center gap-5 mr-5 hidden smartphone:flex tablet:text-xl tablet:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link href={link.href} key={link.name} className={isActive ? "font-bold" : ""}>
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  );
};

export default NavBar;
