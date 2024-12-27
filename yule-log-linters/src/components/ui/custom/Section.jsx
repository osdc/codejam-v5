import { Compass, Map, Calendar, Briefcase } from 'lucide-react'

export default function ServicesSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 mt-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#000000] mb-2">OUR SERVICES</h2>
          <div className="w-32 h-1 bg-[#000000] mx-auto mb-6"></div>
          <p className="text-[#ffffff] max-w-2xl mx-auto">
            Experience seamless travel planning with our AI-powered services, designed to make your journey memorable and hassle-free.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Itinerary Planning */}
          <div className="bg-[#57989f] p-6 rounded-lg shadow-lg hover:shadow-xl hover:border-spacing-3 transform hover:scale-105 hover:bg-[#57989f] transition-all duration-300">
            <div className="text-[#000] mb-4">
              <Compass className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-[#ffffff] mb-3 ">
              Smart Itinerary
            </h3>
            <p className="text-gray-950">
              AI-powered itinerary creation based on your preferences, time, and budget constraints
            </p>
          </div>

          {/* Route Optimization */}
          <div className="bg-[#57989f] p-6 rounded-lg shadow-lg hover:shadow-xl hover:border-spacing-3 transform hover:scale-105 hover:bg-[#57989f] transition-all duration-300">
            <div className="text-[#000] mb-4">
              <Map className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-[#ffffff] mb-3">
              Route Planning
            </h3>
            <p className="text-gray-950">
              Optimal route suggestions with real-time traffic updates and alternative paths
            </p>
          </div>

          {/* Schedule Management */}
          <div className="bg-[#57989f] p-6 rounded-lg shadow-lg hover:shadow-xl hover:border-spacing-3 transform hover:scale-105 hover:bg-[#57989f] transition-all duration-300">
            <div className="text-[#000] mb-4">
              <Calendar className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-[#ffffff] mb-3">
              Smart Scheduling
            </h3>
            <p className="text-gray-950">
              Intelligent scheduling system that adapts to your travel style and preferences
            </p>
          </div>

          {/* Travel Resources */}
          <div className="bg-[#57989f] p-6 rounded-lg shadow-lg hover:shadow-xl hover:border-spacing-3 transform hover:scale-105 hover:bg-[#57989f] transition-all duration-300">
            <div className="text-[#000] mb-4">
              <Briefcase className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-[#ffffff] mb-3">
              Travel Resources
            </h3>
            <p className="text-gray-950">
              Comprehensive travel guides, local tips, and personalized recommendations
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

