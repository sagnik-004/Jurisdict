import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios.js";
import AIPopup from "../common/AIPopup.jsx";

const JudgeDashboard = () => {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [bailAppeals, setBailAppeals] = useState([]);
  const [decidedCases, setDecidedCases] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("cases");
  const [expandedBailAppeal, setExpandedBailAppeal] = useState(null);
  const [showCommentSection, setShowCommentSection] = useState({});
  const [aiPopupOpen, setAIPopupOpen] = useState(false);
  const [aiRecommendation, setAIRecommendation] = useState("");
  const [bailDecisionType, setBailDecisionType] = useState({});

  useEffect(() => {
    const fetchedUser = JSON.parse(localStorage.getItem("user"));
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      axiosInstance
        .get(`/judge/cases/${user.username}`)
        .then((response) => {
          setCases(response.data);
        })
        .catch((err) => {
          console.error("Error fetching cases:", err);
          setError("Failed to fetch cases. Please try again later.");
        });

      axiosInstance
        .get(`/judge/bail-appeals/${user.username}`)
        .then((response) => {
          setBailAppeals(response.data);
        })
        .catch((err) => {
          console.error("Error fetching bail appeals:", err);
          setError("Failed to fetch bail appeals. Please try again later.");
        });

      axiosInstance
        .get(`/judge/decided-cases/${user.username}`)
        .then((response) => {
          setDecidedCases(response.data);
        })
        .catch((err) => {
          console.error("Error fetching decided cases:", err);
          setError("Failed to fetch decided cases. Please try again later.");
        });
    }
  }, [user]);

  const toggleCaseDescription = (caseId) => {
    const description = document.getElementById(`${caseId}Description`);
    description.style.display =
      description.style.display === "none" ? "block" : "none";
  };

  const toggleBailAppealDescription = (caseId) => {
    setExpandedBailAppeal((prev) => (prev === caseId ? null : caseId));
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/judge/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/landing";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const processCaseTitle = (title) => {
    const lastIndex = title.lastIndexOf(" - Judge");
    return lastIndex !== -1 ? title.substring(0, lastIndex) : title;
  };

  const handleBailAppealAction = (action, caseId) => {
    setBailDecisionType({ ...bailDecisionType, [caseId]: action });
    setShowCommentSection({ ...showCommentSection, [caseId]: true });
  };

  const askAI = (caseId) => {
    const caseItem = bailAppeals.find((item) => item._id === caseId);
    setAIRecommendation("Processing AI recommendation...");
    setAIPopupOpen(true);

    const payload = {
      caseId: caseItem.caseId,
      caseSummary: caseItem.caseSummary,
      groundsOfBail: caseItem.groundsOfBail,
      pastOffenses: caseItem.pastOffenses || [],
    };

    fetch("http://127.0.0.1:5000/process_case", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setAIRecommendation(data);
      })
      .catch((err) => {
        console.error("Error fetching AI recommendation:", err);
        setAIRecommendation("Failed to fetch AI recommendation.");
      });
  };

  const submitComment = async (caseId) => {
    const comment = document.getElementById(`comment${caseId}`).value;
    const status = bailDecisionType[caseId] === "approve" ? "Accepted" : "Declined";

    try {
      await axiosInstance.post("/judge/bail-decision", {
        caseId: caseId,
        status: status,
        comments: comment
      });

      const response = await axiosInstance.get(`/judge/bail-appeals/${user.username}`);
      setBailAppeals(response.data);
      
      setShowCommentSection({ ...showCommentSection, [caseId]: false });
      setBailDecisionType({ ...bailDecisionType, [caseId]: null });
      
    } catch (err) {
      console.error("Error submitting bail decision:", err);
      setError("Failed to submit bail decision. Please try again later.");
    }
  };

  return (
    <>
      <div
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px" }}>
            <i className="fas fa-gavel"></i> Judge Dashboard
          </h2>
        </div>

        <div
          style={{
            backgroundColor: activeSection === "cases" ? "#34495e" : "#2c3e50",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setActiveSection("cases")}
        >
          <a
            href="#"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "18px",
              display: "block",
            }}
          >
            <i className="fas fa-list"></i> List of Cases
          </a>
        </div>

        <div
          style={{
            backgroundColor: activeSection === "bail" ? "#34495e" : "#2c3e50",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setActiveSection("bail")}
        >
          <a
            href="#"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "18px",
              display: "block",
            }}
          >
            <i className="fas fa-gavel"></i> Bail Appeals
          </a>
        </div>

        <div
          style={{
            backgroundColor: activeSection === "decided" ? "#34495e" : "#2c3e50",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setActiveSection("decided")}
        >
          <a
            href="#"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "18px",
              display: "block",
            }}
          >
            <i className="fas fa-check-circle"></i> Decided Cases
          </a>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#34495e",
            borderRadius: "5px",
          }}
        >
          <i
            className="fas fa-user-circle"
            style={{ fontSize: "24px", marginRight: "10px" }}
          ></i>
          <span style={{ fontSize: "16px" }}>
            {user ? user.name : "Judge John Doe"}
          </span>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4abff5",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <div
        style={{
          marginLeft: "250px",
          padding: "20px",
          backgroundColor: "#ecf0f1",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
        )}

        {activeSection === "cases" && (
          <div id="listOfCasesContainer">
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              List of Cases
            </h2>
            {cases.length === 0 ? (
              <p>No cases found for this judge.</p>
            ) : (
              cases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  onClick={() => toggleCaseDescription(caseItem._id)}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {processCaseTitle(caseItem.caseTitle)}
                  </div>
                  <div
                    id={`${caseItem._id}Description`}
                    style={{ display: "none", paddingTop: "10px" }}
                  >
                    <strong>Case ID: </strong>
                    {caseItem.caseId}
                    <br />
                    <strong>Title: </strong>
                    {caseItem.caseTitle}
                    <br />
                    <strong>Filing Date: </strong>
                    {new Date(caseItem.filingDate).toLocaleDateString()}
                    <br />
                    <strong>Case Summary: </strong>
                    {caseItem.caseSummary}
                    <br />
                    <strong>AI Recommendation: </strong>
                    {caseItem.aiRecommendation}
                    <br />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "bail" && (
          <div id="bailAppealsContainer">
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Bail Appeals
            </h2>
            {bailAppeals.length === 0 ? (
              <p>No bail appeals found.</p>
            ) : (
              bailAppeals.map((caseItem) => (
                <div
                  key={caseItem._id}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      onClick={() => toggleBailAppealDescription(caseItem._id)}
                      style={{ fontWeight: "bold" }}
                    >
                      {processCaseTitle(caseItem.caseTitle)}
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          handleBailAppealAction("approve", caseItem._id)
                        }
                        style={{
                          backgroundColor: "#2ecc71",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleBailAppealAction("decline", caseItem._id)
                        }
                        style={{
                          backgroundColor: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>

                  {expandedBailAppeal === caseItem._id && (
                    <div
                      id={`${caseItem._id}BailAppealDescription`}
                      style={{ paddingTop: "10px" }}
                    >
                      <strong>Case ID: </strong>
                      {caseItem.caseId}
                      <br />
                      <strong>Title: </strong>
                      {caseItem.caseTitle}
                      <br />
                      <strong>Detainee: </strong>
                      {caseItem.detaineeName} ({caseItem.detaineeUsername})
                      <br />
                      <strong>Grounds for Bail: </strong>
                      {caseItem.groundsOfBail.join(", ")}
                      <br />
                      <strong>Bail Filing Date: </strong>
                      {new Date(caseItem.bailFilingDate).toLocaleDateString()}
                      <br />
                      <strong>Case Summary: </strong>
                      {caseItem.caseSummary}
                      <br />
                      <button
                        onClick={() => askAI(caseItem._id)}
                        style={{
                          position: "absolute",
                          bottom: "20px",
                          right: "20px",
                          backgroundColor: "#f39c12",
                          color: "#fff",
                          padding: "8px 16px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Ask AI
                      </button>
                      {showCommentSection[caseItem._id] && (
                        <div style={{ marginTop: "20px" }}>
                          <textarea
                            id={`comment${caseItem._id}`}
                            placeholder="Add your comment here"
                            style={{ width: "100%", height: "100px" }}
                          ></textarea>
                          <button
                            onClick={() => submitComment(caseItem._id)}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#3498db",
                              color: "#fff",
                              padding: "8px 16px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Submit Comment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "decided" && (
          <div id="decidedCasesContainer">
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Decided Cases
            </h2>
            {decidedCases.length === 0 ? (
              <p>No decided cases found.</p>
            ) : (
              decidedCases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  onClick={() => toggleCaseDescription(caseItem._id)}
                  style={{
                    backgroundColor: caseItem.bailStatus === "Accepted" 
                      ? "#e8f5e9" 
                      : "#ffebee",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {processCaseTitle(caseItem.caseTitle)}
                  </div>
                  <div
                    id={`${caseItem._id}Description`}
                    style={{ display: "none", paddingTop: "10px" }}
                  >
                    <strong>Case ID: </strong>
                    {caseItem.caseId}
                    <br />
                    <strong>Title: </strong>
                    {caseItem.caseTitle}
                    <br />
                    <strong>Filing Date: </strong>
                    {new Date(caseItem.filingDate).toLocaleDateString()}
                    <br />
                    <strong>Case Summary: </strong>
                    {caseItem.caseSummary}
                    <br />
                    <strong>Bail Appeal: </strong>
                    <span style={{ 
                      color: caseItem.bailStatus === "Accepted" 
                        ? "#2ecc71" 
                        : "#e74c3c" 
                    }}>
                      {caseItem.bailStatus}
                    </span>
                    <br />
                    <strong>Judge Comments: </strong>
                    {caseItem.judgeComments?.join(", ") || "No comments"}
                    <br />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <AIPopup
        isOpen={aiPopupOpen}
        onClose={() => setAIPopupOpen(false)}
        aiRecommendation={aiRecommendation}
      />
    </>
  );
};

export default JudgeDashboard;