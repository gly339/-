# 非遗文化数字化展示平台 - API 接口文档

> **版本**: v1.0
> **日期**: 2026-04-18
> **基础路径**: `/api/v1`
> **数据格式**: JSON
> **字符编码**: UTF-8

---

## 1. 通用规范

### 1.1 响应格式

**成功响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": { ... }
}
```

**分页响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [ ... ],
        "total": 100,
        "page": 1,
        "page_size": 10
    }
}
```

**错误响应**:
```json
{
    "code": 400,
    "message": "参数错误：category_id 不能为空",
    "data": null
}
```

### 1.2 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/登录过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 1.3 认证方式

- **后台接口**: 请求头携带 `Authorization: Bearer <token>`
- **前端用户接口**: 无需认证，通过 `session_id` 标识匿名用户（Cookie 或请求头）
- **Token 有效期**: 7 天

### 1.4 分页参数约定

所有列表接口统一使用：
- `page` — 页码，默认 1
- `page_size` — 每页条数，默认 10，最大 100

---

## 2. 接口总览

| 模块 | 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|------|
| **认证** | POST | `/auth/login` | 管理员登录 | 否 |
| | POST | `/auth/logout` | 管理员退出 | 是 |
| **分类** | GET | `/categories` | 分类列表 | 否 |
| | POST | `/admin/categories` | 新增分类 | 是 |
| | PUT | `/admin/categories/:id` | 更新分类 | 是 |
| | DELETE | `/admin/categories/:id` | 删除分类 | 是 |
| **传承人** | GET | `/inheritors` | 传承人列表 | 否 |
| | GET | `/inheritors/:id` | 传承人详情 | 否 |
| | GET | `/categories/:id/inheritors` | 分类下的传承人 | 否 |
| | POST | `/admin/inheritors` | 新增传承人 | 是 |
| | PUT | `/admin/inheritors/:id` | 更新传承人 | 是 |
| | DELETE | `/admin/inheritors/:id` | 删除传承人 | 是 |
| **展品** | GET | `/exhibits` | 展品列表 | 否 |
| | GET | `/exhibits/:id` | 展品详情 | 否 |
| | GET | `/categories/:id/exhibits` | 分类下的展品 | 否 |
| | POST | `/admin/exhibits` | 新增展品 | 是 |
| | PUT | `/admin/exhibits/:id` | 更新展品 | 是 |
| | DELETE | `/admin/exhibits/:id` | 删除展品 | 是 |
| **工艺环节** | GET | `/exhibits/:id/processes` | 展品工艺环节 | 否 |
| | GET | `/categories/:id/processes` | 分类工艺环节 | 否 |
| | POST | `/admin/processes` | 新增工艺环节 | 是 |
| | PUT | `/admin/processes/:id` | 更新工艺环节 | 是 |
| | DELETE | `/admin/processes/:id` | 删除工艺环节 | 是 |
| **载体** | GET | `/carriers` | 载体列表 | 否 |
| | GET | `/carriers/:id` | 载体详情 | 否 |
| | POST | `/admin/carriers` | 新增载体 | 是 |
| | PUT | `/admin/carriers/:id` | 更新载体 | 是 |
| | DELETE | `/admin/carriers/:id` | 删除载体 | 是 |
| **知识问答** | GET | `/quiz` | 获取题目 | 否 |
| | POST | `/quiz/submit` | 提交答案 | 否 |
| | POST | `/admin/quiz/questions` | 新增问题 | 是 |
| | PUT | `/admin/quiz/questions/:id` | 更新问题 | 是 |
| | DELETE | `/admin/quiz/questions/:id` | 删除问题 | 是 |
| | POST | `/admin/quiz/answers` | 新增答案选项 | 是 |
| | PUT | `/admin/quiz/answers/:id` | 更新答案选项 | 是 |
| | DELETE | `/admin/quiz/answers/:id` | 删除答案选项 | 是 |
| **素材上传** | POST | `/admin/upload` | 上传文件 | 是 |
| | GET | `/admin/assets` | 素材列表 | 是 |
| | DELETE | `/admin/assets/:id` | 删除素材 | 是 |

---

## 3. 接口详情

### 3.1 认证模块

#### POST `/api/v1/auth/login` — 管理员登录

**请求体**:
```json
{   
    "username": "admin",
    "password": "admin123"
}
```

**响应**:
```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "admin_id": 1,
        "username": "admin",
        "expires_at": "2026-04-24T12:00:00Z"
    }
}
```

#### POST `/api/v1/auth/logout` — 管理员退出

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
    "code": 200,
    "message": "退出成功",
    "data": null
}
```

---

### 3.2 分类模块

#### GET `/api/v1/categories` — 获取全部分类

**Query 参数**: 无

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "剪纸艺术",
            "icon": "✂️",
            "sort_order": 1
        },
        {
            "id": 2,
            "name": "刺绣工艺",
            "icon": "🧵",
            "sort_order": 2
        }
    ]
}
```

#### POST `/api/v1/admin/categories` — 新增分类

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "name": "民间音乐",
    "icon": "🎵",
    "sort_order": 6
}
```

**响应**:
```json
{
    "code": 200,
    "message": "分类创建成功",
    "data": { "id": 6 }
}
```

#### PUT `/api/v1/admin/categories/:id` — 更新分类

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "name": "传统手工技艺",
    "icon": "🔨",
    "sort_order": 3
}
```

#### DELETE `/api/v1/admin/categories/:id` — 删除分类

**请求头**: `Authorization: Bearer <token>`

> 注：若分类下存在展品或传承人，返回 400 错误拒绝删除。

---

### 3.3 传承人模块

#### GET `/api/v1/inheritors` — 获取传承人列表

**Query 参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category_id | number | 否 | 按分类筛选 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页条数 |

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "name": "王兰花",
                "title": "国家级非遗传承人",
                "category_id": 1,
                "category_name": "剪纸艺术",
                "bio": "从事剪纸艺术50年，作品充满乡土气息",
                "avatar_url": "images/avatar1.png"
            }
        ],
        "total": 8,
        "page": 1,
        "page_size": 10
    }
}
```

#### GET `/api/v1/inheritors/:id` — 获取传承人详情

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "王兰花",
        "title": "国家级非遗传承人",
        "category_id": 1,
        "category_name": "剪纸艺术",
        "bio": "从事剪纸艺术50年，作品充满乡土气息，被誉为\"陕北剪纸第一剪\"。会宁剪纸县级非物质文化遗产代表性传承官方名录收录...",
        "avatar_url": "images/avatar1.png"
    }
}
```

#### GET `/api/v1/categories/:id/inheritors` — 获取分类下的传承人

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "王兰花",
            "title": "国家级非遗传承人",
            "bio": "从事剪纸艺术50年...",
            "avatar_url": "images/avatar1.png"
        }
    ]
}
```

#### POST `/api/v1/admin/inheritors` — 新增传承人

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "name": "张三",
    "title": "省级非遗传承人",
    "category_id": 1,
    "bio": "从事剪纸艺术30年...",
    "avatar_url": "images/avatar9.png"
}
```

#### PUT `/api/v1/admin/inheritors/:id` — 更新传承人

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "name": "张三",
    "title": "国家级非遗传承人",
    "category_id": 1,
    "bio": "从事剪纸艺术35年...",
    "avatar_url": "images/avatar9.png"
}
```

#### DELETE `/api/v1/admin/inheritors/:id` — 删除传承人

**请求头**: `Authorization: Bearer <token>`

### 3.4 展品模块

#### GET `/api/v1/exhibits` — 展品列表

**Query 参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category_id | number | 否 | 按分类筛选 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页条数 |

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "name": "陕北窗花",
                "description": "传统吉祥图案，寓意美好",
                "image_url": "images/icon-chuang.jpg",
                "category_id": 1,
                "category_name": "剪纸艺术"
            }
        ],
        "total": 8,
        "page": 1,
        "page_size": 10
    }
}
```

#### GET `/api/v1/exhibits/:id` — 展品详情

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "陕北窗花",
        "description": "传统吉祥图案，寓意美好",
        "image_url": "images/icon-chuang.jpg",
        "model_url": "models/chuang.glb",
        "category_id": 1,
        "category_name": "剪纸艺术"
    }
}
```

#### GET `/api/v1/categories/:id/exhibits` — 获取分类下的展品

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "陕北窗花",
            "description": "传统吉祥图案，寓意美好",
            "image_url": "images/icon-chuang.jpg"
        }
    ]
}
```

#### POST `/api/v1/admin/exhibits` — 新增展品

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "category_id": 1,
    "name": "新剪纸作品",
    "description": "现代剪纸艺术作品",
    "image_url": "images/new-jianzhi.jpg"
}
```

#### PUT `/api/v1/admin/exhibits/:id` — 更新展品

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "category_id": 1,
    "name": "更新的剪纸作品",
    "description": "更新的描述",
    "image_url": "images/updated-jianzhi.jpg"
}
```

#### DELETE `/api/v1/admin/exhibits/:id` — 删除展品

**请求头**: `Authorization: Bearer <token>`

---

### 3.5 工艺环节模块

#### GET `/api/v1/exhibits/:id/processes` — 获取展品工艺环节

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "exhibit_id": 1,
            "category_id": 1,
            "name": "选纸",
            "description": "选用加厚宣纸",
            "step_order": 1
        },
        {
            "id": 2,
            "exhibit_id": 1,
            "category_id": 1,
            "name": "画稿",
            "description": "手工绘制图案",
            "step_order": 2
        }
    ]
}
```

#### GET `/api/v1/categories/:id/processes` — 获取分类工艺环节

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "exhibit_id": 1,
            "name": "选纸",
            "description": "选用加厚宣纸",
            "step_order": 1
        }
    ]
}
```

#### POST `/api/v1/admin/processes` — 新增工艺环节

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "exhibit_id": 1,
    "category_id": 1,
    "name": "新步骤",
    "description": "新步骤描述",
    "step_order": 5
}
```

#### PUT `/api/v1/admin/processes/:id` — 更新工艺环节

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "exhibit_id": 1,
    "category_id": 1,
    "name": "更新步骤",
    "description": "更新的描述",
    "step_order": 5
}
```

#### DELETE `/api/v1/admin/processes/:id` — 删除工艺环节

**请求头**: `Authorization: Bearer <token>`

### 3.6 载体模块

#### GET `/api/v1/carriers` — 获取载体列表

**Query 参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 按类型筛选 |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页条数 |

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "name": "陕北窗花视频",
                "type": "视频",
                "description": "陕北剪纸制作过程视频",
                "file_url": "videos/jian.mp4"
            }
        ],
        "total": 8,
        "page": 1,
        "page_size": 10
    }
}
```

#### GET `/api/v1/carriers/:id` — 获取载体详情

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "陕北窗花视频",
        "type": "视频",
        "description": "陕北剪纸制作过程视频",
        "file_url": "videos/jian.mp4"
    }
}
```

#### POST `/api/v1/admin/carriers` — 新增载体

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "name": "新视频载体",
    "type": "视频",
    "description": "新视频描述",
    "file_url": "videos/new-video.mp4"
}
```

#### PUT `/api/v1/admin/carriers/:id` — 更新载体

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "name": "更新的视频载体",
    "type": "视频",
    "description": "更新的描述",
    "file_url": "videos/updated-video.mp4"
}
```

#### DELETE `/api/v1/admin/carriers/:id` — 删除载体

**请求头**: `Authorization: Bearer <token>`

---

### 3.7 用户作品模块

#### GET `/api/v1/works` — 作品分享列表

**Query 参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| artifact_id | number | 否 | 按展品筛选 |
| session_id | string | 否 | 查看自己的作品 |
| sort | string | 否 | `hot`(点赞最多)/`new`(最新)，默认 `hot` |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页条数 |

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "artifact_id": 1,
                "artifact_name": "剪纸-百鸟朝凤",
                "title": "我的新春剪纸",
                "preview_url": "/images/works/user-001.jpg",
                "like_count": 25,
                "comment_count": 3,
                "created_at": "2026-04-15T10:30:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "page_size": 10
    }
}
```

#### GET `/api/v1/works/:id` — 作品详情

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "artifact_id": 1,
        "artifact_name": "剪纸-百鸟朝凤",
        "title": "我的新春剪纸",
        "preview_url": "/images/works/user-001.jpg",
        "like_count": 25,
        "comment_count": 3,
        "is_liked": false,
        "created_at": "2026-04-15T10:30:00Z"
    }
}
```

#### POST `/api/v1/works` — 上传/生成作品

**请求头**: `X-Session-Id: <session_id>`

**请求体**:
```json
{
    "artifact_id": 1,
    "title": "我的新春剪纸",
    "preview_url": "/images/works/user-002.jpg"
}
```

**响应**:
```json
{
    "code": 200,
    "message": "作品发布成功",
    "data": { "id": 2 }
}
```

#### POST `/api/v1/works/:id/like` — 点赞作品

**请求头**: `X-Session-Id: <session_id>`

**响应**:
```json
{
    "code": 200,
    "message": "点赞成功",
    "data": { "like_count": 26 }
}
```

#### POST `/api/v1/works/:id/like/cancel` — 取消点赞

**请求头**: `X-Session-Id: <session_id>`

**响应**:
```json
{
    "code": 200,
    "message": "已取消点赞",
    "data": { "like_count": 25 }
}
```

---

### 3.8 作品评论模块

#### GET `/api/v1/works/:id/comments` — 作品评论列表

**Query 参数**: `page`, `page_size`

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "work_id": 1,
                "session_id": "abc***123",
                "content": "太美了！第一次体验剪纸！",
                "created_at": "2026-04-15T11:00:00Z"
            }
        ],
        "total": 3,
        "page": 1,
        "page_size": 10
    }
}
```

> `session_id` 返回时做脱敏处理（中间用 `***` 替换）。

#### POST `/api/v1/works/:id/comments` — 发表评论

**请求头**: `X-Session-Id: <session_id>`

**请求体**:
```json
{
    "content": "太美了！第一次体验剪纸！"
}
```

> 内容长度限制 500 字符，需做 XSS 过滤。

---

### 3.9 素材管理模块

#### GET `/api/v1/admin/assets` — 素材列表

**Query 参数**: `file_type`（可选）, `page`, `page_size`

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 100,
                "file_type": "image",
                "file_name": "jian-new.jpg",
                "file_size": 2048576,
                "url": "/uploads/images/2026/04/jian-new-a1b2c3.jpg",
                "thumbnail_url": "/uploads/images/2026/04/thumb-jian-new-a1b2c3.jpg",
                "created_at": "2026-04-17T09:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "page_size": 10
    }
}
```

#### POST `/api/v1/admin/upload` — 上传文件

**请求头**: `Authorization: Bearer <token>`

**Content-Type**: `multipart/form-data`

**表单字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 文件 |
| file_type | string | 是 | image/video/model/audio |

**限制**:

| 类型 | 最大大小 | 允许格式 |
|------|----------|----------|
| image | 10MB | jpg, jpeg, png, gif, webp |
| video | 100MB | mp4, webm |
| model | 50MB | glb, gltf, obj |
| audio | 20MB | mp3, wav, ogg |

**响应**:
```json
{
    "code": 200,
    "message": "上传成功",
    "data": {
        "id": 100,
        "file_type": "image",
        "file_name": "jian-new.jpg",
        "file_size": 2048576,
        "url": "/uploads/images/2026/04/jian-new-a1b2c3.jpg",
        "thumbnail_url": "/uploads/images/2026/04/thumb-jian-new-a1b2c3.jpg"
    }
}
```

#### DELETE `/api/v1/admin/assets/:id` — 删除素材

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
    "code": 200,
    "message": "删除成功",
    "data": null
}
```

---

### 3.7 知识问答模块

#### GET `/api/v1/quiz` — 获取题目

**Query 参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 按分类筛选 |
| difficulty | number | 否 | 难度: 1=简单, 2=中等, 3=困难 |
| artifact_id | number | 否 | 获取某展品相关的题目 |
| limit | number | 否 | 获取题数，默认 10 |

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "questions": [
            {
                "id": 1,
                "question": "青花瓷的主要着色剂是什么？",
                "category": "工艺",
                "difficulty": 1,
                "answers": [
                    { "option_label": "A", "option_text": "氧化铁" },
                    { "option_label": "B", "option_text": "氧化钴" },
                    { "option_label": "C", "option_text": "氧化铜" },
                    { "option_label": "D", "option_text": "氧化锰" }
                ]
            }
        ],
        "total_questions": 5
    }
}
```

> **注意**: 接口不返回 `is_correct` 字段，防止前端作弊。答案在提交时校验。

#### POST `/api/v1/quiz/submit` — 提交答案并评分

**请求头**: `X-Session-Id: <session_id>`

**请求体**:
```json
{
    "answers": [
        { "question_id": 1, "selected_option": "B" },
        { "question_id": 2, "selected_option": "A" }
    ]
}
```

**响应**:
```json
{
    "code": 200,
    "message": "答题完成",
    "data": {
        "total": 2,
        "correct": 2,
        "score": 100,
        "level": "非遗大师",
        "results": [
            {
                "question_id": 1,
                "question": "青花瓷的主要着色剂是什么？",
                "selected_option": "B",
                "is_correct": true,
                "correct_option": "B"
            },
            {
                "question_id": 2,
                "question": "剪纸艺术最早起源于哪个朝代？",
                "selected_option": "A",
                "is_correct": true,
                "correct_option": "A"
            }
        ]
    }
}
```

**评级规则**:

| 得分 | 称号 |
|------|------|
| 0-30% | 非遗萌新 |
| 31-60% | 非遗学徒 |
| 61-85% | 非遗匠人 |
| 86-100% | 非遗大师 |

#### POST `/api/v1/admin/quiz/questions` — 新增问题

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "artifact_id": 1,
    "category": "历史",
    "question": "新问题？",
    "difficulty": 1,
    "sort_order": 6
}
```

#### PUT `/api/v1/admin/quiz/questions/:id` — 更新问题

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "artifact_id": 1,
    "category": "历史",
    "question": "更新的问题？",
    "difficulty": 2,
    "sort_order": 6
}
```

#### DELETE `/api/v1/admin/quiz/questions/:id` — 删除问题

**请求头**: `Authorization: Bearer <token>`

#### POST `/api/v1/admin/quiz/answers` — 新增答案选项

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "question_id": 1,
    "option_label": "E",
    "option_text": "新选项",
    "is_correct": false
}
```

#### PUT `/api/v1/admin/quiz/answers/:id` — 更新答案选项

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "option_label": "E",
    "option_text": "更新的选项",
    "is_correct": true
}
```

#### DELETE `/api/v1/admin/quiz/answers/:id` — 删除答案选项

**请求头**: `Authorization: Bearer <token>`

---

### 3.10 素材上传模块

#### POST `/api/v1/admin/upload` — 上传文件

**请求头**: `Authorization: Bearer <token>`

**Content-Type**: `multipart/form-data`

**表单字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 文件 |
| file_type | string | 是 | image/video/model/audio |

**限制**:

| 类型 | 最大大小 | 允许格式 |
|------|----------|----------|
| image | 10MB | jpg, jpeg, png, gif, webp |
| video | 100MB | mp4, webm |
| model | 50MB | glb, gltf, obj |
| audio | 20MB | mp3, wav, ogg |

**响应**:
```json
{
    "code": 200,
    "message": "上传成功",
    "data": {
        "id": 100,
        "file_type": "image",
        "file_name": "jian-new.jpg",
        "file_size": 2048576,
        "url": "/uploads/images/2026/04/jian-new-a1b2c3.jpg",
        "thumbnail_url": "/uploads/images/2026/04/thumb-jian-new-a1b2c3.jpg"
    }
}
```

#### GET `/api/v1/admin/assets` — 素材列表

**Query 参数**: `file_type`（可选）, `page`, `page_size`

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 100,
                "file_type": "image",
                "file_name": "jian-new.jpg",
                "file_size": 2048576,
                "url": "/uploads/images/2026/04/jian-new-a1b2c3.jpg",
                "thumbnail_url": "/uploads/images/2026/04/thumb-jian-new-a1b2c3.jpg",
                "created_at": "2026-04-17T09:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "page_size": 10
    }
}
```

#### DELETE `/api/v1/admin/assets/:id` — 删除素材

同时删除磁盘上的物理文件。

---

## 4. 接口与页面对照

| 页面 | 调用的接口 |
|------|-----------|
| **1. 首页门户** | `GET /categories`, `GET /exhibits` |
| **2. 分类展馆列表** | `GET /categories`, `GET /categories/:id/exhibits` |
| **3. 非遗作品详情页** | `GET /exhibits/:id`, `GET /exhibits/:id/processes` |
| **4. 3D 沉浸式展示页** | `GET /exhibits/:id` |
| **5. WebAR 扫码页** | `GET /exhibits/:id` |
| **6. 虚拟工坊首页** | `GET /exhibits` |
| **7. 分步制作交互页** | `GET /exhibits/:id/processes` |
| **8. 作品分享页** | 暂未实现 |
| **9. 答题页面** | `GET /quiz`, `POST /quiz/submit` |
| **10. 管理员登录** | `POST /auth/login` |
| **11. 内容管理列表** | `GET /categories`, `GET /inheritors`, `GET /exhibits`, `GET /processes`, `GET /carriers` |
| **12. 素材上传页** | `POST /admin/upload`, `GET /admin/assets`, `DELETE /admin/assets/:id` |

---

## 5. 接口统计

| 模块 | 接口数 | 公开 | 需认证 |
|------|--------|------|--------|
| 认证 | 2 | 1 | 1 |
| 分类 | 4 | 1 | 3 |
| 传承人 | 6 | 3 | 3 |
| 展品 | 6 | 3 | 3 |
| 工艺环节 | 5 | 2 | 3 |
| 载体 | 5 | 2 | 3 |
| 知识问答 | 8 | 2 | 6 |
| 用户作品 | 5 | 5 | 0 |
| 作品评论 | 2 | 2 | 0 |
| 素材管理 | 3 | 0 | 3 |
| **合计** | **46** | **21** | **25** |