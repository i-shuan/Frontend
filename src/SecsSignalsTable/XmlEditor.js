import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { xml } from '@codemirror/lang-xml';
import { basicSetup } from 'codemirror';
import { Builder, parseString } from 'xml2js';
import { Card, Radio } from 'antd';

function XmlEditor() {
  const editorDiv = useRef(null);
  const [editorView, setEditorView] = useState(null); // 儲存 EditorView 實例
  const [selectedXml, setSelectedXml] = useState('example1');
  const [xmlContents, setXmlContents] = useState({ example1: '', example2: '', example3: '' });
  const obj = {
    "root": {
      "level3": {
        "$": {
          "attr": "123",
          "attr1": "value1"
        },
        "_": "Y"
      },
      "level4": {
        "$": {
          "attr": "456",
          "attr1": "value2",
          "attr2": "value3"
        },
        "_": "N"
      },
      "level5": {
        "$": {
          "attr": "456",
          "attr1": "value2",
          "attr2": "value3"
        },
        "_": "Y"
      },
      "level6": {
        "$": {
          "attr": "456",
          "attr1": "value2",
          "attr2": "value3"
        },
        "_": "N"
      },
      "BundleManifest": {
        "Bundles": {
          "Bundle": {
            "$": {
              "Name": "PrepareEarthquake.dll",
              "Active": "Y"
            },
            "DelverTx": {
              "$": {
                "Time": "123"
              },
              "_": "Y"
            }
          }
        }
      }
    }
  }
  
  // 定義 JSON 範例
// 定義 JSON 範例
const jsonExamples = {
    example1: {
      root: {
        level3: {
          $: { attr: "123", attr1: "value1" },
          _: "Y"
        },
        level4: {
          $: { attr: "456", attr1: "value2", attr2: "value3" },
          _: "N"
        }
      }
    },
    example2: {
      company: {
        employee: {
          $: { id: "1001", department: "development" },
          name: { _: "John Doe" },
          position: { _: "Software Engineer" }
        },
        location: {
          $: { country: "USA" },
          address: { _: "1234 Some St, Some City, Some State" }
        }
      }
    },
    example3: {
      library: {
        book: [
          {
            $: { isbn: "12345" },
            title: { _: "The Art of Programming" },
            author: { _: "Jane Smith" },
            price: { _: "$39.99" }
          },
          {
            $: { isbn: "67890" },
            title: { _: "Data Structures and Algorithms" },
            author: { _: "John Doe" },
            price: { _: "$29.99" }
          }
        ],
        location: {
          $: { room: "4A", shelf: "12B" },
          _: "Main Campus Library"
        }
      }
    }
  };
  
  
  

  const initialJson = JSON.stringify(obj);

  const convertJsonToXml = (json) => {
    try {
    //   const jsonObj = JSON.parse(json);
      // xml2js Builder的配置
      const builder = new Builder({
        renderOpts: { 'pretty': true },
        xmldec: { 'standalone': true, 'version': '1.0', 'encoding': 'UTF-8' }
      });
      return builder.buildObject(json);
    } catch (err) {
      console.error("Error in converting JSON to XML:", err);
      return '';
    }
  };

  useEffect(() => {
    if (editorDiv.current) {
      const initialContent = convertJsonToXml(jsonExamples[selectedXml]);
      setXmlContents(contents => ({ ...contents, [selectedXml]: initialContent }));

      const startState = EditorState.create({
        doc: initialContent,
        extensions: [basicSetup, xml(), keymap.of([])],
      });

      const view = new EditorView({
        state: startState,
        parent: editorDiv.current,
      });

      setEditorView(view);
      return () => view.destroy();
    }
  }, []); // if fetch from data , dependancy need set data

  const handleRadioChange = (e) => {
    const newSelectedXml = e.target.value;
    // 儲存當前 XML 內容到狀態
    const currentContent = editorView.state.doc.toString();
    setXmlContents(contents => ({ ...contents, [selectedXml]: currentContent }));

    // 加載新選擇的 XML 內容
    const newContent = xmlContents[newSelectedXml] || convertJsonToXml(jsonExamples[newSelectedXml]);
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: newContent }
    });

    setSelectedXml(newSelectedXml);
  };

  const handleSubmit = () => {
    // 儲存當前 XML 內容到狀態
    const currentContent = editorView.state.doc.toString();
    setXmlContents(contents => ({ ...contents, [selectedXml]: currentContent }));

    // 處理所有儲存的 XML 內容
    Object.entries(xmlContents).forEach(([key, value]) => {
      parseString(value, (err, result) => {
        if (err) {
          console.error(`Error in converting XML to JSON for ${key}:`, err);
        } else {
          console.log(`Converted JSON for ${key}:`, JSON.stringify(result, null, 2));
        }
      });
    });
  };


  return (
    <div>
    <Radio.Group onChange={handleRadioChange} value={selectedXml}>
        <Radio value="example1">範例 1</Radio>
        <Radio value="example2">範例 2</Radio>
        <Radio value="example3">範例 3</Radio>
    </Radio.Group>    
    <Card style={{ overflow: 'auto', height: '400px', background: 'transparent'}}>
      <div 
        ref={editorDiv}
        style={{ 
          height: '400px',
          border: '1px solid #ccc',
          marginBottom: '10px',
          textAlign: 'left'
        }}
      />
    </Card>  
    <button
        onClick={handleSubmit} // 當點擊時觸發轉換功能
        style={{ display: 'block' }}
      >
        Submit
      </button>
    </div>
  );
}

export default XmlEditor;
