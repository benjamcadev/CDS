import React from 'react';
import Chart from 'react-apexcharts';


export default function ChartLine({ categories, series }) {


    const state = {
        series: series,
        options: {
            chart: {
                type: 'line',
                stacked: false,
            },
            dataLabels: {
                enabled: true,
            },
            markers: {
                size: 0,
            },
            xaxis: {
                categories: categories,
            },
            yaxis: {
                title: {
                    text: 'Cantidad',
                },
            },
            tooltip: { 
                fixed: {
                    enabled: true,
                    position: 'topLeft', // o 'topRight'
                    offsetY: 30,
                    offsetX: 60
                  },
            }
        }
    }

    return (
        <div>
            <Chart
                options={state.options}
                series={state.series}
                type="line"
                height={350}
            />
        </div>
    )

};



