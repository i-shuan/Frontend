import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { updateNodeType, addRowNode, removeSelectedNodes } from './NodeOperations';
import { collectNodeData, pasteNode, flattenNodes } from './GridUtils';

const testData = [
  { id: 1, name: "Item 1", type: "A", value: "Value 1", orgHierarchy: ["Item 1"] },
  { id: 2, name: "Item 2", type: "B", value: "Value 2", orgHierarchy: ["Item 2"] }
];

const GridExample = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState(testData);
  const [clipboard, setClipboard] = useState(null);

  useEffect(() => {
    console.log("rowData", rowData);
  }, [rowData]);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Name",
    field: "name",
    cellRenderer: 'agGroupCellRenderer',
    editable: true,
    cellEditor: "agTextCellEditor",
    filter: true,
    cellRendererParams: {
      suppressCount: false,
      checkbox: true,
      innerRenderer: (params) => params.value
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
        values: ['LIST', 'A', 'U8', 'U4', "I4"]
      }
    },
    {
      field: "value",
      headerName: "Value",
      editable: params => params.data.type !== 'LIST',
      cellEditor: "agTextCellEditor"
    }
  ], []);

  const gridOptions = useMemo(() => ({
    singleClickEdit: true,
    stopEditingWhenGridLosesFocus: true,
    enableFilter: true,
  }), []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    filter: true,
    floatingFilter: true,
  }), []);

  const getDataPath = useCallback((data) => data.orgHierarchy, []);

  const getRowId = useCallback((params) => params.data.id, []);

  const onCellValueChanged = useCallback((event) => {
    if (event.column.colId === 'type') {
      console.log(`Type changed for row ${event.data.key} to ${event.newValue}`);
      const updatedData = updateNodeType(rowData, event.data.key, event.newValue);
      setRowData(updatedData);
    }
  }, [rowData]);

  const onGridReady = useCallback((params) => {
    gridRef.current = params.api;
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <div>
        <button onClick={() => addRowNode(gridRef.current.getSelectedNodes()[0], rowData, setRowData)}>
          Add Row to 'New Folder'
        </button>
        <button onClick={() => removeSelectedNodes(gridRef.current.getSelectedNodes()[0], rowData, setRowData)}>
          Remove Selected
        </button>
        <button onClick={() => {
          const selectedNodes = gridRef.current.getSelectedNodes();
          const copyData = selectedNodes.map(node => collectNodeData(node));
          setClipboard(copyData);
        }}>Copy Selected</button>
        <button onClick={() => {
          const selectedNode = gridRef.current.getSelectedNodes()[0];
          if (clipboard && selectedNode) {
            const newNodes = clipboard.map(node => pasteNode(node, selectedNode.data.orgHierarchy));
            const flatNewNodes = flattenNodes(newNodes);
            setRowData([...rowData, ...flatNewNodes]);
          }
        }}>Paste Row</button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
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
          onCellValueChanged={onCellValueChanged}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default GridExample;
