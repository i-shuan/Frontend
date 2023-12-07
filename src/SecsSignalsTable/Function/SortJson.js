export function SortJson(jsonObj) {
    if (typeof jsonObj !== 'object' || jsonObj === null) {
      return jsonObj;
    }
  
    // 如果是陣列，對陣列內的物件進行排序
    if (Array.isArray(jsonObj)) {
      return jsonObj
        .map(SortJson) // 遞迴排序陣列內的每個物件
        .sort((a, b) => { // 排序邏輯
          // 根據物件內的 'Name' 或其他屬性排序
          if (a.$ && b.$ && a.$.Name && b.$.Name) {
            return a.$.Name.localeCompare(b.$.Name);
          }
          // 如果沒有 'Name' 可以根據其他屬性排序
          return 0;
        });
    }
  
    // 對物件的鍵值進行排序
    const sortedObj = {};
    Object.keys(jsonObj).sort().forEach(key => {
      sortedObj[key] = SortJson(jsonObj[key]);
    });
  
    return sortedObj;
  }