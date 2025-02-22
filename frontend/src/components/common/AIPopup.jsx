import React from 'react';
import ReactMarkdown from 'react-markdown';

const AIPopup = ({ isOpen, onClose, aiRecommendation }) => {
  if (!isOpen) return null;

  const customStyles = {
    popup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      width: '80%',
      maxWidth: '800px',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px'
    },
    closeButton: {
      border: 'none',
      background: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '5px 10px'
    },
    content: {
      fontSize: '14px',
      lineHeight: '1.6'
    },
    markdown: {
      '& h1': {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#2c3e50'
      },
      '& h2': {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#34495e'
      },
      '& h3': {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#2c3e50'
      },
      '& p': {
        marginBottom: '10px'
      },
      '& strong': {
        color: '#2c3e50',
        fontWeight: 'bold'
      },
      '& em': {
        color: '#7f8c8d'
      },
      '& ul': {
        marginLeft: '20px',
        marginBottom: '10px'
      },
      '& li': {
        marginBottom: '5px'
      },
      '& code': {
        backgroundColor: '#f7f9fa',
        padding: '2px 5px',
        borderRadius: '3px',
        fontSize: '14px'
      }
    }
  };

  return (
    <div style={customStyles.popup}>
      <div style={customStyles.header}>
        <h2>AI Recommendation Analysis</h2>
        <button onClick={onClose} style={customStyles.closeButton}>
          ×
        </button>
      </div>

      <div style={customStyles.content}>
        {typeof aiRecommendation === 'string' ? (
          <p>{aiRecommendation}</p>
        ) : (
          <div>
            <div style={customStyles.markdown}>
              <ReactMarkdown>
                {`# Decision\n${aiRecommendation.decision}\n\n# Analysis\n${aiRecommendation.aiReport}`}
              </ReactMarkdown>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>Similar Cases</h3>
              {aiRecommendation.topCases?.map((case_, index) => (
                <div key={case_.caseId} style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>Case {index + 1}</h4>
                  <p><strong>Case ID:</strong> {case_.caseId}</p>
                  <p><strong>Title:</strong> {case_.title}</p>
                  <p><strong>Bail Status:</strong> {case_.bailStatus}</p>
                  <ReactMarkdown style={customStyles.markdown}>
                    {`**Summary:** ${case_.caseSummary}`}
                  </ReactMarkdown>
                  <p><strong>Grounds of Bail:</strong> {case_.groundsOfBail.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPopup;