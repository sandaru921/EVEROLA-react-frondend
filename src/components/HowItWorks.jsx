import React from 'react';

import loginImage from '../assets/login.png';
import selectImage from '../assets/choosejobrole.png';
import quizImage from '../assets/dothequiz.png';
import evalImage from '../assets/wait.png';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "User Registration/Login",
      description: "Create your account or log in to access our assessment platform.",
      image: loginImage,
      accentColor: "bg-[#004963]"
    },
    {
      id: 2,
      title: "Role Selection",
      description: "Choose a tailored assessment for Bistec Global roles.",
      image: selectImage,
      accentColor: "bg-[#004963]"
    },
    {
      id: 3,
      title: "Taking the Quiz",
      description: "Complete the online quiz crafted for your role.",
      image: quizImage,
      accentColor: "bg-[#004963]"
    },
    {
      id: 4,
      title: "Evaluation",
      description: "Receive detailed results and analytics for decisions.",
      image: evalImage,
      accentColor: "bg-[#004963]"
    }
  ];

  return (
    <section className="py-16 bg-[#E6EFF2]">
      <div className="w-[90vw] max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#004963] mb-4">
            How It Works
          </h2>
          <p className="text-[#005B7C] text-lg max-w-2xl mx-auto">
            Four simple steps to complete your assessment and get evaluated
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 md:space-y-12">
          {steps.map((step, index) => {
            return (
              <div
                key={step.id}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                {/* Image Section */}
                <div className="w-full md:w-[40%] flex justify-center">
                  <div className="relative group cursor-pointer">
                    {/* Image with styling */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-48 h-48 object-cover rounded-2xl shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl"
                    />
                    
                    {/* Step number badge */}
                    <div className={`absolute -top-2 -right-2 ${step.accentColor} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {step.id}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-[60%]">
                  <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-gray-100">
                    <h3 className="text-xl md:text-2xl font-bold text-[#004963] mb-3 transition-colors duration-300 hover:text-[#005B7C]">
                      {step.title}
                    </h3>
                    <p className="text-[#005B7C] text-base md:text-lg leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="mt-4 flex items-center">
                      <div className="flex space-x-2">
                        {steps.map((_, stepIndex) => (
                          <div
                            key={stepIndex}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              stepIndex === index 
                                ? 'bg-[#004963]' 
                                : stepIndex < index 
                                  ? 'bg-[#005B7C]' 
                                  : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-4 text-sm text-[#005B7C] font-medium">
                        Step {step.id} of {steps.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector line for mobile */}
                {step.id !== steps.length && (
                  <div className="md:hidden w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};

export default HowItWorks;