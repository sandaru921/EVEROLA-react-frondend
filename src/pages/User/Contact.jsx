import React from "react";
import Navbar from "../../components/Navbar";
import con from "../../assets/contactus.jpg";
import EmailContact from "../../components/EmailContact";

function Contact() {
  return (
    <div>
      <Navbar/>
      <section className="text-center py-16 pt-[10%] bg-[#005B7C]">
        <h1 className="text-5xl font-bold text-white">Contact Us</h1>
        <p className="mt-4 text-gray-300 max-w-lg mx-auto ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>
      </section>
      <section>
        <EmailContact/>
      </section>
    </div>
  );
}

export default Contact;
