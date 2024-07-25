"use client"
import "react-datepicker/dist/react-datepicker.css";
import { Event, EventDetailModal } from '@/utils/interfaces';
import { Doughnut } from 'react-chartjs-2';
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
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);


const ViewFeedback = ({ event, onClose }: EventDetailModal) => {
    const doughnutData = {
        labels: ['Likes', 'Dislikes', ],
        datasets: [
            {
                data: [event.likes, event.dislikes],
                backgroundColor: [
                    '#FDCC01',
                    '#000000',
                ],
            },
        ],
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="border-2 border-black mb-5 max-w-[24rem] mx-auto bg-white w-11/12">
                <div className="flex bg-black">
                <h3 className="text-xl font-bold text-customYellow flex-1">FEEDBACKS</h3>
                <p className="sticky top-0 text-end text-customYellow font-bold text-2xl z-10 cursor-pointer" onClick={onClose}>✖</p>
                </div>
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
    )
}

export default ViewFeedback;