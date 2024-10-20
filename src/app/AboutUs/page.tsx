"use client"

import NavBar from "../Comps/NavBar";

const AboutUs = () => {
    return (
        <div>
            <NavBar />
            <div className="flex flex-col items-center gap-5 mx-[1rem] laptop:mx-[10rem] pt-2 laptop:mt-[3rem]">
                <div className="mt-10 flex items-center gap-2">
                <p className="tablet:text-4xl text-2xl font-poppins font-bold laptop:text-center">Learn More About</p>
                <img src="/logo.png" alt="Logo" className="bg-customYellow h-14 w-48 object-scale-down" />
                </div>
                <div className="bg-customYellow bg-opacity-20 max-w-[90rem] mx-auto tablet:my-16 p-5 flex flex-col items-center p-10 gap-10 rounded-2xl">
                    <p className="text-customYellow tablet:text-4xl text-2xl font-extrabold">About Us</p>
                    <p className="text-center  text-lg ">Welcome to EventEase! We&#39;re here to transform events within our university&#39;s Wildcats Innovation Labs. Our goal is to assist organizers and participants in meeting their needs to create unforgettable events effortlessly. With a commitment to simplicity and innovation, we&#39;re dedicated to ensuring event planning is effortless and enjoyable for all involved.</p>
                </div>
                <div className="bg-customYellow bg-opacity-20 max-w-[90rem] mx-auto tablet:my-16 p-5 flex flex-col items-center p-10 gap-10 rounded-2xl">
                    <p className="text-customYellow tablet:text-4xl text-2xl font-extrabold">Mission</p>
                    <p className="text-center text-xl">Our mission is to significantly reduce the time, effort, and coordination required for event management, thereby enhancing the overall experience for both event organizers and participants. We aim to provide a comprehensive event management platform that handles everything from participant registration, attendance tracking, scheduling, and feedback collection, making the process more efficient and less challenging.</p>
                </div>
                <div className="bg-customYellow bg-opacity-20 max-w-[90rem] mx-auto tablet:my-16 p-5 flex flex-col items-center p-10 gap-10 rounded-2xl">
                    <p className="text-customYellow tablet:text-4xl text-2xl font-extrabold">Vision</p>
                    <p className="text-center text-xl">Our vision is to become the go-to tool for planning events at Wildcats Innovation Labs. We imagine a future where everyone - organizers and participants alike - can use our easy-to-use system to streamline event planning. This saves valuable time, allowing everyone to focus on what truly matters: teamwork, learning, and sharing brilliant ideas. By making events engaging and accessible, EventEase aims to empower the Wildcat community to develop new skills and drive innovation for years to come.</p>
                </div>
            </div>
            <div className="w-full border-t mt-16">
                <p className="font-poppins font-light text-sm text-center">2024 EventEase. All rights reserved</p>
            </div>
        </div>
    )
}

export default AboutUs;
