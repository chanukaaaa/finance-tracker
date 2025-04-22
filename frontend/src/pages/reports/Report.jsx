import React, { useState, useEffect } from "react";
import MonthlySummaryReport from "./MonthlySummaryReport";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";
import GoalReport from "./GoalReport";
import MonthlyBudgetReport from "./MonthlyBudgetReport";
import MonthlyExpenseReport from "./MonthlyExpenseReport";
import MonthlyIncomeReport from "./MonthlyIncomeReport";

const Report = () => {
  const { user } = useStateContext();
  const userId = user.id;

  const getCurrentMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return { year, month };
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[parseInt(monthNumber, 10) - 1];
  };

  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    const { year, month } = getCurrentMonth();
    setSelectedYear(year);
    setSelectedMonth(month);
    setCurrentMonth(`${year}-${month}`);
  }, []);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setCurrentMonth(newMonth);
    const [year, month] = newMonth.split("-");
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const fetchReportData = async () => {
    try {
      const response = await axiosClient.get(
        `/report/${userId}/${selectedYear}/${selectedMonth}`,
      );
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch report data");
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [userId, selectedYear, selectedMonth]);

  let date = selectedYear +" "+ getMonthName(selectedMonth);
  console.log(date)
  return (
    <div className="bg-white p-5">
      <div className="text-[20px] font-semibold"> {selectedYear} {getMonthName(selectedMonth)} Reports</div>
      <input
        type="month"
        value={selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : currentMonth}
        onChange={handleMonthChange}
        className="mt-10 rounded-md border-2 border-gray-400 px-2 py-1 text-[13px]"
      />

      <div className="mb-5 mt-10 flex gap-5">
        {[
          { key: "summary", label: "Monthly Summary Report" },
          { key: "income", label: "Monthly Income Report" },
          { key: "expense", label: "Monthly Expense Report" },
          { key: "budget", label: "Monthly Budget Report" },
          { key: "goal", label: "Goal Report" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded px-2 py-1 font-bold transition-colors duration-300 ${
              activeTab === tab.key
                ? "bg-[#25C935] text-white"
                : "border-2 border-[#25C935] bg-white text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "summary" && <MonthlySummaryReport data={data} date={date}/>}
        {activeTab === "income" && <MonthlyIncomeReport
            data={data.incomes}
             date={date}
          />}
        {activeTab === "expense" && <MonthlyExpenseReport
            data={data.expenses}
            s date={date}
          />}
        {activeTab === "budget" && (
          <MonthlyBudgetReport
            data={data.budgetsWithUsedAmount}
            saving={data.summary[0].totalSaving} date={date}
          />
        )}
        {activeTab === "goal" && (
          <GoalReport date={date}
            data={data.goals}
            saving={data.summary[0].totalSaving}
          />
        )}
      </div>
    </div>
  );
};

export default Report;
