import { v4 as uuidv4 } from 'uuid';

// 更新节点类型
export const updateNodeType = (rowData, key, newType) => {
  const newData = rowData.map(item => {
    if (item.key === key) {
      return { ...item, type: newType };
    }
    return item;
  });

  if (newType !== "LIST") {
    const updatedData = newData.filter(item => !item.orgHierarchy.includes(key) || item.key === key);
    return updatedData;
  }

  return newData;
};

// 添加新行到选择的节点
export const addRowNode = (selectedNode, rowData, setRowData) => {
  if (!selectedNode) {
    console.warn("No node selected!");
    return;
  }

  const orgHierarchy = selectedNode.data.orgHierarchy.slice();
  const isLeaf = !selectedNode.hasChildren();

  if (isLeaf) {
    selectedNode.data.type = "LIST";
    selectedNode.data.name = "LIST";
  }

  var newKey = uuidv4();
  orgHierarchy.push(newKey);

  const newRow = {
    key: newKey,
    orgHierarchy: orgHierarchy,
    name: "New Item",
    type: "A",
    value: "123"
  };

  setRowData([...rowData, newRow]);
};

// 移除选中的节点
export const removeSelectedNodes = (selectedNode, rowData, setRowData) => {
  if (!selectedNode) {
    console.warn("No nodes selected!");
    return;
  }

  const selectedKey = selectedNode.data.key;
  const newRows = rowData.filter(row => !row.orgHierarchy.includes(selectedKey));

  setRowData(newRows);
};
