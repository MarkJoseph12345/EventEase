import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-2xl text-gray-600 mt-4">NOT YET DONE</p>
            <p className="text-lg text-gray-500 mt-2">TO BE IMPLEMENTED</p>
            <Link href="/" className="mt-6 px-4 py-2 bg-customYellow rounded-md shadow-md hover:bg-blue-700 transition duration-300">
                GO BACK TO HOME
            </Link>
        </div>
    )
}

export default NotFound