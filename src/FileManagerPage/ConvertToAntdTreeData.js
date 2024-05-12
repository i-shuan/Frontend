// Function to convert ag-Grid data to Ant Design treeData format, omitting empty 'children'
export const convertToAntdTreeData = (data) => {
    // Create a map to hold all nodes by their keys
    const nodesMap = new Map();
    
    // Initialize each node in the map, omitting 'orgHierarchy'
    data.forEach(item => {
        const { orgHierarchy, ...nodeData } = item;
        nodesMap.set(item.key, { ...nodeData, children: [] });
    });

    // Initialize an array to hold the root nodes
    const rootNodes = [];

    // Populate children arrays and find the root nodes
    data.forEach(item => {
        const node = nodesMap.get(item.key);
        const parentHierarchy = item.orgHierarchy.slice(0, -1);
        const parentKey = parentHierarchy[parentHierarchy.length - 1];

        if (parentKey) {
            // Add node to its parent's children array
            const parentNode = nodesMap.get(parentKey);
            parentNode.children.push(node);
        } else {
            // If no parent, it is a root node
            rootNodes.push(node);
        }
    });

    // Remove empty 'children' property from leaf nodes
    function removeEmptyChildren(nodes) {
        nodes.forEach(node => {
            if (node.children.length === 0) {
                delete node.children;
            } else {
                removeEmptyChildren(node.children);
            }
        });
    }

    removeEmptyChildren(rootNodes);
    return rootNodes;
}

// Example input data (ag-Grid format)
const agGridData = [
    {
        key: '1',
        name: 'LIST 1',
        type: 'LIST',
        value: null,
        orgHierarchy: ['1']
    },
    {
        key: '11',
        name: 'Item 1.1',
        type: 'U8',
        value: '255',
        orgHierarchy: ['1', '11']
    },
    {
        key: '111',
        name: 'Subitem 1.1.1',
        type: 'A',
        value: 'Active',
        orgHierarchy: ['1', '11', '111']
    },
    {
        key: '112',
        name: 'Subitem 1.1.2',
        type: 'B',
        value: 'true',
        orgHierarchy: ['1', '11', '112']
    },
    {
        key: '12',
        name: 'Item 1.2',
        type: 'I4',
        value: '-32',
        orgHierarchy: ['1', '12']
    },
    {
        key: '121',
        name: 'Subitem 1.2.1',
        type: 'U4',
        value: '1024',
        orgHierarchy: ['1', '12', '121']
    },
    {
        key: '2',
        name: 'LIST 2',
        type: 'LIST',
        value: null,
        orgHierarchy: ['2']
    },
    {
        key: '21',
        name: 'Item 2.1',
        type: 'I8',
        value: '-9223372036854775808',
        orgHierarchy: ['2', '21']
    },
    {
        key: '211',
        name: 'Subitem 2.1.1',
        type: 'B',
        value: 'false',
        orgHierarchy: ['2', '21', '211']
    }
];

// Convert to Ant Design treeData format
const antdTreeData = convertToAntdTreeData(agGridData);

console.log(JSON.stringify(antdTreeData, null, 2));
