import { FaDatabase } from 'react-icons/fa';

const LearningPaths = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Explore Learning Paths</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Web Development Column */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-2">Web Development</h2>
          <p className="text-gray-600 mb-4">
            Learn HTML, CSS, JavaScript and frameworks like React and Next.js to build modern websites.
          </p>
          <a
            href="https://www.udemy.com/course/the-web-developer-bootcamp/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Explore Course
          </a>
        </div>

        {/* ✅ Data Science Column */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-500">
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center">
            <FaDatabase className="mr-2" />
            Data Science
          </h2>
          <p className="text-gray-600 mb-4">
            Dive into data analysis, machine learning, and AI with real-world projects and expert guidance.
          </p>
          <a
            href="https://www.udemy.com/course/the-data-science-course-complete-data-science-bootcamp/?couponCode=PMNVD2025"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Explore Course
          </a>
        </div>

        {/* UI/UX Design Column */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-2">UI/UX Design</h2>
          <p className="text-gray-600 mb-4">
            Design intuitive user interfaces and seamless user experiences with Figma and design systems.
          </p>
          <a
            href="https://www.udemy.com/course/user-experience-design/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Explore Course
          </a>
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;
