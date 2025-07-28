import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Inline mock data
    const usersData = [
        {
            Id: 1,
            Username: 'Sandaru71',
            Role: 'Front End Developer',
            ProfilePicture: 'https://via.placeholder.com/150.png?text=Sandaru71',
            Education: 'BSc Information Technology',
            Age: 23,
            Location: 'Colombo, Sri Lanka',
            Bio: 'Passionate Front End Developer with a focus on creating intuitive user interfaces. Experienced in React and Tailwind CSS.',
            Goals: 'Become a lead developer\nContribute to open-source projects\nLearn advanced UI/UX design',
            Motivations: 'Building impactful applications\nContinuous learning and growth\nCollaborating with talented teams',
            Concerns: 'Balancing work and learning\nKeeping up with fast-paced tech changes\nEnsuring code quality under tight deadlines',
            Marks: 85
        },
        {
            Id: 2,
            Username: 'User2',
            Role: 'Back End Developer',
            ProfilePicture: 'https://via.placeholder.com/150.png?text=User2',
            Education: 'BSc Computer Science',
            Age: 25,
            Location: 'Kandy, Sri Lanka',
            Bio: 'Skilled Back End Developer specializing in server-side logic and database management. Proficient in Node.js and MongoDB.',
            Goals: 'Master cloud architecture\nDevelop scalable APIs\nMentor junior developers',
            Motivations: 'Solving complex problems\nOptimizing system performance\nStaying updated with backend technologies',
            Concerns: 'Managing server downtime\nEnsuring data security\nHandling large-scale deployments',
            Marks: 92
        },
        {
            Id: 3,
            Username: 'User3',
            Role: 'Full Stack Developer',
            ProfilePicture: 'https://via.placeholder.com/150.png?text=User3',
            Education: 'MSc Software Engineering',
            Age: 27,
            Location: 'Galle, Sri Lanka',
            Bio: 'Versatile Full Stack Developer with expertise in both front-end and back-end technologies. Enjoys tackling full-cycle projects.',
            Goals: 'Lead a development team\nBuild a startup product\nExplore AI integration in web apps',
            Motivations: 'Creating end-to-end solutions\nDelivering seamless user experiences\nInnovating with new tech stacks',
            Concerns: 'Time management across projects\nIntegrating diverse tech stacks\nMaintaining work-life balance',
            Marks: 78
        }
    ];

    useEffect(() => {
        try {
            const userId = parseInt(id);
            const foundUser = usersData.find(u => u.Id === userId);
            if (foundUser) {
                setUser(foundUser);
            } else {
                setError('User not found.');
            }
        } catch (err) {
            setError('Failed to load user details.');
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-teal-500 to-purple-500 p-6 flex flex-col items-center">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {user ? (
                <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
                    {/* Left Section: Profile Picture and Basic Info */}
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
                        <img
                            src={user.ProfilePicture}
                            alt="Profile"
                            className="w-32 h-32 rounded-full mb-4 border-2 border-white shadow-md"
                        />
                        <h2 className="text-2xl font-bold text-white">{user.Username}</h2>
                        <p className="text-lg text-white opacity-80 mb-6">{user.Role}</p>
                        <div className="space-y-4 text-white">
                            <div>
                                <p className="text-sm opacity-80">AGE</p>
                                <p className="text-base">{user.Age}</p>
                                <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full mt-1">
                                    <div className="h-full bg-white rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">EDUCATION</p>
                                <p className="text-base">{user.Education}</p>
                                <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full mt-1">
                                    <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">LOCATION</p>
                                <p className="text-base">{user.Location}</p>
                                <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full mt-1">
                                    <div className="h-full bg-white rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Bio, Goals, Motivations, Concerns */}
                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bio */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bio</h3>
                            <p className="text-gray-600">{user.Bio}</p>
                        </div>

                        {/* Goals */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals</h3>
                            <ul className="text-gray-600 list-disc list-inside">
                                {user.Goals.split('\n').map((goal, index) => (
                                    <li key={index}>{goal}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Motivations */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Motivations</h3>
                            <ul className="text-gray-600 list-disc list-inside">
                                {user.Motivations.split('\n').map((motivation, index) => (
                                    <li key={index}>{motivation}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Concerns */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Concerns</h3>
                            <ul className="text-gray-600 list-disc list-inside">
                                {user.Concerns.split('\n').map((concern, index) => (
                                    <li key={index}>{concern}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                !error && <p className="text-white text-center">Loading...</p>
            )}

            {/* Back to Users List Link */}
            <Link
                to="/users"
                className="mt-6 inline-block px-6 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
                Back to Users List
            </Link>
        </div>
    );
};

export default UserDetails;