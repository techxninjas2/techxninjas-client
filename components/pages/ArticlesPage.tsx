import React, { useRef, useEffect } from "react";
import ArticleCard from "../ArticleCard";
import mockArticles from "../../utils/mockArticles";

const ArticlesPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle auto scroll on hover
  const startAutoScroll = () => {
    if (scrollInterval.current) return; // avoid multiple intervals
    scrollInterval.current = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 0.2, behavior: "smooth" });
      }
    }, 1000);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("mouseenter", startAutoScroll);
    container.addEventListener("mouseleave", stopAutoScroll);

    return () => {
      stopAutoScroll();
      if (container) {
        container.removeEventListener("mouseenter", startAutoScroll);
        container.removeEventListener("mouseleave", stopAutoScroll);
      }
    };
  }, []);

  // Infinite looping
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        container.scrollLeft = 0;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Duplicate for infinite effect
  const infiniteArticles = [...mockArticles, ...mockArticles];

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Latest Articles
      </h1>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        {infiniteArticles.map((article, index) => (
          <div key={index} className="snap-center">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
