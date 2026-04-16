// 分步数字制作交互页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 当前步骤状态
    let currentStep = 1;
    const totalSteps = 4;

    // 初始化交互页面
    function initInteractivePage() {
        setupStepNavigation();
        setupStepContent();
        setupCanvas();
        setupEventListeners();
        setupTooltip();
        setupScrollEffects();
        updateProgress();
        updateStepIndicators();
        updateStepContent();
        updateButtons();
    }

    // 设置步骤导航
    function setupStepNavigation() {
        // 步骤指示器点击事件
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            item.addEventListener('click', function() {
                const step = parseInt(this.dataset.step);
                if (step !== currentStep) {
                    goToStep(step);
                }
            });
        });
    }

    // 设置步骤内容
    function setupStepContent() {
        // 初始化步骤内容显示
        const stepContents = document.querySelectorAll('.step-content');
        stepContents.forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`step${currentStep}-content`).classList.add('active');
    }

    // 设置画布功能
    function setupCanvas() {
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // 初始化画布
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 鼠标绘图相关变量
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let currentTool = 'pen';
        let brushColor = '#C41E3A';
        let brushSize = 3;

        // 工具选择
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                toolButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentTool = this.dataset.tool;

                if (currentTool === 'eraser') {
                    brushColor = 'white';
                } else {
                    brushColor = document.getElementById('brushColor').value;
                }
            });
        });

        // 颜色选择
        const colorPicker = document.getElementById('brushColor');
        colorPicker.addEventListener('input', function() {
            brushColor = this.value;
            if (currentTool !== 'eraser') {
                // 更新画笔颜色
            }
        });

        // 画笔大小
        const brushSizeSlider = document.getElementById('brushSize');
        brushSizeSlider.addEventListener('input', function() {
            brushSize = this.value;
        });

        // 模板选择
        const templateItems = document.querySelectorAll('.template-item');
        templateItems.forEach(item => {
            item.addEventListener('click', function() {
                const template = this.dataset.template;
                applyTemplate(template);
            });
        });

        // 鼠标事件
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // 触摸事件（移动端）
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', stopDrawing);

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = getCoordinates(e);
        }

        function draw(e) {
            if (!isDrawing) return;

            const [x, y] = getCoordinates(e);

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            [lastX, lastY] = [x, y];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function getCoordinates(e) {
            const rect = canvas.getBoundingClientRect();
            let x, y;

            if (e.type.includes('touch')) {
                const touch = e.touches[0] || e.changedTouches[0];
                x = touch.clientX - rect.left;
                y = touch.clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }

            return [x, y];
        }

        function handleTouchStart(e) {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }

        function handleTouchMove(e) {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }

        // 应用模板
        function applyTemplate(template) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            switch(template) {
                case 'flower':
                    drawFlowerTemplate();
                    break;
                case 'bird':
                    drawBirdTemplate();
                    break;
                case 'fish':
                    drawFishTemplate();
                    break;
            }

            showMessage('模板已应用！');
        }

        function drawFlowerTemplate() {
            ctx.beginPath();
            ctx.arc(200, 200, 80, 0, Math.PI * 2);
            ctx.fillStyle = '#C41E3A';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(200, 200, 60, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // 花瓣
            for(let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = 200 + Math.cos(angle) * 60;
                const y = 200 + Math.sin(angle) * 60;
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fillStyle = '#C41E3A';
                ctx.fill();
            }
        }

        function drawBirdTemplate() {
            // 鸟的身体
            ctx.beginPath();
            ctx.ellipse(200, 200, 60, 40, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#C41E3A';
            ctx.fill();

            // 鸟头
            ctx.beginPath();
            ctx.arc(260, 180, 30, 0, Math.PI * 2);
            ctx.fillStyle = '#C41E3A';
            ctx.fill();

            // 鸟眼
            ctx.beginPath();
            ctx.arc(270, 170, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // 鸟嘴
            ctx.beginPath();
            ctx.moveTo(290, 180);
            ctx.lineTo(310, 185);
            ctx.lineTo(290, 190);
            ctx.closePath();
            ctx.fillStyle = '#D4AF37';
            ctx.fill();
        }

        function drawFishTemplate() {
            // 鱼身
            ctx.beginPath();
            ctx.ellipse(200, 200, 80, 40, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#C41E3A';
            ctx.fill();

            // 鱼尾
            ctx.beginPath();
            ctx.moveTo(120, 200);
            ctx.lineTo(100, 180);
            ctx.lineTo(100, 220);
            ctx.closePath();
            ctx.fillStyle = '#C41E3A';
            ctx.fill();

            // 鱼眼
            ctx.beginPath();
            ctx.arc(240, 190, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 纸张边缘点击事件
        const paperEdges = document.querySelectorAll('.paper-edge');
        paperEdges.forEach(edge => {
            edge.addEventListener('click', function() {
                const edgeType = this.dataset.edge;
                handlePaperEdgeClick(edgeType);
            });
        });

        // 折叠按钮
        const foldBtn = document.querySelector('.fold-btn');
        if (foldBtn) {
            foldBtn.addEventListener('click', performFold);
        }

        // 裁剪按钮
        const cutBtn = document.querySelector('.action-btn.primary');
        if (cutBtn) {
            cutBtn.addEventListener('click', performCut);
        }

        // 展开按钮
        const expandBtn = document.querySelector('.expand-instructions .action-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', expandArtwork);
        }

        // 重置按钮
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetCurrentStep);
        }

        // 教程按钮
        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', showHelp);
        }

        // 模态框关闭
        const closeBtns = document.querySelectorAll('.close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeTutorialModal);
        });
    }

    // 处理纸张边缘点击
    function handlePaperEdgeClick(edgeType) {
        showMessage(`点击了${getEdgeLabel(edgeType)}边缘`);
        highlightEdge(edgeType);
    }

    // 获取边缘标签
    function getEdgeLabel(edgeType) {
        const labels = {
            'top': '顶部',
            'bottom': '底部',
            'left': '左侧',
            'right': '右侧'
        };
        return labels[edgeType] || edgeType;
    }

    // 高亮边缘
    function highlightEdge(edgeType) {
        const edges = document.querySelectorAll('.paper-edge');
        edges.forEach(edge => {
            if (edge.dataset.edge === edgeType) {
                edge.style.opacity = '1';
                edge.style.background = '#D4AF37';
            } else {
                edge.style.opacity = '0.7';
                edge.style.background = '#C41E3A';
            }
        });
    }

    // 执行折叠
    function performFold() {
        showMessage('正在执行折叠操作...');

        // 模拟折叠效果
        setTimeout(() => {
            const foldLines = document.querySelectorAll('.fold-line');
            foldLines.forEach(line => {
                line.style.opacity = '1';
            });

            showMessage('折叠完成！点击下一步进入下一个步骤。', 'success');
            updatePreviewWithFold();
        }, 1000);
    }

    // 更新预览显示折叠
    function updatePreviewWithFold() {
        const previewPaper = document.querySelector('.preview-fold-lines');
        if (previewPaper) {
            previewPaper.innerHTML = `
                <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#D4AF37;transform:translateY(-50%);"></div>
                <div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:#D4AF37;transform:translateX(-50%);"></div>
            `;
        }
    }

    // 执行裁剪
    function performCut() {
        showMessage('正在执行裁剪操作...');

        // 模拟裁剪效果
        setTimeout(() => {
            showMessage('裁剪完成！点击下一步进入下一个步骤。', 'success');
        }, 1000);
    }

    // 展开作品
    function expandArtwork() {
        showMessage('正在展开作品...', 'info');

        // 模拟展开动画
        setTimeout(() => {
            showMessage('作品已展开！', 'success');
        }, 1500);
    }

    // 重置当前步骤
    function resetCurrentStep() {
        showMessage('正在重置当前步骤...');

        // 重置不同步骤的内容
        switch(currentStep) {
            case 1:
                resetFoldStep();
                break;
            case 2:
                resetDrawStep();
                break;
            case 3:
                resetCutStep();
                break;
            case 4:
                resetFinalStep();
                break;
        }

        showMessage('当前步骤已重置！', 'info');
    }

    // 重置折叠步骤
    function resetFoldStep() {
        const foldLines = document.querySelectorAll('.fold-line');
        foldLines.forEach(line => {
            line.style.opacity = '0.7';
        });
    }

    // 重置绘制步骤
    function resetDrawStep() {
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 重置裁剪步骤
    function resetCutStep() {
        // 裁剪步骤重置逻辑
        showMessage('裁剪步骤已重置');
    }

    // 重置成品步骤
    function resetFinalStep() {
        // 成品步骤重置逻辑
        showMessage('成品步骤已重置');
    }

    // 显示教程
    function showHelp() {
        const tutorialModal = document.getElementById('tutorialModal');
        const tutorialTitle = document.getElementById('tutorialTitle');
        const tutorialBody = document.getElementById('tutorialBody');

        tutorialModal.classList.add('active');

        // 根据当前步骤设置教程内容
        switch(currentStep) {
            case 1:
                tutorialTitle.textContent = '折叠步骤教程';
                tutorialBody.innerHTML = `
                    <p>在折叠步骤中，您需要：</p>
                    <ol>
                        <li>点击纸张的边缘来选择折叠方向</li>
                        <li>选择合适的折叠方式（对折、四折等）</li>
                        <li>确认折叠效果</li>
                    </ol>
                `;
                break;
            case 2:
                tutorialTitle.textContent = '纹样勾勒教程';
                tutorialBody.innerHTML = `
                    <p>在纹样勾勒步骤中，您需要：</p>
                    <ol>
                        <li>选择画笔或橡皮擦工具</li>
                        <li>选择合适的颜色和画笔大小</li>
                        <li>在纸张上绘制您喜欢的图案</li>
                        <li>也可以使用模板快速绘制</li>
                    </ol>
                `;
                break;
            case 3:
                tutorialTitle.textContent = '裁剪刻画教程';
                tutorialBody.innerHTML = `
                    <p>在裁剪刻画步骤中，您需要：</p>
                    <ol>
                        <li>点击纹样轮廓确定裁剪路径</li>
                        <li>选择合适的裁剪工具</li>
                        <li>执行裁剪操作</li>
                        <li>注意不要裁剪过多</li>
                    </ol>
                `;
                break;
            case 4:
                tutorialTitle.textContent = '成品展示教程';
                tutorialBody.innerHTML = `
                    <p>在成品展示步骤中：</p>
                    <ol>
                        <li>查看您的最终作品</li>
                        <li>可以点击展开查看细节</li>
                        <li>保存您的作品</li>
                    </ol>
                `;
                break;
        }
    }

    // 关闭教程模态框
    function closeTutorialModal() {
        const tutorialModal = document.getElementById('tutorialModal');
        tutorialModal.classList.remove('active');
    }

    // 更新进度条
    function updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    // 更新步骤指示器
    function updateStepIndicators() {
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            const step = parseInt(item.dataset.step);
            if (step < currentStep) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (step === currentStep) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
    }

    // 更新步骤内容显示
    function updateStepContent() {
        const stepContents = document.querySelectorAll('.step-content');
        stepContents.forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`step${currentStep}-content`).classList.add('active');

        // 更新操作标题和描述
        const titles = {
            1: ['步骤 1：折叠纸张', '请拖拽纸张边缘按照提示折叠'],
            2: ['步骤 2：纹样勾勒', '使用画笔工具绘制您的设计图案'],
            3: ['步骤 3：裁剪刻画', '沿着设计轮廓进行裁剪'],
            4: ['步骤 4：展开成品', '查看您完成的作品']
        };

        const [title, desc] = titles[currentStep];
        document.getElementById('operationTitle').textContent = title;
        document.getElementById('operationDesc').textContent = desc;
        document.getElementById('stepHint').textContent = getStepHint(currentStep);
    }

    // 获取步骤提示
    function getStepHint(step) {
        const hints = {
            1: '请先完成折叠步骤',
            2: '点击模板或自由绘制',
            3: '确认裁剪路径后进行裁剪',
            4: '作品已完成，点击查看细节'
        };
        return hints[step] || '请完成当前步骤';
    }

    // 更新按钮状态
    function updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (currentStep <= 1) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }

        if (currentStep >= totalSteps) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = '完成制作';
        } else {
            nextBtn.disabled = false;
            nextBtn.innerHTML = '下一步<i class="fas fa-arrow-right"></i>';
        }
    }

    // 前往指定步骤
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;

        currentStep = step;
        updateProgress();
        updateStepIndicators();
        updateStepContent();
        updateButtons();
        showMessage(`已跳转到步骤 ${step}`);
    }

    // 前进一步
    function goToNextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateProgress();
            updateStepIndicators();
            updateStepContent();
            updateButtons();
            showMessage(`已前进到步骤 ${currentStep}`);
        } else {
            showMessage('恭喜！您已完成所有制作步骤！', 'success');
        }
    }

    // 返回上一步
    function goToPrevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateProgress();
            updateStepIndicators();
            updateStepContent();
            updateButtons();
            showMessage(`已返回到步骤 ${currentStep}`);
        }
    }

    // 显示消息提示
    function showMessage(text, type = 'info') {
        const toast = document.getElementById('messageToast');
        toast.textContent = text;
        toast.className = `message-toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 设置工具提示
    function setupTooltip() {
        // 可以在这里添加工具提示功能
        console.log('工具提示功能已初始化');
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

    // 页面加载动画
    function setupPageLoadAnimation() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    // 键盘事件处理
    function setupKeyboardEvents() {
        document.addEventListener('keydown', function(e) {
            // 方向键控制步骤
            if (e.key === 'ArrowLeft') {
                goToPrevStep();
            } else if (e.key === 'ArrowRight') {
                goToNextStep();
            }
            // ESC键关闭模态框
            else if (e.key === 'Escape') {
                closeTutorialModal();
            }
        });
    }

    // 页面可见性API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('页面隐藏');
        } else {
            console.log('页面显示');
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
    initInteractivePage();
    setupKeyboardEvents();
    setupPageLoadAnimation();

    // 暴露全局函数供HTML调用
    window.goToStep = goToStep;
    window.goToNextStep = goToNextStep;
    window.goToPrevStep = goToPrevStep;
    window.resetCurrentStep = resetCurrentStep;
    window.showHelp = showHelp;
    window.closeTutorialModal = closeTutorialModal;
    window.performFold = performFold;
    window.performCut = performCut;
    window.expandArtwork = expandArtwork;
});