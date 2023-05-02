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

const convertToTreeData = (obj, parentKey = null) => {
  return Object.entries(obj).map(([key, value], index) => {

    console.log("obj", obj)
    //將 XPath、Attribute、Value 分別放入到欄位 title、attribute、value 中
    const item = {
      key: parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`,
      //value.xpath 等於空字串時會使用 key 作為 title
      title: value.xpath || key,
      attribute: value.attribute || "",
      value: value.value || "",
    };

    //遞迴處理Tree結構
    // 1. 當value是obj, 就會遞迴, 因為底下有子節點
    // 2. 當沒有xpath, 因為為父節點，底下沒有孩子
    // 其餘的都是leaf，不須處理
    if (typeof value === "object" && !value.xpath) {
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
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [modalForm] = Form.useForm();
  const [copiedNode, setCopiedNode] = useState(null);

  const handleTreeSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  const handleAddNode = () => {
    setModalType("add");
    setModalVisible(true);
  };
  
  const handleCopyNode = () => {
    if (selectedKeys.length === 0) {
      Modal.warning({
        title: "Please select a node to copy.",
      });
      return;
    }
    setModalType("copy");
    setModalVisible(true);
  };
  
  const handleDeleteNode = () => {
    if (selectedKeys.length === 0) {
      Modal.warning({
        title: "Please select a node to delete.",
      });
      return;
    }
    Modal.confirm({
      title: "Are you sure you want to delete this node?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: {
        danger: true,
      },
      onOk: () => {
        // TODO: Implement delete node logic
      },
      onCancel: () => {},
    });
  };
  
  const handleModalOk = () => {
    modalForm.validateFields().then((values) => {
      if (modalType === "add") {
        // TODO: Implement add node logic
      } else if (modalType === "copy") {
        // TODO: Implement copy node logic
      }
      setModalVisible(false);
      modalForm.resetFields();
    });
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
        <Button onClick={handleDeleteNode} danger>
          Delete
        </Button>
        <Button onClick={handleAddNode}>Add</Button>
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table
        columns={columns}
        dataSource={treeData}
        pagination={false}
        rowKey={(record) => record.key}
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
