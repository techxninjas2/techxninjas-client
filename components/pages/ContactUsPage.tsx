import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Users, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { submitContactForm } from "../../services/contactService";
import usePageTitle from "../usePageTitle";
import CodingBackground from "../CodingBackground";
import RevealOnScroll from "../RevealOnScroll";

interface ContactFormData {
  full_name: string;
  email: string;
  mobile_number: string;
  query_type: string;
  subject: string;
  message: string;
}

const ContactUsPage: React.FC = () => {
  usePageTitle("Contact Us");
  const { user } = useAuth();

  const [formData, setFormData] = useState<ContactFormData>({
    full_name: "",
    email: user?.email || "",
    mobile_number: "",
    query_type: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const queryTypes = [
    "Bug or Technical Issue",
    "Feedback to Improve",
    "Account/Login Issue",
    "Feature Request",
    "General Query",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setErrorMessage("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email address is required");
      return false;
    }
    if (!formData.mobile_number.trim()) {
      setErrorMessage("Mobile number is required");
      return false;
    }
    if (!formData.query_type) {
      setErrorMessage("Please select a query type");
      return false;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Subject is required");
      return false;
    }
    if (formData.message.trim().length < 20) {
      setErrorMessage("Message must be at least 20 characters long");
      return false;
    }
    if (formData.message.trim().length > 1000) {
      setErrorMessage("Message cannot exceed 1000 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitContactForm(formData);
      setSubmitStatus("success");

      // Reset form
      setFormData({
        full_name: "",
        email: user?.email || "",
        mobile_number: "",
        query_type: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      setErrorMessage(error.message || "Failed to submit your message. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      <CodingBackground intensity="low" style="terminal" className="absolute inset-0 z-0" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center text-brand-primary hover:text-brand-ninja-gold mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          <RevealOnScroll direction="up" duration={800}>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark-gray dark:text-white mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Have a question, feedback, or need support? We're here to help! Reach out to us and we'll get back to
                you as soon as possible.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <RevealOnScroll direction="left" delay={300} duration={800}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                <h2 className="text-2xl font-bold text-brand-dark-gray dark:text-white mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Us</h3>
                      <a
                        href="mailto:thetechxninjas@gmail.com"
                        className="text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary transition-colors">
                        thetechxninjas@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Call Us</h3>
                      <a
                        href="tel:+919122985472"
                        className="text-brand-primary hover:text-brand-ninja-gold dark:text-brand-ninja-gold dark:hover:text-brand-primary transition-colors">
                        +91 91229 85472
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-brand-primary dark:text-brand-ninja-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Community Base</h3>
                      <p className="text-gray-600 dark:text-gray-400">Online Community (India)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-brand-primary to-brand-ninja-gold rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Quick Response</h3>
                  <p className="text-white text-sm opacity-90">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Contact Form */}
            <RevealOnScroll direction="right" delay={300} duration={800}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                <h2 className="text-2xl font-bold text-brand-dark-gray dark:text-white mb-6">Send Us a Message</h2>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-sm">Thank you for contacting us. We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && errorMessage && (
                  <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg flex items-start">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Error:</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!!user}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      placeholder="Enter your email address"
                    />
                    {user && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Email is automatically filled from your account
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile_number"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="mobile_number"
                      name="mobile_number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.mobile_number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your mobile number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="query_type"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type of Query *
                    </label>
                    <select
                      id="query_type"
                      name="query_type"
                      value={formData.query_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option value="">Select query type</option>
                      {queryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-vertical"
                      placeholder="Please describe your query in detail..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.message.length}/1000 characters (min 20)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.message.length >= 20 ? "✓" : "✗"} Min length
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || formData.message.length < 20}
                    className="w-full bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
