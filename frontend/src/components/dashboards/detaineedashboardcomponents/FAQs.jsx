import React, { useState } from "react";

const faqs = [
  {
    question: "How do I file a new case on the platform?",
    answer:
      "Navigate to the 'Add Case' section from your dashboard. Fill in all required details including case title, BNS sections, court information, defendant details, and case summary. Ensure all information is accurate before submitting as cases cannot be edited once filed.",
  },
  {
    question: "What BNS sections should I specify when filing a case?",
    answer:
      "Include all relevant BNS sections that apply to your case. The platform categorizes sections automatically into bailable and non-bailable offenses. For complex cases involving multiple sections, list them in order of severity. The system will highlight the most serious charges for judicial review.",
  },
  {
    question: "How can I track the status of my bail applications?",
    answer:
      "Use the 'Track Bail Status' section to monitor your applications. You can search by case title or defendant name to see current status: 'Pending to judge', 'Approved', or 'Rejected'. The system provides real-time updates when judges make decisions.",
  },
  {
    question:
      "What information do I need to provide when filing a bail application?",
    answer:
      "You must provide comprehensive defendant information including personal details, employment status, family ties, criminal history, and grounds for bail. Also include case specifics like BNS sections, court details, and evidence summary. Complete information helps judges make informed decisions.",
  },
  {
    question: "How do I view and manage my ongoing cases?",
    answer:
      "The 'Ongoing Cases' section displays all your active matters with their current status. You can search by case title, filter by status, and view detailed case information. This section shows cases from filing through final disposition.",
  },
  {
    question: "Can I edit case details after submission?",
    answer:
      "No, once a case is submitted to the court system, it cannot be edited to maintain legal integrity. Please review all information carefully before submitting. If corrections are needed, contact the court registrar or file appropriate amendments through proper legal channels.",
  },
  {
    question: "How does the platform handle cases with multiple defendants?",
    answer:
      "For cases with multiple defendants, file separate entries for each defendant or use the platform's co-accused functionality. Each defendant can have individual bail applications with their specific circumstances, criminal history, and risk assessments.",
  },
  {
    question: "What happens after I submit a bail application?",
    answer:
      "Once submitted, your application moves to 'Pending to judge' status. The assigned judge receives the application with all case details and AI recommendations. You'll receive notifications when the judge reviews your application and makes a decision.",
  },
  {
    question: "How do I access my decided cases and their outcomes?",
    answer:
      "The 'Decided Cases' section contains all your completed matters with final outcomes, bail amounts granted, conditions imposed, and judicial reasoning. This serves as your case history and helps you track success rates and judicial preferences.",
  },
  {
    question:
      "Can I view similar cases for reference when preparing arguments?",
    answer:
      "While reviewing case details, the AI system may provide insights based on similar cases with comparable BNS sections and circumstances. This helps you understand judicial trends and prepare stronger arguments for bail applications.",
  },
  {
    question: "How do I logout securely from the lawyer dashboard?",
    answer:
      "Click the logout icon in the sidebar to securely end your session. The system will automatically log you out and redirect to the landing page. Always logout when using shared computers to protect client confidentiality.",
  },
  {
    question: "What should I do if I encounter technical issues or errors?",
    answer:
      "First, try refreshing the page to resolve temporary issues. If problems persist, check your internet connection and try again. For ongoing technical difficulties, contact our support team through the contact button below or email jurisdict2025@gmail.com.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
    <button
      onClick={onClick}
      className="w-full text-left p-6 flex justify-between items-center focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 pr-4 leading-relaxed">
        {faq.question}
      </span>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-orange-100 dark:bg-orange-900 rotate-180" : ""
        }`}
      >
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            isOpen
              ? "text-orange-600 dark:text-orange-400"
              : "text-gray-500 dark:text-gray-400"
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
      </div>
    </button>
    {isOpen && (
      <div className="px-6 pb-6 pt-0 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    )}
  </div>
);

const FAQs = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Everything you need to know about using the lawyer dashboard
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndexes.includes(index)}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="mailto:jurisdict2025@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;