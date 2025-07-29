import React from 'react';

import herobg from '../assets/h3.jpeg';
const HeroSection = () => {
  return (
    <section className="w-full min-h-screen bg-[#E6EFF2] py-16 pt-[10%] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl px-6 flex flex-col md:flex-row items-center gap-8">
        {/* Left: Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-[#004963] mb-4">
            Optimize Talent Selection with Precision Role-Based Assessments
          </h1>
          <p className="text-lg md:text-xl text-[#005B7C] mb-6 max-w-lg mx-auto md:mx-0">
            Streamline hiring and employee development with tailored assessments designed for Bistec Global.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-[#4D8CA3] text-white font-semibold rounded-lg hover:bg-[#005B7C] transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Right: Background Image */}
        <div className="md:w-1/2">
          <div
            className="w-full h-[400px] md:h-[500px] bg-cover bg-center rounded-lg shadow-lg transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-[#004963]/30 cursor-pointer relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 73, 99, 0.3), rgba(0, 73, 99, 0.5)), url(${herobg})`,
            }}
          >
            {/* Subtle overlay animation on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 ease-in-out transform -skew-x-12 -translate-x-full hover:translate-x-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;