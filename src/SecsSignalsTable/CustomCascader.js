import React from 'react';
import { Cascader } from 'antd';
const { SHOW_CHILD } = Cascader;

const options = [
    {
      label: 'Light',
      value: 'light',
      children: new Array(20).fill(null).map((_, index) => ({
        label: `Number ${index}`,
        value: index,
      })),
    },
    {
      label: 'Bamboo',
      value: 'bamboo',
      children: [
        {
          label: 'Little',
          value: 'little',
          children: [
            {
              label: 'Toy Fish',
              value: 'fish',
            },
            {
              label: 'Toy Cards',
              value: 'cards',
            },
            {
              label: 'Toy Bird',
              value: 'bird',
            },
          ],
        },
      ],
    },
  ];

const CustomCascader = () => {
  const onChange = (value) => {
    console.log(value);
  };

  // 定義搜尋函數
  const filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  return (
    <>
      <Cascader
        style={{ width: '100%' }}
        options={options}
        onChange={onChange}
        multiple
        maxTagCount="responsive"
        showCheckedStrategy={SHOW_CHILD}
        showSearch={{ filter }}
        defaultValue={[
          ['bamboo', 'little', 'fish'],
          ['bamboo', 'little', 'cards'],
          ['bamboo', 'little', 'bird'],
        ]}
      />
      <br />
    </>
  );
};

export default CustomCascader;
