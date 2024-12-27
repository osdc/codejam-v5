import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { Button } from "../../components/ui/button";
import { GetPlaceDetails } from "../../service/GobalApi";
import { PHOTO_REF_URL } from "../../service/GobalApi";


function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(); // Default placeholder image

  useEffect(() => {
    if (trip?.userSelection?.location?.formatted_address) {
      fetchPlacePhoto();
    }
  }, [trip]);

  const fetchPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.formatted_address,
      };
      const response = await GetPlaceDetails(data);
      console.log("API Response:", response.data);

      const photos = response.data.places[0]?.photos;
      if (photos && photos.length > 0) {
        const photoName = photos[4]?.name || photos[0]?.name; // Use the 5th photo if available, else fallback to the first
        const constructedUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        console.log("Constructed Photo URL:", constructedUrl);
        setPhotoUrl(constructedUrl); // Update state with the fetched photo URL
      } else {
        console.warn("No photos available for this place.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div>
      {/* Display the dynamic image or fallback placeholder */}
      <img
        src={photoUrl}
        alt="Place"
        className="h-[300px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-xl">
            {trip?.userSelection?.location?.formatted_address || "Unknown Location"}
          </h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              {trip?.userSelection?.noOfDays || 0} Day
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              {trip?.userSelection.budget || "Unknown"} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              Number of Travelers: {trip?.userSelection.travelers || 0}
            </h2>
          </div>
        </div>
        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;



