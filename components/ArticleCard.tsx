import { Link } from "react-router-dom";

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
  return (
    <div className="w-[380px] h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={article.image || "https://picsum.photos/600/400?random=" + article.id}
          alt={article.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        {article.category && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {article.category}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          By <span className="font-medium text-gray-700 dark:text-gray-300">{article.author}</span> •{" "}
          {new Date(article.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4 flex-grow">
          {article.content}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <Link
          to={`/articles/${article.id}`}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-semibold flex items-center gap-1"
        >
          Read More 
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
