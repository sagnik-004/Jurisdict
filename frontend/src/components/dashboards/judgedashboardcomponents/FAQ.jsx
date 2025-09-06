import React, { useState } from "react";

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

const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How do I navigate between different sections in my dashboard?",
      answer:
        "Use the sidebar to switch between 'Unraised Bails' (cases that haven't had bail applications filed), 'Pending Decisions' (bail applications awaiting your decision), and 'Decided Cases' (cases you've already decided). Click on any menu item to switch sections.",
    },
    {
      question: "What information is shown in the Pending Decisions section?",
      answer:
        "Pending Decisions shows all cases with bail status 'Pending to judge'. Each case displays the case title, BNS sections, filing details, and you can expand any case to see full details including defendant information, case summary, and AI recommendations.",
    },
    {
      question: "How does the AI Analysis feature work?",
      answer:
        "When reviewing a case, click the AI Analysis button to get AI-generated recommendations based on case details, BNS sections, and similar precedent cases. The AI provides bail amount suggestions, risk assessments, and shows related cases for reference.",
    },
    {
      question: "How do I make a bail decision on a case?",
      answer:
        "In the Pending Decisions section, expand a case to view full details. After reviewing the AI recommendations and case information, you can approve or reject the bail application. Your decision will move the case from pending to decided status.",
    },
    {
      question: "What BNS sections does the platform recognize and categorize?",
      answer:
        "The platform categorizes all BNS sections into bailable and non-bailable offenses. It handles multiple BNS sections per case and provides relevant legal context. The AI considers the severity and prescribed punishments for each section when making recommendations.",
    },
    {
      question: "Can I search for specific cases in the dashboard?",
      answer:
        "Yes, each section has a search bar where you can search by case title. The search is case-insensitive and filters results in real-time as you type. This helps you quickly find specific cases among your pending or decided matters.",
    },
    {
      question: "What details are captured about each case?",
      answer:
        "Cases include comprehensive information: case title, BNS sections, court details, filing dates, defendant information, case summary, crime type, severity assessment, defendant's background, employment status, family ties, criminal history, and evidence details.",
    },
    {
      question: "How does the Similar Cases feature work?",
      answer:
        "The AI system identifies cases with similar BNS sections, crime types, and circumstances. When viewing AI recommendations, you'll see a list of related cases showing how similar matters were decided, including bail amounts and conditions imposed.",
    },
    {
      question: "What happens after I make a bail decision?",
      answer:
        "Once you approve or reject a bail application, the case moves from 'Pending Decisions' to 'Decided Cases'. The decision is recorded with timestamp and your judicial reasoning, and all parties in the system are notified of the outcome.",
    },
    {
      question: "Can I view my previous bail decisions for reference?",
      answer:
        "Yes, the 'Decided Cases' section shows all your previous bail decisions with complete case details, the decision made, reasoning provided, and timestamp. This helps maintain consistency in your judicial approach.",
    },
    {
      question: "How do I logout from the judge dashboard?",
      answer:
        "Click the logout icon at the bottom of the sidebar. The system will securely log you out and redirect you to the landing page. Always ensure you logout when using shared computers for security.",
    },
    {
      question: "What should I do if a case doesn't load properly?",
      answer:
        "If you encounter loading issues, try refreshing the page. The system will reload your pending cases from the server. If problems persist, check your internet connection or contact technical support through the help section.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Everything you need to know about using the judicial dashboard
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

export default FAQ;
