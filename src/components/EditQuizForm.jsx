import React, { useEffect, useState } from "react";
import axios from "axios";

const EditQuizForm = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:5031/api/Quiz/${quizId}`)
      .then((res) => {
        setQuiz(res.data);
      })
      .catch((err) => console.error("Error fetching quiz:", err));
  }, [quizId]);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quiz.questions.$values];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: { $values: updatedQuestions } });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const updatedQuestions = [...quiz.questions.$values];
    updatedQuestions[qIndex].options.$values[oIndex].value = e.target.value;
    setQuiz({ ...quiz, questions: { $values: updatedQuestions } });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: 0,
      questionText: "",
      codeSnippet: "",
      imageURL: "",
      type: "Single Choice",
      marks: 1,
      options: {
        $values: [
          { id: 0, key: "A", value: "", questionId: 0 },
          { id: 0, key: "B", value: "", questionId: 0 },
        ],
      },
      correctAnswers: { $values: [] },
      quizId: quizId,
    };
    setQuiz({
      ...quiz,
      questions: {
        $values: [...quiz.questions.$values, newQuestion],
      },
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...quiz.questions.$values];
    updatedQuestions.splice(index, 1);
    setQuiz({ ...quiz, questions: { $values: updatedQuestions } });
  };

  const handleSubmit = () => {
    axios.put(`https://localhost:5031/api/Quiz/${quizId}`, quiz)
      .then(() => alert("Quiz updated successfully!"))
      .catch((err) => console.error("Error updating quiz:", err));
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Quiz</h2>

      {/* Quiz Info */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Quiz Name</label>
        <input
          type="text"
          name="quizName"
          value={quiz.quizName}
          onChange={handleQuizChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            name="jobCategory"
            value={quiz.jobCategory}
            onChange={handleQuizChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Level</label>
          <input
            name="quizLevel"
            value={quiz.quizLevel}
            onChange={handleQuizChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      <div className="mb-4 mt-4">
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          name="description"
          value={quiz.description}
          onChange={handleQuizChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Questions */}
      <h3 className="text-xl font-bold my-4">Questions</h3>
      {quiz.questions.$values.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 border p-4 rounded bg-gray-50">
          <div className="flex justify-between">
            <label className="font-semibold">Question {qIndex + 1}</label>
            <button
              onClick={() => handleDeleteQuestion(qIndex)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>

          <input
            className="border p-2 w-full mt-2"
            name="questionText"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIndex, e)}
            placeholder="Enter question text"
          />

          <textarea
            className="border p-2 w-full mt-2"
            name="codeSnippet"
            value={q.codeSnippet}
            onChange={(e) => handleQuestionChange(qIndex, e)}
            placeholder="Enter code snippet (optional)"
          />

          <h4 className="font-semibold mt-3">Options</h4>
          {q.options.$values.map((opt, oIndex) => (
            <div key={oIndex} className="flex gap-2 items-center mt-1">
              <span className="font-bold">{opt.key}</span>
              <input
                className="border p-2 w-full"
                value={opt.value}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleAddQuestion}
        className="bg-green-100 text-green-700 px-4 py-2 rounded shadow hover:bg-green-200"
      >
        + Add Question
      </button>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditQuizForm;
