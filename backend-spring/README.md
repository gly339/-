# 非遗文化数字化展示平台 - Spring Boot 后端

## 项目说明

这是一个基于 **Spring Boot 3.2 + MySQL + JPA** 的后端服务项目，用于支持非遗文化数字化展示平台。

## 快速开始

### 1. 数据库准备

```bash
# 进入项目目录
cd backend-spring

# 初始化数据库（需要先安装 MySQL）
mysql -u root -p < init_database.sql
```

### 2. 配置环境变量

创建 `.env` 文件或设置环境变量：

```bash
export DB_PASSWORD=your_mysql_password
```

或者在 `application.yml` 中直接配置密码：

```yaml
spring:
  datasource:
    password: your_mysql_password
```

### 3. 运行项目

使用 Maven 运行：

```bash
mvn spring-boot:run
```

或使用 IDE 运行 `FeiyiApplication.java`

### 4. 访问服务

- Web 服务：http://localhost:3000
- API 健康检查：http://localhost:3000/api/health

## API 接口

### 认证相关

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| POST | /api/auth/register | 用户注册 | `{username, password, email?, phone?}` |
| POST | /api/auth/login | 用户登录 | `{username, password}` |
| GET | /api/auth/verify | 验证 Token | - |

### 展品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/exhibits | 获取展品列表 |
| GET | /api/exhibits/{id} | 获取展品详情 |
| POST | /api/exhibits | 创建展品 |
| PUT | /api/exhibits/{id} | 更新展品 |
| DELETE | /api/exhibits/{id} | 删除展品 |

### 问答相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/quiz/questions | 获取所有问题 |
| GET | /api/quiz/category/{category} | 按分类获取问题 |
| POST | /api/quiz/check | 检查答案 |

### 文件上传

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload/{type} | 上传图片/视频/模型 |

类型参数：`image`, `video`, `model`

### 作品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/works | 创建作品 |
| GET | /api/works/session/{sessionId} | 获取用户的作品 |
| GET | /api/works/popular | 获取热门作品 |

### 评论管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/comments | 添加评论 |
| GET | /api/comments/work/{workId} | 获取作品评论 |

## 技术栈

- **Spring Boot 3.2.0** - 应用框架
- **MySQL 8.0** - 数据库
- **Spring Data JPA** - ORM 框架
- **Spring Security** - 安全认证
- **JWT** - Token 认证
- **bcrypt** - 密码加密

## 项目结构

```
backend-spring/
├── src/main/java/com/feiyi/
│   ├── FeiyiApplication.java      # 启动类
│   ├── config/                     # 配置类
│   │   ├── SecurityConfig.java
│   │   ├── WebConfig.java
│   │   ├── CorsConfig.java
│   │   └── GlobalExceptionHandler.java
│   ├── controller/                 # 控制器
│   │   ├── AuthController.java
│   │   ├── ExhibitController.java
│   │   ├── QuizController.java
│   │   ├── WorksController.java
│   │   ├── CommentsController.java
│   │   ├── UploadController.java
│   │   └── HealthController.java
│   ├── entity/                     # 实体类
│   │   ├── Category.java
│   │   ├── Inheritor.java
│   │   ├── Exhibit.java
│   │   ├── Process.java
│   │   ├── AdminUser.java
│   │   ├── User.java               # 新增用户表
│   │   ├── QuizQuestion.java
│   │   ├── QuizAnswer.java
│   │   ├── Works.java
│   │   ├── Comments.java
│   │   └── Assets.java
│   ├── repository/                 # 数据访问层
│   │   ├── CategoryRepository.java
│   │   ├── InheritorRepository.java
│   │   ├── ExhibitRepository.java
│   │   ├── ProcessRepository.java
│   │   ├── AdminUserRepository.java
│   │   ├── UserRepository.java     # 新增用户仓库
│   │   ├── QuizQuestionRepository.java
│   │   ├── QuizAnswerRepository.java
│   │   ├── WorksRepository.java
│   │   ├── CommentsRepository.java
│   │   └── AssetsRepository.java
│   ├── service/                    # 业务逻辑层
│   │   ├── AuthService.java        # 已支持注册和登录
│   │   ├── ExhibitService.java
│   │   ├── QuizService.java
│   │   ├── WorksService.java
│   │   └── CommentsService.java
│   ├── dto/                        # 数据传输对象
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── RegisterRequest.java    # 新增注册请求
│   │   ├── RegisterResponse.java   # 新增注册响应
│   │   └── ApiResponse.java
│   └── util/                       # 工具类
│       └── JwtUtil.java
├── src/main/resources/
│   ├── application.yml             # 配置文件
│   └── static/                     # 静态资源
│       └── uploads/
├── pom.xml                         # Maven 配置
└── init_database.sql              # 数据库初始化脚本
```

## 默认账号

- 管理员：`admin / admin123`

## API 调用示例

### 用户注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@example.com",
    "phone": "13800138000"
  }'
```

响应：
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userId": 1,
    "username": "testuser",
    "message": "注册成功"
  }
}
```

### 用户登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

响应：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "username": "testuser",
    "message": "登录成功"
  }
}
```

### 获取展品列表

```bash
curl http://localhost:3000/api/exhibits
```

或使用分类过滤：

```bash
curl "http://localhost:3000/api/exhibits?category=1&page=1&limit=10"
```

## 注意事项

1. 确保 MySQL 服务已启动且端口 3306 可用
2. 数据库名称必须为 `IntangibleHeritage`
3. 上传文件默认保存在项目根目录的 `uploads/` 文件夹
4. CORS 已配置允许 `http://localhost:5501` 和 `http://localhost:3000` 访问
