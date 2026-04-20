const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'feiyi_secret_key';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'IntangibleHeritage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

let pool;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('../frontend'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const initMySQL = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ MySQL 数据库连接成功');
    connection.release();
    await initDatabase();
    await initUserTable();
  } catch (err) {
    console.error('❌ MySQL 数据库连接失败:', err.message);
    console.log('请确保 MySQL 服务已启动并且数据库 IntangibleHeritage 已创建');
  }
};

const initUserTable = async () => {
  try {
    // 检查 user 表是否存在
    const [rows] = await pool.execute('SELECT * FROM user WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await pool.execute('INSERT INTO user (username, password_hash, is_active) VALUES (?, ?, ?)', ['admin', hashedPassword, 1]);
      console.log('✅ 默认管理员创建成功 (用户名: admin, 密码: admin123)');
    }
  } catch (err) {
    console.error('初始化用户表失败:', err);
  }
};

const initDatabase = async () => {
  try {
    // 创建所有表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS category (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        icon VARCHAR(100) NOT NULL,
        sort_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inheritor (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        title VARCHAR(100) NOT NULL,
        category_id BIGINT NOT NULL,
        bio TEXT NOT NULL,
        avatar_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS exhibit (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        category_id BIGINT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        model_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS process (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        exhibit_id BIGINT,
        category_id BIGINT,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        step_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS carrier (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin_user (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
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

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS works (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        artifact_id BIGINT,
        user_id BIGINT,
        session_id VARCHAR(255) NOT NULL,
        title VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        preview_url VARCHAR(255) NOT NULL,
        like_count INT DEFAULT 0,
        comment_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        work_id BIGINT NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS assets (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        file_type VARCHAR(50) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size BIGINT NOT NULL,
        url VARCHAR(255) NOT NULL,
        thumbnail_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        exhibit_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_exhibit (user_id, exhibit_id)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS view_history (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        exhibit_id BIGINT NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_exhibit (user_id, exhibit_id)
      )
    `);

    // 插入基础数据（如果不存在）
    await pool.execute(`
      INSERT IGNORE INTO category (name, icon, sort_order) VALUES
      ('剪纸艺术', '✂️', 1),
      ('刺绣工艺', '🧵', 2),
      ('陶瓷制作', '🏺', 3),
      ('皮影戏', '🎭', 4),
      ('年画', '🖼️', 5)
    `);

    await pool.execute(`
      INSERT IGNORE INTO admin_user (username, password_hash) VALUES
      ('admin', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW')
    `);

    await pool.execute(`
      INSERT IGNORE INTO user (username, password_hash, is_active) VALUES
      ('user', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 1)
    `);

    console.log('✅ 数据库初始化完成');
  } catch (err) {
    console.error('初始化数据库失败:', err);
  }
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '未授权' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: '无效的 token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'token 已过期或无效' });
  }
};

initMySQL();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type;
    const dir = path.join(__dirname, 'uploads', type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/webm'],
      model: ['application/octet-stream', 'model/gltf-binary', 'model/gltf+json']
    };
    const type = req.params.type;
    const isValid = allowedTypes[type]?.includes(file.mimetype) || false;
    cb(null, isValid);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '非遗平台 API 运行中' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    const [rows] = await pool.execute('SELECT * FROM user WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const user = rows[0];
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: '账号已被禁用' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      data: { token, userId: user.id, username: user.username },
      message: '登录成功'
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    const [rows] = await pool.execute('SELECT * FROM user WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.execute(
      'INSERT INTO user (username, password_hash, email, phone, is_active) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email || null, phone || null, 1]
    );
    res.json({ success: true, message: '注册成功' });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.get('/api/auth/verify', authenticate, (req, res) => {
  res.json({ valid: true, message: 'token 有效' });
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username FROM user WHERE id = ?', [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/exhibits', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM exhibit';
    let params = [];

    if (category && category !== 'all') {
      // 这里需要根据分类名称查询对应的 category_id
      const [categoryRows] = await pool.execute('SELECT id FROM category WHERE name = ?', [category]);
      if (categoryRows.length > 0) {
        query += ' WHERE category_id = ?';
        params.push(categoryRows[0].id);
      }
    }

    const limitNum = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limitNum;
    query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [rows] = await pool.execute(query, params);
    
    // 转换数据结构以匹配前端需求
    const exhibits = await Promise.all(rows.map(async (row) => {
      // 获取分类名称
      const [categoryRows] = await pool.execute('SELECT name FROM category WHERE id = ?', [row.category_id]);
      const categoryName = categoryRows.length > 0 ? categoryRows[0].name : '';
      
      // 获取工艺流程
      const [processRows] = await pool.execute('SELECT name as title, description as `desc` FROM process WHERE exhibit_id = ? ORDER BY step_order', [row.id]);
      
      // 获取传承人信息
      const [inheritorRows] = await pool.execute('SELECT name, title, bio as `desc`, avatar_url as avatar FROM inheritor WHERE category_id = ? LIMIT 1', [row.category_id]);
      
      return {
        id: row.id,
        icon: row.image_url,
        name: row.name,
        category: categoryName,
        region: '', // 数据库中没有 region 字段，需要根据实际情况调整
        era: '', // 数据库中没有 era 字段，需要根据实际情况调整
        desc: row.description,
        background: row.description, // 暂时使用 description 作为 background
        video: '', // 数据库中没有 video 字段，需要根据实际情况调整
        steps: processRows,
        inheritor: inheritorRows.length > 0 ? inheritorRows[0] : { name: '', title: '', desc: '', avatar: '' },
        viewCount: 0 // 数据库中没有 viewCount 字段，需要根据实际情况调整
      };
    }));

    res.json(exhibits);
  } catch (err) {
    console.error('获取展品列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/exhibits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM exhibit WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '展品不存在' });
    }

    const row = rows[0];
    
    // 获取分类名称
    const [categoryRows] = await pool.execute('SELECT name FROM category WHERE id = ?', [row.category_id]);
    const categoryName = categoryRows.length > 0 ? categoryRows[0].name : '';
    
    // 获取工艺流程
    const [processRows] = await pool.execute('SELECT name as title, description as desc FROM process WHERE exhibit_id = ? ORDER BY step_order', [row.id]);
    
    // 获取传承人信息
    const [inheritorRows] = await pool.execute('SELECT name, title, bio as desc, avatar_url as avatar FROM inheritor WHERE category_id = ? LIMIT 1', [row.category_id]);
    
    const exhibit = {
      id: row.id,
      icon: row.image_url,
      name: row.name,
      category: categoryName,
      region: '', // 数据库中没有 region 字段，需要根据实际情况调整
      era: '', // 数据库中没有 era 字段，需要根据实际情况调整
      desc: row.description,
      background: row.description, // 暂时使用 description 作为 background
      video: '', // 数据库中没有 video 字段，需要根据实际情况调整
      steps: processRows,
      inheritor: inheritorRows.length > 0 ? inheritorRows[0] : { name: '', title: '', desc: '', avatar: '' },
      viewCount: 0 // 数据库中没有 viewCount 字段，需要根据实际情况调整
    };

    res.json(exhibit);
  } catch (err) {
    console.error('获取展品详情错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/exhibits', authenticate, async (req, res) => {
  try {
    const { icon, name, category, region, era, image, video, desc, background, steps, inheritor } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: '名称和分类不能为空' });
    }

    // 暂时使用默认分类ID，跳过分类检查
    const category_id = 1;

    // 插入展品
    const [result] = await pool.execute(
      'INSERT INTO exhibit (category_id, name, description, image_url) VALUES (?, ?, ?, ?)',
      [category_id, name, desc || background || '', image || icon]
    );

    const exhibit_id = result.insertId;

    // 插入工艺流程
    if (steps && Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await pool.execute(
          'INSERT INTO process (exhibit_id, category_id, name, description, step_order) VALUES (?, ?, ?, ?, ?)',
          [exhibit_id, category_id, step.title, step.desc, i + 1]
        );
      }
    }

    res.json({ id: exhibit_id, message: '创建成功' });
  } catch (err) {
    console.error('创建展品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/exhibits/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, name, category, region, era, image, video, desc, background, steps, inheritor } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (desc !== undefined) { updates.push('description = ?'); params.push(desc); }
    if (background !== undefined) { updates.push('description = ?'); params.push(background); }
    if (image !== undefined) { updates.push('image_url = ?'); params.push(image); }
    if (icon !== undefined) { updates.push('image_url = ?'); params.push(icon); }

    if (category !== undefined) {
      // 获取分类 ID
      const [categoryRows] = await pool.execute('SELECT id FROM category WHERE name = ?', [category]);
      if (categoryRows.length > 0) {
        updates.push('category_id = ?');
        params.push(categoryRows[0].id);
      }
    }

    if (updates.length > 0) {
      params.push(id);
      await pool.execute(`UPDATE exhibit SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    // 更新工艺流程
    if (steps && Array.isArray(steps)) {
      // 获取当前展品的分类ID
      let category_id = 1; // 默认分类ID
      const [currentExhibit] = await pool.execute('SELECT category_id FROM exhibit WHERE id = ?', [id]);
      if (currentExhibit.length > 0) {
        category_id = currentExhibit[0].category_id;
      }
      
      // 删除旧的工艺流程
      await pool.execute('DELETE FROM process WHERE exhibit_id = ?', [id]);
      // 插入新的工艺流程
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await pool.execute(
          'INSERT INTO process (exhibit_id, category_id, name, description, step_order) VALUES (?, ?, ?, ?, ?)',
          [id, category_id, step.title, step.desc, i + 1]
        );
      }
    }

    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新展品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/exhibits/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    // 删除相关的工艺流程
    await pool.execute('DELETE FROM process WHERE exhibit_id = ?', [id]);
    // 删除展品
    await pool.execute('DELETE FROM exhibit WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除展品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/upload/:type', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }
    const fileUrl = `/uploads/${req.params.type}/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename, message: '上传成功' });
  } catch (err) {
    console.error('上传错误:', err);
    res.status(500).json({ error: '上传失败' });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { exhibit_id, user_id } = req.body;
    if (!exhibit_id || !user_id) {
      return res.status(400).json({ error: '参数错误' });
    }

    const [rows] = await pool.execute('SELECT * FROM favorites WHERE exhibit_id = ? AND user_id = ?', [exhibit_id, user_id]);

    if (rows.length > 0) {
      await pool.execute('DELETE FROM favorites WHERE exhibit_id = ? AND user_id = ?', [exhibit_id, user_id]);
      res.json({ message: '取消收藏' });
    } else {
      await pool.execute('INSERT INTO favorites (exhibit_id, user_id) VALUES (?, ?)', [exhibit_id, user_id]);
      res.json({ message: '收藏成功' });
    }
  } catch (err) {
    console.error('收藏操作错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: '缺少 user_id' });
    }

    const [rows] = await pool.execute(
      `SELECT e.*, f.created_at as favorited_at FROM favorites f
       JOIN exhibit e ON f.exhibit_id = e.id
       WHERE f.user_id = ? AND e.is_published != 0
       ORDER BY f.created_at DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('获取收藏列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { exhibit_id, user_id } = req.body;
    if (!exhibit_id || !user_id) {
      return res.status(400).json({ error: '参数错误' });
    }

    await pool.execute('DELETE FROM view_history WHERE exhibit_id = ? AND user_id = ?', [exhibit_id, user_id]);
    await pool.execute('INSERT INTO view_history (exhibit_id, user_id) VALUES (?, ?)', [exhibit_id, user_id]);
    res.json({ message: '记录成功' });
  } catch (err) {
    console.error('记录历史错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const { user_id, limit = 10 } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: '缺少 user_id' });
    }

    const [rows] = await pool.execute(
      `SELECT e.*, v.viewed_at FROM view_history v
       JOIN exhibit e ON v.exhibit_id = e.id
       WHERE v.user_id = ? AND e.is_published != 0
       ORDER BY v.viewed_at DESC LIMIT ?`,
      [user_id, parseInt(limit)]
    );
    res.json(rows);
  } catch (err) {
    console.error('获取浏览历史错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM category ORDER BY sort_order');
    res.json(rows);
  } catch (err) {
    console.error('获取分类列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/categories', authenticate, async (req, res) => {
  try {
    const { name, icon, sort_order } = req.body;
    if (!name || !icon || !sort_order) {
      return res.status(400).json({ error: '名称、图标和排序不能为空' });
    }
    const [result] = await pool.execute(
      'INSERT INTO category (name, icon, sort_order) VALUES (?, ?, ?)',
      [name, icon, sort_order]
    );
    res.json({ id: result.insertId, message: '创建成功' });
  } catch (err) {
    console.error('创建分类错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/categories/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, sort_order } = req.body;
    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(sort_order); }
    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }
    params.push(id);
    await pool.execute(`UPDATE category SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新分类错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/categories/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM category WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除分类错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/inheritors', async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = 'SELECT * FROM inheritor';
    let params = [];
    if (category_id) {
      query += ' WHERE category_id = ?';
      params.push(category_id);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('获取传承人物列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/inheritors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM inheritor WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '传承人物不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取传承人物详情错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/inheritors', authenticate, async (req, res) => {
  try {
    const { name, title, category_id, bio, avatar_url } = req.body;
    if (!name || !title || !category_id || !bio || !avatar_url) {
      return res.status(400).json({ error: '所有字段不能为空' });
    }
    const [result] = await pool.execute(
      'INSERT INTO inheritor (name, title, category_id, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
      [name, title, category_id, bio, avatar_url]
    );
    res.json({ id: result.insertId, message: '创建成功' });
  } catch (err) {
    console.error('创建传承人物错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/inheritors/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, category_id, bio, avatar_url } = req.body;
    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (category_id !== undefined) { updates.push('category_id = ?'); params.push(category_id); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (avatar_url !== undefined) { updates.push('avatar_url = ?'); params.push(avatar_url); }
    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }
    params.push(id);
    await pool.execute(`UPDATE inheritor SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新传承人物错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/inheritors/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM inheritor WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除传承人物错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/processes', async (req, res) => {
  try {
    const { exhibit_id, category_id } = req.query;
    let query = 'SELECT * FROM process';
    let params = [];
    let whereClause = [];
    if (exhibit_id) {
      whereClause.push('exhibit_id = ?');
      params.push(exhibit_id);
    }
    if (category_id) {
      whereClause.push('category_id = ?');
      params.push(category_id);
    }
    if (whereClause.length > 0) {
      query += ' WHERE ' + whereClause.join(' AND ');
    }
    query += ' ORDER BY step_order';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('获取工艺环节列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/processes', authenticate, async (req, res) => {
  try {
    const { exhibit_id, category_id, name, description, step_order } = req.body;
    if (!name || !description || !step_order) {
      return res.status(400).json({ error: '名称、描述和步骤顺序不能为空' });
    }
    const [result] = await pool.execute(
      'INSERT INTO process (exhibit_id, category_id, name, description, step_order) VALUES (?, ?, ?, ?, ?)',
      [exhibit_id || null, category_id || null, name, description, step_order]
    );
    res.json({ id: result.insertId, message: '创建成功' });
  } catch (err) {
    console.error('创建工艺环节错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/processes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { exhibit_id, category_id, name, description, step_order } = req.body;
    const updates = [];
    const params = [];
    if (exhibit_id !== undefined) { updates.push('exhibit_id = ?'); params.push(exhibit_id); }
    if (category_id !== undefined) { updates.push('category_id = ?'); params.push(category_id); }
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (step_order !== undefined) { updates.push('step_order = ?'); params.push(step_order); }
    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }
    params.push(id);
    await pool.execute(`UPDATE process SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新工艺环节错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/processes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM process WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除工艺环节错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/carriers', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM carrier';
    let params = [];
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('获取载体列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/carriers', authenticate, async (req, res) => {
  try {
    const { name, type, description, file_url } = req.body;
    if (!name || !type || !description || !file_url) {
      return res.status(400).json({ error: '所有字段不能为空' });
    }
    const [result] = await pool.execute(
      'INSERT INTO carrier (name, type, description, file_url) VALUES (?, ?, ?, ?)',
      [name, type, description, file_url]
    );
    res.json({ id: result.insertId, message: '创建成功' });
  } catch (err) {
    console.error('创建载体错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/carriers/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, file_url } = req.body;
    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (type !== undefined) { updates.push('type = ?'); params.push(type); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (file_url !== undefined) { updates.push('file_url = ?'); params.push(file_url); }
    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }
    params.push(id);
    await pool.execute(`UPDATE carrier SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新载体错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/carriers/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM carrier WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除载体错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/quiz', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM quiz';
    let params = [];
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY sort_order';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('获取问答题列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM quiz WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '问答题不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取问答题详情错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/quiz', authenticate, async (req, res) => {
  try {
    const { artifact_id, category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, sort_order } = req.body;
    if (!question || !category || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return res.status(400).json({ error: '问题、分类、选项和正确答案不能为空' });
    }
    const [result] = await pool.execute(
      'INSERT INTO quiz (artifact_id, category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [artifact_id || null, category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty || 'medium', explanation || '', sort_order || 0]
    );
    res.json({ id: result.insertId, message: '创建成功' });
  } catch (err) {
    console.error('创建问答题错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/quiz/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { artifact_id, category, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, sort_order } = req.body;
    const updates = [];
    const params = [];
    if (artifact_id !== undefined) { updates.push('artifact_id = ?'); params.push(artifact_id); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (question !== undefined) { updates.push('question = ?'); params.push(question); }
    if (option_a !== undefined) { updates.push('option_a = ?'); params.push(option_a); }
    if (option_b !== undefined) { updates.push('option_b = ?'); params.push(option_b); }
    if (option_c !== undefined) { updates.push('option_c = ?'); params.push(option_c); }
    if (option_d !== undefined) { updates.push('option_d = ?'); params.push(option_d); }
    if (correct_answer !== undefined) { updates.push('correct_answer = ?'); params.push(correct_answer); }
    if (difficulty !== undefined) { updates.push('difficulty = ?'); params.push(difficulty); }
    if (explanation !== undefined) { updates.push('explanation = ?'); params.push(explanation); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(sort_order); }
    if (updates.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }
    params.push(id);
    await pool.execute(`UPDATE quiz SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新问答题错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/quiz/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM quiz WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除问答题错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/works', async (req, res) => {
  try {
    const { artifact_id, session_id, sort } = req.query;
    let query = 'SELECT * FROM works';
    let params = [];
    let whereClause = [];
    if (artifact_id) {
      whereClause.push('artifact_id = ?');
      params.push(artifact_id);
    }
    if (session_id) {
      whereClause.push('session_id = ?');
      params.push(session_id);
    }
    if (whereClause.length > 0) {
      query += ' WHERE ' + whereClause.join(' AND ');
    }
    if (sort === 'likes') {
      query += ' ORDER BY like_count DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('获取作品列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/works', authenticate, async (req, res) => {
  try {
    const { image_url, type, description } = req.body;
    if (!type || !description || !image_url) {
      return res.status(400).json({ error: '类型、描述和图片URL不能为空' });
    }
    const [result] = await pool.execute(
      'INSERT INTO works (user_id, session_id, title, type, description, preview_url) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, req.userId.toString(), '我的' + type + '作品', type, description, image_url]
    );
    res.json({ id: result.insertId, message: '创建成功' });
  } catch (err) {
    console.error('创建作品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/works/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE works SET like_count = like_count + 1 WHERE id = ?', [id]);
    res.json({ message: '点赞成功' });
  } catch (err) {
    console.error('点赞错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});



app.get('/api/assets', async (req, res) => {
  try {
    const { file_type } = req.query;
    let query = 'SELECT * FROM assets';
    let params = [];
    if (file_type) {
      query += ' WHERE file_type = ?';
      params.push(file_type);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('获取素材列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/assets', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }
    const { file_type } = req.body;
    if (!file_type) {
      return res.status(400).json({ error: '文件类型不能为空' });
    }
    const fileUrl = `/uploads/${file_type}/${req.file.filename}`;
    const thumbnailUrl = fileUrl; // 简化处理，实际应该生成缩略图
    const [result] = await pool.execute(
      'INSERT INTO assets (file_type, file_name, file_size, url, thumbnail_url) VALUES (?, ?, ?, ?, ?)',
      [file_type, req.file.originalname, req.file.size, fileUrl, thumbnailUrl]
    );
    res.json({ id: result.insertId, url: fileUrl, message: '上传成功' });
  } catch (err) {
    console.error('上传素材错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.listen(PORT, () => {
  console.log(`======================================`);
  console.log(`🚀 非遗数字化数字化展示平台 - 后端服务`);
  console.log(`🚀 服务地址: http://localhost:${PORT}`);
  console.log(`🚀 前端访问: http://localhost:${PORT}`);
  console.log(`🚀 API 地址: http://localhost:${PORT}/api`);
  console.log(`🚀 管理员账号: admin / 123456`);
  console.log(`======================================`);
});