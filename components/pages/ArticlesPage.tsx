import React, { useRef, useEffect } from "react";
import ArticleCard from "../ArticleCard";
import mockArticles  from "../../utils/mockArticles";

const ArticlesPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const handleMouseEnter = () => {
      interval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 2; // smooth auto scroll
        }
      }, 20);
    };

    const handleMouseLeave = () => {
      clearInterval(interval);
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      clearInterval(interval);
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      // If scrolled to the very end, reset to start
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        container.scrollLeft = 0;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Duplicate articles for infinite effect
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
