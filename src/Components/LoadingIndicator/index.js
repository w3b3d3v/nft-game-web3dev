import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className="loading-indicator">
      <div className="loading-hadouken">
        <img src="https://cdn3.emoji.gg/emojis/6945_hadouken_right.png" />
      </div>
      <p>Hadouken!</p>
    </div>
  );
};

export default LoadingIndicator;
