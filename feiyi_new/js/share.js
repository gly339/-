// 作品生成分享页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化分享页面
    function initSharePage() {
        setupEventListeners();
        setupPageLoadAnimation();
        setupScrollEffects();
        setupTooltip();
        setupShareModal();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 保存图片按钮
        const saveBtn = document.querySelector('.action-btn.primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveImage);
        }

        // 重新制作按钮
        const newWorkBtn = document.querySelector('.action-btn:nth-child(2)');
        if (newWorkBtn) {
            newWorkBtn.addEventListener('click', startNewWork);
        }

        // 返回工坊按钮
        const backBtn = document.querySelector('.action-btn:nth-child(3)');
        if (backBtn) {
            backBtn.addEventListener('click', goToWorkshop);
        }

        // 分享按钮
        const shareBtn = document.querySelector('.action-btn:nth-child(4)');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareProduct);
        }

        // 点击图片放大
        const productImage = document.querySelector('.product-image');
        if (productImage) {
            productImage.addEventListener('click', function() {
                zoomImage(this);
            });
        }
    }

    // 保存图片
    function saveImage() {
        showMessage('正在保存图片...', 'info');

        // 模拟保存过程
        setTimeout(() => {
            showMessage('图片已保存到本地！', 'success');

            // 在实际应用中，这里会触发真实的图片下载
            // const canvas = document.createElement('canvas');
            // const ctx = canvas.getContext('2d');
            // const img = new Image();
            // img.src = 'data:image/svg+xml;base64,...'; // SVG Base64编码
            // img.onload = function() {
            //     canvas.width = img.width;
            //     canvas.height = img.height;
            //     ctx.drawImage(img, 0, 0);
            //     const link = document.createElement('a');
            //     link.download = '非遗作品_' + Date.now() + '.png';
            //     link.href = canvas.toDataURL('image/png');
            //     link.click();
            // };
        }, 1500);
    }

    // 开始新作品
    function startNewWork() {
        showMessage('正在返回工坊首页...', 'info');

        // 模拟跳转过程
        setTimeout(() => {
            window.location.href = 'workshop.html';
        }, 1000);
    }

    // 前往工坊首页
    function goToWorkshop() {
        showMessage('正在返回工坊首页...', 'info');

        // 模拟跳转过程
        setTimeout(() => {
            window.location.href = 'workshop.html';
        }, 1000);
    }

    // 分享作品
    function shareProduct() {
        showMessage('打开分享面板...', 'info');

        // 显示分享模态框
        openShareModal();
    }

    // 放大图片
    function zoomImage(element) {
        showMessage('点击图片可查看细节', 'info');

        // 创建放大效果
        element.style.transform = 'scale(1.1)';
        element.style.cursor = 'zoom-out';

        // 添加点击事件关闭放大
        element.onclick = function() {
            this.style.transform = 'scale(1)';
            this.style.cursor = 'zoom-in';
            this.onclick = null;
        };
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
    function setupShareModal() {
        // 微信分享
        window.shareToWechat = function() {
            showMessage('微信分享功能正在开发中', 'info');
            closeShareModal();
        };

        // QQ分享
        window.shareToQQ = function() {
            showMessage('QQ分享功能正在开发中', 'info');
            closeShareModal();
        };

        // 微博分享
        window.shareToWeibo = function() {
            showMessage('微博分享功能正在开发中', 'info');
            closeShareModal();
        };

        // 复制链接
        window.copyLink = function() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showMessage('链接已复制到剪贴板', 'success');
                closeShareModal();
            }).catch(() => {
                showMessage('复制链接失败', 'error');
            });
        };
    }

    // 显示消息提示
    function showMessage(text, type = 'info') {
        const toast = document.getElementById('messageToast');
        toast.textContent = text;
        toast.className = `message-toast ${type} show`;

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 设置页面加载动画
    function setupPageLoadAnimation() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);

        // 为按钮添加入场动画
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.1}s`;
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
    }

    // 设置工具提示
    function setupTooltip() {
        // 可以在这里添加工具提示功能
        console.log('工具提示功能已初始化');
    }

    // 页面可见性API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('页面隐藏');
        } else {
            console.log('页面显示');
        }
    });

    // 键盘事件处理
    document.addEventListener('keydown', function(e) {
        // ESC键关闭模态框
        if (e.key === 'Escape') {
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

    // 初始化所有功能
    initSharePage();

    // 模拟页面加载完成
    setTimeout(() => {
        showMessage('作品生成成功！', 'success');
    }, 1000);
});