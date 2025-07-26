import React from 'react';
import QuizTable from '../../components/QuizTable';
import ErrorBoundary from '../../components/ErrorBoundary'; // Adjust path as needed based on your project structure

function QuizDash() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-teal-500">Quiz Dashboard</h1>
      <ErrorBoundary>
        <QuizTable />
      </ErrorBoundary>
    </div>
  );
}

export default QuizDash;