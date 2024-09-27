import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <img src='404.png'/>
            <p className="text-4xl mt-4 font-bold text-center">The Page You Requested Could Not Be Found</p>
            <p className="text-lg mt-2 max-w-[40rem] text-center">We searched high and low but couldn’t find what you are looking for. Let’s 
            find a better place fo you to go </p>
            <Link href="/" className="mt-6 px-12 py-2 bg-customYellow rounded-2xl shadow-md hover:bg-black hover:text-customYellow transition duration-300">
                Go to Homepage
            </Link>
        </div>
    )
}

export default NotFound