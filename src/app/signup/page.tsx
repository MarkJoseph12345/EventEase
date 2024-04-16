'use client'

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";

import { useState } from "react";

const Login = () => {
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowLoginPassword(!showLoginPassword);
    };


    return (
        <div className="max-w-[2000px] bg-cover bg-no-repeat bg-center bg-[url('/BG.png')] h-screen box-border px-[5%] py-[5%] flex justify-start mx-auto">
            <div className="flex justify-center w-[40%]  bg-black box-border p-10 rounded-2xl -mt-7" style={{ height: '33rem' }}>
                <div className="flex flex-col items-center w-full h-120 bg-customYellow rounded-2xl box-border justify-between	py-10">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-extrabold font-poppins -mt-8">CREATE AN ACCOUNT!</h1>
                        <p className="text-xs font-light font-poppins mb-2">Create an account to explore exciting events.</p>
                    </div>
                    <div className="flex justify-between gap-10  ml-2">
                        <div>
                            <p className="font-poppins mt-1 -ml-2">First Name<span className="text-red-800">*</span></p>
                            <input type="text" className="w-40 h-[37px] rounded-2xl border-2 border-black -ml-2" />
                        </div>
                        <div>
                            <p className="font-poppins mt-1 -ml-5">Last Name<span className="text-red-800">*</span></p>
                            <input type="text" className="w-40  h-[37px] rounded-2xl border-2 border-black -ml-5" />
                        </div>
                    </div>
                    <div className="w-[60%]">
                        <p className="font-poppins mt-2">Username/Email Address<span className="text-red-800">*</span></p>
                        <input type="email" className="w-full h-[37px] rounded-2xl border-2 border-black" />
                    </div>
                    <div className="w-[60%]">
                        <p className="font-poppins mt-2">Department<span className="text-red-800">*</span></p>
                        <select className="w-full h-[37px] rounded-2xl border-2 border-black">
                            <option value="department2">CS</option>
                            <option value="department1">IT</option>
                        </select>
                    </div>
                    <div className="w-[60%]">
                        <p className="font-poppins mt-2">Password<span className="text-red-800">*</span></p>
                        <div className="relative box-border">
                            <input type={showLoginPassword ? "text" : "password"} className="pr-8 w-full rounded-2xl h-[37px] border-2 border-black" />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1">
                                <span className="cursor-pointer -ml-7" onClick={handleClickShowPassword}>
                                    {showLoginPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                        </div>
                        <span className=" text-xs flex justify-end font-light mb-2 mt-.5">Forgot Password?</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className="bg-black text-customYellow w-[110px] h-[35px] rounded-md font-bold text-xl mt-3">SIGN UP</button>
                        <p className="font-regular text-sm font-poppins -mt-.5">Already have an have an account? <Link href="/login" replace className="font-bold cursor-pointer">LOGIN</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
