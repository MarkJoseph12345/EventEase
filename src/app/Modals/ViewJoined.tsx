import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { EventDetailModal, User } from '@/utils/interfaces';
import { getAllUsersJoinedToEvent, getAllUsersAfterAttendance, me, getAttendanceAndTimeout } from '@/utils/apiCalls';
import Loading from '../Loader/Loading';
import { formatDate } from '@/utils/data';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
const ViewJoined = ({ event, onClose }: EventDetailModal) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsersAndAttendance = async () => {
            setLoading(true);
            try {
                const usersData = await getAllUsersJoinedToEvent(event.id!);
                const attendedUsers = await getAllUsersAfterAttendance(event.id!);
                const attendedUserIds = attendedUsers.map((user: { id: any; }) => user.id);
                const attendanceDataPromises = usersData.map(async (user) => {
                    const userId = user.id;
                    const attendanceData = await getAttendanceAndTimeout(userId!, event.id!);
                    return {
                        ...user,
                        hasAttended: attendedUserIds.includes(userId),
                        attendanceData,
                    };
                });
                const updatedUsers = await Promise.all(attendanceDataPromises);
                setUsers(updatedUsers);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndAttendance();
    }, [event.id]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);


    const downloadPDF = () => {
        const doc = new jsPDF();
        const table = document.getElementById("user-table");
        doc.autoTable({ html: table });
        doc.save(event.eventName + " Attendance.pdf");
    };

    const downloadExcel = () => {
        const table = document.getElementById("user-table");
        const ws = XLSX.utils.table_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, event.eventName + " Attendance.xlsx");
    };

    return (
        <div className={`fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {loading ? (
                <div></div>
            ) : (
                <div className={`bg-white shadow-md w-11/12 max-h-[95%] overflow-auto relative laptop:max-w-fit`}>
                    <div className="flex bg-black p-2 w-full">
                        <h3 className="text-xl font-bold text-customYellow flex-1">Participants</h3>
                        <p className="text-end text-customYellow font-bold text-2xl cursor-pointer" onClick={() => { setLoading(true); setTimeout(onClose, 100); }}>✖</p>
                    </div>
                    <div className="flex justify-end gap-4 my-4 mr-4">
                        <p onClick={downloadPDF} className="cursor-pointer  hover:underline">Download as PDF</p>
                        <p onClick={downloadExcel} className="cursor-pointer hover:underline">Download as Excel</p>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table id="user-table" className="min-w-full divide-y divide-gray-200">
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
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Attended
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Attendance Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Time Out Time
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
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.hasAttended ? (
                                                    <span className="text-green-500">&#10003;</span>
                                                ) : (
                                                    <span className="text-red-500">&#10007;</span>
                                                )}
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.attendanceData && user.attendanceData.attendedTimes && user.attendanceData.attendedTimes.length > 0 ? (
                                                    <span>{formatDate(user.attendanceData.attendedTimes)}</span>
                                                ) : (
                                                    <span className="">No attendance recorded</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {user.attendanceData && user.attendanceData.timeoutTimes && user.attendanceData.timeoutTimes.length > 0 ? (
                                                    <span>{formatDate(user.attendanceData.timeoutTimes)}</span>
                                                ) : (
                                                    <span className="">No timeout recorded</span>
                                                )}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            No users have joined yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewJoined;