import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Table, Input } from "antd";
import { VList, scrollTo} from "virtuallist-antd";
const pageSize = 50;


const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 300,
    }
];

const generateData = (count) => {
  const data = [];
  data.push({ id: 0, name: "initial", action: "initial", email: "initial" });
  for (let i = 1; i <= count; i++) {
    data.push({ id: i, name: `Name ${i}` });
  }
  return data;
};

const dataFromJSON = generateData(150);


const OverViewTable = () => {

  const [lazyDataSource, setLazyDataSource] = useState(dataFromJSON.slice(0, pageSize));
  const [filterDataSource, setFilterDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [currentStart, setCurrentStart] = useState(0);
  console.log("currentStart", currentStart)
  const renderedColumns = columns.map((column) => {
    const { title, dataIndex, width} = column;
  
    return {
      title,
      dataIndex,
      width,
      render: (text, record) => {
        return record[dataIndex] === "initial" ? (
          <Input
            placeholder={`Filter ${title}`}
            value={filter[dataIndex]}
            onChange={(e) => handleFilterChange(dataIndex, e.target.value)}
          />
        ) : (
          text
        );
      }
    };
  });

  const shouldLoadMoreData = () => {
    if (Object.values(filter).every((value) => value === "") ) {
      return true;
    }
    return false;
  };

  const handleReachEnd = useCallback(() => {

    if (shouldLoadMoreData() && lazyDataSource.length < dataFromJSON.length ) {
        
        setLoading(true);       
        
        // const newStart = currentStart+pageSize; 
        // console.log("currentStart:", currentStart, "newStart:", newStart)
        // setCurrentStart(newStart);      

        // const newEnd = Math.min(newStart + pageSize, dataFromJSON.length);     
        // const newData = dataFromJSON.slice(newStart, newEnd);
        // console.log("newStart", newStart, "newEnd", newEnd)
        // setLazyDataSource((prev) => [...prev, ...newData]);
           setLazyDataSource((pre) => {
            const temp = dataFromJSON.slice(pre.length, pre.length + pageSize);
            return [...pre, ...temp];
          });
        
        setTimeout(() => {
            // scrollTo({ row: newStart})  
            setLoading(false);         

        }, 1000);

       
    }
  }, []);

  const vc = useMemo(() => {
    return VList({
      height: "15rem",
      onReachEnd: handleReachEnd,
      resetTopWhenDataChange: false // 在更新時保留目前捲軸位置
    });
  }, [handleReachEnd]);

  const handleFilterChange = (key, value) => {

      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
  };

  useEffect(() => {

    if(!shouldLoadMoreData()){
        const filteredData = dataFromJSON.filter((record) =>
            record?.id === 0 || record?.name?.toLowerCase().includes(filter?.name?.toLowerCase())
        );
        setCurrentStart(0);
        setFilterDataSource(filteredData);
    }
    else{
        setFilterDataSource(null);
        setLazyDataSource(lazyDataSource);
    }

  }, [filter]);

  return (
    <Table
      columns={renderedColumns}
      dataSource={filterDataSource?filterDataSource:lazyDataSource}
      rowKey="id"
      pagination={false}
      loading={loading}
      scroll={{ y: "12rem" }}
      components={vc}
    />
  );
};

export default OverViewTable;
