// 非遗作品详情页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 当前轮播图索引
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;

    // 初始化轮播
    function initCarousel() {
        updateCarousel();
        setupCarouselControls();
        setupAudioPlayer();
        setupShareFunctionality();
        setupTabNavigation();
        setupImageZoom();
        setupScrollProgress();
    }

    // 更新轮播
    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    // 设置轮播控制
    function setupCarouselControls() {
        // 自动播放
        let autoPlayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }, 5000);

        // 鼠标悬停时暂停
        const heroCarousel = document.querySelector('.hero-carousel');
        heroCarousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        heroCarousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            }, 5000);
        });

        // 点击指示器
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        // 鼠标悬停轮播图时显示导航按钮
        heroCarousel.addEventListener('mouseenter', () => {
            const controls = document.querySelector('.carousel-controls');
            controls.style.opacity = '1';
        });

        heroCarousel.addEventListener('mouseleave', () => {
            const controls = document.querySelector('.carousel-controls');
            controls.style.opacity = '0.7';
        });
    }

    // 切换轮播图
    function changeSlide(direction) {
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        updateCarousel();
    }

    // 设置标签导航
    function setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // 移除所有活动状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // 添加当前活动状态
                button.classList.add('active');
                document.getElementById(`${tabId}-content`).classList.add('active');

                // 平滑滚动到内容区域
                document.getElementById(`${tabId}-content`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    // 设置音频播放器
    function setupAudioPlayer() {
        const audioBtn = document.getElementById('audioBtn');
        const progressFill = document.getElementById('progressFill');
        const audioTime = document.getElementById('audioTime');
        let isPlaying = false;
        let audioProgress = 0;
        let audioInterval;

        audioBtn.addEventListener('click', function() {
            if (isPlaying) {
                // 暂停
                isPlaying = false;
                clearInterval(audioInterval);
                this.classList.remove('playing');
                this.innerHTML = '<i class="fas fa-volume-up"></i> 播放作品讲解';
            } else {
                // 开始播放
                isPlaying = true;
                this.classList.add('playing');
                this.innerHTML = '<i class="fas fa-pause"></i> 暂停讲解';

                // 模拟音频播放进度
                audioInterval = setInterval(() => {
                    audioProgress += 1;
                    if (audioProgress > 90) { // 90秒结束
                        audioProgress = 0;
                        isPlaying = false;
                        clearInterval(audioInterval);
                        this.classList.remove('playing');
                        this.innerHTML = '<i class="fas fa-volume-up"></i> 播放作品讲解';
                        progressFill.style.width = '0%';
                        audioTime.textContent = '0:00 / 1:30';
                        return;
                    }

                    const minutes = Math.floor(audioProgress / 60);
                    const seconds = audioProgress % 60;
                    progressFill.style.width = `${(audioProgress / 90) * 100}%`;
                    audioTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / 1:30`;
                }, 1000);
            }
        });

        // 点击进度条
        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', function(e) {
            if (!isPlaying) return;

            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;

            audioProgress = Math.floor(percentage * 90);
            progressFill.style.width = `${percentage * 100}%`;

            const minutes = Math.floor(audioProgress / 60);
            const seconds = audioProgress % 60;
            audioTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / 1:30`;
        });
    }

    // 设置分享功能
    function setupShareFunctionality() {
        const shareBtn = document.getElementById('shareBtn');
        const collectIcon = document.getElementById('collectIcon');
        const heroFavoriteBtn = document.getElementById('heroFavoriteBtn');

        // 分享按钮
        shareBtn.addEventListener('click', function() {
            openShareModal();
        });

        // 收藏功能
        function toggleFavorite(btn) {
            const icon = btn.querySelector('i') || btn;
            if (icon.classList.contains('far') || icon.classList.contains('fa-heart-o')) {
                icon.classList.remove('far', 'fa-heart-o');
                icon.classList.add('fas', 'fa-heart');
                icon.style.color = '#D4AF37';
                showNotification('已收藏此作品', 'success');
            } else {
                icon.classList.remove('fas', 'fa-heart');
                icon.classList.add('far', 'fa-heart-o');
                icon.style.color = '#C41E3A';
                showNotification('已取消收藏', 'info');
            }
        }

        collectIcon.addEventListener('click', function() {
            toggleFavorite(this);
        });

        heroFavoriteBtn.addEventListener('click', function() {
            toggleFavorite(this);
        });

        // 鼠标悬停效果
        const hoverElements = [collectIcon, shareBtn];
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
            });
            el.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // 打开分享模态框
    function openShareModal() {
        const modal = document.getElementById('shareModal');
        modal.classList.add('active');

        // 添加键盘事件监听
        document.addEventListener('keydown', handleEscapeKeyPress);
    }

    // 关闭分享模态框
    function closeShareModal() {
        const modal = document.getElementById('shareModal');
        modal.classList.remove('active');

        // 移除键盘事件监听
        document.removeEventListener('keydown', handleEscapeKeyPress);
    }

    // 处理ESC键关闭模态框
    function handleEscapeKeyPress(e) {
        if (e.key === 'Escape') {
            closeShareModal();
        }
    }

    // 设置分享选项
    function setupShareOptions() {
        // 微信分享
        window.shareToWechat = function() {
            showNotification('微信分享功能正在开发中', 'info');
            closeShareModal();
        };

        // QQ分享
        window.shareToQQ = function() {
            showNotification('QQ分享功能正在开发中', 'info');
            closeShareModal();
        };

        // 微博分享
        window.shareToWeibo = function() {
            showNotification('微博分享功能正在开发中', 'info');
            closeShareModal();
        };

        // 复制链接
        window.copyLink = function() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('链接已复制到剪贴板', 'success');
                closeShareModal();
            }).catch(() => {
                showNotification('复制链接失败', 'error');
            });
        };
    }

    // 设置图片缩放功能
    function setupImageZoom() {
        const zoomableImages = document.querySelectorAll('.content-image img, .work-item img, .profile-image img');

        zoomableImages.forEach(img => {
            img.addEventListener('click', function() {
                // 创建放大图层
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    cursor: zoom-out;
                `;

                const zoomedImage = document.createElement('img');
                zoomedImage.src = this.src;
                zoomedImage.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    border: 2px solid #D4AF37;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                `;

                overlay.appendChild(zoomedImage);

                // 点击关闭
                overlay.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                });

                document.body.appendChild(overlay);
            });
        });
    }

    // 设置滚动进度条
    function setupScrollProgress() {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'scroll-progress';
        document.body.appendChild(progressDiv);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            const scrollPercentRounded = Math.round(scrollPercent * 100) / 100;

            progressDiv.style.width = `${scrollPercentRounded * 100}%`;
        });
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
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
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
    `;
    document.head.appendChild(style);

    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 设置页面可见性API检测
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时暂停轮播
            const autoPlayInterval = setInterval(() => {}, 1000);
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        } else {
            // 页面显示时重新开始轮播
            initCarousel();
        }
    });

    // 键盘事件处理
    document.addEventListener('keydown', function(e) {
        // 方向键控制轮播
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
        // ESC关闭模态框
        else if (e.key === 'Escape') {
            closeShareModal();
        }
    });

    // 平滑滚动到锚点
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

    // 页面加载完成后的初始化
    initCarousel();
    setupShareOptions();

    // 返回顶部按钮
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #C41E3A;
        color: white;
        border: 2px solid #D4AF37;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        display: none;
    `;

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

    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 性能优化：使用requestAnimationFrame处理滚动事件
    let ticking = false;
    function updateScroll() {
        // 更新滚动进度条
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100) / 100;

        document.querySelector('.scroll-progress').style.width = `${scrollPercentRounded * 100}%`;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });

    // 添加本地存储功能
    function saveFavoriteStatus() {
        const collectIcon = document.getElementById('collectIcon');
        const heroFavoriteBtn = document.getElementById('heroFavoriteBtn');
        const isFavorite = collectIcon.querySelector('i').classList.contains('fas');

        localStorage.setItem('detail_favorite', JSON.stringify({
            timestamp: Date.now(),
            isFavorite: isFavorite
        }));
    }

    // 监听收藏状态变化
    document.addEventListener('click', function(e) {
        if (e.target.closest('#collectIcon') || e.target.closest('#heroFavoriteBtn')) {
            setTimeout(saveFavoriteStatus, 100);
        }
    });

    // 页面加载时恢复收藏状态
    setTimeout(() => {
        const savedData = JSON.parse(localStorage.getItem('detail_favorite') || '{}');
        if (savedData.isFavorite) {
            document.getElementById('collectIcon').innerHTML = '<i class="fas fa-heart" style="color:#D4AF37;"></i>';
            document.getElementById('heroFavoriteBtn').innerHTML = '<i class="fas fa-heart" style="color:#D4AF37;"></i>';
        }
    }, 100);

    // 暴露全局函数
    window.changeSlide = changeSlide;
    window.closeShareModal = closeShareModal;
});