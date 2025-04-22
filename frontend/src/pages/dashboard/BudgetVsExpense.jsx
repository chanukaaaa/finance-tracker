import React from "react";
import Chart from "react-apexcharts";

const BudgetVsExpense = ({
  totalBudget,
  totalUsedAmount,
  totalRemainingAmount,
}) => {
  const chartData = [totalUsedAmount, totalRemainingAmount];
  const chartLabels = ["Total Used Amount", "Total Remaining Amount"];

  const chartConfig = {
    series: chartData,
    options: {
      chart: {
        type: "donut",
        height: "100%",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "22px",
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "#263238",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "16px",
                fontFamily: "Poppins",
                fontWeight: 400,
                color: "#263238",
                offsetY: 10,
              },
              total: {
                show: true,
                showAlways: true,
                label: "Total Budget (Rs)",
                fontSize: "12px",
                fontFamily: "Poppins",
                fontWeight: 700,
                color: "#222529",
              },
            },
          },
        },
      },
      labels: chartLabels,
      dataLabels: {
        enabled: false,
      },
      colors: ["#62B2FD", "#00f01d"],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        markers: {
          width: 8,
          height: 8,
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
      fill: {
        type: "solid",
      },
      tooltip: {
        theme: "dark",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="mb-5 h-full w-full bg-white p-4 md:mb-0">
      <div className="flex flex-col">
        <div className="w-auto md:flex md:justify-between">
          <h3 className="text-[16px] font-semibold leading-[24px]">
            Budget Usage
          </h3>
        </div>
        <div className="flex items-start  px-6 pt-4">
          <Chart
            options={chartConfig.options}
            series={chartConfig.series}
            type="donut"
            height={300}
          />
          <div className="flex flex-col gap-5 pt-10">
            <div className="flex items-center gap-3">
              <div className="w-[8px] aspect-square bg-[#00f01d] rounded-full"></div>
              <div className="font-poppins text-[12px] font-bold text-[#2A2E33]">
                Rs.{totalRemainingAmount.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[8px] aspect-square bg-[#62B2FD] rounded-full"></div>
              <div className="font-poppins text-[12px] font-bold text-[#2A2E33]">
                Rs.{totalUsedAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetVsExpense;
