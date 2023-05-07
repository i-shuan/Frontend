import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";

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

const handleCopyNode = (selectedRowKeys, treeData, setCopiedNode) => {
  if (selectedRowKeys.length === 0) {
    Modal.warning({
      title: "Please select a node to copy.",
    });
    return;
  }

  const selectedNode = findNodeByKey(selectedRowKeys[0], treeData);
  setCopiedNode(selectedNode);
};

const deepCopyNode = (node, columnDef) => {
  const newNode = {
    key: uuidv4(),
  };
  columnDef.forEach((column) => {
    newNode[column.name] = node[column.name];
  });

  if (node.children) {
    newNode.children = node.children.map((child) =>
      deepCopyNode(child, columnDef)
    );
  }

  return newNode;
};

const handlePasteNode = (
  selectedRowKeys,
  treeData,
  setTreeData,
  copiedNode,
  setCopiedNode,
  columnDef
) => {
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
  const newNode = deepCopyNode(copiedNode, columnDef);

  if (!selectedNode.children) {
    selectedNode.children = [];
  }
  selectedNode.children.push(newNode);

  setTreeData([...treeData]);

  setCopiedNode(null);
};

const handleAddNode = (selectedRowKeys, treeData, setTreeData, columnDef) => {
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
const handleDeleteNode = (selectedRowKeys, treeData, setTreeData, setSelectedRowKeys) => {
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

  console.log("selectedRowKeys", selectedRowKeys)
  // Confirm with the user before deleting the node
  Modal.confirm({
    title: `Are you sure you want to delete the node?`,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk: () => {
      // Remove the node from its parent's children
      parentNode.children = parentNode.children.filter(
        (child) => child.key !== selectedRowKeys[0]
      );

      // Update the tree data
      setTreeData([...treeData]);

      // Clear the selected row keys
      setSelectedRowKeys([]);
    },
    onCancel: () => {
      console.log("Deletion is cancelled.");
    },
  });
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

export { handleCopyNode, handlePasteNode, handleAddNode,  handleDeleteNode};
