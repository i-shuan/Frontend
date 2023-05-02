import React, { useState } from "react";
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

// const convertToTreeData = (obj, parentKey = null) => {
//   return Object.entries(obj).map(([key, value], index) => {

//     console.log("obj", obj)
//     //將 XPath、Attribute、Value 分別放入到欄位 title、attribute、value 中
//     const item = {
//       key: parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`,
//       //value.xpath 等於空字串時會使用 key 作為 title
//       title: value.xpath || key,
//       attribute: value.attribute || "",
//       value: value.value || "",
//     };

//     //遞迴處理Tree結構
//     // 1. 當value是obj, 就會遞迴, 因為底下有子節點
//     // 2. 當沒有xpath, 因為為父節點，底下沒有孩子
//     // 其餘的都是leaf，不須處理
//     if (typeof value === "object" && !value.xpath) {
//       item.children = convertToTreeData(value, item.key);
//     }

//     return item;
//   });
// };

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
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const ConfigManager = () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [modalForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [treeData, setTreeData] = useState(convertToTreeData(result));
  console.log("selectedRowKeys", selectedRowKeys)
  const [copiedNode, setCopiedNode] = useState(null);

  const handleAddNode = () => {
    setModalType("add");
    setModalVisible(true);
  };
  
 
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

  const newNode = {
    key: uuidv4(),
    title: copiedNode.title,
    attribute: copiedNode.attribute,
    value: copiedNode.value,
  };

  if (copiedNode.children) {
    newNode.children = copiedNode.children.map((child) => ({
      key: uuidv4(),
      title: child.title,
      attribute: child.attribute,
      value: child.value,
    }));
  }

  if (!selectedNode.children) {
    selectedNode.children = [];
  }
  selectedNode.children.push(newNode);

  setTreeData([...treeData]);
  setCopiedNode(null);
};

  
  
  // 新增節點
const handleModalOk = () => {
  modalForm.validateFields().then((values) => {
    if (modalType === "add") {
      const selectedNode = treeData.find(
        (node) => node.key === selectedRowKeys[0]
      );
      const newNode = {
        key: `${selectedNode.key}-${selectedNode.children.length + 1}`,
        title: values.nodeName,
        attribute: "",
        value: "",
      };
      if (!selectedNode.children) {
        selectedNode.children = [];
      }
      selectedNode.children.push(newNode);
      setTreeData([...treeData]);
    } else if (modalType === "copy") {
      handleCopyNode();
    }
    setModalVisible(false);
    modalForm.resetFields();
  });
};

  
  const insertNode = (data, nodeToInsert, parentKey) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.key === parentKey) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(nodeToInsert);
        break;
      } else if (node.children) {
        insertNode(node.children, nodeToInsert, parentKey);
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    modalForm.resetFields();
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
        {/* <Button onClick={handleDeleteNode} danger>
          Delete
        </Button> */}
         <Button onClick={handlePasteNode}>Paste</Button>
        <Button onClick={handleAddNode}>Add</Button>
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table
        columns={columns}
        dataSource={treeData}
        pagination={false}
        rowKey={(record) => record.key}
       
        rowSelection={{
          type: "radio", 
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
          hideSelectAll:true
        }}
      />
      <Modal
        visible={modalVisible}
        title={modalType === "add" ? "Add Node" : "Copy Node"}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            name="nodeName"
            label="Node Name"
            rules={[{ required: true, message: "Please enter node name." }]}
          >
            <Input placeholder="Node Name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ConfigManager
