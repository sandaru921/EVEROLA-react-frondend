import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-gray-900 bg-[#005B7C] text-white px-6 py-10 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Left Section */}
        <div className="md:w-1/3">
          <img src="/img/logo3.png" alt="Evelora" className="h-12 mb-4" />
          <p className="mb-4">
            We are a digital technology company that enables businesses to grow
            via our software development & back office digital services.
          </p>
          <p className="mb-1">
            <strong>Colombo</strong> - No: 14, Sir Baron Jayathilake Mawatha,
            Colombo 01, Sri Lanka
          </p>
          <p>
            <strong>Sydney</strong> - Level 2/11 York Street, Sydney, NSW 2000,
            Australia
          </p>
          <p className="mt-6 text-sm text-gray-300">
            © 2025 Evelora. All rights reserved.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Case studies</a></li>
            <li><a href="#">Life</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Other Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Other Links</h4>
          <ul className="space-y-2">
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Demos</a></li>
            <li><a href="#">IT Support</a></li>
            <li><a href="#">Disclaimer</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Connect</h4>
          <div className="flex space-x-4 text-2xl">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaTiktok /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
