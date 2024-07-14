"use client"

import Link from "next/link";


const footerLinks = [
  { name: "Privacy Policy", href: "/PrivacyPolicy" },
  { name: "Terms and Conditions", href: "/TermsAndConditions" },
]


const Footer = () => {
  return (
    <div>
      <div className="mt-4 mx-4 laptop:flex laptop:gap-10 laptop:text-wrap desktop:justify-center">
        <div className="w-5/6 laptop:w-auto">
          <img src="/logo.png" className="bg-customYellow h-10 w-32 object-cover" />
          <p className="my-4 font-poppins text-lg font-bold laptop:w-80 laptop:text-pretty">Event Tracking Platform for Wildcat Innovation Labs</p>
          <div className="flex gap-2">
            <img src="/Facebook.png" alt="Facebook" className="h-8 w-8 object-cover cursor-pointer" />
            <img src="/Instagram.png" alt="Instagram" className="h-8 w-8 object-cover cursor-pointer" />
            <img src="/TwitterX.png" alt="X, Formerly Twitter" className="h-8 w-8 object-cover cursor-pointer" />
          </div>
        </div>
        <div className="w-full border-t my-4 laptop:w-0 laptop:min-h-full  laptop:border-t-0 laptop:border-r" />
        <div>
          <p className="font-bold font-poppins">Contact Us</p>
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
        <div>
          <p className="font-bold mt-4">Other Links</p>
          <div className="flex flex-col mt-3">
            {footerLinks.map((link) => (
              <Link href={link.href} key={link.name} className="font-bold underline decoration-2 text-blue-500">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full border-t mt-4" />
      <p className="text-center">2024  EventEase. All rights reserved</p>
    </div>
  );
};

export default Footer;
