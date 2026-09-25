"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md py-4 px-6 shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg?v=2" alt="Atox Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">ATOX</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our support team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@atoxinvestmentplatform.com</p>
                    <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Customer Support</h3>
                    <p className="text-gray-600">Available through your dashboard</p>
                    <p className="text-sm text-gray-500 mt-1">24/7 support for registered users</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-gray-600">Available in your dashboard</p>
                    <p className="text-sm text-gray-500 mt-1">Instant support for urgent issues</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
              <h3 className="font-bold text-gray-900 mb-4">Response Times</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">General Inquiries</span>
                  <span className="font-medium text-emerald-700">24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Technical Issues</span>
                  <span className="font-medium text-emerald-700">12-24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Issues</span>
                  <span className="font-medium text-emerald-700">6-12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Issues</span>
                  <span className="font-medium text-emerald-700">12-24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl mb-6">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="payment">Payment/Withdrawal Issue</option>
                  <option value="investment">Investment Plan Question</option>
                  <option value="referral">Referral Program</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue or question in detail"
                  rows={5}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Send Message
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                For immediate assistance, log in to your dashboard and use the live chat feature.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => router.push("/faq")}
            className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition"
          >
            Browse our FAQ
          </button>
        </div>
      </main>
    </div>
  );
}