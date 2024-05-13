import NavBar from "../comps/navbar";

const Aboutus = () => {

    return (
        <div className="max-w-[2000px] mx-auto">
            <NavBar />
                <img src="honeyc.png" className="absolute w-[16rem] h-[20rem] -ml-3"></img>
                <h1 className=" absolute font-extrabold ml-[26rem] mt-[8rem] text-[31px]">Learn More About </h1>
                <div className="absolute ml-[44rem] mt-[8rem] w-[11rem] h-[2.5rem] bg-customYellow"></div>
                <img src="logo.png" className="absolute w-[10rem] ml-[44.5rem] mt-[4.2rem] "></img>
            
                <h1 className=" absolute font-bold ml-[35rem] mt-[13rem] text-[26px] text-customYellow text-center">About Us </h1>
                <p className="ml-[39rem]  mt-[16rem] mr-[1rem]  left-1/2 transform -translate-x-1/2 text-center font-regular"> Welcome to EventEase! We're dedicated to revolutionizing event planning within our campus community. 
                    Our team is committed to providing students, faculty, and staff with the tools they need to create unforgettable events effortlessly. 
                    With a focus on simplicity and innovation, we're here to make event planning an enjoyable experience for everyone.
                </p>

                <h1 className=" absolute font-bold ml-[33rem] mt-[3rem] text-[26px] text-customYellow text-center">What We Offer </h1>
                <img src="honey3.png" className="absolute  ml-[57rem] -mt-[15rem] w-[23rem]"></img>
                <img src="easy.png" className="absolute  ml-[45rem] mt-[10rem] w-[25rem] "></img>
                <h2 className=" ml-[10rem] mt-[10rem] font-bold "> Easy Event Registration</h2>
                <p className="ml-[20rem]  mt-[1rem] mr-[30rem]  left-1/2 transform -translate-x-1/2 font-regular text-[14px]"> Say goodbye to complex registration processes.
                 With EventEase, registering for events is effortless. Simply sign up, browse events, and register with just a few clicks.
                </p>

                <h1 className=" absolute font-bold ml-[34rem] mt-[6rem] text-[26px] text-customYellow text-center">What We Do </h1>
                <p className="ml-[39rem]  mt-[9rem] -mr-[1rem]  left-1/2 transform -translate-x-1/2 text-center font-regular text-[14px]">EventEase is your one-stop solution for event planning. 
                We offer a user-friendly platform designed to meet the unique needs of students, faculty, and staff. 
                From easy registration to streamlined event creation and seamless guest management, our platform provides everything you need to organize successful events. 
                Join us and discover the convenience of stress-free event coordination tailored specifically to campus life.
                </p>

                <h1 className=" absolute font-bold ml-[33rem] mt-[10rem] text-[26px] text-customYellow text-center">Meet Our TEAM </h1>
                <img src="honey3.png" className="absolute -m-[1rem] mt-[3rem] w-[23rem] rotate-180"></img>

                <div className=" absolute my-[1%] py-[3%] grid justify-center border p-10 rounded-3xl w-[20rem] h-[20rem] mt-[20.2rem] ml-[6rem] ">
                <img src="person.png" className="object-cover rounded-2xl w-[10rem] h-[10rem]" />
                <p className="text-center">John Doe</p>
                </div>

                <div className="my-[1%] py-[3%] grid justify-center border p-10 rounded-3xl w-[20rem] h-[20rem] mt-[20rem] ml-[29.5rem] ">
                <img src="person.png" className="object-cover rounded-2xl w-[10rem] h-[10rem]" />
                <p className="text-center">John Doe</p>
                </div>
              
                <div className="my-[1%] py-[3%] grid justify-center border p-10 rounded-3xl w-[20rem] h-[20rem] -mt-[20.8rem] ml-[53rem] ">
                <img src="person.png" className="object-cover rounded-2xl w-[10rem] h-[10rem]" />
                <p className="text-center">John Doe</p>
                </div>

                <div className="my-[1%] py-[3%] grid justify-center border p-10 rounded-3xl w-[20rem] h-[20rem] mt-[3rem] ml-[41rem] ">
                <img src="person.png" className="object-cover rounded-2xl w-[10rem] h-[10rem]" />
                <p className="text-center">John Doe</p>
                </div>

                <div className="my-[1%] py-[3%] grid justify-center border p-10 rounded-3xl w-[20rem] h-[20rem] -mt-[20.6rem] ml-[17.5rem] ">
                <img src="person.png" className="object-cover rounded-2xl w-[10rem] h-[10rem]" />
                <p className="text-center">John Doe</p>
                </div>

                <img src="honey3.png" className="absolute ml-[71rem] -mt-[17rem] w-[23rem] rotate-90"></img>
                <div className="mt-[3rem]">
                <h1 className=" absolute font-bold ml-[33rem] mt-[10rem] text-[26px] text-customYellow text-center">Testimonials</h1>
                <p className=" absolute text-center mt-[12rem] ml-[23rem] text-[14px]">See what our users love about EventEase – real stories, real impact.</p>
                </div>

                <div className="w-full border mt-[35rem]"></div>
                <p className="flex justify-center font-light text-[13px]">2024  EventEase. All rights reserved</p>
        </div>
    );
}
export default Aboutus;
