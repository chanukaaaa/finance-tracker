import React, { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";
import Summary from "./Summary";
import IncomeVsExpense from "./IncomeVsExpense";
import BudgetVsExpense from "./BudgetVsExpense";
import GoalSummary from "./GoalSummary";

export const Dashboard = () => {
  const { user } = useStateContext();
  const userId = user.id;

  const [data, setData] = useState([]);
  const [budget, setBudget] = useState([]);

  const fetchDashBoardData = async () => {
    try {
      const response = await axiosClient.get(`/dashboard/${userId}`);
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch budgets");
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await axiosClient.get(`/budget/user/${userId}`);
      setBudget(response.data);
      setFilteredBudget(response.data);
    } catch (error) {
      toast.error("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    fetchDashBoardData();
    fetchBudget();
  }, [userId]);

  const totalBudget = budget.reduce((sum, item) => sum + item.price, 0);
  const totalUsedAmount = budget.reduce(
    (sum, item) => sum + item.usedAmount,
    0,
  );
  const totalRemainingAmount = budget.reduce(
    (sum, item) => sum + (item.price - item.usedAmount),
    0,
  );
  return (
    <div>
      <div>
        <Summary data={data} />
      </div>
      <div className="my-5 flex gap-5">
        <div className="w-[60%]">
          <IncomeVsExpense data={data} />
        </div>
        <div className="w-[40%]">
          <BudgetVsExpense
            totalBudget={totalBudget}
            totalUsedAmount={totalUsedAmount}
            totalRemainingAmount={totalRemainingAmount}
          />
        </div>
      </div>
      <div>
        <GoalSummary data={data} />
      </div>
    </div>
  );
};
