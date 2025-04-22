import React, { useState, useEffect, useRef } from "react";
import { CloseIcon, StartIcon, StopIcon } from "../../utils/icons";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../contexts/NavigationContext";

const EditExpense = ({ isOpen, onClose, fetchExpense, selectedExpenseId }) => {
  const { user } = useStateContext();
  const [editedExpense, setEditedExpense] = useState({
    title: "",
    description: "",
    budgetId: "",
    amount: "",
  });
  const userId = user.id;
  const [isListening, setIsListening] = useState({
    title: false,
    description: false,
    amount: false,
  });
  const [errors, setErrors] = useState({});
  const [budget, setBudget] = useState([]);
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);

  useEffect(() => {
    if (selectedExpenseId && isOpen) {
      axiosClient
        .get(`/expense/${selectedExpenseId}`)
        .then((res) => {
          console.log("Expense data fetched:", res.data);
          setEditedExpense({
            title: res.data.title || "",
            description: res.data.description || "",
            amount: res.data.amount || "",
            budgetId: res.data.budgetId || "",
          });
        })
        .catch((err) => {
          console.error(
            "Fetch Expense Error:",
            err.response?.data || err.message,
          );
          toast.error("Failed to load expense details");
        });
    }
  }, [selectedExpenseId, isOpen]);

  if (!recognitionRef.current && "webkitSpeechRecognition" in window) {
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
  }

  const startListening = (field) => {
    if (recognitionRef.current && !activeFieldRef.current) {
      activeFieldRef.current = field;
      setIsListening((prev) => ({ ...prev, [field]: true }));
      recognitionRef.current.start();
      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setEditedExpense((prev) => ({ ...prev, [field]: transcript }));
      };
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening(field);
      };
    }
  };

  const stopListening = (field) => {
    if (recognitionRef.current && activeFieldRef.current === field) {
      setIsListening((prev) => ({ ...prev, [field]: false }));
      recognitionRef.current.stop();
      activeFieldRef.current = null;
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await axiosClient.get(`/budget/user/${userId}`);
      setBudget(response.data);
    } catch (error) {
      toast.error("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field: ${name}, Value: ${value}`);
    setEditedExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    console.log("Update button clicked for Expense ID:", selectedExpenseId);
    const newErrors = {};

    if (!editedExpense.title) newErrors.title = "Expense Title is required";
    if (!editedExpense.description)
      newErrors.description = "Description is required";
    if (!editedExpense.budgetId) newErrors.budgetId = "Please select a budget";
    if (!editedExpense.amount) {
      newErrors.amount = "Amount is required";
    } else if (
      isNaN(editedExpense.amount) ||
      Number(editedExpense.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token for PUT:", token);
      await axiosClient.put(`/expense/${selectedExpenseId}`, editedExpense);
      toast.success("Expense updated successfully");
      fetchExpense();
      handleClose();
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      toast.error(
        `Failed to update expense: ${error.response?.data.message || error.message}`,
      );
    }
  };

  const handleClose = () => {
    setEditedExpense({ title: "", description: "", amount: "" });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      size="xs"
      open={isOpen}
      handler={handleClose}
      className="overflow-scroll rounded-[10px] bg-white font-inter shadow-none scrollbar-hide"
    >
      <DialogHeader className="align-center flex justify-between border-b border-[#ececec] pb-3">
        <div className="align-center flex">
          <div>
            <p className="font-poppins text-[18px] font-semibold leading-[28px] text-[#000000]">
              Edit Expense
            </p>
          </div>
        </div>
        <div onClick={handleClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </DialogHeader>
      <DialogBody className="p-5">
        <div className="flex flex-col p-4 text-gray-800">
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Select Budget:
            </label>
            <select
              name="budgetId"
              value={editedExpense.budgetId}
              onChange={handleChange}
              className="w-[80%] rounded border p-2"
            >
              <option value="">-- Select Budget --</option>
              {budget.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.budgetName}
                </option>
              ))}
              <option value="0">Other</option>
            </select>

            {errors.budgetId && (
              <p className="text-sm text-red-500">{errors.budgetId}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Expense Title:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="title"
                value={editedExpense.title}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.title ? (
                  <button
                    onClick={() => startListening("title")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("title")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Description:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="description"
                value={editedExpense.description}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.description ? (
                  <button
                    onClick={() => startListening("description")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("description")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Amount:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="amount"
                value={editedExpense.amount}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.amount ? (
                  <button
                    onClick={() => startListening("amount")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("amount")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-[150px] rounded-full bg-[#FFC107] px-4 py-2 text-[15px] font-medium text-black border-2 border-black"
          >
            Update Expense
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default EditExpense;
