import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TryOutQuiz = () => {
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
  const startTimeRef = useRef(null); // 👈 useRef for startTime

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
        startTimeRef.current = Date.now(); // ⏱️ start time recorded here
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (!quizLoaded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit when time is up
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
  const handleSubmit = () => {
    if (!quiz || !quiz.questions?.$values) return;

    let score = 0;
    const totalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

    quiz.questions.$values.forEach((q) => {
      const correct = q.correctAnswers.$values;
      const userAnswer = answers[q.id] || (q.type === "Checkbox" ? [] : "");

      const isCorrect =
        q.type === "Checkbox"
          ? JSON.stringify([...correct].sort()) === JSON.stringify([...userAnswer].sort())
          : userAnswer === correct[0];

      if (isCorrect) score += q.marks;
    });

    setFinalScore(score);
    setTimeTaken(totalTime);
    setShowResult(true);
  };

  if (!quizLoaded || !quiz) return <div>Loading...</div>;

  const question = quiz.questions.$values[currentIndex];
  const selected =
    answers[question.id] || (question.type === "Checkbox" ? [] : "");

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Quiz Result: {quiz.quizName}
        </h2>
        <p className="mb-2 text-lg">
          🏁 Score: {finalScore}/{quiz.questions.$values.reduce((sum, q) => sum + q.marks, 0)}
        </p>
        <p className="mb-4 text-lg">
          ⏱️ Time Taken: {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, "0")}
        </p>
        <hr className="mb-6" />

        {quiz.questions.$values.map((q, index) => {
          const correct = q.correctAnswers.$values;
          const userAnswer = answers[q.id] || (q.type === "Checkbox" ? [] : "");
          const isCorrect =
            q.type === "Checkbox"
              ? JSON.stringify([...correct].sort()) === JSON.stringify([...userAnswer].sort())
              : userAnswer === correct[0];

          return (
            <div key={q.id} className="mb-6 p-4 border rounded shadow-sm bg-gray-50">
              <p className="font-semibold mb-1">{index + 1}. {q.questionText}</p>
              {q.codeSnippet && (
                <pre className="bg-gray-100 p-2 rounded text-sm my-2">{q.codeSnippet}</pre>
              )}
              <div className="text-sm mb-1">
                <span className="font-medium">Your Answer: </span>
                {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || "Not answered"}
              </div>
              <div className="text-sm mb-1">
                <span className="font-medium">Correct Answer: </span>
                {correct.join(", ")}
              </div>
              <div className={`mt-2 font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "✅ Correct" : "❌ Incorrect"}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-6 pb-4 flex justify-between items-center px-6 py-10">
          <div>
            <h2 className="text-2xl font-bold text-teal-600">{quiz.quizName}</h2>
            <p className="text-gray-500">{quiz.description}</p>
          </div>
          <p className="text-gray-500">
            Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </p>
        </div>
        <hr />
      </div>

      <div className="flex mt-10">
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md w-full ">
          <div className="mb-4">
            <p className="font-medium">
              {currentIndex + 1}. {question.questionText}
            </p>
            {question.codeSnippet && (
              <pre className="bg-gray-100 p-2 rounded text-sm my-2">{question.codeSnippet}</pre>
            )}
            <div className="mt-2 space-y-2">
              {question.options.$values.map((opt) => (
                <label key={opt.id} className="block">
                  <input
                    type={question.type === "Checkbox" ? "checkbox" : "radio"}
                    name={`question-${question.id}`}
                    value={opt.key}
                    checked={
                      question.type === "Checkbox"
                        ? selected.includes(opt.key)
                        : selected === opt.key
                    }
                    onChange={() =>
                      handleChange(question.id, opt.key, question.type === "Checkbox")
                    }
                    className="mr-2"
                  />
                  {opt.key}) {opt.value}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Previous
            </button>
            {currentIndex < quiz.questions.$values.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 h-fit mr-8">
          {quiz.questions.$values.map((q, index) => {
            const isCurrent = index === currentIndex;
            const hasAnswered =
              answers[q.id] &&
              (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);

            let bgColor = "bg-gray-300";
            if (hasAnswered) bgColor = "bg-green-500";
            if (isCurrent) bgColor = "bg-yellow-400";

            return (
              <button
                key={q.id}
                className={`w-10 h-10 text-white font-bold rounded ${bgColor}`}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TryOutQuiz;
