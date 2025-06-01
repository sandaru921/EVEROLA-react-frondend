import React from 'react'
import QuizTable from '../../components/QuizTable'
import Navbar from '../../components/Navbar'

function QuizDash() {
  return (
    <div className='px-10 pt-4 pb-10 bg-gradient-to-r from-cyan-400 to-blue-500 w-full rounded h-[100vh]'>
        <h2 className='text-white text-xl font-semibold mb-6 '>Quiz Dashboard</h2>
        <QuizTable/>
    </div>
  )
}

export default QuizDash