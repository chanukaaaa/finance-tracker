import React from "react";
import { Card, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import logo from "./../../assets/images/mintify4.png";
import { useState } from "react";
import { useEffect } from "react";
import { ReportIcon, UserProfileIcon } from "../../utils/icons";
import { useStateContext } from "../../contexts/NavigationContext";
import { ChartBarIcon } from "@heroicons/react/24/outline";

import {
  GoalIcon,
  MoneyIcon,
  ExpensiveIcon,
  BudgetIcon,
} from "../../utils/icons";

const newNavigationItems = [
  {
    title: "Dashboard",
    link: "/",
    icon: ChartBarIcon,
  },
  {
    title: "Budget",
    link: "/budget",
    icon: BudgetIcon,
  },
  {
    title: "Income",
    link: "/income",
    icon: MoneyIcon,
  },
  {
    title: "Expense",
    link: "/expense",
    icon: ExpensiveIcon,
  },
  {
    title: "Goal",
    link: "/goal",
    icon: GoalIcon,
  },
  // {
  //   title: "Reports",
  //   link: "/reports",
  //   icon: ReportIcon,
  // },
];

export const SideBar = ({ handleSidebar, sidebar }) => {
  const { user } = useStateContext();
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState(location.pathname);

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location.pathname]);
  
  return (
    <Card
      className={`fade-right-enter-active scrollbar-y-style fixed z-50 flex h-full w-[60%] transform flex-col items-start overflow-y-auto rounded-none bg-[#000000] p-2 font-inter transition duration-500 ease-in-out md:w-[16%] md:opacity-100 ${
        sidebar ? "fade-right-enter-to" : "fade-right-enter-from"
      } `}
    >
      <div className="relative mb-2 flex items-center gap-4 p-4">
        <img src={logo} alt="brand" className="w-[80%] md:w-[150px]" />
        <span
          onClick={handleSidebar}
          className="absolute right-0 top-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </span>
      </div>
      <li className="w-full list-none">
        {newNavigationItems.map((item, itemIndex) => {
          let NavIcon = item.icon;
          return (
            <Link to={`${item.link !== "#" ? item.link : "#"}`}>
              <ListItem
  className={`w-full rounded-sm text-[14px] font-bold 
    ${
      currentUrl === item.link 
        ? "bg-[#FFC107] text-black" 
        : "text-white"
    } 
    hover:bg-[#FFC107] hover:text-black focus:bg-[#FFC107] focus:text-black`}
>

                <ListItemPrefix>
                  <NavIcon className="h-5 w-5" />
                </ListItemPrefix>
                <span className="mr-2 flex-1 text-[14px] font-normal">
                  {item.title}
                </span>
              </ListItem>
            </Link>
          );
        })}
      </li>
      <div className="item-center absolute bottom-0 -ml-2 flex h-[60px] w-full justify-center gap-3 border-t-[1px] border-[#5a5a5a] p-3">
        <UserProfileIcon className="h-6 w-6 text-white" />
        <div className="flex items-center justify-center text-[14px] text-white">
          {user.name}
        </div>
      </div>
    </Card>
  );
};
