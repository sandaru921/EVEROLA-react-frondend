import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizResultTable = () => {
  const [quizResults, setQuizResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://localhost:5031/api/quiz/results")
      .then((res) => setQuizResults(res.data.$values))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="py-5">
        <h2 className="text-teal-500 font-semibold text-lg mb-4">
          Quiz Results
        </h2>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-gray-600 text-left">
            <th className="py-2 px-4">Quiz ID</th>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Score</th>
            <th className="py-2 px-4">Total Marks</th>
            <th className="py-2 px-4">Submission Time</th>
            <th className="py-2 px-4">Time Taken (s)</th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((result, index) => (
            <tr key={result.id} className="bg-blue-50 rounded-xl mb-2">
              <td className="py-3 px-4 text-black">{result.quizId}</td>
              <td className="py-3 px-4 text-black">{result.userId}</td>
              <td className="py-3 px-4 text-center text-gray-800">{result.score}</td>
              <td className="py-3 px-4 text-center text-gray-800">{result.totalMarks}</td>
              <td className="py-3 px-4 text-gray-600">
                {new Date(result.submissionTime).toLocaleString() ?? "N/A"}
              </td>
              <td className="py-3 px-4 text-center text-gray-800">{result.timeTaken}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => navigate(`/results/${result.id}`)}
                  className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-1 px-4 rounded-full shadow-sm"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResultTable