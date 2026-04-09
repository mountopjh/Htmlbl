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
            return String(val).toLowerCase().includes(lowerKey);
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
