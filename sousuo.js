/**
 * search.js
 * 负责全局的数据搜索过滤与分类筛选
 */

/**
 * 通用模糊匹配函数
 * 将对象的每个 value 转为字符串，进行子串匹配
 */
function filterDataByKeyword(data, keyword) {
    if (!keyword) return data;
    const lowerKey = keyword.toLowerCase();
    
    return data.filter(item => {
        // 提取并拼接对象中所有的值进行检索
        return Object.values(item).some(val => {
            if (val === null || val === undefined) return false;
            const strVal = String(val);
            if (strVal.toLowerCase().includes(lowerKey)) return true;
            // 如果引入了并存在拼音匹配库，则通过拼音匹配搜索
            if (typeof PinyinMatch !== 'undefined' && PinyinMatch.match(strVal, keyword)) {
                return true;
            }
            return false;
        });
    });
}

/**
 * 基于所选分类进行精准筛选
 */
function filterDataByCategory(data, category) {
    if (!category || category === 'all') return data;
    return data.filter(item => item['分类'] === category);
}
