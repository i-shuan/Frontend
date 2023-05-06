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
const configData = require("./DataStructure.json");

const columnDef = [
  {name:"xpath", title:"XPath"},
  {name:"attribute", title:"Attribute"},
  {name:"value", title:"Value"},
  {name:"updateTime", title:"UpdateTime"},
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
        editable: record[col.name] !== "initial",
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

 /*要尋找的節點的key和整個樹狀結構的資料*/
const findNodeByKey = (key, data) => {
  for (let i = 0; i < data.length; i++) {
    
    if (data[i].key === key) {
      return data[i];
    }
    if (data[i].children) {
      const foundNode = findNodeByKey(key, data[i].children);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};

const handleCopyNode = () => {
  if (selectedRowKeys.length === 0) {
    Modal.warning({
      title: "Please select a node to copy.",
    });
    return;
  }

  const selectedNode = findNodeByKey(selectedRowKeys[0], treeData);
  setCopiedNode(selectedNode);
};


/*確保所有子節點都完全複製*/
const deepCopyNode = (node) => {

  const newNode = {
    key: uuidv4(),
  };
  columnDef.forEach(column => {
    newNode[column.name] = node[column.name];
  });

  /*假如copy node有children*/
  if (node.children) {

    /*遞迴*/
    newNode.children = node.children.map((child) => deepCopyNode(child));
  }

  return newNode;
};

const handlePasteNode = () => {
  if (!copiedNode) {
    Modal.warning({
      title: "Please copy a node first.",
    });
    return;
  }
  if (selectedRowKeys.length === 0) {
    Modal.warning({
      title: "Please select a node to paste.",
    });
    return;
  }

  const selectedNode = findNodeByKey(selectedRowKeys[0], treeData);
  const newNode = deepCopyNode(copiedNode);

  /*檢查目標節點是否具有子節點*/
  /*確保了目標節點具有 children 屬性*/
  if (!selectedNode.children) {
    //假如原本attribute是attr 則改為node, node也是改node(沒差)
    selectedNode.attribute="Node";
    selectedNode.children = [];
  }
  selectedNode.children.push(newNode);

  /*如果不這樣做，由於 treeData 的引用未改變，
  React 將無法檢測到 treeData 的變更，可能導致渲染不一致。*/
  setTreeData([...treeData]);

  //Reset Copy node
  setCopiedNode(null);
};


const handleAddNode = () => {
  if (selectedRowKeys.length === 0) {
    Modal.warning({
      title: "Please select a parent node to add a new node.",
    });
    return;
  }

  const newNode = {
    key: uuidv4(),
  };

  columnDef.forEach(column => {
   
    if(column.name==='updatetime'){
      newNode[column.name] = "1911/01/01 00:00:00 AM";
    }    
    else{
      newNode[column.name] = "New Node";
    }
  });

  const updatedTreeData = [...treeData];
  insertNode(updatedTreeData, newNode, selectedRowKeys[0]);
  setTreeData(updatedTreeData);
};

/*遞迴整個tree*/
const insertNode = (data, nodeToInsert, selectedNodeKey) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    
    /*假如尋找整個tree的key找到選取的node*/
    if (node.key === selectedNodeKey) {

      /*假如選取的node為leaf */
      if (!node.children) {
        /* leaf 的 node 要變成父node*/
        node.attribute="Node";
        node.children = [];
      }
      node.children.push(nodeToInsert);
      break;
    } else if (node.children) {
      /*假如沒有找到而且node還有小孩*/
      insertNode(node.children, nodeToInsert, selectedNodeKey);
    }
    /*node沒有小孩且又不是選取的node 不理會*/
  }
};

  /* Delete node*/
  
  const handleDeleteNode = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: "Please select a node to delete.",
      });
      return;
    }
  
    // Find the parent of the node to delete
    const parentNode = findParentNodeByKey(treeData, selectedRowKeys[0]);
  
    if (parentNode === null) {
      Modal.warning({
        title: "Cannot delete the root node.",
      });
      return;
    }
  
    // Remove the node from its parent's children
    parentNode.children = parentNode.children.filter(
      (child) => child.key !== selectedRowKeys[0]
    );
  
    // Update the tree data
    setTreeData([...treeData]);
  
    // Clear the selected row keys
    setSelectedRowKeys([]);
  };
  
  const findParentNodeByKey = (data, key) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
  
      if (node.children) {
        if (node.children.some((child) => child.key === key)) {
          return node;
        }
  
        const foundParentNode = findParentNodeByKey(node.children, key);
        if (foundParentNode) {
          return foundParentNode;
        }
      }
    }
  
    return null;
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
    const newRecord = { ...updatedRecord, ...obj };
  
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
        <Button onClick={handleCopyNode}>Copy</Button>
        <Button onClick={handlePasteNode}>Paste</Button>
        <Button onClick={handleAddNode}>Add</Button>
        <Button onClick={handleDeleteNode}>Delete</Button> {/* Add this line */}
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
