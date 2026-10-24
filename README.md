# dsh-line-height

> A small, opinionated **client-side theme plugin** for the DeepSeek Harness (DSH) Web GUI:
> tighter conversation chrome, calmer typography, and a hover-driven tab indicator.

[中文说明](#中文说明) · [English](#english)

---

## 中文说明

这是一个**纯前端**的 DSH 插件：宿主半边是空函数，所有效果都在 `lib/client.js` 里，通过一个
`<style>` 标签 + 若干次受控的 DOM 调整实现。

### 它做了什么

**排版**

- 对话正文 `line-height: 1.75`，段落/列表间距放宽
- 正文 350 字重、标题与加粗 500 字重（默认 700 在 MiSans/思源系中偏"糊"）

**顶部栏**

- 高度压到 50px，去掉底部分界线，改用 `mask-image` 让内容在顶沿渐隐（深浅色通用）
- 四个视图 tab 平时隐藏，鼠标移入 header 才浮现（淡入 + 上浮 6px）
- 当前 tab 用一条 4px 圆角蓝条指示：从中间伸长、在 tab 间滑动、移开时缩回
- 四个 tab 水平垂直居中；窗口变窄到会和标题碰撞时自动淡出（按实测像素判定，不是固定断点）
- 隐藏「更多会话视图」按钮、rc.3 新增的侧栏「更多」项、「展开底部面板」「上下文诊断」两个按钮

**侧栏 / 输入区**

- 左侧栏文字统一 16px（导航、工作区、会话标题、时间戳）
- 隐藏输入框底部的 tok/s / 缓存命中 / 上下文百分比状态行
- 输入卡下方留 18px 间距
- 对话正文列加宽到 `min(1400px, 父宽 × 0.96)`

### 安装

```sh
dsh plugin --profile desktop add github:<你的用户名>/dsh-line-height
```

或本地链接安装（改代码即时生效，但**需要重启 DSH**）：

```sh
dsh plugin --profile desktop add link:<本仓库绝对路径>
```

> **重要**：客户端插件在 **DSH 启动时构建**。改完代码必须**完全退出 DSH（含托盘）再打开**，
> `Ctrl+Shift+R` 只能偶尔生效。

### 卸载

```sh
dsh plugin --profile desktop remove dsh-line-height
```

### 可调参数

所有值都写死在 `lib/client.js` 里，搜索对应函数即可：

| 想改什么 | 位置 | 默认值 |
|---|---|---|
| 侧栏字号 | `enlargeSidebar()` | `16px` |
| 标题字号 | `enlargeHeaderTitle()` | `17px` |
| 顶部栏内容下移量 | `shiftHeaderContent()` | `padding-top: 14px` |
| tab 垂直微调 | `styleTabs()` | `+ 4` |
| 正文最大宽度 / 比例 | `widenColumn()` | `1400` / `0.96` |
| 顶沿羽化范围 | `ensureTopFade()` | `-16` / `+46` |
| 碰撞判定余量 | `syncTabCollision()` | `stripLeft - 4` |

### 兼容性

- 在 **DSH 0.2.1-rc.3 / Windows / 浅色与深色主题**下开发与验证
- 依赖的是**几何测量**（`getBoundingClientRect` / `Range`）而不是哈希类名，所以小版本升级通常不会失效
- 但如果上游大改 DOM 结构，某些功能可能静默失效（不会报错，也不会卡死）

### 已知限制

- 「标准模式」徽章和某些 tab 悬停底色由宿主自己的渲染层绘制，**不在页面 DOM 内**，插件无法隐藏
- 隐藏行为是"按可访问名/位置"判定的，上游改文案时可能失效
- 没有提供设置界面：所有开关都是代码里的常量

### 安全说明

插件只做两件事：注入一个 `<style>` 标签、设置元素的内联样式与少量元素显隐。
**不读取、不上传任何会话内容**，不发起网络请求。

---

## English

A client-only DSH plugin that restyles the Web GUI conversation chrome: compact 50px header,
hover-revealed view tabs with a sliding indicator strip, feathered top edge, calmer markdown
typography, a wider transcript column, 16px sidebar labels, and a trimmed composer footer.

**Install**

```sh
dsh plugin --profile desktop add github:<you>/dsh-line-height
```

**Restart DSH fully** (tray → quit) after installing or editing — client plugins are bundled at startup.

**Uninstall**

```sh
dsh plugin --profile desktop remove dsh-line-height
```

**Notes**

- Tested on DSH `0.2.1-rc.3` (Windows, light and dark themes).
- Uses geometry-based DOM matching (no hashed class names), so minor updates usually keep working.
- Injects one `<style>` tag and toggles inline styles only — no network access, no conversation data.
- Some host-rendered chrome (the "standard mode" badge, tab hover pill) lives outside the page DOM
  and cannot be hidden from a plugin.

MIT Licensed.
