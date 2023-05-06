const ConvertDataStructure = (configData) => {
    return configData.data.reduce((acc, obj) => {
      //split xpath to Array
      const levels = obj.xpath.split("/").filter((level) => level !== "");
  
      //這部分都是處理同一組/////////////////
      let currLevel = acc;
      levels.forEach((level) => {
        if (!currLevel[level]) {
          currLevel[level] = {};
        }
        currLevel = currLevel[level];
      });
  
      currLevel[obj.name] = {
        xpath: obj.xpath,
        attribute: obj.attribute,
        value: obj.value,
      };
      ///////////////////////////////
      return acc;
    }, {});
  };
  
  export default ConvertDataStructure;
  