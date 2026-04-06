# Backend System

一个基于 Node.js/TypeScript 的后端系统，提供内容管理、用户认证和实时通信功能。



## 核心功能

### 1. 认证系统 (TMSAuthMiddlewares)
- 用户登录/登出管理
- 权限验证 (`hasKeptRights()`)
- 验证码集成 (DX Captcha)
- 用户信息获取 (`GetAllInfo()`)

### 2. WebSocket 调度器 (WSHandleScheduler)
- 任务队列管理
- WebSocket 消息处理
- 异步任务调度
- 模拟请求/响应支持

### 3. 数据存储
- **文章数据**: JSON 格式存储文章和 Markdown 内容
- **用户数据**: 访问令牌管理
- **配置管理**: 外部密钥配置 (`keys.js`)

## 快速开始

### 安装依赖
```bash
npm install
```

### 配置
1. 复制 `src/keys.js` 模板并填写实际配置：
```javascript
var dxKey={
    appId: "your_app_id",
    appSecret: "your_app_secret",  
    refreshTime: 'refresh_interval',
    key: "encryption_key"
}
```

2. 初始化数据目录：
```bash
mkdir -p src/Data/ArticleAbout src/Data/TMSBackendAbout
```

### 运行
```bash
npm start
```

## 开发状态
- ✅ 基础框架搭建完成
- ✅ 认证系统实现
- ✅ WebSocket 调度器
- ✅ 数据存储结构
- 🔄 内容管理系统 (CMS) - 80% 完成
- ⏳ 高级权限控制 (文章推送到官网) - 待实现

## 技术栈
- **运行时**: Node.js
- **语言**: TypeScript / JavaScript
- **数据格式**: JSON
- **通信**: WebSocket
- **认证**: 自定义 JWT-like 令牌系统

## 贡献指南
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证
[请在此处添加许可证信息]

## 注意事项
- 当前使用 JSON 文件作为数据库，生产环境建议迁移到正式数据库
- 密钥文件 (`keys.js`) 应添加到 `.gitignore` 中
- WebSocket 调度器支持自定义任务队列管理