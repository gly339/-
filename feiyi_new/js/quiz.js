// 答题闯关页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 答题数据
    const quizData = [
        {
            question: "中国有多少项世界级非遗代表性项目？",
            options: ["50项", "70项", "100项", "130项"],
            correctAnswer: "D"
        },
        {
            question: "以下哪种属于传统手工技艺？",
            options: ["京剧", "剪纸", "昆曲", "中医"],
            correctAnswer: "B"
        },
        {
            question: "下列哪个城市被誉为'中国剪纸之乡'？",
            options: ["北京", "天津", "河北", "陕西"],
            correctAnswer: "D"
        },
        {
            question: "皮影戏起源于哪个朝代？",
            options: ["唐朝", "宋朝", "明朝", "汉朝"],
            correctAnswer: "D"
        },
        {
            question: "苏绣主要产自哪个省份？",
            options: ["浙江", "江苏", "安徽", "福建"],
            correctAnswer: "B"
        }
    ];

    // 当前状态
    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;
    let answered = false;

    // 初始化答题页面
    function initQuiz() {
        setupEventListeners();
        setupPageLoadAnimation();
        setupScrollEffects();
        loadQuestion();
        updateProgress();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 选项点击事件
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                if (!answered) {
                    selectOption(this);
                }
            });
        });

        // 上一题按钮
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', goToPreviousQuestion);
        }

        // 下一题按钮
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', goToNextQuestion);
        }

        // 键盘事件
        document.addEventListener('keydown', handleKeyDown);
    }

    // 加载题目
    function loadQuestion() {
        const question = quizData[currentQuestion];

        // 更新题目文本
        const questionText = document.getElementById('questionText');
        questionText.textContent = question.question;

        // 更新选项
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach((item, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            item.dataset.option = optionLetter;
            item.querySelector('.option-letter').textContent = optionLetter;
            item.querySelector('.option-text').textContent = question.options[index];

            // 清除之前的状态
            item.classList.remove('selected', 'correct', 'incorrect');
        });

        // 重置状态
        selectedOption = null;
        answered = false;

        // 更新按钮状态
        updateButtonStates();
    }

    // 选择选项
    function selectOption(selectedElement) {
        // 移除之前的选择
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach(item => {
            item.classList.remove('selected');
        });

        // 添加新的选择
        selectedElement.classList.add('selected');
        selectedOption = selectedElement.dataset.option;

        // 检查答案
        checkAnswer();
    }

    // 检查答案
    function checkAnswer() {
        const correctAnswer = quizData[currentQuestion].correctAnswer;
        const selectedAnswer = selectedOption;

        if (selectedAnswer === correctAnswer) {
            // 答对了
            score += 10;
            showNotification('答对啦，加10分！', 'success');

            // 添加正确样式
            const selectedElement = document.querySelector(`.option-item[data-option="${selectedAnswer}"]`);
            if (selectedElement) {
                selectedElement.classList.add('correct');
            }
        } else {
            // 答错了
            showNotification('答错啦，正确答案是' + correctAnswer, 'error');

            // 添加错误样式
            const selectedElement = document.querySelector(`.option-item[data-option="${selectedAnswer}"]`);
            if (selectedElement) {
                selectedElement.classList.add('incorrect');
            }

            // 显示正确答案
            const correctElement = document.querySelector(`.option-item[data-option="${correctAnswer}"]`);
            if (correctElement) {
                correctElement.classList.add('correct');
            }
        }

        answered = true;
        updateProgress();
        updateButtonStates();

        // 保存分数到本地存储
        saveScore();
    }

    // 更新进度条和分数
    function updateProgress() {
        const totalQuestions = quizData.length;
        const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

        // 更新进度条
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${progressPercentage}%`;

        // 更新文本
        document.getElementById('currentLevel').textContent = currentQuestion + 1;
        document.getElementById('totalLevels').textContent = totalQuestions;
        document.getElementById('currentScore').textContent = score;
    }

    // 更新按钮状态
    function updateButtonStates() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // 上一题按钮
        if (currentQuestion === 0) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }

        // 下一题按钮
        if (currentQuestion === quizData.length - 1) {
            nextBtn.textContent = '完成答题';
        } else {
            nextBtn.textContent = '下一题';
        }
    }

    // 前往下一题
    function goToNextQuestion() {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
            updateProgress();
            scrollToTop();
        } else {
            // 完成答题
            showResult();
        }
    }

    // 前往上一题
    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
            updateProgress();
            scrollToTop();
        }
    }

    // 滚动到顶部
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 显示结果
    function showResult() {
        const resultModal = document.getElementById('resultModal');
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const finalScore = document.getElementById('finalScore');
        const resultComment = document.getElementById('resultComment');

        // 设置结果内容
        resultTitle.textContent = '答题完成';
        finalScore.textContent = score;

        // 根据得分设置评价
        let comment = '';
        if (score >= 40) {
            comment = '你的表现非常出色！继续保持对非遗文化的热爱！';
        } else if (score >= 20) {
            comment = '不错的表现！你对非遗知识掌握得相当好！';
        } else {
            comment = '继续加油，了解更多非遗知识吧！';
        }

        resultComment.textContent = comment;

        // 显示模态框
        resultModal.classList.add('active');

        // 保存最终成绩
        saveFinalScore(score);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `message-toast ${type} show`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#2A5C68' : type === 'error' ? '#ff4757' : '#C41E3A'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-family: 'Noto Serif SC', serif;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 重新开始答题
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedOption = null;
        answered = false;

        const resultModal = document.getElementById('resultModal');
        resultModal.classList.remove('active');

        loadQuestion();
        updateProgress();
        scrollToTop();
    }

    // 返回首页
    function goHome() {
        window.location.href = 'index.html';
    }

    // 键盘事件处理
    function handleKeyDown(e) {
        // 空格键选择选项
        if (e.code === 'Space' && !answered) {
            e.preventDefault();
            const selectedElement = document.querySelector('.option-item.selected');
            if (!selectedElement) {
                const firstOption = document.querySelector('.option-item');
                if (firstOption) {
                    selectOption(firstOption);
                }
            }
        }

        // 方向键控制
        if (e.key === 'ArrowLeft') {
            goToPreviousQuestion();
        } else if (e.key === 'ArrowRight') {
            goToNextQuestion();
        }

        // 数字键选择选项
        if (e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const optionItems = document.querySelectorAll('.option-item');
            const index = parseInt(e.key) - 1;
            if (index < optionItems.length && !answered) {
                selectOption(optionItems[index]);
            }
        }
    }

    // 设置页面加载动画
    function setupPageLoadAnimation() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
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

    // 保存分数到本地存储
    function saveScore() {
        localStorage.setItem('quiz_score', score);
    }

    // 保存最终分数
    function saveFinalScore(finalScore) {
        localStorage.setItem('quiz_final_score', finalScore);
    }

    // 恢复之前的分数（如果存在）
    function restoreScore() {
        const savedScore = localStorage.getItem('quiz_score');
        if (savedScore) {
            score = parseInt(savedScore);
            updateProgress();
        }
    }

    // 页面可见性API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('页面隐藏');
        } else {
            console.log('页面显示');
        }
    });

    // 关闭结果模态框
    function closeResultModal() {
        const resultModal = document.getElementById('resultModal');
        resultModal.classList.remove('active');
    }

    // 关闭通知模态框
    function closeNotificationModal() {
        const notificationModal = document.getElementById('notificationModal');
        notificationModal.classList.remove('active');
    }

    // 初始化所有功能
    initQuiz();
    restoreScore();

    // 暴露全局函数供HTML调用
    window.goToNextQuestion = goToNextQuestion;
    window.goToPreviousQuestion = goToPreviousQuestion;
    window.restartQuiz = restartQuiz;
    window.goHome = goHome;
    window.closeResultModal = closeResultModal;
    window.closeNotificationModal = closeNotificationModal;
});