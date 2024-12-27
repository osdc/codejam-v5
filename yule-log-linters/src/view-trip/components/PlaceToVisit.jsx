import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GobalApi";

function PlaceToVisit({ trip }) {
  const [photos, setPhotos] = useState({}); // Store photos for each place

  // Fetch photos for a place
  const fetchPlacePhoto = async (placeName) => {
    try {
      const data = {
        textQuery: placeName,
      };
      const response = await GetPlaceDetails(data);
      const photosData = response.data.places[0]?.photos;

      if (photosData && photosData.length > 0) {
        const photoName = photosData[4]?.name || photosData[0]?.name; // Use the 5th photo if available
        const constructedUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        return constructedUrl;
      }
    } catch (error) {
      console.error(`Error fetching photo for ${placeName}:`, error);
    }
    return "/placeholder.png"; // Fallback placeholder
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!trip?.tripData?.dailyItinerary) return;

      const allPhotos = {};
      for (const [_, places] of Object.entries(trip.tripData.dailyItinerary)) {
        for (const place of places) {
          const photo = await fetchPlacePhoto(place.placeName);
          allPhotos[place.placeName] = photo;
        }
      }
      setPhotos(allPhotos);
    };

    fetchPhotos();
  }, [trip]);

  // Handle the case where trip or tripData is null
  if (!trip || !trip.tripData || !trip.tripData.dailyItinerary) {
    return <p>Loading trip data...</p>;
  }

  // Sort the days to maintain order (e.g., Day 1, Day 2, Day 3)
  const sortedDays = Object.entries(trip.tripData.dailyItinerary).sort(
    ([dayA], [dayB]) => dayA.localeCompare(dayB, undefined, { numeric: true })
  );

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-gray-50 to-indigo-100 p-8 rounded-lg shadow-lg">
      <h2 className="font-bold text-3xl text-gray-800 mb-6 text-center">
        Places To Visit
      </h2>
      <div>
        {sortedDays.map(([day, places], index) => (
          <div key={index} className="mb-10">
            <h2 className="font-bold text-2xl text-gray-700 mb-6 border-b-2 pb-3 border-indigo-300">
              {day}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 ">
              {places.map((place, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-xl hover:shadow-2lg transition-shadow duration-300 transform hover:scale-105 w-full sm:w-80 md:w-96 lg:w-80 min-h-[100px]"
                >
                  <h2 className="font-medium text-sm text-orange-600 bg-indigo-100 p-3 rounded-t-lg">
                    {place.time}
                  </h2>
                  <Link
                    to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      place.placeName
                    )}`}
                    target="_blank"
                  >
                    <div className="rounded-t-lg overflow-hidden">
                      <img
                        src={photos[place.placeName] || "/placeholder.png"}
                        alt={place.placeName}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-semibold text-lg text-gray-800 mb-3">
                        {place.placeName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {place.placeDetails}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <h2 className="font-bold text-green-500">
                          Charges: {place.ticketsPricing}
                        </h2>
                        <h2 className="font-bold text-yellow-500">
                          Rating: {place.rating}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceToVisit;
