"use client"
import React from 'react';
import { deleteCookie } from '@/utils/cookies';

const BlockedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg mb-6">You have been banned from accessing this site.</p>
                <p>If you believe this is a mistake, please contact support.</p>
                <button
                    onClick={() => { deleteCookie("token"); window.location.href = "/" }}
                    className="mt-4 px-4 py-2 bg-customYellow text-white rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default BlockedPage;
