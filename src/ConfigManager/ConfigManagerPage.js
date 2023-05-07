import React, { useState, useEffect, useCallback } from "react";

import {
  Space,
  Switch,
  Table,
  Tree,
  Button,
  Modal,
  Form,
  Input,
} from "antd";

import { v4 as uuidv4 } from "uuid";
import EditableCell from "./EditableCell";
import FilterInput from "../Components/FilterInput";
import {ConvertDataStructure} from "./Function/ConvertDataStructure"
import {ConvertToTreeData} from "./Function/ConvertToTreeData"
import {FilterTreeData} from "./Function/FilterTreeData"
import {handleCopyNode, handlePasteNode, handleAddNode,  handleDeleteNode} from "./Function/Utils"
const configData = require("./DataStructure.json");

const columnDef = [
  {name:"xpath", title:"XPath", editable:true},
  {name:"attribute", title:"Attribute", editable:true},
  {name:"value", title:"Value", editable:true},
  {name:"originalValue", title:"OriginalValue", editable:false},
  {name:"updateTime", title:"UpdateTime", editable:false},
]
/* Convert String to Json =>若backend給Json這個能省略 */

const convertToJson = ConvertDataStructure(configData, columnDef)

console.log("convertToJson", convertToJson)

/* Convert Json to TreeData */

const orignalTreeData = ConvertToTreeData(convertToJson, columnDef);
console.log("orignalTreeData", orignalTreeData)

/*add FiltetInput in Table*/
const initialData = columnDef.reduce((acc, column) => {
  acc[column.name] = "initial";
  return acc;
}, {key: 0});

orignalTreeData.push(initialData);

/*key=0 排第一列*/
const treeDataWithTop = [orignalTreeData.find(item => item.key === 0), ...orignalTreeData.filter(item => item.key !== 0)]
console.log("treeDataWithTop", treeDataWithTop)

/*add FiltetInput Value*/
const initialFilterInput = columnDef.reduce((acc, column) => {
  acc[column.name] = "";
  return acc;
}, {});

const ConfigManager = () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
 /* tree structure key*/
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [treeData, setTreeData] = useState(treeDataWithTop);
  const [filteredTreeData, setFilteredTreeData] = useState(treeDataWithTop);
  const [copiedNode, setCopiedNode] = useState(null);
  const [filterInput, setFilterInput] = useState(initialFilterInput);
 
  console.log("filterInput", filterInput)
  
  useEffect(() => {

    /*我們使用 some 方法遍歷 columnDef 陣列，並檢查 filterInput 中對應的屬性值是否不為空字符串。如果 some 方法返回 true，則表示至少有一個篩選條件不為空，*/
    const hasNonEmptyFilter = columnDef.some(column => filterInput[column.name] !== "");
 
    if (hasNonEmptyFilter) {
      const filteredData = FilterTreeData(treeData, filterInput);
      setFilteredTreeData(filteredData);
    } else {
      setFilteredTreeData(treeData);
    }
  }, [filterInput, treeData]); // Add treeData as a dependency
  

  const handleFilterInputChange = useCallback((field, value) => {
    setFilterInput((prevState) => ({ ...prevState, [field]: value }));
  }, []);
  
  
  useEffect(() => {
    console.log('treeData has been updated:', treeData);
  }, [treeData]);
  
  const columns = columnDef.map((col) => {
    return {
      title: col.title,
      dataIndex: col.name,
      key: col.name,
      onCell: (record) => ({
        record,
        dataIndex: col.name,
        editable: record[col.name] !== "initial" && col.editable, // Use col.name instead of "orignalValue"
        handleSave: (key, dataIndex, value) => handleSave(key, col.name, value),
      }),
      render: (text, record) => (
        
        record[col.name] === "initial" ?
        <FilterInput
            field={col.name}
            value={filterInput[col.name]}
            onChange={handleFilterInputChange}
          />:
        text)
    }
  });
  

  const handleCopy = () => {
    handleCopyNode(selectedRowKeys, treeData, setCopiedNode);
  };

  const handlePaste = () => {
    handlePasteNode(selectedRowKeys, treeData, setTreeData, copiedNode, setCopiedNode, columnDef);
  };

  const handleAdd = () => {
    handleAddNode(selectedRowKeys, treeData, setTreeData, columnDef);
  };

  /* Delete node*/
  const handleDelete = () => {
    handleDeleteNode(selectedRowKeys, treeData, setTreeData, setSelectedRowKeys);
  };


  /* Edit Cell Value - update new value to Tree */
  const updateTreeData = (data, key, newRecord) => {
    console.log("updateTreeData", data, key, newRecord)
    return data.map((item) => {
      if (item.key === key) {
        return newRecord;
      } else if (item.children) {
        return {
          ...item,
          children: updateTreeData(item.children, key, newRecord),
        };
      } else {
        return item;
      }
    });
  };



  /* Edit Cell Value - association to save function*/
  const handleSave = useCallback((updatedRecord, obj) => {
    console.log("updatedRecord", updatedRecord)
    const { key } = updatedRecord;
    const currentTime = new Date().toISOString(); // Get the current time

    const newRecord = { ...updatedRecord, ...obj,  updateTime: currentTime  };
  
    const updatedTreeData = updateTreeData(treeData, key, newRecord);
    console.log("updatedTreeData", updatedTreeData);
    setTreeData(updatedTreeData);
  }, [treeData]); // 將 treeData 加入 useCallback 的依賴列表
  
  /* Call EditCell*/
  const components = {
    body: {
      cell: (cellProps) => {
        const { editable, rowIndex, dataIndex , record} = cellProps;
        return editable ? (
          <EditableCell
            {...cellProps}
            key={`${rowIndex}-${dataIndex}-${record[dataIndex]}`}
            handleSave={handleSave}
            rowIndex={rowIndex}
            dataIndex={dataIndex}
          />
        ) : (
          <td {...cellProps} />
        );
      },
    },
  };
  
  
  

 

  return (
    <>
      <Space
        align="center"
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={handlePaste}>Paste</Button>
        <Button onClick={handleAdd}>Add</Button>
        <Button onClick={handleDelete}>Delete</Button> {/* Add this line */}
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Form component={false}>
          <Table
            key="configManagerTable"
            columns={columns}
            dataSource={filteredTreeData}
            pagination={false}
            rowKey={(record) => record.key}
            components={components}
            rowClassName={(record) => (record.key === 0 ? "hidden-row" : "")}
            rowSelection={{
              type: "radio", 
              selectedRowKeys,
              onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
              },
              hideSelectAll:true,
              getCheckboxProps: (record) => ({
                disabled: record.key === 0,
              }),
            }}
          />
      </Form>
    </>
  );
}

export default ConfigManager
