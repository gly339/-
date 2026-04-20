const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'IntangibleHeritage',
  multipleStatements: true
};

async function checkDatabase() {
  console.log('检查数据库状态...');
  
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    // 检查所有表
    console.log('\n=== 检查表结构 ===');
    const tables = [
  'category',
  'inheritor',
  'exhibit',
  'process',
  'carrier',
  'admin_user',
  'user',
  'quiz',
  'works',
  'assets',
  'favorites',
  'view_history'
];
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          const [countRows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`${table}: 存在 (${countRows[0].count} 条记录)`);
        } else {
          console.log(`${table}: 不存在`);
        }
      } catch (err) {
        console.log(`${table}: 错误 - ${err.message}`);
      }
    }
    
    connection.release();
    await pool.end();
    console.log('\n数据库检查完成！');
  } catch (err) {
    console.error('数据库连接失败:', err.message);
  }
}

// 执行检查
checkDatabase();