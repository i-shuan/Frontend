import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";

/* 要插入的新節點、插入位置的父節點的 key、整個樹狀結構的資料 */
const insertNode = (newNode, parentKey, data) => {
  /* 先搜尋該父節點 */
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.key === parentKey) {
      /* 如果是葉節點，則需要變成父節點 */
      if (!node.children) {
        node.attribute = "Node";
        node.children = [];
      }
      node.children.push(newNode);
      break;
    } else if (node.children) {
      /* 如果該節點有子節點，繼續搜尋 */
      insertNode(newNode, parentKey, node.children);
    }
  }
};

const addNode = (selectedRowKeys, treeData, setTreeData) => {
  /* 如果未選中任何節點，提示選擇父節點 */
  if (selectedRowKeys.length === 0) {
    Modal.warning({
      title: "Please select a parent node to add a new node.",
    });
    return;
  }

  /* 插入新節點 */
  const newNode = {
    key: uuidv4(),
    title: "New Node",
    attribute: "",
    value: "",
  };
  insertNode(newNode, selectedRowKeys[0], treeData);

  /* 更新樹狀結構的狀態 */
  setTreeData([...treeData]);
};

export { addNode };
