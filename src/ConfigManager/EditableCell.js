import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, Input, useForm } from "antd";

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  rowIndex,
  record,
  handleSave,
  ...restProps
}) => {
  // console.log("record", record)
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    console.log("dataIndex", dataIndex)
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      
      console.log("values", values)
     
      toggleEdit();
       
      handleSave(record, values);
   
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  


  let childNode = children;
  if (editable) {
    if (editing) {
      console.log("dataIndex", dataIndex)
      childNode = (
        <Form form={form}>
          <Form.Item
            style={{
              margin: 0
            }}
            name={dataIndex}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        </Form>
      );
    } else {
      // console.log("childNode", childNode)
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
            minHeight: 20,
            minWidth: 20,
            display: 'inline-block'
          }}
          onClick={toggleEdit}
        >
          {children || "(Empty)"}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;

