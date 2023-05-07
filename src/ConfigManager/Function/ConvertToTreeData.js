/* Convert Json to TreeData */
export const ConvertToTreeData = (obj, columnDef, parentKey = null) => {

    return Object.entries(obj).map(([key, objValue], index) => {
      const isLeaf =
        typeof objValue !== "object" ||
        (objValue.xpath && !objValue.children) ||
        objValue.xpath === "";
      const title = isLeaf ? objValue.name || key : objValue.xpath || key;
  
      const item = {
        key: parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`,
      };
  
      columnDef.forEach(column => {
        if(column.name==="xpath"){
            item[column.name]=title
        }
        else if(column.name==="originalValue"){
            /* add orignal Data for user Edit*/
            item[column.name]= objValue["value"]
        }
        else{
            item[column.name] = objValue[column.name]??"";
        }
      });
  
      if (!isLeaf) {
        item.children = ConvertToTreeData(objValue, columnDef, item.key);
      }
  
      return item;
    });
  };
  
