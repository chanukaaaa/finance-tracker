import React, { useState, useEffect } from "react";

const GoalSummary = ({ data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.pendingGoals && data.completeGoals) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-white p-4 mb-5">
      <div className="flex gap-10">
        <div className="w-[50%]">
          <h3 className="mb-5 text-[16px] font-semibold leading-[24px]">
            Latest Pending Goals
          </h3>
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
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.pendingGoals.length > 0 ? (
                data.pendingGoals.map((item) => {
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 bg-white text-gray-900"
                    >
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4">{item.description}</td>
                      <td className="px-6 py-4">
                        Rs. {item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    No Pending Goals available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-[50%]">
          <h3 className="mb-5 text-[16px] font-semibold leading-[24px]">
            Latest Completed Goals
          </h3>
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
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.completeGoals.length > 0 ? (
                data.completeGoals.map((item) => {
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 bg-white text-gray-900"
                    >
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4">{item.description}</td>
                      <td className="px-6 py-4">
                        Rs. {item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    No Completed Goals available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoalSummary;
