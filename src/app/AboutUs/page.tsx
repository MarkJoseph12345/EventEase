"use client"

import NavBar from "../Comps/NavBar";

const AboutUs = () => {
    return (
        <div>
            <NavBar/>
            <div className="flex flex-col items-center gap pt-2 mt-[3rem]">
                <p className="text-2xl mt-10 font-poppins font-bold mr-[11rem] laptop:text-center">Learn More About</p>
                <img src="/logo.png" alt="Logo" className="bg-customYellow h-10 w-40 object-cover -mt-[2.3rem]  ml-[14rem]" />
            <div className="flex flex-col items-center gap pt-2 mt-[2rem]">
                <p className="text-2xl text-customYellow mt-10 font-poppins font-bold laptop:text-center">About Us</p>
                <p className=" mt-2 text-sm font-poppins font-light laptop:text-center px-[10rem]">
                Welcome to EventEase! We&#39;re here to transform events within our university&#39;s Wildcats Innovation Labs. 
                Our goal is to assist organizers and participants in meeting their needs to create unforgettable events effortlessly. 
                With a commitment to simplicity and innovation, we&#39;re dedicated to ensuring event planning is effortless and enjoyable for all involved.
                </p>
            </div>
            <div className="flex flex-col items-center gap pt-2 mt-[5rem]">
                <p className="text-2xl text-customYellow mt-10 font-poppins font-bold laptop:text-center">Mission</p>
                <p className=" mt-2 text-sm font-poppins font-light laptop:text-center px-[10rem]">
                Our mission is to significantly reduce the time, effort, and coordination required for event management, 
                thereby enhancing the overall experience for both event organizers and participants. We aim to provide a 
                comprehensive event management platform that handles everything from participant registration, attendance tracking, scheduling, and feedback collection, making the process more efficient and less challenging. 
                </p>
            </div>
            <div className="flex flex-col items-center gap pt-2 mt-[5rem]">
                <p className="text-2xl text-customYellow mt-10 font-poppins font-bold laptop:text-center">Vision</p>
                <p className=" mt-2 text-sm font-poppins font-light laptop:text-center px-[10rem]">
                Our vision is to become the go-to tool for planning events at Wildcats Innovation Labs. 
                We imagine a future where everyone - organizers and participants alike - can use our easy-to-use system to streamline event planning. 
                This saves valuable time, allowing everyone to focus on what truly matters: teamwork, learning, and sharing brilliant ideas. 
                By making events engaging and accessible, EventEase aims to empower the Wildcat community to develop new skills and drive innovation for years to come.
                </p>
            </div>
            <div className="flex flex-col items-center gap pt-2 mt-[5rem]">
                <p className="text-2xl text-customYellow mt-10 font-poppins font-bold laptop:text-center">Meet Our TEAM</p>
            </div>
            <div className="-mt-10">
                <div className="min-h-10 rounded-xl mt-[5.5rem] mr-[70rem] border-2 p-2 bg-White w-[15rem] h-[20.5rem] mx-auto flex flex-col gap-5 ">
                    <img src="/boy.png" alt="Member1" className=" rounded-sm mt-5 ml-5 w-[11rem] h-[11rem]" />
                    <p className="font-poppins font-medium text-center">Member 1</p>
                    <p className="font-poppins font-light text-center text-sm -mt-5">Add Title</p>
                    <div className=" mt-4  w-[15rem] h-[20rem] mx-auto flex flex-col gap-5">
                        <img src="/Facebook.png" alt="facebook" className="w-7 -mt-4 ml-[3rem] object-cover cursor-pointer"></img>
                        <img src="/instagram.png" alt="instagram" className="w-9 -mt-12 ml-[6rem] object-cover cursor-pointer"></img>
                        <img src="/TwitterX.png" alt="twitter" className="w-11 -mt-12 ml-[9rem] object-cover cursor-pointer"></img>
                    </div> 
                </div>
                <div className="min-h-10 rounded-xl -mt-[20.5rem] mr-[52.5rem] border-2 p-2 bg-White w-[15rem] h-[20.5rem] mx-auto flex flex-col gap-5 ">
                    <img src="/boy.png" alt="Member2" className=" rounded-sm mt-5 ml-5 w-[11rem] h-[11rem]" />
                    <p className="font-poppins font-medium text-center">Member 2</p>
                    <p className="font-poppins font-light text-center text-sm -mt-5">Add Title</p>
                    <div className=" mt-4  w-[15rem] h-[20rem] mx-auto flex flex-col gap-5">
                        <img src="/Facebook.png" alt="facebook" className="w-7 -mt-4 ml-[3rem] object-cover cursor-pointer"></img>
                        <img src="/instagram.png" alt="instagram" className="w-9 -mt-12 ml-[6rem] object-cover cursor-pointer"></img>
                        <img src="/TwitterX.png" alt="twitter" className="w-11 -mt-12 ml-[9rem] object-cover cursor-pointer"></img>
                    </div> 
                </div>
                <div className="min-h-10 rounded-xl -mt-[20.5rem] border-2 p-2 bg-White w-[15rem] h-[20.5rem] mx-auto flex flex-col gap-5 ">
                    <img src="/boy.png" alt="Member3" className=" rounded-sm mt-5 ml-5 w-[11rem] h-[11rem]" />
                    <p className="font-poppins font-medium text-center">Member 3</p>
                    <p className="font-poppins font-light text-center text-sm -mt-5">Add Title</p>
                    <div className=" mt-4  w-[15rem] h-[20rem] mx-auto flex flex-col gap-5">
                        <img src="/Facebook.png" alt="facebook" className="w-7 -mt-4 ml-[3rem] object-cover cursor-pointer"></img>
                        <img src="/instagram.png" alt="instagram" className="w-9 -mt-12 ml-[6rem] object-cover cursor-pointer"></img>
                        <img src="/TwitterX.png" alt="twitter" className="w-11 -mt-12 ml-[9rem] object-cover cursor-pointer"></img>
                    </div> 
                </div>
                <div className="min-h-10 rounded-xl -mt-[20.5rem] mr-[17.5rem] border-2 p-2 bg-White w-[15rem] h-[20.5rem] mx-auto flex flex-col gap-5 ">
                    <img src="/girl.png" alt="Member4" className=" rounded-sm mt-5 ml-5 w-[11rem] h-[11rem]" />
                    <p className="font-poppins font-medium text-center">Member 4</p>
                    <p className="font-poppins font-light text-center text-sm -mt-5">Add Title</p>
                    <div className=" mt-4  w-[15rem] h-[20rem] mx-auto flex flex-col gap-5">
                        <img src="/Facebook.png" alt="facebook" className="w-7 -mt-4 ml-[3rem] object-cover cursor-pointer"></img>
                        <img src="/instagram.png" alt="instagram" className="w-9 -mt-12 ml-[6rem] object-cover cursor-pointer"></img>
                        <img src="/TwitterX.png" alt="twitter" className="w-11 -mt-12 ml-[9rem] object-cover cursor-pointer"></img>
                    </div> 
                </div>
                <div className="min-h-10 rounded-xl -mt-[20.5rem] mr-0 border-2 p-2 bg-White w-[15rem] h-[20.5rem] mx-auto flex flex-col gap-5 ">
                    <img src="/girl.png" alt="Member5" className=" rounded-sm mt-5 ml-5 w-[11rem] h-[11rem]" />
                    <p className="font-poppins font-medium text-center">Member 5</p>
                    <p className="font-poppins font-light text-center text-sm -mt-5">Add Title</p>
                    <div className=" mt-4  w-[15rem] h-[20rem] mx-auto flex flex-col gap-5">
                        <img src="/Facebook.png" alt="facebook" className="w-7 -mt-4 ml-[3rem] object-cover cursor-pointer"></img>
                        <img src="/instagram.png" alt="instagram" className="w-9 -mt-12 ml-[6rem] object-cover cursor-pointer"></img>
                        <img src="/TwitterX.png" alt="twitter" className="w-11 -mt-12 ml-[9rem] object-cover cursor-pointer"></img>
                    </div> 
                </div>
            </div>
            <div className="w-full border-t mt-16">
                <p className="font-poppins font-light text-sm text-center">2024 EventEase. All rights reserved</p>
            </div>
            </div> 
        </div>
    )
}

export default AboutUs;
