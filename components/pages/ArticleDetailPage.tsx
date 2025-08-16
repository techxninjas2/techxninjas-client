import { useParams, Link } from "react-router-dom";
import mockArticles  from "../../utils/mockArticles";

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const article = mockArticles.find((a) => a.id === Number(id));

  if (!article) {
    return <div className="p-6 text-center text-gray-600">Article not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <img
          src={article.image || "https://picsum.photos/1200/800?random=" + article.id}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 animate-fadeInUp">
            {article.title}
          </h1>
          <p className="text-gray-200 text-sm md:text-base">
            By <span className="font-semibold">{article.author}</span> •{" "}
            {new Date(article.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Floating Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/articles"
          className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white transition-all duration-300"
        >
          ← Back
        </Link>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg md:prose-xl dark:prose-invert prose-indigo leading-relaxed animate-fadeIn">
          <p>{article.content}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
            turpis eu facilisis porttitor, justo nulla commodo elit, sed luctus
            libero dolor at purus. Suspendisse potenti. Morbi eget est sit amet
            velit faucibus tempus. 🌿
          </p>
          <p>
            Cras non ipsum id lacus fermentum dapibus. Integer nec augue in lorem
            ultrices pretium sed id magna. Aenean sed felis sed magna suscipit
            sagittis vel at nunc. 🚀
          </p>
        </article>
      </div>

      {/* Suggested Articles / Footer (Optional) */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          You might also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mockArticles.slice(0, 2).map((related) => (
            <Link
              key={related.id}
              to={`/articles/${related.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <img
                src={related.image || "https://picsum.photos/600/400?random=" + related.id}
                alt={related.title}
                className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {related.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(related.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
