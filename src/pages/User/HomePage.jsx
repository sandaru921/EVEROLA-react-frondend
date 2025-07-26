import {Link} from "react-router-dom";
import office from "../../assets/office.jpg";
import React from "react";
import Navbar from "../../components/Navbar.jsx";

const HomePage = () => {
    return (
        <div className="homepage" style={{backgroundColor: "#4cbad1", minHeight: "100vh"}}>
            <Navbar/>
            <div className="flex items-center justify-center px-0 pt-38 pb-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-7xl">
                    {/* Left Content */}
                    <div className="flex-1 text-white">
                        <h2 className="text-4xl mb-4 font-bold leading-tight text-[#084b66] whitespace-nowrap">
                            Fast. Fair. Future-Ready Recruitment.
                        </h2>
                        <p className="text-lg mb-6 leading-relaxed">
                            Streamline your hiring process with our Role-Based Assessment System.
                            Easily create secure, role-based assessments, track candidate
                            performance in real-time, and simplify recruitment with automated tests,
                            instant feedback, and seamless integrations. Smarter hiring starts here.
                        </p>
                        <div>
                            <Link to="/register">
                                <button className="bg-[#008eab] hover:bg-[#55cbe2] text-white py-2 px-5 rounded-md">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src={office}
                            alt="Assessment Illustration"
                            className="w-[98%] h-auto rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
