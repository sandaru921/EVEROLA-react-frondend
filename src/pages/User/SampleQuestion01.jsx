import React, {useState} from 'react';
import Navbar from '@components/Navbar.jsx';

const questions = [
    {
        id: 1,
        type: 'radio',
        question: 'What is the primary responsibility of a software engineer?',
        options: ['Design systems', 'Install hardware', 'Perform surgeries', 'Cook meals'],
        answer: 'Design systems'
    },
    {
        id: 2,
        type: 'checkbox',
        question: 'Which of the following are programming languages?',
        options: ['Python', 'JavaScript', 'HTML', 'Photoshop'],
        answer: ['Python', 'JavaScript', 'HTML']
    },
    {
        id: 3,
        type: 'radio',
        question: 'Which methodology emphasizes iterative development?',
        options: ['Waterfall', 'Agile', 'V-Model', 'Big Bang'],
        answer: 'Agile'
    },
    {
        id: 4,
        type: 'checkbox',
        question: 'What are common version control systems?',
        options: ['Git', 'Subversion', 'Google Docs', 'Mercurial'],
        answer: ['Git', 'Subversion', 'Mercurial']
    },
    {
        id: 5,
        type: 'radio',
        question: 'Which is a relational database?',
        options: ['MongoDB', 'PostgreSQL', 'Redis', 'Cassandra'],
        answer: 'PostgreSQL'
    },
    {
        id: 6,
        type: 'checkbox',
        question: 'Select front-end technologies:',
        options: ['React', 'Angular', 'Node.js', 'Vue'],
        answer: ['React', 'Angular', 'Vue']
    },
    {
        id: 7,
        type: 'radio',
        question: 'What does CI/CD stand for?',
        options: ['Code Inspection/Code Debugging', 'Continuous Integration/Continuous Deployment', 'Cloud Integration/Cloud Deployment', 'Code Initialization/Code Delivery'],
        answer: 'Continuous Integration/Continuous Deployment'
    },
    {
        id: 8,
        type: 'checkbox',
        question: 'Which are common software testing types?',
        options: ['Unit Testing', 'Integration Testing', 'Black Box Testing', 'Car Crash Testing'],
        answer: ['Unit Testing', 'Integration Testing', 'Black Box Testing']
    },
    {
        id: 9,
        type: 'radio',
        question: 'Which tool is commonly used for containerization?',
        options: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
        answer: 'Docker'
    },
    {
        id: 10,
        type: 'checkbox',
        question: 'Which of the following are cloud providers?',
        options: ['AWS', 'Azure', 'Google Cloud', 'Linux'],
        answer: ['AWS', 'Azure', 'Google Cloud']
    }
];

const QuizPage = () => {
    const [responses, setResponses] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (qid, value, isCheckbox) => {
        setResponses((prev) => {
            const current = prev[qid] || (isCheckbox ? [] : '');
            if (isCheckbox) {
                const updated = current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value];
                return {...prev, [qid]: updated};
            } else {
                return {...prev, [qid]: value};
            }
        });
    };

    const handleSubmit = () => {
        console.log('Submitted Responses:', responses);
        setSubmitted(true);
    };

    return (
        <div style={{backgroundColor: "#9eb4bf", minHeight: "80vh"}}>
            <Navbar/>
            <div className="max-w-3xl mx-auto p-16 bg-blue-50 rounded-lg shadow-md mt-4">
                <h1 className="text-3xl font-bold mb-6" style={{color: '#005b7c'}}>Full Stack Developer Quiz</h1>

                {questions.map((q) => {
                    const userResponse = responses[q.id];
                    const correctAnswer = q.answer;
                    const isCorrect = q.type === 'checkbox'
                        ? Array.isArray(userResponse)
                        && userResponse.length === correctAnswer.length
                        && userResponse.every(val => correctAnswer.includes(val))
                        : userResponse === correctAnswer;

                    return (
                        <div key={q.id} className="mb-4 p-3 bg-white rounded shadow">
                            <p className="font-semibold mb-2" style={{color: '#008eab'}}>{q.id}. {q.question}</p>
                            {q.options.map((option) => {
                                const isChecked = q.type === 'checkbox'
                                    ? responses[q.id]?.includes(option)
                                    : responses[q.id] === option;
                                const isCorrectOption = Array.isArray(correctAnswer)
                                    ? correctAnswer.includes(option)
                                    : correctAnswer === option;

                                return (
                                    <label key={option} className="block mb-1">
                                        <input
                                            type={q.type}
                                            name={`question-${q.id}`}
                                            value={option}
                                            checked={isChecked}
                                            onChange={() => handleChange(q.id, option, q.type === 'checkbox')}
                                            className="mr-2"
                                            disabled={submitted}
                                        />
                                        {option}
                                        {submitted && isCorrectOption && (
                                            <span className="ml-2 text-green-600 font-semibold">✅</span>
                                        )}
                                        {submitted && isChecked && !isCorrectOption && (
                                            <span className="ml-2 text-red-500 font-semibold">❌</span>
                                        )}
                                    </label>
                                );
                            })}
                            {submitted && (
                                <p className={`mt-2 font-medium ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                    {isCorrect
                                        ? 'Correct!'
                                        : `Correct answer: ${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}`}
                                </p>
                            )}
                        </div>
                    );
                })}

                <button
                    onClick={handleSubmit}
                    className="mt-4 text-white font-semibold py-2 px-4 rounded hover:bg-blue-800"
                    style={{backgroundColor: '#115867'}}
                    disabled={submitted}
                >
                    Submit
                </button>

                {submitted && (
                    <div className="mt-6 text-lg font-bold text-blue-800">
                        You scored {
                        questions.reduce((score, q) => {
                            const userResponse = responses[q.id];
                            const correct = q.answer;

                            const isCorrect = q.type === 'checkbox'
                                ? Array.isArray(userResponse)
                                && userResponse.length === correct.length
                                && userResponse.every((v) => correct.includes(v))
                                : userResponse === correct;

                            return score + (isCorrect ? 1 : 0);
                        }, 0)
                    } / {questions.length}
                    </div>
                )}

                {submitted && (
                    <div className="mt-4 text-green-600 font-medium">
                        Thank you! Your responses have been submitted.
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizPage;
