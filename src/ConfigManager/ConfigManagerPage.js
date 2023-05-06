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

const configData = require("./DataStructure.json");

/* Convert String to Json =>若backend給Json這個能省略 */

const result = configData.data.reduce((acc, obj) => {
  //split xpath to Array
  const levels = obj.xpath.split("/").filter((level) => level !== "");

  //這部分都是處理同一組/////////////////
  let currLevel = acc;
  levels.forEach((level) => {
    if (!currLevel[level]) {
      currLevel[level] = {};
    }
    currLevel = currLevel[level];
  });

  currLevel[obj.name] = {
    xpath: obj.xpath,
    attribute: obj.attribute,
    value: obj.value,
  };
  ///////////////////////////////
  return acc;
}, {});

console.log("result", result)

/* Convert Json to TreeData */
const convertToTreeData = (obj, parentKey = null) => {
  return Object.entries(obj).map(([key, objValue], index) => {
    const isLeaf =
      typeof objValue !== "object" ||
      (objValue.xpath && !objValue.children) ||
      objValue.xpath === "";
    const title = isLeaf ? objValue.name || key : objValue.xpath || key;
    const item = {
      key: parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`,
      title: title,
      attribute: objValue.attribute ? objValue.attribute : "",
      value: objValue.value ? objValue.value : "",
    };

    if (!isLeaf) {
      item.children = convertToTreeData(objValue, item.key);
    }

    return item;
  });
};

const orignalTreeData = convertToTreeData(result);
const initialData = {key:0, "title":"initial", "attribute": "initial", "value": "initial"};
orignalTreeData.push(initialData);

/*key=0 排第一列*/
const treeDataWithTop = [orignalTreeData.find(item => item.key === 0), ...orignalTreeData.filter(item => item.key !== 0)]
console.log("treeDataWithTop", treeDataWithTop)

/* Filter */
const hasMatchingDescendant = (node, filterInput) => {
  if (node.children) {
    return node.children.some(
      (child) =>
      child.key === 0 ||child.title.toLowerCase().includes(filterInput.title.toLowerCase()) ||
        hasMatchingDescendant(child, filterInput)
    );
  }
  return false;
};

const filterTreeData = (data, filterInput) => {
  return data.reduce((filteredNodes, node) => {
    let filteredChildren = [];

    // 如果節點有子節點，遞迴過濾子節點
    if (node.children) {
      filteredChildren = filterTreeData(node.children, filterInput);
    }

    // 對節點的 title 進行篩選
    if (
      node.key === 0 ||
      node.title.toLowerCase().includes(filterInput.title.toLowerCase()) ||
      hasMatchingDescendant(node, filterInput)
    ) {
      // 保留篩選後的子節點，或在過濾條件清除時顯示所有子節點
      filteredNodes.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }

    return filteredNodes;
  }, []);
};



const ConfigManager = () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
 /* tree structure key*/
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [treeData, setTreeData] = useState(treeDataWithTop);
  const [filteredTreeData, setFilteredTreeData] = useState(treeDataWithTop);
  const [copiedNode, setCopiedNode] = useState(null);
  const [filterInput, setFilterInput] = useState({title:"", attribute:"", value:""});
  const [form] = Form.useForm();
  
  console.log("filterInput", filterInput)
  
  useEffect(() => {
    if (filterInput.title !== "" || filterInput.attribute !== "" || filterInput.value !== "") {
      const filteredData = filterTreeData(treeData, filterInput);
      setFilteredTreeData(filteredData);
    } else {
      setFilteredTreeData(treeData);
    }
  }, [filterInput, treeData]); // Add treeData as a dependency
  

  const handleFilterInputChange = useCallback((field, value) => {
    setFilterInput((prevState) => ({ ...prevState, [field]: value }));
  }, []);
  
  

  const columns = [
    {
      title: "XPath",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        record.title === "initial" ?
        <FilterInput
          field="title"
          value={filterInput.title}
          onChange={handleFilterInputChange}
        />
        :
        text
      )      
    },
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
      onCell: (record) => ({
        record,
        dataIndex: "attribute",
        editable: record.attribute !== "initial",
        handleSave: (key, dataIndex, value) => handleSave(key, "attribute", value),
      }),
      render: (text, record) => (
        record.attribute === "initial" ?
        <FilterInput
          field="attribute"
          value={filterInput.attribute}
          onChange={handleFilterInputChange}
        />:
        text
      )
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      onCell: (record) => ({
        record,
        dataIndex: "value",
        editable: record.value !== "initial",
        handleSave: (key, dataIndex, value) => handleSave(key, "value", value),
      }),
      render: (text, record) => (
        record.value === "initial" ?
        <FilterInput
          field="value"
          value={filterInput.value}
          onChange={handleFilterInputChange}
        />:
        text
      )
    },
  ];
  
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
        handleSave: handleSave,
      }),
    };
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
    title: node.title,
    attribute: node.attribute,
    value: node.value,
  };

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
    title: "New Node",
    attribute: "",
    value: "",
  };

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

  /* Edit Cell Value - update new value to Tree*/
  const updateTreeData = (data, key, dataIndex, newData) => {
    return data.map((item) => {
      if (item.key === key) {
        return { ...item, [dataIndex]: newData };
      } else if (item.children) {
        return {
          ...item,
          children: updateTreeData(item.children, key, dataIndex, newData),
        };
      } else {
        return item;
      }
    });
  };

  /* Edit Cell Value - association to save function*/
  const handleSave = useCallback((updatedRecord, obj) => {
    
    
    const { key } = updatedRecord;
    const dataIndex = Object.keys(obj)[0];
    const newData = obj[dataIndex] !== undefined ? obj[dataIndex] : '';
    const updatedTreeData = updateTreeData(treeData, key, dataIndex, newData);
    console.log("updatedTreeData", updatedTreeData)
    setTreeData(updatedTreeData);
  },[]);


  /* Call EditCell*/
  const components = {
    body: {
      cell: (props) => {
        return props.editable ? (
           <EditableCell {...props} form={form} handleSave={handleSave} />
        ) : (
          <td {...props} />
        )
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
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Form component={false}>
          <Table
            key="configManagerTable"
            columns={mergedColumns}
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
