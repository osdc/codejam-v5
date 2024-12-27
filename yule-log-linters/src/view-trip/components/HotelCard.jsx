import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GobalApi";

function HotelCard({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (hotel) fetchPlacePhoto();
  }, [hotel]);

  const fetchPlacePhoto = async () => {
    try {
      const data = {
        textQuery: hotel?.hotelName,
      };
      const response = await GetPlaceDetails(data);

      const photos = response.data.places[0]?.photos;
      if (photos && photos.length > 0) {
        const photoName = photos[4]?.name || photos[0]?.name;
        const constructedUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(constructedUrl);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        hotel.hotelName +
        "," +
        hotel?.hotelAddress
      }
      target="_blank"
    >
      <div className="group relative p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer w-[300px] md:w-[350px] lg:w-[400px]">
        {/* Hotel Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={photoUrl}
            alt="img-hotel"
            className="rounded-lg h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Hotel Details */}
        <div className="mt-4 flex flex-col gap-1">
          <h2 className="font-semibold text-lg text-gray-800 truncate">
            {hotel.hotelName}
          </h2>
          <p className="text-sm text-gray-500 truncate">📍 {hotel.hotelAddress}</p>
          <p className="text-sm text-green-600 font-medium">💰 {hotel.pricePerNight} Price Per night</p>
          <p className="text-sm text-yellow-500">⭐ {hotel.rating}</p>
        </div>

        {/* Highlight Border on Hover */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"></div>
      </div>
    </Link>
  );
}

export default HotelCard;
