import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { MainLayout } from "../components/layouts/MainLayout";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { GuestLayout } from "../components/layouts/GuestLayout";
import Budget from "../pages/budget/Budget";
import AddBudget from "../pages/budget/AddBudget";
import Income from "../pages/income/Income";
import AddIncome from "../pages/income/AddIncome";
import Goal from "../pages/goal/Goal";
import AddGoal from "../pages/goal/AddGoal";
import Expense from "../pages/expense/Expense";
import AddExpense from "../pages/expense/AddExpense";
import Report from "../pages/reports/Report";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/budget",
        element: <Budget />,
      },
      {
        path: "/budget/add",
        element: <AddBudget />,
      },
      {
        path: "/income",
        element: <Income />,
      },
      {
        path: "/income/add",
        element: <AddIncome />,
      },
      {
        path: "/goal",
        element: <Goal />,
      },
      {
        path: "/goal/add",
        element: <AddGoal />,
      },
      {
        path: "/expense",
        element: <Expense />,
      },
      {
        path: "/expense/add",
        element: <AddExpense />,
      },
      {
        path: "/reports",
        element: <Report />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
