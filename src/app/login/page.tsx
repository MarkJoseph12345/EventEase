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
        <div className="max-w-[2000px] bg-cover bg-no-repeat bg-center bg-[url('/BG.png')] h-screen box-border px-[5%] py-[5%] flex justify-end mx-auto">
            <div className="flex justify-center w-[40%] h-full bg-black box-border p-10 rounded-2xl">
                <div className="flex flex-col items-center w-full h-full bg-customYellow rounded-2xl box-border justify-between	py-10">
                    <div className="flex flex-col items-center">
                        <h1 className="text-5xl font-bold">WELCOME!</h1>
                        <p>Please enter your Login and Password</p>
                    </div>
                    <div className="w-[60%]">
                        <p>Username/Email Address<span className="text-red-800">*</span></p>
                        <input type="email" className="w-full h-[50px] rounded-2xl border-4 border-black"/>
                    </div>
                    <div className="w-[60%]">
                        <p>Password<span className="text-red-800">*</span></p>
                        <div className="relative box-border">
                            <input type={showLoginPassword ? "text" : "password"} className="pr-8 w-full rounded-2xl h-[50px] border-4 border-black" />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1">
                                <span className="cursor-pointer" onClick={handleClickShowPassword}>
                                    {showLoginPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                        </div>
                        <span className="flex justify-end">Forgot Password?</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className="bg-black text-customYellow w-[200px] h-[50px] text-2xl rounded font-bold">LOGIN</button>
                        <p>Don't have an account? <Link href="/signup" replace className="font-bold cursor-pointer">SIGN IN</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
