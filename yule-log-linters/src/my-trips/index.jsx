import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../service/firebaseconfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Header from "../components/ui/custom/Header";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserTrips();
  }, []);

  const getUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/"); // Redirect to home if user is not logged in
      return;
    }

    try {
      const tripsQuery = query(
        collection(db, "AiTrips"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(tripsQuery);

      const tripsData = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() });
      });

      setTrips(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div className="relative w-full z-20">
      <Header />
      </div>
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">My Trips</h1>
      {loading ? (
        <p>Loading your trips...</p>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <Link to={`/view-trip/${trip?.id}`} key={trip.id}>
              <div className="p-4 border rounded shadow-sm hover:shadow-lg transition">
                <h2 className="font-semibold text-lg text-orange-700">
                  {trip?.userSelection?.location?.formatted_address ||
                    "No location provided"}
                </h2>
                <p className="text-sm text-gray-500">
                  Duration: {trip?.userSelection?.noOfDays || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Budget: {trip?.userSelection?.budget || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Travelers: {trip?.userSelection?.travelers || "Not specified"}
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold">Hotels:</h3>
                  <ul className="list-disc pl-5">
                    {trip?.tripData?.hotels?.map((hotel, index) => (
                      <li key={index} className="text-sm">
                        <strong>{hotel?.hotelName}</strong>:{" "}
                        {hotel?.hotelAddress}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No trips found. Start planning one!</p>
      )}
    </div>
    </div>
  );
}

export default MyTrips;
