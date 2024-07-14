"use client";
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import Sidebar from '../Comps/Sidebar';
import Loading from '../Loader/Loading';
import { getAttendees } from '@/utils/apiCalls';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ReportsAndAnalysis: React.FC = () => {
    const [attendeesData, setAttendeesData] = useState<any[]>([]);
    const attendees: number[] = attendeesData.map(attendee => attendee.attendanceCount);
    const eventNames = attendeesData.map(attendee => attendee.event.eventName);

    const attendeeInfo = attendeesData.map(attendee => {
        const eventDate = new Date(attendee.event.eventStarts);
        const day = eventDate.getDate();

        return {
            name: attendee.event.eventName,
            date: day,
            count: attendee.attendanceCount,
        };
    });
    const sortedAttendees = [...attendeeInfo].sort((a, b) => b.count - a.count);
    const top3Threshold: number = sortedAttendees[2]?.count;
    const barColors: string[] = attendees.map(attendee =>
        attendee >= top3Threshold ? '#000000' : '#FDCC01'
    );


    const barData = {
        labels: eventNames,
        datasets: [
            {
                data: attendees,
                backgroundColor: barColors,
            },
        ],
    };

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'gray',
                },
                ticks: {
                    callback: function (value: any) {
                        return Number.isInteger(value) ? value : '';
                    },
                }
            },
            x: {
                grid: {
                    color: 'gray',
                },
            },
        },
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false
            },
        },
    };

    const likes = attendeesData.reduce((acc, attendee) => acc + attendee.event.likes, 0);
    const dislikes = attendeesData.reduce((acc, attendee) => acc + attendee.event.dislikes, 0);

    const doughnutData = {
        labels: ['Likes', 'Dislikes'],
        datasets: [{
            data: [likes, dislikes],
            backgroundColor: ['#FDCC01', '#000000'],
        }],
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendees = async () => {
            const data = await getAttendees();
            setAttendeesData(data);
            setLoading(false);
        };

        fetchAttendees();
    }, []);


    if (loading) {
        return <Loading />;
    }


    return (
        <div>
            <Sidebar />
            <div className="mt-5 mx-2 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-5">Reports and Analysis</h2>
                <div className="laptop:flex laptop:flex-wrap laptop:gap-5 laptop:items-center">
                    <div className="border-2 border-black w-full max-w-[24rem] mx-auto">
                        <h3 className='border-b-2 border-black bg-customYellow font-bold text-xl text-center'>TOP 3 NUMBER OF ATTENDEES</h3>
                        <div className="flex flex-col items-center justify-center my-2 gap-2">
                            {sortedAttendees[0] && (
                                <div className="flex justify-center items-center gap-1 w-full px-5">
                                    <p className="min-w-12 text-center text-4xl text-customYellow font-bebas" style={{ textShadow: '3px 0px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>1st</p>
                                    <p className="flex items-center justify-center rounded-full border border-black bg-customYellow box-border min-h-9 min-w-9 text-2xl font-bebas">{sortedAttendees[0].date}</p>
                                    <div className="flex bg-customYellow w-full border border-black rounded items-center px-2 justify-between">
                                        <p className="text-lg font-bold">{sortedAttendees[0].name}</p>
                                        <div className="flex items-center">
                                            <p className="font-bold text-lg">{sortedAttendees[0].count}</p>
                                            <img src="/groupicon.png" className="w-8 h-8" alt="Group Icon" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {sortedAttendees[1] && (
                                <div className="flex justify-center items-center gap-1 w-full px-5">
                                    <p className="min-w-12 text-center text-3xl font-bebas">2nd</p>
                                    <p className="flex items-center justify-center rounded-full border border-black bg-customYellow box-border min-h-9 min-w-9 text-2xl font-bebas">{sortedAttendees[1].date}</p>
                                    <div className="flex w-full border border-black rounded items-center px-2 justify-between">
                                        <p className="text-lg font-bold">{sortedAttendees[1].name}</p>
                                        <div className="flex items-center">
                                            <p className="font-bold text-lg">{sortedAttendees[1].count}</p>
                                            <img src="/groupicon.png" className="w-8 h-8" alt="Group Icon" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {sortedAttendees[2] && (
                                <div className="flex justify-center items-center gap-1 w-full px-5">
                                    <p className="min-w-12 text-center text-2xl font-bebas">3rd</p>
                                    <p className="flex items-center justify-center box-border rounded-full border border-black bg-customYellow box-border min-h-9 min-w-9 text-2xl font-bebas">{sortedAttendees[2].date}</p>
                                    <div className="flex w-full border border-black rounded items-center px-2 justify-between">
                                        <p className="text-lg font-bold">{sortedAttendees[2].name}</p>
                                        <div className="flex items-center">
                                            <p className="font-bold text-lg">{sortedAttendees[2].count}</p>
                                            <img src="/groupicon.png" className="w-8 h-8" alt="Group Icon" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-5 w-full max-w-[24rem] mx-auto laptop:order-first">
                        <h3 className="text-xl font-bold">Monthly Events Attendance Data</h3>
                        <div className="mb-8 border-2 border-black rounded-xl px-4">
                            <h3 className="text-2xl font-medium mb-2 text-end underline font-bebas">{new Date().toLocaleString('default', { month: 'long' }).toUpperCase()}</h3>
                            <div className="flex items-center justify-center w-full">
                                <p className="[writing-mode:vertical-lr] rotate-180 mb-4  font-bebas">Number of Attendees</p>
                                <div className="inline">
                                    <Bar data={barData} options={barOptions} />
                                </div>
                            </div>
                            <p className="text-center font-bebas">Events of the Month</p>
                        </div>
                    </div>
                    <div className="border-2 border-black mb-5 w-full max-w-[24rem] mx-auto">
                        <h3 className="text-xl font-bold text-customYellow bg-black">FEEDBACKS</h3>
                        <div className=" py-10">
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                            title: {
                                                display: true,
                                                text: 'Legend',
                                                color: '#000',
                                                font: {
                                                    size: 20
                                                }
                                            },
                                            labels: {
                                                color: '#000',
                                                font: {
                                                    size: 16
                                                }
                                            }
                                        },
                                    },
                                    aspectRatio: 2,
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportsAndAnalysis;
