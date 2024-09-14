"use client"
import { useEffect, useRef, useState } from "react";
import QRComponent from "react-qr-code";
import Sidebar from "../Comps/Sidebar";
import Loading from "../Loader/Loading";
import { me } from "@/utils/apiCalls";
import { User } from "@/utils/interfaces";

const QRCode = () => {
    
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userData = await me();
            setUser(userData);
            setLoading(false)
          } catch (error) {
            console.error('Failed to fetch user:', error);
          }
        };
    
        fetchUser();
      }, []);

    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        if (qrRef.current) {
            const svg = qrRef.current.querySelector('svg');
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    const img = new Image();
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        const url = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'EventEaseQRCode.png';
                        link.click();
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                }
            }
        }
    };

    if (loading) {
        return <Loading />;
    }
    

    return (
        <div className="flex flex-col h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
            <div className="rounded-lg shadow-lg m-4 pb-4 w-full max-w-md border">
                <div className="bg-customYellow font-semibold font-poppins text-center text-lg py-2 rounded-t-lg">SCAN QR CODE</div>
                <div ref={qrRef} className="flex justify-center items-center my-4">
                    <QRComponent size={250} bgColor="white" fgColor="black" value={user?.uuid!} />
                </div>
                <div className="flex justify-center">
                    <button onClick={handleDownload} className="bg-customYellow font-poppins font-medium mt-2 py-2 px-4 rounded-lg shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">Download QR Code</button>
                </div>
            </div>
        </div>
    </div>

    )
}

export default QRCode;