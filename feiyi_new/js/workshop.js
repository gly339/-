// 非遗虚拟制作工坊首页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化工坊页面
    function initWorkshop() {
        setupNavigation();
        setupCardHoverEffects();
        setupTutorialAnimation();
        setupScrollEffects();
        setupClickHandlers();
        setupPageLoadAnimation();
    }

    // 设置导航栏效果
    function setupNavigation() {
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
    }

    // 设置卡片悬停效果
    function setupCardHoverEffects() {
        const workshopCards = document.querySelectorAll('.workshop-card');

        workshopCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                // 添加悬停动画
                this.style.transform = 'translateY(-8px)';

                // 卡片图标旋转效果
                const icon = this.querySelector('.card-icon i');
                if (icon) {
                    icon.style.transform = 'rotate(10deg) scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', function() {
                // 恢复原始状态
                this.style.transform = 'translateY(0)';

                const icon = this.querySelector('.card-icon i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }
            });

            // 添加点击涟漪效果
            card.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
        });
    }

    // 创建涟漪效果
    function createRippleEffect(e, element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            element.removeChild(ripple);
        }, 600);
    }

    // 添加涟漪动画样式
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // 设置教程动画
    function setupTutorialAnimation() {
        const stepItems = document.querySelectorAll('.step-item');

        stepItems.forEach((item, index) => {
            // 鼠标悬停时的动画
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(196, 30, 58, 0.2)';
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // 设置滚动效果
    function setupScrollEffects() {
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

        // 滚动时的元素动画
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.workshop-card, .feature-item, .step-item');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        };

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // 初始调用
    }

    // 设置点击处理器
    function setupClickHandlers() {
        // 开始制作按钮点击
        window.startWorkshop = function(workshopType) {
            showNotification(`正在进入${getWorkshopName(workshopType)}...`, 'info');

            // 模拟加载过程
            setTimeout(() => {
                // 这里应该是跳转到具体的制作页面
                // window.location.href = `workshop/${workshopType}.html`;
                showNotification('功能即将上线，敬请期待！', 'success');
            }, 1500);
        };

        // 查看教程链接
        const viewTutorial = document.querySelector('.view-tutorial');
        if (viewTutorial) {
            viewTutorial.addEventListener('click', function(e) {
                e.preventDefault();
                showTutorialModal();
            });
        }

        // 收藏按钮
        const favoriteIcons = document.querySelectorAll('.nav-icon.fa-heart');
        favoriteIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                toggleFavorite(this);
            });
        });
    }

    // 获取工坊名称
    function getWorkshopName(type) {
        const names = {
            'paper-cutting': '剪纸工坊',
            'shadow-puppetry': '皮影工坊',
            'traditional-painting': '绘画工坊',
            'embroidery': '刺绣工坊'
        };
        return names[type] || '虚拟工坊';
    }

    // 显示教程模态框
    function showTutorialModal() {
        showNotification('教程功能即将上线，敬请期待！', 'info');
    }

    // 切换收藏状态
    function toggleFavorite(element) {
        const icon = element.querySelector('i') || element;
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#D4AF37';
            showNotification('已添加到收藏', 'success');
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
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#C41E3A' : type === 'error' ? '#ff4757' : '#2A5C68'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: 'Noto Serif SC', serif;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // 设置页面加载动画
    function setupPageLoadAnimation() {
        // 添加动画样式
        const animationStyles = document.createElement('style');
        animationStyles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(animationStyles);

        // 页面淡入效果
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);

        // 显示欢迎通知
        setTimeout(() => {
            showNotification('欢迎来到非遗虚拟制作工坊！', 'success');
        }, 1000);
    }

    // 键盘事件处理
    function setupKeyboardEvents() {
        document.addEventListener('keydown', function(e) {
            // ESC键关闭可能的模态框
            if (e.key === 'Escape') {
                // 这里可以处理关闭模态框的逻辑
                console.log('ESC pressed');
            }
        });
    }

    // 性能优化：使用节流处理滚动事件
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 图片懒加载（如果有的话）
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // 页面可见性API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时可以暂停一些动画
            console.log('Page hidden');
        } else {
            // 页面显示时可以恢复动画
            console.log('Page visible');
        }
    });

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

    // 初始化所有功能
    initWorkshop();
    setupKeyboardEvents();

    // 页面加载完成事件
    window.addEventListener('load', function() {
        console.log('Workshop page loaded successfully!');
    });

    // 页面卸载前清理
    window.addEventListener('beforeunload', function() {
        // 清理定时器等资源
        console.log('Cleaning up workshop page...');
    });
});