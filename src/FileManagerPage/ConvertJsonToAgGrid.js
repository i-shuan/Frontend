// Import the uuid package
import { v4 as uuidv4 } from 'uuid';

export const convertJsonToAgGrid = (data, parentHierarchy = []) => {
    let agGridData = [];

    data.forEach((item) => {
        // Generate a UUIDv4 key for each item
        const key = uuidv4();
        // Create an orgHierarchy for this item
        const orgHierarchy = [...parentHierarchy, key];

        // Add this item to the ag-Grid data structure
        agGridData.push({
            key: key,
            name: item.name,
            type: item.type,
            value: item.type === 'LIST' ? null : item.value,
            orgHierarchy: orgHierarchy
        });

        // If this item has a nested value (list), process it recursively
        if (item.type === 'LIST' && Array.isArray(item.value)) {
            agGridData = agGridData.concat(convertJsonToAgGrid(item.value, orgHierarchy));
        }
    });

    return agGridData;
}

// Your JSON data
const jsonData = [
    {
        "name": "LIST 1",
        "type": "LIST",
        "value": [
            {
                "name": "LIST 2",
                "type": "LIST",
                "value": [
                    {
                        "name": "Subitem 1.1.1",
                        "type": "A",
                        "value": "Active"
                    },
                    {
                        "name": "Subitem 1.1.2",
                        "type": "B",
                        "value": "true"
                    }
                ]
            },
            {
                "name": "LIST 2",
                "type": "LIST",
                "value": [
                    {
                        "name": "Subitem 1.2.1",
                        "type": "U4",
                        "value": "1024"
                    }
                ]
            }
        ]
    }
];

// Convert JSON data to ag-Grid tree data
const agGridData = convertJsonToAgGrid(jsonData);

// Display the converted data
console.log(agGridData);
