import React, { useState } from "react";
import axios from "axios";
import "@fontsource/ubuntu";
import { Helmet } from "react-helmet-async";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "https://test.populardiagnostic.org/api/messages",
        formData
      );
      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", mobile: "", message: "" });
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="bg-white">
      <Helmet>
        {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
        <title>Popular Diagnostic Centre Ltd. | Contact, Booking & Support</title>
        <meta
          name="description"
          content="Connect with Popular Diagnostic Centre Ltd. for appointments, diagnostic services, report inquiries and customer support. Visit your nearest branches or call today."
        />
        */}
      </Helmet>
      <div className="flex flex-col pt-20 mx-auto max-w-7xl text-center">
        <h2 className="text-gray-900 text-3xl font-bold">CONNECTING WITH US</h2>
      </div>

      <div className="flex flex-col items-center text-center mt-10">
        <h1 className="text-gray-900 font-extrabold text-4xl">
          DISCOVER <span className="text-green-600">POPULAR</span>
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          House #16, Road # 2, Dhanmondi R/A, Dhaka-1205, Bangladesh
        </p>
        <p className="text-lg text-gray-700">
          E-mail: info@populardiagnostic.com
        </p>
        <p className="text-lg text-gray-700">Phone: 09666 787801, 10636</p>
      </div>

      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-gray-100 shadow-lg rounded-lg p-6">
              <h5 className="text-3xl font-bold text-gray-600 text-center mb-5">
                Send us a message
              </h5>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-600">Your Email</label>
                    <input
                      type="email"
                      placeholder="name@mail.com"
                      className="w-full border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-gray-900"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-600">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-gray-900"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-600">Your Mobile</label>
                    <input
                      type="text"
                      placeholder="01712345678"
                      className="w-full border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-gray-900"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600">Your Message</label>
                  <textarea
                    placeholder="Write your queries..."
                    className="w-full border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-gray-900 h-32"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  SEND MESSAGE
                </button>

                {error && (
                  <p className="text-red-600 text-center mt-2">{error}</p>
                )}
                {success && (
                  <p className="text-green-600 text-center mt-2">{success}</p>
                )}
              </form>
            </div>

            {/* Google Map */}
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2197080792394!2d90.37959757619976!3d23.73954337867781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8ca7af5f82b%3A0xce7d1ab6b16a027!2sPopular%20Diagnostic%20Centre%20Ltd.!5e0!3m2!1sen!2sbd!4v1706512680599!5m2!1sen!2sbd"
                width="100%"
                height="450"
                allowFullScreen=""
                loading="lazy"
                className="rounded-lg shadow-lg"
              ></iframe>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
