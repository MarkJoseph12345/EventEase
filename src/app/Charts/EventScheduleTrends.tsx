"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, ArcElement } from 'chart.js';
import { formatDate } from '@/utils/data';

ChartJS.register(Tooltip, ArcElement);

const predefinedColors = [
    '#FDCC01', '#AE0404', '#000000', '#FFFFFF', '#F6F6F6',
    '#FF9F40', '#FF5733', '#C70039', '#900C3F', '#581845'
];



const EventScheduleTrends = ({ eventSchedulingTrends }: { eventSchedulingTrends: Record<string, number> }) => {
    const labels = Object.keys(eventSchedulingTrends).map(date => formatDate(date));
    const values = Object.values(eventSchedulingTrends);

    const backgroundColors = values.map((_, index) => predefinedColors[index % predefinedColors.length]);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'black',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: any) {
                        return `${tooltipItem.raw}`;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full max-w-96 tablet:w-96 h-64 bg-gray-100">
            <h2 className="px-3 py-3 text-xs font-medium text-customYellow uppercase tracking-wider bg-black">Event Scheduling Trends</h2>
            <div className="max-w-48 mx-auto py-2">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default EventScheduleTrends;