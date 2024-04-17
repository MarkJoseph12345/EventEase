'use client'

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

const Login = () => {
    const router = useRouter();
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowLoginPassword(!showLoginPassword);
    };

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLoginSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/login", formData);
            console.log("Login successful:", response.data);
            const authToken = response.data.token;
            localStorage.setItem("token", authToken);
            setFormData({
                username: "",
                password: "",
            });
            router.push('/dashboard')
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Login failed:", axiosError.response?.data);
        }
    };

    return (
        <div className="max-w-[2000px] bg-cover bg-no-repeat bg-center bg-[url('/BG.png')] h-screen box-border px-[5%] py-[5%] flex justify-end mx-auto">
            <div className="flex justify-center w-[38%] h-full bg-black box-border p-10 rounded-2xl">
                <div className="flex flex-col items-center w-full h-full bg-customYellow rounded-2xl box-border justify-between	py-10">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-extrabold font-poppins -mt-7" >WELCOME!</h1>
                        <p className="text-xs font-light font-poppins mb-2">Please enter your Login and Password.</p>
                    </div>
                    <div className="w-[63%] -mt-3">
                        <p className="font-poppins">Username/Email Address<span className="text-red-800 ">*</span></p>
                        <input type="email" className="w-full h-[37px] rounded-2xl border-2 border-black"/>
                    </div>
                    <div className="w-[63%] -mt-3">
                        <p className="font-poppins">Password<span className="text-red-800">*</span></p>
                        <div className="relative box-border">
                            <input type={showLoginPassword ? "text" : "password"} className="pr-8 w-full rounded-2xl h-[37px] border-2 border-black" />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1">
                                <span className="cursor-pointer -ml-7 -mt-1" onClick={handleClickShowPassword}>
                                    {showLoginPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                        </div>
                        <span className=" text-xs flex justify-end font-light mb-2 mt-.5">Forgot Password?</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className="bg-black text-customYellow w-[110px] h-[35px] rounded-md font-bold text-xl">LOGIN</button>
                        <p className="font-regular text-sm font-poppins mt-1">Don't have an account? <Link href="/signup" replace className="font-bold cursor-pointer">SIGN UP</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
