<h1 align="center">
  <img src="public/favicon.svg" alt="Hello Game" width="80" height="80">
  <br>
  Hello Game
</h1>

<p align="center">
    <a href="https://github.com/dkbnull/hello-game" target="_blank">
       <img src="https://img.shields.io/badge/GitHub-访问地址-blue?logo=github">
    </a>
    <a href="https://gitee.com/dkbnull/hello-game" target="_blank">
       <img src="https://img.shields.io/badge/Gitee-访问地址-red?logo=gitee">
    </a>
    <img src="https://img.shields.io/badge/Vue-3.5.30-42b883?logo=vue.js">
    <img src="https://img.shields.io/badge/Vite-8.0.8-646cff?logo=vite">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue">
</p>

Hello Game 是一个基于 Vue 3 + Vite 构建的寓教于乐儿童游戏平台，集合经典益智游戏和趣味早教学习，让小朋友在游戏中快乐学习。

## ✨ 功能特色

### 🎯 经典益智

| 游戏      | 说明                    |
|---------|-----------------------|
| 💣 扫雷   | 经典扫雷游戏，锻炼逻辑推理能力       |
| 🔢 数独   | 填入数字，每行每列每宫不重复        |
| 🧩 2048 | 滑动合并数字，挑战最高分          |
| 🀄 消消乐  | 配对消除游戏，支持语文、数学、英语三种模式 |

### 🌟 趣味早教

| 游戏      | 说明              |
|---------|-----------------|
| 📝 识字达人 | 看图识字，轻松认识常用汉字   |
| 🎵 拼音学习 | 声母韵母趣味学习，打好拼音基础 |
| 🌍 英语启蒙 | 趣味英语单词学习，轻松入门   |
| ➕ 加减乐园  | 趣味加减法练习，提升数学能力  |

### 🥋 火影忍者

| 游戏      | 说明               |
|---------|------------------|
| 🎭 忍者结印 | 摄像头手势识别，体验火影结印忍术 |

### 🎲 趣味测试

| 游戏      | 说明                        |
|---------|---------------------------|
| 🐂 牛马测试 | NMTI 人格测试，测测你的牛马人格，打工魂燃烧吧 |
| 🔮 算命运势 | 输入信息，测算你的命运与运势，纯属娱乐开心就好   |

### 📋 通用功能

- **计时系统**：所有教育游戏支持计时，记录学习用时
- **题目数量选择**：5/10/15/20/30 题自由选择
- **自由出题**：支持搜索题库，动态添加自定义题目
- **难度分级**：简单/中等/困难，适应不同学习阶段
- **成绩记录**：基于 localStorage 持久化存储，记录当前分数与最高分
- **结果保存**：牛马测试和算命运势支持保存为图片（html2canvas）
- **种子随机算法**：算命运势同一人同一天结果固定
- **SEO 优化**：自定义 Vite 插件自动注入 meta 标签、Open Graph、结构化数据及百度统计
- **路由级 SEO**：每个游戏页面独立设置 title、description、keywords

## 🛠️ 技术栈

| 技术                       | 说明                        |
|--------------------------|---------------------------|
| Vue 3                    | 渐进式前端框架，Composition API   |
| Vue Router 5             | 单页应用路由管理，History 模式       |
| Pinia 3                  | 状态管理，成绩持久化存储              |
| Vite 8                   | 下一代前端构建工具                 |
| html2canvas              | DOM 元素截图，结果保存为图片          |
| unplugin-auto-import     | Vue/Router/Pinia API 自动导入 |
| unplugin-vue-components  | 组件自动注册                    |
| vite-plugin-vue-devtools | Vue 开发者工具集成               |

## 📁 项目结构

```
hello-game/
├── plugins/                        # Vite 自定义插件
│   └── vite-plugin-seo-analytics.js
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── chars/                  # 识字达人汉字 SVG
│   │   ├── icons/                  # 游戏与分类图标 SVG
│   │   └── words/                  # 英语启蒙单词 SVG
│   ├── components/
│   │   ├── EduQuizGame.vue         # 教育游戏通用组件（选题/答题/结果）
│   │   ├── Footer.vue
│   │   ├── GameCard.vue            # 首页游戏卡片
│   │   ├── GamePage.vue            # 游戏页面通用布局
│   │   └── Header.vue
│   ├── composables/
│   │   └── useTimer.js             # 计时器组合式函数
│   ├── data/
│   │   ├── fortune.js              # 算命数据
│   │   ├── games.js                # 游戏列表与分类配置
│   │   ├── grade1Chars.js          # 一年级汉字题库
│   │   ├── grade1English.js        # 一年级英语题库
│   │   └── nmti.js                 # 牛马测试题库
│   ├── layouts/
│   │   ├── DefaultLayout.vue       # 首页布局
│   │   └── GameLayout.vue          # 游戏页布局
│   ├── plugins/
│   │   └── seoAnalytics.js         # SEO 分析客户端插件
│   ├── router/
│   │   └── index.js                # 路由配置（含动态 SEO meta）
│   ├── stores/
│   │   └── useGameStore.js         # 游戏成绩状态管理
│   ├── utils/
│   │   ├── helpers.js              # 通用工具函数
│   │   └── saveImage.js            # 截图保存工具
│   ├── views/
│   │   ├── classic/                # 经典益智游戏
│   │   ├── edu/                    # 趣味早教游戏
│   │   ├── fun/                    # 趣味测试
│   │   └── Home.vue                # 首页
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 设计理念

- **寓教于乐**：将学习内容融入游戏机制，让孩子在玩中学
- **渐进难度**：从简单到困难，适应不同年龄段和能力水平
- **视觉友好**：使用柔和配色和圆润设计，适合儿童使用
- **即时反馈**：答题即时反馈对错，增强学习效果
- **自由定制**：支持自定义题目和数量，满足个性化学习需求
- **趣味娱乐**：牛马测试和算命运势仅供娱乐，轻松有趣

## 许可证

Apache License 2.0

---

<p align="center">
  <a href="https://github.com/dkbnull">
    <img src="https://img.shields.io/badge/Author-null-42b883?style=flat-square">
  </a>
</p>
