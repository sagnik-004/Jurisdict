import React, { useState } from "react";

const Confirmation = ({
  isOpen,
  onClose,
  onConfirm,
  caseId,
  caseTitle,
  decision,
  aiData,
}) => {
  const [step, setStep] = useState(1);
  const [comments, setComments] = useState("");
  const [confirmationCaseId, setConfirmationCaseId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (comments.trim()) {
      setStep(2);
    }
  };

  const handleConfirm = async () => {
    if (confirmationCaseId === caseId) {
      setIsSubmitting(true);
      await onConfirm(comments);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep(1);
    setComments("");
    setConfirmationCaseId("");
    setIsSubmitting(false);
    onClose();
  };

  const isNextDisabled = !comments.trim();
  const isConfirmDisabled = confirmationCaseId !== caseId || isSubmitting;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {step === 1 ? "Add Comments" : "Confirm Decision"}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {caseTitle}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Case ID: <span className="font-bold">{caseId}</span>
                </p>
                <p className="text-sm font-medium mt-2">
                  Decision:
                  <span
                    className={`ml-2 ${
                      decision === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {decision}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Judge's Comments * (separate multiple comments with commas)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please provide your reasoning for this decision..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-y min-h-[100px]"
                  rows="4"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    isNextDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Confirm Your Decision
                  </h4>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You are about to {decision.toLowerCase()} bail for this case.
                  This action cannot be undone.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {caseTitle}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Case ID: <span className="font-bold">{caseId}</span>
                </p>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    "{comments}"
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type the Case ID to confirm:{" "}
                  <span className="font-bold">{caseId}</span>
                </label>
                <input
                  type="text"
                  value={confirmationCaseId}
                  onChange={(e) => setConfirmationCaseId(e.target.value)}
                  placeholder="Enter case ID"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {confirmationCaseId && confirmationCaseId !== caseId && (
                  <p className="text-red-500 text-sm mt-1">
                    Case ID does not match
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                    isConfirmDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : decision === "Accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isSubmitting && (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  Confirm {decision}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;