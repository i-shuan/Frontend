
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { v4 as uuidv4 } from 'uuid';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);


export const getData = () => {
  return [
    {
      id: 1,
      name: "LIST",
      type: "LIST",
      value: "",
      children: [
        {
          id: 2,
          name: "Module 1",
          type: "A",
          value: "ASXSA",
          children: [
            {
              id: 3,
              name: "Submodule 1.1",
              type: "U8",
              value: "111"
            },
            {
              id: 4,
              name: "Submodule 1.2",
              type: "U8",
              value: "777"
            }
          ]
        }
      ]
    }
  ];
};

function convertData(nodes, path = []) {
  let result = [];

  nodes.forEach(node => {
    const currentPath = [...path, node.name]; // 累积当前的路径
    const newNode = {
      id: node.id,
      filePath: currentPath,
      type: node.type,
      value: node.value
    };

    result.push(newNode); // 将当前节点加入结果数组

    // 如果当前节点有子节点，递归处理
    if (node.children && node.children.length) {
      const children = convertData(node.children, currentPath);
      result = result.concat(children); // 将处理后的子节点结果合并到当前结果中
    }
  });

  return result;
}


const GridExample = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState(convertData(getData()));
  const [clipboard, setClipboard] = useState(null);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "name",
    minWidth: 330,
    cellRendererParams: {
      checkbox: true,
      suppressCount: true
    },
  }), []);

  const columnDefs = useMemo(() => [
    {
      field: "type",
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['tool', 'A', 'U8'] // 这里可以根据实际需要调整选项
      }
    },
    {
      field: "value",
      editable: true
    }
  ], []);


  //add
  const addNewRowToGroup = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedNode = selectedNodes.length ? selectedNodes[0] : null;

    if (!selectedNode) {
      console.warn("No node selected!");
      return;
    }

    const filePath = selectedNode.data.filePath.slice(); // 複製陣列以避免直接修改原始資料
    const isLeaf = selectedNode.leaf; // 檢查是否為葉節點

    // 如果是葉節點，添加到父節點下；如果是目錄，直接添加到該目錄下
    if (isLeaf) {
      filePath.pop(); // 移除最後一個元素（檔案名）
    }
    filePath.push(`New Folder-${uuidv4()}`); // 添加新目錄或檔案

    const newRow = {
      id: uuidv4(),
      filePath: filePath,
      dateModified: new Date().toLocaleString(),
      size: Math.random() * 100,
    };
    setRowData(prevRowData => [...prevRowData, newRow]);
  }, []);



  /** remove  */
  const removeSelected = useCallback(() => {
    const selectedNode = gridRef.current.api.getSelectedNodes()[0]; // single selection
    if (!selectedNode) {
      console.warn("No nodes selected!");
      return;
    }
    gridRef.current.api.applyTransaction({
      remove: getRowsToRemove(selectedNode),
    });
  }, []);

  function getRowsToRemove(node) {
    var res = [];
    const children = node.childrenAfterGroup || [];
    for (var i = 0; i < children.length; i++) {
      res = res.concat(getRowsToRemove(children[i]));
    }
    // ignore nodes that have no data, i.e. 'filler groups'
    return node.data ? res.concat([node.data]) : res;
  }

  /** Copy row */
  const copyRow = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (!selectedNodes.length) {
      console.warn("No nodes selected!");
      return;
    }

    const copyData = selectedNodes.map(node => collectNodeData(node));
    setClipboard(copyData);
  }, []);

  function collectNodeData(node) {
    if (!node.data) return null;  // 添加這行來確保節點有數據
    return {
      data: { ...node.data },
      children: node.childrenAfterGroup ? node.childrenAfterGroup.map(collectNodeData).filter(child => child !== null) : []
    };
  }



  const pasteRow = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedNode = selectedNodes.length ? selectedNodes[0] : null;

    if (!clipboard || !selectedNode) {
      console.warn("No data to paste or no node selected!");
      return;
    }

    clipboard.forEach(node => {
      pasteNode(node, selectedNode.data.filePath.slice());
    });

    setRowData(prevRowData => [...prevRowData, ...flattenNodes(clipboard, selectedNode.data.filePath.slice())]);
  }, [clipboard]);

  function pasteNode(node, path) {
    if (!node || !node.data) return; // 確保節點和數據都存在

    const newFilePath = [...path, `${node.data.filePath[node.data.filePath.length - 1]}-${uuidv4()}`];

    console.log("newFilePath", newFilePath)
    node.data = { ...node.data, filePath: newFilePath, id: uuidv4() };
    if (node.children) {
      node.children.forEach(child => pasteNode(child, newFilePath));
    }
  }

  function flattenNodes(nodes, path) {
    let result = [];
    nodes.forEach(node => {
      if (!node || !node.data) return; // 確保節點和數據都存在

      const newFilePath = [...path, `${node.data.filePath[node.data.filePath.length - 1]}-${uuidv4()}`];
      result.push({
        ...node.data,
        filePath: newFilePath
      });
      result = result.concat(flattenNodes(node.children, newFilePath));
    });
    return result;
  }


  const getDataPath = useCallback((data) => {
    return data.filePath;
  }, []);

  const getRowId = useCallback((params) => {
    return params.data.id;
  }, []);

  const gridOptions = useMemo(() => ({
    singleClickEdit: true,  // 单击即编辑，或使用 doubleClickEdit: true
    stopEditingWhenGridLosesFocus: true // 当点击网格外部时停止编辑
  }), []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <div>
        <button onClick={addNewRowToGroup}>
          Add Row to 'New Folder'
        </button>
        <button onClick={removeSelected}>Remove Selected</button>
        <button onClick={copyRow}>Copy Selected</button>
        <button onClick={pasteRow}>Paste Row</button>
      </div>
      <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1 }}
          treeData
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          autoGroupColumnDef={autoGroupColumnDef}
          gridOptions={gridOptions}
        />
      </div>
    </div>
  );
};

export default GridExample