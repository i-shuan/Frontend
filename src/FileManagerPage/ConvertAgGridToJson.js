// Import the uuid package


export const convertToJsonData = (data) => {
    const nodeMap = new Map();

    // Step 1: Initialize each node in the nodeMap
    data.forEach(item => {
        const newItem = {
            name: item.name,
            type: item.type,
            value: item.type === 'LIST' ? [] : item.value
        };
        nodeMap.set(item.key, newItem);
    });

    // Step 2: Build the tree structure
    const tree = [];
    data.forEach(item => {
        const parentKey = item.orgHierarchy[item.orgHierarchy.length - 1];
        if (item.orgHierarchy.length > 1) {
            const parentKey = item.orgHierarchy[item.orgHierarchy.length - 2];
            const parentNode = nodeMap.get(parentKey);
            if (parentNode && Array.isArray(parentNode.value)) {
                parentNode.value.push(nodeMap.get(item.key));
            }
        } else {
            // It's a root node
            tree.push(nodeMap.get(item.key));
        }
    });

    return tree;
}


// Your JSON data
const agGridData =[
    {
        "key": "4eead969-9482-46b8-b591-c81a66fffba8",
        "name": "LIST 1",
        "type": "LIST",
        "value": null,
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8"
        ]
    },
    {
        "key": "c5d26729-c77b-436d-ae3a-8881409a7672",
        "name": "LIST 4",
        "type": "LIST",
        "value": null,
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8",
            "c5d26729-c77b-436d-ae3a-8881409a7672"
        ]
    },
    {
        "key": "94479326-d596-43e6-921e-881651151453",
        "name": "LIST",
        "type": "LIST",
        "value": "",
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8",
            "c5d26729-c77b-436d-ae3a-8881409a7672",
            "94479326-d596-43e6-921e-881651151453"
        ]
    },
    {
        "key": "c5fa8a35-60b6-4d2c-a987-e1bc60e3a48c",
        "name": "Subitem 1.1.2",
        "type": "B",
        "value": "true",
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8",
            "c5d26729-c77b-436d-ae3a-8881409a7672",
            "c5fa8a35-60b6-4d2c-a987-e1bc60e3a48c"
        ]
    },
    {
        "key": "da322bd8-fcd4-4b79-9841-e225c0e96bdb",
        "name": "LIST 2",
        "type": "LIST",
        "value": null,
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8",
            "da322bd8-fcd4-4b79-9841-e225c0e96bdb"
        ]
    },
    {
        "key": "e9ae4c3e-ee5c-4961-8415-df3a38c537f2",
        "name": "Subitem 1.2.1",
        "type": "U4",
        "value": "1024",
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8",
            "da322bd8-fcd4-4b79-9841-e225c0e96bdb",
            "e9ae4c3e-ee5c-4961-8415-df3a38c537f2"
        ]
    },
    {
        "key": "3a4f7182-eb11-463f-bf74-ba521e3336a0",
        "orgHierarchy": [
            "4eead969-9482-46b8-b591-c81a66fffba8",
            "c5d26729-c77b-436d-ae3a-8881409a7672",
            "94479326-d596-43e6-921e-881651151453",
            "3a4f7182-eb11-463f-bf74-ba521e3336a0"
        ],
        "name": "LIST",
        "type": "U8",
        "value": ""
    }
];

// Convert JSON data to ag-Grid tree data
const jsonData = convertToJsonData(agGridData);

// Display the converted data
console.log(JSON.stringify(jsonData));
