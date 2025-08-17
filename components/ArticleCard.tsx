import React from "react";
import { useNavigate } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  image?: string;
  category?: string;
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const navigate = useNavigate();

  return (
    <div className="w-80 h-[460px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 relative">
      {/* Image */}
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-44 object-cover"
        />
      )}

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        {article.category ? (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            {article.category}
          </span>
        ):null}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
          {article.title}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          By {article.author} • {article.date}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
          {article.content}
        </p>

        <button
          onClick={() => navigate(`/articles/${article.id}`)}
          className="mt-auto text-end hover:underline text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Read More →
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
