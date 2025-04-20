import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

function EmailContact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_1qlrt5f", "template_57jj8fr", form.current, {
        publicKey: "WFqIMeW7ApTNJgzDx",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          alert("Mail sent successfully!");
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Mail send failed.");
        }
      );
  };

  return (
    <form ref={form} className="flex flex-col gap-3 w-5/8" onSubmit={sendEmail}>
      <div className="w-full flex gap-2">
        <input
          type="email"
          name="user_email"
          placeholder="E-mail"
          className="bg-[#99BDCB] text-white py-2 px-6 rounded-full w-1/2 outline-none"
        />
        <input
          type="text"
          name="user_phone"
          placeholder="Phone"
          className="bg-[#99BDCB] text-white py-2 px-6 rounded-full w-1/2 outline-none"
        />
      </div>
      <input
        type="text"
        name="user_name"
        placeholder="Name"
        className="bg-[#99BDCB] text-white py-2 px-6 rounded-full w-full outline-none"
      />
      <textarea
        name="message"
        placeholder="Message"
        className="bg-[#99BDCB] text-white py-2 px-6 rounded-2xl w-full outline-none"
        rows={4}
      ></textarea>
      <div>
        <button type="submit" className="bg-[#4d8ca3] py-2 px-6 rounded-full text-white cursor-pointer">
          Submit
        </button>
      </div>
    </form>
  );
}

export default EmailContact;
