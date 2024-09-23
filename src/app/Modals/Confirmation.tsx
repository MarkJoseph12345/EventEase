"use client";
import React from 'react';

interface ConfirmationProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void; 
    onCancel: () => void; 
    actionType?: 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE'; 
}

const Confirmation: React.FC<ConfirmationProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
    actionType = 'NEUTRAL',
}) => {
    if (!isOpen) return null;

    const buttonStyles = {
        NEUTRAL: 'bg-customYellow text-black',
        POSITIVE: 'bg-green-500 text-white',
        NEGATIVE: 'bg-customRed text-white',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-4 rounded-md shadow-md min-h-[10rem] border-2 border-customYellow">
                <p className="mb-12 text-lg font-semibold">{message}</p>
                <div className="flex justify-between">
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 ${buttonStyles[actionType]} rounded-md font-medium`}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
