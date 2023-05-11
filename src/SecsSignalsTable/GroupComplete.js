import React, { useState } from 'react';
import { AutoComplete } from 'antd';

// const allOptions = [
// {
//     label: 'Group1',
//     options: [
//     { value: 'option1' },
//     { value: 'option2' },
//     ],
// },
// {
//     label: 'Group2',
//     options: [
//     { value: 'option3' },
//     { value: 'option4' },
//     ],
// },
// ];

// Generate 70000 options and group them into 5 groups
const allOptions = Array.from({ length: 5 }, (_, groupIndex) => ({
    label: `Group${groupIndex + 1}`,
    options: Array.from({ length: 14000 }, (_, optionIndex) => ({
      value: `option${groupIndex * 14000 + optionIndex + 1}`
    })),
  }));

const GroupComplete = () => {

    const [options, setOptions] = useState(allOptions);

    const handleSearch = (value) => {
        if (!value) {
            setOptions(allOptions);
            return;
        }

        const filteredOptions = allOptions.map(group => ({
            ...group,
            options: group.options.filter(option =>
                option.value.toLowerCase().includes(value.toLowerCase())
            ),
        })).filter(group => group.options.length > 0);

        setOptions(filteredOptions);
    };

    return (
        <AutoComplete
            key={`my-component-${new Date()}`}
            style={{ width: 200 }}
            options={options}
            onSearch={handleSearch}
        />
    );

}

export default GroupComplete