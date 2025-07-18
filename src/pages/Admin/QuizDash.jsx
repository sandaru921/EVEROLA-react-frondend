import React from 'react'
import QuizTable from '../../components/QuizTable'
import QuizResultTable from './QuizResult'

function QuizDash() {
  return (
    <div>
        <QuizTable/>
        <div className='mt-10'></div>
        <QuizResultTable/>
    </div>
  )
}

export default QuizDash