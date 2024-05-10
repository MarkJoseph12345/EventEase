'use client'

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../api";

interface FormData {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    department: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    username?: string;
    department?: string;
    password?: string;
}

const SignUp = () => {
    const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        department: "CCS"
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleClickShowPassword = () => {
        setShowLoginPassword(!showLoginPassword);
    };

    // Function to validate email format
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to validate password
    const isValidPassword = (password: string): boolean => {
        // Regular expression for at least one uppercase letter, one number, and a minimum length of 8
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    // Function to validate form data
    const validateFormData = () => {
        const errors: FormErrors = {};

        // Validate first name
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required.";
        }

        // Validate last name
        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required.";
        }

        // Validate email
        if (!isValidEmail(formData.username)) {
            errors.username = "Please enter a valid email address.";
        }

        // Validate department
        if (!formData.department) {
            errors.department = "Department is required.";
        }

        // Validate password
        if (!isValidPassword(formData.password)) {
            errors.password = "Password should be at least 8 characters, with one uppercase and one number.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return whether the form is valid
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Validate individual fields and update error state
        const errors = { ...formErrors };

        if (name === "firstName" && !value.trim()) {
            errors.firstName = "First name is required.";
        } else {
            delete errors.firstName;
        }

        if (name === "lastName" && !value.trim()) {
            errors.lastName = "Last name is required.";
        } else {
            delete errors.lastName;
        }

        if (name === "username") {
            if (!isValidEmail(value)) {
                errors.username = "Please enter a valid email address.";
            } else {
                delete errors.username;
            }
        }

        if (name === "password") {
            if (!isValidPassword(value)) {
                errors.password = "Password must be at least 8 characters long and contain at least one uppercase letter and one number.";
            } else {
                delete errors.password;
            }
        }

        if (name === "department" && !value) {
            errors.department = "Department is required.";
        } else {
            delete errors.department;
        }

        setFormErrors(errors);
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const { value } = e.target;
        setFormData({
            ...formData,
            department: value
        });

        // Validate department and update error state
        const errors = { ...formErrors };
        if (!value) {
            errors.department = "Department is required.";
        } else {
            delete errors.department;
        }

        setFormErrors(errors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        // Validate the form data before submission
        const isFormValid = validateFormData();
        if (!isFormValid) {
            return; // Prevent form submission if the form is invalid
        }

        try {
            const response = await axios.post(API_ENDPOINTS.REGISTER, formData);
            console.log("Registration successful:", response.data);

            const loginResponse = await axios.post(API_ENDPOINTS.LOGIN, {
                username: formData.username,
                password: formData.password
            });

            console.log("Login successful:", loginResponse.data);
            const authToken = loginResponse.data.token;
            localStorage.setItem("token", authToken);

            // Reset form data and errors
            setFormData({
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                department: "CCS"
            });
            setFormErrors({});
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Registration failed:", axiosError.response?.data);
        }
    };

    return (
        <div className="max-w-[2000px] bg-cover bg-no-repeat bg-center bg-[url('/BG.png')] h-screen box-border px-[5%] py-[5%] flex justify-start mx-auto">
            <div className="flex justify-center w-[43%] h-[33rem] bg-black box-border p-10 rounded-2xl -mt-6">
                <form onSubmit={handleSubmit} method="post" className="flex flex-col items-center w-full h-full bg-customYellow rounded-2xl box-border justify-between py-10">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-extrabold font-poppins -mt-7">CREATE AN ACCOUNT!</h1>
                        <p className="text-xs font-light font-poppins mb-2">Create an account to explore exciting events.</p>
                    </div>
                    <div className="flex justify-between gap-10">
                        <div className="w-[63%] -mt-1">
                            <p className="font-poppins text-sm font-regular ml-1 mt-2">First Name<span className="text-red-800">*</span></p>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter First Name"
                                style={{ fontSize: '13px' }}
                                className="w-40 h-[37px] rounded-2xl border-2 ml-1 border-black"
                            />
                            {formErrors.firstName && (
                                <p className="text-red-800 text-xs font-poppins mt-1">
                                    {formErrors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="font-poppins text-sm font-regular -ml-2 mt-1">Last Name<span className="text-red-800">*</span></p>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter Last Name"
                                style={{ fontSize: '13px'}}
                                className="w-40 h-[37px] rounded-2xl border-2 border-black -ml-2" />
                            {formErrors.lastName && (
                                <p className="text-red-800 text-xs font-poppins mt-1">
                                    {formErrors.lastName}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="w-[60%]">
                        <p className="font-poppins text-sm font-regular mt-3">Username/Email Address<span className="text-red-800">*</span></p>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter Username/Email Address"
                            style={{ fontSize: '13px', marginLeft: '2px' }}
                            className="w-full h-[37px] rounded-2xl border-2 border-black" />
                        {formErrors.username && (
                            <p className="text-red-800 text-xs font-poppins mt-1">
                                {formErrors.username}
                            </p>
                        )}
                    </div>
                    <div className="w-[60%]">
                        <p className="font-poppins text-sm font-regular mt-2">Department<span className="text-red-800">*</span></p>
                        <select
                            value={formData.department}
                            onChange={handleDepartmentChange}
                            className="w-full h-[37px] rounded-2xl border-2 border-black">
                            <option value="CEA">CEA</option>
                            <option value="CMBA">CMBA</option>
                            <option value="CASE">CASE</option>
                            <option value="CNAHS">CNAHS</option>
                            <option value="CCS">CCS</option>
                            <option value="CCJ">CCJ</option>
                        </select>
                        {formErrors.department && (
                            <p className="text-red-800 text-xs font-poppins mt-1">
                                {formErrors.department}
                            </p>
                        )}
                    </div>
                    <div className="w-[60%]">
                        <p className="font-poppins text-sm font-regular ml-1 mt-2">Password<span className="text-red-800">*</span></p>
                        <div className="relative box-border">
                            <input
                                type={showLoginPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter Password"
                                style={{ fontSize: '13px' }}
                                className="pr-8 w-full rounded-2xl h-[37px] border-2 border-black" />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1">
                                <span className="cursor-pointer -ml-7 -mt-.5" onClick={handleClickShowPassword}>
                                    {showLoginPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                        </div>
                        {formErrors.password && (
                            <p className="text-red-800 text-xs font-poppins mt-1">
                                {formErrors.password}
                            </p>
                        )}
                        <span className="text-xs flex justify-end font-light mb-2 mt-.5">Forgot Password?</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <button type="submit" className="bg-black text-customYellow w-[110px] h-[35px] text-xl rounded font-bold mb-5 mt-5">SIGN UP</button>
                        <p className="font-light text-xs font-poppins -mt-5">Already have an account? <Link href="/login" replace className="font-bold cursor-pointer">LOGIN</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
