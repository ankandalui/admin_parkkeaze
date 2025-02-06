"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PresentationSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const slides = [
    "https://res.cloudinary.com/dislegzga/image/upload/v1738866183/bcq2nts0chvq7rd8xstr.png",
    "https://res.cloudinary.com/dislegzga/image/upload/v1738866182/sf9ouw1tqcy8vjo4ml9j.png",
    "https://res.cloudinary.com/dislegzga/image/upload/v1738866182/rtm08lra3ohbjdlm0wye.png",
    "https://res.cloudinary.com/dislegzga/image/upload/v1738866183/gcsvsomwzqwamyplictn.png",
    "https://res.cloudinary.com/dislegzga/image/upload/v1738866184/jizmiwvzlwtawsmrlihg.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="relative h-[600px] rounded-xl overflow-hidden shadow-3xl">
        <img
          src={slides[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Left Navigation Area */}
        <div
          className="absolute inset-y-0 left-0 w-1/4"
          onMouseEnter={() => setShowLeftButton(true)}
          onMouseLeave={() => setShowLeftButton(false)}
        >
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-opacity duration-300 ${
              showLeftButton ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Right Navigation Area */}
        <div
          className="absolute inset-y-0 right-0 w-1/4"
          onMouseEnter={() => setShowRightButton(true)}
          onMouseLeave={() => setShowRightButton(false)}
        >
          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-opacity duration-300 ${
              showRightButton ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
