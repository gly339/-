const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'IntangibleHeritage',
  multipleStatements: true
};

async function insertData() {
  console.log('根据 MYSQL.md 插入数据...');
  
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    console.log('\n=== 插入非遗传承人物数据 ===');
    const inheritorData = [
      ['王兰花', '国家级非遗传承人', 1, '从事剪纸艺术50年，作品充满乡土气息，被誉为“陕北剪纸第一剪”。会宁剪纸县级非物质文化遗产代表性传承官方名录收录,会宁剪纸:2012 年入选国家级非物质文化遗产会,风格与题材:西北民间剪纸，粗犷质朴，线条简练，民俗味浓，常见窗花：喜花，吉祥，纹样，花鸟，民俗。', 'images/avatar1.png'],
      ['赵小明', '省级非遗传承人', 1, '扬州剪纸第三代传人，专攻花鸟题材。核心特点：清新婉约、细腻俊秀、玲珑雅致。技艺标准：讲究 “线如胡须，圆如秋月，尖如麦芒，方如青砖”。传统：折枝花卉（梅兰竹菊）、花鸟鱼虫、吉祥纹样、人物创新：现代题材、动漫风、节日主题（端午、春节）技法：师承张氏 “白描剪纸”，线条流畅如国画，层次精细', 'images/avatar2.jpg'],
      ['张雪梅', '国家级非遗传承人', 2, '从事苏绣40年，双面绣技艺炉火纯青。身份：国家级非遗（苏绣）代表性传承人、中国工艺美术大师。专长：大型苏绣屏风、双面绣地屏、现代主题巨幅屏风。风格：大气磅礴、精细写实、色彩浑厚、光影立体。代表作（屏风）《春早江南》：人民大会堂江苏厅大型苏绣屏风。', 'images/avatar3.png'],
      ['刘大师', '省级传承人', 2, '擅长狮虎刺绣，毛发逼真生动。身份：首批国家级非遗（湘绣）代表性传承人、中国工艺美术大师、鬅毛针第二代传人。专长：狮虎、花鸟、人物挂画、尤擅湘绣标志性 “鬅毛针”（毛发立体、质感逼真）。风格：雄浑传神、色彩厚重、形神兼备（业界 “苏猫湘虎” 代表人物）。代表挂画：《饮虎》《雄狮》（中国工艺美术馆珍藏）《洞庭清趣》（人民大会堂湖南厅）', 'images/avatar4.jpg'],
      ['李建国', '国家级非遗传承人', 3, '从事青花瓷制作45年，作品多次作为国礼。身份:第四批国家级非遗传承人(2012 年)景德镇市人民政府,"中华仿古瓷第一人".专长:精通元,明,清历代青花仿古与复制,尤擅复刻元青花,曾成功复刻 "萧何月下追韩信" 梅瓶.', 'images/avatar5.jpg'],
      ['高水旺', '国家级传承人', 3, '复原唐三彩烧制技艺，作品高度仿真。国家级非遗传承人,河南洛阳人.专注唐三彩传统烧制技艺,擅长仿古唐三彩制作,作品形神兼备,多次复刻出土文物,是当代唐三彩技艺代表性人物.', 'images/avatar6.jpg'],
      ['汪天稳', '国家级传承人', 4, '精通皮影雕刻演唱，技艺全面。国家级非遗传承人,陕西华县人.精通皮影雕刻,制皮,上色与表演,刀法细腻,造型生动,被誉为 "皮影雕刻泰斗",长期致力于皮影技艺传承.', 'images/avatar7.jpg'],
      ['霍庆顺', '国家级传承人', 5, '传承六代杨柳青年画，作品畅销海内外。国家级非遗传承人,天津杨柳青人,"玉成号画庄" 第六代传人.熟练掌握勾,刻,印,绘,裱全套年画技艺,坚持手工木版印制,是杨柳青年画活态传承的代表.', 'images/avatar8.jpg']
    ];
    
    for (const data of inheritorData) {
      await connection.execute(
        'INSERT IGNORE INTO inheritor (name, title, category_id, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
        data
      );
    }
    console.log('✅ 非遗传承人物数据插入完成');
    
    console.log('\n=== 插入细分展品/作品数据 ===');
    const exhibitData = [
      [1, '陕北窗花', '传统吉祥图案，寓意美好', 'images/icon-chuang.jpg', 'models/chuang.glb'],
      [1, '扬州剪纸', '细腻精巧，江南风格', 'images/icon-jianzhi.jpg', 'models/jianzhi.glb'],
      [2, '苏绣屏风', '双面绣工艺精湛', 'images/icon-cix.png', 'models/cix.glb'],
      [2, '湘绣挂画', '色彩鲜艳，栩栩如生', 'images/icon-gua.png', 'models/gua.glb'],
      [3, '青花瓷瓶', '元代传世精品', 'images/icon-taoci.jpg', 'models/taoci.glb'],
      [3, '唐三彩马', '唐代陪葬陶器', 'images/icon-tangci.jpg', 'models/tangci.glb'],
      [4, '皮影武将', '雕刻精美，可活动', 'images/icon-piying.jpg', 'models/piying.glb'],
      [5, '杨柳青年画', '中国四大年画之一', 'images/icon-nianhua.jpg', 'models/nianhua.glb']
    ];
    
    for (const data of exhibitData) {
      await connection.execute(
        'INSERT IGNORE INTO exhibit (category_id, name, description, image_url, model_url) VALUES (?, ?, ?, ?, ?)',
        data
      );
    }
    console.log('✅ 细分展品/作品数据插入完成');
    
    console.log('\n=== 插入非遗工艺环节数据 ===');
    const processData = [
      // 陕北窗花工艺步骤
      [1, 1, '选纸', '选用加厚宣纸', 1],
      [1, 1, '画稿', '手工绘制图案', 2],
      [1, 1, '裁剪', '剪刀雕刻成型', 3],
      [1, 1, '装裱', '定型保存', 4],
      // 扬州剪纸工艺步骤
      [2, 1, '构图', '精细勾勒底稿', 1],
      [2, 1, '剪裁', '小巧剪刀雕刻', 2],
      [2, 1, '上色', '局部点彩', 3],
      [2, 1, '装裱', '精致装框', 4],
      // 苏绣屏风工艺步骤
      [3, 2, '上绷', '将丝绸固定在绣架', 1],
      [3, 2, '配线', '精选桑蚕丝线', 2],
      [3, 2, '刺绣', '运用数十种针法', 3],
      [3, 2, '装裱', '制作成屏风', 4],
      // 湘绣挂画工艺步骤
      [4, 2, '画稿', '绘制花鸟兽图', 1],
      [4, 2, '施针', '参针技法', 2],
      [4, 2, '上色', '分层染色', 3],
      [4, 2, '装裱', '挂轴装裱', 4],
      // 青花瓷瓶工艺步骤
      [5, 3, '配料', '高岭土精选', 1],
      [5, 3, '拉坯', '手工成型', 2],
      [5, 3, '绘画', '青花描绘', 3],
      [5, 3, '烧制', '1300℃高温', 4],
      // 唐三彩马工艺步骤
      [6, 3, '制胎', '粘土塑形', 1],
      [6, 3, '素烧', '低温第一次烧制', 2],
      [6, 3, '上釉', '施三色釉料', 3],
      [6, 3, '釉烧', '二次烧制', 4],
      // 皮影武将工艺步骤
      [7, 4, '选皮', '选用驴皮牛皮', 1],
      [7, 4, '雕镂', '精细雕刻', 2],
      [7, 4, '上色', '植物染料', 3],
      [7, 4, '装订', '关节活动连接', 4],
      // 杨柳青年画工艺步骤
      [8, 5, '绘稿', '创作底稿', 1],
      [8, 5, '刻版', '梨木雕刻', 2],
      [8, 5, '套印', '分色印刷', 3],
      [8, 5, '彩绘', '手工填色', 4]
    ];
    
    for (const data of processData) {
      await connection.execute(
        'INSERT IGNORE INTO process (exhibit_id, category_id, name, description, step_order) VALUES (?, ?, ?, ?, ?)',
        data
      );
    }
    console.log('✅ 非遗工艺环节数据插入完成');
    
    console.log('\n=== 插入非遗载体/形式数据 ===');
    const carrierData = [
      ['陕北窗花视频', '视频', '陕北剪纸制作过程视频', 'videos/jian.mp4'],
      ['扬州剪纸视频', '视频', '扬州剪纸制作过程视频', 'videos/yang.mp4'],
      ['苏绣屏风视频', '视频', '苏绣制作过程视频', 'videos/su.mp4'],
      ['湘绣挂画视频', '视频', '湘绣制作过程视频', 'videos/xiang.mp4'],
      ['青花瓷瓶视频', '视频', '青花瓷制作过程视频', 'videos/ci.mp4'],
      ['唐三彩马视频', '视频', '唐三彩制作过程视频', 'videos/tang.mp4'],
      ['皮影武将视频', '视频', '皮影制作过程视频', 'videos/pi.mp4'],
      ['杨柳青年画视频', '视频', '杨柳青年画制作过程视频', 'videos/liu.mp4']
    ];
    
    for (const data of carrierData) {
      await connection.execute(
        'INSERT IGNORE INTO carrier (name, type, description, file_url) VALUES (?, ?, ?, ?)',
        data
      );
    }
    console.log('✅ 非遗载体/形式数据插入完成');
    
    console.log('\n=== 插入问答题数据 ===');
    // 第 1 题: 青花瓷着色剂
    await connection.execute(
      'INSERT IGNORE INTO quiz_question (id, artifact_id, category, question, difficulty, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 5, '工艺', '青花瓷的主要着色剂是什么？', 1, 1]
    );
    
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [1, 'A', '氧化铁', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [1, 'B', '氧化钴', 1]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [1, 'C', '氧化铜', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [1, 'D', '氧化锰', 0]);
    
    // 第 2 题: 剪纸起源朝代
    await connection.execute(
      'INSERT IGNORE INTO quiz_question (id, artifact_id, category, question, difficulty, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 1, '历史', '剪纸艺术最早起源于哪个朝代？', 1, 2]
    );
    
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [2, 'A', '汉代', 1]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [2, 'B', '唐代', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [2, 'C', '宋代', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [2, 'D', '明代', 0]);
    
    // 第 3 题: 苏绣发源地
    await connection.execute(
      'INSERT IGNORE INTO quiz_question (id, artifact_id, category, question, difficulty, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [3, 3, '地域', '苏绣的发源地是？', 1, 3]
    );
    
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [3, 'A', '湖南', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [3, 'B', '四川', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [3, 'C', '江苏苏州', 1]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [3, 'D', '广东', 0]);
    
    // 第 4 题: 皮影戏主要材料
    await connection.execute(
      'INSERT IGNORE INTO quiz_question (id, artifact_id, category, question, difficulty, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [4, 7, '材料', '皮影戏的主要材料是？', 1, 4]
    );
    
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [4, 'A', '纸张', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [4, 'B', '木材', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [4, 'C', '兽皮', 1]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [4, 'D', '布料', 0]);
    
    // 第 5 题: 不属于四大名绣
    await connection.execute(
      'INSERT IGNORE INTO quiz_question (id, artifact_id, category, question, difficulty, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [5, null, '工艺', '以下哪个不属于四大名绣？', 1, 5]
    );
    
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [5, 'A', '苏绣', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [5, 'B', '湘绣', 0]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [5, 'C', '京绣', 1]);
    await connection.execute('INSERT IGNORE INTO quiz_answer (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)', [5, 'D', '蜀绣', 0]);
    
    console.log('✅ 问答题数据插入完成');
    
    // 关闭连接
    connection.release();
    await pool.end();
    
    console.log('\n=== 数据插入完成 ===');
    console.log('所有表数据已根据 MYSQL.md 文件插入');
    
  } catch (err) {
    console.error('数据插入失败:', err.message);
  }
}

// 执行数据插入
insertData();