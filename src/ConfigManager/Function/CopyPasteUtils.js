

import {Modal,} from "antd";
import { v4 as uuidv4 } from "uuid";

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
  
  const copyNode = (selectedRowKeys, treeData, setCopiedNode) => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: "Please select a node to copy.",
      });
      return;
    }
  
    const selectedNode = findNodeByKey(selectedRowKeys[0], treeData);
    setCopiedNode(selectedNode);
  };
  
  const pasteNode = (selectedRowKeys, copiedNode, treeData, setTreeData, setCopiedNode) => {
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
  
  export { copyNode, pasteNode };
  