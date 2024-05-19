import React from 'react';
import "./AnimatedText.css"

const AnimatedText = (props) => {

  const text = props.text
  const letters = text.split('');

  return (
    <div className="animated-text">
      {letters.map((letter, index) => (
        <span key={index}>{letter}</span>
      ))}
    </div>
  );
};


export default AnimatedText