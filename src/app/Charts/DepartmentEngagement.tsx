"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, ArcElement);


const predefinedColors = [
    '#FDCC01', '#AE0404', '#000000', '#FFFFFF'
];


const DepartmentEngagement = ({ departmentEngagement }: { departmentEngagement: Record<string, number> }) => {
    const labels = Object.keys(departmentEngagement);
    const values = Object.values(departmentEngagement);

    const backgroundColors = values.map((_, index) => predefinedColors[index % predefinedColors.length]);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Department Engagement',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'black',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                display: true,
                position: 'right'  as const,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: any) {
                        return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}`;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full max-w-96 tablet:w-96 h-64 bg-gray-100 flex flex-col">
            <h2 className="px-3 py-3 text-xs font-medium text-customYellow uppercase tracking-wider bg-black">Department Engagement</h2>
            <div className=" mx-auto py-2 flex-1">
            <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default DepartmentEngagement;
