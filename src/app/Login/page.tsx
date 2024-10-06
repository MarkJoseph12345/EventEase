"use client"
import Link from "next/link";
import { useState } from "react";
import { loginAccount } from "@/utils/apiCalls";
import ForgotPasswordPopup from "../Modals/ForgotPassword";
import PopUps from "../Modals/PopUps";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [userForm, setUserForm] = useState({
        username: "",
        password: "",
    })
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | undefined>()
    const [showPopup, setShowPopup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setUserForm({
            ...userForm,
            [name]: value
        });
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        const { username, password } = userForm;
        
        if(!username && !password) {
            setMessage({ text: "Please fill in all fields", type: "error" });
            return setLoading(false);
        }

        const result = await loginAccount(username, password);
        if (result.success) {
            setMessage({ text: "Login success", type: "success" });
            window.location.href = "/Dashboard";
        }
        else {
            setMessage({ text: result.message, type: "error" });
            setLoading(false);
        }
    };

    return (
        <div className="p-5 relative">
            <div className="sticky top-5 bg-white">
                <img src="/logo.png" className="h-10 w-48 object-cover cursor-pointer" onClick={() => window.location.href = "/"} />
            </div>
            <p className="text-center text-4xl font-poppins font-bold mt-10">Log In</p>
            <div className="min-h-10 rounded-2xl mt-4 border-2 p-2 bg-customWhite mx-auto smartphone:w-9/12 tablet:w-[34.125rem]">
                <h1 className="text-center text-xl font-bold">Enter your Credentials</h1>
                <form onSubmit={handleLogin} className="mt-2 flex flex-col gap-3">
                    <div className="relative h-11 w-full ">
                        <input placeholder="Email Address" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={userForm.username} onChange={handleInputChange} name="username" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Email Address <span className="text-customRed">*</span>
                        </label>
                    </div>

                    <div className="relative h-11 w-full">
                        <input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            value={userForm.password}
                            onChange={handleInputChange}
                            name="password" />
                        <button tabIndex={-1} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                        <label
                            className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Password <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <button type="submit" className="rounded text-center text-sm bg-customYellow p-2 px-4 font-bold hover:scale-95 transition-all mt-4" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setShowPopup(true)} className="text-blue-500 text-xs font-semibold">Forgot Password?</button>
                        <span className="text-end text-xs">Don&#39;t have an account? <Link href="/SignUp" replace className="font-semibold text-blue-500 underline decoration-2">SIGN UP</Link></span>
                    </div>
                </form>
            </div>
            {showPopup && <ForgotPasswordPopup onClose={() => setShowPopup(false)} />}
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div>
    )
}

export default Login;
