import React, { useState } from 'react';

const CallBackInput = (props)=>{
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const callbackFunc = () => {
    // 在這裡調用回調函數
    props.onChange(inputValue);
  };

  return (
    <div>
      <input key={props.id} value={inputValue} onChange={handleInputChange} />
    </div>
  );
}

export default CallBackInput;
