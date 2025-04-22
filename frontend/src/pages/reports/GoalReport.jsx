import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "./../../assets/images/print_logo.png";

const GoalReport = ({ data, saving,date }) => {
  const componentRef = useRef();
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const formatDateTime = () => {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString("en-US", options);
      const formattedTime = now.toLocaleTimeString("en-US", { hour12: false });
      return `Generated ${formattedDate} at ${formattedTime}`;
    };
    setCurrentDateTime(formatDateTime());
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print Preview",
  });
  return (
    <div>
      <div ref={componentRef} className="print-content p-4">
        <div className="flex justify-between">
          <img src={logo} alt="brand" className="w-[200px]" />
          <div className="mt-6">
            <div className="text-right text-[25px] font-[600]"> Goal Report</div>
            <div className="text-right text-[16px] font-semibold">{date}</div>
            <div className="text-right text-[14px]">{currentDateTime}</div>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => {
                  const remainingAmount = Math.max(item.amount - saving, 0);
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 bg-white text-[13px] text-gray-900"
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-2 font-medium"
                      >
                        {item.title}
                      </th>
                      <td className="px-6 py-2">{item.description}</td>
                      <td className="px-6 py-2">
                        Rs. {item.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-2">
                        {item.status == 1 ? (
                          <>-</>
                        ) : (
                          <> Rs. {remainingAmount?.toFixed(2)}</>
                        )}
                      </td>
                      <td className="px-6 py-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="flex gap-4 px-6 py-2">
                        {item.status == 1 ? (
                          <span className="text-[13px] font-bold text-[#00e717]">
                            Achieved
                          </span>
                        ) : (
                          <span className="text-[13px] font-bold text-[#0046e7]">
                            In-Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
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
      </div>
      <div className="m-3 text-right">
        <button
          className="rounded-full border-2 border-[#25C935] bg-[#7fff8c] px-5 py-2 text-[14px] font-bold"
          onClick={handlePrint}
        >
          Print PDF
        </button>
      </div>
    </div>
  );
};

export default GoalReport;
