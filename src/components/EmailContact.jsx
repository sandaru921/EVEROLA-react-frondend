import React from 'react'

function EmailContact() {
  return (
    
        <form className='px-6 py-4 flex flex-col gap-3'>
            <div className='w-full flex gap-2'>
                
                <input type="text" placeholder='E-mail' className='bg-[#99BDCB] text-white py-2 px-6 rounded-full  w-1/2 outline-none' />  
                <input type="text" placeholder='Phone' className='bg-[#99BDCB] text-white py-2 px-6 rounded-full w-1/2 outline-none'/>
                
            </div>
            <input type="text" placeholder='Name' className='bg-[#99BDCB] text-white py-2 px-6 rounded-full  w-full outline-none'/>
            <textarea name="message" id="" placeholder='Message' className='bg-[#99BDCB] text-white py-2 px-6 rounded-2xl w-full outline-none' rows={4}> </textarea>
            <div>
            <button className='bg-[#4d8ca3] py-2 px-6 rounded-full  text-white'>Submit</button>
                
            </div>
        </form>
        
    
    
  )
}

export default EmailContact