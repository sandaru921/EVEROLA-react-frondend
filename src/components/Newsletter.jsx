import React from 'react';
import bgImage from '../assets/newsletter-bg.jpeg'; // Replace with your actual image path

const NewsletterBox = () => {
  return (
    <div
      className="rounded-2xl  text-white text-center mx-auto shadow-md relative overflow-hidden w-3/8  flex item-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#004963]/80 rounded-2xl z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-4">
        <h2 className="text-xl font-semibold mb-2">Our Newsletters</h2>
        <p className="text-sm mb-5">
          Stay updated with the latest features, improvements, and tips to enhance your experience with our Role-Based Assessment System.
        </p>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-white rounded-full text-black mb-3 outline-none"
        />
        <button className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-200">
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewsletterBox;
