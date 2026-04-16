// 非遗分类展馆列表页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 分类标签切换功能
    const tabItems = document.querySelectorAll('.tab-item');
    const exhibitionCards = document.querySelectorAll('.exhibition-card');
    const locationFilter = document.getElementById('locationFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // 初始化
    function init() {
        setupTabEvents();
        setupFilterEvents();
        setupSearchEvents();
        setupCardInteractions();
        setupScrollEffects();
    }

    // 设置标签切换事件
    function setupTabEvents() {
        tabItems.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有活动状态
                tabItems.forEach(t => t.classList.remove('active'));

                // 添加当前活动状态
                this.classList.add('active');

                // 过滤展品
                const category = this.dataset.category;
                filterExhibitions(category);
            });
        });
    }

    // 设置筛选事件
    function setupFilterEvents() {
        locationFilter.addEventListener('change', function() {
            const selectedCategory = getActiveCategory();
            filterExhibitions(selectedCategory, this.value);
        });
    }

    // 设置搜索事件
    function setupSearchEvents() {
        searchInput.addEventListener('input', performSearch);
        searchBtn.addEventListener('click', performSearch);

        // 支持回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // 设置卡片交互
    function setupCardInteractions() {
        const favoriteBtns = document.querySelectorAll('.favorite-btn');
        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFavorite(this);
            });
        });

        // 卡片点击事件
        exhibitionCards.forEach(card => {
            card.addEventListener('click', function() {
                const name = this.dataset.name;
                // 这里可以跳转到详情页
                console.log(`点击了 ${name}`);
                // 实际项目中应该跳转到详情页
                // window.location.href = `detail.html?name=${encodeURIComponent(name)}`;
            });
        });
    }

    // 获取当前激活的分类
    function getActiveCategory() {
        const activeTab = document.querySelector('.tab-item.active');
        return activeTab ? activeTab.dataset.category : 'all';
    }

    // 过滤展品
    function filterExhibitions(category = 'all', location = '') {
        const searchTerm = searchInput.value.toLowerCase().trim();

        exhibitionCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardLocation = card.dataset.location;
            const cardName = card.dataset.name.toLowerCase();

            let showCard = true;

            // 按分类过滤
            if (category !== 'all' && cardCategory !== category) {
                showCard = false;
            }

            // 按地域过滤
            if (location && cardLocation !== location) {
                showCard = false;
            }

            // 按搜索词过滤
            if (searchTerm && !cardName.includes(searchTerm) &&
                !cardLocation.includes(searchTerm)) {
                showCard = false;
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    }

    // 执行搜索
    function performSearch() {
        const selectedCategory = getActiveCategory();
        const selectedLocation = locationFilter.value;
        filterExhibitions(selectedCategory, selectedLocation);
    }

    // 切换收藏状态
    function toggleFavorite(button) {
        const icon = button.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#D4AF37';
            showNotification('已收藏', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#C41E3A';
            showNotification('已取消收藏', 'info');
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#C41E3A' : '#2A5C68'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // 设置滚动效果
    function setupScrollEffects() {
        const navbar = document.querySelector('.navbar');

        // 导航栏滚动效果
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // 返回顶部按钮
        const backToTop = document.createElement('div');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
    }

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-element {
            animation: fadeIn 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);

    // 滚动加载动画
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.exhibition-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.animationDelay = '0.1s';
                element.classList.add('fade-in-element');
            }
        });
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleScrollAnimations);

    // 页面加载时触发一次
    setTimeout(handleScrollAnimations, 100);

    // 平滑滚动到顶部
    document.querySelector('.nav-link').addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#top' || this.parentElement.querySelector('a').textContent === '首页') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 初始化所有功能
    init();

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 搜索防抖
    const debouncedSearch = debounce(performSearch, 300);
    searchInput.addEventListener('input', debouncedSearch);

    // 图片懒加载（虽然这里用的是SVG，但为了扩展性）
    const images = document.querySelectorAll('.card-image img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // 这里可以添加真实的图片加载逻辑
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 键盘事件
    document.addEventListener('keydown', function(e) {
        // Ctrl+F 聚焦搜索框
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }

        // ESC 清除搜索
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });

    // 添加本地存储功能（用于收藏）
    function saveFavorites() {
        const favorites = [];
        document.querySelectorAll('.favorite-btn').forEach((btn, index) => {
            if (btn.querySelector('i').classList.contains('fas')) {
                const card = btn.closest('.exhibition-card');
                if (card) {
                    favorites.push(card.dataset.name);
                }
            }
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // 从本地存储加载收藏
    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        document.querySelectorAll('.exhibition-card').forEach(card => {
            const name = card.dataset.name;
            if (favorites.includes(name)) {
                const icon = card.querySelector('.favorite-btn i');
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#D4AF37';
            }
        });
    }

    // 监听收藏按钮变化
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-btn')) {
            saveFavorites();
        }
    });

    // 页面加载时恢复收藏状态
    setTimeout(loadFavorites, 100);

    // 性能优化：使用requestAnimationFrame处理滚动事件
    let ticking = false;
    function updateScroll() {
        handleScrollAnimations();
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });
});