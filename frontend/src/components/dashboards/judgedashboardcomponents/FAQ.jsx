import React, { useState } from "react";

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <button
      onClick={onClick}
      className="w-full text-left py-4 px-2 flex justify-between items-center focus:outline-none"
    >
      <span className="text-lg font-medium text-gray-900 dark:text-white">
        {faq.question}
      </span>
      <svg
        className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    {isOpen && (
      <div className="px-2 pb-4 text-gray-600 dark:text-gray-300">
        <p>{faq.answer}</p>
      </div>
    )}
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I view ongoing cases?",
      answer:
        "Go to the 'Unraised Bails' section to see cases that have not yet had a bail hearing.",
    },
    {
      question: "How do I process bail appeals?",
      answer:
        "Navigate to 'Pending Decisions' to review and decide on bail applications.",
    },
    {
      question: "What is the AI recommendation feature?",
      answer:
        "The AI provides recommendations based on case details to assist in your decision-making process. You can access it from the details of a pending bail.",
    },
    {
      question: "How do I view decided cases?",
      answer:
        "Go to the 'Decided Cases' section to see a history of all bail decisions you have made.",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;