import { useState } from 'react';
import { useParams } from 'react-router-dom';

const QuestionsByRole = () => {
    const { role } = useParams(); // Get the role from the URL parameter
    const [showAnswers, setShowAnswers] = useState({}); // State to track which answers are visible

    // Hardcoded questions and answers for each role
    const questionsData = {
        'software-engineer': [
            { id: 1, text: 'What is a software design pattern?', answer: 'A reusable solution to a common problem in software design.' },
            { id: 2, text: 'Explain the MVC architecture.', answer: 'Model-View-Controller separates application logic, UI, and data.' },
            { id: 3, text: 'What is Agile methodology?', answer: 'An iterative approach to software development with frequent deliveries.' },
            { id: 4, text: 'What is REST API?', answer: 'A set of architectural constraints for building web services.' },
            { id: 5, text: 'What is version control?', answer: 'A system to manage changes to source code (e.g., Git).' },
        ],
        'qa': [
            { id: 1, text: 'What is a test case?', answer: 'A set of conditions to verify a specific feature or function.' },
            { id: 2, text: 'What is regression testing?', answer: 'Retesting to ensure new changes don’t affect existing functionality.' },
            { id: 3, text: 'What is a bug?', answer: 'An error or flaw in the software that causes unexpected behavior.' },
            { id: 4, text: 'What is automation testing?', answer: 'Using tools to execute tests automatically.' },
        ],
        'data-analyst': [
            { id: 1, text: 'What is a pivot table?', answer: 'A tool to summarize and analyze data in a spreadsheet.' },
            { id: 2, text: 'What is SQL?', answer: 'A language for managing and querying relational databases.' },
            { id: 3, text: 'What is data visualization?', answer: 'The graphical representation of data for analysis.' },
        ],
    };

    const questions = questionsData[role] || [];

    // Toggle answer visibility for a specific question
    const toggleAnswer = (id) => {
        setShowAnswers((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <h2 className="text-3xl font-light text-gray-800 mb-10">Questions for {role.replace('-', ' ')}</h2>
            {questions.length === 0 ? (
                <p className="text-gray-500">No questions available for this role.</p>
            ) : (
                <div className="space-y-6">
                    {questions.map((question) => (
                        <div key={question.id} className="bg-gray-50 rounded-xl p-5 shadow-md">
                            <p className="text-lg text-gray-900 mb-3">{question.text}</p>
                            {showAnswers[question.id] && (
                                <p className="text-gray-600 mt-2 mb-3">{question.answer}</p>
                            )}
                            <button
                                onClick={() => toggleAnswer(question.id)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 text-sm font-medium"
                            >
                                {showAnswers[question.id] ? 'Hide Answer' : 'Show Answer'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionsByRole;