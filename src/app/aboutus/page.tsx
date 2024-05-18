import NavBar from "../comps/navbar";

const Aboutus = () => {
    return (
        <div className="max-w-[2000px] mx-auto">
            <NavBar />
            <div className="relative">
                <div className="flex justify-start mt-8">
                    <img src="honeyc.png" className="w-[15rem] h-80 md:w-96 md:h-96 mx-auto -mt-8 -ml-[.5rem]" alt="Honeycomb" />
                </div>
                <div className="flex flex-col items-center -mt-[10rem]">
                    <h1 className="font-extrabold text-4xl -ml-[10rem] -mt-[4rem]">Learn More About</h1>
                    <div className="w-44 h-10 bg-customYellow -mt-9 ml-[24rem]"></div>
                    <img src="logo.png" className="w-40 -mt-[6.3rem] ml-[24rem]" alt="Logo" />
                </div>
                <h1 className="font-bold text-3xl text-customYellow text-center mt-8">About Us</h1>
                <p className="text-center font-regular mt-6 px-4 max-w-3xl mx-auto">
                    Welcome to EventEase! We&apos;re dedicated to revolutionizing event planning within our campus community. 
                    Our team is committed to providing students, faculty, and staff with the tools they need to create unforgettable events effortlessly. 
                    With a focus on simplicity and innovation, we&apos;re here to make event planning an enjoyable experience for everyone.
                </p>
                <h1 className="font-bold text-3xl text-customYellow text-center mt-[7rem]">What We Offer</h1>
                <div className="relative flex justify-center mt-8">
                    <img src="honey3.png" className="w-96 absolute -top-[30rem] -right-0.5" alt="Honeycomb" />
                    <img src="easy.png" className="w-[35rem] mt-9 ml-[45rem] " alt="Easy Event Registration" />
                </div>
                <h2 className="font-bold text-left indent-[10rem] -mt-[7rem]">Easy Event Registration</h2>
                <p className="text-left font-regular ml-[9rem] text-sm mt-4 px-4 max-w-[30rem] mx-[8rem] mr-[18rem]">
                    Say goodbye to complex registration processes. With EventEase, registering for events is effortless. 
                    Simply sign up, browse events, and register with just a few clicks.
                </p>
                <h1 className="font-bold text-3xl text-customYellow text-center mt-[10rem]">What We Do</h1>
                <p className="text-center font-regular text-sm mt-6 px-4 max-w-3xl mx-auto">
                    EventEase is your one-stop solution for event planning. We offer a user-friendly platform designed to meet the unique needs of students, faculty, and staff. 
                    From easy registration to streamlined event creation and seamless guest management, our platform provides everything you need to organize successful events. 
                    Join us and discover the convenience of stress-free event coordination tailored specifically to campus life.
                </p>
                <h1 className="font-bold text-3xl text-customYellow text-center mt-[12rem]">Meet Our TEAM</h1>
                <img src="honey3.png" className="w-96 -mt-[11rem] rotate-180 mx-auto ml-[.5rem]" alt="Honeycomb" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 -mt-[10rem]">
                    <div className="flex flex-col items-center border p-10 rounded-3xl w-[20rem] h-[22rem] ml-[8rem]">
                        <img src="person.png" className="object-cover rounded-2xl w-40 h-40" alt="Team Member1" />
                        <p className="text-center mt-4">John Doe</p>
                    </div>
                    <div className="flex flex-col items-center border p-10 rounded-3xl w-[20rem] h-[22rem] ml-[5.5rem]">
                        <img src="person.png" className="object-cover rounded-2xl w-40 h-40" alt="Team Member2" />
                        <p className="text-center mt-4">John Doe</p>
                    </div>
                    <div className="flex flex-col items-center border p-10 rounded-3xl w-[20rem] h-[22rem] ml-[3.5rem]">
                        <img src="person.png" className="object-cover rounded-2xl w-40 h-40" alt="Team Member3" />
                        <p className="text-center mt-4">John Doe</p>
                    </div>
                    <div className="flex flex-col items-center border p-10 rounded-3xl w-[20rem] h-[22rem] ml-[23rem] mt-[5rem]">
                        <img src="person.png" className="object-cover rounded-2xl w-40 h-40" alt="Team Member4" />
                        <p className="text-center mt-4">John Doe</p>
                    </div>
                    <div className="flex flex-col items-center border p-10 rounded-3xl w-[20rem] h-[22rem] ml-[21rem] mt-[5rem]">
                        <img src="person.png" className="object-cover rounded-2xl w-40 h-40" alt="Team Member5" />
                        <p className="text-center mt-4">John Doe</p>
                    </div>
                </div>
                <div className="relative mt-8">
                    <img src="honey3.png" className="w-96 rotate-90 absolute -top-[30rem] -right-[16rem]" alt="Honeycomb" />
                    <h1 className="font-bold text-2xl text-customYellow text-center mt-[10rem]">Testimonials</h1>
                    <p className="text-center text-sm mt-4 px-4 max-w-3xl mx-auto">See what our users love about EventEase – real stories, real impact.</p>
                </div>
                <div className="w-full border-t mt-[30rem]"></div>
                <p className="flex justify-center font-light text-sm mt-4">2024 EventEase. All rights reserved</p>
            </div>
        </div>
    );
}
export default Aboutus;
