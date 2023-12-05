import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { xml } from '@codemirror/lang-xml';
import { basicSetup } from 'codemirror';
import { Builder, parseString } from 'xml2js';
import { Card, Radio } from 'antd';
import diff from 'deep-diff';  // 引入 deep-diff
// 在 XmlEditor.js 文件中
import { Debounce } from './Function/Debounce';

// 定義 JSON 範例
// 定義 JSON 範例
const jsonExamples = {
  example1: {
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
          "Bundle": [
            {
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
            },
            {
              "$": {
                "Name": "AnotherBundle.dll",
                "Active": "Y"
              },
              "DelverTx": {
                "$": {
                  "Time": "20231205"
                },
                "_": "Y"
              }
            }
          ]
        }
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

const XmlEditor = () => {

  const initialXmlContents = Object.keys(jsonExamples).reduce((contents, key) => {
    contents[key] = '';
    return contents;
  }, {});
  // const initialXmlContents = {...jsonExamples}
  const defaultKey = Object.keys(jsonExamples)[0];

  const editorDiv = useRef(null);
  const [editorView, setEditorView] = useState(null); // 儲存 EditorView 實例
  const [selectedXml, setSelectedXml] = useState(defaultKey);
  const [xmlContents, setXmlContents] = useState(initialXmlContents);
  const [isSubmit, setIsSubmit] = useState(false);
  // console.log("[--------]xmlContents:", xmlContents)

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
  // ver 
  // useEffect(() => {
  //   if (editorDiv.current) {
  //     const initialContent = jsonExamples[selectedXml]
  //       ? convertJsonToXml(jsonExamples[selectedXml])
  //       : ''; // 確保初始內容非空
  //     setXmlContents(contents => ({ ...contents, [selectedXml]: initialContent }));

  //     const startState = EditorState.create({
  //       doc: initialContent,
  //       extensions: [basicSetup, xml(), keymap.of([])],
  //     });

  //     const view = new EditorView({
  //       state: startState,
  //       parent: editorDiv.current,
  //     });

  //     setEditorView(view);
  //     return () => view.destroy();
  //   }
  // }, []); // if fetch from data , dependancy need set data

  useEffect(() => {
    if (editorDiv.current && !editorView) {
      // 使用自定義的 Debounce 函數來創建一個 debounced 函數
      // const initialContent = jsonExamples[selectedXml]
      //   ? convertJsonToXml(jsonExamples[selectedXml])
      //   : ''; // 確保初始內容非空
      // setXmlContents(contents => ({ ...contents, [selectedXml]: initialContent }));

      const debouncedSetXmlContents = Debounce((newXml) => {
        setXmlContents(prev => ({
          ...prev,
          [selectedXml]: newXml,
        }));
      }, 10); // 這裡設置300毫秒的延遲

      const updateView = new EditorView({
        state: EditorState.create({
          doc: convertJsonToXml(jsonExamples[selectedXml]),
          extensions: [
            basicSetup,
            xml(),
            keymap.of([]),
            // EditorView.updateListener.of(update => {
            //   if (update.docChanged) {
            //     // 如果文檔發生了變化，我們將調用 debounced 函數
               
            //       const newXml = update.state.doc.toString();
            //       console.log("newXml", newXml)
            //       debouncedSetXmlContents(newXml);
                
            //   }
            // })
          ],
        }),
        parent: editorDiv.current,
      });

      setEditorView(updateView);
      return () => {
        updateView.destroy();
        // 清理函數，確保取消掉還沒有執行的 debounced 函數
        if (debouncedSetXmlContents.cancel) debouncedSetXmlContents.cancel();
      };
    }
  }, []);



  // const handleRadioChange = (e) => {
  //   const newSelectedXml = e.target.value;
  //   if (editorView) {
  //     // 保存当前编辑器内容
  //     const currentContent = editorView.state.doc.toString();
  //     console.log("[handleRadioChange] currentContent", currentContent, "last:", selectedXml, "current:",newSelectedXml)
  //     setXmlContents(prevContents => ({
  //       ...prevContents,
  //       [selectedXml]: currentContent
  //     }));

  //     // 设置新的选中的XML
  //     setSelectedXml(newSelectedXml);
  //     var newContent= xmlContents[newSelectedXml];
  //     if(!newContent){
  //       var newContent = convertJsonToXml(jsonExamples[newSelectedXml]);
  //     }
  //     editorView.dispatch({
  //       changes: { from: 0, to: editorView.state.doc.length, insert: newContent }
  //     });
  //   }
  // };

  const handleRadioChange = (e) => {
    const newSelectedXml = e.target.value;
    if (editorView) {
      // 保存当前编辑器内容
      
      const currentContent = editorView.state.doc.toString();
      setXmlContents(prevContents => ({
        ...prevContents,
        [selectedXml]: currentContent
      }));

      // 设置新的选中的XML
      setSelectedXml(newSelectedXml);
    }
  };

  
  useEffect(() => {
    if (editorView) {
     
      if (xmlContents && selectedXml in jsonExamples) {
        var newContent = xmlContents[selectedXml];
        if (!newContent) {
          newContent = convertJsonToXml(jsonExamples[selectedXml]);
        }
        editorView.dispatch({
          changes: { from: 0, to: editorView.state.doc.length, insert: newContent }
        });
      }
    
    }
  }, [selectedXml]);


  const removeEmptyValues = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        removeEmptyValues(obj[key]); // 递归清理
      } else if (typeof obj[key] === 'string') {
        // 删除字符串中的所有空白字符
        obj[key] = obj[key].replace(/\s+/g, '');
      }
    }
  };


  const parseXmlToJson = async (xmlString) => {
    return new Promise((resolve, reject) => {
      parseString(xmlString, {
        explicitArray: false,
        trim: true, // 这将去除文本节点中的空白字符
        normalize: true, // 这将把多个空白字符转换成一个空格
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          removeEmptyValues(result); // 清理空白字符
          resolve(result);
        }
      });
    });
  };

  // 比對兩個 JSON 物件
  const compareJson = (originalJson, newJson) => {
    return diff(originalJson, newJson);
  };

  useEffect(() => {
    const compareXmlContents = async () => {
      for (const key in jsonExamples) {
        // 这里我们使用已保存的 XML 内容进行比较
        const xmlToCompare = xmlContents[key] || '';
        const jsonFromXml = await parseXmlToJson(xmlToCompare);
        const differences = compareJson(jsonExamples[key], jsonFromXml);
  
        console.log(`Differences for ${key}:`, differences || 'No changes');
      }
    };
  
    if (isSubmit) {
      compareXmlContents();
      setIsSubmit(false);
    }
  }, [xmlContents, isSubmit]);
  


  const handleSubmit = async () => {
    // 确保编辑器内容已更新到状态中
    const currentContent = editorView.state.doc.toString();
    setXmlContents(prev => ({ ...prev, [selectedXml]: currentContent }));
    setIsSubmit(true);
    // // 等待状态更新
    // await new Promise(resolve => setTimeout(resolve, 0));

    // 对每个 xmlContents 中的 XML 进行比较
    // for (const key in jsonExamples) {
    //   // 这里我们使用已保存的 XML 内容进行比较
    //   const xmlToCompare = xmlContents[key] || '';
    //   const jsonFromXml = await parseXmlToJson(xmlToCompare);
    //   const differences = compareJson(jsonExamples[key], jsonFromXml);

    //   console.log(`Differences for ${key}:`, differences || 'No changes');
    // }
  };



  return (
    <div>
      <Radio.Group onChange={handleRadioChange} value={selectedXml}>
        <Radio value="example1">範例 1</Radio>
        <Radio value="example2">範例 2</Radio>
        <Radio value="example3">範例 3</Radio>
      </Radio.Group>
      <Card style={{ overflow: 'auto', height: '400px', background: 'transparent' }}>
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
