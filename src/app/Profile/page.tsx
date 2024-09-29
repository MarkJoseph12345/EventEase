"use client"
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { User } from '@/utils/interfaces';
import { fetchProfilePicture, me, updateProfilePicture, updateUser, verifyPassword } from '@/utils/apiCalls';
import PopUps from '../Modals/PopUps';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


const ProfilePopup = ({ picture, onClose }: { picture: string; onClose: () => void }) => {
    const [newPicture, setNewPicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await me();
                setUser(userData);
            } catch (error) {

            }
        };

        fetchUser();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewPicture(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClose = () => {
        setNewPicture(null);
        onClose();
    };

    const handleUpload = async () => {
        if (newPicture) {
            const success = await updateProfilePicture(user!.id!, newPicture);
            if (success) {
                setMessage({ text: "Your profile picture has been updated", type: "success" });
                window.location.reload();
            } else {
                setMessage({ text: "Failed to update profile picture", type: "success" });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-fit max-h-[95%] overflow-auto relative">
                <div className="flex justify-end">
                    <span className="sticky text-gray-500 font-bold text-2xl cursor-pointer" onClick={handleClose}>✖</span>
                </div>

                <img src={preview || picture} className="mx-auto w-72 h-72 object-cover" />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <div className="flex flex-col items-center">
                    <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="block bg-customYellow font-poppins font-semibold px-4 py-2 rounded-md mt-4">{newPicture ? "Upload Another Image" : "Upload Image"}</button>
                    {newPicture && (
                        <button onClick={handleUpload} className="block bg-customYellow font-poppins font-bold px-4 py-2 rounded-md mt-4">Save Profile</button>
                    )}
                </div>
            </div>
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}

        </div>
    );
};

const ConfirmationPopup = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6  shadow-lg">
                <p className="mb-4">Are you sure you want to save changes in your Profile?</p>
                <div className="flex justify-center space-x-5">
                    <button
                        className="px-5 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="px-5 py-2 bg-black  text-yellow-500 rounded hover:bg-black-400"
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfilePictureReminderPopup = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 shadow-lg text-center">
                <p className="mb-4">Please update your profile picture to gain full access and attend events.</p>
                <div className="flex justify-center space-x-2">
                    <button
                        className="px-6 py-2 bg-yellow-500 font-bold text-black rounded hover:bg-yellow-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const Profile = () => {
    const [confirmPass, setConfirmPass] = useState("");
    const [clickedProfilePic, setClickedProfilePic] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>({
        newPassword: "",
    }
    );
    const [imageUrl, setImageUrl] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showProfilePicturePrompt, setShowProfilePicturePrompt] = useState(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | undefined>()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await me();
                setUser(userData);
                if (userData.profilePictureName === "XyloGraph1.png") {
                    setShowProfilePicturePrompt(true);
                }
                const url = await fetchProfilePicture(userData.id!);
                setImageUrl(url);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, []);
    

    const handleProfilePicClick = (picture: string) => {
        setClickedProfilePic(picture);
    };

    const handleClosePopup = () => {
        setClickedProfilePic("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "currentpassword") {
            setCurrentPassword(value);
        } else {
            setUser((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
        }
    };

    const handleUpdateUser = async () => {
        if (!user) return;


        const { firstName, lastName, newPassword } = user;
        const userFormClone: Partial<User> = { firstName, lastName };

        if (newPassword) {
            userFormClone.password = newPassword;
        }

        const success = await updateUser(user!.id!, userFormClone);
        if (success) {
            setMessage({ text: "User details updated successfully", type: "success" });
        } else {
            setMessage({ text: "User details updated unsuccessfully", type: "error" });
        }
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (currentPassword == "" && user!.newPassword! != undefined) {
            setMessage({ text: "Enter current password", type: "error" });
            return;
        }
        if (currentPassword) {
            const verificationResult = await verifyPassword(user!.id!, currentPassword);
            if (!verificationResult) {
                setMessage({ text: "Incorrect Current Password!", type: "error" });
                return;
            }
        }
        if (user && user.newPassword && !passwordRegex.test(user!.newPassword!)) {
            setMessage({ text: "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            return;
        }

        if (currentPassword != "" && user && user.newPassword != confirmPass) {
            setMessage({ text: "Passwords do not match!", type: "error" });
            setTimeout(() => setMessage(undefined), 3000);
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmSave = () => {
        setShowConfirmation(false);
        handleUpdateUser();
    };

    const handleCancelSave = () => {
        setShowConfirmation(false);
    };

    const handleCloseProfilePicturePrompt = () => {
        setShowProfilePicturePrompt(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-white-200 h-screen text-center pb-4 smartphone:h-fit tablet:h-screen">
            <Sidebar />
            <div>
                <img src={imageUrl || "/defaultpic.png"} alt="Profile Pic" className="my-4 w-32 mt-10 h-32 rounded-full object-cover object-center mx-auto hover:cursor-pointer hover:border-8 hover:border-customRed transition-all duration-300 ease-in-out" onClick={(e) => { handleProfilePicClick(imageUrl || "/defaultpic.png") }} />
            </div>
            <h2 className="text-2xl font-semibold font-poppins">{user!.firstName} {user!.lastName}</h2>
            <p className="text-gray-700 underline">{user!.username}</p>
            {clickedProfilePic && <ProfilePopup picture={clickedProfilePic} onClose={handleClosePopup} />}
            <div className="h-fit rounded-2xl mt-4 border-2 p-2 bg-customWhite mx-auto w-fit smartphone:w-9/12 laptop:w-[48rem]">
                <h1 className="text-center text-xl font-semibold font-poppins">Change your account details</h1>
                <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
                    {/* <div className="relative h-11 w-full ">
                        <input placeholder="Email Address" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            value={user!.username} onChange={handleInputChange}
                            readOnly
                            name="username" />
                        <label className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Email Address
                        </label>
                    </div> */}
                    <div className="relative h-11 w-full ">
                        <input placeholder="First Name" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-customYellow focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            defaultValue={user!.firstName} onChange={handleInputChange}
                            name="firstName" />
                        <label className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            First Name
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input placeholder="Last Name" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            defaultValue={user!.lastName} onChange={handleInputChange}
                            name="lastName" />
                        <label className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Last Name
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input
                            placeholder="Current Password"
                            type={showCurrentPassword ? "text" : "password"}
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            defaultValue={""}
                            name="currentpassword" />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                        <label className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Current Password
                        </label>
                    </div>
                    <div className="relative h-11 w-full">
                        <input
                            placeholder="Password"
                            type={showNewPassword ? "text" : "password"}
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            onChange={handleInputChange}
                            defaultValue={""}
                            name="newPassword" />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                        <label
                            className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            New Password
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input
                            placeholder="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            defaultValue={""}
                            onChange={(e) => setConfirmPass(e.target.value)} name="confirmPassword" />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Confirm New Password
                        </label>
                    </div>
                    <button type="submit" className="mt-4 bg-customYellow font-semibold py-2 px-4 mb-2 rounded font-poppins">Update Details</button>
                </form>
            </div>
            {showConfirmation && (
                <ConfirmationPopup
                    onConfirm={handleConfirmSave}
                    onCancel={handleCancelSave}
                />
            )}
            {showProfilePicturePrompt && (
                <ProfilePictureReminderPopup onClose={handleCloseProfilePicturePrompt} />
            )}
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div>
    );
};

export default Profile;