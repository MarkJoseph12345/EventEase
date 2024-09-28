"use client";
import { useEffect, useRef, useState } from 'react';
import { User } from '@/utils/interfaces';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { blockUser, deleteUser, deleteUserByAdmin, fetchProfilePicture, getAllUsers, me, setUserAsAdmin, setUserAsStudent, unblockUser } from '@/utils/apiCalls';
import Confirmation from '../Modals/Confirmation';
import PopUps from '../Modals/PopUps';
type SelectedFilters = {
    departments: string[];
    blocked: boolean;
    roles: string[];
};

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDepartments, setShowDepartments] = useState<boolean>(false);
    const [userImages, setUserImages] = useState<{ [key: string]: string }>({});
    const departments = Array.from(new Set(users.map(user => user.department || '')));
    const roles = ["Admin", "Student"];
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState<'delete' | 'block' | 'role' | null>(null);
    const [selectedUserConfirm, setSelectedUserConfirm] = useState<User | null>(null);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | undefined>();

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
        departments: [],
        blocked: false,
        roles: [],
    });

    const handleFilterChange = (filterCategory: 'departments' | 'blocked' | 'roles', filterValue?: string) => {
        if (filterCategory === 'departments' && filterValue) {
            const updatedDepartments = selectedFilters.departments.includes(filterValue)
                ? selectedFilters.departments.filter(dep => dep !== filterValue)
                : [...selectedFilters.departments, filterValue];
            setSelectedFilters({ ...selectedFilters, departments: updatedDepartments });
        } else if (filterCategory === 'blocked') {
            setSelectedFilters(prev => ({ ...prev, blocked: !prev.blocked }));
        } else if (filterCategory === 'roles' && filterValue) {
            const updatedRoles = selectedFilters.roles.includes(filterValue)
                ? selectedFilters.roles.filter(role => role !== filterValue)
                : [...selectedFilters.roles, filterValue];
            setSelectedFilters({ ...selectedFilters, roles: updatedRoles });
        }
    };

    const filteredUsers = users.filter(user =>
        (selectedFilters.departments.length === 0 || selectedFilters.departments.includes(user.department || '')) &&
        (selectedFilters.blocked ? user.blocked : !user.blocked) &&
        (selectedFilters.roles.length === 0 || selectedFilters.roles.includes(user.role!)) &&
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
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
                const userData = await me();
                const filteredUsers = fetchedUsers.filter(user => user.id !== userData.id);
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
                    setMessage({ text: `Successfully deleted user!`, type: "success" });
                } else {
                    setMessage({ text: `Failed to delete user!`, type: "error" });
                }
            } catch (error) {
                setMessage({ text: "Failed to delete user: " + error, type: "success" });
            }
        }
    };

    const handleBlockUnblockUser = async (userId?: number) => {
        setMessage(undefined);
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
                        setMessage({ text: `Successfully ${isBlocked ? 'unblocked' : 'blocked'} ${user.firstName} ${user.lastName}`, type: "success" });
                        if (!userId) {
                            setSelectedUser(prevUser => prevUser ? { ...prevUser, blocked: !isBlocked } : null);
                        }
                    } else {
                        setMessage({ text: `Failed to ${isBlocked ? 'unblock' : 'block'} ${user.firstName} ${user.lastName}`, type: "error" });
                    }
                }
            } catch (error) {
                console.error(`Failed to toggle user block status:`, error);
            }
        }
    };

    const makeAdminStudent = async (userId?: number) => {
        setMessage(undefined);
        const id = userId || selectedUser?.id;
        if (id) {
            try {
                const user = users.find(u => u.id === id);
                if (user) {
                    const isAdmin = user.role === "ADMIN";
                    const action = isAdmin ? setUserAsStudent : setUserAsAdmin;
                    const response = await action(id);
                    if (response) {
                        setMessage({ text: `Successfully made ${user.firstName} ${user.lastName} into ${isAdmin ? 'student' : 'admin'}!`, type: "success" });
                        setUsers(prevUsers =>
                            prevUsers.map(u =>
                                u.id === id ? { ...u, role: isAdmin ? "STUDENT" : "ADMIN" } : u
                            )
                        );
                        if (!userId) {
                            setSelectedUser(prevUser =>
                                prevUser ? { ...prevUser, role: isAdmin ? "STUDENT" : "ADMIN" } : null
                            );
                        }
                    } else {
                        setMessage({ text: `Failed to make ${isAdmin ? 'student into admin' : 'admin into student'}!`, type: "error" });
                    }
                }
            } catch (error) {
                setMessage({text: `Failed to toggle user status:` + error, type: "error"});
            }
        }
    };

    const handleConfirmation = (action: 'delete' | 'block' | 'role', user: User) => {
        setConfirmationAction(action);
        setIsConfirmationOpen(true);
        setSelectedUserConfirm(user);
    };

    const confirmAction = (id: number) => {
        if (confirmationAction === 'delete') {
            handleDeleteUser(id);
        } else if (confirmationAction === 'block') {
            handleBlockUnblockUser(id);
        } else if (confirmationAction === 'role') {
            makeAdminStudent(id);
        }
        setConfirmationAction(null);
        setIsConfirmationOpen(false);
    };

    const cancelAction = () => {
        setIsConfirmationOpen(false);
        setConfirmationAction(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Sidebar />
            <div className="mt-[6rem] mx-[2rem] mb-5">
                <p className="text-xl font-semibold font-bevietnam mb-2 tablet:text-3xl">Users</p>
                <div>
                    <div className="flex items-center mb-5">
                        <div className="relative mr-3">
                            <div onClick={toggleDepartments} className="cursor-pointer">
                                <img src="/filter.png" className="h-6 w-6" />
                            </div>
                            {showDepartments && (
                                <div ref={dropdownRef} className="absolute top-10 left-0 bg-white border border-gray-200 shadow-md rounded-md p-2 w-48">
                                    <div className="flex items-center justify-between mb-2 flex-col">
                                        <button className="text-sm text-customYellow" onClick={() => setSelectedFilters({ departments: [], blocked: false, roles: [] })}>Clear Filter</button>
                                    </div>
                                    <p className="font-semibold">Departments</p>
                                    {departments.map((department, index) => (
                                        <div key={index} className="flex items-center">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" checked={selectedFilters.departments.includes(department)} onChange={() => handleFilterChange('departments', department)} className="mr-2 cursor-pointer accent-customYellow" />
                                                {department}</label>
                                        </div>
                                    ))}
                                    <p className="font-semibold">Blocked</p>
                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.blocked}
                                                onChange={() => handleFilterChange('blocked')}
                                                className="mr-2 cursor-pointer accent-customYellow"
                                            />
                                            Blocked Users
                                        </label>
                                    </div>
                                    <p className="font-semibold">Roles</p>
                                    {roles.map((role, index) => (
                                        <div key={index} className="flex items-center">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" checked={selectedFilters.roles.includes(role.toUpperCase())} onChange={() => handleFilterChange('roles', role.toUpperCase())} className="mr-2 cursor-pointer accent-customYellow" />
                                                {role}</label>
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
                            <div key={user.id} className="flex items-center border border-gray-200 rounded-md p-4 mt-2 cursor-pointer hover:bg-customYellow hover:border-customYellow hover:bg-opacity-20" onClick={() => handleUserClick(user)}>
                                <img src={userImages[user.id!] || "/defaultpic.png"} alt={`${user.firstName} ${user.lastName}`} className="w-16 h-16 object-cover rounded-full mr-4" />
                                <div>
                                    <p className="font-medium font-poppins">{`${user.firstName} ${user.lastName}`}</p>
                                    <p className="text-gray-600 font-poppins">{user.department}</p>
                                </div>
                                <div className="ml-auto tablet:flex flex-row gap-2 hidden">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirmation('role', user);
                                        }}
                                        className={`w-32 py-1 ${user.blocked ? 'hidden' : ''} bg-customRed text-customWhite rounded font-poppins font-medium box-border ${user.username === "admin" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={user.username === "admin"}
                                    >
                                        {user.role === "STUDENT" ? 'Set as Admin' : 'Set as Student'}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirmation('block', user);
                                        }}
                                        className={`w-24 py-1 ${user.blocked ? 'bg-opacity-40' : ''} bg-customRed text-customWhite rounded font-poppins font-medium box-border ${user.username === "admin" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={user.username === "admin"}
                                    >
                                        {user.blocked ? 'Unblock' : 'Block'}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirmation('delete', user);
                                        }}
                                        className={`w-24 py-1 bg-customRed text-customWhite rounded font-poppins font-medium ${user.username === "admin" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={user.username === "admin"}
                                    >
                                        Delete
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
                            <div className="flex flex-col gap-1 w-full items-center justify-center tablet:hidden">
                                <button
                                    onClick={(e) => {
                                        handleConfirmation('role', selectedUser);
                                    }}
                                    className={`w-32 py-1 ${selectedUser.blocked ? 'hidden' : ''} bg-customRed text-customWhite rounded font-poppins font-medium box-border ${selectedUser.username === "admin" ? 'opacity-50 cursor-not-allowed' : ''} tablet:hidden`}
                                    disabled={selectedUser.username === "admin"}
                                >
                                    {selectedUser.role === "STUDENT" ? 'Set as Admin' : 'Set as Student'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        handleConfirmation('block', selectedUser);
                                    }}
                                    className={`w-32 py-1 ${selectedUser.blocked ? 'bg-opacity-40' : ''} bg-customRed text-customWhite rounded font-poppins font-medium box-border ${selectedUser.username === "admin" ? 'opacity-50 cursor-not-allowed' : ''} tablet:hidden`}
                                    disabled={selectedUser.username === "admin"}
                                >
                                    {selectedUser.blocked ? 'Unblock' : 'Block'}
                                </button>

                                <button
                                    onClick={(e) => {
                                        handleConfirmation('delete', selectedUser);
                                    }}
                                    className={`w-32 py-1 bg-customRed text-customWhite rounded font-poppins font-medium ${selectedUser.username === "admin" ? 'opacity-50 cursor-not-allowed' : ''} tablet:hidden`}
                                    disabled={selectedUser.username === "admin"}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Confirmation
                isOpen={isConfirmationOpen}
                message={
                    confirmationAction === "role"
                        ? `Are you sure you want ${selectedUserConfirm?.firstName} ${selectedUserConfirm?.lastName} to be ${selectedUserConfirm?.role === "STUDENT" ? 'Admin' : 'Student'}?`
                        : `Are you sure you want to ${confirmationAction === "delete" ? "delete" : selectedUserConfirm?.blocked ? "unblock" : "block"} ${selectedUserConfirm?.firstName} ${selectedUserConfirm?.lastName}?`
                }
                actionType={
                    confirmationAction === 'role'
                        ? "NEUTRAL"
                        : confirmationAction === 'delete'
                            ? "NEGATIVE"
                            : selectedUserConfirm?.blocked
                                ? "POSITIVE"
                                : "NEGATIVE"
                }
                onConfirm={() => confirmAction(selectedUserConfirm!.id!)}
                onCancel={cancelAction}
            />
            {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
        </div>
    );
}

export default ManageUsers;