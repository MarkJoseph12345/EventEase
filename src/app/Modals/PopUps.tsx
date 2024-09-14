import React, { useState, useEffect, useRef } from 'react';

type MessageType = "success" | "error";

interface PopUpsProps {
    message: { text: string, type: MessageType } | undefined;
    onClose: () => void;
}

const PopUps: React.FC<PopUpsProps> = ({ message, onClose }) => {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const hasRendered = useRef(false);

    useEffect(() => {
        if (message) {
            if (hasRendered.current) {
                setShow(true);
                const timer = setTimeout(() => {
                    setShow(false);
                    setTimeout(onClose, 300);
                }, 3000);

                return () => clearTimeout(timer);
            } else {
                hasRendered.current = true;
                setVisible(true);
                setShow(true);
            }
        } else {
            setShow(false);
            setTimeout(() => {
                setVisible(false);
                onClose();
            }, 300);
        }
    }, [message, onClose]);

    const getColor = () => {
        switch (message?.type) {
            case "success":
                return "bg-green-100 text-green-800";
            case "error":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getIcon = () => {
        switch (message?.type) {
            case "success":
                return (
                    <svg className="h-6 w-6 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case "error":
                return (
                    <svg className="h-6 w-6 text-red-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`fixed bottom-0 right-0 m-4 flex items-center justify-end z-50 transform transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'} ${!visible ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className={` p-4 rounded-lg shadow-lg ${getColor()} flex items-center`}>
                <div className="flex-shrink-0 mr-3">
                    {getIcon()}
                </div>
                <div className="flex-grow">
                    <p>{message?.text}</p>
                </div>
                <button
                    onClick={() => { setShow(false); setTimeout(onClose, 300); }}
                    className="ml-3 p-1 text-gray-500 hover:text-gray-700"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PopUps;
