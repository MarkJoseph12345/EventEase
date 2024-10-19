"use client"
import { User } from "@/utils/interfaces"
import Link from "next/link"
import { useState } from "react"
import Loading from "../Loader/Loading"
import { loginAccount, registerAccount } from "@/utils/apiCalls"
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PopUps from "../Modals/PopUps"

const SignUp = () => {
    const [loading, setLoading] = useState(false)
    const [userForm, setUserForm] = useState<User>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        department: "CEA",
        idNumber: "",
        gender: "MALE",
    })
    const [confirmPass, setConfirmPass] = useState("");
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | undefined>()
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isStudent, setIsStudent] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setUserForm({
            ...userForm,
            [name]: value
        });

        if (name === "password") {
            validatePassword(value);
        }
    }

    const validatePassword = (password: string): void => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Your password must be 8 characters with at least one uppercase letter and one number.");
        } else {
            setPasswordError(null);
        }
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true)
        if (!userForm.firstName || !userForm.lastName || !userForm.username || !userForm.password) {
            setMessage({ text: "Please fill out all required fields!", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            setLoading(false)
            return;
        }

        if (isStudent && !userForm.idNumber) {
            setMessage({ text: "Please fill out all required fields!", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            setLoading(false)
            return;
        }

        if (userForm.password !== confirmPass) {
            setMessage({ text: "Passwords do not match!", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            setLoading(false)
            return;
        }


        if (passwordError) {
            setMessage({ text: `${passwordError}`, type: "error" });
            setLoading(false);
            return;
        }

        if (!isStudent) {
            userForm.department = "N/A",
                userForm.idNumber = "N/A"
        }

        const result = await registerAccount(userForm);
        setLoading(false)
        if (result) {
            if (result.success) {
                // setMessage({ text: "Please check your email to verify.", type: "success" });
                setMessage({ text: result.message, type: "success" });
                setTimeout(() => {
                    window.location.href = "/Login";
                }, 3000);
            } else {
                setMessage({ text: result.message, type: "error" });
            }
        }
    };

    if (loading) {
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loading />
        </div>
    }

    return (
        <div className="p-5 relative">
            <img src="/logo.png" className="h-10 w-48 object-cover cursor-pointer" onClick={() => window.location.href = "/"} />
            <p className="text-center text-4xl  font-poppins font-bold mt-10">Sign Up</p>
            <p className="text-center text-sm mt-2 text-gray-500">By signing up, you agree to our <a href="/PrivacyPolicy" className=" underline decoration-2 text-blue-500 font-bold">Privacy Policy</a>.</p>
            <div className="min-h-10 rounded-2xl mt-4 border-2 p-2 bg-customWhite mx-auto smartphone:w-9/12 tablet:w-[34.125rem]">
                <h1 className="text-center text-xl font-bold">Enter your account details</h1>
                <form onSubmit={handleSignUp} className="mt-2 flex flex-col gap-3" autoComplete="new-password">
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
                    <div className="relative h-11 w-full mt-3">
                        <select
                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-customYellow focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" value={userForm.gender} onChange={(e) => { handleInputChange(e); e.target.blur(); }} name="gender">
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                        </select>
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-customYellow peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Gender
                        </label>
                    </div>

                    <div>
                        <label
                            className="flex items-center w-full py-2 cursor-pointer"
                        >
                            <div className="grid mr-3 place-items-center">
                                <div className="inline-flex items-center">
                                    <label
                                        className="relative flex items-center p-0 rounded-full cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-black checked:bg-black checked:before:bg-black hover:before:opacity-0"
                                            checked={isStudent}
                                            onChange={() => setIsStudent(!isStudent)}
                                        />
                                        <span
                                            onClick={() => setIsStudent(!isStudent)}
                                            className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <p className="">
                                Student
                            </p>
                        </label>
                    </div>

                    {isStudent && (
                        <>
                            <div className="relative h-11 w-full ">
                                <input placeholder="ID Number" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" value={userForm.idNumber} onChange={handleInputChange} name="idNumber" />
                                <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    ID Number <span className="text-customRed">*</span>
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
                        </>
                    )}


                    <div className="relative h-11 w-full mb-2 ">
                        <input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            autoComplete="none"
                            value={userForm.password}
                            onChange={handleInputChange} name="password" />
                        <button tabIndex={-1} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Password <span className="text-customRed">*</span>
                        </label>
                        {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                    </div>
                    <div className="relative h-11 w-full ">
                        <input
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            name="confirmPassword" />
                        <button tabIndex={-1} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Confirm Password <span className="text-customRed">*</span>
                        </label>
                    </div>
                    <button type="submit" className="rounded text-center text-sm bg-customYellow p-2 px-4 font-bold hover:scale-95 transition-all mt-4">Sign Up</button>
                    <span className="text-end text-xs">Already have an account? <Link href="/Login" replace className="font-semibold text-blue-500 underline decoration-2">LOGIN</Link></span>
                </form>
            </div>
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div>
    )
}

export default SignUp
