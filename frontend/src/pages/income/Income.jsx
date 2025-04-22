import React, { useState, useEffect } from "react";
import AddIncome from "./AddIncome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditIncome from "./EditIncome";

const Income = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [income, setIncome] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIncome, setFilteredIncome] = useState([]);

  const fetchIncome = async () => {
    try {
      const response = await axiosClient.get(`/income/user/${userId}`);
      setIncome(response.data);
      setFilteredIncome(response.data);
    } catch (error) {
      console.error("Fetch Income Error:", error.response?.data || error.message);
      toast.error("Failed to fetch incomes");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [userId]);

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (incomeId) => {
    console.log("Edit button clicked for Income ID:", incomeId);
    setSelectedIncomeId(incomeId);
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
    setSelectedIncomeId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();


    useEffect(() => {
      const filtered = income.filter((income) => {
        const incomeDate = new Date(income.createdAt);
        const incomeYear = incomeDate.getFullYear();
        const incomeMonth = incomeDate.getMonth();
  
        return (
          incomeYear === currentYear &&
          incomeMonth === currentMonth &&
          income.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredIncome(filtered);
    }, [searchQuery, income]);

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
        await axiosClient.delete(`/income/${id}`);
        toast.success("Income deleted successfully");
        fetchIncome();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(`Failed to delete income: ${error.response?.data.message || error.message}`);
      }
    }
  };

  const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-white p-5">
      <div className="flex justify-between">
        <div className="text-[18px] font-semibold">Income</div>
        <div className="flex gap-4">
          <div>
            <input
              type="text"
              placeholder="Search income"
              name="searchQueryName"
              value={searchQuery}
              onChange={handleSearchChange}
              className="rounded-lg border-2 border-gray-500 p-2 text-[14px] focus:border-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div>
            <button
              onClick={() => handleModalOpenClick()}
              className="rounded-full bg-[#FFC107] px-4 py-2 text-[15px] font-medium text-black border-2 border-black"
            >
              Add Income
            </button>
          </div>
        </div>
      </div>
      <div className="flex my-10">
        <div className="h-auto w-[200px] rounded-lg border-2 border-gray-300 p-4">
          <div className="font-extrabold uppercase">Rs.{totalIncome.toFixed(2)}</div>
          <div className="font-bold uppercase text-gray-600 text-[14px]">Total income</div>
        </div>
      </div>
      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-extrabold">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncome.length > 0 ? (
              filteredIncome.map((item) => (
                <tr key={item._id} className="border-b border-gray-200 bg-white text-gray-900">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
                    {item.title}
                  </th>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">Rs. {item.amount?.toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No incomes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddIncome
        isOpen={openModal}
        onClose={handleModalClose}
        fetchIncome={fetchIncome}
      />
      {openEditModal && (
        <EditIncome
          isOpen={openEditModal}
          onClose={handleModalClose}
          fetchIncome={fetchIncome}
          selectedIncomeId={selectedIncomeId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Income;