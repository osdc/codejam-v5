'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail } from 'lucide-react'
import Header from '../components/ui/custom/Header'
import emailjs from 'emailjs-com'

const ContactPage = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  useEffect(() => {
    // Load Google Maps Script
    const loadGoogleMaps = () => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      // Default location (can be anywhere)
      const defaultLocation = { lat: 40.7128, lng: -74.0060 }

      const mapInstance = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: defaultLocation,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#2B4C7E" }]
          }
        ]
      })

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        position: defaultLocation,
        animation: google.maps.Animation.DROP
      })

      setMap(mapInstance)
      setMarker(markerInstance)

      // Get user's location if permitted
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            setUserLocation(userPos)
            mapInstance.setCenter(userPos)
            markerInstance.setPosition(userPos)
          },
          (error) => {
            console.error("Error getting location:", error)
          }
        )
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup
      const script = document.querySelector('script[src*="maps.googleapis.com"]')
      if (script) {
        script.remove()
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true) // Set loading state to true

    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      subject: formData.subject,
      message: formData.message
    }

    emailjs.send(
      'service_h5who0q',
      'template_vsy3est',
      templateParams,
      'pjUr5Gn3ZguhzgCHY'
    )
      .then((response) => {
        setIsLoading(false) // Set loading state to false
        setStatus('Message Sent!')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      })
      .catch((error) => {
        setIsLoading(false) // Set loading state to false
        setStatus('Failed to send message. Please try again later.')
      })
  }

  return (
    <div>
      <Header />
      <section className="py-16 px-6 md:px-8 bg-gradient-to-b from-[#fff] to-[#83c5dc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B4C7E] mb-4 inline-block relative">
              CONTACT US
              <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-400"></span>
            </h1>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              Let us help you with any inquiries or concerns you may have. We’d love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 transition-transform transform hover:scale-105">
                  <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B4C7E] mb-1">Our Address</h3>
                    <p className="text-gray-600">JIIT , Sector 62, Noida, Uttar Pradesh 201309</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 transition-transform transform hover:scale-105">
                  <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                    <Phone className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B4C7E] mb-1">Call Us</h3>
                    <p className="text-gray-600">+91 1234567890</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 transition-transform transform hover:scale-105">
                  <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2B4C7E] mb-1">Email Us</h3>
                    <p className="text-gray-600">aditya.pachouri29@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div 
                id="map" 
                className="w-full h-[350px] rounded-lg shadow-lg transition-transform transform hover:scale-105"
                aria-label="Location map"
              ></div>
            </div>

            {/* Contact Form */}
            <div className="rounded-lg p-8 shadow-lg hover:shadow-xl transition-all bg-gradient-to-b from-[#d6a4c4] to-[#5291a8]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full border-black focus:border-blue-900"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full border-black focus:border-blue-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full border-black focus:border-blue-900"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="w-full min-h-[150px] px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <Button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-900 text-white px-8 py-3 rounded-md transition-all duration-200"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
              {status && <p className="text-center mt-4 text-gray-700">{status}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
