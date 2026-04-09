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

// 1. 资料收集 (瀑布流布局 - Masonry)
function renderArticles(data) {
    if(!data || data.length === 0) {
        setContent('<p style="text-align:center;width:100%">暂无相关资料数据</p>', 'masonry-layout');
        return;
    }
    const html = data.map(item => {
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
    setContent(html, 'masonry-layout');
}

// 3. 工具下载 (网格布局 - Grid)
function renderTools(data) {
    if(!data || data.length === 0) {
        setContent('<p style="text-align:center;grid-column:1/-1">暂无相关工具数据</p>', 'grid-layout');
        return;
    }
    const html = data.map(item => {
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
    setContent(html, 'grid-layout');
}

// 4. 政策指南 (时间线布局 - Timeline)
function renderPolicies(data) {
    if(!data || data.length === 0) {
        setContent('<p style="text-align:center">暂无相关政策数据</p>', 'timeline-layout');
        return;
    }
    
    // 按年份进行分组
    let groupedHtml = '';
    let currentYear = null;
    
    data.forEach(item => {
        const year = item['年份'] || '未知年份';
        if (year !== currentYear) {
            groupedHtml += `<h2 class="policy-year">${year}</h2>`;
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
    
    setContent(groupedHtml, 'timeline-layout');
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
