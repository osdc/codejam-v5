import React, { useEffect, useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { SelectBudgetOptions, SelectModeOfTransport, SelectTravelersList } from "../constants/options";
import { toast } from "sonner";
import { AI_PROMPT } from "../constants/options";
import { chatSession } from "../service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseconfig";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/custom/Header";

import { motion } from 'framer-motion'
import { FaPlane, FaHotel, FaUtensils } from 'react-icons/fa'
import { HiUsers } from 'react-icons/hi'
import { FaPlaneLock } from "react-icons/fa6";
import { IoPlanetSharp } from "react-icons/io5";
import { FaBus, FaCar, FaWalking } from 'react-icons/fa'

function CreateTrip() {
  const [formData, setFormData] = useState({
    location: null,
    noOfDays: "",
    budget: "",
    travelers: "",
    modeOfTransport: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    if (name === "noOfDays" && value > 5) {
      toast.error("You cannot select more than 5 days.");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  // Google Login
  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      console.log("Login Success:", tokenInfo);
      await GetUserProfile(tokenInfo);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Google login failed. Please try again.");
    },
  });
  
  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      !formData.location ||
      !formData.noOfDays ||
      !formData.budget ||
      !formData.travelers ||
      !formData.modeOfTransport
    ) {
      toast.error("Please fill in all details!");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData.location?.formatted_address || ""
    )
      .replace("{totalDays}", formData.noOfDays)
      .replace("{travelers}", formData.travelers)
      .replace("{budget}", formData.budget)
      .replace("{modeOfTransport}", formData.modeOfTransport);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("AI Response:", await result?.response?.text());
      SaveAiTrip(result?.response?.text())
      toast.success("Trip generated successfully!");
    } catch (error) {
      console.error("AI Session Error:", error);
      toast.error("Something went wrong while generating the trip!");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) {
        toast.error("User is not logged in. Please log in to save the trip.");
        return;
      }
  
      const docId = Date.now().toString();
  
      const sanitizedFormData = {
        ...formData,
        location: formData.location
          ? {
              formatted_address:
                formData.location.formatted_address || "Placeholder Address",
              coordinates: {
                lat:
                  formData.location.geometry?.location?.lat() ||
                  0,
                lng:
                  formData.location.geometry?.location?.lng() ||
                  0,
              },
            }
          : {
              formatted_address: "Placeholder Address",
              coordinates: { lat: 0, lng: 0 },
            },
        noOfDays: formData.noOfDays || "Placeholder Days",
        budget: formData.budget || "Placeholder Budget",
        travelers: formData.travelers || "Placeholder Travelers",
      };
  
      const parsedTripData = JSON.parse(TripData || "{}");
  
      const tripData = {
        userSelection: sanitizedFormData,
        tripData: parsedTripData,
        userEmail: user.email || "unknown@example.com",
        id: docId,
      };
  
      await setDoc(doc(db, "AiTrips", docId), tripData);
      toast.success("Trip saved successfully!");
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip data:", error);
      toast.error("Failed to save trip data. Please try again.");
    }
  };
  
  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
          },
        }
      );
  
      if (response?.data) {
        console.log("User Profile Data:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("User profile fetched successfully!");
      } else {
        console.error("Failed to fetch user profile data.");
        toast.error("Failed to fetch user profile data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("An error occurred while fetching user profile.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative w-full z-20">
        <Header />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold text-4xl text-indigo-900">
            Tell us your travel preferences 🏕️🌴
          </h2>
          <p className="mt-3 text-xl text-indigo-700">
            Provide some basic information, and our trip planner will generate a
            customized itinerary based on your preferences.
          </p>
        </motion.div>

        <div className="mt-12 space-y-12">
          {/* Destination Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label htmlFor="destination" className="text-xl font-medium text-gray-700">
              What is your destination?
            </label>
            <ReactGoogleAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              onPlaceSelected={(place) => handleInputChange("location", place)}
              placeholder="Search for a destination..."
              className="text-[#fff] w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black bg-black"
            />
          </motion.div>

          {/* Duration Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label htmlFor="duration" className="text-xl font-medium text-gray-700">
              How many days will your trip last?
            </label>
            <Input
              id="duration"
              placeholder="Trip Duration (Ex. 3)"
              type="number"
              min="1"
              className="text-[#fff] h-[50px] mt-2 p-3 border border-white rounded-md shadow-sm focus:ring-[#000] focus:border-black bg-black"
              aria-label="Trip duration"
              onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            />
          </motion.div>
          
          {/* Budget Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="budget" className="text-xl font-medium text-gray-700">
              What is your Budget?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {SelectBudgetOptions.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 border rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
                    formData.budget === item.title
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 hover:bg-indigo-50"
                  }`}
                  onClick={() => handleInputChange("budget", item.title)}
                >
                  <div className="text-4xl mb-3">
                    {item.title === 'Cheap' && <FaPlane />}
                    {item.title === 'Moderate' && <FaHotel />}
                    {item.title === 'Luxury' && <FaUtensils />}
                  </div>
                  <h2 className="font-bold text-xl mb-1">{item.title}</h2>
                  <p className="text-sm opacity-80">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mode of Transport */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="modeOfTransport" className="text-xl font-medium text-gray-700">
              Which mode of transport do you prefer while visiting different spots in the city?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {SelectModeOfTransport.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 border rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
                    formData.modeOfTransport === item.title
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 hover:bg-indigo-50"
                  }`}
                  onClick={() => handleInputChange("modeOfTransport", item.title)}
                >
                  <div className="text-4xl mb-3">
                    {item.title === 'Walking' && <FaWalking /> }
                    {item.title === 'Public Transport' && <FaBus /> }
                    {item.title === 'Taxi' && <FaCar /> }
                  </div>
                  <h2 className="font-bold text-xl mb-1">{item.title}</h2>
                  <p className="text-sm opacity-80">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Travelers Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label htmlFor="travelers" className="text-xl font-medium text-gray-700">
              How many people?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {SelectTravelersList.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 border rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
                    formData.travelers === item.title
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 hover:bg-indigo-50"
                  }`}
                  onClick={() => handleInputChange("travelers", item.title)}
                >
                  <div className="text-4xl mb-3"><HiUsers /></div>
                  <h2 className="font-bold text-xl">{item.title }</h2>
                  <h4 className="font-bold text-sm">({item.people})</h4>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              className={`mt-8 px-8 py-4 text-white text-lg font-semibold rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={onGenerateTrip}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Planning...
                </span>
              ) : (
                "Plan My Trip"
              )}
            </Button>
          </motion.div>
        </div>

        {/* Google Login Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogDescription>
                <h2 className="font-bold text-2xl mt-7 mb-3 text-gray-800">Sign in with Google</h2>
                <p className="text-gray-600 mb-6">Sign in securely to generate your trip plan.</p>
                <Button
                  disabled={loading}
                  onClick={login}
                  className="w-full py-6 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-4"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;

