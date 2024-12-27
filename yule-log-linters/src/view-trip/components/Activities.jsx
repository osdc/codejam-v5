import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Update path as per your project
import { motion } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";

function Activities({ trip }) {
  if (!trip || !trip.tripData) {
    return <p>Loading activities...</p>;
  }

  const { activityPreferences, additionalRecommendations } = trip.tripData;

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-gray-50 to-indigo-100 p-8 rounded-lg shadow-lg">
      <h2 className="font-bold text-3xl text-gray-800 mb-6 text-center">
        Top Activities & Recommendations
      </h2>

      {/* Activity Preferences */}
      <Card className="w-full bg-white shadow-xl rounded-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 mb-4">
            Activity Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea.Root className="h-[40vh] overflow-y-scroll">
            <ScrollArea.Viewport className="px-4 py-2">
              {activityPreferences && Object.entries(activityPreferences).length > 0 ? (
                Object.entries(activityPreferences).map(([category, activities], index) => (
                  <motion.div
                    key={index}
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="font-bold text-xl text-gray-700 mb-4 border-b-2 pb-2 border-indigo-300 capitalize">
                      {category.replace(/([A-Z])/g, " $1")}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700">
                      {Array.isArray(activities) && activities.length > 0 ? (
                        activities.map((activity, idx) => (
                          <li key={idx} className="mb-2">
                            {activity}
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No activities available.</p>
                      )}
                    </ul>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No activity preferences available.</p>
              )}
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </CardContent>
      </Card>

      {/* Additional Recommendations */}
      <Card className="w-full bg-white shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 mb-4">
            Additional Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea.Root className="h-[40vh] overflow-y-scroll">
            <ScrollArea.Viewport className="px-4 py-2">
              {additionalRecommendations && Object.entries(additionalRecommendations).length > 0 ? (
                Object.entries(additionalRecommendations).map(
                  ([category, recommendations], index) => (
                    <motion.div
                      key={index}
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <h3 className="font-bold text-xl text-gray-700 mb-4 border-b-2 pb-2 border-indigo-300 capitalize">
                        {category.replace(/([A-Z])/g, " $1")}
                      </h3>
                      <ul className="list-disc pl-6 text-gray-700">
                        {Array.isArray(recommendations) && recommendations.length > 0 ? (
                          recommendations.map((recommendation, idx) => (
                            <li key={idx} className="mb-2">
                              {recommendation}
                            </li>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No recommendations available.</p>
                        )}
                      </ul>
                    </motion.div>
                  )
                )
              ) : (
                <p className="text-sm text-gray-500">No additional recommendations available.</p>
              )}
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </CardContent>
      </Card>
    </div>
  );
}

export default Activities;
