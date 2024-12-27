"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  LightbulbIcon,
  InfoIcon,
  TentIcon,
  MapPinIcon,
  PlaneIcon,
  UtensilsIcon,
  BackpackIcon,
  ClockIcon,
  Users,
} from "lucide-react";
import PlaceToVisit from "./PlaceToVisit";
import InfoSection from "./infoSection";
import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaUsers,
  FaBus,
  FaCar,
  FaWalking,
} from "react-icons/fa";
import { motion } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import Activities from "./Activities";
import Hotels from "./Hotels";

export default function InformationCard({ trip }) {
  const [selectedSection, setSelectedSection] = useState(null);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const renderContent = () => {
    if (!selectedSection) return <p>Select a section to view details</p>;

    switch (selectedSection) {
      case "imagination":
        return <p>Your imagination details go here.</p>;
      case "about":
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                About the Place
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-indigo-500" />
                <span className="font-medium">Location:</span>
                <span>
                  {trip?.userSelection?.location?.formatted_address ||
                    "Unknown Location"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-indigo-500" />
                <span className="font-medium">Duration:</span>
                <span>{trip?.userSelection?.noOfDays || 0} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaWallet className="text-indigo-500" />
                <span className="font-medium">Budget:</span>
                <span>{trip?.userSelection?.budget || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-indigo-500" />
                <span className="font-medium">Travelers:</span>
                <span>{trip?.userSelection?.travelers || 0}</span>
                <span>({trip?.tripData?.trip?.travelers || 0})</span>
              </div>
              <div className="flex items-center space-x-2">
                {trip?.userSelection?.modeOfTransport ===
                  "Public Transport" && <FaBus className="text-indigo-500" />}
                {trip?.userSelection?.modeOfTransport === "Taxi" && (
                  <FaCar className="text-indigo-500" />
                )}
                {trip?.userSelection?.modeOfTransport === "Walking" && (
                  <FaWalking className="text-indigo-500" />
                )}
                <span className="font-medium">Mode of Transport:</span>
                <span>
                  {trip?.userSelection?.modeOfTransport || "Not specified"}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      case "activities":
        return (
          <div>
            <Activities trip={trip}/>
          </div>
        );
        case "transportation":
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transportation Details</h2>
      {trip?.tripData?.transportation ? (
        <Card className="p-6 bg-gray-50 rounded-lg shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold">Type</h4>
              <p className="text-gray-700">{trip?.tripData?.transportation?.type}</p>
            </div>
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold">Estimated Cost Per Day</h4>
              <p className="text-gray-700">{trip?.tripData?.transportation?.estimatedCostPerDay}</p>
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-gray-600">Transportation details are not available.</p>
      )}
    </div>
  );
      case "itinerary":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2 mt-4">Best Itinerary for you!</h2>

            <Card className="mb-4 p-4 bg-gray-50">
              <PlaceToVisit trip={trip} />
            </Card>
          </div>
        );
      case "hotels":
        return (
          <div>
            <Hotels trip={trip}/>
          </div>
        );
      case "packing":
          return (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Packing Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh]">
                  {trip.packingList && trip.packingList.length > 0 ? (
                    <ul className="space-y-2">
                      {trip.packingList.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                        >
                          <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                            {idx + 1}
                          </Badge>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p>No packing list available.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          );

      default:
        return <p>Content for {selectedSection}.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Tabs defaultValue="plan" className="w-full border-b">
        <TabsList className="w-full max-w-screen-xl mx-auto justify-start h-16 bg-white">
          <TabsTrigger
            value="plan"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Plan
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
          >
            Settings
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r bg-white">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Discover</h2>
            <nav className="space-y-2">
              <SidebarItem
                icon={<InfoIcon />}
                text="About the Place"
                onClick={() => setSelectedSection("about")}
              />
              <SidebarItem
                icon={<TentIcon />}
                text="Top Activities"
                onClick={() => setSelectedSection("activities")}
              />
              <SidebarItem
                icon={<PlaneIcon />}
                text="Itinerary"
                onClick={() => setSelectedSection("itinerary")}
              />
              
              <SidebarItem
                icon={<UtensilsIcon />}
                text="Best Hotels for Stay"
                onClick={() => setSelectedSection("hotels")}
              />
              <SidebarItem
                icon={<MapPinIcon />}
                text="Cost of Transportation"
                onClick={() => setSelectedSection("transportation")}
              />
              
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Shared Access Banner */}
          <Card className="mb-6 p-4 bg-white">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-semibold">Shared Access!</h3>
                <p className="text-sm text-gray-600">
                  You are currently viewing a shared Travel Plan.
                </p>
              </div>
            </div>
          </Card>

          
          {/* Hero Image Section */}
          <InfoSection trip={trip} />

          {/* Content Section */}
          <div>{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{text}</span>
    </button>
  );
}
