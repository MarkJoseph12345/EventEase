"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, ArcElement);

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const DepartmentEngagement = ({ departmentEngagement }: { departmentEngagement: Record<string, number> }) => {
    const labels = Object.keys(departmentEngagement);
    const values = Object.values(departmentEngagement);

    const backgroundColors = values.map(() => getRandomColor());

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
        plugins: {
            legend: {
                display: false,
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
        <div className="w-full max-w-96 tablet:w-48">
            <h2>Department Engagement</h2>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default DepartmentEngagement;
