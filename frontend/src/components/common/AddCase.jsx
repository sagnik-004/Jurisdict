import React, { useState } from "react";

const AddCase = () => {
  const [formData, setFormData] = useState({
    caseTitle: "",
    filingDate: "",
    courtName: "",
    policeStation: "",
    detaineeUsername: "",
    lawyerId: "",
    judgeId: "",
    crimeType: "",
    bnsSections: [""],
    severityOfOffence: "",
    allegedRole: "",
    caseSummary: "",
    accusedAge: "",
    medicalConditions: "",
    hasPermanentAddress: false,
    isEmployed: false,
    ownsProperty: false,
    hasLocalFamily: false,
    isSoleFamilyEarner: false,
    daysInDetention: "",
    hasPriorRecord: false,
    priorConvictionSections: [""],
    historyOfViolence: false,
    holdsPassport: false,
    hasFinancialMeansToTravel: false,
    allegedOrganizedCrimeLinks: false,
    availableEvidence: [""],
    witnessThreats: false,
    evidenceTampering: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const handleSubmit = () => {
    if (formData.caseSummary.length < 250) {
      alert("Case Summary must be at least 250 characters.");
      return;
    }
    console.log("Case submitted successfully!", formData);
  };

  const FormSection = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {icon}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const TextareaField = ({ label, value, onChange, placeholder, rows = 5 }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const CheckboxField = ({ label, checked, onChange }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
        {label}
      </label>
    </div>
  );

  const ArrayField = ({
    label,
    values,
    onChange,
    onAdd,
    onRemove,
    placeholder,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => onRemove(index)}
            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Add New Case
      </h1>

      <FormSection
        title="Case Identification"
        icon={
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Case Title"
            value={formData.caseTitle}
            onChange={(v) => handleInputChange("caseTitle", v)}
            placeholder="State vs. [Detainee Name]"
          />
          <InputField
            label="Filing Date"
            type="date"
            value={formData.filingDate}
            onChange={(v) => handleInputChange("filingDate", v)}
          />
          <InputField
            label="Court Name"
            value={formData.courtName}
            onChange={(v) => handleInputChange("courtName", v)}
          />
          <InputField
            label="Police Station"
            value={formData.policeStation}
            onChange={(v) => handleInputChange("policeStation", v)}
          />
        </div>
      </FormSection>

      <FormSection
        title="Parties Involved"
        icon={
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Detainee Username"
            value={formData.detaineeUsername}
            onChange={(v) => handleInputChange("detaineeUsername", v)}
          />
          <InputField
            label="Lawyer ID (Optional)"
            value={formData.lawyerId}
            onChange={(v) => handleInputChange("lawyerId", v)}
          />
          <InputField
            label="Judge ID"
            value={formData.judgeId}
            onChange={(v) => handleInputChange("judgeId", v)}
          />
        </div>
      </FormSection>

      <FormSection
        title="Offence Details"
        icon={
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Crime Type"
              value={formData.crimeType}
              onChange={(v) => handleInputChange("crimeType", v)}
              placeholder="e.g., financial fraud"
            />
            <InputField
              label="Severity of Offence"
              value={formData.severityOfOffence}
              onChange={(v) => handleInputChange("severityOfOffence", v)}
            />
            <InputField
              label="Alleged Role in Crime"
              value={formData.allegedRole}
              onChange={(v) => handleInputChange("allegedRole", v)}
              placeholder="e.g., Main perpetrator"
            />
          </div>

          <ArrayField
            label="BNS Sections"
            values={formData.bnsSections}
            onChange={(i, v) => handleArrayChange("bnsSections", i, v)}
            onAdd={() => addArrayField("bnsSections")}
            onRemove={(i) => removeArrayField("bnsSections", i)}
            placeholder="Enter BNS section"
          />

          <TextareaField
            label="Case Summary (Minimum 250 characters)"
            value={formData.caseSummary}
            onChange={(v) => handleInputChange("caseSummary", v)}
            placeholder="Enter detailed case summary..."
          />
        </div>
      </FormSection>

      <FormSection
        title="Accused's Personal & Social Profile"
        icon={
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Accused Age"
            value={formData.accusedAge}
            onChange={(v) => handleInputChange("accusedAge", v)}
          />
          <InputField
            label="Medical Conditions"
            value={formData.medicalConditions}
            onChange={(v) => handleInputChange("medicalConditions", v)}
            placeholder="Describe any medical conditions"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CheckboxField
            label="Has Permanent Address"
            checked={formData.hasPermanentAddress}
            onChange={(v) => handleInputChange("hasPermanentAddress", v)}
          />
          <CheckboxField
            label="Is Employed"
            checked={formData.isEmployed}
            onChange={(v) => handleInputChange("isEmployed", v)}
          />
          <CheckboxField
            label="Owns Property"
            checked={formData.ownsProperty}
            onChange={(v) => handleInputChange("ownsProperty", v)}
          />
          <CheckboxField
            label="Has Local Family"
            checked={formData.hasLocalFamily}
            onChange={(v) => handleInputChange("hasLocalFamily", v)}
          />
          <CheckboxField
            label="Is Sole Family Earner"
            checked={formData.isSoleFamilyEarner}
            onChange={(v) => handleInputChange("isSoleFamilyEarner", v)}
          />
        </div>
      </FormSection>

      <FormSection
        title="Risk & History Assessment"
        icon={
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Days in Detention"
            value={formData.daysInDetention}
            onChange={(v) => handleInputChange("daysInDetention", v)}
          />
        </div>

        {formData.hasPriorRecord && (
          <div className="mb-6">
            <ArrayField
              label="Prior Conviction Sections"
              values={formData.priorConvictionSections}
              onChange={(i, v) =>
                handleArrayChange("priorConvictionSections", i, v)
              }
              onAdd={() => addArrayField("priorConvictionSections")}
              onRemove={(i) => removeArrayField("priorConvictionSections", i)}
              placeholder="Enter prior conviction section"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CheckboxField
            label="Has Prior Record"
            checked={formData.hasPriorRecord}
            onChange={(v) => handleInputChange("hasPriorRecord", v)}
          />
          <CheckboxField
            label="History of Violence"
            checked={formData.historyOfViolence}
            onChange={(v) => handleInputChange("historyOfViolence", v)}
          />
          <CheckboxField
            label="Holds Passport"
            checked={formData.holdsPassport}
            onChange={(v) => handleInputChange("holdsPassport", v)}
          />
          <CheckboxField
            label="Has Financial Means to Travel"
            checked={formData.hasFinancialMeansToTravel}
            onChange={(v) => handleInputChange("hasFinancialMeansToTravel", v)}
          />
          <CheckboxField
            label="Alleged Organized Crime Links"
            checked={formData.allegedOrganizedCrimeLinks}
            onChange={(v) => handleInputChange("allegedOrganizedCrimeLinks", v)}
          />
        </div>
      </FormSection>

      <FormSection
        title="Evidentiary Status"
        icon={
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      >
        <div className="mb-6">
          <ArrayField
            label="Available Evidence"
            values={formData.availableEvidence}
            onChange={(i, v) => handleArrayChange("availableEvidence", i, v)}
            onAdd={() => addArrayField("availableEvidence")}
            onRemove={(i) => removeArrayField("availableEvidence", i)}
            placeholder="e.g., CCTV footage, witness statements"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CheckboxField
            label="Witness Threat Reports"
            checked={formData.witnessThreats}
            onChange={(v) => handleInputChange("witnessThreats", v)}
          />
          <CheckboxField
            label="Evidence Tampering Reports"
            checked={formData.evidenceTampering}
            onChange={(v) => handleInputChange("evidenceTampering", v)}
          />
        </div>
      </FormSection>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Submit Case
        </button>
      </div>
    </div>
  );
};

export default AddCase;