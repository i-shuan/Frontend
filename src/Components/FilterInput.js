import { useState, useEffect } from 'react';
import { Input } from 'antd';

function FilterInput(props) {
  const [inputValue, setInputValue] = useState(props.value);

  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    const timerId = setTimeout(() => {
      props.onChange(props.field, event.target.value);
    }, 1500);

    return () => {
      clearTimeout(timerId);
    };
  };

  return (
    <div>
      <Input key={props.field} value={inputValue} onChange={handleInputChange} />
    </div>
  );
}


export default FilterInput;
