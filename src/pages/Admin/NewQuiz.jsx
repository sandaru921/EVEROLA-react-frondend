import React, { useState } from 'react';

const AddQuiz = () => {
  const [quizName, setQuizName] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quizLevel, setQuizLevel] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      type: 'Single Choice',
      options: ['', '', '', ''],
      correctAnswers: [],
      image: '',
      marks: 0,
    },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'marks') {
      // Ensure marks is a number and >= 0
      const num = Number(value);
      updated[index][field] = isNaN(num) || num < 0 ? 0 : num;
    } else {
      updated[index][field] = value;
      // Reset options and correct answers if type changed
      if (field === 'type') {
        if (value === 'Text Base') {
          updated[index].options = [];
          updated[index].correctAnswers = [];
        } else {
          updated[index].options = ['', '', '', ''];
          updated[index].correctAnswers = [];
        }
      }
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    const updated = [...questions];
    const question = updated[qIndex];

    if (question.type === 'Single Choice') {
      question.correctAnswers = [optIndex];
    } else if (question.type === 'Multiple Choice') {
      if (question.correctAnswers.includes(optIndex)) {
        question.correctAnswers = question.correctAnswers.filter(i => i !== optIndex);
      } else {
        question.correctAnswers.push(optIndex);
      }
    }

    setQuestions(updated);
  };

  const handleImageUpload = (e, qIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...questions];
      updated[qIndex].image = reader.result;
      setQuestions(updated);
    };
    reader.readAsDataURL(file);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        type: 'Single Choice',
        options: ['', '', '', ''],
        correctAnswers: [],
        image: '',
        marks: 0,
      },
    ]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (!quizName.trim()) {
      alert('Please enter the quiz name.');
      return;
    }

    for (let [i, q] of questions.entries()) {
      if (!q.questionText.trim()) {
        alert(`Question ${i + 1} is missing text.`);
        return;
      }

      if ((q.type === 'Single Choice' || q.type === 'Multiple Choice') && q.options.some(opt => !opt.trim())) {
        alert(`All options must be filled in Question ${i + 1}.`);
        return;
      }

      if ((q.type === 'Single Choice' || q.type === 'Multiple Choice') && q.correctAnswers.length === 0) {
        alert(`Please select at least one correct answer for Question ${i + 1}.`);
        return;
      }

      if (q.marks <= 0) {
        alert(`Please assign a positive mark for Question ${i + 1}.`);
        return;
      }
    }

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      codeSnippet: "",  // extend if needed
      imageURL: q.image || "",
      type: q.type,
      marks: q.marks,
      options: q.options.map((opt, idx) => ({
        key: String.fromCharCode(65 + idx),  // A, B, C, D
        value: opt,
      })),
      correctAnswers: q.correctAnswers.map((idx) => String.fromCharCode(65 + idx)),
    }));

    const quizData = {
      quizName,
      jobCategory,
      description,
      quizDuration: 1, // can be dynamic
      quizLevel,
      questions: formattedQuestions,
    };

    console.log(quizData);

    try {
      const response = await fetch('https://localhost:5031/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Error saving quiz: ' + (errorData.message || response.statusText));
        return;
      }

      const result = await response.json();
      alert('Quiz saved successfully!');
      console.log('Backend response:', result);

      // Optional: reset form or navigate away
    } catch (error) {
      alert('Failed to save quiz: ' + error.message);
      console.error('Network or server error:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow mt-10 mb-20">
      <h2 className="text-2xl mb-6">Add New Quiz</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Quiz Name *"
          className="border p-2 rounded"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={jobCategory}
          onChange={(e) => setJobCategory(e.target.value)}
        >
          <option value="">Select Job Category</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Software Engineer</option>
        </select>
      </div>

      <textarea
        placeholder="Quiz Description"
        className="w-full border p-2 rounded mb-4"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="border p-2 mb-6 w-full rounded"
        value={quizLevel}
        onChange={(e) => setQuizLevel(e.target.value)}
      >
        <option value="">Select Quiz Level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      {questions.map((q, index) => (
        <div key={index} className="mb-6 border p-4 rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Question {index + 1}</h4>
            <select
              className="border p-1 rounded"
              value={q.type}
              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
            >
              <option>Single Choice</option>
              <option>Multiple Choice</option>
              <option>Text Base</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Question Text"
            className="w-full border p-2 mb-2 rounded"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
          />

          <div className="mb-2">
            <label className="mr-2 font-medium">Marks:</label>
            <input
              type="number"
              min="0"
              className="border p-1 rounded w-20"
              value={q.marks}
              onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
            />
          </div>

          {(q.type !== 'Text Base') && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <input
                    type={q.type === 'Multiple Choice' ? 'checkbox' : 'radio'}
                    name={`correct-${index}`}
                    checked={q.correctAnswers.includes(optIndex)}
                    onChange={() => handleCorrectAnswerChange(index, optIndex)}
                  />
                  <input
                    type="text"
                    className="border p-2 flex-1 rounded"
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
            />
            {q.image && (
              <img
                src={q.image}
                alt="Question"
                className="mt-2 max-w-xs border rounded"
              />
            )}
          </div>

          <button
            className={`bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ${questions.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => deleteQuestion(index)}
            disabled={questions.length === 1}
          >
            Delete Question
          </button>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        onClick={addQuestion}
      >
        + Add Question
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Preview</h3>
        {questions.map((q, index) => (
          <div key={index} className="border p-4 mb-2 rounded bg-gray-100">
            <p className="mb-1 font-medium">{q.questionText || 'Sample Question'}</p>
            <p className="mb-2 font-semibold">Marks: {q.marks}</p>
            {q.image && <img src={q.image} alt="Question" className="mb-2 max-w-xs" />}
            {q.type === 'Text Base' ? (
              <p className="italic text-gray-600">Text-based answer</p>
            ) : (
              q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type={q.type === 'Multiple Choice' ? 'checkbox' : 'radio'}
                    checked={q.correctAnswers.includes(i)}
                    readOnly
                  />
                  <label className="ml-2">{opt || `Option ${i + 1}`}</label>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600" onClick={handleSaveQuiz}>
          Save
        </button>
        <button className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  );
};

export default AddQuiz;
