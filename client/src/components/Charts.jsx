
import React from 'react';
import "chart.js/auto";
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';


const LineChart = ({ chartdata, labels, label,
  backgroundColor = 'rgba(0, 0, 192, 0.2)',
  borderColor = 'rgba(0, 0, 192, 1)'
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: chartdata,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category', // Use 'category' type for x-axis scale
        labels: labels,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};


const BarChart = ({ chartdata, labels, label,
  backgroundColor = 'rgba(0, 0, 192, 0.2)',
  borderColor = 'rgba(0, 0, 192, 1)'
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: chartdata,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category', // Use 'category' type for x-axis scale
        labels: labels,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};


const PieChart = ({ chartdata, labels, label, backgroundColor }) => {

  const data = {
    labels: labels,
    datasets: [{
      label: label,
      data: chartdata,
      backgroundColor: backgroundColor,
      borderWidth: 1,
    }],
  };

  const options = {}

  return (
      <Pie data={data} options={options} />
  );
};

const DoughnutChart = ({ chartdata, labels, label, backgroundColor }) => {

  const data = {
    labels: labels,
    datasets: [{
      label: label,
      data: chartdata,
      backgroundColor: backgroundColor,
      borderWidth: 1,
    }],
  };

  const options = {}

  return (
      <Doughnut data={data} options={options} />
  );
};

export { LineChart, BarChart, PieChart, DoughnutChart };
