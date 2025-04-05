import React from "react";
import Navbar from "../../components/Navbar";
import EmailContact from "../../components/EmailContact";
import ContactDetails from "../../components/ContactDetails";
import Newsletter from "../../components/Newsletter";
import Footer from "../../components/Footer";
import Map from "../../components/Map";


function Contact() {
  return (
    <div>
      <Navbar/>
      <section className="text-center py-16 pt-[10%] bg-[#005B7C]">
        <h1 className="text-5xl font-bold text-white">Contact Us</h1>
        <p className="mt-4 text-gray-300 max-w-lg mx-auto ">
        Connect with us for further information or personalized assistance.
        </p>
      </section>
      <section className="w-[80vw] m-auto pt-25 flex flex-col gap-16">
        <section className="flex justify-between gap-8">
          <EmailContact/>
          <Newsletter/>
        </section>
        <ContactDetails/>
        <Map/>
      </section>
      <Footer/>
    </div>
  );
}

export default Contact;
