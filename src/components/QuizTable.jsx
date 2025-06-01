import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizTable = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://localhost:5031/api/Quiz") // Change to your actual backend endpoint
      .then((res) => setQuizzes(res.data.$values))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="py-5 flex justify-between item-center">
        <h2 className="text-teal-500 font-semibold text-lg mb-4">
          Active Quizzes
        </h2>
        <p className="px-5 py-2 bg-[#4F46E5] text-white rounded">
          <a href="/addNewQuiz">+ Add New Quiz</a>
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
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={index} className="bg-blue-50 rounded-xl mb-2">
              <td className="py-3 px-4 text-black">{quiz.quizName}</td>
              <td className="py-3 px-4 text-gray-600">
                {quiz.date ?? "Not Assigned"}
              </td>
              <td className="py-3 px-4 text-center text-gray-800">
                {quiz.questions?.$values.length ?? 0}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => navigate(`/tryout/${quiz.id}`)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
