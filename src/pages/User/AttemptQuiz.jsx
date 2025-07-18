import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const startTimeRef = useRef(null);

  // Fetch quiz data
  useEffect(() => {
    axios
      .get(`https://localhost:5031/api/Quiz/${id}`)
      .then((res) => {
        const data = res.data;
        const questions = data.questions.$values.sort(() => Math.random() - 0.5);
        data.questions.$values = questions;
        setQuiz(data);
        setTimeLeft(data.quizDuration * 60);
        setQuizLoaded(true);
        startTimeRef.current = Date.now();
      })
      .catch((err) => console.error("Error fetching quiz:", error.response.data.message || JSON.stringify(error.response.data)));
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (!quizLoaded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizLoaded, timeLeft]);

  // Answer Change Handler
  const handleChange = (questionId, value, isCheckbox = false) => {
    setAnswers((prev) => {
      if (isCheckbox) {
        const current = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!quiz || !quiz.questions?.$values) return;

    let score = 0;
    const totalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const answersList = [];

    // Calculate score and prepare answers list
    quiz.questions.$values.forEach((q) => {
      const correct = q.correctAnswers.$values;
      const userAnswer = answers[q.id] || (q.type === "Multiple Choice" ? [] : "");
      let questionScore = 0;
      let isCorrect = false;

      if (q.type === "Multiple Choice") {
        const totalCorrect = correct.length;
        const userCorrect = userAnswer.filter((ans) => correct.includes(ans)).length;
        const userIncorrect = userAnswer.filter((ans) => !correct.includes(ans)).length;
        
        const sortedCorrect = [...correct].sort();
        const sortedUserAnswer = [...userAnswer].sort();
        isCorrect = JSON.stringify(sortedCorrect) === JSON.stringify(sortedUserAnswer);
        
        if (isCorrect) {
          questionScore = q.marks;
          score += q.marks;
        } else if (totalCorrect > 0) {
          const partialScore = (userCorrect / totalCorrect) * q.marks;
          const penalty = (userIncorrect / totalCorrect) * q.marks * 0.5;
          questionScore = Math.max(0, partialScore - penalty);
          score += questionScore;
        }
      } else {
        isCorrect = userAnswer === correct[0];
        if (isCorrect) {
          questionScore = q.marks;
          score += q.marks;
        }
      }

      answersList.push({
        questionId: q.id,
        selectedOptions: Array.isArray(userAnswer) ? userAnswer : [userAnswer]
      });
    });

    setFinalScore(score);
    setTimeTaken(totalTime);
    setShowResult(true);

    // Hardcode userId for testing (no JWT token)
    let userId = 8; // Hardcoded for testing
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token (for reference):", decoded);
        userId = decoded.sub || decoded.userId || decoded.id || decoded.nameid || userId;
      } catch (error) {
        console.warn("No valid token, using hardcoded userId:", userId);
      }
    } else {
      console.warn("No token found in localStorage, using hardcoded userId:", userId);
    }

    // Prepare payload for backend
    const payload = {
      userId: userId.toString(),
      quizId: parseInt(id), // Convert to number to match expected payload
      timeTaken: totalTime,
      answers: answersList
    };

    console.log("Payload:", JSON.stringify(payload, null, 2)); // Debug payload

    // Send results to backend
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await axios.post("https://localhost:5031/api/Quiz/save", payload, { headers });
      console.log("Quiz results submitted successfully:", response.data);
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      if (error.response) {
        console.error("Backend error response:", error.response.data);
        alert(`Failed to submit quiz: ${error.response.data.message || JSON.stringify(error.response.data) || "Invalid request. Please check your input and try again."}`);
      } else {
        alert("Failed to submit quiz: Network error or server is unreachable.");
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return "text-green-600";
    if (timeLeft > 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (!quizLoaded || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-lg font-medium text-gray-700">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions.$values[currentIndex];
  const selected = answers[question.id] || (question.type === "Multiple Choice" ? [] : "");
  const totalMarks = quiz.questions.$values.reduce((sum, q) => sum + q.marks, 0);
  const progressPercentage = ((currentIndex + 1) / quiz.questions.$values.length) * 100;

  if (showResult) {
    const scorePercentage = Math.round((finalScore / totalMarks) * 100);
    const getScoreColor = () => {
      if (scorePercentage >= 80) return "text-green-600";
      if (scorePercentage >= 60) return "text-yellow-600";
      return "text-red-600";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
              <h2 className="text-2xl font-semibold text-indigo-600">{quiz.quizName}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{finalScore}/{totalMarks}</div>
                <div className="text-indigo-100">Total Score</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{scorePercentage}%</div>
                <div className="text-green-100">Percentage</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{formatTime(timeTaken)}</div>
                <div className="text-orange-100">Time Taken</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/admin/quizzes")}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {quiz.questions.$values.map((q, index) => {
              const correct = q.correctAnswers.$values;
              const userAnswer = answers[q.id] || (q.type === "Multiple Choice" ? [] : "");
              
              let isCorrect = false;
              let partialScore = 0;
              
              if (q.type === "Multiple Choice") {
                const totalCorrect = correct.length;
                const userCorrect = userAnswer.filter((ans) => correct.includes(ans)).length;
                const userIncorrect = userAnswer.filter((ans) => !correct.includes(ans)).length;
                
                if (totalCorrect > 0) {
                  const partialScoreCalc = (userCorrect / totalCorrect) * q.marks;
                  const penalty = (userIncorrect / totalCorrect) * q.marks * 0.5;
                  partialScore = Math.max(0, partialScoreCalc - penalty);
                  const sortedCorrect = [...correct].sort();
                  const sortedUserAnswer = [...userAnswer].sort();
                  isCorrect = JSON.stringify(sortedCorrect) === JSON.stringify(sortedUserAnswer);
                }
              } else {
                isCorrect = userAnswer === correct[0];
                partialScore = isCorrect ? q.marks : 0;
              }

              return (
                <div key={q.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className={`p-6 ${isCorrect ? 'bg-green-50 border-l-4 border-green-500' : partialScore > 0 ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : partialScore > 0 ? (
                          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">½</span>
                          </div>
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <span className={`font-semibold ${isCorrect ? 'text-green-600' : partialScore > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {isCorrect ? 'Correct' : partialScore > 0 ? 'Partial Credit' : 'Incorrect'}
                        </span>
                        {q.type === "Multiple Choice" && (
                          <span className={`text-sm font-medium px-2 py-1 rounded ${isCorrect ? 'bg-green-100 text-green-800' : partialScore > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {partialScore.toFixed(1)}/{q.marks} marks
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-4">{q.questionText}</p>
                    
                    {q.codeSnippet && (
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm mb-4 overflow-x-auto">
                        {q.codeSnippet}
                      </pre>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-blue-900 mb-2">Your Answer:</p>
                        <p className="text-blue-800">
                          {Array.isArray(userAnswer) 
                            ? userAnswer.join(", ") || "Not answered" 
                            : userAnswer || "Not answered"}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="font-medium text-green-900 mb-2">Correct Answer:</p>
                        <p className="text-green-800">{correct.join(", ")}</p>
                      </div>
                    </div>
                    
                    {q.type === "Multiple Choice" && partialScore > 0 && !isCorrect && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Partial Credit Breakdown:</strong><br/>
                          Correct selections: {userAnswer.filter(ans => correct.includes(ans)).length}/{correct.length}<br/>
                          Incorrect selections: {userAnswer.filter(ans => !correct.includes(ans)).length}<br/>
                          Score: {partialScore.toFixed(1)} out of {q.marks} marks
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{quiz.quizName}</h1>
              <p className="text-gray-600 mt-1">{quiz.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentIndex + 1} of {quiz.questions.$values.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Question {currentIndex + 1}
                  </h2>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>
                
                <p className="text-lg text-gray-800 leading-relaxed">{question.questionText}</p>
                
                {question.codeSnippet && (
                  <div className="mt-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border">
                      {question.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {question.options.$values.map((opt) => (
                  <label 
                    key={opt.id} 
                    className="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    style={{
                      borderColor: question.type === "Multiple Choice" 
                        ? selected.includes(opt.key) ? '#4f46e5' : '#e5e7eb'
                        : selected === opt.key ? '#4f46e5' : '#e5e7eb',
                      backgroundColor: question.type === "Multiple Choice" 
                        ? selected.includes(opt.key) ? '#eef2ff' : 'white'
                        : selected === opt.key ? '#eef2ff' : 'white'
                    }}
                  >
                    <input
                      type={question.type === "Multiple Choice" ? "checkbox" : "radio"}
                      name={`question-${question.id}`}
                      value={opt.key}
                      checked={
                        question.type === "Multiple Choice"
                          ? selected.includes(opt.key)
                          : selected === opt.key
                      }
                      onChange={() =>
                        handleChange(question.id, opt.key, question.type === "Multiple Choice")
                      }
                      className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-indigo-600 mr-2">{opt.key})</span>
                      <span className="text-gray-800">{opt.value}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-semibold rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
                
                {currentIndex < quiz.questions.$values.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-3">
                {quiz.questions.$values.map((q, index) => {
                  const isCurrent = index === currentIndex;
                  const hasAnswered =
                    answers[q.id] &&
                    (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);

                  let buttonClass = "w-12 h-12 rounded-lg font-semibold transition-all duration-200 hover:shadow-md ";
                  
                  if (isCurrent) {
                    buttonClass += "bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300";
                  } else if (hasAnswered) {
                    buttonClass += "bg-green-500 text-white hover:bg-green-600";
                  } else {
                    buttonClass += "bg-gray-200 text-gray-600 hover:bg-gray-300";
                  }

                  return (
                    <button
                      key={q.id}
                      className={buttonClass}
                      onClick={() => setCurrentIndex(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                  <span className="text-gray-600">Current Question</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;