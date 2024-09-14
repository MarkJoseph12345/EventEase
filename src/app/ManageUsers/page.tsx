"use client";
import { useEffect, useRef, useState } from 'react';
import { User } from '@/utils/interfaces';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { blockUser, deleteUser, fetchProfilePicture, getAllUsers, unblockUser } from '@/utils/apiCalls';

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [showDepartments, setShowDepartments] = useState<boolean>(false);
    const [userImages, setUserImages] = useState<{ [key: string]: string }>({});
    const departments = Array.from(new Set(users.map(user => user.department || '')));

    const filteredUsers = users.filter(user =>
        (selectedDepartments.length === 0 || selectedDepartments.includes(user.department || '')) &&
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
    };

    const handleClosePopup = () => {
        setSelectedUser(null);
    };

    const toggleDepartments = () => {
        setShowDepartments(!showDepartments);
    };

    const handleDepartmentChange = (department: string) => {
        const updatedDepartments = selectedDepartments.includes(department)
            ? selectedDepartments.filter(dep => dep !== department)
            : [...selectedDepartments, department];
        setSelectedDepartments(updatedDepartments);
    };

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDepartments(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getAllUsers();
                const filteredUsers = fetchedUsers.filter(user => user.role !== 'ADMIN');
                setUsers(filteredUsers);
                fetchUserImages(filteredUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const fetchUserImages = async (users: User[]) => {
        const imagePromises = users.map(async (user) => {
            if (user.id) {
                const url = await fetchProfilePicture(user.id);
                return { [user.id]: url };
            }
            return {};
        });

        const images = await Promise.all(imagePromises);
        const imagesMap = images.reduce((acc, image) => ({ ...acc, ...image }), {});
        setUserImages(imagesMap);
    };

    const handleDeleteUser = async (userId?: number) => {
        const id = userId || selectedUser?.id;
        if (id) {
            try {
                const isDeleted = await deleteUser(id);
                if (isDeleted) {
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                    if (selectedUser && !userId) {
                        handleClosePopup();
                    }
                } else {
                    console.error("Failed to delete user");
                }
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };

    const handleBlockUnblockUser = async (userId?: number) => {
        const id = userId || selectedUser?.id;
        if (id) {
            try {
                const user = users.find(u => u.id === id);
                if (user) {
                    const isBlocked = user.blocked;
                    const action = isBlocked ? unblockUser : blockUser;
                    const response = await action(id);
                    if (response) {
                        setUsers(prevUsers =>
                            prevUsers.map(u =>
                                u.id === id ? { ...u, blocked: !isBlocked } : u
                            )
                        );
                        if (!userId) {
                            setSelectedUser(prevUser => prevUser ? { ...prevUser, blocked: !isBlocked } : null);
                        }
                    } else {
                        console.error(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
                    }
                }
            } catch (error) {
                console.error(`Failed to toggle user block status:`, error);
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col">
            <Sidebar />
            <div className="mt-[6rem] ml-[2rem] mx-2 mb-5">
                <p className="text-xl font-semibold font-bevietnam mb-2 tablet:text-3xl">Users</p>
                <div>
                    <div className="flex items-center mb-5">
                        <div className="relative mr-3">
                            <div onClick={toggleDepartments} className="cursor-pointer">
                                <img src="/filter.png" className="h-6 w-6" />
                            </div>
                            {showDepartments && (
                                <div ref={dropdownRef} className="absolute top-10 left-0 bg-white border border-gray-200 shadow-md rounded-md p-2">
                                    <div className="flex items-center justify-between mb-2 flex-col">
                                        <button className="text-sm text-customYellow" onClick={() => setSelectedDepartments([])}>Clear Filter</button>
                                    </div>
                                    <p className="font-semibold">Departments</p>
                                    {departments.map((department, index) => (
                                        <div key={index} className="flex items-center">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" checked={selectedDepartments.includes(department)} onChange={() => handleDepartmentChange(department)} className="mr-2 cursor-pointer accent-customYellow" />
                                                {department}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" className="block w-full p-2 ps-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-customYellow transition-all duration-300" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center border border-gray-200 rounded-md p-4 mt-2" onClick={() => handleUserClick(user)}>
                                <img src={userImages[user.id!] || "/defaultpic.png"} alt={`${user.firstName} ${user.lastName}`} className="w-16 h-16 object-cover rounded-full mr-4" />
                                <div>
                                    <p className="font-medium font-poppins">{`${user.firstName} ${user.lastName}`}</p>
                                    <p className="text-gray-600 font-poppins">{user.department}</p>
                                </div>
                                <div className="ml-auto flex flex-col items-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBlockUnblockUser(user.id);

                                        }}
                                        className={`mt-2 px-4 py-2 ${user.blocked ? 'bg-green-600' : 'bg-customRed'} text-customYellow rounded-md font-poppins font-medium`}
                                    >
                                        {user.blocked ? 'Unblock User' : 'Block User'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user.id);
                                        }}
                                        className="mt-2 px-4 py-2 bg-customRed text-customYellow rounded-md font-poppins font-medium">
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center ">
                            <img src="no-user-image.png" className="mb-4 w-32 h-32 grayscale" />
                            <p className="text-center">No users match your filters or search term. Please adjust your filters or try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
            {selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white px-4 rounded-md shadow-md w-[21rem]">
                        <p className="sticky top-0 text-end text-customYellow font-bold mt-2 text-2xl z-10 cursor-pointer" onClick={handleClosePopup}>✖</p>
                        <div className="my-2 flex flex-col items-center">
                            <img src={userImages[selectedUser.id!] || "/defaultpic.png"} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} className="w-64 h-64 object-cover rounded-md mt-2" />
                            <p className='font-poppins mt-2'><strong>Name:</strong></p>
                            <p className='font-poppins -mt-1 font-regular text-sm'>{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
                            <p className='font-poppins mt-2'><strong>Email:</strong> </p>
                            <p className='font-poppins font-regular text-sm -mt-1'>{selectedUser.username}</p>
                            <p className='font-poppins mt-2'><strong>Department:</strong></p>
                            <p className='font-poppins font-regular text-sm -mt-1'>{selectedUser.department}</p>
                            <p className='font-poppins mt-2'><strong>Gender:</strong></p>
                            <p className='font-poppins font-regular text-sm -mt-1'>{selectedUser.gender}</p>
                            <button
                                onClick={() => handleBlockUnblockUser(selectedUser.id)}
                                className={`mt-6 px-4 py-2 ${selectedUser.blocked ? 'bg-green-600' : 'bg-customRed'} text-customYellow rounded-md font-poppins font-medium tablet:hidden`}
                            >
                                {selectedUser.blocked ? 'Unblock User' : 'Block User'}
                            </button>
                            <button
                                onClick={() => handleDeleteUser(selectedUser.id)}
                                className="mt-6 px-4 py-2 mb-5 bg-customRed text-customYellow rounded-md font-poppins font-medium tablet:hidden">
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageUsers;