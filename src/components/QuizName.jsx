import React from 'react'

function QuizName() {
  return (
    <div>
        <form className='bg-[#004963] rounded-2xl py-4 justify-center shadow-2xl'>
            <div className='py-4 px-4'>
            <h1 className='text-white font-bold text-2xl pb-4'>Add a new quiz</h1>
            <label className='text-white '> Quiz Name:
            <input 
             type="text"
             placeholder='Quiz name'
             className='bg-white rounded-2xl text-black py-2 px-6 rounded-full  outline-none'
             
             />
            </label>
           
            </div>
            <div className='py-4 px-4 gap-2 '>
            <button type='cancel' className='bg-[#cf142b] text-white py-2 px-6 rounded-xl cursor-pointer '>Cancel</button>
            <button className='bg-white text-black py-2 px-6  rounded-xl cursor-pointer'>Next</button>
            </div>
           
        </form>
    </div>
  )
}

export default QuizName