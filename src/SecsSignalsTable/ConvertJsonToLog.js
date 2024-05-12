
import React from 'react';
import { ConvertLog } from './Function/ConvertLog';
const data = [{
    name: "Main List",
    type: "LIST",
    value: [
        {
            name: "Boolean Item",
            type: "B",
            value: "2"
        },
        {
            name: "Sub List 1",
            type: "LIST",
            value: [
                {
                    name: "String Item",
                    type: "A",
                    value: "ABCD"
                },
                {
                    name: "Nested List",
                    type: "LIST",
                    value: [
                        {
                            name: "Deeply Nested String",
                            type: "A",
                            value: "Nested"
                        },
                        {
                            name: "Another Boolean",
                            type: "B",
                            value: "1"
                        }
                    ]
                }
            ]
        },
        {
            name: "Another Boolean",
            type: "B",
            value: "1"
        },
        {
            name: "Sub List 2",
            type: "LIST",
            value: [
                {
                    name: "Another String",
                    type: "A",
                    value: "EFGH"
                }
            ]
        }
    ]
}];


const ConvertJsonToLog = () => {


    return(
        <div style={{ textAlign: 'left' }}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{ConvertLog(data)}</p>
        </div>
    ) 
}

export default ConvertJsonToLog