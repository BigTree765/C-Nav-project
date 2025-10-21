# 项目主页宽度调整方案

## 🎯 当前宽度设置
- 默认最大宽度：1152px (is-max-desktop)
- 宽屏最大宽度：1344px (is-max-widescreen)

## 📏 可选的宽度调整方案

### 方案1：调整现有容器宽度
修改CSS变量值：
```css
--max-width-desktop: 1200px;  /* 增加48px */
--max-width-widescreen: 1400px;  /* 增加56px */
```

### 方案2：使用新的容器类
在HTML中替换容器类：

**更宽显示 (1600px)：**
```html
<div class="container is-ultrawide">
```

**全宽显示：**
```html
<div class="container is-fullwidth">
```

**保持当前宽度但微调：**
```html
<div class="container is-max-desktop">  <!-- 当前1200px -->
```

## 🔧 具体修改步骤

### 步骤1：调整CSS变量（推荐）
修改 `static/css/index.css` 中的变量值：
- `--max-width-desktop: 1200px;` (当前设置)
- `--max-width-widescreen: 1400px;` (当前设置)

### 步骤2：修改HTML容器类
在 `index.html` 中替换相应的容器类：
- 将 `is-max-desktop` 改为 `is-ultrawide` (1600px)
- 将 `is-max-desktop` 改为 `is-fullwidth` (100%宽度)

## 📱 响应式考虑
- 移动端：自动适配屏幕宽度
- 平板端：保持合理的内容宽度
- 桌面端：使用设定的最大宽度

## 🎨 推荐设置
- **学术论文页面**：1200px (当前设置)
- **演示页面**：1400px (is-max-widescreen)
- **全屏展示**：100% (is-fullwidth)
