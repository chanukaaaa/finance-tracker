import React from "react";
import { ExpenseIcon, IncomeIcon, SavingIcon, WalletIcon } from "../../utils/icons";

const Summary = ({ data }) => {
  return (
    <div className="flex gap-10">
      <div className="h-auto w-1/4 border-2 border-black bg-[black] p-4">
      <div className="px-2 py-1  bg-amber-400  w-[45px] rounded-full mb-4"><WalletIcon/></div>
        <div className="text-[13px] font-bold uppercase text-gray-300">
          Current Total Saving
        </div>
        <div className="pt-1 text-[20px] font-extrabold uppercase text-white">
        Rs.{data.totalSaving ? parseFloat(data.totalSaving).toFixed(2) : "0.00"}
        </div>
      </div>

      <div className="h-auto w-1/4 border-2 border-white bg-white p-4">
      <div className="px-2 py-1  bg-gray-200  w-[45px] rounded-full mb-4"><SavingIcon/></div>
        <div className="text-[13px] font-bold uppercase text-gray-700">
          month Saving
        </div>
        <div className="pt-1 text-[20px] font-extrabold uppercase text-black">
          
        Rs.{(
  (parseFloat(data.totalIncome) || 0) - (parseFloat(data.totalExpense) || 0)
).toFixed(2)}

        </div>
      </div>

      <div className="h-auto w-1/4 border-2 border-white bg-white p-4">
      <div className="px-2 py-1  bg-gray-200  w-[45px] rounded-full mb-4"><IncomeIcon/></div>
        <div className="text-[13px] font-bold uppercase text-gray-700">
          month total income
        </div>
        <div className="pt-1 text-[20px] font-extrabold uppercase text-black">
        Rs.{(parseFloat(data.totalIncome) || 0).toFixed(2)}

        </div>
      </div>

      <div className="h-auto w-1/4 border-2 border-white bg-white p-4">
      <div className="px-2 py-1  bg-gray-200  w-[45px] rounded-full mb-4"><ExpenseIcon/></div>
        <div className="text-[13px] font-bold uppercase text-gray-700">
          month total expense
        </div>
        <div className="pt-1 text-[20px] font-extrabold uppercase text-black">
          Rs.{(parseFloat(data.totalExpense) || 0).toFixed(2)}

        </div>
      </div>
    </div>
  );
};

export default Summary;
