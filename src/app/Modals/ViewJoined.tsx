import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Event, EventDetailModal, User } from '@/utils/interfaces';
import { getAllUsersJoinedToEvent, getAllUsersAfterAttendance, me } from '@/utils/apiCalls';
import Loading from '../Loader/Loading';

const ViewJoined = ({ event, onClose }: EventDetailModal) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsersAndAttendance = async () => {
            setLoading(true);
            try {
                const usersData = await getAllUsersJoinedToEvent(event.id!);
                const attendedUsers = await getAllUsersAfterAttendance(event.id!);
    
                const attendedUserIds = attendedUsers.map((user: { id: any; }) => user.id);
    
                const updatedUsers = usersData.map(user => ({
                    ...user,
                    hasAttended: attendedUserIds.includes(user.id)
                }));
                
                setUsers(updatedUsers);
            } catch (error) {
                console.error('Error fetching users or attendance:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsersAndAttendance();
    }, [event.id]);
    
    

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-2 rounded-md shadow-md w-11/12 max-h-[95%] overflow-auto relative laptop:max-w-[50rem]">
                <div className="flex bg-black p-2">
                    <h3 className="text-xl font-bold text-customYellow flex-1">View Joined</h3>
                    <p className="text-end text-customYellow font-bold text-2xl cursor-pointer" onClick={onClose}>✖</p>
                </div>
                <div className="p-4">
                    {loading ? (
                        <Loading />
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Email/Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Attended
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.hasAttended ? (
                                                    <span className="text-green-500">&#10003;</span>
                                                ) : (
                                                    <span className="text-red-500">&#10007;</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                            No users have joined yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewJoined;