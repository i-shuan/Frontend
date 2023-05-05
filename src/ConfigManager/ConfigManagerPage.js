import React, { useState, createContext } from "react";

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
import {
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import EditableCell from "./EditableCell";

export const EditableContext = createContext(null);
const configData = require("./DataStructure.json");

//reduce處理多個不同的array
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

const convertToTreeData = (obj, parentKey = null) => {
  return Object.entries(obj).map(([key, value], index) => {
    const isLeaf =
      typeof value !== "object" ||
      (value.xpath && !value.children) ||
      value.xpath === "";
    const title = isLeaf ? value.name || key : value.xpath || key;
    const item = {
      key: parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`,
      title: title,
      attribute: value.attribute ? value.attribute : "",
      value: value.value ? value.value : "",
    };

    if (!isLeaf) {
      item.children = convertToTreeData(value, item.key);
    }

    return item;
  });
};




const treeData = convertToTreeData(result);

console.log("treeData", treeData)

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


const ConfigManager = () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
 /* tree structure key*/
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [treeData, setTreeData] = useState(convertToTreeData(result));
  console.log("selectedRowKeys", selectedRowKeys)
  const [copiedNode, setCopiedNode] = useState(null);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "XPath",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
      onCell: (record) => ({
        record,
        dataIndex: 'attribute',
        editable: true,
        handleSave,
      }),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      onCell: (record) => ({
        record,
        dataIndex: 'value',
        editable: true,
        handleSave,
      }),
    },
  ];

  
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

  /* Edit Table Cell */
  const handleSave = (updatedRecord) => {
    // 找到要更新的節點
    const updatedTreeData = treeData.map((item) => {
      if (item.key === updatedRecord.key) {
        return { ...item, ...updatedRecord };
      } else if (item.children) {
        return {
          ...item,
          children: updateTreeData(item.children, updatedRecord),
        };
      } else {
        return item;
      }
    });
    setTreeData(updatedTreeData);
  };
  
  
  

  const components = {
    body: {
      cell: (props) => (
        <EditableCell {...props} form={form} handleSave={handleSave} />
      ),
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
        <EditableContext.Provider value={form}>
          <Table
            key="configManagerTable"
            columns={columns}
            dataSource={treeData}
            pagination={false}
            rowKey={(record) => record.key}
             components={components}
            rowSelection={{
              type: "radio", 
              selectedRowKeys,
              onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
              },
              hideSelectAll:true
            }}
          />
        </EditableContext.Provider>
      </Form>
    </>
  );
}

export default ConfigManager
