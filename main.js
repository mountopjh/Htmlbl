/**
 * main.js
 * 核心交互主流程与生命周期挂载
 */

// 全局应用状态
const AppState = {
    currentTab: 'nav',        // 默认显示精品导航
    currentSearch: '',        // 搜索关键字
    currentCategory: 'all'    // 当前选中的分类
};

// 缓存DOM节点
const DOM = {
    tabBtns: document.querySelectorAll('.tag-pill'),
    searchInput: document.getElementById('searchInput'),
    clearBtn: document.getElementById('clearSearch'),
    catContainer: document.getElementById('categoryContainer')
};

/**
 * 更新内容区，组合分类过滤和文本搜索
 */
function updateContent() {
    // 1. 获取当前激活的标签页数据
    let activeData = DataStore[AppState.currentTab] || [];
    
    // 2. 将数据过一遍搜索词过滤
    activeData = filterDataByKeyword(activeData, AppState.currentSearch);
    
    // 3. 将数据过一遍分类过滤
    activeData = filterDataByCategory(activeData, AppState.currentCategory);
    
    // 4. 根据当前 Tab 调用对应的渲染器
    if (AppState.currentTab === 'nav') {
        renderNav(activeData);
    } else if (AppState.currentTab === 'articles') {
        renderArticles(activeData);
    } else if (AppState.currentTab === 'tools') {
        renderTools(activeData);
    } else if (AppState.currentTab === 'policies') {
        renderPolicies(activeData);
    }
}

/**
 * 切换标签并重新布置分类过滤器
 */
function renderCurrentView() {
    // 渲染该标签下的所有分类并挂载到 DOM
    renderCategories(DataStore.categories[AppState.currentTab]);
    
    // 为动态生成的分类按钮绑定点击事件
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            AppState.currentCategory = e.target.dataset.cat;
            updateContent();
        });
    });

    // 最后触发内容刷新
    updateContent();
}

/**
 * 初始化绑定交互事件
 */
function bindEvents() {
    // 处理顶部导航的点击
    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.target.dataset.tab;
            
            // 要求：再次点击同一标签可回到首页 (重置搜索与过滤)
            if (AppState.currentTab === targetTab) {
                AppState.currentSearch = '';
                AppState.currentCategory = 'all';
                DOM.searchInput.value = '';
                DOM.clearBtn.style.display = 'none';
            } else {
                // 切换到新 Tab 时，重置分类，但保留搜索词，以便多版块联合搜索
                AppState.currentTab = targetTab;
                AppState.currentCategory = 'all';
            }
            
            // 更新导航 active UI
            DOM.tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // 重新刷新视图
            renderCurrentView();
        });
    });

    // 处理搜索输入框
    DOM.searchInput.addEventListener('input', (e) => {
        AppState.currentSearch = e.target.value.trim();
        // 显隐清除按钮
        DOM.clearBtn.style.display = AppState.currentSearch ? 'block' : 'none';
        updateContent();
    });

    // 处理清空按钮
    DOM.clearBtn.addEventListener('click', () => {
        AppState.currentSearch = '';
        DOM.searchInput.value = '';
        DOM.clearBtn.style.display = 'none';
        updateContent();
    });
}

/**
 * 应用入口点
 */
async function startApp() {
    // 等待初始化解析完成所有 Excel 文件
    await initData();
    // 绑定所有的 DOM 交互事件
    bindEvents();
    // 默认展示第一个界面
    renderCurrentView();
}

// 监听浏览器 DOM 内容加载完成事件
window.addEventListener('DOMContentLoaded', startApp);
