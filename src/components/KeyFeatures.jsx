import React from 'react';
import { Check, Zap, Monitor, Shield } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      id: 1,
      icon: Check,
      title: "Personalized Quizzes",
      description: "Get questions tailored to your job title — no generic tests.",
    },
    {
      id: 2,
      icon: Zap,
      title: "Instant Feedback",
      description: "See your performance right after the test and understand your strengths.",
    },
    {
      id: 3,
      icon: Monitor,
      title: "User-Friendly Interface",
      description: "Take your assessments with ease — anytime, on any device.",
    },
    {
      id: 4,
      icon: Shield,
      title: "Secure and Private",
      description: "Your results are safe and only visible to the hiring team.",
    }
  ];

  return (
    <section className="py-16 bg-[#F0F7FA]">
      <div className="w-[85vw] max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#004963] mb-4">
            Why You'll Love This Platform
          </h2>
          <p className="text-[#005B7C] text-lg max-w-2xl mx-auto">
            Built with care to make your assessment experience smooth and meaningful
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="group bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-50"
              >
                {/* Icon Container */}
                <div className="relative mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#004963] to-[#005B7C] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-[#004963] mb-3 group-hover:text-[#005B7C] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#005B7C] text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle bottom accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#004963] to-[#005B7C] group-hover:w-12 transition-all duration-300 rounded-t-full"></div>
              </div>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};

export default KeyFeatures;