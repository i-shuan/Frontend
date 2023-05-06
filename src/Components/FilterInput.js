import { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';

function FilterInput(props) {
  const [inputValue, setInputValue] = useState(props.value);
  const timerIdRef = useRef(null);

  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      props.onChange(props.field, event.target.value);
    }, 1500);
  };

  return (
    <div>
      <Input key={props.field} value={inputValue} onChange={handleInputChange} />
    </div>
  );
}

export default FilterInput;
