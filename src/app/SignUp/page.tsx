"use client"
import { useAuthRedirect } from "@/hooks/authRedirect"
import { User } from "@/utils/interfaces"
import Link from "next/link"
import { useState } from "react"
import Loading from "../Loader/Loading"
import { API_ENDPOINTS } from "@/utils/api"
import { loginAccount, registerAccount } from "@/utils/apiCalls"

const SignUp = () => {
    const [loading, setLoading] = useState(false)
    const [userForm, setUserForm] = useState<User>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        department: "CEA",
        idNumber: "",
    })
    const [confirmPass, setConfirmPass] = useState("");
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | undefined>();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setUserForm({
            ...userForm,
            [name]: value
        });
    }

    const closeAlert = () => {
        setMessage(undefined);
    };


    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true)
        if (!userForm.firstName || !userForm.lastName || !userForm.username || !userForm.password) {
            setMessage({ text: "Please fill out all required fields", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            setLoading(false)
            return;
        }

        if (userForm.password !== confirmPass) {
            setMessage({ text: "Passwords do not match", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            setLoading(false)
            return;
        }

        
        const result = await registerAccount(userForm);
        setLoading(false)

        if (result.success) {
            setMessage({ text: result.message, type: "success" });
            setTimeout(async () => {
                const loginResult = await loginAccount(String(userForm.username), String(userForm.password));
                if (loginResult.success) {
                    window.location.href = "/Dashboard";
                } else {
                    setMessage({ text: loginResult.message, type: "error" });
                    setTimeout(() => setMessage(undefined), 3000);
                }
            }, 1000);
        } 
        if (result.success) {
            setMessage({ text: result.message, type: "success" });
            setTimeout(() => setMessage(undefined), 3000);
        } else {
            setMessage({ text: result.message, type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
        }
    };

    return (
        <div className="p-5 relative">
            <img src="/logo.png" className="h-10 w-40 object-cover bg-customYellow" onClick={() => window.location.href = "/"} />
            <p className="text-center text-4xl  font-poppins font-bold mt-10">Sign Up</p>
            <p className="text-center text-sm mt-2 text-gray-500">By signing up, you agree to our <a href="/PrivacyPolicy" className=" underline decoration-2 text-blue-500 font-bold">Privacy Policy</a>.</p>
            <div className="min-h-10 rounded-2xl mt-4 border-2 p-2 bg-customWhite w-fit mx-auto smartphone:w-9/12 tablet:w-[34.125rem]">
                <h1 className="text-center text-xl font-bold">Enter your account details</h1>
                <form onSubmit={handleSignUp} className="mt-2 flex flex-col gap-3">
                    <div className="relative h-11 w-full ">
                        <input placeholder="First Name" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-customYellow focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={userForm.firstName} onChange={handleInputChange} name="firstName" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            First Name <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input placeholder="Last Name" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={userForm.lastName} onChange={handleInputChange} name="lastName" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Last Name <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input placeholder="Email Address" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={userForm.username} onChange={handleInputChange} name="username" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Email Address <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input placeholder="ID Number" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={userForm.idNumber} onChange={handleInputChange} name="idNumber" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            ID Number
                        </label>
                    </div>
                    <div className="relative h-11 w-full mt-3">
                        <select
                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-customYellow focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" value={userForm.department} onChange={(e) => { handleInputChange(e); e.target.blur(); }} name="department">
                            <option value="CEA">CEA</option>
                            <option value="CMBA">CMBA</option>
                            <option value="CASE">CASE</option>
                            <option value="CNAHS">CNAHS</option>
                            <option value="CCS">CCS</option>
                            <option value="CCJ">CCJ</option>
                        </select>
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-customYellow peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Department
                        </label>
                    </div>
                    <div className="relative h-11 w-full">
                        <input
                            placeholder="Password"
                            type="password"
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            value={userForm.password}
                            onChange={handleInputChange}
                            name="password" />
                        <label
                            className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Password <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <div className="relative h-11 w-full">
                        <input
                            placeholder="Password"
                            type="password"
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            name="confirmPass" />
                        <label
                            className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Confirm Password <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <button type="submit" className="mt-4 bg-customYellow font-bold py-2 px-4 rounded" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
                    <p className="text-end text-xs">Already have an account? <Link href="/Login" replace className="font-semibold text-blue-500 underline decoration-2">LOGIN</Link></p>

                </form>
            </div>
            {message && (
                <div className={`fixed top-1 right-1 block pl-1 pr-5 text-base leading-5 text-white opacity-95 font-regular border-2 ${message.type === "success" ? "bg-green-500 border-green-900" : "bg-red-500 border-red-900"
                    }`}>
                    <span>{message.text}</span>
                    <span className="absolute right-1 cursor-pointer" onClick={closeAlert}>✖</span>
                </div>
            )}
        </div>
    )
}

export default SignUp;