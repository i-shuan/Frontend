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

export const FilterTreeData = (data, filterInput) => {
  console.log("filterInput", filterInput, "data", data);

  return data.reduce((filteredNodes, node) => {
    let filteredChildren = [];

    // 如果節點有子節點，遞迴過濾子節點
    if (node.children) {
      filteredChildren = FilterTreeData(node.children, filterInput);
    }

    // 判斷節點是否符合篩選條件
    const titleMatches = filterInput?.title?.toLowerCase()
      ? node?.title?.toLowerCase().includes(filterInput?.title?.toLowerCase())
      : true;
    const attributeMatches = filterInput?.attribute?.toLowerCase()
      ? node?.attribute?.toLowerCase().includes(filterInput?.attribute?.toLowerCase())
      : true;
    const valueMatches = filterInput?.value
      ? node?.value?.toString().includes(filterInput?.value?.toString())
      : true;

    if (
      (node.key===0||titleMatches && attributeMatches && valueMatches) ||
      filteredChildren.length > 0
    ) {
      filteredNodes.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }

    return filteredNodes;
  }, []);
};


 