import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
function Spending() {
  const { userDetails, loading } = useUserContext();
  const [score, setScore] = useState({ nice: 0, naughty: 0 });
  const navigate = useNavigate();
  const spending = {
    nice: 75, // Percentage
    naughty: 25, // Percentage
  };
  const fetchNScore = async (email) => {
    try {
      const data = await API.get(`/api/typeN/?email=${email}`);

      return data.data;
    } catch (error) {
      console.error("Failed to fetch expense score", error);
    }
  };
  useEffect(() => {
    if (!loading && (!userDetails || userDetails == null)) {
      navigate("/login");
    } else if (!loading && userDetails) {
      const getScore = async () => {
        const data = await fetchNScore(userDetails?.Email);
        console.log({ data });
        setScore(data.data);
      };
      getScore();
    }
  }, [loading, userDetails]);
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        🎄 December Spending
      </h2>
      <div className="flex justify-between text-lg mb-2">
        <span className="text-green-600">Nice: {score?.nice}%</span>
        <span className="text-red-600">Naughty: {score?.naughty}%</span>
      </div>
      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="text-lg text-center flex justify-center items-center">
            Loading..
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-green-500"
                style={{ width: `${score?.nice}%` }}
                title="Nice score includes essentials like groceries, rent, etc."
              ></div>
              <div
                className="absolute top-0 right-0 h-full bg-red-500"
                style={{ width: `${score?.naughty}%` }}
                title="Naughty spending includes entertainment, dining out, etc."
              ></div>
            </div>

            {/* Tooltip */}
            <div className="text-center mt-4">
              <span
                className="inline-block text-sm text-gray-600 p-2 bg-gray-100 rounded-lg shadow-md cursor-help"
                title="Nice: Essential spending. Naughty: Discretionary or indulgent spending."
              >
                Hover over the bar for details!
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Spending;
