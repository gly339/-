const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'IntangibleHeritage'
};

async function updateDatabase() {
  let connection;
  try {
    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ 成功连接到数据库');

    // 1. 删除 comments 表
    console.log('\n📋 步骤 1: 删除 comments 表');
    await connection.execute('DROP TABLE IF EXISTS comments');
    console.log('✅ comments 表已删除');

    // 2. 创建新的 quiz 表（合并 quiz_question 和 quiz_answer）
    console.log('\n📋 步骤 2: 创建新的 quiz 表');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artifact_id INT,
        category VARCHAR(50),
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        explanation TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 新的 quiz 表已创建');

    // 3. 从 quiz_question 和 quiz_answer 表中提取数据并插入到新的 quiz 表
    console.log('\n📋 步骤 3: 迁移数据到新的 quiz 表');
    const [questions] = await connection.execute('SELECT * FROM quiz_question');
    
    for (const question of questions) {
      const [answers] = await connection.execute('SELECT * FROM quiz_answer WHERE question_id = ?', [question.id]);
      
      if (answers.length === 4) {
        // 按 option_label 排序答案
        const sortedAnswers = answers.sort((a, b) => a.option_label.localeCompare(b.option_label));
        const correctAnswer = sortedAnswers.find(a => a.is_correct === 1)?.option_label || 'A';
        
        await connection.execute(
          `INSERT INTO quiz (artifact_id, category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, sort_order) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            question.artifact_id,
            question.category,
            question.question,
            sortedAnswers[0].option_text,
            sortedAnswers[1].option_text,
            sortedAnswers[2].option_text,
            sortedAnswers[3].option_text,
            correctAnswer,
            question.difficulty,
            question.sort_order
          ]
        );
      }
    }
    console.log('✅ 数据迁移完成');

    // 4. 删除旧的 quiz_question 和 quiz_answer 表
    console.log('\n📋 步骤 4: 删除旧的 quiz 相关表');
    await connection.execute('DROP TABLE IF EXISTS quiz_answer');
    await connection.execute('DROP TABLE IF EXISTS quiz_question');
    console.log('✅ 旧的 quiz 表已删除');

    // 5. 根据 22 (2).html 中的问答题添加数据
    console.log('\n📋 步骤 5: 添加新的问答题数据');
    const quizData = [
      {
        category: '剪纸',
        question: '以下哪种是中国传统剪纸的主要工具？',
        option_a: '剪刀',
        option_b: '刻刀',
        option_c: '毛笔',
        option_d: '印章',
        correct_answer: 'A',
        difficulty: 'easy',
        sort_order: 1
      },
      {
        category: '刺绣',
        question: '中国四大名绣不包括以下哪项？',
        option_a: '苏绣',
        option_b: '湘绣',
        option_c: '粤绣',
        option_d: '京绣',
        correct_answer: 'D',
        difficulty: 'medium',
        sort_order: 2
      },
      {
        category: '陶瓷',
        question: '青花瓷主要出现在哪个朝代？',
        option_a: '唐代',
        option_b: '宋代',
        option_c: '元代',
        option_d: '明代',
        correct_answer: 'C',
        difficulty: 'medium',
        sort_order: 3
      },
      {
        category: '皮影',
        question: '皮影戏的主要材料是什么？',
        option_a: '纸张',
        option_b: '羊皮',
        option_c: '布料',
        option_d: '木材',
        correct_answer: 'B',
        difficulty: 'easy',
        sort_order: 4
      },
      {
        category: '年画',
        question: '年画的主要用途是什么？',
        option_a: '装饰',
        option_b: '祈福',
        option_c: '教育',
        option_d: '以上都是',
        correct_answer: 'D',
        difficulty: 'easy',
        sort_order: 5
      }
    ];

    for (const quiz of quizData) {
      await connection.execute(
        `INSERT INTO quiz (category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quiz.category,
          quiz.question,
          quiz.option_a,
          quiz.option_b,
          quiz.option_c,
          quiz.option_d,
          quiz.correct_answer,
          quiz.difficulty,
          quiz.sort_order
        ]
      );
    }
    console.log('✅ 新的问答题数据已添加');

    console.log('\n🎉 数据库更新完成！');

  } catch (error) {
    console.error('❌ 数据库操作错误:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 数据库连接已关闭');
    }
  }
}

// 执行数据库更新
updateDatabase();