import { v4 as uuidv4 } from 'uuid';

// 收集节点数据，用于复制或其他操作
export const collectNodeData = (node) => {
    if (!node.data) return null;
    return {
      data: { ...node.data },
      children: node.childrenAfterGroup ? node.childrenAfterGroup.map(collectNodeData).filter(child => child !== null) : []
    };
  };
  
  // 粘贴节点
  export const pasteNode = (node, path) => {
    if (!node || !node.data) return null;
  
    const newKey = uuidv4();
    const newOrgHierarchy = [...path, newKey];
  
    const newNode = {
      ...node.data,
      key: newKey,
      orgHierarchy: newOrgHierarchy,
    };
  
    if (node.children) {
      newNode.children = node.children.map(child => pasteNode(child, newOrgHierarchy));
    }
    return newNode;
  };
  
  // 展开节点列表
  export const flattenNodes = (nodes) => {
    let result = [];
    nodes.forEach(node => {
      if (!node) return;
      result.push(node);
      if (node.children) {
        result = result.concat(flattenNodes(node.children));
      }
    });
    return result;
  };
  