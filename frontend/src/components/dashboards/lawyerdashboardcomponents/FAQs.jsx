import React, { useState } from "react";

const faqs = [
  {
    question: "How do I add a new case?",
    answer:
      "To add a new case, navigate to the 'Add Case' section and fill in the required details such as Case ID, Case Title, BNS Section, Court Name, and other relevant information. Once all fields are filled, click 'Submit Case' to save the case.",
  },
  {
    question: "How can I track the status of a bail application?",
    answer:
      "You can track the status of a bail application by navigating to the 'Track Bail Status' section. Enter the relevant case details to view the current status of the bail application.",
  },
  {
    question: "What information is required to file a new case?",
    answer:
      "To file a new case, you need to provide details such as Case ID, Case Title, BNS Section, Court Name, Judge ID, Filing Date, Hearing Dates, Police Station, Case Summary, Detainee ID, Bail Filing Date, and Grounds for Bail.",
  },
  {
    question: "How do I view my ongoing cases?",
    answer:
      "You can view your ongoing cases by navigating to the 'Ongoing Cases' section. This section will display a list of all your active cases along with their details.",
  },
  {
    question: "Can I edit a case after submitting it?",
    answer:
      "Currently, once a case is submitted, it cannot be edited. Please ensure all details are correct before submitting the case.",
  },
  {
    question: "How do I log out of the dashboard?",
    answer:
      "To log out, click on the logout icon located in the bottom-right corner of the sidebar. This will log you out of the dashboard and redirect you to the landing page.",
  },
  {
    question: "What should I do if I encounter an error?",
    answer:
      "If you encounter an error, please try refreshing the page. If the issue persists, contact the support team for assistance.",
  },
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          xmlns="http://www.w3.org/2000/svg"
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
};

const FAQs = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} />
        ))}
      </div>
    </div>
  );
};

export default FAQs;
