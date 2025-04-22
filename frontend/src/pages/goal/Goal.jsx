import React, { useState, useEffect } from "react";
import AddGoal from "./AddGoal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditGoal from "./EditGoal";

const Goal = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [goal, setGoal] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGoal, setFilteredGoal] = useState([]);

  const fetchGoal = async () => {
    try {
      const response = await axiosClient.get(`/goal/user/${userId}`);
      setGoal(response.data);
      setFilteredGoal(response.data);
    } catch (error) {
      console.error("Fetch Goal Error:", error.response?.data || error.message);
      toast.error("Failed to fetch Goals");
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await axiosClient.get(`/wallet/user/${userId}`);
      setWallet(response.data[0]);
    } catch (error) {
      console.error("Fetch Goal Error:", error.response?.data || error.message);
      toast.error("Failed to fetch wallet");
    }
  };

  useEffect(() => {
    fetchGoal();
    fetchWallet();
  }, [userId]);

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (goalId) => {
    console.log("Edit button clicked for Goal ID:", goalId);
    setSelectedGoalId(goalId);
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
    setSelectedGoalId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = goal.filter((goal) =>
      goal.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredGoal(filtered);
  }, [searchQuery, goal]);

  const handleDelete = async (id) => {
    console.log("Delete button clicked for Goal ID:", id);

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
        await axiosClient.delete(`/goal/${id}`);
        toast.success("Goal deleted successfully");
        fetchGoal();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(
          `Failed to delete goal: ${error.response?.data.message || error.message}`,
        );
      }
    }
  };

  const handleComplete = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Complete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.post(`/goal/goal-completed/${id}`);
        toast.success("Congratulations !!! Goal is completed successfully");
        fetchGoal();
        fetchWallet();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(
          `Failed to complete goal: ${error.response?.data.message || error.message}`,
        );
      }
    }
  };

  const totalGoal = goal.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-white p-5">
      <div className="flex justify-between">
        <div className="text-[18px] font-semibold">Goal</div>
        <div className="flex gap-4">
          <div>
            <input
              type="text"
              placeholder="Search goal"
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
              Add Goal
            </button>
          </div>
        </div>
      </div>
      <div className="my-10 flex gap-10">
        <div className="h-auto w-[200px] rounded-lg border-2 border-gray-300 p-4">
          <div className="font-extrabold uppercase">
            Rs. {wallet?.totalSaving ? Number(wallet?.totalSaving).toFixed(2) :"0.00"}
          </div>
          <div className="text-[14px] font-bold uppercase text-gray-600">
            Total savings
          </div>
        </div>

        <div className="h-auto w-[200px] rounded-lg border-2 border-gray-300 p-4">
          <div className="font-extrabold uppercase">
            Rs.{totalGoal.toFixed(2)}
          </div>
          <div className="text-[14px] font-bold uppercase text-gray-600">
            Total goals amount
          </div>
        </div>
      </div>
      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Remaining Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGoal.length > 0 ? (
              filteredGoal.map((item) => {
                const percentage = Math.min(
                  (wallet.totalSaving / item.amount) * 100,
                  100,
                ).toFixed(2);
                const remainingAmount = Math.max(
                  item.amount - wallet.totalSaving,
                  0,
                );
                const progressBarColor =
                  percentage == 100 ? "bg-[#25C935]" : "bg-blue-600";
                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 bg-white text-gray-900"
                  >
                    <td className="px-6 py-4 font-medium">{item.title}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">
                      Rs. {item.amount.toFixed(2)}
                      <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                          className={`${progressBarColor} h-2.5 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      Rs. {remainingAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleDateString()}
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
                      {percentage == 100 && (
                        <>
                          <button
                            onClick={() => handleComplete(item._id)}
                            className="rounded-md bg-[#25C935] px-2 py-1 font-medium text-white"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  No Goals available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddGoal
        isOpen={openModal}
        onClose={handleModalClose}
        fetchGoal={fetchGoal}
      />
      {openEditModal && (
        <EditGoal
          isOpen={openEditModal}
          onClose={handleModalClose}
          fetchGoal={fetchGoal}
          selectedGoalId={selectedGoalId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Goal;
