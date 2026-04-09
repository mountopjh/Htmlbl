/**
 * data.js
 * 负责通过 Fetch 读取这四个 Excel 文件并转为内存中对象。
 */

// 统一数据状态管理
const DataStore = {
    // 原始数据队列
    nav: [],
    articles: [],
    tools: [],
    policies: [],
    
    // 去重分类保存集合
    categories: {
        nav: new Set(),
        articles: new Set(),
        tools: new Set(),
        policies: new Set()
    }
};

/**
 * 辅助函数：读取单一本地 Excel 
 * @param {string} filename 文件名
 * @returns {Promise<Array>} 转换后的对象数组
 */
async function loadExcelFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            console.warn(`未找到或无法加载 ${filename}，状态码: ${response.status}`);
            return [];
        }
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        // 依赖 SheetJS 全局对象 XLSX
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 取第一张表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 转为 JSON 数组对象
        return XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // 填充空字符串避免 undefined
    } catch (error) {
        console.error(`解析 ${filename} 失败:`, error);
        // 如果是直接双击打开的HTML，给予明确的提示
        if (window.location.protocol === 'file:' && !window.hasAlertedFileIssue) {
            alert('本地测试受限：\n浏览器安全策略禁止直接双击 HTML 读取本地 Excel 文件。\n\n解决办法：\n1. 请使用 VSCode 的 Live Server 插件打开。\n2. 或者部署到 Cloudflare Pages 后就会完全正常。');
            window.hasAlertedFileIssue = true;
        }
        return [];
    }
}

/**
 * 初始化所有数据，收集分类
 */
async function initData() {
    const [nav, articles, tools, policies] = await Promise.all([
        loadExcelFile('nav.xlsx'),
        loadExcelFile('articles.xlsx'),
        loadExcelFile('tools.xlsx'),
        loadExcelFile('policies.xlsx')
    ]);

    DataStore.nav = nav;
    DataStore.articles = articles;
    DataStore.tools = tools;
    DataStore.policies = policies;

    // 提取存在的分类（过滤空值）
    const extractCategories = (data, set) => {
        data.forEach(item => {
            const cat = item['分类'];
            if (cat && cat.trim() !== '') {
                set.add(cat.trim());
            }
        });
    };

    extractCategories(DataStore.nav, DataStore.categories.nav);
    extractCategories(DataStore.articles, DataStore.categories.articles);
    extractCategories(DataStore.tools, DataStore.categories.tools);
    extractCategories(DataStore.policies, DataStore.categories.policies);

    // 对于政策做单独的加工，按年份降序排列
    DataStore.policies.sort((a, b) => {
        const yA = parseInt(a['年份']) || 0;
        const yB = parseInt(b['年份']) || 0;
        return yB - yA;
    });
}
