
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { v4 as uuidv4 } from 'uuid';
import { convertToAntdTreeData } from "./ConvertToAntdTreeData";
import { convertToAgGrid } from "./ConvertToAgGrid";
import { updateNodeType, addRowNode, removeSelectedNodes } from './NodeOperations';
import { collectNodeData, pasteNode, flattenNodes } from './GridUtils';
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);


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

const GridExample = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState(convertToAgGrid(antdData));
  const [clipboard, setClipboard] = useState(null);

  useEffect(() => {
    console.log("rowData", rowData)
  }, [rowData])

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Name",
    field: "name",
    cellRenderer: 'agGroupCellRenderer',
    editable: true,
    cellEditor: "agTextCellEditor",
    filter: true, // 若需要对分组列也进行筛选，可以启用
    cellRendererParams: {
      suppressCount: false, // 显示分组计数
      checkbox: true,
      innerRenderer: (params) => {
        return params.value;
      }
    },
    minWidth: 330
  }), []);




  const columnDefs = useMemo(() => [
    {
      field: "type",
      headerName: "Type",
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['LIST', 'A', 'U8', 'U4', "I4"] // 可以根据需要调整选项
      }
    },
    {
      field: "value",
      headerName: "Value",
      editable: true,
      cellEditor: "agTextCellEditor" // 如果 value 是文本类型则使用 text editor，否则根据数据类型选择合适的 editor
    }
  ], []);


  const gridOptions = useMemo(() => ({
    singleClickEdit: true,
    stopEditingWhenGridLosesFocus: true,
    enableFilter: true,  // 全局启用筛选
  }), []);


  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      floatingFilter: true,
    };
  }, []);


  const getDataPath = useCallback((data) => {
    return data.orgHierarchy;
  }, []);

  const getRowId = useCallback((params) => {
    return params.data.id;
  }, []);

  const onCellValueChanged = useCallback((event) => {
    // 检查是否是 'type' 字段发生了变更
    if (event.column.colId === 'type') {
      console.log(`Type changed for row ${event.data.key} to ${event.newValue}`);

      // 根据新的类型值更新行
      // 比如，可以在这里调用更新行数据的逻辑，或者是触发外部的 API 调用等
      updateNodeType(event.data.key, event.newValue); // 假设有一个 updateRow 方法
    }
  }, []);


  return (
    <div style={{ width: "100%", height: "500px" }}>
         <div>
        <button onClick={() => addRowNode(gridRef.current.api.getSelectedNodes()[0], rowData, setRowData)}>
          Add Row to 'New Folder'
        </button>
        <button onClick={() => removeSelectedNodes(gridRef.current.api.getSelectedNodes()[0], rowData, setRowData)}>
          Remove Selected
        </button>
        <button onClick={() => {
          const selectedNodes = gridRef.current.api.getSelectedNodes();
          const copyData = selectedNodes.map(node => collectNodeData(node));
          setClipboard(copyData);
        }}>Copy Selected</button>
        <button onClick={() => {
          const selectedNode = gridRef.current.api.getSelectedNodes()[0];
          if (clipboard && selectedNode) {
            const newNodes = clipboard.map(node => pasteNode(node, selectedNode.data.orgHierarchy));
            const flatNewNodes = flattenNodes(newNodes);
            setRowData([...rowData, ...flatNewNodes]);
          }
        }}>Paste Row</button>
      </div>
      <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          treeData
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          autoGroupColumnDef={autoGroupColumnDef}
          gridOptions={gridOptions}
          onCellValueChanged={onCellValueChanged} // 在這裡設置 onCellValueChanged
        />
      </div>
  
    </div>
  );
};

export default GridExample