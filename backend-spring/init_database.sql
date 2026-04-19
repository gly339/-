-- MySQL 初始化脚本 - 非遗文化数字化展示平台
-- 运行方式：mysql -u root -p < init_database.sql

DROP DATABASE IF EXISTS IntangibleHeritage;
CREATE DATABASE IntangibleHeritage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE IntangibleHeritage;

-- 1. 创建非遗大类表
CREATE TABLE IF NOT EXISTS category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    sort_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建非遗传承人物表
CREATE TABLE IF NOT EXISTS inheritor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    category_id INT,
    bio TEXT,
    avatar_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- 3. 创建细分展品/作品表
CREATE TABLE IF NOT EXISTS exhibit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    model_url VARCHAR(255),
    views INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- 4. 创建非遗工艺环节表
CREATE TABLE IF NOT EXISTS process (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exhibit_id INT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    step_order INT,
    FOREIGN KEY (exhibit_id) REFERENCES exhibit(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- 5. 创建用户表（普通用户）
CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5.1 创建管理员用户表
CREATE TABLE IF NOT EXISTS admin_user (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        username VARCHAR(50) NOT NULL UNIQUE,
                                        password_hash VARCHAR(255) NOT NULL
);

-- 6. 创建问答题表
CREATE TABLE IF NOT EXISTS quiz_question (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artifact_id INT,
    category VARCHAR(50),
    question VARCHAR(255) NOT NULL,
    difficulty INT,
    sort_order INT,
    FOREIGN KEY (artifact_id) REFERENCES exhibit(id)
);

-- 7. 创建答题选项表
CREATE TABLE IF NOT EXISTS quiz_answer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    option_label VARCHAR(10) NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES quiz_question(id)
);

-- 8. 创建用户作品表
CREATE TABLE IF NOT EXISTS works (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artifact_id INT,
    session_id VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    preview_url VARCHAR(255) NOT NULL,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    FOREIGN KEY (artifact_id) REFERENCES exhibit(id)
);

-- 9. 创建作品评论表
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_id INT,
    session_id VARCHAR(255),
    content TEXT NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(id)
);

-- 10. 创建素材表
CREATE TABLE IF NOT EXISTS assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_type VARCHAR(50),
    file_name VARCHAR(255),
    file_size BIGINT,
    url VARCHAR(255),
    thumbnail_url VARCHAR(255)
);

-- 插入初始数据
-- 非遗大类
INSERT INTO category (name, icon, sort_order) VALUES
    ('剪纸艺术', 'icon-jianzhi', 1),
    ('刺绣工艺', 'icon-cixiu', 2),
    ('陶瓷制作', 'icon-taoci', 3),
    ('皮影戏', 'icon-piying', 4),
    ('年画', 'icon-nianhua', 5);

-- 管理员 (密码：admin123)
INSERT INTO admin_user (username, password_hash) VALUES
    ('admin', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW');

SELECT '数据库初始化完成！' AS message;
SELECT * FROM category;
SELECT * FROM admin_user;
