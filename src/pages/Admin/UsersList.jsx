import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsersList = () => {
    // Inline mock data for consistency with UserDetails
    const usersData = [
        {
            Id: 1,
            Username: 'Sandaru71',
            Email: 'rohanasandaru@gmail.com',
            Role: 'Front End Developer',
            UserId: 'Sandaru71',
            ProfilePicture: 'https://via.placeholder.com/150.png?text=User',
            Education: 'BSc Information Technology\nOracle Certified Professional\nAWS Certified Developer',
            WorkExperience: 'SE in ABC Company - 3 years\nSE in XYZ Company - 2 years\nSE Intern in ABC Company - 1 year',
            Skills: 'Core Technical Skills\nBuild Tools\nAPI Integration',
            Name: 'Sandaru Rohana',
            Age: 23,
            Gender: 'Male',
            LinkedIn: 'https://linkedin.com/in/sandaru-rohana',
            Marks: 85
        },
        {
            Id: 2,
            Username: 'User2',
            Email: 'user2@example.com',
            Role: 'Back End Developer',
            UserId: 'User2',
            ProfilePicture: 'https://via.placeholder.com/150.png?text=User2',
            Education: 'BSc Computer Science\nMicrosoft Certified Professional',
            WorkExperience: 'BE in DEF Company - 4 years\nBE Intern in GHI Company - 1 year',
            Skills: 'Database Management\nServer-Side Logic\nCloud Computing',
            Name: 'User Two',
            Age: 25,
            Gender: 'Female',
            LinkedIn: 'https://linkedin.com/in/user-two',
            Marks: 92
        },
        {
            Id: 3,
            Username: 'User3',
            Email: 'user3@example.com',
            Role: 'Full Stack Developer',
            UserId: 'User3',
            ProfilePicture: 'https://via.placeholder.com/150.png?text=User3',
            Education: 'MSc Software Engineering\nGoogle Cloud Certified',
            WorkExperience: 'FS in JKL Company - 2 years\nFS Intern in MNO Company - 6 months',
            Skills: 'Full Stack Development\nDevOps\nUI/UX Design',
            Name: 'User Three',
            Age: 27,
            Gender: 'Male',
            LinkedIn: 'https://linkedin.com/in/user-three',
            Marks: 78
        }
    ];

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const filteredUsers = usersData
                .filter(user => user.Role !== 'Admin')
                .sort((a, b) => b.Marks - a.Marks);

            const rankedUsers = filteredUsers.map((user, index) => ({
                ...user,
                Rank: index + 1
            }));

            setUsers(rankedUsers);
        } catch (err) {
            setError('Failed to load users.');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">User Rankings</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
                {users.length === 0 ? (
                    <p className="text-gray-500 text-center">No users found.</p>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <Link
                                key={user.Id}
                                to={`/users/${user.Id}`}
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {user.Rank}. {user.Username}
                                        </h2>
                                        <p className="text-gray-600">Marks: {user.Marks}</p>
                                    </div>
                                    <span className="text-blue-600 hover:underline">
                                        View Details
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersList;