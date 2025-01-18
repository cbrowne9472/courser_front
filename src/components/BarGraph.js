import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJs,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
} from "chart.js";

// Register only the required components
ChartJs.register(CategoryScale, BarElement, Title, Tooltip);

export const BarChart = ({ ratingData, darkMode }) => {
    // Prepare the data for the chart
    const labels = Object.keys(ratingData.ratings); // Extract keys (rating labels)
    const values = Object.values(ratingData.ratings); // Extract values (counts)

    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: darkMode
                    ? "rgba(255, 69, 58, 0.8)" // Red for dark mode
                    : "rgba(75, 192, 192, 0.6)", // Light color for light mode
                borderColor: darkMode
                    ? "rgba(255, 69, 58, 1)" // Dark red border for dark mode
                    : "rgba(75, 192, 192, 1)", // Light color border for light mode
                borderWidth: 0, // Remove border for a flat look
                borderRadius: 4, // Add rounded corners to bars
                barPercentage: 0.8, // Adjust bar width
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            title: {
                display: false, // Remove the chart title
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Remove gridlines on x-axis
                },
            },
            y: {
                grid: {
                    color: darkMode
                        ? "rgba(255, 255, 255, 0.1)" // Subtle gridlines for dark mode
                        : "rgba(0, 0, 0, 0.1)", // Subtle gridlines for light mode
                },
                ticks: {
                    stepSize: 50, // Adjust tick spacing
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};
