# 非遗文化数字化展示平台 - API 接口文档

> **版本**: v1.0
> **日期**: 2026-04-17
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
| **展品** | GET | `/artifacts` | 展品列表 | 否 |
| | GET | `/artifacts/:id` | 展品详情 | 否 |
| | GET | `/artifacts/hot` | 热门展品 | 否 |
| | POST | `/admin/artifacts` | 新增展品 | 是 |
| | PUT | `/admin/artifacts/:id` | 更新展品 | 是 |
| | DELETE | `/admin/artifacts/:id` | 删除展品 | 是 |
| **展品媒体** | GET | `/artifacts/:id/media` | 展品多媒体列表 | 否 |
| | POST | `/admin/artifacts/:id/media` | 添加展品媒体 | 是 |
| | DELETE | `/admin/media/:id` | 删除展品媒体 | 是 |
| **3D 标注点** | GET | `/artifacts/:id/hot-points` | 3D 标注点列表 | 否 |
| | POST | `/admin/artifacts/:id/hot-points` | 新增标注点 | 是 |
| | PUT | `/admin/hot-points/:id` | 更新标注点 | 是 |
| | DELETE | `/admin/hot-points/:id` | 删除标注点 | 是 |
| **制作步骤** | GET | `/artifacts/:id/craft-steps` | 制作步骤列表 | 否 |
| | POST | `/admin/artifacts/:id/craft-steps` | 新增步骤 | 是 |
| | PUT | `/admin/craft-steps/:id` | 更新步骤 | 是 |
| | DELETE | `/admin/craft-steps/:id` | 删除步骤 | 是 |
| **用户作品** | GET | `/works` | 作品列表 | 否 |
| | GET | `/works/:id` | 作品详情 | 否 |
| | POST | `/works` | 上传作品 | 否 |
| | POST | `/works/:id/like` | 点赞作品 | 否 |
| | POST | `/works/:id/like/cancel` | 取消点赞 | 否 |
| **作品评论** | GET | `/works/:id/comments` | 作品评论列表 | 否 |
| | POST | `/works/:id/comments` | 发表评论 | 否 |
| | DELETE | `/admin/comments/:id` | 删除评论 | 是 |
| **知识问答** | GET | `/quiz` | 获取题目 | 否 |
| | POST | `/quiz/submit` | 提交答案 | 否 |
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
            "name": "传统美术",
            "icon_url": "/images/icon-meishu.jpg",
            "description": "剪纸、年画、刺绣等视觉艺术",
            "sort_order": 1,
            "status": 1
        },
        {
            "id": 2,
            "name": "传统戏曲",
            "icon_url": "/images/icon-xiqu.jpg",
            "description": "皮影戏、木偶戏等表演艺术",
            "sort_order": 2,
            "status": 1
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
    "icon_url": "/images/icon-yinyue.jpg",
    "description": "民歌、器乐等",
    "sort_order": 5
}
```

**响应**:
```json
{
    "code": 200,
    "message": "分类创建成功",
    "data": { "id": 5 }
}
```

#### PUT `/api/v1/admin/categories/:id` — 更新分类

**请求头**: `Authorization: Bearer <token>`

**请求体**（所有字段可选）:
```json
{
    "name": "传统手工技艺",
    "description": "瓷器、漆器、木雕等传统手工艺",
    "sort_order": 3,
    "status": 1
}
```

#### DELETE `/api/v1/admin/categories/:id` — 删除分类

**请求头**: `Authorization: Bearer <token>`

> 注：若分类下存在展品，返回 400 错误拒绝删除。

---

### 3.3 展品模块

#### GET `/api/v1/artifacts` — 展品列表

**Query 参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category_id | number | 否 | 按分类筛选 |
| keyword | string | 否 | 按名称模糊搜索 |
| region | string | 否 | 按地域筛选 |
| sort | string | 否 | 排序: `hot`(热门)/`new`(最新)/`default`，默认 `default` |
| page | number | 否 | 页码 |
| page_size | number | 否 | 每页条数 |

**请求示例**: `GET /api/v1/artifacts?category_id=1&sort=hot&page=1&page_size=8`

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [
            {
                "id": 1,
                "name": "剪纸-百鸟朝凤",
                "subtitle": "陕西民间传统剪纸艺术",
                "region": "陕西延安",
                "cover_url": "/images/1.jpg",
                "category_id": 1,
                "category_name": "传统美术",
                "view_count": 1520,
                "favorite_count": 89
            }
        ],
        "total": 25,
        "page": 1,
        "page_size": 8
    }
}
```

#### GET `/api/v1/artifacts/:id` — 展品详情

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "剪纸-百鸟朝凤",
        "subtitle": "陕西民间传统剪纸艺术",
        "region": "陕西延安",
        "cover_url": "/images/1.jpg",
        "category_id": 1,
        "category_name": "传统美术",
        "history_origin": "剪纸艺术源于汉代纸张发明后...",
        "craft_process": "折叠→勾勒→裁剪→展开",
        "cultural_value": "承载民间审美与祈福文化...",
        "inheritor_info": "省级传承人张XX，从事剪纸60余年",
        "video_url": "/videos/jian.mp4",
        "audio_url": "/audio/jian.mp3",
        "model_3d_url": "/models/jian.glb",
        "ar_marker_url": "/images/ar-marker-jian.png",
        "view_count": 1521,
        "favorite_count": 89,
        "has_3d": true,
        "has_ar": true,
        "has_workshop": true
    }
}
```

> `has_3d` / `has_ar` / `has_workshop` 为派生字段，用于前端控制入口按钮显隐。

#### GET `/api/v1/artifacts/hot` — 热门展品推荐

**Query 参数**: `limit`（默认 8）

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "剪纸-百鸟朝凤",
            "cover_url": "/images/1.jpg",
            "region": "陕西延安",
            "view_count": 1520,
            "favorite_count": 89
        }
    ]
}
```

#### POST `/api/v1/admin/artifacts` — 新增展品

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
    "category_id": 1,
    "name": "剪纸-百鸟朝凤",
    "subtitle": "陕西民间传统剪纸艺术",
    "region": "陕西延安",
    "cover_url": "/images/1.jpg",
    "history_origin": "...",
    "craft_process": "...",
    "cultural_value": "...",
    "inheritor_info": "...",
    "video_url": "/videos/jian.mp4",
    "audio_url": "/audio/jian.mp3",
    "model_3d_url": "/models/jian.glb",
    "ar_marker_url": "/images/ar-marker-jian.png",
    "status": 1
}
```

#### PUT `/api/v1/admin/artifacts/:id` — 更新展品

字段同新增，所有字段可选。支持部分更新。

#### DELETE `/api/v1/admin/artifacts/:id` — 删除展品

逻辑删除（设置 `status=0`），同时软删除关联的多媒体、标注点、步骤。

---

### 3.4 展品媒体模块

#### GET `/api/v1/artifacts/:id/media` — 展品多媒体列表

**Query 参数**: `media_type`（可选，1=图片/2=视频/3=3D模型）

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 10,
            "artifact_id": 1,
            "media_type": 1,
            "media_type_name": "图片",
            "url": "/images/gallery/jian-1.jpg",
            "caption": "剪纸成品展示",
            "sort_order": 1
        },
        {
            "id": 11,
            "artifact_id": 1,
            "media_type": 1,
            "media_type_name": "图片",
            "url": "/images/gallery/jian-2.jpg",
            "caption": "剪纸工艺细节",
            "sort_order": 2
        }
    ]
}
```

#### POST `/api/v1/admin/artifacts/:id/media` — 添加展品媒体

**请求体**:
```json
{
    "media_type": 1,
    "url": "/images/gallery/jian-3.jpg",
    "caption": "传承人工作照",
    "sort_order": 3
}
```

#### DELETE `/api/v1/admin/media/:id` — 删除展品媒体

---

### 3.5 3D 标注点模块

#### GET `/api/v1/artifacts/:id/hot-points` — 获取 3D 标注点

用于 Three.js 3D 展示页渲染可交互的标注点位。

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "artifact_id": 1,
            "name": "纹样细节",
            "position_x": 0.500,
            "position_y": 1.200,
            "position_z": -0.300,
            "description": "此处为百鸟朝凤核心纹样，寓意吉祥如意..."
        },
        {
            "id": 2,
            "artifact_id": 1,
            "name": "边框装饰",
            "position_x": -1.000,
            "position_y": 0.800,
            "position_z": 0.100,
            "description": "边框采用传统回纹装饰..."
        }
    ]
}
```

#### POST `/api/v1/admin/artifacts/:id/hot-points` — 新增标注点

**请求体**:
```json
{
    "name": "纹样细节",
    "position_x": 0.500,
    "position_y": 1.200,
    "position_z": -0.300,
    "description": "此处为百鸟朝凤核心纹样..."
}
```

#### PUT `/api/v1/admin/hot-points/:id` — 更新标注点

#### DELETE `/api/v1/admin/hot-points/:id` — 删除标注点

---

### 3.6 制作工艺步骤模块

#### GET `/api/v1/artifacts/:id/craft-steps` — 获取制作步骤

用于虚拟工坊分步交互页。

**响应**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "artifact_id": 1,
            "step_number": 1,
            "title": "折叠纸张",
            "description": "将红纸对折三次，形成八层叠纸...",
            "guide_text": "点击屏幕，将纸张对折",
            "animation_url": "/videos/step-fold.mp4"
        },
        {
            "id": 2,
            "artifact_id": 1,
            "step_number": 2,
            "title": "勾勒纹样",
            "description": "用铅笔在折好的纸上画出轮廓线...",
            "guide_text": "拖拽鼠标，画出鸟的轮廓",
            "animation_url": "/videos/step-draw.mp4"
        },
        {
            "id": 3,
            "artifact_id": 1,
            "step_number": 3,
            "title": "裁剪刻画",
            "description": "沿轮廓线小心剪下...",
            "guide_text": "点击裁剪区域，完成剪切",
            "animation_url": "/videos/step-cut.mp4"
        },
        {
            "id": 4,
            "artifact_id": 1,
            "step_number": 4,
            "title": "展开成品",
            "description": "轻轻展开，一幅百鸟朝凤剪纸就完成了！",
            "guide_text": "点击展开，查看成品",
            "animation_url": null
        }
    ]
}
```

#### POST `/api/v1/admin/artifacts/:id/craft-steps` — 新增步骤

**请求体**:
```json
{
    "step_number": 1,
    "title": "折叠纸张",
    "description": "将红纸对折三次...",
    "guide_text": "点击屏幕，将纸张对折",
    "animation_url": "/videos/step-fold.mp4"
}
```

#### PUT `/api/v1/admin/craft-steps/:id` — 更新步骤

#### DELETE `/api/v1/admin/craft-steps/:id` — 删除步骤

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

### 3.9 知识问答模块

#### GET `/api/v1/quiz` — 获取题目

**Query 参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 按分类筛选：历史/纹样/民俗/工艺 |
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
                "question": "剪纸艺术最早出现在哪个朝代？",
                "category": "历史",
                "difficulty": 1,
                "answers": [
                    { "option_label": "A", "option_text": "汉代" },
                    { "option_label": "B", "option_text": "唐代" },
                    { "option_label": "C", "option_text": "宋代" },
                    { "option_label": "D", "option_text": "明代" }
                ]
            }
        ],
        "total_questions": 10
    }
}
```

> **注意**: 接口不返回 `is_correct` 和 `explanation` 字段，防止前端作弊。答案在提交时校验。

#### POST `/api/v1/quiz/submit` — 提交答案并评分

**请求头**: `X-Session-Id: <session_id>`

**请求体**:
```json
{
    "answers": [
        { "question_id": 1, "selected_option": "A" },
        { "question_id": 2, "selected_option": "C" },
        { "question_id": 3, "selected_option": "B" }
    ]
}
```

**响应**:
```json
{
    "code": 200,
    "message": "答题完成",
    "data": {
        "total": 3,
        "correct": 2,
        "score": 67,
        "level": "非遗学徒",
        "results": [
            {
                "question_id": 1,
                "question": "剪纸艺术最早出现在哪个朝代？",
                "selected_option": "A",
                "is_correct": true,
                "correct_option": "A",
                "explanation": "剪纸艺术源于汉代，距今已有两千多年历史。"
            },
            {
                "question_id": 2,
                "question": "皮影戏的发源地是哪里？",
                "selected_option": "C",
                "is_correct": false,
                "correct_option": "A",
                "explanation": "皮影戏发源于陕西，是中国最古老的民间艺术之一。"
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
| **1. 首页门户** | `GET /categories`, `GET /artifacts/hot` |
| **2. 分类展馆列表** | `GET /categories`, `GET /artifacts?category_id=` |
| **3. 展品详情** | `GET /artifacts/:id`, `GET /artifacts/:id/media` |
| **4. 3D 沉浸展示** | `GET /artifacts/:id`, `GET /artifacts/:id/hot-points` |
| **5. WebAR 扫码** | `GET /artifacts/:id`（获取 `ar_marker_url`） |
| **6. 虚拟工坊首页** | `GET /artifacts?has_workshop=true` |
| **7. 分步制作交互** | `GET /artifacts/:id/craft-steps` |
| **8. 作品分享页** | `POST /works`, `GET /works`, `POST /works/:id/like`, `GET /works/:id/comments`, `POST /works/:id/comments` |
| **9. 知识答题** | `GET /quiz`, `POST /quiz/submit` |
| **10. 管理员登录** | `POST /auth/login` |
| **11. 内容管理列表** | `GET /admin/artifacts`, `POST /admin/artifacts`, `PUT /admin/artifacts/:id`, `DELETE /admin/artifacts/:id` |
| **12. 素材上传** | `POST /admin/upload`, `GET /admin/assets`, `DELETE /admin/assets/:id` |

---

## 5. 接口统计

| 模块 | 接口数 | 公开 | 需认证 |
|------|--------|------|--------|
| 认证 | 2 | 1 | 1 |
| 分类 | 4 | 1 | 3 |
| 展品 | 6 | 3 | 3 |
| 展品媒体 | 3 | 1 | 2 |
| 3D 标注点 | 4 | 1 | 3 |
| 制作步骤 | 4 | 1 | 3 |
| 用户作品 | 5 | 5 | 0 |
| 作品评论 | 3 | 2 | 1 |
| 知识问答 | 2 | 2 | 0 |
| 素材上传 | 3 | 0 | 3 |
| **合计** | **36** | **17** | **19** |
