import React, { useState, useEffect } from "react";
import AddBudget from "./AddBudget";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditBudget from "./EditBudget";

const Budget = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [budget, setBudget] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBudget, setFilteredBudget] = useState([]);

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
    fetchBudget();
  }, [userId]);

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (budgetId) => {
    setOpenEditModal(true);
    setSelectedBudgetId(budgetId);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = budget.filter((budget) => {
      const matchesSearch = budget.budgetName
        ? budget.budgetName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesSearch;
    });

    setFilteredBudget(filtered);
  }, [searchQuery, budget]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/budget/${id}`);
        toast.success("Budget deleted successfully");
        fetchBudget();
      } catch (error) {
        toast.error("Failed to delete budget");
      }
    }
  };

  const totalBudget = budget.reduce((sum, item) => sum + item.price, 0);
  const totalUsedAmount = budget.reduce((sum, item) => sum + item.usedAmount, 0);
const totalRemainingAmount = budget.reduce((sum, item) => sum + (item.price - item.usedAmount), 0);


  return (
    <div className="bg-white p-5">
      <div className="flex justify-between bg-white">
        <div className="text-[18px] font-semibold">Budget</div>
        <div className="flex gap-4">
          <div>
            <input
              type="text"
              placeholder="Search budget"
              name="searchQueryName"
              value={searchQuery}
              onChange={handleSearchChange}
              className="rounded-lg border-2 border-gray-500 p-2 text-[14px] focus:border-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div>
            <button
              onClick={() => handleModalOpenClick()}
              className="rounded-full bg-[#FFC107] px-4 py-2 text-[15px] font-medium text-black border-2 border-black "
            >
              Add Budget
            </button>
          </div>
        </div>
      </div>
      <div className="my-10 flex gap-10">
        <div className="h-auto w-[200px] rounded-lg border-2 border-gray-300 p-4">
          <div className="font-extrabold uppercase">
            Rs.{totalBudget.toFixed(2)}
          </div>
          <div className="text-[14px] font-bold uppercase text-gray-600">
            Total Budget
          </div>
        </div>

        <div className="h-auto w-[200px] rounded-lg border-2 border-gray-300 p-4">
          <div className="font-extrabold uppercase">
            Rs.{totalUsedAmount.toFixed(2)}
          </div>
          <div className="text-[14px] font-bold uppercase text-gray-600">
            Total USED
          </div>
        </div>
        <div className="h-auto w-[200px] rounded-lg border-2 border-gray-300 p-4">
          <div className="font-extrabold uppercase">
            Rs.{totalRemainingAmount.toFixed(2)}
          </div>
          <div className="text-[14px] font-bold uppercase text-gray-600">
            Total LEFT
          </div>
        </div>
      </div>
      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Budget
              </th>
              <th scope="col" className="px-6 py-3">
                Used Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Balance Left
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBudget.length > 0 ? (
              filteredBudget.map((item) => {
                const usedPercentage = (item.usedAmount / item.price) * 100;

                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 bg-white text-gray-900"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium"
                    >
                      {item.budgetName}
                    </th>
                    <td className="px-6 py-4">Rs. {item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
  Rs. {item.usedAmount.toFixed(2)}
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 ">
    <div 
      className={`h-2.5 rounded-full ${usedPercentage > 100 ? 'bg-red-600' : 'bg-[#FFC107]'}`} 
      style={{ width: `${Math.min(usedPercentage, 100)}%` }}
    ></div>
  </div>
</td>

                    <td className="px-6 py-4 font-bold text-[#FFC107]">
                      Rs. {(item.price - item.usedAmount).toFixed(2)}
                    </td>
                    <td className="flex gap-4 px-6 py-4">
                      <button
                        onClick={() => handleEditModalOpenClick(item._id)}
                        className="rounded-md bg-black px-2 py-1 font-medium text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-md bg-red-600 px-2 py-1 font-medium text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No budgets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddBudget
        isOpen={openModal}
        onClose={handleModalClose}
        fetchBudget={fetchBudget}
      />
      <EditBudget
        isOpen={openEditModal}
        onClose={handleModalClose}
        fetchBudget={fetchBudget}
        selectedBudgetId={selectedBudgetId}
      />
      <ToastContainer />
    </div>
  );
};

export default Budget;
