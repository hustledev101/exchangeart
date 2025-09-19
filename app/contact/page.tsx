"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { FaEnvelope, FaLocationArrow } from "react-icons/fa";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Simulate async submission here
      await new Promise((res) => setTimeout(res, 1000));
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#181A20] py-12 px-6 md:px-16 lg:px-32 flex items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-semibold text-[#F9FAFA]">
              GET IN TOUCH WITH US
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              Stuck on something, or need to chat with the team?
              <br /> Send us an email and we&apos;ll have our customer support
              agent get you through it.
            </p>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-[#6172F3] text-2xl" />
              <div>
                <p className="font-semibold text-[#F9FAFA]">Email</p>
                <p className="text-gray-300 select-text">
                  info.exchangeart@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaLocationArrow className="text-[#6172F3] text-2xl" />
              <div>
                <p className="font-semibold text-[#F9FAFA]">Address</p>
                <p className="text-gray-300 select-text">
                  Headquarters Location Weston Street Unit 11.1.1 London,
                  <br /> England, SE1 3ER, United Kingdom
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 text-[#F9FAFA]"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="border border-gray-300 rounded-md px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-[#6172F3] hover:bg-blue-700 rounded-2xl text-white font-semibold py-3  transition"
            >
              {status === "sending" ? "Submitting..." : "SUBMIT"}
            </button>
            {status === "success" && (
              <p className="text-green-600 font-medium text-center">
                Thank you! We will get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-medium text-center">
                Oops! Something went wrong. Try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
