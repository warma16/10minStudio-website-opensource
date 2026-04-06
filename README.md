# 10minStudio-website-opensource

一个完整的全栈应用，包含现代化的前端界面和功能丰富的后端服务。

## 🌟 项目概述

10MinStudio 官网是一个集成了内容管理、用户认证、实时通信和安全外链跳转的全栈解决方案。项目采用前后端分离架构，提供完整的开发和生产环境支持。

### 技术栈
- **前端**: Vue.js + Arco Design + Tailwind CSS
- **后端**: Node.js/TypeScript + Express
- **数据库**: JSON 文件存储（开发环境）
- **实时通信**: WebSocket
- **安全**: 自定义加密适配器 + DX Captcha 验证码


## 🚀 快速开始

### 1. 环境准备
```bash
# 安装 Node.js (推荐 16.x 或更高版本)
# 验证安装
node --version
npm --version
```

### 2. 前端启动
```bash
cd frontend
yarn install
yarn dev
```

### 3. 后端启动
```bash
cd backend
yarn install
yarn dev
```

### 4. 配置说明

#### 后端密钥配置 (`backend/src/keys.js`)
```javascript
var dxKey = {
    appId: "your_dx_captcha_app_id",
    appSecret: "your_dx_captcha_app_secret",  
    refreshTime: 'refresh_interval_in_ms',
    key: "encryption_key_for_data"
}
```

#### 前端配置
- 字体: HarmonyOS Sans（华为鸿蒙字体）
- UI 库: Arco Design Vue
- CSS 框架: Tailwind CSS + Bootstrap 5

## 🔧 核心功能模块

### 1. 认证系统 (`TMSAuthMiddlewares`)
- **用户管理**: 登录/登出、权限验证
- **验证码集成**: DX Captcha 服务
- **权限控制**: `hasKeptRights()` 方法验证用户权限
- **用户信息**: `GetAllInfo()` 获取完整用户信息

### 2. 内容管理系统
- **文章管理**: `ArticleDatabase.json` 存储文章元数据
- **Markdown 内容**: `MarkdownDatabase.json` 存储文章内容
- **用户数据**: `UserDatabase.json` 管理访问令牌

### 3. 实时通信系统
- **WebSocket 调度器**: `WSHandleScheduler` 管理任务队列
- **消息处理**: 异步任务调度和模拟请求/响应
- **性能监控**: `WSSDK.js` 提供连接速度测试

### 4. 安全系统
#### 加密通信
- **前端适配器**: `CryptBrowserAdapter.js`（浏览器端）
- **后端适配器**: `CryptServersideAdapter.js`（服务器端）
- **统一接口**: `Adapter` 类提供 `Encrypt()`/`Decrypt()` 方法

#### 安全外链跳转
- **域名检测**: `CheckDomainTrusted.js` 验证目标域名
- **风险提示**: `OuterLinkRedirect.vue` 显示安全警告
- **用户确认**: 危险链接需要用户手动确认

### 5. 前端界面
- **响应式设计**: `fullScreenContainer.vue` 提供全屏适配
- **组件化**: 头部、底部、搜索输入等可复用组件
- **路由管理**: Vue Router 实现页面导航
- **状态管理**: 通过事件总线 (`$bus`) 通信

## 🔐 安全特性

### 数据加密流程
```
前端数据 → CryptBrowserAdapter.Encrypt() → 网络传输
后端接收 → CryptServersideAdapter.Decrypt() → 处理数据
后端响应 → CryptServersideAdapter.Encrypt() → 网络传输
前端接收 → CryptBrowserAdapter.Decrypt() → 显示数据
```

### 访问控制
1. **令牌验证**: 通过 `UserDatabase.json` 管理有效令牌
2. **权限检查**: `hasKeptRights()` 验证用户操作权限
3. **会话管理**: 登录状态维护和自动登出

### 防钓鱼保护
- 外链跳转前显示安全警告
- 危险域名检测和用户确认
- 安全提示信息轮播显示

## 📊 数据存储

### JSON 数据库结构
```json
// 文章数据库
{
    "articles": [
        {
            "id": "unique_id",
            "title": "文章标题",
            "author": "作者",
            "createdAt": "创建时间",
            "updatedAt": "更新时间"
        }
    ]
}

// Markdown 内容
{
    "markdowns": [
        {
            "articleId": "对应文章ID",
            "content": "Markdown格式内容"
        }
    ]
}

// 用户访问令牌
{
    "allowAccessTokens": [
        "token1",
        "token2"
    ]
}
```

## 🛠️ 开发指南

### 添加新功能模块

#### 后端中间件
```typescript
// 在 backend/src/middlewares/ 创建新文件
export function YourMiddleware(req, res, next) {
    // 中间件逻辑
    next();
}
```

#### 前端页面
```vue
<!-- 在 frontend/src/views/ 创建新组件 -->
<template>
  <div>你的页面内容</div>
</template>

<script>
export default {
  name: 'YourPage',
  // 组件逻辑
}
</script>
```

### 实现加密算法

需要在两个文件中实现对应的加密解密逻辑：

```javascript
// frontend/src/utils/CryptBrowserAdapter.js
var encode = (code, accept_timeout = 1000) => {
    // 实现前端加密逻辑
    // 必须与后端算法匹配
}

// backend/src/utils/CryptServersideAdapter.js  
var encode = (data, tl) => {
    // 实现后端加密逻辑
    // 必须与前端算法匹配
}
```

### 配置自定义域名检测
修改 `CheckDomainTrusted.js`（未提供完整代码）来添加信任域名列表或检测规则。

## 📈 性能优化

### 前端优化
- **代码分割**: Vue Router 懒加载路由
- **资源优化**: 字体文件按需加载
- **CDN 加速**: 使用 Bootstrap 和 Tailwind CSS 的 CDN
- **缓存策略**: 静态资源长期缓存

### 后端优化
- **中间件缓存**: 常用数据内存缓存
- **连接池**: 数据库连接复用
- **任务队列**: WebSocket 任务异步处理


## 🐛 故障排除

### 常见问题

1. **加密通信失败**
   - 检查前后端 `encode`/`decode` 函数实现是否一致
   - 验证密钥配置是否正确

2. **WebSocket 连接失败**
   - 检查 `WSHandleScheduler` 配置
   - 验证网络防火墙设置

3. **权限验证失败**
   - 检查 `UserDatabase.json` 中的令牌
   - 验证 `hasKeptRights()` 逻辑

4. **外链检测误报**
   - 更新 `CheckDomainTrusted.js` 中的信任列表
   - 检查域名检测算法

### 日志查看
- 前端: 浏览器开发者工具 Console
- 后端: 查看服务器日志输出

## 🤝 贡献指南

1. **Fork 仓库**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'Add amazing feature'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **开启 Pull Request**

### 代码规范
- 前端: ESLint + Prettier
- 后端: TypeScript 严格模式
- 提交信息: 遵循 Conventional Commits

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 本项目不再更新，仅作为开源学习用途
