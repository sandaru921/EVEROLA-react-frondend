import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizTable = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://localhost:5031/api/Quiz");
        // Handle case where data or $values might be undefined
        const quizData = response.data?.["$values"] || response.data || [];
        setQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
        setQuizzes([]); // Default to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading quizzes...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="py-5 flex justify-between items-center">
        <h2 className="text-teal-500 font-semibold text-lg mb-4">Active Quizzes</h2>
        <p className="px-5 py-2 bg-[#4F46E5] text-white rounded">
          <a href="/admin/addNewQuiz">+ Add New Quiz</a>
        </p>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-gray-600 text-left">
            <th className="py-2 px-4">Quiz Name</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">No Of Questions</th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4"></th> {/* Added for Delete button alignment */}
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <tr key={quiz.Id} className="bg-blue-50 rounded-xl mb-2">
                <td className="py-3 px-4 text-black">{quiz.QuizName || "N/A"}</td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) || "Not Assigned"}
                </td>
                <td className="py-3 px-4 text-center text-gray-800">
                  {quiz.Questions?.length ?? 0}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => navigate(`/admin/tryout/${quiz.Id}`)}
                    className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-1 px-4 rounded-full shadow-sm"
                  >
                    TryOut
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-1 px-4 rounded-full shadow-sm">
                    Edit
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-full shadow-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                No quizzes available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;