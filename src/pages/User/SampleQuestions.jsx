import { Link } from 'react-router-dom';

const SampleQuestions = () => {
    // Hardcoded list of job roles with number of questions and details
    const jobRoles = [
        {
            role: 'software-engineer',
            name: 'Software Engineer',
            questionCount: 5,
            details: 'Develops and maintains software applications.',
        },
        {
            role: 'qa',
            name: 'Quality Assurance',
            questionCount: 4,
            details: 'Ensures software quality through testing.',
        },
        {
            role: 'data-analyst',
            name: 'Data Analyst',
            questionCount: 3,
            details: 'Analyzes data to provide business insights.',
        },
    ];

    return (
        <div className="min-h-screen bg-white p-8">
            <h2 className="text-3xl font-light text-gray-800 mb-10">Explore Job Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobRoles.map((job) => (
                    <Link
                        to={`/questions/${job.role}`}
                        key={job.role}
                        className="block bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 ease-in-out border border-gray-100"
                    >
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{job.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">Questions: {job.questionCount}</p>
                        <p className="text-xs text-gray-500">{job.details}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SampleQuestions;