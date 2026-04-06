# 10MinStudio 官方网站前端

基于 Vue.js 构建的 10MinStudio 官方网站前端应用，提供响应式设计、安全外链跳转、CMS和加密通信功能。

## ✨ 特性

- **现代化 UI 设计**: 使用 arco-design 组件库，提供美观的用户界面
- **响应式布局**: 适配桌面和移动设备，提供完整的全屏容器组件
- **安全外链管理**: 智能检测外部链接风险，提供用户安全提示
- **加密通信**: 内置浏览器端加密适配器，保障数据传输安全
- **性能优化**: 集成百度统计和 Tailwind CSS，优化加载性能

## 🚀 快速开始

### 环境要求
- Node.js 14.0+
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发模式
```bash
npm run serve
# 或
yarn serve
```

### 生产构建
```bash
npm run build
# 或
yarn build
```

## 🔧 核心组件说明

### 1. 加密适配器 (CryptBrowserAdapter)
位于 `src/utils/CryptBrowserAdapter.js`，提供浏览器端的加密解密功能：
- `encode()` / `decode()`: 核心加密解密函数（待实现）
- `Adapter` 类: 提供统一的加密接口
- 支持超时控制和多种加密模式

### 2. 外链跳转安全页面 (OuterLinkRedirect.vue)
智能检测外部链接安全性：
- 自动判断是否为危险域名
- 显示安全警告和提示信息
- 支持用户确认后跳转

### 3. 全屏容器组件 (fullScreenContainer.vue)
提供响应式全屏布局支持：
- 动态计算视口尺寸
- 自适应不同设备屏幕
- 简化全屏页面开发

## 🔐 安全特性

### 域名信任检测
通过 `CheckDomainTrusted.js` 检测目标域名的安全性，防止钓鱼攻击。

### 加密通信
- 前端加密适配器与后端 `CryptServersideAdapter` 配对使用
- 支持自定义加密算法实现
- 提供统一的 `Encrypt()` 和 `Decrypt()` 接口

## 📱 响应式设计

项目采用多种响应式技术：
1. **CSS 媒体查询**: 适配不同屏幕尺寸
2. **动态样式计算**: 通过 JavaScript 实时计算布局
3. **组件级响应**: 每个组件独立处理响应式逻辑

## 🎨 设计系统

### 字体
- 主要字体: HarmonyOS Sans（华为鸿蒙字体）
- 备用字体: 系统默认字体栈

### 样式框架
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Arco Design**: 企业级 UI 组件库
- **Bootstrap 5**: 辅助样式支持

## 🔗 与后端集成

### 数据加密流程
```
前端加密 → 网络传输 → 后端解密
前端: CryptBrowserAdapter.js
后端: CryptServersideAdapter.js
```

### WebSocket 支持
通过 `WSSDK.js` 提供 WebSocket 连接管理和速度测试功能。

## 📊 性能监控

### 百度统计
集成百度统计代码，用于网站流量分析：
```javascript
// 位于 index.html
var _hmt = _hmt || [];
```

### 加载性能
- 字体文件按需加载
- CSS 和 JavaScript 文件 CDN 加速
- 图片和资源懒加载支持

## 🛠️ 开发指南

### 添加新页面
1. 在 `src/views/` 创建新的 Vue 组件
2. 配置路由（需查看路由配置文件）
3. 在 `App.vue` 的 `router-view` 中显示

### 自定义加密算法
1. 在 `CryptBrowserAdapter.js` 中实现 `encode()` 和 `decode()` 函数
2. 确保与后端 `CryptServersideAdapter.js` 算法一致
3. 通过 `Adapter` 类提供统一接口

### 样式定制
- 全局样式: 修改 `App.vue` 中的样式部分
- 组件样式: 使用 `<style scoped>` 编写组件私有样式
- 主题定制: 通过 Arco Design的主题变量配置

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

- 问题反馈: [GitHub Issues](https://github.com/10MinStudio/website/issues)
- 功能建议: 通过 Issues 提交
- 安全漏洞: 请私信联系维护者

---

**注意**: 部分功能（如加密算法）需要与后端配合实现。请参考 `backend/` 目录下的对应文件。