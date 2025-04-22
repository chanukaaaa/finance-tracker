import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "./../../assets/images/print_logo.png";

const MonthlySummaryReport = ({ data, date }) => {
  console.log(data)
  const componentRef = useRef();
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const formatDateTime = () => {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString("en-US", options);
      const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
      return `Generated ${formattedDate} at ${formattedTime}`;
    };
    setCurrentDateTime(formatDateTime());
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print Preview",
  });

  return (
    <div>
      <div ref={componentRef} className="print-content p-2">
        <div className="flex justify-between">
          <img src={logo} alt="brand" className="w-[200px]" />
          <div className="mt-6">
            <div className="text-[25px] font-[600]">Monthly Summary Report</div>
            <div className="text-right text-[16px] font-semibold">{date}</div>
            <div className="text-right text-[14px]">{currentDateTime}</div>
          </div>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right mt-5">
        <thead className="bg-gray-100 text-xs font-extrabold text-gray-700">
          <tr className="border-[1px] border-gray-500">
            <th scope="col" className="px-6 py-3 border-r-[1px] border-gray-500">
              Total Saving
            </th>
            <th scope="col" className="px-6 py-3">
            Rs. {data?.summary?.[0]?.totalSaving 
          ? parseFloat(data.summary[0].totalSaving).toFixed(2) 
          : "0.00"}
            </th>
          </tr>
          <tr className="border-[1px] border-gray-500">
            <th scope="col" className="px-6 py-3 border-r-[1px] border-gray-500">
              Month Total Income
            </th>
            <th scope="col" className="px-6 py-3">
            Rs. {data?.summary?.[0]?.totalIncome 
          ? parseFloat(data.summary[0].totalIncome).toFixed(2) 
          : "0.00"}
            </th>
          </tr>
          <tr className="border-[1px] border-gray-500">
            <th scope="col" className="px-6 py-3 border-r-[1px] border-gray-500">
            Month Total Expense
            </th>
            <th scope="col" className="px-6 py-3">
            Rs. {data?.summary?.[0]?.totalExpense 
          ? parseFloat(data.summary[0].totalExpense).toFixed(2) 
          : "0.00"}
            </th>
          </tr>
          <tr className="border-[1px] border-gray-500">
            <th scope="col" className="px-6 py-3 border-r-[1px] border-gray-500">
            Month Total Saving
            </th>
            <th scope="col" className="px-6 py-3">
            Rs. {data?.summary?.[0]?.totalExpense &&  data?.summary?.[0]?.totalIncome
          ? (parseFloat(data.summary[0].totalIncome) - parseFloat(data.summary[0].totalExpense)).toFixed(2)
          : "0.00"}
            </th>
          </tr>
        </thead>
      </table>
      </div>

      <div className="m-2 text-right">
        <button
          className="rounded-full border-2 border-[#25C935] bg-[#7fff8c] px-5 py-2 text-[14px] font-bold"
          onClick={handlePrint}
        >
          Print PDF
        </button>
      </div>
    </div>
  );
};

export default MonthlySummaryReport;
