import React from 'react';
import './BotButton.css';
import { useNavigate } from 'react-router-dom';

const BotButton = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chat');
  };


  return (
    <div className="bot-button-container">
      <button className="bot-button" onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 9h8" />
          <path d="M8 13h6" />
          <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12z" />
        </svg>
        <span className="default-badge">1</span>
      </button>
    </div>
  );
};

export default BotButton;
