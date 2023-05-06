// FilterInput.js
import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const FilterInput = ({ field, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSearch = () => {
    onChange(field, inputValue);
  };

  return (
    <Input
      placeholder={`Filter by ${field}`}
      prefix={<SearchOutlined />}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onPressEnter={handleSearch}
    />
  );
};

export default FilterInput;
