/**
 * render.js
 * 负责通过读入的数据构建 DOM
 */

// 辅助工具：设置主内容区域
function setContent(html, layoutClass) {
    const container = document.getElementById('contentArea');
    container.className = 'content-grid ' + layoutClass;
    container.innerHTML = html;
}

// 提取资料列表的HTML
function getArticlesHtml(data) {
    if(!data || data.length === 0) return '';
    return data.map(item => {
        const tags = (item['标签'] || '').split(',').filter(t => t.trim() !== '');
        const tagHtml = tags.map(t => `<span class="tag">${t.trim()}</span>`).join('');
        return `
            <a href="${item['链接'] || '#'}" target="_blank" class="card">
                <h3 class="card-title">${item['网站名称'] || '未命名'}</h3>
                <p class="card-desc">${item['描述'] || ''}</p>
                <div class="card-tags">${tagHtml}</div>
            </a>
        `;
    }).join('');
}

// 1. 资料收集 (瀑布流布局 - Masonry)
function renderArticles(data) {
    const html = getArticlesHtml(data);
    if (!html) {
        setContent('<p style="text-align:center;width:100%">暂无相关资料数据</p>', 'masonry-layout');
    } else {
        setContent(html, 'masonry-layout');
    }
}

// 提取工具列表的HTML
function getToolsHtml(data) {
    if(!data || data.length === 0) return '';
    return data.map(item => {
        const iconSrc = item['图标URL'] && item['图标URL'].trim() !== '';
        const iconHtml = iconSrc 
            ? `<img src="${item['图标URL']}" alt="icon" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">` 
            : (item['工具名称'] || 'T').charAt(0);
            
        return `
            <div class="card">
                <div class="tool-header">
                    <div class="tool-icon">${iconHtml}</div>
                    <div>
                        <h3 class="card-title" style="margin:0">${item['工具名称'] || '未命名'}</h3>
                        <span style="font-size:0.8rem;color:#888">${item['版本号'] || 'v1.0'} | ${item['平台'] || '不限'}</span>
                    </div>
                </div>
                <!-- 底部交互行 -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;">
                    <span class="tag">${item['分类'] || ''}</span>
                    <a href="${item['下载链接'] || '#'}" target="_blank" class="download-btn">点击下载</a>
                </div>
            </div>
        `;
    }).join('');
}

// 3. 工具下载 (网格布局 - Grid)
function renderTools(data) {
    const html = getToolsHtml(data);
    if (!html) {
        setContent('<p style="text-align:center;grid-column:1/-1">暂无相关工具数据</p>', 'grid-layout');
    } else {
        setContent(html, 'grid-layout');
    }
}

// 提取政策指南的HTML
function getPoliciesHtml(data) {
    if(!data || data.length === 0) return '';
    let groupedHtml = '';
    let currentYear = null;
    
    data.forEach(item => {
        const year = item['年份'] || '未知年份';
        if (year !== currentYear) {
            groupedHtml += `<h2 class="policy-year" style="width:100%;">${year}</h2>`;
            currentYear = year;
        }
        groupedHtml += `
            <div class="timeline-item">
                <div class="card">
                    <h3 class="card-title"><a href="${item['链接'] || '#'}" target="_blank">${item['政策名称'] || '暂无名称'}</a></h3>
                    <div class="article-meta">颁布部门: ${item['颁布部门'] || '未知部门'}</div>
                    <p class="card-desc" style="margin-bottom:0">${item['简述'] || ''}</p>
                </div>
            </div>
        `;
    });
    return groupedHtml;
}

// 4. 政策指南 (时间线布局 - Timeline)
function renderPolicies(data) {
    const html = getPoliciesHtml(data);
    if (!html) {
        setContent('<p style="text-align:center;width:100%">暂无相关政策数据</p>', 'timeline-layout');
    } else {
        setContent(html, 'timeline-layout');
    }
}

// 全局聚合搜索渲染
function renderGlobalSearch(sArticles, sTools, sPolicies) {
    let html = '';
    
    const hArticles = getArticlesHtml(sArticles);
    if (hArticles) {
        html += '<h2 style="width:100%;color:white;margin:20px 0;grid-column:1/-1;">资料收集</h2>';
        html += '<div class="masonry-layout" style="width:100%;grid-column:1/-1;">' + hArticles + '</div>';
    }
    
    const hTools = getToolsHtml(sTools);
    if (hTools) {
        html += '<h2 style="width:100%;color:white;margin:20px 0;grid-column:1/-1;">工具下载</h2>';
        html += '<div class="grid-layout" style="width:100%;grid-column:1/-1;">' + hTools + '</div>';
    }
    
    const hPolicies = getPoliciesHtml(sPolicies);
    if (hPolicies) {
        html += '<h2 style="width:100%;color:white;margin:20px 0;grid-column:1/-1;">政策指南</h2>';
        html += '<div class="timeline-layout" style="width:100%;grid-column:1/-1;">' + hPolicies + '</div>';
    }
    
    if (!html) {
        html = '<p style="text-align:center;width:100%;grid-column:1/-1;color:rgba(255,255,255,0.7);margin-top:40px;">暂无匹配结果</p>';
    }
    
    setContent(html, 'grid-layout'); // 使用 grid-layout 作为外部包容容器，让子元素可以以 block 形式展现
}

// 动态渲染分类按钮 (顶部过滤器)
function renderCategories(categoriesSet) {
    const container = document.getElementById('categoryContainer');
    if (!categoriesSet || categoriesSet.size === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = `<button class="cat-btn active" data-cat="all">全部</button>`;
    categoriesSet.forEach(cat => {
        html += `<button class="cat-btn" data-cat="${cat}">${cat}</button>`;
    });
    
    container.innerHTML = html;
}
