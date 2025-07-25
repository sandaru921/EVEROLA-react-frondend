import { Link } from "react-router-dom";
import React from 'react'
import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'
import KeyFeatures from "../../components/KeyFeatures"
import HowItWorks from "../../components/HowItWorks"
import Footer from "../../components/Footer"
import CTA from "../../components/CallToAction"
import CallToAction from "../../components/CallToAction";



function Home() {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <KeyFeatures/>
        <HowItWorks/>
        <CallToAction/>
        <Footer/>
        
    </div>
  )
}

export default Home;