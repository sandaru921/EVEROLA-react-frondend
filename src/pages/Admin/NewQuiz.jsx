import React, { useState } from 'react';
import { Plus, Trash2, Upload, Eye, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

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
      codeSnippet : '',
      image: '',
      marks: 1,
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'marks') {
      const num = Number(value);
      updated[index][field] = isNaN(num) || num < 0 ? 0 : num;
    } else {
      updated[index][field] = value;
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
        codeSnippet: '',
        correctAnswers: [],
        image: '',
        marks: 1,
      },
    ]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const getTotalMarks = () => {
    return questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  };

  const getQuestionTypeColor = (type) => {
    switch(type) {
      case 'Single Choice': return 'bg-blue-100 text-blue-800';
      case 'Multiple Choice': return 'bg-green-100 text-green-800';
      case 'Text Base': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      codeSnippet: q.codeSnippet,
      imageURL: q.image || "",
      type: q.type,
      marks: q.marks,
      options: q.options.map((opt, idx) => ({
        key: String.fromCharCode(65 + idx),
        value: opt,
      })),
      correctAnswers: q.correctAnswers.map((idx) => String.fromCharCode(65 + idx)),
    }));

    const quizData = {
      quizName,
      jobCategory,
      description,
      quizDuration: 10,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
              <p className="text-gray-600">Build comprehensive quizzes for skill assessment</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Marks</p>
                <p className="text-2xl font-bold text-green-600">{getTotalMarks()}</p>
              </div>
            </div>
          </div>

          {/* Quiz Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Quiz Name *</label>
              <input
                type="text"
                placeholder="Enter quiz name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Job Category</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
              >
                <option value="">Select Job Category</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Software Engineer</option>
                <option>Full Stack Developer</option>
                <option>DevOps Engineer</option>
                <option>Data Scientist</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                placeholder="Provide a brief description of the quiz"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Quiz Level</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={quizLevel}
                onChange={(e) => setQuizLevel(e.target.value)}
              >
                <option value="">Select Quiz Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={addQuestion}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Question Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(q.type)}`}>
                      {q.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      value={q.type}
                      onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    >
                      <option>Single Choice</option>
                      <option>Multiple Choice</option>
                      <option>Text Base</option>
                    </select>
                    <button
                      onClick={() => deleteQuestion(index)}
                      disabled={questions.length === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        questions.length === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Question Text *</label>
                  <textarea
                    placeholder="Enter your question here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={2}
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  />
                  <label className="block text-sm font-semibold text-gray-700">Code Snippet</label>
                  <textarea
                    placeholder="Enter your code snippet here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={2}
                    value={q.codeSnippet}
                    onChange={(e) => handleQuestionChange(index, 'codeSnippet', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Marks</label>
                    <input
                      type="number"
                      min="0"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={q.marks}
                      onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Image (Optional)</label>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </label>
                      {q.image && (
                        <span className="text-sm text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Image uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {q.image && (
                  <div className="relative inline-block">
                    <img
                      src={q.image}
                      alt="Question"
                      className="max-w-xs max-h-48 rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => handleQuestionChange(index, 'image', '')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {q.type !== 'Text Base' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Answer Options</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                          <input
                            type={q.type === 'Multiple Choice' ? 'checkbox' : 'radio'}
                            name={`correct-${index}`}
                            checked={q.correctAnswers.includes(optIndex)}
                            onChange={() => handleCorrectAnswerChange(index, optIndex)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    {q.correctAnswers.length === 0 && (
                      <div className="flex items-center text-amber-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Please select at least one correct answer
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quiz Preview</h3>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {q.questionText || 'Sample Question'}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(q.type)}`}>
                        {q.type}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                      </span>
                    </div>
                  </div>
                  
                  {q.image && (
                    <img src={q.image} alt="Question" className="mb-4 max-w-xs rounded-lg border" />
                  )}
                  
                  {q.type === 'Text Base' ? (
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-gray-500 italic">Text-based answer expected</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                          <input
                            type={q.type === 'Multiple Choice' ? 'checkbox' : 'radio'}
                            checked={q.correctAnswers.includes(i)}
                            readOnly
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <label className="text-gray-700">{opt || `Option ${i + 1}`}</label>
                          {q.correctAnswers.includes(i) && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSaveQuiz}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;