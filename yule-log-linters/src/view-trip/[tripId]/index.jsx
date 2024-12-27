import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react"; // Import useState
import { useParams } from "react-router-dom";
import { db } from "../../service/firebaseconfig";
import { toast } from "sonner";
import InfoSection from "../components/infoSection";
import Hotels from "../components/Hotels";
import PlaceToVisit from "../components/PlaceToVisit";
import InformationCard from "../components/InformationCard";
import Header from "../../components/ui/custom/Header";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null); // Initialize state as null

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AiTrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No such document");
        toast.error("No Trip Found!");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast.error("Failed to fetch trip data. Please try again.");
    }
  };

  return (
    <div>
    <div className="relative w-full z-20">
      <Header />
      </div>
    
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      
      <InformationCard trip={trip} />

      {/* Information Section */}
      {/* <InfoSection trip={trip} />  */}

      {/* Recommendation Hotels */}
      {/* <Hotels trip={trip}/> */}

      {/* Daily Plan */}
      {/* <PlaceToVisit trip={trip}/> */}

      {/* Footer */}
    </div>
    </div>
  );
}

export default ViewTrip;
