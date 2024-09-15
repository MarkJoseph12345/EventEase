"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const EventTypeDistributionChart = ({ eventTypeDistribution }: { eventTypeDistribution: Record<string, number> }) => {
    const labels = Object.keys(eventTypeDistribution);
    const dataValues = Object.values(eventTypeDistribution);

    const numberOfLabels = labels.length;
    const barThickness = Math.max(10, 200 / numberOfLabels);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Event Type Distribution',
                data: dataValues,
                backgroundColor: '#FDCC01',
                borderColor: 'black',
                borderWidth: 2,
                barThickness: barThickness,
                maxBarThickness: 50,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    autoSkip: numberOfLabels > 10,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            }
        }
    };

    return (
        <div className="w-full max-w-96 tablet:w-96">
            <h2>Event Type Distribution</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default EventTypeDistributionChart;
