


// Function to transform Ant Design data into ag-Grid data without parentKey
export const convertToAgGrid = (data, parentHierarchy = []) => {
    let result = [];
    data.forEach(node => {
        // Create the current hierarchy path by adding the current node key
        const currentHierarchy = [...parentHierarchy, node.key];
        // Create an ag-Grid compatible object
        const newNode = {
            key: node.key,
            name: node.name,
            type: node.type,
            value: node.value,
            orgHierarchy: currentHierarchy // Path from root to this node
        };
        result.push(newNode);

        // If the node has children, recursively process them
        if (node.children && node.children.length > 0) {
            const children = convertToAgGrid(node.children, currentHierarchy);
            result = result.concat(children);
        }
    });
    return result;
}

// Example data from Ant Design
const antdData = [
    {
        key: "1",
        name: "LIST 1",
        type: "LIST",
        value: null,
        children: [
            {
                key: "11",
                name: "Item 1.1",
                type: "U8",
                value: "255",
                children: [
                    {
                        key: "111",
                        name: "Subitem 1.1.1",
                        type: "A",
                        value: "Active"
                    },
                    {
                        key: "112",
                        name: "Subitem 1.1.2",
                        type: "B",
                        value: "true"
                    }
                ]
            },
            {
                key: "12",
                name: "Item 1.2",
                type: "I4",
                value: "-32",
                children: [
                    {
                        key: "121",
                        name: "Subitem 1.2.1",
                        type: "U4",
                        value: "1024"
                    }
                ]
            }
        ]
    },
    {
        key: "2",
        name: "LIST 2",
        type: "LIST",
        value: null,
        children: [
            {
                key: "21",
                name: "Item 2.1",
                type: "I8",
                value: "-9223372036854775808",
                children: [
                    {
                        key: "211",
                        name: "Subitem 2.1.1",
                        type: "B",
                        value: "false"
                    }
                ]
            }
        ]
    }
];

// Transform the Ant Design data into ag-Grid data without parentKey
const newAgGridData = convertToAgGrid(antdData);

console.log(newAgGridData);
