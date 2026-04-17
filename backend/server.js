const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'feiyi_secret_key';
const DB_PATH = path.join(__dirname, 'data/database.json');

// ==================== 配置 ====================

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('../frontend'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== 工具函数 ====================

// 读取数据库
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // 初始化数据库文件
      const initialData = {
        admins: [],
        exhibits: [],
        favorites: [],
        view_history: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('读取数据库错误:', err);
    return { admins: [], exhibits: [], favorites: [], view_history: [] };
  }
};

// 写入数据库
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('写入数据库错误:', err);
  }
};

// 生成 ID
const generateId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};

// 认证中间件
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '未授权' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: '无效的 token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'token 已过期或无效' });
  }
};

// ==================== 初始化数据库 ====================

const initDB = () => {
  const db = readDB();

  // 创建默认管理员（密码: admin123）
  if (db.admins.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.admins.push({
      id: 1,
      username: 'admin',
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
    writeDB(db);
    console.log('✅ 默认管理员创建成功 (用户名: admin, 密码: admin123)');
  }
};

initDB();

// ==================== 文件上传配置 ====================

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

// ==================== API 路由 ====================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '非遗平台 API 运行中' });
});

// ========== 认证相关 ==========

// 登录
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const db = readDB();
    const admin = db.admins.find(a => a.username === username);
    if (!admin) return res.status(401).json({ error: '用户名或密码错误' });

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: '用户名或密码错误' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      username: admin.username,
      message: '登录成功'
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 验证 token
app.get('/api/auth/verify', authenticate, (req, res) => {
  res.json({ valid: true, message: 'token 有效' });
});

// ========== 展品管理 ==========

// 获取展品列表
app.get('/api/exhibits', (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const db = readDB();

    let exhibits = db.exhibits.filter(e => e.is_published !== false);

    if (category && category !== 'all') {
      exhibits = exhibits.filter(e => e.category === category);
    }

    exhibits = exhibits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const offset = (page - 1) * limit;
    const paginated = exhibits.slice(offset, offset + parseInt(limit));

    res.json(paginated);
  } catch (err) {
    console.error('获取展品列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取展品详情
app.get('/api/exhibits/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const exhibit = db.exhibits.find(e => e.id === parseInt(id));
    if (!exhibit) return res.status(404).json({ error: '展品不存在' });

    // 更新浏览量
    exhibit.views = (exhibit.views || 0) + 1;
    writeDB(db);

    res.json(exhibit);
  } catch (err) {
    console.error('获取展品详情错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建展品
app.post('/api/exhibits', authenticate, (req, res) => {
  try {
    const {
      title,
      category,
      region,
      description,
      history,
      craft_process,
      craftsman,
      image_url,
      video_url,
      model_url,
      is_published = true
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: '标题和分类不能为空' });
    }

    const db = readDB();
    const newExhibit = {
      id: generateId(db.exhibits),
      title,
      category,
      region: region || '',
      description: description || '',
      history: history || '',
      craft_process: craft_process || '',
      craftsman: craftsman || '',
      image_url: image_url || '',
      video_url: video_url || '',
      model_url: model_url || '',
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_published
    };

    db.exhibits.push(newExhibit);
    writeDB(db);

    res.json({
      id: newExhibit.id,
      message: '创建成功'
    });
  } catch (err) {
    console.error('创建展品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新展品
app.put('/api/exhibits/:id', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const exhibit = db.exhibits.find(e => e.id === parseInt(id));
    if (!exhibit) return res.status(404).json({ error: '展品不存在' });

    const {
      title,
      category,
      region,
      description,
      history,
      craft_process,
      craftsman,
      image_url,
      video_url,
      model_url,
      is_published
    } = req.body;

    if (title !== undefined) exhibit.title = title;
    if (category !== undefined) exhibit.category = category;
    if (region !== undefined) exhibit.region = region;
    if (description !== undefined) exhibit.description = description;
    if (history !== undefined) exhibit.history = history;
    if (craft_process !== undefined) exhibit.craft_process = craft_process;
    if (craftsman !== undefined) exhibit.craftsman = craftsman;
    if (image_url !== undefined) exhibit.image_url = image_url;
    if (video_url !== undefined) exhibit.video_url = video_url;
    if (model_url !== undefined) exhibit.model_url = model_url;
    if (is_published !== undefined) exhibit.is_published = is_published;

    exhibit.updated_at = new Date().toISOString();
    writeDB(db);

    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新展品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除展品
app.delete('/api/exhibits/:id', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const index = db.exhibits.findIndex(e => e.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: '展品不存在' });

    db.exhibits.splice(index, 1);
    // 同时删除相关的收藏和历史
    db.favorites = db.favorites.filter(f => f.exhibit_id !== parseInt(id));
    db.view_history = db.view_history.filter(v => v.exhibit_id !== parseInt(id));

    writeDB(db);
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除展品错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ========== 文件上传 ==========

app.post('/api/upload/:type', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    const fileUrl = `/uploads/${req.params.type}/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      message: '上传成功'
    });
  } catch (err) {
    console.error('上传错误:', err);
    res.status(500).json({ error: '上传失败' });
  }
});

// ========== 用户数据 ==========

// 收藏/取消收藏
app.post('/api/favorites', (req, res) => {
  try {
    const { exhibit_id, user_id } = req.body;

    if (!exhibit_id || !user_id) {
      return res.status(400).json({ error: '参数错误' });
    }

    const db = readDB();
    const favorite = db.favorites.find(f => f.exhibit_id === exhibit_id && f.user_id === user_id);

    if (favorite) {
      // 取消收藏
      db.favorites = db.favorites.filter(f => !(f.exhibit_id === exhibit_id && f.user_id === user_id));
      writeDB(db);
      res.json({ message: '取消收藏' });
    } else {
      // 添加收藏
      db.favorites.push({
        id: generateId(db.favorites),
        exhibit_id,
        user_id,
        created_at: new Date().toISOString()
      });
      writeDB(db);
      res.json({ message: '收藏成功' });
    }
  } catch (err) {
    console.error('收藏操作错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取收藏列表
app.get('/api/favorites', (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: '缺少 user_id' });
    }

    const db = readDB();
    const favorites = db.favorites
      .filter(f => f.user_id === user_id)
      .map(f => {
        const exhibit = db.exhibits.find(e => e.id === f.exhibit_id && e.is_published !== false);
        return exhibit ? { ...exhibit, favorited_at: f.created_at } : null;
      })
      .filter(e => e !== null)
      .sort((a, b) => new Date(b.favorited_at) - new Date(a.favorited_at));

    res.json(favorites);
  } catch (err) {
    console.error('获取收藏列表错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 记录浏览历史
app.post('/api/history', (req, res) => {
  try {
    const { exhibit_id, user_id } = req.body;

    if (!exhibit_id || !user_id) {
      return res.status(400).json({ error: '参数错误' });
    }

    const db = readDB();

    // 去重：删除旧记录
    db.view_history = db.view_history.filter(v => !(v.exhibit_id === exhibit_id && v.user_id === user_id));

    // 添加新记录
    db.view_history.push({
      id: generateId(db.view_history),
      exhibit_id,
      user_id,
      viewed_at: new Date().toISOString()
    });

    writeDB(db);
    res.json({ message: '记录成功' });
  } catch (err) {
    console.error('记录历史错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取浏览历史
app.get('/api/history', (req, res) => {
  try {
    const { user_id, limit = 10 } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: '缺少 user_id' });
    }

    const db = readDB();
    const history = db.view_history
      .filter(v => v.user_id === user_id)
      .map(v => {
        const exhibit = db.exhibits.find(e => e.id === v.exhibit_id && e.is_published !== false);
        return exhibit ? { ...exhibit, viewed_at: v.viewed_at } : null;
      })
      .filter(e => e !== null)
      .sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at))
      .slice(0, parseInt(limit));

    res.json(history);
  } catch (err) {
    console.error('获取历史错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ========== 错误处理 ==========
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log('======================================');
  console.log('✅ 非遗文化数字化展示平台 - 后端服务器');
  console.log('======================================');
  console.log(`🌐 服务地址: http://localhost:${PORT}`);
  console.log(`📁 前端访问: http://localhost:${PORT}`);
  console.log(`🔧 API 地址: http://localhost:${PORT}/api`);
  console.log(`🔐 管理员账号: admin / admin123`);
  console.log('======================================');
});
