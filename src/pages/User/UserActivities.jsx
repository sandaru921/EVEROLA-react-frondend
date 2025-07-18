import { useState, useEffect } from 'react';
import UserSidebar from '../../components/UserSidebar';
import { FiMenu } from 'react-icons/fi';
import UserSearchBar from '../../components/UserSearchBar';

const mockQuizResults = [
  {
    id: 1,
    quizId: 101,
    score: 85,
    totalMarks: 100,
    submissionTime: '2025-07-15T10:30:00Z',
    timeTaken: 1200,
  },
  {
    id: 2,
    quizId: 102,
    score: 90,
    totalMarks: 100,
    submissionTime: '2025-07-16T14:45:00Z',
    timeTaken: 1100,
  },
  {
    id: 3,
    quizId: 103,
    score: 70,
    totalMarks: 100,
    submissionTime: '2025-07-17T09:00:00Z',
    timeTaken: 1500,
  },
];

const UserActivities = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setQuizResults(mockQuizResults);
    }, 500);
  }, []);

  // Calculate stats
  const totalQuizzes = quizResults.length;
  const averageScore =
    totalQuizzes === 0
      ? 0
      : (
          quizResults.reduce((sum, q) => sum + q.score, 0) / totalQuizzes
        ).toFixed(1);
  const totalTimeSeconds = quizResults.reduce((sum, q) => sum + q.timeTaken, 0);
  const totalTimeMinutes = Math.floor(totalTimeSeconds / 60);
  const totalTimeSecondsLeft = totalTimeSeconds % 60;

  return (
    
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100'
      }`}
    >
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={{ username: 'DemoUser' }}
      />
      
      <div className="md:ml-64 flex-1 p-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-black">
              Your Quiz Activities
            </h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label="Open sidebar"
            >
              <FiMenu size={28} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <p className="mt-2 text-gray-600 dark:text-black">
            Track your progress and stay motivated!
          </p>
        </header>

        {/* Summary Panel */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-[1.03] transition-transform cursor-default">
            <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2">
              Total Quizzes Taken
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalQuizzes}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-[1.03] transition-transform cursor-default">
            <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2">
              Average Score
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{averageScore} / 100</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-[1.03] transition-transform cursor-default">
            <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2">
              Total Time Spent
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {totalTimeMinutes}m {totalTimeSecondsLeft}s
            </p>
          </div>
        </section>

        {/* Activities List */}
        {quizResults.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-20">
            No activities found. Take some quizzes and your progress will show up here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizResults.map((result) => (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Quiz ID: <span className="text-blue-600 dark:text-blue-400">{result.quizId}</span>
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  Score:{' '}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {result.score} / {result.totalMarks}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  Submitted: {new Date(result.submissionTime).toLocaleString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Time Taken: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivities;
