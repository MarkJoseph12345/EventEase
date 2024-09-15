"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, ArcElement } from 'chart.js';
import { formatDate } from '@/utils/data';

ChartJS.register(Tooltip, ArcElement);

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const EventScheduleTrends = ({ eventSchedulingTrends }: { eventSchedulingTrends: Record<string, number> }) => {
    const labels = Object.keys(eventSchedulingTrends).map(date => formatDate(date));
    const values = Object.values(eventSchedulingTrends);

    const backgroundColors = values.map(() => getRandomColor());

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Event Scheduling Trends',
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
        <div className="w-full max-w-96 tablet:w-48">
            <h2>Event Scheduling Trends</h2>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default EventScheduleTrends;
