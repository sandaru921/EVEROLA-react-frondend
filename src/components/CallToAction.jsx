import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-16 bg-[#F0F7FA] flex items-center justify-center">
      <div className="w-[80vw] max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#004963] mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-base md:text-lg text-[#005B7C] mb-8">
          Take the role-based assessment crafted just for you at Bistec Global.
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-4 bg-[#4D8CA3] text-white font-semibold rounded-full hover:bg-[#004963] hover:scale-105 transition-transform duration-300"
        >
          Start Your Assessment
        </a>
      </div>
    </section>
  );
};

export default CallToAction;