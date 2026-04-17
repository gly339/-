const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data/database.json');

// 读取数据库
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    return { admins: [], exhibits: [], favorites: [], view_history: [] };
  }
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
};

// 写入数据库
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

console.log('📦 初始化数据库...');

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
  console.log('✅ 默认管理员创建成功 (用户名: admin, 密码: admin123)');
} else {
  console.log('ℹ️  管理员已存在，跳过创建');
}

// 插入示例展品
if (db.exhibits.length === 0) {
  const sampleExhibits = [
    {
      id: 1,
      title: '青花瓷瓶',
      category: '瓷器',
      region: '江西景德镇',
      description: '清代康熙年间青花瓷瓶，高 42cm，口径 12cm',
      history: '青花瓷起源于唐代，成熟于元代，明清时期达到鼎盛。',
      craft_process: '采用高岭土制坯，手工绘制青花图案，高温烧制而成。',
      craftsman: '传统工艺，无特定传承人',
      image_url: '/images/1.jpg',
      video_url: '/videos/ci.mp4',
      views: 0,
      created_at: new Date().toISOString(),
      is_published: true
    },
    {
      id: 2,
      title: '剪纸艺术',
      category: '剪纸',
      region: '陕西',
      description: '传统民间剪纸，寓意吉祥如意',
      history: '剪纸艺术在中国有上千年的历史，是重要的民间艺术形式。',
      craft_process: '使用剪刀或刻刀在纸上剪刻出各种图案。',
      craftsman: '民间艺人',
      image_url: '/images/2.jpg',
      video_url: '/videos/jian.mp4',
      views: 0,
      created_at: new Date().toISOString(),
      is_published: true
    },
    {
      id: 3,
      title: '皮影戏',
      category: '皮影',
      region: '陕西华县',
      description: '传统皮影戏人物雕刻，栩栩如生',
      history: '皮影戏起源于汉代，是中国古老的民间戏剧形式。',
      craft_process: '选用优质牛皮，经过雕刻、上色、组装等工序制作。',
      craftsman: '皮影艺人',
      image_url: '/images/3.jpg',
      video_url: '/videos/pi.mp4',
      views: 0,
      created_at: new Date().toISOString(),
      is_published: true
    }
  ];

  db.exhibits = sampleExhibits;
  console.log('✅ 示例展品数据已插入');
} else {
  console.log('ℹ️  展品数据已存在，跳过插入');
}

writeDB(db);
console.log('🎉 数据库初始化完成！');
