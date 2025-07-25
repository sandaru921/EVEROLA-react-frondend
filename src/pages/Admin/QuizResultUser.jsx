import React, { useEffect, useState } from "react";
import { Clock, User, Calendar, CheckCircle, XCircle, Award } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Note: You'll need to install these dependencies in your project:
// npm install axios react-router-dom
// For this demo, we'll simulate the imports


const QuizSummary = () => {
  const { quizResultId } = useParams();
  const [quizResult, setQuizResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get quiz result (basic info)
        const quizResultRes = await axios.get(`https://localhost:5031/api/Quiz/results/${quizResultId}`);
        const quizResultData = quizResultRes.data;
        
        setQuizResult(quizResultData);
        
        // 2. Get user's answers
        const answersRes = await axios.get(`https://localhost:5031/api/Quiz/answers/${quizResultId}`);
        const answerData = answersRes.data.answers?.$values || [];
        
        setAnswers(answerData);
        
        // 3. Get full quiz structure
        const quizRes = await axios.get(`https://localhost:5031/api/Quiz/${quizResultData.quizId}`);
        setQuiz(quizRes.data);
      } catch (error) {
        console.error("Error loading quiz data", error);
        setError("Failed to load quiz data. Please try again.");
        
        // Fallback to mock data for demonstration
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizResultId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-2">Error Loading Data</p>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Showing demo data instead</p>
        </div>
      </div>
    );
  }

  if (!quizResult || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No data found.</p>
        </div>
      </div>
    );
  }

  // Placeholder user info
  const user = {
    id: quizResult.userId,
    name: "Placeholder User",
    email: "user@example.com"
  };

  const questions = quiz.questions?.$values || [];
  const scorePercentage = Math.round((quizResult.score / quizResult.totalMarks) * 100);

  const getAnswerByQuestionId = (questionId) =>
    answers.find((a) => a.questionId === questionId);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.quizName}</h1>
            <div className={`px-4 py-2 rounded-full border-2 ${getScoreBgColor(scorePercentage)}`}>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className={`font-bold text-lg ${getScoreColor(scorePercentage)}`}>
                  {scorePercentage}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Candidate</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-semibold text-gray-900">
                  {quizResult.score} / {quizResult.totalMarks}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="font-semibold text-gray-900">{formatTime(quizResult.timeTaken)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-semibold text-gray-900">
                  {new Date(quizResult.submissionTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(quizResult.submissionTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Review Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            Question Review
          </h2>

          <div className="space-y-6">
            {questions.map((q, index) => {
              const answer = getAnswerByQuestionId(q.id);
              const correctKeys = q.correctAnswers?.$values || [];
              const selectedKeys = answer?.selectedOptions?.$values || [];
              const isCorrect = answer?.marksObtained > 0;

              return (
                <div key={q.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Question {index + 1}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{q.questionText}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                      <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer?.marksObtained || 0} pts
                      </span>
                    </div>
                  </div>

                  {q.codeSnippet && (
                    <div className="mb-4">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {(q.options?.$values || []).map((opt) => {
                      const isCorrect = correctKeys.includes(opt.key);
                      const isSelected = selectedKeys.includes(opt.key);
                      
                      let optionClass = "flex items-center gap-3 p-3 rounded-lg border ";
                      if (isCorrect && isSelected) {
                        optionClass += "bg-green-100 border-green-300 text-green-800";
                      } else if (isCorrect) {
                        optionClass += "bg-green-50 border-green-200 text-green-700";
                      } else if (isSelected) {
                        optionClass += "bg-red-100 border-red-300 text-red-800";
                      } else {
                        optionClass += "bg-white border-gray-200 text-gray-700";
                      }

                      return (
                        <div key={opt.id} className={optionClass}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm bg-gray-200 px-2 py-1 rounded">
                              {opt.key}
                            </span>
                            {isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                          </div>
                          <span className="flex-1">{opt.value}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">Selected:</span>
                      <span className="text-gray-900">
                        {selectedKeys.length > 0 ? selectedKeys.join(", ") : "None"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">Correct:</span>
                      <span className="text-green-600 font-medium">
                        {correctKeys.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSummary;