const hasMatchingDescendant = (node, filterInput) => {
    if (node.children) {
      return node.children.some(
        (child) =>
          child.title.toLowerCase().includes(filterInput.title.toLowerCase()) ||
          hasMatchingDescendant(child, filterInput)
      );
    }
    return false;
  };
  
  const FilterTreeData = (data, filterInput) => {
    return data.reduce((filteredNodes, node) => {
      let filteredChildren = [];
  
      // 如果節點有子節點，遞迴過濾子節點
      if (node.children) {
        filteredChildren = FilterTreeData(node.children, filterInput);
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
  
  export default FilterTreeData;
  