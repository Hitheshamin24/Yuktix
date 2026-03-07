import React, { useState } from 'react';
import '../style/interview.scss';

// Mocked & parsed version of the provided data structure for the UI layer
const mockInterviewData = {
  matchScore: 78,
  technicalQuestions: [
    {
      question: "Explain the concept of middleware in Express.js. How do you use it?",
      intention: "Evaluate understanding of the topic",
      answer: "Explain the concept clearly with examples and best practices"
    },
    {
      question: "You've worked with MySQL. How do SQL and NoSQL databases differ?",
      intention: "Evaluate understanding of the topic",
      answer: "Explain the concept clearly with examples and best practices"
    }
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a time you encountered a significant technical challenge.",
      intention: "Evaluate understanding of the topic",
      answer: "Explain the concept clearly with examples and best practices"
    },
    {
      question: "Describe a situation where you had to learn a new technology quickly.",
      intention: "Evaluate understanding of the topic",
      answer: "Explain the concept clearly with examples and best practices"
    }
  ],
  skillGaps: [
    { skill: "MongoDB (NoSQL Database)", severity: "medium" },
    { skill: "JWT Authentication", severity: "medium" },
    { skill: "Advanced Git Operations", severity: "medium" }
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "MongoDB Fundamentals",
      tasks: ["Study the topic", "Practice coding examples"]
    },
    {
      day: 2,
      focus: "Integrating MongoDB with Node.js (Mongoose)",
      tasks: ["Study the topic", "Practice coding examples"]
    }
  ]
};

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const data = mockInterviewData;

  const renderMainContent = () => {
    switch (activeTab) {
      case 'technical':
        return (
          <div className="content-section">
            <h2>Technical Questions</h2>
            <div className="card-list">
              {data.technicalQuestions.map((item, index) => (
                <div key={index} className="question-card">
                  <h4>Q: {item.question}</h4>
                  <p className="intention"><strong>Intention:</strong> {item.intention}</p>
                  <p className="answer"><strong>Expected Answer:</strong> {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'behavioral':
        return (
          <div className="content-section">
            <h2>Behavioral Questions</h2>
            <div className="card-list">
              {data.behavioralQuestions.map((item, index) => (
                <div key={index} className="question-card">
                  <h4>Q: {item.question}</h4>
                  <p className="intention"><strong>Intention:</strong> {item.intention}</p>
                  <p className="answer"><strong>Expected Answer:</strong> {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'roadmap':
        return (
          <div className="content-section">
            <h2>Preparation Road Map</h2>
            <div className="card-list">
              {data.preparationPlan.map((plan, index) => (
                <div key={index} className="roadmap-card">
                  <div className="day-badge">Day {plan.day}</div>
                  <div className="plan-details">
                    <h4>{plan.focus}</h4>
                    <ul>
                      {plan.tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="interview-page">
      <div className="interview-layout">
        
        {/* Left Column: Navigation */}
        <aside className="left-sidebar">
          <div className="match-score">
            <span>Match Score</span>
            <div className="score-circle">{data.matchScore}%</div>
          </div>
          <nav className="side-nav">
            <button 
              className={activeTab === 'technical' ? 'active' : ''} 
              onClick={() => setActiveTab('technical')}
            >
              Technical questions
            </button>
            <button 
              className={activeTab === 'behavioral' ? 'active' : ''} 
              onClick={() => setActiveTab('behavioral')}
            >
              Behavioral questions
            </button>
            <button 
              className={activeTab === 'roadmap' ? 'active' : ''} 
              onClick={() => setActiveTab('roadmap')}
            >
              Road Map
            </button>
          </nav>
        </aside>

        {/* Middle Column: Main Content */}
        <main className="main-content">
          {renderMainContent()}
        </main>

        {/* Right Column: Skill Gaps */}
        <aside className="right-sidebar">
          <h3>Skill Gaps</h3>
          <div className="skill-pills">
            {data.skillGaps.map((gap, index) => (
              <span key={index} className={`pill severity-${gap.severity}`}>
                {gap.skill}
              </span>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Interview;