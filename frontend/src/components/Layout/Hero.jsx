import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import các hình ảnh cho slideshow
import heroImg1 from "../../assets/rabbit-hero.webp";
import heroImg2 from "../../assets/895b1beb328cc89.jpg_wh860.jpg";
import heroImg3 from "../../assets/banner-thoi-trang.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: heroImg1,
      title: "Vacation Ready",
      subtitle:
        "Explore our vacation-ready outfits with fast worldwide shipping.",
    },
    {
      image: heroImg2,
      title: "Summer Collection",
      subtitle: "Discover the latest trends for your summer getaway.",
    },
    {
      image: heroImg3,
      title: "Beach Essentials",
      subtitle: "Everything you need for the perfect beach vacation.",
    },
  ];

  // Tự động chuyển slide mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Slideshow */}
      <div className="relative h-[400px] md:h-[600px] lg:h-[750px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Nội dung trung tâm */}
      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            {slides[currentSlide].title.split(" ")[0]} <br />{" "}
            {slides[currentSlide].title.split(" ").slice(1).join(" ")}
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            {slides[currentSlide].subtitle}
          </p>
          <Link
            to="/collections/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg hover:bg-gray-200 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full z-50 transition-all"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full z-50 transition-all"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Chỉ số slide */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
