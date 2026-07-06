// ==UserScript==
// @name         電籽ComfyUI web前端修复反人类设计
// @namespace    http://tampermonkey.net/
// @version      8.6.5
// @description  解决一堆痛点，右键菜单搜索节点+菜单层级高亮+丝滑动画+AI生成/编辑工作流+错误信息一键复制+直角磁贴风格+一键打开工作流在磁盘的位置等等很多功能
// @author       小小电子xxdz
// @homepage     https://xxdz-official.github.io/x
// @icon         https://xxdz-official.github.io/xxdzComfyUIrun/img/xxdz%20studio%20loge3.0.ico
// @match        http://127.0.0.1:8188/*
// @match        http://localhost:8188/*
// @match        http://127.0.0.1/*
// @match        http://localhost:7777/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('電籽ComfyUI web前端修复反人类设计 v8.6.5');
    const ABOUT_TEXT = `解决了很多痛点啊！
	首先，ComfyUI默认的右键菜单简直反人类！全黑背景，跟后面的工作流面板融为一片，乍一看根本不知道哪里是右键菜单，哪里是工作流背景！
		我的做法是：给每个菜单加上又美观又实用的横向渐变背景，而且由于菜单是横向展开的，所以用横向的渐变，对菜单层级的理解也一目了然~即使你截图抛给AI问答，AI也会大大降低识别出错的概率！
	第二，同样是菜单方面的，原版你进入一个菜单某一个文件夹的子菜单后，上一个菜单里的文件夹菜单项就会失去高亮，这样很可能忘记自己是怎么一步步打开到当前这个菜单项的，如果你想截图问AI，AI更不知道了，只能盲猜喵。。。
		我的做法是：保留高光！一步一个爪印让你知道自己的菜单路径！
	第三，节点搜索反人类！原版菜单没有搜索功能，要找某个节点得在几十个文件夹里来回翻，眼睛都看瞎了，特别是装了上百个自定义节点之后简直是折磨
		我的做法是：在菜单顶部加了一个搜索框！支持全局搜索所有节点和文件夹，输入关键词直接过滤出匹配项，搜索结果还能一键点进去创建节点！
		（而且还有个小彩蛋：输入 <about> 回车，直接跳转我B站主页~懂的都懂！）（话说我直接在这说了还算彩蛋吗？）（算了反正开源了大家都能看到下面的彩蛋源码。。）（啊？有人看源码？）（那我还是彩蛋吧 -v-）
	第四，菜单自适应！原版菜单经常跑到屏幕外面去，尤其是子菜单特别长的时候，下面的选项根本点不到
		我的做法是：菜单会自动检测屏幕边界并调整位置，如果内容太多还会自动加滚动条，保证所有选项都能看到和点到，彻底告别"菜单跑出屏幕"的尴尬
	第五，菜单层级导航糊里糊涂！原版打开多层子菜单后，你不知道自己当前在哪个层级，也不清楚路径
		我的做法是：在菜单里加了文件夹图标 + 箭头指示，还有高亮链路追踪，当前打开的文件夹会有特殊样式，父级文件夹也会保留高亮，一眼就能看出菜单的层级关系喵
	第六，菜单信息复制！有时候想把某个菜单路径分享给别人或者喂给AI，得一点点整理，累死人喵！？
		我的做法是：菜单顶部加了 DIR 和 DIR/S 两个按钮！DIR 复制当前层级的菜单列表，DIR/S 递归复制整个菜单树（带缩进和树形符号），一键复制粘贴，跟AI交流效率起飞~
	第七，原版菜单项前面没有序号，这样比如你问AI自己改点菜单里那个时，需要自己一个个找，很费效率。。。
		我的做法是：新增序号，AI看到后可以直接告诉你选择第几个菜单项！
	第八，工作流管理不方便！不知道当前工作流存在哪里，想打开文件夹找文件还要手动去资源管理器翻
		我的做法是：右键点击工作流标签，菜单里多了"打开此json工作流在磁盘上的位置"选项，一键打开所在文件夹。还能配合我写的電籽启动器后端，直接通过API读取工作流目录，不用手动配置路径
	第九，原版无法复制某个菜单项，比如你想直接复制工作流里节点内某个模型的名字，那是不可能的
		我的做法是：加了个复制快捷菜单，点菜单里的序号就能复制名称或路径，再也不用对着屏幕手敲或者用其他麻烦的方法啦
	第十，AI生成/编辑工作流！想用AI帮你改工作流还得导出json再上传？太麻烦了！
		我的做法是：顶部工具栏加了个"AI生成工作流"按钮！点击后会把当前工作流序列化后发给本地的電籽启动器后端，由后端调用AI模型生成或编辑工作流。
		右键工作流标签还有"使用AI编辑此工作流"选项，直接对当前工作流进行AI修改，完事还能通过WebSocket刷新页面自动加载新工作流，一条龙服务喵~
	第十一，错误信息分享困难！ComfyUI报错的时候，那一大片红色错误信息想发给别人问问题，得鼠标框选复制一大堆，还得手动加上下文信息
		我的做法是：在属性面板（Properties Panel）顶部加了"复制错误"和"下载错误"两个按钮！点击后自动抓取当前错误信息，带上时间戳和工作流名称，一键复制成格式化文本或者下载成HTML文件，问AI或者发论坛都方便到爆炸！
	第十二，菜单动画又硬又丑！原版菜单开关都是瞬间完成的，毫无体验可言，众所周知，动画不仅仅是用来美观的，很多时候，它是一种实用的辅助交互体验，告诉你这个元素是从哪里来、到哪里去
		我的做法是：加了丝滑的淡入淡出动画 + 缩放效果，菜单打开关闭都顺滑自然，视觉舒适度直线上升！菜单项悬浮还有高亮过渡动画，手感细腻喵
	第十三，我超喜欢Windows10磁贴那种简洁风格！方方正正，干净利落，没有廉价感的风格~
		我的做法是：在关于窗口里加了个"开启直角磁贴风格"开关！打开后整个页面所有圆角全部消失，变成纯粹的直角风格
		而且这个设置会保存在浏览器里，下次打开页面时自动生效！
	另外有个小心思....
	有没有发现配色很多是洛天依和初音未来的应援色？( ⓛ ω ⓛ *)

！！！请结合電籽confyUI启动器以发挥最大能力喵！！！！
電籽confyUI启动下载：https://xxdz-official.github.io/x`;

    // ============  请结合電籽confyUI启动器以发挥最大能力喵！！！！  ============
    //電籽confyUI启动下载：https://xxdz-official.github.io/x

    // ========== 工作流目录（从電籽启动器 API 拿） ==========
    let WORKFLOWS_DIR = '';

    async function fetchWorkflowsDir() {
        try {
            const response = await fetch('http://127.0.0.1:8765/get_workflows_dir');
            if (response.ok) {
                const data = await response.json();
                WORKFLOWS_DIR = data.workflows_dir;
                console.log('[ComfyUI] 从電籽启动器搞到工作流目录:', WORKFLOWS_DIR);
                return WORKFLOWS_DIR;
            } else {
                console.warn('[ComfyUI] 拿工作流目录失败，用默认路径凑合');
                WORKFLOWS_DIR = 'E:\\bigchengxu\\AMD AI\\ComfyUI\\user\\default\\workflows';
                return WORKFLOWS_DIR;
            }
        } catch (err) {
            console.warn('[ComfyUI] 连不上電籽启动器，用默认路径:', err);
            WORKFLOWS_DIR = 'E:\\bigchengxu\\AMD AI\\ComfyUI\\user\\default\\workflows';
            return WORKFLOWS_DIR;
        }
    }

    let workflowsDirPromise = fetchWorkflowsDir();
    // ==================================================

    let app = null;
    let globalNodesCache = [];
    let globalFolderCache = [];
    let searchBoxAdded = false;
    let folderContentsCache = new Map();
    let allOpenMenus = new Set();

    // ==================== 加载 Font Awesome ====================
    function loadFontAwesome() {
        if (!document.querySelector('link[href*="fontawesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }
    }

    // ==================== 搞个节点和文件夹的缓存 ====================
    function buildGlobalNodeCache() {
        if (!window.LiteGraph || !LiteGraph.registered_node_types) {
            console.warn('[ComfyUI] LiteGraph 还没准备好');
            return false;
        }

        const nodes = [];
        const foldersSet = new Set();
        const folderToChildren = new Map();

        for (const [nodeType, nodeClass] of Object.entries(LiteGraph.registered_node_types)) {
            let category = nodeClass.category || '未分类';
            let title = nodeClass.title || nodeType;
            const pathParts = category.split('/').filter(p => p.trim());

            let currentPath = '';
            for (let i = 0; i < pathParts.length; i++) {
                currentPath = currentPath ? currentPath + ' → ' + pathParts[i] : pathParts[i];
                foldersSet.add(currentPath);

                if (!folderToChildren.has(currentPath)) {
                    folderToChildren.set(currentPath, { folders: [], nodes: [] });
                }
            }

            if (pathParts.length > 0) {
                const parentPath = pathParts.join(' → ');
                if (!folderToChildren.has(parentPath)) {
                    folderToChildren.set(parentPath, { folders: [], nodes: [] });
                }
                folderToChildren.get(parentPath).nodes.push({
                    nodeType: nodeType,
                    title: title,
                    fullPath: parentPath + ' → ' + title
                });
            }

            nodes.push({
                nodeType: nodeType,
                title: title,
                category: category,
                fullPath: (pathParts.length ? pathParts.join(' → ') + ' → ' : '') + title
            });
        }

        const folderList = Array.from(foldersSet).map(folderPath => ({
            folderPath: folderPath,
            title: folderPath.split(' → ').pop(),
            fullPath: folderPath
        })).sort((a, b) => a.fullPath.localeCompare(b.fullPath));

        for (const folder of folderList) {
            const children = folderToChildren.get(folder.fullPath) || { folders: [], nodes: [] };
            for (const other of folderList) {
                if (other.fullPath.startsWith(folder.fullPath + ' → ') &&
                    other.fullPath.split(' → ').length === folder.fullPath.split(' → ').length + 1) {
                    children.folders.push(other);
                }
            }
            children.folders.sort((a, b) => a.title.localeCompare(b.title));
            folderContentsCache.set(folder.fullPath, children);
        }

        globalFolderCache = folderList;
        globalNodesCache = nodes;
        console.log(`[ComfyUI] 已加载 ${globalNodesCache.length} 个节点，${globalFolderCache.length} 个文件夹`);
        return true;
    }

    function waitForLiteGraph() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.LiteGraph && LiteGraph.registered_node_types && Object.keys(LiteGraph.registered_node_types).length > 0) {
                    clearInterval(check);
                    resolve();
                }
            }, 200);
        });
    }

    function waitForApp() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.app && window.app.graph) {
                    app = window.app;
                    clearInterval(check);
                    resolve();
                }
            }, 200);
        });
    }

    // 创建节点
    function createNodeAtCenter(nodeType, nodeTitle) {
        if (!app || !app.graph || !window.LiteGraph) {
            console.error('[ComfyUI] app 没准备好');
            return false;
        }

        try {
            let centerX = 500, centerY = 500;
            const canvas = app.canvas;

            if (canvas && canvas.canvas) {
                const rect = canvas.canvas.getBoundingClientRect();
                centerX = rect.width / 2;
                centerY = rect.height / 2;
            }

            const nodeInstance = LiteGraph.createNode(nodeType);
            if (!nodeInstance) {
                console.error(`[ComfyUI] 创建节点失败: ${nodeType}`);
                return false;
            }

            nodeInstance.pos = [centerX, centerY];
            app.graph.add(nodeInstance);
            app.graph.change();

            if (canvas && typeof canvas.setDirty === 'function') {
                canvas.setDirty(true);
            }

            console.log(`[ComfyUI] ✓ 节点已创建: ${nodeTitle}`);
            return true;
        } catch (error) {
            console.error('[ComfyUI] 创建节点翻车:', error);
            return false;
        }
    }

    // 关掉所有菜单
    function closeAllMenus() {
        for (const menu of allOpenMenus) {
            if (menu && menu.parentNode) {
                menu.classList.add('closing');
                setTimeout(() => {
                    if (menu.parentNode) menu.remove();
                }, 150);
            }
        }
        allOpenMenus.clear();
    }

    // ==================== 菜单自适应边界（彻底修好） ====================
    function adjustMenuToFit(menu) {
        if (!menu || !menu.parentNode) return;

        const winHeight = window.innerHeight;
        const winWidth = window.innerWidth;

        // 先清掉所有高度限制，让菜单完全舒展开
        menu.style.removeProperty('max-height');
        menu.style.removeProperty('overflow-y');
        menu.style.removeProperty('overflow-x');
        menu.style.removeProperty('height');

        // 用 requestAnimationFrame 等 DOM 渲染完再量尺寸
        requestAnimationFrame(() => {
            // 强制重排一下
            void menu.offsetHeight;
            const fullRect = menu.getBoundingClientRect();
            const menuHeight = fullRect.height;

            // 高度都没出来，说明还没渲染好，先跳过
            if (menuHeight <= 0) return;

            let newTop = fullRect.top;
            let newLeft = fullRect.left;

            // 检查底部是否超出（留20px底边）
            const BOTTOM_MARGIN = 20;
            if (fullRect.bottom > winHeight - BOTTOM_MARGIN) {
                // 让菜单底部对齐视口底部-20px
                newTop = winHeight - menuHeight - BOTTOM_MARGIN;
                // 如果菜单太高，就置顶并启用滚动
                if (menuHeight > winHeight - BOTTOM_MARGIN - 20) {
                    newTop = 10;
                }
            }

            // 顶部别撞墙
            if (newTop < 10) {
                newTop = 10;
            }

            // 检查右侧是否跑出去
            if (fullRect.right > winWidth - 10) {
                newLeft = winWidth - fullRect.width - 10;
            }
            if (newLeft < 10) {
                newLeft = 10;
            }

            // 判断要不要滚动：菜单高度超过视口高度减去边距
            const shouldScroll = menuHeight > (winHeight - 60);

            if (shouldScroll) {
                // 菜单太高，加滚动条并置顶
                const maxH = winHeight - 20;
                menu.style.setProperty('max-height', maxH + 'px', 'important');
                menu.style.setProperty('overflow-y', 'auto', 'important');
                menu.style.setProperty('overflow-x', 'hidden', 'important');
                if (newTop < 10 || newTop + menuHeight > winHeight) {
                    newTop = 10;
                }
            } else {
                // 菜单能完全显示，去掉滚动样式
                menu.style.removeProperty('max-height');
                menu.style.removeProperty('overflow-y');
                menu.style.removeProperty('overflow-x');
            }

            // 应用位置
            menu.style.left = newLeft + 'px';
            menu.style.top = newTop + 'px';

            // 去掉内部列表的滚动限制
            const resultList = menu.querySelector('.comfyui-result-list');
            if (resultList) {
                resultList.style.maxHeight = '';
                resultList.style.overflowY = '';
            }

            // 二次修正：万一内容变了又超出，只加滚动，不再动位置
            setTimeout(() => {
                const newRect = menu.getBoundingClientRect();
                if (newRect.bottom > winHeight - 20 && newRect.height > 0) {
                    const maxH = winHeight - 20;
                    menu.style.setProperty('max-height', maxH + 'px', 'important');
                    menu.style.setProperty('overflow-y', 'auto', 'important');
                    menu.style.setProperty('overflow-x', 'hidden', 'important');
                }
            }, 100);
        });
    }

    // 调整所有可见菜单
    function adjustAllMenus() {
        document.querySelectorAll('.litecontextmenu.litemenubar-panel').forEach(menu => {
            adjustMenuToFit(menu);
        });
    }

    // ==================== 算菜单位置（当个备用） ====================
    function calculateMenuPosition(parentRect, menuHeight) {
        const windowHeight = window.innerHeight;
        const maxHeight = windowHeight - 100;

        let topPos = parentRect.top;

        if (topPos + menuHeight > windowHeight - 10) {
            let newTop = windowHeight - menuHeight - 10;
            if (menuHeight > windowHeight - 30) {
                newTop = 10;
            }
            topPos = Math.max(10, newTop);
        }

        if (topPos < 30 && windowHeight - menuHeight > 100) {
            topPos = 30;
        }

        return topPos;
    }

    // 弹出文件夹内容菜单
    function showFolderContentMenu(folderPath, parentMenu, parentRect, level = 0) {
        const contents = folderContentsCache.get(folderPath);
        if (!contents || (contents.folders.length === 0 && contents.nodes.length === 0)) {
            console.log('[ComfyUI] 文件夹是空的:', folderPath);
            return null;
        }

        const allItems = [...contents.folders.map(f => ({ type: 'folder', ...f })),
                         ...contents.nodes.map(n => ({ type: 'node', ...n }))];

        const resultMenu = document.createElement('div');
        resultMenu.className = 'litegraph litecontextmenu litemenubar-panel';
        resultMenu.style.position = 'fixed';
        resultMenu.style.opacity = '0';
        resultMenu.style.transform = 'scale(0.95) translateY(-8px)';
        resultMenu.style.transition = 'all 0.18s cubic-bezier(0.2, 0.9, 0.4, 1.1)';

        let leftPos, topPos;
        if (parentMenu) {
            const parentRect_ = parentMenu.getBoundingClientRect();
            leftPos = parentRect_.right + 5;
            const estimatedHeight = Math.min(allItems.length * 28 + 40, window.innerHeight - 100);
            topPos = calculateMenuPosition(parentRect_, estimatedHeight);
        } else {
            leftPos = parentRect.right + 5;
            const estimatedHeight = Math.min(allItems.length * 28 + 40, window.innerHeight - 100);
            topPos = calculateMenuPosition(parentRect, estimatedHeight);
        }

        resultMenu.style.left = leftPos + 'px';
        resultMenu.style.top = topPos + 'px';
        resultMenu.style.minWidth = '260px';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'litemenu-entry';
        titleDiv.setAttribute('data-no-index', 'true');
        titleDiv.style.background = 'linear-gradient(90deg, #66ccff20, #3399dd20)';
        titleDiv.style.borderBottom = '1px solid rgba(102,204,255,0.3)';
        titleDiv.style.fontSize = '11px';
        titleDiv.style.color = '#66ccff';
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.padding = '6px 12px';
        titleDiv.style.cursor = 'default';
        titleDiv.innerHTML = `<i class="fas fa-folder-open" style="margin-right: 6px;"></i>${folderPath.split(' → ').pop()}`;
        resultMenu.appendChild(titleDiv);

        const resultList = document.createElement('div');
        resultList.className = 'comfyui-result-list';
        // 不限制内部列表高度，由菜单整体滚动
        resultList.style.maxHeight = 'none';
        resultList.style.overflowY = 'visible';

        allItems.forEach((item, idx) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'litemenu-entry comfyui-search-result-item';
            if (item.type === 'folder') {
                resultItem.classList.add('comfyui-search-result-folder');
            }
            resultItem.style.position = 'relative';
            resultItem.style.paddingLeft = '22px';
            resultItem.style.cursor = 'pointer';

            const indexSpan = document.createElement('span');
            indexSpan.className = 'menu-index';
            indexSpan.textContent = (idx + 1).toString();
            resultItem.appendChild(indexSpan);

            if (item.type === 'folder') {
                const folderIcon = document.createElement('i');
                folderIcon.className = 'fas fa-folder';
                folderIcon.style.position = 'absolute';
                folderIcon.style.left = '22px';
                folderIcon.style.top = '50%';
                folderIcon.style.transform = 'translateY(-50%)';
                folderIcon.style.fontSize = '11px';
                folderIcon.style.color = '#ffcc66';
                resultItem.appendChild(folderIcon);
            }

            const textSpan = document.createElement('span');
            textSpan.style.marginLeft = item.type === 'folder' ? '20px' : '0px';
            textSpan.textContent = item.title;
            resultItem.appendChild(textSpan);

            if (item.type === 'folder') {
                const arrowSpan = document.createElement('span');
                arrowSpan.style.position = 'absolute';
                arrowSpan.style.right = '8px';
                arrowSpan.style.top = '50%';
                arrowSpan.style.transform = 'translateY(-50%)';
                arrowSpan.style.fontSize = '12px';
                arrowSpan.style.color = '#88aacc';
                arrowSpan.innerHTML = '▸';
                resultItem.appendChild(arrowSpan);
            }

            resultItem.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();

                console.log(`[ComfyUI] 点了个: ${item.type} - ${item.title}`);

                if (item.type === 'folder') {
                    const subMenu = showFolderContentMenu(item.folderPath, resultMenu, null, level + 1);
                    if (subMenu) {
                        allOpenMenus.add(subMenu);
                    }
                } else if (item.type === 'node') {
                    closeAllMenus();
                    if (parentMenu && parentMenu.parentNode) {
                        parentMenu.remove();
                    }
                    createNodeAtCenter(item.nodeType, item.title);
                }
            });

            resultList.appendChild(resultItem);
        });

        resultMenu.appendChild(resultList);
        document.body.appendChild(resultMenu);
        allOpenMenus.add(resultMenu);

        requestAnimationFrame(() => {
            resultMenu.style.opacity = '1';
            resultMenu.style.transform = 'scale(1) translateY(0)';
            adjustMenuToFit(resultMenu);
        });

        return resultMenu;
    }

    // ==================== 高亮样式 ====================
    const HIGHLIGHT_CLASS = 'comfyui-highlight-current';
    const ANCESTOR_CLASS = 'comfyui-highlight-ancestor';

    // 生成菜单信息并复制到剪贴板（用缓存的节点树）
    function buildTreeFromCache(folderPath, indent = 0) {
        const result = [];
        const indentStr = '  '.repeat(indent);
        const prefix = '├─ ';

        const contents = folderContentsCache.get(folderPath);
        if (!contents) return result;

        for (let i = 0; i < contents.folders.length; i++) {
            const folder = contents.folders[i];
            const isLast = (i === contents.folders.length - 1) && (contents.nodes.length === 0);
            const linePrefix = isLast ? '└─ ' : '├─ ';
            result.push(`${indentStr}${linePrefix}${folder.title} (文件夹)`);
            const subItems = buildTreeFromCache(folder.fullPath, indent + 1);
            result.push(...subItems);
        }

        for (let i = 0; i < contents.nodes.length; i++) {
            const node = contents.nodes[i];
            const isLast = (i === contents.nodes.length - 1);
            const linePrefix = isLast ? '└─ ' : '├─ ';
            result.push(`${indentStr}${linePrefix}${node.title}`);
        }

        return result;
    }

    function findFolderPathFromMenu(menu) {
        let targetFolder = null;

        const titleDiv = menu.querySelector('.litemenu-entry[data-no-index="true"]');
        if (titleDiv) {
            const titleText = titleDiv.textContent?.trim() || '';
            let cleanTitle = titleText.replace(/[→▶▸]/g, '').trim();
            for (const folder of globalFolderCache) {
                if (folder.title === cleanTitle || folder.fullPath.endsWith(cleanTitle)) {
                    targetFolder = folder;
                    break;
                }
            }
        }

        if (!targetFolder) {
            const allItems = menu.querySelectorAll('.litemenu-entry');
            for (const item of allItems) {
                const text = item.textContent?.trim() || '';
                if (text === '添加节点' || text.includes('添加节点')) {
                    targetFolder = null;
                    break;
                }
            }
        }

        return targetFolder;
    }

    function generateMenuInfo(menu, recursive = false) {
        // 拿到当前菜单下所有直接的菜单项（去掉工具栏、搜索框、分隔符等）
        const allDirectItems = menu.querySelectorAll(':scope > .litemenu-entry');
        const directItems = [];
        for (const item of allDirectItems) {
            if (item.classList.contains('separator') ||
                item.classList.contains('comfyui-search-container') ||
                item.classList.contains('comfyui-local-search-hint') ||
                item.classList.contains('comfyui-menu-toolbar') ||
                item.closest('.comfyui-menu-toolbar')) {
                continue;
            }
            if (item.hasAttribute('data-no-index')) continue;
            directItems.push(item);
        }

        if (!recursive) {
            // 非递归：只输出当前层级的文本
            const result = [];
            for (const item of directItems) {
                let text = '';
                const textSpan = item.querySelector('span:not(.menu-index)');
                if (textSpan) {
                    text = textSpan.textContent?.trim() || '';
                }
                if (!text) {
                    text = item.textContent?.trim() || '';
                    text = text.replace(/^\d+/, '').trim();
                }
                if (text) result.push(text);
            }
            return result;
        }

        // ===== 递归模式：深度遍历当前菜单及所有子菜单 =====
        console.log('[ComfyUI] 递归模式：开始深度遍历');
        const result = [];

        // 收集当前菜单所有直接条目的文本（去掉序号），用来匹配文件夹
        const menuItemTexts = [];
        for (const item of directItems) {
            let text = '';
            const textSpan = item.querySelector('span:not(.menu-index)');
            if (textSpan) {
                text = textSpan.textContent?.trim() || '';
            }
            if (!text) {
                text = item.textContent?.trim() || '';
                text = text.replace(/^\d+/, '').trim();
            }
            if (text) menuItemTexts.push(text);
        }

        // 判断是不是根菜单：所有条目都是顶级文件夹（不包含 ' → '）
        const topLevelFolders = globalFolderCache.filter(f => !f.fullPath.includes(' → '));
        const topLevelNames = topLevelFolders.map(f => f.title);

        let isRootMenu = false;
        if (menuItemTexts.length > 0) {
            isRootMenu = menuItemTexts.every(text => topLevelNames.includes(text));
            if (!isRootMenu && menuItemTexts.length >= topLevelNames.length * 0.8) {
                const matchCount = menuItemTexts.filter(text => topLevelNames.includes(text)).length;
                if (matchCount >= topLevelNames.length * 0.7) {
                    isRootMenu = true;
                    console.log('[ComfyUI] 通过匹配率认出是根菜单:', matchCount, '/', topLevelNames.length);
                }
            }
        }

        let currentFolderPath = null;

        if (isRootMenu) {
            currentFolderPath = 'root';
            console.log('[ComfyUI] 识别为根菜单（顶级文件夹列表），准备深度遍历');
        } else {
            // 试试通过标题栏匹配
            const titleDiv = menu.querySelector('.litemenu-entry[data-no-index="true"]');
            if (titleDiv) {
                let titleText = titleDiv.textContent?.trim() || '';
                titleText = titleText.replace(/[→▶▸]/g, '').trim();
                if (titleText) {
                    for (const folder of globalFolderCache) {
                        if (folder.title === titleText || folder.fullPath.endsWith(titleText)) {
                            currentFolderPath = folder.fullPath;
                            console.log('[ComfyUI] 通过标题栏匹配到文件夹:', folder.title);
                            break;
                        }
                    }
                }
            }

            // 不行的话，通过第一个条目匹配
            if (!currentFolderPath && directItems.length > 0) {
                const firstItem = directItems[0];
                const firstText = getItemText(firstItem);
                if (firstText) {
                    for (const folder of globalFolderCache) {
                        const contents = folderContentsCache.get(folder.fullPath);
                        if (contents) {
                            const allChildNames = [...contents.folders.map(f => f.title), ...contents.nodes.map(n => n.title)];
                            if (allChildNames.includes(firstText)) {
                                currentFolderPath = folder.fullPath;
                                console.log('[ComfyUI] 通过第一个条目匹配到文件夹:', folder.title);
                                break;
                            }
                        }
                    }
                }
            }

            // 再不行，匹配所有条目文本
            if (!currentFolderPath) {
                for (const folder of globalFolderCache) {
                    const contents = folderContentsCache.get(folder.fullPath);
                    if (!contents) continue;
                    const allChildNames = [...contents.folders.map(f => f.title), ...contents.nodes.map(n => n.title)];
                    const allMatch = menuItemTexts.every(text => allChildNames.includes(text));
                    if (allMatch && menuItemTexts.length > 0) {
                        currentFolderPath = folder.fullPath;
                        console.log('[ComfyUI] 通过所有条目匹配到文件夹:', folder.title);
                        break;
                    }
                }
            }

            // 还是不行，尝试找父文件夹
            if (!currentFolderPath && menuItemTexts.length > 0) {
                for (const folder of globalFolderCache) {
                    const contents = folderContentsCache.get(folder.fullPath);
                    if (!contents) continue;
                    const allChildNames = [...contents.folders.map(f => f.title), ...contents.nodes.map(n => n.title)];
                    const matchCount = menuItemTexts.filter(text => allChildNames.includes(text)).length;
                    if (matchCount >= menuItemTexts.length * 0.6 && matchCount >= 2) {
                        currentFolderPath = folder.fullPath;
                        console.log('[ComfyUI] 通过部分匹配（父文件夹）到:', folder.title, '匹配:', matchCount, '/', menuItemTexts.length);
                        break;
                    }
                }
            }
        }

        // 实在匹配不到，就直接输出当前菜单的直接条目
        if (!currentFolderPath) {
            console.log('[ComfyUI] 没匹配到文件夹，直接输出当前菜单项');
            for (const item of directItems) {
                let text = '';
                const textSpan = item.querySelector('span:not(.menu-index)');
                if (textSpan) {
                    text = textSpan.textContent?.trim() || '';
                }
                if (!text) {
                    text = item.textContent?.trim() || '';
                    text = text.replace(/^\d+/, '').trim();
                }
                if (text) result.push(`├─ ${text}`);
            }
            return result;
        }

        // ===== 深度遍历：用 globalFolderCache 递归构建树 =====
        function buildDeepTree(folderPath, indent) {
            const items = [];
            const indentStr = '  '.repeat(indent);
            const contents = folderContentsCache.get(folderPath);
            if (!contents) return items;

            const subFolders = contents.folders || [];
            const subNodes = contents.nodes || [];

            for (let i = 0; i < subFolders.length; i++) {
                const folder = subFolders[i];
                const isLast = (i === subFolders.length - 1) && (subNodes.length === 0);
                const prefix = isLast ? '└─ ' : '├─ ';
                items.push(`${indentStr}${prefix}${folder.title} (文件夹)`);
                const subItems = buildDeepTree(folder.fullPath, indent + 1);
                for (const subItem of subItems) {
                    items.push(subItem);
                }
            }

            for (let i = 0; i < subNodes.length; i++) {
                const node = subNodes[i];
                const isLast = (i === subNodes.length - 1);
                const prefix = isLast ? '└─ ' : '├─ ';
                items.push(`${indentStr}${prefix}${node.title}`);
            }

            return items;
        }

        // ===== 更可靠：直接从 globalFolderCache 构建完整树 =====
        function buildFullTreeFromCache(startFolderPath, startIndent) {
            const result = [];
            const processed = new Set();

            function traverse(folderPath, indent) {
                if (processed.has(folderPath)) return;
                processed.add(folderPath);

                const contents = folderContentsCache.get(folderPath);
                if (!contents) return;

                const indentStr = '  '.repeat(indent);
                const folders = contents.folders || [];
                const nodes = contents.nodes || [];

                for (let i = 0; i < folders.length; i++) {
                    const folder = folders[i];
                    const isLast = (i === folders.length - 1) && (nodes.length === 0);
                    const prefix = isLast ? '└─ ' : '├─ ';
                    result.push(`${indentStr}${prefix}${folder.title} (文件夹)`);
                    traverse(folder.fullPath, indent + 1);
                }

                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const isLast = (i === nodes.length - 1);
                    const prefix = isLast ? '└─ ' : '├─ ';
                    result.push(`${indentStr}${prefix}${node.title}`);
                }
            }

            traverse(startFolderPath, startIndent);
            return result;
        }

        if (currentFolderPath === 'root') {
            console.log('[ComfyUI] 输出根菜单的完整节点树');
            const topLevels = globalFolderCache.filter(f => !f.fullPath.includes(' → '));
            for (let i = 0; i < topLevels.length; i++) {
                const folder = topLevels[i];
                const isLast = (i === topLevels.length - 1);
                const prefix = isLast ? '└─ ' : '├─ ';
                result.push(`${prefix}${folder.title} (文件夹)`);
                const subItems = buildDeepTree(folder.fullPath, 1);
                for (const subItem of subItems) {
                    result.push(subItem);
                }
            }
            const uncategorizedNodes = globalNodesCache.filter(node =>
                !node.category || node.category === '未分类' || node.category === ''
            );
            for (let i = 0; i < uncategorizedNodes.length; i++) {
                const node = uncategorizedNodes[i];
                const isLast = (i === uncategorizedNodes.length - 1);
                const prefix = isLast ? '└─ ' : '├─ ';
                result.push(`${prefix}${node.title}`);
            }
        } else {
            console.log('[ComfyUI] 深度遍历文件夹:', currentFolderPath);
            const folderTitle = currentFolderPath.split(' → ').pop();
            result.push(`├─ ${folderTitle} (文件夹)`);
            const subItems = buildDeepTree(currentFolderPath, 1);
            for (const subItem of subItems) {
                result.push(subItem);
            }
        }

        if (result.length === 0) {
            result.push('(菜单是空的或者没找到能认的节点)');
        }

        return result;
    }

    // 辅助：获取菜单项文本（用来匹配）
    function getItemText(item) {
        let text = '';
        const textSpan = item.querySelector('span:not(.menu-index)');
        if (textSpan) {
            text = textSpan.textContent?.trim() || '';
        }
        if (!text) {
            text = item.textContent?.trim() || '';
            text = text.replace(/^\d+/, '').trim();
        }
        return text;
    }

    function copyMenuInfoToClipboard(menu, recursive) {
        console.log('[ComfyUI] copyMenuInfoToClipboard 被喊了, recursive=', recursive);
        try {
            const lines = generateMenuInfo(menu, recursive);
            console.log('[ComfyUI] 生成菜单信息, lines.length=', lines.length);
            if (lines.length === 0) {
                console.warn('[ComfyUI] 没找到菜单项');
                const allItems = menu.querySelectorAll('.litemenu-entry');
                console.log('[ComfyUI] 菜单里共有', allItems.length, '个条目');
                for (const item of allItems) {
                    console.log('[ComfyUI] 条目文本:', item.textContent);
                }
                return;
            }
            const output = lines.join('\n');
            const copyToClipboardFallback = (text) => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                textarea.style.left = '-9999px';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                textarea.setSelectionRange(0, text.length);
                let success = false;
                try {
                    success = document.execCommand('copy');
                } catch (err) {
                    console.error('[ComfyUI] execCommand 复制翻车:', err);
                }
                document.body.removeChild(textarea);
                return success;
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(output).then(() => {
                    console.log('[ComfyUI] 复制成功 (Clipboard API)!');
                    showCopySuccessToast(lines.length, recursive);
                }).catch(err => {
                    console.warn('[ComfyUI] Clipboard API 失败，试试 fallback:', err);
                    if (copyToClipboardFallback(output)) {
                        console.log('[ComfyUI] 复制成功 (fallback)!');
                        showCopySuccessToast(lines.length, recursive);
                    } else {
                        console.error('[ComfyUI] 所有复制方法都跪了');
                        showElegantToast('复制失败，请手动复制内容', 'error');
                    }
                });
            } else {
                if (copyToClipboardFallback(output)) {
                    console.log('[ComfyUI] 复制成功 (fallback)!');
                    showCopySuccessToast(lines.length, recursive);
                } else {
                    console.error('[ComfyUI] 复制失败，浏览器不支持');
                    showElegantToast('您的浏览器™不支持自动复制，请手动复制', 'error');
                }
            }

            function showCopySuccessToast(itemCount, recursive) {
                const mode = recursive ? '递归树形模式' : '仅当前层级';
                showElegantToast(`已复制菜单信息 (${mode})，共 ${itemCount} 项`, 'success');
            }
        } catch (err) {
            console.error('[ComfyUI] 生成菜单信息翻车:', err);
            showElegantToast('生成菜单信息失败: ' + err.message, 'error');
        }
    }

    const menusWithButtons = new WeakSet();

    function addMenuToolbar(menu) {
        if (menu.querySelector('.comfyui-menu-toolbar')) return;

        console.log('[ComfyUI] addMenuToolbar 被呼叫，菜单:', menu);

        if (getComputedStyle(menu).position === 'static') {
            menu.style.position = 'relative';
        }

        const firstMenuItem = menu.querySelector('.litemenu-entry:not(.comfyui-search-container)');
        if (!firstMenuItem) return;

        const allMenuTexts = Array.from(menu.querySelectorAll('.litemenu-entry')).map(el => el.textContent?.trim() || '');
        const isRootMenu = allMenuTexts.some(text => text === '添加节点' || text.includes('添加节点'));

        if (isRootMenu) {
            console.log('[ComfyUI] 根菜单，跳过工具栏添加');
            return;
        }

        const oldSearchBox = menu.querySelector('.comfyui-search-container');
        if (oldSearchBox) {
            oldSearchBox.remove();
        }

        const toolbar = document.createElement('div');
        toolbar.className = 'comfyui-menu-toolbar';
        toolbar.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            padding: 3px 6px;
            margin-bottom: 2px;
            background: linear-gradient(135deg, rgba(10,10,20,0.6), rgba(26,26,46,0.4));
            border-bottom: 1px solid rgba(102,204,255,0.2);
        `;

        const searchWrapper = document.createElement('div');
        searchWrapper.style.cssText = `
            flex: 1;
            position: relative;
        `;

        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.cssText = `
            position: absolute;
            left: 6px;
            top: 6px;
            font-size: 9px;
            color: #66ccff;
            opacity: 0.6;
            pointer-events: none;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = isRootMenu ? '全局搜索节点或文件夹...' : '过滤当前菜单...';
        searchInput.style.cssText = `
            width: 100%;
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(102,204,255,0.3);
            border-radius: 3px;
            padding: 4px 6px 4px 22px;
            color: #e0e0e0;
            font-size: 10px;
            line-height: 1;
            outline: none;
            transition: all 0.15s ease;
        `;
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = '#66ccff';
            searchInput.style.background = 'rgba(0,0,0,0.6)';
        });
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = 'rgba(102,204,255,0.3)';
            searchInput.style.background = 'rgba(0,0,0,0.4)';
        });

        let searchTimeout = null;
        let resultMenu = null;

        searchInput.addEventListener('input', (e) => {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const keyword = e.target.value.toLowerCase().trim();

                if (isRootMenu) {
                    performGlobalSearchInToolbar(keyword, menu);
                } else {
                    const menuItems = menu.querySelectorAll('.litemenu-entry:not(.separator):not(.comfyui-search-container):not(.comfyui-menu-toolbar)');
                    let matchCount = 0;
                    menuItems.forEach(item => {
                        const text = item.textContent?.trim() || '';
                        if (keyword === '' || text.toLowerCase().includes(keyword)) {
                            item.style.display = '';
                            matchCount++;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // 辅助修复函数
                    function doFixMenuItems(targetMenu, hintEl) {
                        const allItems = targetMenu.querySelectorAll('.litemenu-entry:not(.comfyui-search-container):not(.separator):not(.comfyui-menu-toolbar)');
                        allItems.forEach((item) => {
                            item.style.setProperty('padding-left', '25px', 'important');
                            item.style.setProperty('padding-right', '28px', 'important');
                            if (item.style.display !== 'none') {
                                item.style.setProperty('display', 'flex', 'important');
                                item.style.setProperty('align-items', 'center', 'important');
                                item.style.setProperty('gap', '4px', 'important');
                            }
                            const indexSpan = item.querySelector('.menu-index');
                            if (indexSpan) {
                                indexSpan.style.left = '8px';
                                indexSpan.style.position = 'absolute';
                                indexSpan.style.top = '50%';
                                indexSpan.style.transform = 'translateY(-50%)';
                                indexSpan.style.width = '14px';
                                indexSpan.style.height = '14px';
                            }
                        });
                        if (hintEl) {
                            hintEl.style.background = '#66ccff44';
                            setTimeout(() => { hintEl.style.background = 'transparent'; }, 300);
                        }
                    }

                    let hint = toolbar.querySelector('.comfyui-search-hint');
                    if (keyword === '') {
                        if (hint) hint.remove();
                    } else {
                        if (!hint) {
                            hint = document.createElement('span');
                            hint.className = 'comfyui-search-hint';
                            hint.style.cssText = 'font-size: 9px; color: #66ccff; margin-left: 8px;';
                            searchWrapper.appendChild(hint);
                        }
                        hint.textContent = `${matchCount} 项匹配`;

                        setTimeout(() => {
                            doFixMenuItems(menu, hint);
                        }, 20);
                    }
                }
            }, 200);
        });

        function performGlobalSearchInToolbar(keyword, originalMenu) {
            if (resultMenu && resultMenu.parentNode) resultMenu.remove();
            if (!keyword.trim()) {
                let hint = toolbar.querySelector('.comfyui-search-hint');
                if (hint) hint.remove();
                return;
            }

            const lowerKeyword = keyword.toLowerCase();

            const folderResults = globalFolderCache.filter(folder =>
                folder.title.toLowerCase().includes(lowerKeyword) ||
                folder.fullPath.toLowerCase().includes(lowerKeyword)
            ).map(f => ({ type: 'folder', ...f }));

            const nodeResults = globalNodesCache.filter(node =>
                node.title.toLowerCase().includes(lowerKeyword) ||
                node.category.toLowerCase().includes(lowerKeyword)
            ).map(n => ({ type: 'node', ...n }));

            const results = [...folderResults, ...nodeResults];
            if (results.length === 0) {
                let hint = toolbar.querySelector('.comfyui-search-hint');
                if (!hint) {
                    hint = document.createElement('span');
                    hint.className = 'comfyui-search-hint';
                    hint.style.cssText = 'font-size: 9px; color: #ff8866; margin-left: 8px;';
                    searchWrapper.appendChild(hint);
                }
                hint.textContent = '无匹配结果';
                return;
            }

            let hint = toolbar.querySelector('.comfyui-search-hint');
            if (!hint) {
                hint = document.createElement('span');
                hint.className = 'comfyui-search-hint';
                hint.style.cssText = 'font-size: 9px; color: #66ccff; margin-left: 8px; display: flex; align-items: center; gap: 6px;';
                searchWrapper.appendChild(hint);
            }
            // 强制修复：搜索后重新设置所有菜单项的左边距
            setTimeout(() => {
                const allMenuItems = originalMenu.querySelectorAll('.litemenu-entry:not(.comfyui-search-container):not(.separator):not(.comfyui-menu-toolbar)');
                allMenuItems.forEach((item) => {
                    item.style.setProperty('padding-left', '25px', 'important');
                    item.style.setProperty('padding-right', '28px', 'important');
                    if (item.style.display !== 'none') {
                        item.style.setProperty('display', 'flex', 'important');
                        item.style.setProperty('align-items', 'center', 'important');
                        item.style.setProperty('gap', '4px', 'important');
                    }
                    const indexSpan = item.querySelector('.menu-index');
                    if (indexSpan) {
                        indexSpan.style.left = '8px';
                        indexSpan.style.position = 'absolute';
                        indexSpan.style.top = '50%';
                        indexSpan.style.transform = 'translateY(-50%)';
                        indexSpan.style.width = '14px';
                        indexSpan.style.height = '14px';
                        indexSpan.style.flexShrink = '0';
                    }
                });
            }, 10);

            resultMenu = document.createElement('div');
            resultMenu.className = 'litegraph litecontextmenu litemenubar-panel';
            resultMenu.style.position = 'fixed';
            resultMenu.style.opacity = '0';
            resultMenu.style.transform = 'scale(0.95) translateY(-8px)';
            resultMenu.style.transition = 'all 0.18s cubic-bezier(0.2, 0.9, 0.4, 1.1)';

            const menuRect = originalMenu.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const maxListHeight = windowHeight - 100 - 40;

            let topPos = menuRect.top;
            const estimatedHeight = Math.min(results.length * 28 + 40, maxListHeight + 40);
            if (topPos + estimatedHeight > windowHeight - 10) {
                topPos = Math.max(10, windowHeight - estimatedHeight - 10);
            }

            resultMenu.style.left = (menuRect.right + 5) + 'px';
            resultMenu.style.top = topPos + 'px';
            resultMenu.style.minWidth = '280px';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'litemenu-entry';
            titleDiv.setAttribute('data-no-index', 'true');
            titleDiv.style.background = 'linear-gradient(90deg, #66ccff20, #3399dd20)';
            titleDiv.style.borderBottom = '1px solid rgba(102,204,255,0.3)';
            titleDiv.style.fontSize = '11px';
            titleDiv.style.color = '#66ccff';
            titleDiv.style.fontWeight = 'bold';
            titleDiv.style.padding = '6px 12px';
            titleDiv.style.cursor = 'default';
            titleDiv.innerHTML = `<i class="fas fa-search" style="margin-right: 6px;"></i>搜索结果 (${results.length}项)`;
            resultMenu.appendChild(titleDiv);

            const resultList = document.createElement('div');
            resultList.className = 'comfyui-result-list';
            resultList.style.maxHeight = maxListHeight + 'px';
            resultList.style.overflowY = 'auto';

            results.forEach((result, idx) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'litemenu-entry comfyui-search-result-item';
                if (result.type === 'folder') {
                    resultItem.classList.add('comfyui-search-result-folder');
                }
                resultItem.style.position = 'relative';
                resultItem.style.paddingLeft = '22px';
                resultItem.style.cursor = 'pointer';

                const indexSpan = document.createElement('span');
                indexSpan.className = 'menu-index';
                indexSpan.textContent = (idx + 1).toString();
                resultItem.appendChild(indexSpan);

                if (result.type === 'folder') {
                    const folderIcon = document.createElement('i');
                    folderIcon.className = 'fas fa-folder';
                    folderIcon.style.position = 'absolute';
                    folderIcon.style.left = '22px';
                    folderIcon.style.top = '50%';
                    folderIcon.style.transform = 'translateY(-50%)';
                    folderIcon.style.fontSize = '11px';
                    folderIcon.style.color = '#ffcc66';
                    resultItem.appendChild(folderIcon);
                }

                const textSpan = document.createElement('span');
                textSpan.style.marginLeft = result.type === 'folder' ? '20px' : '0px';
                textSpan.textContent = result.title;
                resultItem.appendChild(textSpan);

                const pathSpan = document.createElement('span');
                pathSpan.className = 'comfyui-result-path';
                pathSpan.textContent = result.type === 'folder' ? ` ${result.fullPath}` : ` → ${result.category}`;
                resultItem.appendChild(pathSpan);

                if (result.type === 'folder') {
                    const arrowSpan = document.createElement('span');
                    arrowSpan.style.position = 'absolute';
                    arrowSpan.style.right = '8px';
                    arrowSpan.style.top = '50%';
                    arrowSpan.style.transform = 'translateY(-50%)';
                    arrowSpan.style.fontSize = '12px';
                    arrowSpan.style.color = '#88aacc';
                    arrowSpan.innerHTML = '▸';
                    resultItem.appendChild(arrowSpan);
                }

                resultItem.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    if (resultMenu && resultMenu.parentNode) resultMenu.remove();

                    if (result.type === 'folder') {
                        const subMenu = showFolderContentMenu(result.fullPath, originalMenu, menuRect, 0);
                        if (subMenu) {
                            allOpenMenus.add(subMenu);
                        }
                    } else if (result.type === 'node') {
                        closeAllMenus();
                        if (originalMenu && originalMenu.parentNode) {
                            originalMenu.remove();
                        }
                        createNodeAtCenter(result.nodeType, result.title);
                    }
                });

                resultList.appendChild(resultItem);
            });

            resultMenu.appendChild(resultList);
            document.body.appendChild(resultMenu);

            requestAnimationFrame(() => {
                resultMenu.style.opacity = '1';
                resultMenu.style.transform = 'scale(1) translateY(0)';
                adjustMenuToFit(resultMenu);
            });

            const closeHandler = (e) => {
                if (resultMenu && !resultMenu.contains(e.target) && !originalMenu.contains(e.target) && !toolbar.contains(e.target)) {
                    if (resultMenu && resultMenu.parentNode) resultMenu.remove();
                    resultMenu = null;
                    document.removeEventListener('click', closeHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeHandler), 100);
        }

        searchWrapper.appendChild(searchIcon);
        searchWrapper.appendChild(searchInput);

        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
            display: flex;
            gap: 2px;
        `;

        const btnDir = document.createElement('button');
        btnDir.textContent = 'DIR';
        btnDir.title = '复制当前菜单项列表（仅当前层级）';
        btnDir.style.cssText = `
            background: rgba(30,30,50,0.85);
            border: none;
            border-right: 1px solid rgba(102,204,255,0.3);
            color: #88aacc;
            font-size: 9px;
            padding: 2px 6px;
            cursor: pointer;
            font-family: monospace;
            transition: all 0.12s ease;
        `;
        btnDir.onmouseover = () => {
            btnDir.style.background = 'rgba(102,204,255,0.25)';
            btnDir.style.color = '#66ccff';
        };
        btnDir.onmouseout = () => {
            btnDir.style.background = 'rgba(30,30,50,0.85)';
            btnDir.style.color = '#88aacc';
        };

        const btnDirS = document.createElement('button');
        btnDirS.textContent = 'DIR/S';
        btnDirS.title = '递归复制当前菜单及所有子菜单（树形结构）';
        btnDirS.style.cssText = `
            background: rgba(30,30,50,0.85);
            border: none;
            color: #88aacc;
            font-size: 9px;
            padding: 2px 6px;
            cursor: pointer;
            font-family: monospace;
            transition: all 0.12s ease;
        `;
        btnDirS.onmouseover = () => {
            btnDirS.style.background = 'rgba(102,204,255,0.25)';
            btnDirS.style.color = '#66ccff';
        };
        btnDirS.onmouseout = () => {
            btnDirS.style.background = 'rgba(30,30,50,0.85)';
            btnDirS.style.color = '#88aacc';
        };

        const handleClick = (e, recursive) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(`[ComfyUI] DIR${recursive ? '/S' : ''} 按钮被点`);
            copyMenuInfoToClipboard(menu, recursive);
        };

        btnDir.addEventListener('click', (e) => handleClick(e, false));
        btnDirS.addEventListener('click', (e) => handleClick(e, true));

        buttonGroup.appendChild(btnDir);
        buttonGroup.appendChild(btnDirS);

        toolbar.appendChild(searchWrapper);
        toolbar.appendChild(buttonGroup);

        menu.insertBefore(toolbar, menu.firstChild);

        menusWithButtons.add(menu);

        // 工具栏加了之后菜单高度可能变，再调整一下
        adjustMenuToFit(menu);
    }

    const STYLES = `
        @keyframes comfyui-menuFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-8px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes comfyui-menuFadeOut {
            from {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            to {
                opacity: 0;
                transform: scale(0.95) translateY(-8px);
            }
        }

        @keyframes comfyui-itemFadeIn {
            from {
                opacity: 0;
                transform: translateX(-5px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .litecontextmenu {
            background: linear-gradient(90deg, #0a0a14 0%, #1a1a2e 30%, #252542 70%, #2a2a4a 100%) !important;
            border: 1px solid rgba(102,204,255,0.35) !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(102,204,255,0.15) inset !important;
            border-radius: 6px !important;
            min-width: 260px !important;
            animation: comfyui-menuFadeIn 0.18s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards !important;
            transform-origin: top left !important;
        }

        .litecontextmenu.closing {
            animation: comfyui-menuFadeOut 0.15s ease-out forwards !important;
            pointer-events: none !important;
        }

        .comfyui-search-container {
            padding: 8px 10px;
            border-bottom: 1px solid rgba(102,204,255,0.2);
            background: linear-gradient(135deg, rgba(10,10,20,0.5), rgba(26,26,46,0.3));
            position: relative;
        }

        .comfyui-search-input {
            width: 100%;
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(102,204,255,0.3);
            border-radius: 4px;
            padding: 6px 10px 6px 32px;
            color: #e0e0e0;
            font-size: 12px;
            outline: none;
            transition: all 0.2s ease;
        }

        .comfyui-search-input:focus {
            border-color: #66ccff;
            box-shadow: 0 0 8px rgba(102,204,255,0.3);
            background: rgba(0,0,0,0.6);
        }

        .comfyui-search-input::placeholder {
            color: rgba(160,160,180,0.6);
            font-size: 11px;
        }

        .comfyui-search-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #66ccff;
            font-size: 13px;
            opacity: 0.7;
            pointer-events: none;
        }

        .comfyui-search-clear {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #888;
            font-size: 12px;
            cursor: pointer;
            display: none;
            transition: color 0.2s;
        }

        .comfyui-search-clear:hover {
            color: #66ccff;
        }

        .comfyui-search-result-item {
            cursor: pointer;
            transition: all 0.1s ease;
            animation: comfyui-itemFadeIn 0.1s ease backwards !important;
        }

        .comfyui-search-result-item:hover {
            background: linear-gradient(90deg, #88ddff 0%, #66ccff 50%, #55bbee 100%) !important;
            color: #000000 !important;
        }

        .comfyui-search-result-folder {
            background: linear-gradient(90deg, rgba(210,180,140,0.3) 0%, rgba(218,165,32,0.25) 50%, rgba(210,180,140,0.3) 100%) !important;
            border-left: 2px solid rgba(218,165,32,0.5) !important;
        }

        .comfyui-search-result-folder:hover {
            background: linear-gradient(90deg, #88ddff 0%, #66ccff 50%, #55bbee 100%) !important;
            border-left-color: #ffffff !important;
            color: #000000 !important;
        }

        .comfyui-result-path {
            font-size: 10px;
            color: #88aacc;
            margin-left: 8px;
            opacity: 0.7;
            font-family: monospace;
            font-style: italic !important;
            font-weight: 300 !important;
        }

        .comfyui-search-result-item:hover .comfyui-result-path {
            color: #000000;
        }

        .comfyui-result-list {
            overflow-y: auto;
            overflow-x: hidden;
        }

        .comfyui-result-list::-webkit-scrollbar {
            width: 6px;
        }

        .comfyui-result-list::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.3);
            border-radius: 3px;
        }

        .comfyui-result-list::-webkit-scrollbar-thumb {
            background: rgba(102,204,255,0.5);
            border-radius: 3px;
        }

        .comfyui-result-list::-webkit-scrollbar-thumb:hover {
            background: rgba(102,204,255,0.8);
        }

        .litemenu-entry {
            padding-left: 22px !important;
            padding-right: 28px !important;
            transition: all 0.12s ease !important;
            position: relative !important;
        }

        .litemenu-entry[data-no-index="true"] .menu-index {
            display: none !important;
        }

        .litemenu-entry.has_submenu::after {
            display: none !important;
        }

        .litemenu-entry.has_submenu:not(.comfyui-highlight-current):not(.comfyui-highlight-ancestor) {
            background: linear-gradient(90deg, rgba(210,180,140,0.3) 0%, rgba(218,165,32,0.25) 50%, rgba(210,180,140,0.3) 100%) !important;
            border-left: 2px solid rgba(218,165,32,0.5) !important;
        }

        .litemenu-entry .fa-folder,
        .litemenu-entry .fa-folder-open {
            position: absolute !important;
            right: 8px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            font-size: 11px !important;
            opacity: 0.8 !important;
            pointer-events: none !important;
        }

        .litemenu-entry.has_submenu[aria-expanded="false"] .fa-folder {
            display: inline-block !important;
        }

        .litemenu-entry.has_submenu[aria-expanded="false"] .fa-folder-open {
            display: none !important;
        }

        .litemenu-entry.has_submenu[aria-expanded="true"] .fa-folder {
            display: none !important;
        }

        .litemenu-entry.has_submenu[aria-expanded="true"] .fa-folder-open {
            display: inline-block !important;
        }

        .litemenu-entry .menu-index {
            position: absolute !important;
            left: 6px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 14px !important;
            height: 14px !important;
            background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%) !important;
            border: 1px solid rgba(102,204,255,0.4) !important;
            border-radius: 3px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 8px !important;
            font-weight: bold !important;
            color: #66ccff !important;
            z-index: 1 !important;
        }

        .comfyui-highlight-current {
            background: linear-gradient(90deg, #66ccff 0%, #3399dd 60%, #2288bb 100%) !important;
            color: #ffffff !important;
            font-weight: bold !important;
            position: relative !important;
        }

        .comfyui-highlight-current::before {
            content: "" !important;
            position: absolute !important;
            left: 0 !important;
            top: 2px !important;
            bottom: 2px !important;
            width: 3px !important;
            background: #ffffff !important;
            border-radius: 0 2px 2px 0 !important;
            box-shadow: 0 0 6px rgba(255,255,255,0.8) !important;
        }

        .comfyui-highlight-ancestor {
            background: linear-gradient(90deg, rgba(102,204,255,0.8) 0%, rgba(51,153,221,0.8) 60%, rgba(34,136,187,0.8) 100%) !important;
            color: #ffffff !important;
            backdrop-filter: blur(2px) !important;
            position: relative !important;
        }

        .comfyui-highlight-ancestor::before {
            content: "" !important;
            position: absolute !important;
            left: 0 !important;
            top: 2px !important;
            bottom: 2px !important;
            width: 2px !important;
            background: rgba(255,255,255,0.7) !important;
            border-radius: 0 2px 2px 0 !important;
        }

        /* ===== 所有菜单项统一过渡动画 - 最高优先级 ===== */
        .litecontextmenu .litemenu-entry,
        .litecontextmenu .litemenu-entry.has_submenu,
        .litecontextmenu .litemenu-entry:not(.has_submenu) {
            transition: background 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1), border-left-color 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1), color 0.2s ease !important;
            transition-duration: 0.25s !important;
        }

        /* ===== 文件夹菜单项悬浮高亮 ===== */
        .litecontextmenu .litemenu-entry.has_submenu:hover:not(.comfyui-highlight-current):not(.comfyui-highlight-ancestor) {
            background: linear-gradient(90deg, rgba(218,165,32,0.55) 0%, rgba(218,165,32,0.45) 50%, rgba(218,165,32,0.55) 100%) !important;
            border-left-color: #daa520 !important;
            border-left-width: 2px !important;
        }

        /* ===== 非文件夹菜单项（节点）悬浮高亮 ===== */
        .litecontextmenu .litemenu-entry:not(.has_submenu):hover:not(.comfyui-highlight-current):not(.comfyui-highlight-ancestor) {
            background: rgba(255,255,255,0.1) !important;
        }

        /* ===== 禁用状态悬浮效果更轻微 ===== */
        .litecontextmenu .litemenu-entry.disabled:hover:not(.comfyui-highlight-current):not(.comfyui-highlight-ancestor) {
            background: rgba(255,255,255,0.04) !important;
        }
    `;

    if (!document.getElementById('comfyui-menu-highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'comfyui-menu-highlight-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    // ==================== 搜索框 ====================
    function addSearchBox(menu) {
        if (menu.querySelector('.comfyui-search-container')) return;

        const nativeFilter = menu.querySelector('.comfy-context-menu-filter');
        const hasNativeFilter = !!nativeFilter;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'comfyui-search-container';

        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search comfyui-search-icon';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'comfyui-search-input';
        searchInput.placeholder = hasNativeFilter ? '过滤当前列表...' : '使用電籽搜索所有节点或文件夹';

        const clearBtn = document.createElement('i');
        clearBtn.className = 'fas fa-times comfyui-search-clear';

        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearBtn);

        if (hasNativeFilter && nativeFilter) {
            nativeFilter.style.display = 'none';
            nativeFilter.insertAdjacentElement('beforebegin', searchContainer);
        } else {
            menu.insertBefore(searchContainer, menu.firstChild);
        }

        let searchTimeout = null;
        let resultMenu = null;

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                const keyword = searchInput.value.trim();
                if (keyword === '<about>') {
                    window.open('https://space.bilibili.com/3461569935575626', '_blank');
                    if (menu && menu.parentNode) {
                        menu.remove();
                    }
                    return;
                }
            }
        });

        searchInput.addEventListener('input', (e) => {
            e.stopPropagation();
            const keyword = e.target.value;
            clearBtn.style.display = keyword ? 'block' : 'none';
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (hasNativeFilter) {
                    performLocalSearch(keyword, menu);
                } else {
                    performGlobalSearch(keyword, menu);
                }
            }, 200);
        });

        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchInput.value = '';
            clearBtn.style.display = 'none';
            if (resultMenu && resultMenu.parentNode) resultMenu.remove();
            if (hasNativeFilter) {
                const items = menu.querySelectorAll('.litemenu-entry:not(.comfyui-search-container):not(.separator)');
                items.forEach(item => {
                    item.style.display = '';
                });
            }
            searchInput.focus();
        });

        function performLocalSearch(keyword, originalMenu) {
            const items = originalMenu.querySelectorAll('.litemenu-entry:not(.comfyui-search-container):not(.separator):not(.comfyui-local-search-hint)');
            const lowerKeyword = keyword.toLowerCase().trim();

            let matchCount = 0;
            items.forEach(item => {
                const text = item.textContent?.trim() || '';
                if (text.toLowerCase().includes(lowerKeyword)) {
                    item.style.display = '';
                    item.style.paddingLeft = '22px';
                    matchCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            let existingHint = originalMenu.querySelector('.comfyui-local-search-hint');
            if (lowerKeyword === '') {
                if (existingHint) existingHint.remove();
                items.forEach(item => {
                    item.style.display = '';
                    item.style.paddingLeft = '';
                });
                return;
            }

            if (!existingHint) {
                existingHint = document.createElement('div');
                existingHint.className = 'comfyui-local-search-hint litemenu-entry';
                existingHint.setAttribute('data-no-index', 'true');
                existingHint.style.cssText = 'background: rgba(102,204,255,0.15); border-bottom: 1px solid rgba(102,204,255,0.3); font-size: 11px; color: #66ccff; padding: 4px 12px; cursor: default;';
                const searchContainerElem = originalMenu.querySelector('.comfyui-search-container');
                if (searchContainerElem && searchContainerElem.nextSibling) {
                    searchContainerElem.parentNode.insertBefore(existingHint, searchContainerElem.nextSibling);
                } else {
                    originalMenu.insertBefore(existingHint, originalMenu.firstChild.nextSibling);
                }
            }
            existingHint.innerHTML = `<i class="fas fa-filter" style="margin-right: 6px;"></i>匹配 ${matchCount} 项`;

            // ===== 强制修复：搜索后重新设置所有菜单项的左边距 =====
            setTimeout(() => {
                console.log('[ComfyUI] 强制修复菜单项样式 (LocalSearch)...');
                const allMenuItems = originalMenu.querySelectorAll('.litemenu-entry:not(.comfyui-search-container):not(.separator):not(.comfyui-local-search-hint)');
                allMenuItems.forEach((item, idx) => {
                    item.style.setProperty('padding-left', '25px', 'important');
                    item.style.setProperty('padding-right', '28px', 'important');
                    if (item.style.display !== 'none') {
                        item.style.setProperty('display', 'flex', 'important');
                        item.style.setProperty('align-items', 'center', 'important');
                        item.style.setProperty('gap', '4px', 'important');
                    }
                    const indexSpan = item.querySelector('.menu-index');
                    if (indexSpan) {
                        indexSpan.style.left = '8px';
                        indexSpan.style.position = 'absolute';
                        indexSpan.style.top = '50%';
                        indexSpan.style.transform = 'translateY(-50%)';
                        indexSpan.style.width = '14px';
                        indexSpan.style.height = '14px';
                    }
                });
                console.log('[ComfyUI] 已修复 ' + allMenuItems.length + ' 个菜单项 (LocalSearch)');
            }, 10);
            // ====================================================
        }

        function performGlobalSearch(keyword, originalMenu) {
            if (resultMenu && resultMenu.parentNode) resultMenu.remove();
            if (!keyword.trim()) return;

            const lowerKeyword = keyword.toLowerCase();

            const folderResults = globalFolderCache.filter(folder =>
                folder.title.toLowerCase().includes(lowerKeyword) ||
                folder.fullPath.toLowerCase().includes(lowerKeyword)
            ).map(f => ({ type: 'folder', ...f }));

            const nodeResults = globalNodesCache.filter(node =>
                node.title.toLowerCase().includes(lowerKeyword) ||
                node.category.toLowerCase().includes(lowerKeyword)
            ).map(n => ({ type: 'node', ...n }));

            const results = [...folderResults, ...nodeResults];
            if (results.length === 0) return;

            resultMenu = document.createElement('div');
            resultMenu.className = 'litegraph litecontextmenu litemenubar-panel';
            resultMenu.style.position = 'fixed';
            resultMenu.style.opacity = '0';
            resultMenu.style.transform = 'scale(0.95) translateY(-8px)';
            resultMenu.style.transition = 'all 0.18s cubic-bezier(0.2, 0.9, 0.4, 1.1)';

            const originalRect = originalMenu.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const maxListHeight = windowHeight - 100 - 40;

            let topPos = originalRect.top;
            const estimatedHeight = Math.min(results.length * 28 + 40, maxListHeight + 40);
            if (topPos + estimatedHeight > windowHeight - 10) {
                topPos = Math.max(10, windowHeight - estimatedHeight - 10);
            }
            if (topPos < 100 && windowHeight - estimatedHeight > 100) {
                topPos = 100;
            }

            resultMenu.style.left = (originalRect.right + 5) + 'px';
            resultMenu.style.top = topPos + 'px';
            resultMenu.style.minWidth = '320px';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'litemenu-entry';
            titleDiv.setAttribute('data-no-index', 'true');
            titleDiv.style.background = 'linear-gradient(90deg, #66ccff20, #3399dd20)';
            titleDiv.style.borderBottom = '1px solid rgba(102,204,255,0.3)';
            titleDiv.style.fontSize = '11px';
            titleDiv.style.color = '#66ccff';
            titleDiv.style.fontWeight = 'bold';
            titleDiv.style.padding = '6px 12px';
            titleDiv.style.cursor = 'default';
            titleDiv.innerHTML = `<i class="fas fa-search" style="margin-right: 6px;"></i>搜索结果 (${results.length}项)`;
            resultMenu.appendChild(titleDiv);

            const resultList = document.createElement('div');
            resultList.className = 'comfyui-result-list';
            resultList.style.maxHeight = maxListHeight + 'px';
            resultList.style.overflowY = 'auto';

            results.forEach((result, idx) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'litemenu-entry comfyui-search-result-item';
                if (result.type === 'folder') {
                    resultItem.classList.add('comfyui-search-result-folder');
                }
                resultItem.style.position = 'relative';
                resultItem.style.paddingLeft = '22px';
                resultItem.style.cursor = 'pointer';

                const indexSpan = document.createElement('span');
                indexSpan.className = 'menu-index';
                indexSpan.textContent = (idx + 1).toString();
                resultItem.appendChild(indexSpan);

                if (result.type === 'folder') {
                    const folderIcon = document.createElement('i');
                    folderIcon.className = 'fas fa-folder';
                    folderIcon.style.position = 'absolute';
                    folderIcon.style.left = '22px';
                    folderIcon.style.top = '50%';
                    folderIcon.style.transform = 'translateY(-50%)';
                    folderIcon.style.fontSize = '11px';
                    folderIcon.style.color = '#ffcc66';
                    resultItem.appendChild(folderIcon);
                }

                const textSpan = document.createElement('span');
                textSpan.style.marginLeft = result.type === 'folder' ? '20px' : '0px';
                textSpan.textContent = result.title;
                resultItem.appendChild(textSpan);

                const pathSpan = document.createElement('span');
                pathSpan.className = 'comfyui-result-path';
                pathSpan.textContent = result.type === 'folder' ? ` ${result.fullPath}` : ` → ${result.category}`;
                resultItem.appendChild(pathSpan);

                if (result.type === 'folder') {
                    const arrowSpan = document.createElement('span');
                    arrowSpan.style.position = 'absolute';
                    arrowSpan.style.right = '8px';
                    arrowSpan.style.top = '50%';
                    arrowSpan.style.transform = 'translateY(-50%)';
                    arrowSpan.style.fontSize = '12px';
                    arrowSpan.style.color = '#88aacc';
                    arrowSpan.innerHTML = '▸';
                    resultItem.appendChild(arrowSpan);
                }

                resultItem.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    console.log(`[ComfyUI] 点了个: ${result.type} - ${result.title}`);

                    if (resultMenu && resultMenu.parentNode) {
                        resultMenu.remove();
                        resultMenu = null;
                    }

                    if (result.type === 'folder') {
                        const subMenu = showFolderContentMenu(result.fullPath, originalMenu, originalRect, 0);
                        if (subMenu) {
                            allOpenMenus.add(subMenu);
                        }
                    } else if (result.type === 'node') {
                        closeAllMenus();
                        if (originalMenu && originalMenu.parentNode) {
                            originalMenu.remove();
                        }
                        createNodeAtCenter(result.nodeType, result.title);
                    }
                });

                resultItem.style.animationDelay = (idx * 15) + 'ms';
                resultList.appendChild(resultItem);
            });

            resultMenu.appendChild(resultList);
            document.body.appendChild(resultMenu);

            requestAnimationFrame(() => {
                resultMenu.style.opacity = '1';
                resultMenu.style.transform = 'scale(1) translateY(0)';
                adjustMenuToFit(resultMenu);
            });

            // ===== 强制修复：搜索后重新设置原始菜单所有菜单项的左边距 =====
            setTimeout(() => {
                console.log('[ComfyUI] 强制修复菜单项样式 (performGlobalSearch)...');
                const allMenuItems = originalMenu.querySelectorAll('.litemenu-entry:not(.comfyui-search-container):not(.separator)');
                allMenuItems.forEach((item, idx) => {
                    item.style.setProperty('padding-left', '25px', 'important');
                    item.style.setProperty('padding-right', '28px', 'important');
                    if (item.style.display !== 'none') {
                        item.style.setProperty('display', 'flex', 'important');
                        item.style.setProperty('align-items', 'center', 'important');
                        item.style.setProperty('gap', '4px', 'important');
                    }
                    const indexSpan = item.querySelector('.menu-index');
                    if (indexSpan) {
                        indexSpan.style.left = '8px';
                        indexSpan.style.position = 'absolute';
                        indexSpan.style.top = '50%';
                        indexSpan.style.transform = 'translateY(-50%)';
                        indexSpan.style.width = '14px';
                        indexSpan.style.height = '14px';
                    }
                });
                console.log('[ComfyUI] 已修复 ' + allMenuItems.length + ' 个菜单项 (performGlobalSearch)');
            }, 50);
            // ====================================================

            const closeHandler = (e) => {
                if (resultMenu && !resultMenu.contains(e.target) && !originalMenu.contains(e.target)) {
                    if (resultMenu && resultMenu.parentNode) resultMenu.remove();
                    resultMenu = null;
                    document.removeEventListener('click', closeHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeHandler), 100);
        }
    }

    // ===== 点击序号弹出复制菜单（内部函数） =====
    function showCopyMenuForItem(menuItem, event) {
        // 获取菜单项文本
        let itemText = '';
        const textSpan = menuItem.querySelector('span:not(.menu-index)');
        if (textSpan) {
            itemText = textSpan.textContent?.trim() || '';
        }
        if (!itemText) {
            itemText = menuItem.textContent?.trim() || '';
            itemText = itemText.replace(/^\d+/, '').trim();
        }
        if (!itemText) return;

        // 移除已存在的复制菜单
        const existingMenu = document.querySelector('.comfyui-index-copy-menu');
        if (existingMenu) existingMenu.remove();

        // 创建复制菜单
        const copyMenu = document.createElement('div');
        copyMenu.className = 'comfyui-index-copy-menu litegraph litecontextmenu litemenubar-panel';
        copyMenu.style.cssText = `
            position: fixed;
            z-index: 999999;
            min-width: 180px;
            max-width: 350px;
            background: linear-gradient(90deg, #0a0a14 0%, #1a1a2e 30%, #252542 70%, #2a2a4a 100%);
            border: 1px solid rgba(102,204,255,0.35);
            box-shadow: 0 8px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(102,204,255,0.15) inset;
            border-radius: 6px;
            padding: 4px 0;
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
            transition: all 0.18s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        `;

        // 计算位置（在序号附近）
        const indexSpan = menuItem.querySelector('.menu-index');
        if (!indexSpan) return;
        const rect = indexSpan.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let left = rect.right + 5;
        let top = rect.top - 5;

        const estimatedHeight = 80;
        if (top + estimatedHeight > winHeight - 10) {
            top = winHeight - estimatedHeight - 10;
        }
        if (left + 190 > winWidth - 10) {
            left = rect.left - 190;
        }
        if (top < 10) top = 10;
        if (left < 10) left = 10;

        copyMenu.style.left = left + 'px';
        copyMenu.style.top = top + 'px';

        // 检查是否为文件夹
        const isFolder = menuItem.classList.contains('has_submenu');
        let fullPath = itemText;
        if (isFolder) {
            for (const folder of globalFolderCache) {
                if (folder.title === itemText) {
                    fullPath = folder.fullPath;
                    break;
                }
            }
        }

        // 菜单项：复制名称
        const copyNameOption = document.createElement('div');
        copyNameOption.className = 'litemenu-entry';
        copyNameOption.style.cssText = `
            padding: 6px 16px 6px 28px;
            cursor: pointer;
            color: #e0e0e0;
            font-size: 12px;
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.1s ease;
            border-radius: 3px;
            margin: 1px 4px;
        `;
        copyNameOption.innerHTML = `
            <i class="fas fa-copy" style="font-size: 12px; color: #66ccff; position: absolute; left: 8px; top: 50%; transform: translateY(-50%);"></i>
            <span>复制名称: <span style="color: #66ccff;">${itemText}</span></span>
        `;
        copyNameOption.onmouseover = () => {
            copyNameOption.style.background = 'rgba(102,204,255,0.2)';
        };
        copyNameOption.onmouseout = () => {
            copyNameOption.style.background = 'transparent';
        };
        copyNameOption.onclick = (ev) => {
            ev.stopPropagation();
            const text = itemText;
            navigator.clipboard.writeText(text).then(() => {
                showElegantToast(`已复制: ${text}`, 'success');
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showElegantToast(`已复制: ${text}`, 'success');
            });
            if (copyMenu.parentNode) copyMenu.remove();
        };
        copyMenu.appendChild(copyNameOption);

        // 如果是文件夹，加个复制完整路径的选项
        if (isFolder && fullPath !== itemText) {
            const copyPathOption = document.createElement('div');
            copyPathOption.className = 'litemenu-entry';
            copyPathOption.style.cssText = `
                padding: 6px 16px 6px 28px;
                cursor: pointer;
                color: #e0e0e0;
                font-size: 12px;
                position: relative;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.1s ease;
                border-radius: 3px;
                margin: 1px 4px;
            `;
            copyPathOption.innerHTML = `
                <i class="fas fa-sitemap" style="font-size: 12px; color: #ffcc66; position: absolute; left: 8px; top: 50%; transform: translateY(-50%);"></i>
                <span>复制完整路径: <span style="color: #ffcc66;">${fullPath}</span></span>
            `;
            copyPathOption.onmouseover = () => {
                copyPathOption.style.background = 'rgba(255,204,102,0.2)';
            };
            copyPathOption.onmouseout = () => {
                copyPathOption.style.background = 'transparent';
            };
            copyPathOption.onclick = (ev) => {
                ev.stopPropagation();
                const text = fullPath;
                navigator.clipboard.writeText(text).then(() => {
                    showElegantToast(`已复制: ${text}`, 'success');
                }).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showElegantToast(`已复制: ${text}`, 'success');
                });
                if (copyMenu.parentNode) copyMenu.remove();
            };
            copyMenu.appendChild(copyPathOption);
        }

        document.body.appendChild(copyMenu);

        requestAnimationFrame(() => {
            copyMenu.style.opacity = '1';
            copyMenu.style.transform = 'scale(1) translateY(0)';
        });

        // 点击其他地方关闭
        const closeCopyMenu = (ev) => {
            if (copyMenu.parentNode && !copyMenu.contains(ev.target)) {
                copyMenu.remove();
                document.removeEventListener('click', closeCopyMenu);
                document.removeEventListener('contextmenu', closeCopyMenu);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeCopyMenu);
            document.addEventListener('contextmenu', closeCopyMenu);
        }, 50);
    }

    function addMenuIconsAndIndexes() {
        const menus = document.querySelectorAll('.litecontextmenu');
        const rootMenus = Array.from(menus);
        rootMenus.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);

        for (const menu of menus) {
            if (menu === rootMenus[0] && !searchBoxAdded) {
                addSearchBox(menu);
                searchBoxAdded = true;
            }

            const items = menu.querySelectorAll('.litemenu-entry:not(.separator)');
            let index = 1;
            for (const item of items) {
                if (item.querySelector('.menu-index')) continue;
                if (item.hasAttribute('data-no-index')) continue;

                const indexSpan = document.createElement('span');
                indexSpan.className = 'menu-index';
                indexSpan.textContent = index.toString();
                indexSpan.style.cursor = 'pointer';
                indexSpan.title = '点击复制此菜单项';
                // 阻止序号点击冒泡到菜单项
                indexSpan.addEventListener('mousedown', function(e) {
                    e.stopPropagation();
                }, true);
                indexSpan.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    showCopyMenuForItem(item, e);
                }, true);
                item.style.position = 'relative';
                item.insertBefore(indexSpan, item.firstChild);
                item.setAttribute('data-index-added', 'true');

                if (item.classList.contains('has_submenu') && !item.querySelector('.fa-folder')) {
                    // 为文件夹菜单项强制加过渡动画
                    item.style.transition = 'background 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1), border-left-color 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1) !important';

                    // 加悬浮高亮样式
                    item.addEventListener('mouseenter', function() {
                        if (!this.classList.contains('comfyui-highlight-current') && !this.classList.contains('comfyui-highlight-ancestor')) {
                            this.style.setProperty('background', 'linear-gradient(90deg, rgba(218,165,32,0.55) 0%, rgba(218,165,32,0.45) 50%, rgba(218,165,32,0.55) 100%)', 'important');
                            this.style.setProperty('border-left-color', '#daa520', 'important');
                            this.style.setProperty('border-left-width', '2px', 'important');
                        }
                    });
                    item.addEventListener('mouseleave', function() {
                        if (!this.classList.contains('comfyui-highlight-current') && !this.classList.contains('comfyui-highlight-ancestor')) {
                            this.style.removeProperty('background');
                            this.style.removeProperty('border-left-color');
                            this.style.removeProperty('border-left-width');
                        }
                    });

                    const folderIcon = document.createElement('i');
                    folderIcon.className = 'fas fa-folder';
                    folderIcon.style.position = 'absolute';
                    folderIcon.style.right = '8px';
                    folderIcon.style.top = '50%';
                    folderIcon.style.transform = 'translateY(-50%)';
                    folderIcon.style.fontSize = '11px';
                    item.appendChild(folderIcon);

                    const folderOpenIcon = document.createElement('i');
                    folderOpenIcon.className = 'fas fa-folder-open';
                    folderOpenIcon.style.position = 'absolute';
                    folderOpenIcon.style.right = '8px';
                    folderOpenIcon.style.top = '50%';
                    folderOpenIcon.style.transform = 'translateY(-50%)';
                    folderOpenIcon.style.fontSize = '11px';
                    folderOpenIcon.style.display = 'none';
                    item.appendChild(folderOpenIcon);

                    const updateIcon = () => {
                        const expanded = item.getAttribute('aria-expanded') === 'true';
                        folderIcon.style.display = expanded ? 'none' : 'inline-block';
                        folderOpenIcon.style.display = expanded ? 'inline-block' : 'none';
                    };
                    updateIcon();
                    new MutationObserver(updateIcon).observe(item, { attributes: true, attributeFilter: ['aria-expanded'] });
                }
                index++;
            }
        }
        // 加完图标可能改变高度，调整所有菜单
        adjustAllMenus();
    }

    // ==================== 右键菜单路径高亮 + 点击序号复制 ====================
    let clickHistory = [];
    let lastClickTime = 0;

    function clearAllHighlights() {
        // 清除类名高亮
        document.querySelectorAll(`.${HIGHLIGHT_CLASS}, .${ANCESTOR_CLASS}`).forEach(el => {
            el.classList.remove(HIGHLIGHT_CLASS, ANCESTOR_CLASS);
        });
        // 清除所有菜单项的内联高亮样式（金色背景+左边框）
        document.querySelectorAll('.litemenu-entry.has_submenu').forEach(el => {
            el.style.removeProperty('background');
            el.style.removeProperty('border-left-color');
            el.style.removeProperty('border-left-width');
        });
        clickHistory = [];
    }
    function onMenuItemClick(menuItem) {
        const now = Date.now();
        if (now - lastClickTime < 100) return;
        lastClickTime = now;
        const text = menuItem.textContent?.trim();

        // 点击菜单项后，等待一小段时间让 DOM 更新 aria-expanded 状态
        setTimeout(() => {
            // 先清除所有视觉高亮
            document.querySelectorAll(`.${HIGHLIGHT_CLASS}, .${ANCESTOR_CLASS}`).forEach(el => {
                el.classList.remove(HIGHLIGHT_CLASS, ANCESTOR_CLASS);
            });
            document.querySelectorAll('.litemenu-entry.has_submenu').forEach(el => {
                el.style.removeProperty('background');
                el.style.removeProperty('border-left-color');
                el.style.removeProperty('border-left-width');
            });

            // 找到所有展开的菜单项，给它们加高亮
            const allExpanded = document.querySelectorAll('.litemenu-entry.has_submenu[aria-expanded="true"]');

            // 清空历史
            clickHistory = [];

            // 给所有展开的菜单项加高亮
            allExpanded.forEach(el => {
                clickHistory.push({ element: el, text: el.textContent?.trim() || '', timestamp: now });
                el.classList.add(HIGHLIGHT_CLASS);
            });
        }, 50);
    }
    function setupClickListeners() {
        document.body.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.litemenu-entry.submenu.has_submenu');
            if (menuItem && !menuItem.closest('.comfyui-search-container') && !menuItem.closest('.comfyui-search-result-item')) {
                // 让 onMenuItemClick 全权管理高亮
                onMenuItemClick(menuItem);
            }
        }, true);
    }

    function setupCloseListener() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.comfyui-menu-buttons')) {
                return;
            }
            if (!e.target.closest('.litemenu-entry') && !e.target.closest('.litecontextmenu')) {
                setTimeout(() => {
                    if (document.querySelectorAll('.litecontextmenu').length === 0) {
                        clearAllHighlights();
                        searchBoxAdded = false;
                        closeAllMenus();
                    }
                }, 100);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setTimeout(() => {
                    if (document.querySelectorAll('.litecontextmenu').length === 0) {
                        clearAllHighlights();
                        searchBoxAdded = false;
                        closeAllMenus();
                    }
                }, 50);
            }
        });
    }

    function setupMutationObserverCleanup() {
        const observer = new MutationObserver(() => {
            const validHistory = clickHistory.filter(item => item.element && document.body.contains(item.element));
            if (validHistory.length !== clickHistory.length) {
                clickHistory = validHistory;
                applyHighlightsFromHistory();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupMenuObserver() {
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                addMenuIconsAndIndexes();
                document.querySelectorAll('.litecontextmenu').forEach(menu => {
                    addMenuToolbar(menu);
                });
                adjustAllMenus();
            }, 50);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            addMenuIconsAndIndexes();
            document.querySelectorAll('.litecontextmenu').forEach(menu => {
                addMenuToolbar(menu);
            });
            adjustAllMenus();
        }, 200);
    }

    // ==================== 工作流路径复制 + WebSocket通知 ====================
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showElegantToast(`已复制路径：${text}`, 'success');
        } catch (err) {
            console.error('[ComfyUI] 复制翻车:', err);
            showElegantToast('复制失败，请手动复制路径：' + text, 'error');
        }
    }

    function sendWebSocketNotification(workflowName, filePath) {
        let ws = null;
        if (window.ws && window.ws.readyState === WebSocket.OPEN) {
            ws = window.ws;
        } else if (window.app && window.app.websocket && window.app.websocket.readyState === WebSocket.OPEN) {
            ws = window.app.websocket;
        }
        if (ws) {
            const msg = JSON.stringify({
                type: 'open_workflow_folder',
                workflow: workflowName,
                path: filePath
            });
            ws.send(msg);
            console.log('[ComfyUI] 已发送 WebSocket 消息:', msg);
        } else {
            console.warn('[ComfyUI] 没找到可用的 WebSocket 连接，通知发不出去');
        }
    }

    async function onRevealInFolderClick(workflowName) {
        if (!workflowName || workflowName === 'Unsaved Workflow') {
            showElegantToast('当前工作流还没存到磁盘，先保存一下再搞', 'warning');
            return;
        }

        let workflowsDir = WORKFLOWS_DIR;
        if (!workflowsDir) {
            console.log('[ComfyUI] 等着拿工作流目录...');
            workflowsDir = await workflowsDirPromise;
        }

        let fileName = workflowName;
        if (!fileName.endsWith('.json')) fileName += '.json';
        const fullPath = workflowsDir + '\\' + fileName;
        console.log('[ComfyUI] 拼出来的文件路径:', fullPath);

        try {
            const response = await fetch('http://127.0.0.1:8765/open_workflow_folder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: fullPath })
            });
            if (response.ok) {
                console.log('[ComfyUI] HTTP请求成功，電籽启动器已处理');
            } else {
                console.warn('[ComfyUI] HTTP请求返回状态:', response.status);
            }
        } catch (err) {
            console.warn('[ComfyUI] HTTP请求跪了，看看電籽启动器开了没', err);
            showElegantToast('连不上電籽启动器后端，请确保它正在运行', 'error');
        }
    }

    function getCurrentWorkflowName() {
        const activeTabBtn = document.querySelector('.p-togglebutton[aria-pressed="true"] .workflow-tab');
        if (activeTabBtn) {
            const labelSpan = activeTabBtn.querySelector('.workflow-label');
            if (labelSpan && labelSpan.textContent.trim()) {
                let name = labelSpan.textContent.trim();
                if (name !== 'Unsaved Workflow' && !name.includes('Unsaved')) {
                    return name;
                }
            }
        }
        if (window.app && window.app.graph && window.app.graph.workflow && window.app.graph.workflow.file_path) {
            const filePath = window.app.graph.workflow.file_path;
            const fileName = filePath.split('\\').pop().split('/').pop();
            if (fileName && fileName !== 'Untitled' && !fileName.includes('Unsaved')) {
                return fileName;
            }
        }
        return null;
    }

    function injectWorkflowPathMenuItem(menuElement, workflowName) {
        if (menuElement.querySelector('.comfyui-reveal-path-item')) return;
        const closeOtherItem = Array.from(menuElement.querySelectorAll('[role="menuitem"]'))
            .find(item => item.textContent.includes('关闭其他标签'));
        const targetAnchor = closeOtherItem || menuElement.querySelector('[role="menuitem"]:last-child');
        if (!targetAnchor) return;

        const separator = document.createElement('div');
        separator.setAttribute('role', 'separator');
        separator.className = 'mx-2 my-1 h-px bg-secondary-background-hover';
        separator.style.cssText = 'opacity: 0; transform: scaleX(0); transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1); transform-origin: left;';
        targetAnchor.insertAdjacentElement('afterend', separator);

        const editItem = document.createElement('div');
        editItem.setAttribute('role', 'menuitem');
        editItem.className = 'comfyui-edit-workflow-item flex min-h-6 items-center gap-2 self-stretch rounded-sm p-2 outline-none cursor-pointer data-highlighted:bg-secondary-background-hover hover:bg-secondary-background-hover';
        editItem.style.cssText = 'opacity: 0; transform: translateX(-12px); transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);';
        editItem.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 28 28" fill="currentColor" style="width: 14px; height: 14px;"><path d="M26.5542 4.34393C26.2719 4.20592 26.1506 4.46928 25.9856 4.60268C25.9292 4.64581 25.8815 4.70216 25.8338 4.75391C25.4215 5.19438 24.9396 5.48361 24.3105 5.44911C23.3905 5.39736 22.605 5.68659 21.9104 6.39041C21.7626 5.52271 21.2721 5.00462 20.5258 4.67226C20.1353 4.49976 19.7403 4.32668 19.4666 3.95119C19.2757 3.68381 19.2234 3.38595 19.1279 3.09211C19.0669 2.91501 19.0066 2.73388 18.8024 2.7034C18.5811 2.6689 18.4942 2.85463 18.4074 3.00989C18.0601 3.6447 17.9255 4.34393 17.9388 5.05235C17.9692 6.64572 18.642 7.91478 19.9789 8.81756C20.1307 8.92106 20.1698 9.02457 20.1221 9.1758C20.0307 9.48688 19.9226 9.78876 19.8271 10.0998C19.7662 10.2982 19.6753 10.3419 19.4626 10.2551C18.7288 9.94862 18.0952 9.49493 17.5351 8.94694C16.5846 8.02749 15.7249 7.01258 14.6531 6.21791C14.4013 6.03218 14.1494 5.85967 13.8889 5.69522C12.7952 4.63316 14.0321 3.76086 14.3185 3.65736C14.618 3.54925 14.4225 3.17779 13.4548 3.18239C12.487 3.18642 11.6015 3.51073 10.4727 3.94256C10.3077 4.00754 10.1341 4.05469 9.95637 4.09379C8.93227 3.89944 7.86849 3.85631 6.75755 3.98167C4.66564 4.21455 2.99464 5.20358 1.7664 6.89183C0.290908 8.92106 -0.0564026 11.2269 0.368535 13.6316C0.815324 16.1663 2.10911 18.2645 4.09695 19.905C6.15838 21.6059 8.53263 22.4397 11.2415 22.2799C12.8867 22.185 14.7181 21.9648 16.7841 20.2161C17.3051 20.4755 17.8519 20.579 18.7587 20.6566C19.4574 20.7216 20.1302 20.6221 20.6511 20.514C21.4671 20.3415 21.4107 19.5859 21.1157 19.4473C18.7242 18.3335 19.2492 18.7866 18.772 18.4198C19.987 16.9822 21.8431 14.4269 22.4158 10.9474C22.4722 10.5633 22.5441 10.0222 22.5355 9.71114C22.5309 9.52138 22.5746 9.44778 22.7913 9.42593C23.3905 9.35693 23.9718 9.19305 24.506 8.89921C26.0557 8.05279 26.6808 6.6624 26.828 4.996C26.8498 4.74126 26.8234 4.47791 26.5542 4.34393ZM13.0511 19.3438C10.7332 17.5216 9.60906 16.9219 9.14502 16.9477C8.71089 16.9736 8.78909 17.4704 8.88454 17.7942C8.98459 18.1139 9.11455 18.3341 9.29683 18.6147C9.42276 18.8004 9.50959 19.0764 9.1709 19.284C8.42453 19.7458 7.12671 19.1288 7.06576 19.0983C5.55519 18.2087 4.29245 17.0346 3.40233 15.4285C2.54268 13.8829 2.04356 12.2245 1.96133 10.4546C1.93948 10.0274 2.06541 9.87617 2.49092 9.79854C3.05099 9.69504 3.62831 9.67319 4.1878 9.75541C6.55342 10.101 8.56713 11.1585 10.2554 12.8341C11.2191 13.788 11.9482 14.9283 12.6992 16.0421C13.4979 17.2249 14.357 18.3519 15.4512 19.276C15.8377 19.5997 16.1459 19.8458 16.4408 20.0275C15.5513 20.127 14.0666 20.1483 13.0511 19.345V19.3438ZM14.162 12.1981C14.162 12.0083 14.3139 11.8571 14.5048 11.8571C14.5479 11.8571 14.587 11.8657 14.6221 11.8784C14.6698 11.8956 14.7135 11.9215 14.748 11.9606C14.8089 12.021 14.8434 12.1072 14.8434 12.1981C14.8434 12.3878 14.6916 12.5391 14.5007 12.5391C14.3098 12.5391 14.162 12.3878 14.162 12.1981ZM17.6127 13.968C17.3913 14.0588 17.17 14.1365 16.9572 14.1451C16.6271 14.1623 16.2672 14.0284 16.0717 13.8645C15.7681 13.6098 15.5507 13.4671 15.4599 13.0227C15.4208 12.8329 15.4426 12.5391 15.4771 12.3706C15.5553 12.0078 15.4685 11.7749 15.2126 11.5633C15.0045 11.3908 14.7394 11.343 14.4484 11.343C14.3397 11.343 14.2403 11.2953 14.1661 11.2568C14.0447 11.1964 13.9447 11.0452 14.0401 10.8594C14.0706 10.7991 14.2184 10.6524 14.2529 10.6266C14.6479 10.4017 15.1034 10.4753 15.5248 10.6438C15.9153 10.8037 16.2108 11.0969 16.6358 11.5115C17.0699 12.0124 17.1481 12.1504 17.3954 12.5264C17.5909 12.8203 17.7686 13.1221 17.8905 13.4677C17.9641 13.6834 17.8686 13.8599 17.6127 13.968Z" fill="currentColor"></svg>
            <span class="flex-1">使用AI编辑此工作流</span>
        `;
        editItem.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const name = getCurrentWorkflowName();
            let workflowFilePath = null;
            if (name && name !== 'Unsaved Workflow' && !name.includes('Unsaved')) {
                let fileName = name;
                if (!fileName.endsWith('.json')) fileName += '.json';
                workflowFilePath = WORKFLOWS_DIR + '\\' + fileName;
            }
            if (!workflowFilePath && window.app && window.app.graph && window.app.graph.workflow) {
                if (window.app.graph.workflow.file_path) {
                    workflowFilePath = window.app.graph.workflow.file_path;
                }
            }
            if (!workflowFilePath) {
                showElegantToast('先保存当前工作流（Ctrl+S），再用 Deepseek AI 编辑。保存后名字会以 .json 结尾，電籽启动器AI 才能找到文件哦', 'warning');
                return;
            }
            try {
                const workflow = await window.app.graph.serialize();
                const response = await fetch('http://127.0.0.1:8765/ai_generate_workflow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workflow_json: JSON.stringify(workflow),
                        workflow_file_path: workflowFilePath
                    })
                });
                if (response.ok) {
                    console.log('[ComfyUI] AI 工作流编辑请求已发（编辑器模式）');
                    if (menuElement && menuElement.parentNode) menuElement.remove();
                } else {
                    console.warn('[ComfyUI] 请求失败:', response.status);
                }
            } catch (err) {
                console.error('[ComfyUI] 发送请求翻车:', err);
                showElegantToast('啊啊啊，连不上電籽启动器后端，请确保它开了', 'error');
            }
        });
        separator.insertAdjacentElement('afterend', editItem);

        const newItem = document.createElement('div');
        newItem.setAttribute('role', 'menuitem');
        newItem.className = 'comfyui-reveal-path-item flex min-h-6 items-center gap-2 self-stretch rounded-sm p-2 outline-none cursor-pointer data-highlighted:bg-secondary-background-hover hover:bg-secondary-background-hover';
        newItem.style.cssText = 'opacity: 0; transform: translateX(-12px); transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);';
        newItem.innerHTML = `
            <i class="fas fa-folder-open" style="width: 16px;"></i>
            <span class="flex-1">打开此json工作流在磁盘上的位置</span>
        `;
        newItem.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const name = getCurrentWorkflowName();
            await onRevealInFolderClick(name);
            if (menuElement && menuElement.parentNode) menuElement.remove();
        });
        editItem.insertAdjacentElement('afterend', newItem);

        // 入场动画
        requestAnimationFrame(() => {
            separator.style.opacity = '1';
            separator.style.transform = 'scaleX(1)';
            setTimeout(() => {
                editItem.style.opacity = '1';
                editItem.style.transform = 'translateX(0)';
                setTimeout(() => {
                    newItem.style.opacity = '1';
                    newItem.style.transform = 'translateX(0)';
                }, 60);
            }, 60);
        });
    }

    let workflowInjectionSetupDone = false;

    function setupWorkflowMenuInjection() {
        if (workflowInjectionSetupDone) return;
        workflowInjectionSetupDone = true;

        let pendingWorkflowName = null;
        document.addEventListener('contextmenu', (e) => {
            const tab = e.target.closest('.workflow-tab');
            if (tab) {
                const labelSpan = tab.querySelector('.workflow-label');
                pendingWorkflowName = labelSpan ? labelSpan.textContent.trim() : null;
                setTimeout(() => {
                    const menu = document.querySelector('div[data-reka-menu-content][role="menu"]');
                    if (menu && pendingWorkflowName) {
                        injectWorkflowPathMenuItem(menu, pendingWorkflowName);
                    }
                }, 150);
            }
        });
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.matches && node.matches('div[data-reka-menu-content][role="menu"]')) {
                        const workflowName = getCurrentWorkflowName();
                        if (workflowName) injectWorkflowPathMenuItem(node, workflowName);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 注入关于菜单项到帮助菜单 (新PrimeVue菜单系统)
        function injectAboutMenuItem() {
            const helpItems = document.querySelectorAll('li.p-tieredmenu-item[aria-label="帮助"]');
            for (const helpItem of helpItems) {
                if (helpItem.querySelector('.comfyui-about-menu-item')) continue;
                const parentMenu = helpItem.closest('ul.p-tieredmenu-root-list') || helpItem.closest('.p-tieredmenu');
                if (!parentMenu) continue;
                const afterHelp = helpItem.nextElementSibling;
                const aboutItem = document.createElement('li');
                aboutItem.className = 'p-tieredmenu-item comfyui-about-menu-item';
                aboutItem.setAttribute('role', 'menuitem');
                aboutItem.setAttribute('aria-label', '关于 電籽ComfyUI web前端');
                aboutItem.style.cssText = 'opacity: 0; transform: translateX(-8px); transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);';
                aboutItem.innerHTML = `
                    <div class="p-tieredmenu-item-content" data-pc-section="itemcontent">
                        <a class="p-menubar-item-link px-4 py-2 p-tieredmenu-item-link" tabindex="-1" data-pc-section="itemlink" style="cursor:pointer;">
                            <span class="p-menubar-item-label text-nowrap">关于 電籽ComfyUI web前端</span>
                        </a>
                    </div>
                `;
                aboutItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    showSimpleAboutDialog();
                });
                if (afterHelp) {
                    parentMenu.insertBefore(aboutItem, afterHelp);
                } else {
                    parentMenu.appendChild(aboutItem);
                }
                requestAnimationFrame(() => {
                    aboutItem.style.opacity = '1';
                    aboutItem.style.transform = 'translateX(0)';
                });
            }
        }

        function showSimpleAboutDialog() {
            const existing = document.querySelector('.comfyui-about-dialog');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.className = 'comfyui-about-dialog';
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.6);
                backdrop-filter: blur(6px);
                animation: comfyui-aboutFadeIn 0.25s ease-out forwards;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                display: flex;
                flex-direction: row;
                background: #0d0d1a;
                border: 1px solid rgba(102,204,255,0.25);
                border-radius: 8px;
                max-width: 720px;
                width: 90%;
                box-shadow: 0 24px 80px rgba(0,0,0,0.8);
                transform: scale(0.92);
                animation: comfyui-aboutZoomIn 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
                overflow: hidden;
            `;

            // 左侧 - 头像和基本信息
            const leftPanel = document.createElement('div');
            const isSquareMode = localStorage.getItem('comfyui_square_mode') === 'true';
            leftPanel.style.cssText = `
                flex: 0 0 200px;
                background: linear-gradient(180deg, #0a0a18, #15152a);
                padding: 28px 20px 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                border-right: 1px solid rgba(102,204,255,0.12);
            `;
            leftPanel.innerHTML = `
                <div id="comfyui-avatar-wrapper" style="width: 72px; height: 72px; border-radius: ${isSquareMode ? '0px' : '12px'}; overflow: hidden; border: 2px solid rgba(102,204,255,0.3); flex-shrink: 0; margin-bottom: 14px; transition: border-radius 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);">
                    <img src="https://raw.githubusercontent.com/xxdz-Official/xxdzComfyUIrun/refs/heads/main/img/xxdz.png" alt="头像" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                </div>
                <div style="font-size: 14px; font-weight: 600; color: #66ccff; letter-spacing: 0.5px; margin-bottom: 2px;">小小电子xxdz</div>
                <div style="font-size: 11px; color: #6688aa; margin-bottom: 10px;">電籽ComfyUI web前端</div>
                <div style="font-size: 11px; color: #556677; margin-bottom: 14px;">v8.6.5</div>
                <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid rgba(102,204,255,0.08);">
                        <label style="color: #6688aa; font-size: 11px; cursor: pointer; display: flex; align-items: center; user-select: none;">
                            <span style="font-size: 11px; color: #6688aa;">开启直角磁贴风格</span>
                        </label>
                        <div id="comfyui-square-toggle" style="position: relative; width: 40px; height: 22px; background: ${isSquareMode ? '#66ccff' : '#3a3a5a'}; border-radius: ${isSquareMode ? '0px' : '11px'}; cursor: pointer; transition: background 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), border-radius 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), border-color 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); flex-shrink: 0; border: 1px solid rgba(102,204,255,${isSquareMode ? '0.5' : '0.2'});">
                            <div id="comfyui-square-handle" style="position: absolute; top: 2px; left: ${isSquareMode ? '22px' : '2px'}; width: 16px; height: 16px; background: #ffffff; border-radius: ${isSquareMode ? '0px' : '50%'}; transition: left 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), border-radius 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
                        </div>
                    </div>
                    <a href="https://space.bilibili.com/3461569935575626" target="_blank" style="color: #66ccff; font-size: 11px; text-decoration: none; padding: 4px 0; border-bottom: 1px solid rgba(102,204,255,0.08); transition: all 0.15s; display: flex; align-items: center; gap: 6px;" onmouseover="this.style.color='#88ddff'; this.style.borderBottomColor='rgba(102,204,255,0.3)';" onmouseout="this.style.color='#66ccff'; this.style.borderBottomColor='rgba(102,204,255,0.08)';">
                        <span style="font-size: 12px;">B站</span>
                        <span style="font-size: 10px; color: #445566; flex:1; text-align: right;">→</span>
                    </a>
                    <a href="https://xxdz-official.github.io/x" target="_blank" style="color: #66ccff; font-size: 11px; text-decoration: none; padding: 4px 0; border-bottom: 1px solid rgba(102,204,255,0.08); transition: all 0.15s; display: flex; align-items: center; gap: 6px;" onmouseover="this.style.color='#88ddff'; this.style.borderBottomColor='rgba(102,204,255,0.3)';" onmouseout="this.style.color='#66ccff'; this.style.borderBottomColor='rgba(102,204,255,0.08)';">
                        <span style="font-size: 12px;">个人网站</span>
                        <span style="font-size: 10px; color: #445566; flex:1; text-align: right;">→</span>
                    </a>
                    <a href="https://xxdz-official.github.io/x" target="_blank" style="color: #66ccff; font-size: 11px; text-decoration: none; padding: 4px 0; border-bottom: 1px solid rgba(102,204,255,0.08); transition: all 0.15s; display: flex; align-items: center; gap: 6px;" onmouseover="this.style.color='#88ddff'; this.style.borderBottomColor='rgba(102,204,255,0.3)';" onmouseout="this.style.color='#66ccff'; this.style.borderBottomColor='rgba(102,204,255,0.08)';">
                        <span style="font-size: 12px;">電籽启动器</span>
                        <span style="font-size: 10px; color: #445566; flex:1; text-align: right;">→</span>
                    </a>
                </div>
            `;

            // 右侧 - 功能说明
            const rightPanel = document.createElement('div');
            rightPanel.style.cssText = `
                flex: 1;
                padding: 24px 28px 24px 24px;
                background: #0d0d1a;
                min-width: 0;
            `;
            rightPanel.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid rgba(102,204,255,0.1); padding-bottom: 10px;">
                    <img src="https://xxdz-official.github.io/xxdzComfyUIrun/img/xxdz%20studio%20loge3.0.ico" alt="图标" style="width: 20px; height: 20px; flex-shrink: 0;">
                    <span style="font-size: 13px; font-weight: 500; color: #88bbdd; letter-spacing: 0.3px;">关于</span>
                </div>
                <div style="font-size: 12px; color: #99aabb; line-height: 1.7; max-height: 320px; overflow-y: auto; padding-right: 4px; white-space: pre-wrap; word-break: break-word;">${ABOUT_TEXT.replace(/	(首先|第二|第三|第四|第五|第六|第七|第八|第九|第十|第十一|第十二)/g, '<b style="color:#66ccff;">$1</b>')}</div>
                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(102,204,255,0.08); display: flex; justify-content: flex-end;">
                    <button class="comfyui-about-close-btn" style="
                        background: rgba(102,204,255,0.08);
                        border: 1px solid rgba(102,204,255,0.2);
                        border-radius: 4px;
                        color: #88bbdd;
                        padding: 5px 20px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-family: inherit;
                    " onmouseover="this.style.background='rgba(102,204,255,0.2)'; this.style.color='#66ccff';" onmouseout="this.style.background='rgba(102,204,255,0.08)'; this.style.color='#88bbdd';">欧 了</button>
                </div>
            `;

            dialog.appendChild(leftPanel);
            dialog.appendChild(rightPanel);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 直角磁贴风格开关（滑块）
            const toggleSlider = document.getElementById('comfyui-square-toggle');
            if (toggleSlider) {
                const handle = document.getElementById('comfyui-square-handle');
                const avatarWrapper = document.getElementById('comfyui-avatar-wrapper');
                // 初始状态
                const squareStyle = document.getElementById('comfyui-square-style');
                const isChecked = localStorage.getItem('comfyui_square_mode') === 'true';
                if (isChecked) {
                    if (!squareStyle) {
                        const styleEl = document.createElement('style');
                        styleEl.id = 'comfyui-square-style';
                        styleEl.textContent = `* { border-radius: 0 !important; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; }`;
                        document.head.appendChild(styleEl);
                    }
                    if (avatarWrapper) {
                        avatarWrapper.style.borderRadius = '12px';
                    }
                } else {
                    if (squareStyle) squareStyle.remove();
                    if (avatarWrapper) {
                        avatarWrapper.style.borderRadius = '50%';
                    }
                }

                let isAnimating = false;

                toggleSlider.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (isAnimating) return;
                    isAnimating = true;

                    const checked = localStorage.getItem('comfyui_square_mode') === 'true';
                    const newChecked = !checked;

                    // 更新滑块样式
                    this.style.background = newChecked ? '#66ccff' : '#3a3a5a';
                    this.style.borderColor = newChecked ? 'rgba(102,204,255,0.5)' : 'rgba(102,204,255,0.2)';
                    this.style.borderRadius = newChecked ? '0px' : '11px';
                    if (handle) {
                        handle.style.left = newChecked ? '22px' : '2px';
                        handle.style.borderRadius = newChecked ? '0px' : '50%';
                    }
                    // 头像圆角同步（无动画）
                    if (avatarWrapper) {
                        avatarWrapper.style.borderRadius = newChecked ? '0px' : '12px';
                    }

                    // 动画完成后执行开关逻辑
                    setTimeout(function() {
                        localStorage.setItem('comfyui_square_mode', String(newChecked));
                        let styleEl = document.getElementById('comfyui-square-style');
                        if (newChecked) {
                            if (!styleEl) {
                                styleEl = document.createElement('style');
                                styleEl.id = 'comfyui-square-style';
                                styleEl.textContent = `* { border-radius: 0 !important; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; }`;
                                document.head.appendChild(styleEl);
                            }
                            console.log('okok，電籽web磁贴成功');
                        } else {
                            if (styleEl) styleEl.remove();
                        }
                        isAnimating = false;
                    }, 410);
                });
            }

            const closeBtn = dialog.querySelector('.comfyui-about-close-btn');
            const closeDialog = function() {
                overlay.style.animation = 'comfyui-aboutFadeOut 0.2s ease-in forwards';
                setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 250);
            };
            closeBtn.addEventListener('click', closeDialog);
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeDialog();
            });
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    closeDialog();
                    document.removeEventListener('keydown', handler);
                }
            });
        }

        if (!document.getElementById('comfyui-about-anim-style')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'comfyui-about-anim-style';
            animStyle.textContent = `
                @keyframes comfyui-aboutFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes comfyui-aboutFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes comfyui-aboutZoomIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(animStyle);
        }

        setTimeout(injectAboutMenuItem, 500);

        // 监听整个菜单的出现，像工作流标签菜单那样处理
        const menuObserver = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.matches && node.matches('.p-tieredmenu')) {
                        setTimeout(injectAboutMenuItem, 200);
                    }
                }
            }
        });
        menuObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ==================== 初始化 ====================
    async function init() {
        // 自动应用直角磁贴风格（如果之前开启过）
        if (localStorage.getItem('comfyui_square_mode') === 'true') {
            if (!document.getElementById('comfyui-square-style')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'comfyui-square-style';
                styleEl.textContent = `* { border-radius: 0 !important; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; }`;
                document.head.appendChild(styleEl);
                console.log('okok，電籽web磁贴成功');
            }
        }

        loadFontAwesome();
        await waitForLiteGraph();
        await waitForApp();
        buildGlobalNodeCache();

        setupClickListeners();
        setupCloseListener();
        setupMutationObserverCleanup();
        setupMenuObserver();
        setupWorkflowMenuInjection();

        // 添加 AI生成工作流按钮（生成器模式）
        function addAiWorkflowButton() {
            if (document.getElementById('comfyui-ai-workflow-btn')) return;
            const toolbar = document.querySelector('.workflow-tabs-container .flex.h-full.items-center');
            if (!toolbar) return;
            const btn = document.createElement('button');
            btn.id = 'comfyui-ai-workflow-btn';
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 28 28" fill="currentColor" style="margin-right: 6px;"><path d="M26.5542 4.34393C26.2719 4.20592 26.1506 4.46928 25.9856 4.60268C25.9292 4.64581 25.8815 4.70216 25.8338 4.75391C25.4215 5.19438 24.9396 5.48361 24.3105 5.44911C23.3905 5.39736 22.605 5.68659 21.9104 6.39041C21.7626 5.52271 21.2721 5.00462 20.5258 4.67226C20.1353 4.49976 19.7403 4.32668 19.4666 3.95119C19.2757 3.68381 19.2234 3.38595 19.1279 3.09211C19.0669 2.91501 19.0066 2.73388 18.8024 2.7034C18.5811 2.6689 18.4942 2.85463 18.4074 3.00989C18.0601 3.6447 17.9255 4.34393 17.9388 5.05235C17.9692 6.64572 18.642 7.91478 19.9789 8.81756C20.1307 8.92106 20.1698 9.02457 20.1221 9.1758C20.0307 9.48688 19.9226 9.78876 19.8271 10.0998C19.7662 10.2982 19.6753 10.3419 19.4626 10.2551C18.7288 9.94862 18.0952 9.49493 17.5351 8.94694C16.5846 8.02749 15.7249 7.01258 14.6531 6.21791C14.4013 6.03218 14.1494 5.85967 13.8889 5.69522C12.7952 4.63316 14.0321 3.76086 14.3185 3.65736C14.618 3.54925 14.4225 3.17779 13.4548 3.18239C12.487 3.18642 11.6015 3.51073 10.4727 3.94256C10.3077 4.00754 10.1341 4.05469 9.95637 4.09379C8.93227 3.89944 7.86849 3.85631 6.75755 3.98167C4.66564 4.21455 2.99464 5.20358 1.7664 6.89183C0.290908 8.92106 -0.0564026 11.2269 0.368535 13.6316C0.815324 16.1663 2.10911 18.2645 4.09695 19.905C6.15838 21.6059 8.53263 22.4397 11.2415 22.2799C12.8867 22.185 14.7181 21.9648 16.7841 20.2161C17.3051 20.4755 17.8519 20.579 18.7587 20.6566C19.4574 20.7216 20.1302 20.6221 20.6511 20.514C21.4671 20.3415 21.4107 19.5859 21.1157 19.4473C18.7242 18.3335 19.2492 18.7866 18.772 18.4198C19.987 16.9822 21.8431 14.4269 22.4158 10.9474C22.4722 10.5633 22.5441 10.0222 22.5355 9.71114C22.5309 9.52138 22.5746 9.44778 22.7913 9.42593C23.3905 9.35693 23.9718 9.19305 24.506 8.89921C26.0557 8.05279 26.6808 6.6624 26.828 4.996C26.8498 4.74126 26.8234 4.47791 26.5542 4.34393ZM13.0511 19.3438C10.7332 17.5216 9.60906 16.9219 9.14502 16.9477C8.71089 16.9736 8.78909 17.4704 8.88454 17.7942C8.98459 18.1139 9.11455 18.3341 9.29683 18.6147C9.42276 18.8004 9.50959 19.0764 9.1709 19.284C8.42453 19.7458 7.12671 19.1288 7.06576 19.0983C5.55519 18.2087 4.29245 17.0346 3.40233 15.4285C2.54268 13.8829 2.04356 12.2245 1.96133 10.4546C1.93948 10.0274 2.06541 9.87617 2.49092 9.79854C3.05099 9.69504 3.62831 9.67319 4.1878 9.75541C6.55342 10.101 8.56713 11.1585 10.2554 12.8341C11.2191 13.788 11.9482 14.9283 12.6992 16.0421C13.4979 17.2249 14.357 18.3519 15.4512 19.276C15.8377 19.5997 16.1459 19.8458 16.4408 20.0275C15.5513 20.127 14.0666 20.1483 13.0511 19.345V19.3438ZM14.162 12.1981C14.162 12.0083 14.3139 11.8571 14.5048 11.8571C14.5479 11.8571 14.587 11.8657 14.6221 11.8784C14.6698 11.8956 14.7135 11.9215 14.748 11.9606C14.8089 12.021 14.8434 12.1072 14.8434 12.1981C14.8434 12.3878 14.6916 12.5391 14.5007 12.5391C14.3098 12.5391 14.162 12.3878 14.162 12.1981ZM17.6127 13.968C17.3913 14.0588 17.17 14.1365 16.9572 14.1451C16.6271 14.1623 16.2672 14.0284 16.0717 13.8645C15.7681 13.6098 15.5507 13.4671 15.4599 13.0227C15.4208 12.8329 15.4426 12.5391 15.4771 12.3706C15.5553 12.0078 15.4685 11.7749 15.2126 11.5633C15.0045 11.3908 14.7394 11.343 14.4484 11.343C14.3397 11.343 14.2403 11.2953 14.1661 11.2568C14.0447 11.1964 13.9447 11.0452 14.0401 10.8594C14.0706 10.7991 14.2184 10.6524 14.2529 10.6266C14.6479 10.4017 15.1034 10.4753 15.5248 10.6438C15.9153 10.8037 16.2108 11.0969 16.6358 11.5115C17.0699 12.0124 17.1481 12.1504 17.3954 12.5264C17.5909 12.8203 17.7686 13.1221 17.8905 13.4677C17.9641 13.6834 17.8686 13.8599 17.6127 13.968Z" fill="currentColor"></svg>AI生成工作流';
            btn.style.cssText = `
                background: #2c3e50;
                border: none;
                color: #ecf0f1;
                padding: 4px 10px;
                border-radius: 0px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                margin-left: 12px;
                transition: background 0.2s, opacity 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-family: system-ui, -apple-system, sans-serif;
            `;
            btn.onmouseover = () => {
                btn.style.background = '#1a2a3a';
                btn.style.opacity = '0.9';
            };
            btn.onmouseout = () => {
                btn.style.background = '#2c3e50';
                btn.style.opacity = '1';
            };

            if (!document.getElementById('comfyui-pulse-style')) {
                const pulseStyle = document.createElement('style');
                pulseStyle.id = 'comfyui-pulse-style';
                pulseStyle.textContent = `
                    @keyframes comfyui-smooth-pulse {
                        0% {
                            opacity: 0.6;
                            transform: scale(1);
                            text-shadow: 0 0 0px rgba(102,204,255,0);
                        }
                        50% {
                            opacity: 1;
                            transform: scale(1.02);
                            text-shadow: 0 0 6px rgba(102,204,255,0.6);
                        }
                        100% {
                            opacity: 0.6;
                            transform: scale(1);
                            text-shadow: 0 0 0px rgba(102,204,255,0);
                        }
                    }
                    @keyframes comfyui-wave {
                        0%, 100% { transform: translateX(0px); }
                        25% { transform: translateX(3px); }
                        75% { transform: translateX(-3px); }
                    }
                    @keyframes comfyui-ripple {
                        0% {
                            box-shadow: 0 0 0 0 rgba(102,204,255,0.4);
                            background-position: 0% 50%;
                        }
                        50% {
                            box-shadow: 0 0 0 4px rgba(102,204,255,0.2);
                            background-position: 100% 50%;
                        }
                        100% {
                            box-shadow: 0 0 0 0 rgba(102,204,255,0);
                            background-position: 0% 50%;
                        }
                    }
                    .comfyui-ai-btn-pulse {
                        animation: comfyui-smooth-pulse 1.2s ease-in-out infinite !important;
                        transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1) !important;
                    }
                    .comfyui-ai-btn-wave {
                        animation: comfyui-wave 0.6s ease-in-out !important;
                    }
                `;
                document.head.appendChild(pulseStyle);
            }
            btn.onclick = async () => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
                const originalHTML = btn.innerHTML;
                btn.classList.add('comfyui-ai-btn-pulse');
                btn.innerHTML = '<div style="display: inline-flex; align-items: center; gap: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 28 28" fill="currentColor" style="animation: comfyui-wave 0.6s ease-in-out infinite;"><path d="M26.5542 4.34393C26.2719 4.20592 26.1506 4.46928 25.9856 4.60268C25.9292 4.64581 25.8815 4.70216 25.8338 4.75391C25.4215 5.19438 24.9396 5.48361 24.3105 5.44911C23.3905 5.39736 22.605 5.68659 21.9104 6.39041C21.7626 5.52271 21.2721 5.00462 20.5258 4.67226C20.1353 4.49976 19.7403 4.32668 19.4666 3.95119C19.2757 3.68381 19.2234 3.38595 19.1279 3.09211C19.0669 2.91501 19.0066 2.73388 18.8024 2.7034C18.5811 2.6689 18.4942 2.85463 18.4074 3.00989C18.0601 3.6447 17.9255 4.34393 17.9388 5.05235C17.9692 6.64572 18.642 7.91478 19.9789 8.81756C20.1307 8.92106 20.1698 9.02457 20.1221 9.1758C20.0307 9.48688 19.9226 9.78876 19.8271 10.0998C19.7662 10.2982 19.6753 10.3419 19.4626 10.2551C18.7288 9.94862 18.0952 9.49493 17.5351 8.94694C16.5846 8.02749 15.7249 7.01258 14.6531 6.21791C14.4013 6.03218 14.1494 5.85967 13.8889 5.69522C12.7952 4.63316 14.0321 3.76086 14.3185 3.65736C14.618 3.54925 14.4225 3.17779 13.4548 3.18239C12.487 3.18642 11.6015 3.51073 10.4727 3.94256C10.3077 4.00754 10.1341 4.05469 9.95637 4.09379C8.93227 3.89944 7.86849 3.85631 6.75755 3.98167C4.66564 4.21455 2.99464 5.20358 1.7664 6.89183C0.290908 8.92106 -0.0564026 11.2269 0.368535 13.6316C0.815324 16.1663 2.10911 18.2645 4.09695 19.905C6.15838 21.6059 8.53263 22.4397 11.2415 22.2799C12.8867 22.185 14.7181 21.9648 16.7841 20.2161C17.3051 20.4755 17.8519 20.579 18.7587 20.6566C19.4574 20.7216 20.1302 20.6221 20.6511 20.514C21.4671 20.3415 21.4107 19.5859 21.1157 19.4473C18.7242 18.3335 19.2492 18.7866 18.772 18.4198C19.987 16.9822 21.8431 14.4269 22.4158 10.9474C22.4722 10.5633 22.5441 10.0222 22.5355 9.71114C22.5309 9.52138 22.5746 9.44778 22.7913 9.42593C23.3905 9.35693 23.9718 9.19305 24.506 8.89921C26.0557 8.05279 26.6808 6.6624 26.828 4.996C26.8498 4.74126 26.8234 4.47791 26.5542 4.34393ZM13.0511 19.3438C10.7332 17.5216 9.60906 16.9219 9.14502 16.9477C8.71089 16.9736 8.78909 17.4704 8.88454 17.7942C8.98459 18.1139 9.11455 18.3341 9.29683 18.6147C9.42276 18.8004 9.50959 19.0764 9.1709 19.284C8.42453 19.7458 7.12671 19.1288 7.06576 19.0983C5.55519 18.2087 4.29245 17.0346 3.40233 15.4285C2.54268 13.8829 2.04356 12.2245 1.96133 10.4546C1.93948 10.0274 2.06541 9.87617 2.49092 9.79854C3.05099 9.69504 3.62831 9.67319 4.1878 9.75541C6.55342 10.101 8.56713 11.1585 10.2554 12.8341C11.2191 13.788 11.9482 14.9283 12.6992 16.0421C13.4979 17.2249 14.357 18.3519 15.4512 19.276C15.8377 19.5997 16.1459 19.8458 16.4408 20.0275C15.5513 20.127 14.0666 20.1483 13.0511 19.345V19.3438ZM14.162 12.1981C14.162 12.0083 14.3139 11.8571 14.5048 11.8571C14.5479 11.8571 14.587 11.8657 14.6221 11.8784C14.6698 11.8956 14.7135 11.9215 14.748 11.9606C14.8089 12.021 14.8434 12.1072 14.8434 12.1981C14.8434 12.3878 14.6916 12.5391 14.5007 12.5391C14.3098 12.5391 14.162 12.3878 14.162 12.1981ZM17.6127 13.968C17.3913 14.0588 17.17 14.1365 16.9572 14.1451C16.6271 14.1623 16.2672 14.0284 16.0717 13.8645C15.7681 13.6098 15.5507 13.4671 15.4599 13.0227C15.4208 12.8329 15.4426 12.5391 15.4771 12.3706C15.5553 12.0078 15.4685 11.7749 15.2126 11.5633C15.0045 11.3908 14.7394 11.343 14.4484 11.343C14.3397 11.343 14.2403 11.2953 14.1661 11.2568C14.0447 11.1964 13.9447 11.0452 14.0401 10.8594C14.0706 10.7991 14.2184 10.6524 14.2529 10.6266C14.6479 10.4017 15.1034 10.4753 15.5248 10.6438C15.9153 10.8037 16.2108 11.0969 16.6358 11.5115C17.0699 12.0124 17.1481 12.1504 17.3954 12.5264C17.5909 12.8203 17.7686 13.1221 17.8905 13.4677C17.9641 13.6834 17.8686 13.8599 17.6127 13.968Z" fill="currentColor"></svg><span style="background: linear-gradient(90deg, #66ccff, #3399dd, #66ccff); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: comfyui-ripple 1.2s ease-in-out infinite;">⚡ 生成中 ⚡</span></div>';
                try {
                    const workflow = await window.app.graph.serialize();
                    const response = await fetch('http://127.0.0.1:8765/ai_generate_workflow', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            workflow_json: JSON.stringify(workflow),
                            workflow_file_path: null
                        })
                    });
                    if (response.ok) {
                        console.log('[ComfyUI] AI 工作流生成请求已发（生成器模式）');
                    } else {
                        console.warn('[ComfyUI] 请求失败:', response.status);
                    }
                } catch (err) {
                    console.error('[ComfyUI] 发送请求翻车:', err);
                    showElegantToast('啊啊啊，连不上電籽启动器后端，请确保它开了', 'error');
                } finally {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.classList.remove('comfyui-ai-btn-pulse');
                    btn.innerHTML = originalHTML;
                }
            };
            toolbar.appendChild(btn);
        }
        setTimeout(addAiWorkflowButton, 2000);
        const btnObserver = new MutationObserver(() => addAiWorkflowButton());
        btnObserver.observe(document.body, { childList: true, subtree: true });

        // 错误信息一键复制
        function addErrorCopyButtons() {
            const propertiesPanel = document.querySelector('[data-testid="properties-panel"]');
            if (!propertiesPanel) return;

            const searchBarRow = propertiesPanel.querySelector('.flex.min-w-0.shrink-0.items-center.border-b.border-interface-stroke.px-4.pt-1.pb-4');
            if (!searchBarRow) return;

            if (searchBarRow.querySelector('.comfyui-error-buttons-container')) return;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'comfyui-error-buttons-container';
            buttonContainer.style.cssText = `
                display: flex;
                gap: 8px;
                margin-left: 12px;
                flex-shrink: 0;
            `;

            const copyErrorBtn = document.createElement('button');
            copyErrorBtn.className = 'comfyui-copy-error-btn';
            copyErrorBtn.innerHTML = '<i class="fas fa-copy" style="margin-right: 4px; font-size: 11px;"></i>复制错误';
            copyErrorBtn.style.cssText = `
                background: rgba(30,30,50,0.85);
                border: none;
                border-right: 1px solid rgba(102,204,255,0.3);
                color: #88aacc;
                font-size: 10px;
                padding: 4px 10px;
                cursor: pointer;
                font-family: monospace;
                transition: all 0.12s ease;
                border-radius: 3px;
                display: inline-flex;
                align-items: center;
                white-space: nowrap;
            `;
            copyErrorBtn.onmouseover = () => {
                copyErrorBtn.style.background = 'rgba(102,204,255,0.25)';
                copyErrorBtn.style.color = '#66ccff';
            };
            copyErrorBtn.onmouseout = () => {
                copyErrorBtn.style.background = 'rgba(30,30,50,0.85)';
                copyErrorBtn.style.color = '#88aacc';
            };

            const downloadErrorBtn = document.createElement('button');
            downloadErrorBtn.className = 'comfyui-download-error-btn';
            downloadErrorBtn.innerHTML = '<i class="fas fa-download" style="margin-right: 4px; font-size: 11px;"></i>下载错误';
            downloadErrorBtn.style.cssText = `
                background: rgba(30,30,50,0.85);
                border: none;
                color: #88aacc;
                font-size: 10px;
                padding: 4px 10px;
                cursor: pointer;
                font-family: monospace;
                transition: all 0.12s ease;
                border-radius: 3px;
                display: inline-flex;
                align-items: center;
                white-space: nowrap;
            `;
            downloadErrorBtn.onmouseover = () => {
                downloadErrorBtn.style.background = 'rgba(102,204,255,0.25)';
                downloadErrorBtn.style.color = '#66ccff';
            };
            downloadErrorBtn.onmouseout = () => {
                downloadErrorBtn.style.background = 'rgba(30,30,50,0.85)';
                downloadErrorBtn.style.color = '#88aacc';
            };

            function getErrorElement() {
                let targetEl = propertiesPanel.querySelector('.min-w-0.flex-1.overflow-y-auto');
                if (targetEl) {
                    return targetEl;
                }
                const fallbackSelectors = [
                    '.border.rounded-lg.p-4',
                    '.border.rounded-lg',
                    'pre',
                    '.font-mono',
                    'code'
                ];
                for (const selector of fallbackSelectors) {
                    const el = propertiesPanel.querySelector(selector);
                    if (el) {
                        const text = el.textContent || '';
                        if (text.includes('Error') || text.includes('Exception') || text.includes('Traceback') || text.includes('RuntimeError')) {
                            return el;
                        }
                    }
                }
                return propertiesPanel;
            }

            function getErrorHTML() {
                const el = getErrorElement();
                const clone = el.cloneNode(true);
                const allButtons = clone.querySelectorAll('button, [role="button"], .cursor-pointer');
                for (const btn of allButtons) {
                    btn.remove();
                }
                const ourContainer = clone.querySelector('.comfyui-error-buttons-container');
                if (ourContainer) ourContainer.remove();

                const timestamp = new Date().toLocaleString('zh-CN');
                let workflowName = 'Unsaved Workflow';
                try {
                    const activeTabBtn = document.querySelector('.p-togglebutton[aria-pressed="true"] .workflow-tab');
                    if (activeTabBtn) {
                        const labelSpan = activeTabBtn.querySelector('.workflow-label');
                        if (labelSpan && labelSpan.textContent.trim()) {
                            let name = labelSpan.textContent.trim();
                            if (name !== 'Unsaved Workflow' && !name.includes('Unsaved')) {
                                workflowName = name;
                            }
                        }
                    }
                    if (workflowName === 'Unsaved Workflow' && window.app && window.app.graph && window.app.graph.workflow && window.app.graph.workflow.file_path) {
                        const filePath = window.app.graph.workflow.file_path;
                        const fileName = filePath.split('\\').pop().split('/').pop();
                        if (fileName && fileName !== 'Untitled' && !fileName.includes('Unsaved')) {
                            workflowName = fileName;
                        }
                    }
                } catch(e) {}

                const headerText = `=== ComfyUI 错误报告 ===
由電籽启动器web端生成
工作流名称: ${workflowName}
生成时间: ${timestamp}

`;
                // 结束错误信息后会再写一堆等号来表示结束
                return headerText + clone.outerHTML + '\n\n============';
            }

            function getErrorText() {
                const el = getErrorElement();
                const clone = el.cloneNode(true);
                const allButtons = clone.querySelectorAll('button, [role="button"], .cursor-pointer');
                for (const btn of allButtons) {
                    btn.remove();
                }
                const ourContainer = clone.querySelector('.comfyui-error-buttons-container');
                if (ourContainer) ourContainer.remove();
                return clone.textContent || clone.innerText || '';
            }

            function getFormattedErrorOutput() {
                const timestamp = new Date().toLocaleString('zh-CN');
                let workflowName = 'Unsaved Workflow';
                try {
                    const activeTabBtn = document.querySelector('.p-togglebutton[aria-pressed="true"] .workflow-tab');
                    if (activeTabBtn) {
                        const labelSpan = activeTabBtn.querySelector('.workflow-label');
                        if (labelSpan && labelSpan.textContent.trim()) {
                            let name = labelSpan.textContent.trim();
                            if (name !== 'Unsaved Workflow' && !name.includes('Unsaved')) {
                                workflowName = name;
                            }
                        }
                    }
                    if (workflowName === 'Unsaved Workflow' && window.app && window.app.graph && window.app.graph.workflow && window.app.graph.workflow.file_path) {
                        const filePath = window.app.graph.workflow.file_path;
                        const fileName = filePath.split('\\').pop().split('/').pop();
                        if (fileName && fileName !== 'Untitled' && !fileName.includes('Unsaved')) {
                            workflowName = fileName;
                        }
                    }
                } catch(e) {}

                let output = '';
                output += `=== ComfyUI 错误报告 ===\n`;
                output += `由電籽启动器web端生成\n`;
                output += `工作流名称: ${workflowName}\n`;
                output += `生成时间: ${timestamp}\n`;
                output += `========================================\n\n`;
                output += getErrorText();
                return output;
            }

            copyErrorBtn.onclick = async () => {
                try {
                    const errorHTML = getErrorHTML();
                    await navigator.clipboard.writeText(errorHTML);
                    showErrorToast('已复制错误信息到剪贴板');
                    copyErrorBtn.style.background = 'rgba(102,204,255,0.4)';
                    setTimeout(() => {
                        copyErrorBtn.style.background = 'rgba(30,30,50,0.85)';
                    }, 200);
                } catch (err) {
                    try {
                        const textContent = getFormattedErrorOutput();
                        await navigator.clipboard.writeText(textContent);
                        showErrorToast('已复制错误信息到剪贴板');
                    } catch (err2) {
                        showErrorToast('复制失败，请用下载按钮');
                    }
                }
            };

            downloadErrorBtn.onclick = async () => {
                try {
                    const errorHTML = getErrorHTML();
                    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                    const filename = `comfyui_error_${timestamp}.html`;
                    const fullHTML = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>ComfyUI 错误报告</title></head>
<body style="background:#1a1a2e;color:#e0e0e0;font-family:monospace;padding:20px;">
<pre style="white-space:pre-wrap;word-wrap:break-word;">${errorHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
                    const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showErrorToast('已下载错误报告: ' + filename);
                    downloadErrorBtn.style.background = 'rgba(102,204,255,0.4)';
                    setTimeout(() => {
                        downloadErrorBtn.style.background = 'rgba(30,30,50,0.85)';
                    }, 200);
                } catch (err) {
                    showErrorToast('下载失败: ' + err.message);
                }
            };

            function showErrorToast(message) {
                showElegantToast(message, 'success');
            }

            buttonContainer.appendChild(copyErrorBtn);
            buttonContainer.appendChild(downloadErrorBtn);

            const label = searchBarRow.querySelector('label');
            if (label) {
                label.insertAdjacentElement('afterend', buttonContainer);
            } else {
                searchBarRow.appendChild(buttonContainer);
            }
        }

        function setupErrorButtonsObserver() {
            const observer = new MutationObserver(() => {
                addErrorCopyButtons();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(addErrorCopyButtons, 1000);
            setTimeout(addErrorCopyButtons, 3000);
        }
        setupErrorButtonsObserver();

        function setupWorkflowRefreshListener() {
            let ws = null;
            function getWebSocket() {
                if (window.ws && window.ws.readyState === WebSocket.OPEN) return window.ws;
                if (window.app && window.app.websocket && window.app.websocket.readyState === WebSocket.OPEN) return window.app.websocket;
                return null;
            }
            function handleMessage(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'refresh_workflow') {
                        console.log('[ComfyUI] 收到刷新工作流命令，重新加载页面');
                        location.reload();
                    }
                } catch(e) {}
            }
            function connectListener() {
                const currentWs = getWebSocket();
                if (currentWs && !currentWs._refreshListenerAdded) {
                    currentWs.addEventListener('message', handleMessage);
                    currentWs._refreshListenerAdded = true;
                    console.log('[ComfyUI] 已添加 WebSocket 刷新监听器');
                }
            }
            connectListener();
            setInterval(connectListener, 3000);
        }
        setupWorkflowRefreshListener();

        console.log('[ComfyUI] 初始化完成！');
        console.log('[ComfyUI] - 搜索框：右键菜单顶部');
        console.log('[ComfyUI] - 输入 <about> 回车跳转作者B站主页');
        console.log('[ComfyUI] - 动态高度：菜单自适应屏幕，永不超出边界');
        console.log('[ComfyUI] - 丝滑动画：弹出/关闭动画');
        console.log('[ComfyUI] - 右键工作流标签 -> 复制工作流磁盘路径并通知本地電籽启动器');
        console.log('[ComfyUI] - 顶部 AI生成工作流按钮');
        console.log(`[ComfyUI] - 工作流目录已配置: ${WORKFLOWS_DIR}`);
        console.log('[ComfyUI] - 右键菜单“打开此json工作流在磁盘上的位置”已移除复制路径功能');
        console.log('[ComfyUI] - 错误信息一键复制：属性面板错误/警告区域新增复制/下载按钮');
        console.log('[ComfyUI] - 设置面板：可自定义工作流目录、自动刷新等');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==================== 電籽Toast通知（支持多种类型） ====================
    function showElegantToast(message, type = 'success') {
        const toast = document.createElement('div');
        let timeoutId = null;
        let isClosing = false;

        // 根据类型选图标和颜色
        let iconHtml = '';
        let titleColor = '#66ccff';
        let titleText = '電籽启动器';

        if (type === 'success') {
            iconHtml = '<i class="fas fa-check-circle" style="font-size: 18px; color: #66ccff;"></i>';
            titleColor = '#66ccff';
            titleText = '電籽启动器';
        } else if (type === 'error') {
            iconHtml = '<i class="fas fa-exclamation-circle" style="font-size: 18px; color: #ff6b6b;"></i>';
            titleColor = '#ff6b6b';
            titleText = '電籽启动器 - 错误';
        } else if (type === 'warning') {
            iconHtml = '<i class="fas fa-exclamation-triangle" style="font-size: 18px; color: #ffcc66;"></i>';
            titleColor = '#ffcc66';
            titleText = '電籽启动器 - 警告';
        } else if (type === 'info') {
            iconHtml = '<i class="fas fa-info-circle" style="font-size: 18px; color: #66ccff;"></i>';
            titleColor = '#66ccff';
            titleText = '電籽启动器 - 提示';
        } else {
            iconHtml = '<i class="fas fa-check-circle" style="font-size: 18px; color: #66ccff;"></i>';
            titleColor = '#66ccff';
            titleText = '電籽启动器';
        }

        toast.innerHTML = `
            <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    ${iconHtml}
                    <span style="font-size: 13px; font-weight: 600; color: ${titleColor};">${titleText}</span>
                </div>
                <button class="toast-close-btn" style="
                    background: transparent;
                    border: none;
                    color: rgba(102, 204, 255, 0.6);
                    font-size: 16px;
                    cursor: pointer;
                    padding: 4px 8px;
                    margin: -6px -6px -6px 0;
                    border-radius: 1px;
                    transition: all 0.15s ease;
                    font-family: monospace;
                    line-height: 1;
                ">×</button>
            </div>
            <div style="font-size: 13px; color: #e0e0e0; line-height: 1.45; margin-top: 6px; user-select: none;">${message}</div>
        `;

        if (!document.getElementById('comfyui-toast-style')) {
            const style = document.createElement('style');
            style.id = 'comfyui-toast-style';
            style.textContent = `
                @keyframes slideInRight {
                    0% { transform: translateX(450px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    0% { transform: translateX(0) scale(0.9); opacity: 1; }
                    100% { transform: translateX(450px) scale(0.9); opacity: 0; visibility: hidden; }
                }
                @keyframes clickShrink {
                    0% { transform: scale(1); }
                    100% { transform: scale(0.9); }
                }
                .toast-slide-in { animation: slideInRight 0.35s cubic-bezier(0.2, 0.9, 0.4, 1) forwards !important; }
                .toast-slide-out { animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important; }
                .toast-click-shrink { animation: clickShrink 0.15s ease-out forwards !important; }
                .toast-close-btn:hover {
                    background: rgba(102, 204, 255, 0.2) !important;
                    color: #66ccff !important;
                }
            `;
            document.head.appendChild(style);
        }

        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            min-width: 280px;
            max-width: 380px;
            background: rgba(102, 180, 255, 0.12);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(102, 204, 255, 0.35);
            border-radius: 1px;
            padding: 14px 18px;
            z-index: 100000;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
            pointer-events: auto;
            transform: translateX(450px);
            opacity: 0;
        `;

        document.body.appendChild(toast);

        const closeToast = () => {
            if (isClosing) return;
            isClosing = true;
            if (timeoutId) clearTimeout(timeoutId);
            toast.classList.remove('toast-slide-in');
            toast.classList.remove('toast-click-shrink');
            toast.classList.add('toast-slide-out');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 350);
        };

        const animateAndClose = () => {
            if (isClosing) return;
            toast.classList.add('toast-click-shrink');
            setTimeout(() => {
                closeToast();
            }, 120);
        };

        const closeBtn = toast.querySelector('.toast-close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            animateAndClose();
        });

        toast.addEventListener('click', (e) => {
            if (e.target === closeBtn || closeBtn.contains(e.target)) return;
            animateAndClose();
        });

        requestAnimationFrame(() => {
            toast.classList.add('toast-slide-in');
            toast.style.transform = '';
            toast.style.opacity = '';
        });

        timeoutId = setTimeout(() => {
            animateAndClose();
        }, 10000);
    }
})();
