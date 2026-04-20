const fs = require('fs');
const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  multipleStatements: true
};

async function initDatabase() {
  console.log('正在初始化数据库...');
  
  try {
    // 读取 SQL 脚本
    const sqlScript = fs.readFileSync('../init_database.sql', 'utf8');
    
    // 连接数据库
    const connection = await mysql.createConnection(dbConfig);
    console.log('成功连接到 MySQL 服务器');
    
    // 执行 SQL 脚本
    await connection.execute(sqlScript);
    console.log('数据库初始化成功！');
    
    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
    
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    process.exit(1);
  }
}

// 执行初始化
initDatabase();