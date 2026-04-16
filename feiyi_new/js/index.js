// 首页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 轮播图功能
    const bannerItems = document.querySelectorAll('.banner-item');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let slideInterval;

    // 初始化轮播
    function initBanner() {
        showSlide(currentIndex);
        startAutoSlide();
    }

    // 显示指定幻灯片
    function showSlide(index) {
        bannerItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        currentIndex = index;
    }

    // 自动轮播
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % bannerItems.length;
            showSlide(currentIndex);
        }, 5000);
    }

    // 停止自动轮播
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // 点击指示器切换幻灯片
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // 卡片悬停效果
    const accessCards = document.querySelectorAll('.access-card');
    accessCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 收藏按钮功能
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#D4AF37';

                // 显示收藏提示
                showNotification('已收藏', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '#C41E3A';

                showNotification('已取消收藏', 'info');
            }
        });
    });

    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 点击导航链接高亮
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 卡片点击放大效果
    const showcaseItems = document.querySelectorAll('.showcase-item');
    showcaseItems.forEach(item => {
        item.addEventListener('click', function() {
            // 简单的点击反馈，实际项目中可以添加放大详情
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
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

    // 通知功能
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#C41E3A' : '#2A5C68'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // 添加通知动画样式
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
    `;
    document.head.appendChild(style);

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 初始化
    initBanner();

    // 阻止拖拽图像时的默认行为
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // 键盘事件处理
    document.addEventListener('keydown', function(e) {
        // 如果用户按左箭头键，切换到上一张轮播图
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            currentIndex = (currentIndex - 1 + bannerItems.length) % bannerItems.length;
            showSlide(currentIndex);
            startAutoSlide();
        }
        // 如果用户按右箭头键，切换到下一张轮播图
        else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            currentIndex = (currentIndex + 1) % bannerItems.length;
            showSlide(currentIndex);
            startAutoSlide();
        }
    });
});

// 轮播图滚动函数
let carouselPosition = 0;

function scrollCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.showcase-item');
    const itemWidth = items[0].offsetWidth + 20; // 加上gap
    const container = document.querySelector('.carousel-container');
    const containerWidth = container.offsetWidth;

    // 计算一行能显示几个卡片
    const itemsPerRow = Math.floor(containerWidth / (itemWidth));
    const maxPosition = Math.max(0, items.length - itemsPerRow);

    carouselPosition += direction;

    // 边界检查
    if (carouselPosition < 0) {
        carouselPosition = 0;
    } else if (carouselPosition > maxPosition) {
        carouselPosition = maxPosition;
    }

    track.style.transform = `translateX(-${carouselPosition * itemWidth}px)`;
}

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

// 页面可见性API检测
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时停止轮播
        const slideInterval = setInterval(() => {}, 1000);
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    } else {
        // 页面可见时重新开始轮播
        initBanner();
    }
});