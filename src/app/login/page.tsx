'use client'


import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api";

const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const token = window.localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, []);


    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowLoginPassword(!showLoginPassword);
    };

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(API_ENDPOINTS.LOGIN, formData);
            console.log("Login successful:", response.data);
            const authToken = response.data.token;
            const role = response.data.user.role;
            const name = response.data.user.name;
            const userid = response.data.user.id;
            window.localStorage.setItem("token", authToken);
            window.localStorage.setItem("role", role);
            window.localStorage.setItem("name", name);
            window.localStorage.setItem("userid", userid);
            router.push('/dashboard')
            setFormData({
                username: "",
                password: "",
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Login failed:", axiosError.response?.data);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-cover bg-no-repeat bg-center bg-[url('/BG.png')] h-screen w-screen flex items-center lg:justify-end justify-center lg:px-60">
            <div className={`h-[400px] w-[450px] bg-black rounded-2xl lg:p-6 p-4  absolute top-[15%]`}>
                <form onSubmit={handleLoginSubmit} method="post" className="bg-customYellow w-full h-full flex flex-col items-center gap-3 justify-between py-3 ">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-extrabold">WELCOME!</h1>
                        <p className="text-sm font-light">Please enter your Login and Password.</p>
                    </div>
                    <div className="w-4/6 flex flex-col gap-4">
                        <div>
                            <p className="font-poppins text-sm font-bold">Username/Email Address<span className="text-red-800">*</span></p>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder=" Enter Username/Email Address"
                                style={{ fontSize: '13px', marginLeft: '2px' }}
                                className="w-full h-[37px] rounded-2xl border-2 border-black px-2"
                            />
                        </div>
                        <div>
                            <p className="font-poppins text-sm font-bold">Password<span className="text-red-800">*</span></p>
                            <div className="relative box-border">
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder=" Enter Password"
                                    style={{ fontSize: '13px', marginLeft: '2px' }}
                                    className="pr-8 w-full rounded-2xl h-[37px] border-2 border-black px-2"
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-1">
                                    <span className="cursor-pointer -ml-7 -mt-.5" onClick={handleClickShowPassword}>
                                        {showLoginPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </span>
                                </span>
                            </div>
                            <span className="text-xs flex justify-end font-light mb-2 mt-.5">Forgot Password?</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button type="submit" disabled={loading} className={`bg-black text-customYellow w-[110px] h-[35px] ${loading ? 'text-sm' : 'text-xl'}  rounded font-bold mb-5 -mt-4`}> {loading ? "LOGGING IN..." : "LOGIN"}</button>
                        <p className="font-light text-xs font-poppins -mt-5">Don&apos;t have an account? <Link href="/signup" replace className="font-bold cursor-pointer mt-5">SIGN UP</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
