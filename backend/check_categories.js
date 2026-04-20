const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'IntangibleHeritage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function checkCategories() {
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ MySQL 数据库连接成功');
    
    const [rows] = await connection.execute('SELECT name FROM category');
    console.log('数据库中的分类名称:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name}`);
    });
    
    connection.release();
    pool.end();
  } catch (err) {
    console.error('❌ 数据库连接失败:', err.message);
  }
}

checkCategories();
