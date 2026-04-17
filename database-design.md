# 非遗文化数字化展示平台 - 数据库设计文档

> **版本**: v1.0
> **日期**: 2026-04-17
> **数据库类型**: MySQL 8.0+（推荐）/ PostgreSQL 14+

---

## 1. 设计概述

### 1.1 设计目标

本项目目前为纯前端原型，本文档规划后端数据库结构，以支撑完整的 12 个页面功能。数据库设计遵循以下原则：

- **轻量优先**: 比赛演示场景，避免过度设计
- **核心实体驱动**: 围绕展品（Artifact）这一核心实体组织数据
- **可扩展**: 支持后续增加非遗类别、展品、3D 模型等

### 1.2 ER 关系总览

```
admin_user ──┬──> artifact (1:N 管理)
             ├──> media_asset (1:N 上传)
             └──> category (1:N 管理)

category ────> artifact (1:N)
               ├──> artifact_media (1:N 关联图片/视频/3D)
               ├──> inheritor (N:M 关联传承人)
               ├──> hot_point (1:N 3D 标注点)
               └──> quiz_question (1:N 知识问答)

artifact ────> user_work (1:N 用户作品)
               └──> craft_step (1:N 制作步骤)

user_work ───> work_comment (1:N 评论)

quiz_question ──> quiz_answer (1:N 选项)
```

---

## 2. 数据表设计

### 2.1 管理员表 `admin_user`

极简后台管理，单表即可。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 登录用户名 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希（bcrypt） |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | NOT NULL, DEFAULT NOW() ON UPDATE | 更新时间 |

```sql
CREATE TABLE admin_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.2 非遗分类表 `category`

四大分类：传统美术、传统戏曲、传统手工技艺、民俗文化。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| name | VARCHAR(50) | NOT NULL | 分类名称 |
| icon_url | VARCHAR(500) | | 分类图标 URL |
| description | TEXT | | 分类简介 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 排序权重（越小越靠前） |
| status | TINYINT | NOT NULL, DEFAULT 1 | 状态: 1=上架, 0=下架 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |

```sql
CREATE TABLE category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(500),
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=上架, 0=下架',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.3 非遗展品表 `artifact`

**核心表**，承载 90% 以上的业务数据。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| category_id | BIGINT | NOT NULL, FK → category.id | 所属分类 |
| name | VARCHAR(100) | NOT NULL | 展品名称（如"剪纸-百鸟朝凤"） |
| subtitle | VARCHAR(200) | | 副标题/简短描述 |
| region | VARCHAR(100) | | 所属地域（如"陕西延安"） |
| cover_url | VARCHAR(500) | NOT NULL | 封面图 URL |
| history_origin | TEXT | | 历史渊源 |
| craft_process | TEXT | | 工艺流程说明 |
| cultural_value | TEXT | | 文化价值/非遗意义 |
| inheritor_info | TEXT | | 传承人现状/介绍 |
| video_url | VARCHAR(500) | | 工艺短视频 URL |
| audio_url | VARCHAR(500) | | 音频讲解 URL |
| model_3d_url | VARCHAR(500) | | 3D 模型文件 URL (.glb/.gltf) |
| ar_marker_url | VARCHAR(500) | | AR 识别图 URL |
| view_count | INT | NOT NULL, DEFAULT 0 | 浏览次数 |
| favorite_count | INT | NOT NULL, DEFAULT 0 | 收藏次数 |
| status | TINYINT | NOT NULL, DEFAULT 1 | 状态: 1=上架, 0=下架 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME | NOT NULL, DEFAULT NOW() ON UPDATE | 更新时间 |

```sql
CREATE TABLE artifact (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200),
    region VARCHAR(100),
    cover_url VARCHAR(500) NOT NULL,
    history_origin TEXT,
    craft_process TEXT,
    cultural_value TEXT,
    inheritor_info TEXT,
    video_url VARCHAR(500),
    audio_url VARCHAR(500),
    model_3d_url VARCHAR(500),
    ar_marker_url VARCHAR(500),
    view_count INT NOT NULL DEFAULT 0,
    favorite_count INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=上架, 0=下架',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT,
    INDEX idx_category (category_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.4 展品多媒体表 `artifact_media`

一个展品可关联多张图文（轮播图 gallery），与主表的 cover_url 分离。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| artifact_id | BIGINT | NOT NULL, FK → artifact.id | 所属展品 |
| media_type | TINYINT | NOT NULL | 类型: 1=图片, 2=视频, 3=3D模型 |
| url | VARCHAR(500) | NOT NULL | 资源 URL |
| caption | VARCHAR(200) | | 图片说明/标题 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 排序 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |

```sql
CREATE TABLE artifact_media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    artifact_id BIGINT NOT NULL,
    media_type TINYINT NOT NULL COMMENT '1=图片, 2=视频, 3=3D模型',
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(200),
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifact(id) ON DELETE CASCADE,
    INDEX idx_artifact (artifact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.5 3D 标注点表 `hot_point`

Three.js 3D 展示页使用，标注文物模型上可交互点击的点位。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| artifact_id | BIGINT | NOT NULL, FK → artifact.id | 所属展品 |
| name | VARCHAR(100) | NOT NULL | 标注点名称（如"纹样细节"） |
| position_x | DECIMAL(8,3) | NOT NULL | 3D 坐标 X |
| position_y | DECIMAL(8,3) | NOT NULL | 3D 坐标 Y |
| position_z | DECIMAL(8,3) | NOT NULL | 3D 坐标 Z |
| description | TEXT | NOT NULL | 工艺讲解/文化内涵说明 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |

```sql
CREATE TABLE hot_point (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    artifact_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    position_x DECIMAL(8,3) NOT NULL,
    position_y DECIMAL(8,3) NOT NULL,
    position_z DECIMAL(8,3) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifact(id) ON DELETE CASCADE,
    INDEX idx_artifact (artifact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.6 制作工艺步骤表 `craft_step`

虚拟工坊模块使用，定义每个非遗工艺的分步制作流程。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| artifact_id | BIGINT | NOT NULL, FK → artifact.id | 所属展品/工坊 |
| step_number | INT | NOT NULL | 步骤序号（1,2,3...） |
| title | VARCHAR(100) | NOT NULL | 步骤标题（如"折叠纸张"） |
| description | TEXT | | 步骤说明 |
| guide_text | VARCHAR(200) | | 下一步指引提示 |
| animation_url | VARCHAR(500) | | 步骤演示动画/视频 URL |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |

```sql
CREATE TABLE craft_step (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    artifact_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    guide_text VARCHAR(200),
    animation_url VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifact(id) ON DELETE CASCADE,
    INDEX idx_artifact_step (artifact_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.7 用户作品表 `user_work`

用户在虚拟工坊完成制作后生成的个人非遗作品。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| artifact_id | BIGINT | NOT NULL, FK → artifact.id | 基于哪个展品制作 |
| session_id | VARCHAR(64) | NOT NULL | 匿名用户会话标识（无需登录） |
| title | VARCHAR(100) | | 作品标题（用户自定） |
| preview_url | VARCHAR(500) | NOT NULL | 作品预览图/截图 URL |
| like_count | INT | NOT NULL, DEFAULT 0 | 点赞数 |
| comment_count | INT | NOT NULL, DEFAULT 0 | 评论数 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创作时间 |

```sql
CREATE TABLE user_work (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    artifact_id BIGINT NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    title VARCHAR(100),
    preview_url VARCHAR(500) NOT NULL,
    like_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifact(id) ON DELETE RESTRICT,
    INDEX idx_session (session_id),
    INDEX idx_artifact (artifact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.8 作品评论表 `work_comment`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| work_id | BIGINT | NOT NULL, FK → user_work.id | 评论的作品 |
| session_id | VARCHAR(64) | NOT NULL | 匿名用户标识 |
| content | VARCHAR(500) | NOT NULL | 评论内容 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 评论时间 |

```sql
CREATE TABLE work_comment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    work_id BIGINT NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    content VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES user_work(id) ON DELETE CASCADE,
    INDEX idx_work (work_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.9 知识问答题表 `quiz_question`

答题闯关模块题库。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| artifact_id | BIGINT | | 关联展品（可为空，通用题） |
| category | VARCHAR(50) | | 题目分类（历史/纹样/民俗/工艺） |
| question | VARCHAR(500) | NOT NULL | 题目内容 |
| difficulty | TINYINT | NOT NULL, DEFAULT 1 | 难度: 1=简单, 2=中等, 3=困难 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 排序 |
| status | TINYINT | NOT NULL, DEFAULT 1 | 状态: 1=启用, 0=停用 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 创建时间 |

```sql
CREATE TABLE quiz_question (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    artifact_id BIGINT,
    category VARCHAR(50),
    question VARCHAR(500) NOT NULL,
    difficulty TINYINT NOT NULL DEFAULT 1 COMMENT '1=简单, 2=中等, 3=困难',
    sort_order INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=启用, 0=停用',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifact(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.10 题目选项表 `quiz_answer`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| question_id | BIGINT | NOT NULL, FK → quiz_question.id | 所属题目 |
| option_label | CHAR(1) | NOT NULL | 选项标签: A/B/C/D |
| option_text | VARCHAR(300) | NOT NULL | 选项内容 |
| is_correct | TINYINT | NOT NULL, DEFAULT 0 | 是否正确答案: 1=是, 0=否 |
| explanation | TEXT | | 答案解析（答错/答对后展示） |

```sql
CREATE TABLE quiz_answer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    option_label CHAR(1) NOT NULL,
    option_text VARCHAR(300) NOT NULL,
    is_correct TINYINT NOT NULL DEFAULT 0 COMMENT '1=正确答案, 0=错误',
    explanation TEXT,
    FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE,
    INDEX idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.11 素材资源表 `media_asset`

后台管理"素材资源上传页"使用，统一管理所有上传文件。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| admin_id | BIGINT | NOT NULL, FK → admin_user.id | 上传管理员 |
| file_type | VARCHAR(20) | NOT NULL | 文件类型: image/video/model/audio |
| file_name | VARCHAR(200) | NOT NULL | 原始文件名 |
| file_size | BIGINT | NOT NULL | 文件大小（字节） |
| url | VARCHAR(500) | NOT NULL | 存储路径/URL |
| thumbnail_url | VARCHAR(500) | | 缩略图 URL（视频用） |
| created_at | DATETIME | NOT NULL, DEFAULT NOW() | 上传时间 |

```sql
CREATE TABLE media_asset (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    file_size BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_user(id) ON DELETE RESTRICT,
    INDEX idx_admin (admin_id),
    INDEX idx_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. 数据库统计

| 序号 | 表名 | 说明 | 预估数据量 |
|------|------|------|------------|
| 1 | admin_user | 管理员 | 1-5 条 |
| 2 | category | 非遗分类 | 4-10 条 |
| 3 | artifact | 非遗展品 | 20-100 条 |
| 4 | artifact_media | 展品多媒体 | 50-500 条 |
| 5 | hot_point | 3D 标注点 | 50-300 条 |
| 6 | craft_step | 制作步骤 | 50-200 条 |
| 7 | user_work | 用户作品 | 0-N 条 |
| 8 | work_comment | 作品评论 | 0-N 条 |
| 9 | quiz_question | 知识问答 | 20-100 条 |
| 10 | quiz_answer | 题目选项 | 80-400 条 |
| 11 | media_asset | 素材资源 | 50-500 条 |

**共计 11 张表**，全部使用 InnoDB 引擎，utf8mb4 字符集。

---

## 4. 核心业务场景 SQL 示例

### 4.1 首页：获取热门展品（按浏览/收藏排序）

```sql
SELECT a.id, a.name, a.subtitle, a.region, a.cover_url,
       c.name AS category_name, a.view_count, a.favorite_count
FROM artifact a
JOIN category c ON a.category_id = c.id
WHERE a.status = 1
ORDER BY a.view_count DESC, a.favorite_count DESC
LIMIT 8;
```

### 4.2 分类展馆：按分类获取展品列表

```sql
SELECT a.id, a.name, a.subtitle, a.region, a.cover_url
FROM artifact a
WHERE a.category_id = ? AND a.status = 1
ORDER BY a.created_at DESC;
```

### 4.3 展品详情：获取完整信息（含多媒体、传承人、3D 模型）

```sql
-- 展品基本信息
SELECT * FROM artifact WHERE id = ? AND status = 1;

-- 展品图片轮播 gallery
SELECT url, caption FROM artifact_media
WHERE artifact_id = ? AND media_type = 1
ORDER BY sort_order;

-- 3D 标注点
SELECT name, position_x, position_y, position_z, description
FROM hot_point WHERE artifact_id = ?;

-- 制作步骤
SELECT step_number, title, description, guide_text, animation_url
FROM craft_step WHERE artifact_id = ?
ORDER BY step_number;

-- 浏览量 +1
UPDATE artifact SET view_count = view_count + 1 WHERE id = ?;
```

### 4.4 3D 展示页：获取模型 URL 与标注点

```sql
SELECT model_3d_url FROM artifact WHERE id = ?;
SELECT name, position_x, position_y, position_z, description
FROM hot_point WHERE artifact_id = ?;
```

### 4.5 知识问答：按难度/分类获取题目

```sql
SELECT q.id, q.question, q.difficulty,
       a.option_label, a.option_text
FROM quiz_question q
JOIN quiz_answer a ON q.id = a.question_id
WHERE q.status = 1 AND q.difficulty = ?
ORDER BY q.sort_order;
```

### 4.6 作品分享：获取用户作品列表（含点赞评论统计）

```sql
SELECT uw.id, uw.title, uw.preview_url, uw.like_count,
       uw.comment_count, uw.created_at,
       a.name AS artifact_name
FROM user_work uw
JOIN artifact a ON uw.artifact_id = a.id
ORDER BY uw.like_count DESC, uw.created_at DESC;
```

### 4.7 后台管理：展品列表（含分类名）

```sql
SELECT a.id, a.name, a.status, a.view_count, a.favorite_count,
       c.name AS category_name, a.created_at, a.updated_at
FROM artifact a
JOIN category c ON a.category_id = c.id
ORDER BY a.created_at DESC;
```

---

## 5. 初始化数据

### 5.1 默认管理员

```sql
INSERT INTO admin_user (username, password_hash) VALUES
('admin', '$2b$10$...');  -- 密码: admin123（bcrypt 哈希）
```

### 5.2 默认分类

```sql
INSERT INTO category (name, icon_url, description, sort_order) VALUES
('传统美术', '/images/icon-meishu.jpg', '剪纸、年画、刺绣等视觉艺术', 1),
('传统戏曲', '/images/icon-xiqu.jpg', '皮影戏、木偶戏等表演艺术', 2),
('传统手工技艺', '/images/icon-gongyi.jpg', '瓷器、漆器、木雕等手工艺', 3),
('民俗文化', '/images/icon-minsu.jpg', '节庆民俗、民间信仰等', 4);
```

### 5.3 示例展品

```sql
INSERT INTO artifact (category_id, name, subtitle, region, cover_url, history_origin, craft_process, cultural_value, inheritor_info, video_url, model_3d_url, status) VALUES
(1, '剪纸-百鸟朝凤', '陕西民间传统剪纸艺术', '陕西延安', '/images/1.jpg',
 '剪纸艺术源于汉代纸张发明后...', '折叠→勾勒→裁剪→展开', '承载民间审美与祈福文化...',
 '省级传承人张XX，从事剪纸60余年', '/videos/jian.mp4', '/models/jian.glb', 1),
(3, '青花瓷-缠枝莲纹瓶', '景德镇传统制瓷工艺', '江西景德镇', '/images/2.jpg',
 '瓷器制作始于新石器时代...', '练泥→拉坯→施釉→烧制', '中国瓷器享誉世界...',
 '国家级传承人李XX...', '/videos/ci.mp4', '/models/ci.glb', 1);
```

---

## 6. 索引策略

| 表 | 索引 | 原因 |
|----|------|------|
| artifact | idx_category(category_id) | 按分类查询高频 |
| artifact | idx_status(status) | 只查询上架展品 |
| artifact_media | idx_artifact(artifact_id) | 展品详情必查 |
| hot_point | idx_artifact(artifact_id) | 3D 页面必查 |
| craft_step | idx_artifact_step(artifact_id, step_number) | 按顺序获取步骤 |
| quiz_question | idx_category(category) | 按分类筛题 |
| quiz_question | idx_difficulty(difficulty) | 按难度筛题 |
| media_asset | idx_file_type(file_type) | 按类型筛选 |

---

## 7. 设计取舍说明

| 决策 | 选择 | 理由 |
|------|------|------|
| 用户认证 | 无前端用户表 | 游客通过 session_id 标识，无需注册登录 |
| 收藏夹 | 前端 localStorage | PRD 明确"本地存储收藏夹，无需后端登录" |
| 文件存储 | URL 字符串 | 实际文件存云存储/OSS，数据库只存引用 |
| 评论审核 | 无审核字段 | 比赛演示场景，简化流程 |
| 操作日志 | 无 | 极简后台，不需要审计日志 |
| 软删除 | status 字段 | artifact/category 用 status 控制上下架 |
