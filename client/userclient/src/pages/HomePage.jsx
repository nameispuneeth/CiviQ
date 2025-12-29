"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Chatbot from "../components/Chatbot";

export default function HomePage() {
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const carouselImages = [
    "https://data1.ibtimes.co.in/en/full/673854/kaggadasapura-road-bangalore-potholes.jpg?w=1199&h=444&l=50&t=40",
    "https://pbs.twimg.com/media/E0x1Z2KVgAEDA4b.jpg",
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
    );
  };

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Geolocation Tracking",
      description:
        "Report issues with precise location data for faster resolution",
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Real-time Status",
      description: "Track your reports from pending to resolved in real-time",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Role System",
      description: "Dedicated dashboards for citizens, admins, and employees",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
  ];

  const userTypes = [
    {
      title: "Citizens",
      icon: <Users className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Report Issues",
        "Track Status",
        "Rate Services",
        "View History",
      ],
    },
    {
      title: "Admins",
      icon: <Shield className="w-12 h-12" />,
      color: "from-purple-500 to-pink-500",
      features: [
        "Manage Issues",
        "Assign Tasks",
        "View Analytics",
        "Employee Management",
      ],
    },
    {
      title: "Employees",
      icon: <Zap className="w-12 h-12" />,
      color: "from-orange-500 to-red-500",
      features: [
        "View Assignments",
        "Update Status",
        "Mark Complete",
        "Personal Dashboard",
      ],
    },
  ];

  const stats = [
    { number: "10K+", label: "Issues Resolved" },
    { number: "5K+", label: "Active Citizens" },
    { number: "250+", label: "Field Employees" },
    { number: "95%", label: "Satisfaction Rate" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Report Issue",
      description: "Citizens report civic issues with photos and location",
      icon: <AlertCircle className="w-8 h-8" />,
    },
    {
      step: "2",
      title: "Admin Reviews",
      description: "Admins review and assign to field employees",
      icon: <CheckCircle className="w-8 h-8" />,
    },
    {
      step: "3",
      title: "In Progress",
      description: "Employees work on resolving the issue",
      icon: <Clock className="w-8 h-8" />,
    },
    {
      step: "4",
      title: "Resolved",
      description: "Issue marked complete, citizen receives notification",
      icon: <TrendingUp className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Civi<span className="text-teal-600">Q</span>
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-teal-600 font-medium transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-teal-600 font-medium transition"
              >
                How It Works
              </a>
              <a
                href="#users"
                className="text-gray-700 hover:text-teal-600 font-medium transition"
              >
                For Users
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-teal-600 font-medium transition"
              >
                Contact
              </a>
            </div>

            {/* CTA Buttons */}
        {/* CTA Buttons */}
<div className="hidden md:flex items-center space-x-4">

  {/* SIGN IN BUTTON */}
  {/* <button
    onClick={() => navigate("/login")}
    className="px-6 py-2.5 text-gray-700 font-medium hover:text-teal-600 transition"
  >
    Sign In
  </button> */}

  {/* GET STARTED BUTTON */}
  <button
    onClick={() => {
      // If logged in, go to report page
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) navigate("/user-home");
      else navigate("/signup"); // or "/signup" — whichever your app uses
    }}
    className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white 
               rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
  >
    Get Started
  </button>

</div>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-teal-600 font-medium"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-teal-600 font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#users"
                  className="text-gray-700 hover:text-teal-600 font-medium"
                >
                  For Users
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-teal-600 font-medium"
                >
                  Contact
                </a>
                
                <button onClick={() => navigate("/login")} className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-medium">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - adjust top padding for fixed nav */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Updated Background with better civic colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float hidden md:block">
          <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float-delayed hidden md:block">
          <div className="w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 max-w-7xl mx-auto mb-10 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  CiviQ
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8">
                Your Voice, Our Action. Report civic issues, track progress, and
                build a better community together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <button onClick={()=> navigate("/report-issues")} className="w-full sm:w-auto px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  Report an Issue
                </button>
                <button onClick={()=>navigate("/track-issues")} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  Track-Issues
                </button>
              </div>

              {/* Stats Preview - moved under buttons on mobile */}
              <div
                className="mt-12 grid grid-cols-2 gap-4 md:gap-6 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20"
                  >
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-xs md:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image Carousel */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                {/* Carousel Images */}
                <div className="relative h-64 md:h-80 lg:h-96">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Civic issue ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  ))}

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all duration-300"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all duration-300"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Carousel Caption */}
                <div className="p-4 md:p-6 bg-gradient-to-br from-teal-800/80 to-emerald-800/80 backdrop-blur-sm">
                  <p className="text-white font-semibold text-sm md:text-base">
                    Real civic issues reported by citizens like you
                  </p>
                  <p className="text-white/70 text-xs md:text-sm mt-1">
                    Help us make our community better
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Civic Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to report, track, and resolve civic issues
              efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-teal-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600 mb-6 transition-transform duration-300 ${activeCard === index ? "scale-110" : ""}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              PROCESS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to make your city better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 h-full border border-gray-200">
                  <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-teal-600 mb-6 mt-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="users" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              FOR EVERYONE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for every role in the civic ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-10 border border-gray-200 hover:border-teal-500 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${type.color} text-white mb-6 shadow-lg`}
                  >
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {type.title}
                  </h3>
                  <ul className="space-y-4">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effect */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of citizens working together to improve our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg
            -white text-teal-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              Get Started Today
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Civi<span className="text-teal-400">Q</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Making cities better, one report at a time. CiviQ connects
                citizens, administrators, and field employees for efficient
                civic issue management.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-teal-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-teal-400 transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Press Kit
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 CiviQ. Built by Puneeth & Zaweed. All rights
                reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-teal-400 transition">
                  Privacy
                </a>
                <a href="#" className="hover:text-teal-400 transition">
                  Terms
                </a>
                <a href="#" className="hover:text-teal-400 transition">
                  Cookies
                </a>
              </div>
            </div>
          </div>
          <Chatbot />
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
