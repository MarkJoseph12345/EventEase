import Footer from "./comps/footer";
import HomePageCard from "./comps/hompageCards";
import NavBar from "./comps/navbar";
const Home = () => {
  return (
    <div className="max-w-[2000px] mx-auto">
      <NavBar />
      <img src="/wildcats 2.png" className="w-full" />
      <div className="mx-[3%] my-[1%]">
        <p className="font-poppins">What's Happening!</p>
        <div className="mx-[3%] my-[1%] py-[3%] flex gap-[30%]">
          <div className="w-[400px] h-[400px] bg-customYellow rounded-lg">
            Temp
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="w-[150px] h-[125px] bg-gradient-to-r from-customYellow to-customShinyGold rounded-[20%] p-[2px] box-border">
              <div className="w-full h-full bg-white rounded-[20%] text-7xl flex justify-center items-center font-bold">
                35
              </div>
            </div>
            <div className="w-[400px] h-[50px] bg-black text-customYellow rounded-full flex justify-center items-center">
              Number of attendees
            </div>
            <div className="bg-gradient-to-r from-black to-customYellow rounded-full p-1 box-border w-[400px] h-[50px]">
              <div className="bg-white w-full h-full flex rounded-full justify-center items-center">
                Open to all
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-[3%] my-[3%]">
        <p className="font-poppins">Discover More Events</p>
        <div className=" my-[1%]">
          <HomePageCard />
        </div>
        <div className="flex flex-col items-center my-[30px]">
          <button className="bg-black text-customYellow w-[250px] h-[50px] text-2xl rounded-lg"> Load More</button>
        </div>
      </div>
      <div className="relative">
        <img src="/discover.png" className="w-full" alt="Discover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white px-4 py-2 rounded-lg mt-[5%] flex gap-10 text-2xl ">
          <button className="bg-black text-customYellow w-[200px] rounded">JOIN</button>
          <div className="box-border bg-gradient-to-r from-black to-customYellow w-[200px] h-[50px] p-[3px] rounded">
            <button className="bg-white text-customYellow w-full h-full rounded">EXPLORE</button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default Home;