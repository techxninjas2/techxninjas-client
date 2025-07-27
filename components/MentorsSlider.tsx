import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomepageMentor } from "../types";
import { useInView } from "react-intersection-observer";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

interface MentorsSliderProps {
  mentors: HomepageMentor[];
  autoplay?: boolean;
  delay?: number;
  className?: string;
}

const MentorsSlider: React.FC<MentorsSliderProps> = ({
  mentors,
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

  if (!isMounted || mentors.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        navigation={{
          prevEl: ".mentor-prev",
          nextEl: ".mentor-next",
        }}
        pagination={{
          clickable: true,
          el: ".mentor-pagination",
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
        {mentors.map((mentor) => (
          <SwiperSlide key={mentor.id}>
            <div className="text-center group">
              <img
                src={
                  mentor.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    mentor.name
                  )}&background=random&color=fff&size=128`
                }
                alt={mentor.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border-2 border-brand-ninja-gold"
              />
              <h4 className="font-semibold text-brand-dark-gray dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors text-sm sm:text-base">
                {mentor.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {mentor.role}
              </p>
              <p className="text-xs text-brand-light-blue">{mentor.company}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className="mentor-prev absolute top-1/2 -left-4 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 transform -translate-y-1/2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block">
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      <button className="mentor-next absolute top-1/2 -right-4 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 transform -translate-y-1/2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block">
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Custom pagination */}
      <div className="mentor-pagination flex justify-center mt-4"></div>
    </div>
  );
};

export default MentorsSlider;
