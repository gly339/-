const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'IntangibleHeritage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function updateAdminPassword() {
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ MySQL 数据库连接成功');
    
    // 更新 admin 用户的密码为 123456
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const [result] = await connection.execute(
      'UPDATE user SET password_hash = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ 管理员密码更新成功！新密码：123456');
    } else {
      // 如果 admin 用户不存在，创建一个
      await connection.execute(
        'INSERT INTO user (username, password_hash, is_active) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 1]
      );
      console.log('✅ 管理员用户创建成功！密码：123456');
    }
    
    connection.release();
    pool.end();
  } catch (err) {
    console.error('❌ 数据库操作失败:', err.message);
  }
}

updateAdminPassword();
