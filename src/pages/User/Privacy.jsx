import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function Privacy() {
  return (
    <div>
        <Navbar/>
        <div className='w-full py-12 text-white bg-[#005B7C] flex justify-center mt-[5rem]'>
            <h1 className='text-[2.5rem] font-bold'>Privacy Policy</h1>
        </div>
        <div className='w-[80vw] mx-auto pt-[2rem]'>
            <p>At <b>BISTEC Global</b>  Services, accessible from <a href="https://bistecglobal.com/"> www.bistecglobal.com </a>, one of our main priorities is the privacy of our 
                visitors. This Privacy Policy document contains types of information that is collected and recorded by BISTEC Global 
                Services and how we use it. If you have additional questions or require more information about our Privacy Policy, do 
                not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to 
                our website with regards to the information that they shared and/or collect in BISTEC Global Services.
                This policy is not applicable to any information collected offline or via channels other than this website.
            </p>

            <h1 className='font-bold mt-[2rem]'>Consent</h1>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear 
                to you at the point we ask you to provide your personal information.
                If you contact us directly, we may receive additional information about you such as your name, email address,
                phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email
                address, and telephone number.</p>

                <h1 className='font-bold mt-[2rem]'>How we use your information</h1>
        <h2 className='font-semibold'>We use the information we collect in various ways, including to:</h2>
        
        <ul className='list-disc ml-5 mt-2'>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Communicate with you for customer service and marketing purposes</li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

            <h1 className='font-bold mt-[2rem]'>Log Files</h1>
            <p>
             BISTEC Global Services follows a standard procedure of using log files. These files log visitors when they visit websites. 
             All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet
             protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly
             the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information 
            is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>

            <h1 className='font-bold mt-[2rem]'>Cookies and Web Beacons</h1>
            <p>
            Like any other website, BISTEC Global Services uses 'cookies'. These cookies are used to store information 
            including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information
             is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            For more general information on cookies, please read "Cookies" article from the Privacy Policy Generator.
            </p>

            <h1 className='font-bold mt-[2rem]'>Google DoubleClick DART Cookie</h1>
            <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our 
            advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to 
            their Privacy Policies below.
            </p>

            <h1 className='font-bold mt-[2rem]'>Advertising Partners Privacy Policies</h1>
            <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of BISTEC Global Services.
             Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in 
            their respective advertisements and links that appear on BISTEC Global Services, which are sent directly to users' browser.
             They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of 
             their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Note 
             that BISTEC Global Services has no access to or control over these cookies that are used by third-party advertisers
            </p>

            <h1 className='font-bold mt-[2rem]'>Third Party Privacy Policies</h1>
            <p className='mb-[2.5rem]'>
            BISTEC Global Services's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to 
            consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include 
            their practices and instructions about how to opt-out of certain options.You can choose to disable cookies through your 
            individual browser options. To know more detailed information about cookie management with specific web browsers, it can 
            be found at the browsers' respective websites.
            </p>
           
            
        </div>
        <Footer/>
    </div>
  )
}

export default Privacy