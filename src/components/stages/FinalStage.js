import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/FinalStage.css';

function FinalStage({ onArrival, briefing, badge }) {
  const navigate = useNavigate();

  const handleClaimBadge = () => {
    navigate('/main'); 
  };

  return (
    <div className="final-stage-container">
      <div className="backdrop"></div> {/* Black opacity backdrop */}

      <h1 className="title">Parabéns, explorador! Você ganhou um emblema!</h1>
      <h2 className="subtitle">Missão completa: {briefing.title}</h2>

      <div className="mission-report-container">
        <div className="report-box">
          <h3 className="report-title">Relatório da Missão</h3>
          <p>{briefing.reportAll}</p>
          <img
            className="badge-animation"
            src={badge.image}
            alt="Badge"
          />
        </div>
      </div>

      <div className="badge-and-button">
        <button className="claim-badge-btn" onClick={handleClaimBadge}>
          Receber Emblema
        </button>
      </div>
    </div>
  );
}

export default FinalStage;
