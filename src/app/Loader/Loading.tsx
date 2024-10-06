const Loading = () => {

    return (
        // <div className="sticky flex flex-col justify-center h-screen w-screen items-center bg-slate-200">
        //     <div className="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(black_0deg,black_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#fdcc01_0deg,#fdcc01_180deg,transparent_180deg,transparent_360deg)]">
        //         <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#ae0404_0deg,#ae0404_180deg,transparent_180deg,transparent_360deg)]">
        //         </span>
        //     </div>
        // </div>
        <div className="flex justify-center items-center h-screen font-bold w-full text-3xl tablet:text-6xl text-transparent">
            {Array.from("E V E N T   E A S E").map((letter, index) => (
                <span
                    key={index}
                    className={`inline-block  animate-bounce `}
                    style={{ animationDelay: `${index * 100}ms`, margin: '0 5px' }}
                >
                    {letter}
                </span>
            ))}
        </div>
    )
}

export default Loading;