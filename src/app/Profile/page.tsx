"use client"
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { User } from '@/utils/interfaces';
import { fetchProfilePicture, getUserById, updateProfilePicture, updateUser } from '@/utils/apiCalls';

const ProfilePopup = ({ picture, onClose }: { picture: string; onClose: () => void }) => {
    const [newPicture, setNewPicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            const success = await updateProfilePicture(userid, newPicture);
            if (success) {
                window.location.reload();
                onClose();
            } else {
                console.error("Failed to update profile picture");
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
        </div>
    );
};

const ConfirmationPopup = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">Are you sure you want to save changes in your Profile?</p>
                <div className="flex justify-center space-x-2">
                    <button
                        className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-yellow rounded hover:bg-black-400"
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const [clickedProfilePic, setClickedProfilePic] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserById(userid);
            setUser(userData);
            setLoading(false);
        };

        const fetchImage = async () => {
            const url = await fetchProfilePicture(userid);
            setImageUrl(url);
        };

        fetchUser();
        fetchImage();
    }, []);

    const handleProfilePicClick = (picture: string) => {
        setClickedProfilePic(picture);
    };

    const handleClosePopup = () => {
        setClickedProfilePic("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUser((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleUpdateUser = async () => {
        if (!user) return;

        const { firstName, lastName, password } = user;
        const userFormClone: Partial<User> = { firstName, lastName };

        if (password) {
            userFormClone.password = password;
        }

        const success = await updateUser(userid, userFormClone);
        if (success) {
            console.log("User details updated successfully");
        } else {
            console.log("Failed to update user details");
        }
        window.location.reload();
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmSave = () => {
        setShowConfirmation(false);
        handleUpdateUser();
    };

    const handleCancelSave = () => {
        setShowConfirmation(false);
    };

    if (loading || !user) {
        return <Loading />;
    }

    return (
        <div className="bg-white-200 h-screen text-center pb-4 smartphone:h-fit tablet:h-screen">
            <Sidebar />
            <div>
                <img src={imageUrl || "/defaultpic.png"} alt="Profile Pic" className="my-4 w-32 mt-10 h-32 rounded-full object-cover object-center mx-auto" onClick={(e) => { handleProfilePicClick(imageUrl || "/defaultpic.png") }} />
            </div>
            <h2 className="text-2xl font-semibold font-poppins">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-700 underline">{user.username}</p>
            {clickedProfilePic && <ProfilePopup picture={clickedProfilePic} onClose={handleClosePopup} />}
            <div className="h-fit rounded-2xl mt-4 border-2 p-2 bg-customWhite mx-auto w-fit smartphone:w-9/12 laptop:w-[48rem]">
                <h1 className="text-center text-xl font-semibold font-poppins">Change your account details</h1>
                <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
                    <div className="relative h-11 w-full ">
                        <input placeholder="Email Address" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            value={user!.username} onChange={handleInputChange}
                            readOnly
                            name="username" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Email Address
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input placeholder="First Name" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-customYellow focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            defaultValue={user.firstName} onChange={handleInputChange}
                            name="firstName" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            First Name
                        </label>
                    </div>
                    <div className="relative h-11 w-full ">
                        <input placeholder="Last Name" className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            defaultValue={user.lastName} onChange={handleInputChange}
                            name="lastName" />
                        <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Last Name
                        </label>
                    </div>
                    <div className="relative h-11 w-full">
                        <input
                            placeholder="Password"
                            type="password"
                            className="peer h-full w-full border-b border-black bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-black focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
                            onChange={handleInputChange}
                            defaultValue={""}
                            name="password" />
                        <label
                            className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-customYellow after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-customYellow peer-focus:after:scale-x-100 peer-focus:after:border-customYellow peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Password
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
        </div>
    );
}

export default Profile;
