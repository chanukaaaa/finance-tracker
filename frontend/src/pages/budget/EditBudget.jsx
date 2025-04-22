import React, { useState, useEffect, useRef } from "react";
import { CloseIcon, StartIcon, StopIcon } from "../../utils/icons";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBudget = ({ isOpen, onClose, fetchBudget, selectedBudgetId }) => {
  const [editedBudget, setEditedBudget] = useState({});
  const [isListening, setIsListening] = useState({
    budgetName: false,
    price: false,
  });
  const [errors, setErrors] = useState({});
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);
  useEffect(() => {
    if (selectedBudgetId) {
      axiosClient
        .get(`/budget/${selectedBudgetId}`)
        .then((res) => {
          setEditedBudget(res.data);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load budget details");
        });
    }
  }, [selectedBudgetId]);

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
        setEditedBudget((prev) => ({ ...prev, [field]: transcript }));
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
      activeFieldRef.current = null; // Unlock field
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBudget((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!editedBudget.budgetName) {
      newErrors.budgetName = "Budget Name is required";
    }

    if (!editedBudget.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(editedBudget.price) || Number(editedBudget.price) <= 0) {
      newErrors.price = "Enter a valid price";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axiosClient.put(`/budget/${selectedBudgetId}`, editedBudget);
      toast.success("Budget edited successfully!");
      fetchBudget();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to add budget. Please try again.");
    }
  };

  const handleClose = () => {
    // setFormData({ budgetName: "", price: "", userId: userId });
    // setErrors({});
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
              Edit Budget
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
              Budget Name:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="budgetName"
                value={editedBudget.budgetName}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />

              <div>
                {!isListening.budgetName ? (
                  <button
                    onClick={() => startListening("budgetName")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("budgetName")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.budgetName && (
              <p className="text-sm text-red-500">{errors.budgetName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Price:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="price"
                value={editedBudget.price}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.price ? (
                  <button
                    onClick={() => startListening("price")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("price")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 w-[130px] rounded-full bg-[#FFC107] px-4 py-2 text-[15px] font-medium text-black border-2 border-black"
          >
            Edit Budget
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default EditBudget;
