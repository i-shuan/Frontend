
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
import { convertJsonToAgGrid } from "./ConvertJsonToAgGrid";
import { updateNodeType, addRowNode, removeSelectedNodes } from './NodeOperations';
import { collectNodeData, pasteNode, flattenNodes } from './GridUtils';
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);


// Example data from Ant Design
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

const GridExample = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState(convertJsonToAgGrid(jsonData));
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
      editable: params => params.data.type !== 'LIST', // 只有當 type 不是 'LIST' 時，value 欄位可編輯
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
    if (event.column.colId === 'type') {
      console.log(`Type changed for row ${event.data.key} to ${event.newValue}`);
      const getChangeTypeData = updateNodeType(rowData, event.data.key, event.newValue);
      setRowData(getChangeTypeData);
    }
  }, [rowData, setRowData]);


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