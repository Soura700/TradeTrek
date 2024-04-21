import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const PieChart = ({product_id}) => {

  const [positivePercentage, setPositivePercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const chartRef = useRef(null);
  
  const chartInstance = useRef(null); 

  useEffect(() => {
    // Make a request to your Flask API to get positive and negative counts
    axios.post('http://localhost:5000/api/predict', { product_id: product_id })
      .then(response => {
        const { positive_percentage, negative_percentage } = response.data;
        setPositivePercentage(positive_percentage);
        setNegativePercentage(negative_percentage);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    // Render the pie chart when positive and negative counts are updated
    renderPieChart();
  }, [positivePercentage, negativePercentage]);

  const renderPieChart = () => {
    if (chartInstance.current) {
      // If chart instance exists, destroy it
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext('2d');

    chartInstance.current =  new Chart(myChartRef, {
      type: 'pie',
      data: {
        labels: ['Positive', 'Negative'],
        datasets: [
          {
            data: [positivePercentage, negativePercentage],
            backgroundColor: ['#36a2eb', '#ff6384'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        width: 300, // Set the width of the chart
        height: 200, // Set the height of the chart
      }
    })
  };

  return (
    <div>
      <canvas ref={chartRef} style={{width: "300px" , height:"200px"}} id="pie-chart"></canvas>
    </div>
  );
};

export default PieChart;


