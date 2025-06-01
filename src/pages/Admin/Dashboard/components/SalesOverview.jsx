import React, {useEffect, useMemo, useState, useRef} from 'react';
import {Chart as ChartJS, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend} from 'chart.js';
import {format, subDays, parseISO, isSameDay} from 'date-fns';
import {id} from 'date-fns/locale';
import BillService from "@services/billService.js";

// Register required Chart.js components
ChartJS.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const SalesOverview = ({refresh}) => {
    const billService = useMemo(() => BillService(), []);
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Pendapatan (Rp)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        let isMounted = true;
        const getOrdersPastWeek = async () => {
            try {
                const sevenDaysAgo = subDays(new Date(), 7);

                // 2. Format tanggal ke YYYY-MM-DD (format yang umum untuk API)
                const formatDate = (date) => format(date, 'yyyy-MM-dd');

                // 3. Buat parameter object
                const params = {
                    startDate: formatDate(sevenDaysAgo),
                    endDate: formatDate(new Date()),
                    status: 'paid',
                    paging: 0,
                };

                const response = await billService.getAll(params);
                if (!isMounted) return;

                const today = new Date();
                const dateRange = Array.from({length: 7}, (_, i) => subDays(today, i)).reverse();

                const labels = dateRange.map(date =>
                    format(date, 'EEEE, dd MMM', {locale: id})
                );

                const dailyTotals = dateRange.map(() => 0);

                response.data.data.forEach(order => {
                    const orderDate = parseISO(order.trans_date);
                    dateRange.forEach((date, index) => {
                        if (isSameDay(orderDate, date)) {
                            dailyTotals[index] += order.final_price;
                        }
                    });
                });

                if (isMounted) {
                    setChartData({
                        labels,
                        datasets: [
                            {
                                ...chartData.datasets[0],
                                data: dailyTotals,
                            },
                        ],
                    });
                }

            } catch (e) {
                console.error('Error fetching orders:', e);
            }
        };

        getOrdersPastWeek();

        return () => {
            isMounted = false;
        };
    }, [billService, refresh]);

    // Chart initialization and update effect
    useEffect(() => {
        if (!canvasRef.current) return;

        // Destroy previous chart instance if exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create new chart instance
        chartRef.current = new ChartJS(canvasRef.current, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Rp ${context.raw.toLocaleString('id-ID')}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return `Rp ${value.toLocaleString('id-ID')}`;
                            }
                        }
                    }
                }
            }
        });

        // Cleanup function
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [chartData, refresh]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold text-center mb-4">Overview Pendapatan Harian (7 Hari Terakhir)</h2>
            <div className="relative h-96 w-full">
                <canvas ref={canvasRef}/>
            </div>
        </div>
    );
};

export default SalesOverview;