import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Testimonial } from "../types";
import { useInView } from "react-intersection-observer";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  delay?: number;
  className?: string;
}

const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({
  testimonials,
  autoplay = true,
  delay = 3000,
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Set mounted state after component mounts to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || testimonials.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: ".testimonial-prev",
          nextEl: ".testimonial-next",
        }}
        pagination={{
          clickable: true,
          el: ".testimonial-pagination",
        }}
        autoplay={
          autoplay && inView
            ? {
                delay: delay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        loop={true}
        className="py-8"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="flex">
            <div className="bg-brand-off-white dark:bg-brand-dark-gray p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 min-h-[340px] h-full w-full">
              <img
                src={
                  testimonial.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    testimonial.name
                  )}&background=random&color=fff&size=96`
                }
                alt={testimonial.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 shadow-md"
              />
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic text-sm sm:text-base">
                "{testimonial.review}"
              </p>
              <div className="mt-auto">
                <h4 className="font-semibold text-brand-primary dark:text-brand-ninja-gold text-sm sm:text-base">
                  {testimonial.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.designation}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className="testimonial-prev absolute top-1/2 -left-4 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 transform -translate-y-1/2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block">
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      <button className="testimonial-next absolute top-1/2 -right-4 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 transform -translate-y-1/2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block">
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Custom pagination */}
      <div className="testimonial-pagination flex justify-center mt-4"></div>
    </div>
  );
};

export default TestimonialsSlider;
