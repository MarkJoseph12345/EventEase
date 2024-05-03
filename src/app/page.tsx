import Footer from "./comps/footer";
import HomePageCard from "./comps/hompageCards";
import NavBar from "./comps/navbar";
const Home = () => {

  return (
    <div className="max-w-[2000px] mx-auto">
      <NavBar />
      <img src="/wil4.png" className="h-[40vh] w-full max-w-full" />
      <div className="mx-[3%] my-[1%]">
        <p className="font-poppins font-bold mt-8 text-xl">Latest Events!</p>
        <div className="my-[1%] py-[3%] grid justify-center border p-10 rounded-3xl relative lg:flex lg:justify-between">
          <div className="w-[250px] h-[250px] bg-customYellow rounded-lg">
            Image
          </div>
          <div className="py-16 gap-6 flex flex-col items-center lg:items-start">
          <div className="flex items-center">
              <div>
                <img src="/groupicon.png" />
              </div>
              <div className="-mt-5">
                <span className="text-customRed text-5xl font-bold">35+</span>
                <p className="font-semibold">Attendees</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="border rounded-3xl text-customYellow bg-black px-6 py-1">Join Now!</button>
              <span className="border-2 rounded-3xl border-customYellow px-6 py-1">Open To All</span>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col">
              <p className="font-semibold text-2xl">Happening this week</p>
              <div>
                &lt; dates &gt;
              </div>
              <div>
                Map para current events
              </div>
            </div>
            <span className="-mt-20 bg-customYellow rounded-full text-5xl w-16 h-16 items-center justify-center font-bold lg:flex hidden">!!</span>
          </div>
        </div>
      </div>
      <div className="mx-[3%] my-[3%]">
        <p className="font-poppins">Discover More Events</p>
        <div className=" my-[1%]">
          <HomePageCard/>
        </div>
      </div>
      <div className="relative">
        <img src="/discover.png" className="w-full" alt="Discover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white px-4 py-2 rounded-lg mt-[5%] flex gap-10 text-2xl ">
          <button className="bg-black text-customYellow w-[200px] rounded">Join</button>
          <div className="box-border bg-gradient-to-r from-black to-customYellow w-[200px] h-[50px] p-[3px] rounded">
            <button className="bg-white text-customYellow w-full h-full rounded">EXPLORE</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Home;