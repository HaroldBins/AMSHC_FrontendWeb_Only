"use client"
import { useNavigate } from "react-router-dom"
import doctorImg from "../images/doctor ai.png"
import logo from "../images/amshc logo.png"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Top right decorative circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full translate-x-1/2 -translate-y-1/2 opacity-10"></div>

        {/* Bottom left decorative circle */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full -translate-x-1/3 translate-y-1/3 opacity-10"></div>

        {/* Middle decorative pattern */}
        <div className="absolute top-1/4 left-0 w-full h-96 bg-gradient-to-r from-blue-50 to-transparent"></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Medical symbols pattern (subtle) */}
        <div className="absolute inset-0 bg-medical-symbols opacity-3"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-white bg-opacity-90 shadow-md">
        {/* Logo on the left */}
        <div className="flex items-center">
          <img src={logo || "/placeholder.svg"} alt="AMSHC Logo" className="h-12 w-auto mr-2" />
          <h1 className="text-xl font-bold text-gray-800">AMSHC</h1>
        </div>

        {/* Buttons on the right */}
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-left max-w-xl">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              Healthcare Management Simplified
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Manage your entire practice in one app.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Streamline your healthcare practice with our all-in-one solution designed for modern medical
              professionals.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Medical Records</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Appointment Scheduling</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Virtual Consultations</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Payments & Billing</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium"
            >
              Get Started Now
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center md:justify-end relative">
            {/* Decorative elements around the image */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-100 rounded-full z-0"></div>

            <div className="relative z-10 bg-white p-3 rounded-xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src={doctorImg || "/placeholder.svg"}
                alt="Doctor with AI technology"
                className="max-w-sm w-full h-auto rounded-lg"
              />

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold">
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="relative z-10 bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Trusted by Healthcare Professionals</h3>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg max-w-md text-left border border-white border-opacity-20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-4">
                  DR
                </div>
                <div>
                  <h4 className="text-white font-medium">Dr. Rebecca Chen</h4>
                  <p className="text-blue-100">Family Physician</p>
                </div>
              </div>
              <p className="text-white opacity-90 italic">
                "This platform has transformed how I manage my practice. The integrated scheduling and medical records
                have saved me hours every week."
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg max-w-md text-left border border-white border-opacity-20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center text-teal-700 font-bold mr-4">
                  JM
                </div>
                <div>
                  <h4 className="text-white font-medium">Dr. James Miller</h4>
                  <p className="text-blue-100">Cardiologist</p>
                </div>
              </div>
              <p className="text-white opacity-90 italic">
                "The virtual consultation feature has been a game-changer for my patients who live in remote areas.
                Highly recommended for specialists."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={logo || "/placeholder.svg"} alt="AMSHC Logo" className="h-8 w-auto mr-2" />
              <span className="text-gray-600">© 2023 AMSHC. All rights reserved.</span>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
