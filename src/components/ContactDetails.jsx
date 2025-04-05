import React from 'react'
import phoneicon from '../assets/telephoneIcon.png'
import email from '../assets/email.png'
import location from '../assets/location.png'


function ContactDetails() {
  return (
    <div className='flex w-full gap-4 m-auto '>
        <div className='bg-[#004963] rounded-2xl py-4 w-1/3 flex flex-col justify-center shadow-2xl'>
            <div className='flex items-center gap-3 pt-4 pb-2 px-7 text-white '>
                <img src={phoneicon} alt="phone icon" className='h-10 ' />
                <a href="tel:+1234567890" className='text-xl font-bold'>+94 77 233 526</a>
            </div>
            <p className='px-7 pb-5 text-white'>
              Do feel free to drop your details here and don’t hesitate to give us a ring.  </p>
        </div>
        <div className='bg-[#99bdcb] rounded-2xl py-4 w-1/3 flex flex-col justify-center shadow-2xl'>
            <div className='flex items-center gap-3 pt-4 pb-2 px-7 text-black '>
                <img src={email} alt="email icon" className='h-10 ' />
                <a href="hello@bistecglobal.com" className='text-xl font-bold text-[#00374a]'>hello@bistecglobal.com</a>
            </div>
            <p className='px-7 pb-5 text-[#00374a]'>Reach out to us with your questions or feedback, and we’ll get back to you as soon as possible. </p>
        </div>
        <div className='bg-[#e6eff2] rounded-2xl py-4 w-1/3 flex flex-col justify-center shadow-xl'>
            <div className='flex items-center gap-3 pt-4 pb-2 px-7 text-white '>
                <img src={location} alt="location icon" className='h-10 ' />
                <a href="tel:+1234567890" className='text-xl font-bold text-[#00374a]'>Bistec Global</a>
            </div>
            <p className='px-7 pb-5 text-[#00374a]'>No: 14,Sir Baron Jayathilake Mawatha,
Colombo 01,
Sri Lanka  </p>
        </div>
        
    </div>
    
  )
}

export default ContactDetails