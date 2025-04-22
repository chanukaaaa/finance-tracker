import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const IncomeVsExpense = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (data && data.allIncome && data.allExpenses) {
      setLoading(false);
    }
  }, [data]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const processMonthlyData = (transactions) => {
    const monthlyTotals = Array(12).fill(0);
    transactions?.forEach(({ amount, createdAt }) => {
      const monthIndex = new Date(createdAt).getMonth();
      monthlyTotals[monthIndex] += amount;
    });
    return monthlyTotals;
  };

  const incomeData = processMonthlyData(data.allIncome);
  const expenseData = processMonthlyData(data.allExpenses);

  const chartConfig = {
    type: "bar",
    height: 270,
    series: [
      {
        name: "Income",
        data: incomeData,
      },
      {
        name: "Expense",
        data: expenseData,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        margin: 0,
        padding: 0,
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#00f01d", "#FF4C4C"],
      plotOptions: {
        bar: {
          columnWidth: "8px",
          borderRadius: 0,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#737B8B",
            fontSize: "11px",
            fontFamily: "Poppins",
            fontWeight: 400,
          },
        },
        categories: months,
      },
      yaxis: {
        labels: {
          show: false,
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: false,
        borderColor: "#E0EDF1",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        markers: {
          width: 12,
          height: 12,
          radius: "50%",
        },
        labels: {
          colors: "#737B8B",
          useSeriesColors: false,
          fontSize: "12px",
          fontFamily: "Poppins",
          fontWeight: 400,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 5,
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="mb-5 h-auto w-full bg-white md:mb-0 p-4">
        <div className="flex flex-col ">
          <div className="w-auto md:flex md:justify-between">
            <h3 className=" text-[16px] font-semibold leading-[24px]">
            Monthly Income vs Expense - {currentYear}
            </h3>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <Chart {...chartConfig} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpense;
