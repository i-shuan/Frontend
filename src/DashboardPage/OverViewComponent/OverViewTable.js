import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Table, Input } from "antd";
import { VList } from "virtuallist-antd";
const pageSize = 10;

   

const generateData = (count) => {
    const data = [];
    data.push({ id: 0, name: 'initial', action:'initial', email:'initial'});
    for (let i = 1; i <= count; i++) {
      data.push({ id: i, name: `Name ${i}`});
    }
    return data;
  };
  
const dataFromJSON = generateData(20);

const renderData = (start, end, filter="") => {
    const data = [];
    let filteredData = dataFromJSON.filter((record) =>
        record?.key===0||record?.name?.toLowerCase().includes(filter?.toLowerCase())
    );
    console.log("filteredData", filteredData)
    for (let i = start; i <= end && i + end <= filteredData.length; i++) {
       
      const record = filteredData[i - 1];
      data.push({
        key: i,
        id: record.id,
        name: record.name,
        action: record.action,
        email: record.email,
      });
    }
    return data;
  };



const OverViewTable = () => {

    const [dataSource, setDataSource] = useState(renderData(1, pageSize));
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");
    
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        width: 100
      },
      {
        title: "Name",
        dataIndex: "name",
        width: 200,
        render: (text, record) => {
          return record.name === "initial" ? (
            <Input
              placeholder="Filter Name"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            />
          ) : (
            text
          );
        }
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 200
      },
      {
        title: "Email",
        dataIndex: "email",
        width: 300
      }
    ];
    
    const handleReachEnd = useCallback(() => {
      
      if(filter===""){
        setLoading(true);
        console.log("Reached end");
        const newStart = dataSource.length + 1;
        const newEnd = newStart + pageSize - 1;
        const newData = renderData(newStart, newEnd, filter);
        setDataSource(prev => [...prev, ...newData]);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
      }
    }, [dataSource]);
  
    const vc = useMemo(() => {
      return VList({
        height: "15rem",
        onReachEnd: handleReachEnd
      });
    }, [handleReachEnd]);
  
    const handleFilterChange = (value) => {
        setFilter(value);
    };

    useEffect(()=>{

        if(filter){
            setDataSource(renderData(0, dataFromJSON, filter));
        }    
    },[filter])
  
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={false}
        loading={loading}
        scroll={{ y: "12rem" }}
        components={vc}
      />
    );
  };

export default OverViewTable;
