# dsh-clean-ui · DSH 简洁与优化界面

> A small, opinionated **client-side theme plugin** for the DeepSeek Harness (DSH) Web GUI:
> tighter conversation chrome, calmer typography, a hover-driven tab indicator, and a
> configurable composer status row — with **presets** for the stock look, the author's look,
> or your own tuning.

[中文说明](#中文说明) · [English](#english)

> **Status: 0.2.x beta.** Built and tested against DSH `0.2.1-rc.3` on Windows. It is a
> DOM-level theme, so a host redesign can break individual features silently. Read
> [兼容性](#兼容性) before installing.

![Header tabs with the thin 2px indicator](docs/header.png)

---

## 中文说明

这是一个**纯前端**的 DSH 插件：宿主半边是空函数，所有效果都在 `lib/client.js` 里，通过一个
`<style>` 标签 + 若干次受控的 DOM 调整实现。没有依赖、没有构建步骤，也不发网络请求。

### 它做了什么

**预设**

- **默认外观**：插件完全不动样式，只保留 `Ctrl+Alt+L` 面板——相当于"恢复用户原来的样子"
- **作者预设**：作者调过的一整套参数（42px 顶栏、1.65 行高、370 字重、980px 正文列等）
- **自定义**：你在面板里拖出来的参数；拖任意滑块后自动归到这里
- 切换预设会刷新一次页面（见[已知限制](#已知限制)）

**排版**

- 对话正文行高、正文字重、标题字重、加粗字重都可调（默认 1.75 / 350 / 500 / 500）
- 段落/列表间距放宽

**顶部栏**

- 高度压到 50px，去掉底部分界线，改用 `mask-image` 让内容在顶沿渐隐（深浅色通用）
- 视图 tab 平时隐藏，鼠标移入 header 才浮现（淡入 + 上浮 6px）
- 当前 tab 用一条 **2px** 圆角蓝条指示：从中间伸长、在 tab 间滑动、移开时缩回
- tab 水平垂直居中；窗口变窄到会和标题碰撞时自动淡出（按实测像素判定，不是固定断点）
- 右上角五个工具按钮（`文件资源管理器（含更多打开方式）`、`更多操作`、`打开右侧边栏`、
  `展开底部面板`、`上下文诊断`）可**逐项**勾选显示/隐藏，像底部状态行一样
- 隐藏「更多会话视图」按钮、rc.3 新增的侧栏「更多」项

> **tab 来源**：`对话` / `轨迹` 由 DSH 自带；`上下文` / `编队` 是 **`dsh-context`** 插件注册的。
> 本插件只负责把整条 tab 条隐藏/浮现，不区分 tab 来自哪个插件；没装 `dsh-context` 时自然只会看到前两个。

**侧栏 / 输入区**

- 左侧栏文字统一 16px（导航、工作区、会话标题、时间戳）
- 输入框底部的状态行（tok/s、缓存命中、上下文占比）可以整行隐藏，也可以只保留其中任意几项
- 显示状态行时，它上下留白由**一个**参数控制并保持对称；隐藏时用另一个参数控制输入卡到底部的距离
- 对话正文列可调宽（最大宽度 + 占父宽比例）
- **输入框与正文同宽**：输入卡的最大宽度跟随正文列实时测量，两者边缘对齐；可在面板里关掉

### 安装

```sh
# 需要先按 DSH 的插件方式安装
dsh plugin --profile desktop add github:Sumnyte/dsh-clean-ui
```

或本地链接安装（改代码即时生效，但**需要重启 DSH**）：

```sh
dsh plugin --profile desktop add link:<本仓库绝对路径>
```

> **重要**：客户端插件在 **DSH 启动时构建**。装完/更新后请**完全退出 DSH（含托盘）再打开**。
> 版本、平台与已验证的宿主组合见[兼容性](#兼容性)。

### 卸载

```sh
dsh plugin --profile desktop remove dsh-clean-ui
```

### 可调参数（CONFIG）

所有开关集中在 `lib/client.js` 顶部的 `CONFIG` 对象里，改完重启 DSH 生效：

```js
var CONFIG = {
  preset: "custom",          // "stock" | "author" | "custom"

  lineHeight: 1.75,          // 正文行高
  bodyWeight: 350,           // 正文/列表/表格字重
  headingWeight: 500,        // 标题字重（默认 700）
  strongWeight: 500,         // 加粗字重

  headerHeight: 50,          // 顶部栏高度 px
  titleSize: 17,             // 会话标题字号 px
  headerPaddingTop: 14,      // 顶部栏内容整体下移 px
  tabOffsetY: 8,             // tab 条额外垂直微调 px

  tabFontSize: 14,           // tab 字号 px
  tabColor: "#5b6169",       // tab 常态颜色
  barHeight: 2,              // 滑动指示条高度 px
  tabRise: 6,                // 浮现时上浮距离 px
  modeFontSize: 14,          // 模式徽章字号 px

  sidebarFontSize: 16,       // 左侧栏字号 px

  columnMaxWidth: 1400,      // 正文列最大宽度 px
  columnRatio: 0.96,         // 正文列占父宽比例

  featherStart: -16,         // 顶沿羽化：相对 header 底边的起点 px
  featherEnd: 46,            // 羽化终点 px

  composerGap: 8,            // 隐藏状态行时：输入卡到底部的留白 px
  statsRowGap: 12,           // 显示状态行时：它上下的对称留白 px
  composerHeight: 72,        // 输入区最小高度 px

  /* 底部状态行：features.hideStats = true 时整行隐藏；否则只显示
     stats 里勾选的项，三项全不选也等于隐藏整行。 */
  stats: { speed: true, cache: true, context: true },

  /* 右上角五个工具按钮：true = 显示，false = 隐藏 */
  topButtons: { explorer: true, more: true, sidebar: true, bottomPanel: true, diagnostics: true },

  features: {
    hoverTabs: true,         // 平时隐藏 tab，悬停 header 才浮现
    hideOnCollision: true,   // 与标题将碰撞时淡出 tab
    feather: true,           // 顶沿羽化
    widerColumn: true,       // 加宽正文列
    sidebarFont: true,       // 放大侧栏字号
    hideStats: true,         // 隐藏整行底部状态行
    hidePtcChip: true,       // 隐藏「PTC 模式」「创造模式」「标准模式」等徽章
    hideViewMore: true,      // 隐藏会话视图「更多」
    hideMoreNav: true,       // 隐藏 rc.3 侧栏「更多」
    composerWidth: true      // 输入卡与正文列同宽
  }
};
```

不想要某个效果，把对应的 `features` 开关设成 `false` 即可；想调数值就改上面的常量。

常用开关不必改代码：在 GUI 里按 **`Ctrl+Alt+L`** 打开浮动面板，拖动滑块 / 勾选复选框即时生效；
配置保存在本机 `localStorage`。面板顶部是**预设**行：

- **默认外观** —— 插件不做任何改动（只保留这个面板），等于安装前的 DSH
- **作者预设** —— 作者调过的一整套参数（42px 顶栏、1.65 行高、370 字重、980px 正文列……）
- **自定义** —— 你自己的参数；拖动任意滑块后会自动归到这里

切换预设会刷新页面，因为只有重载才能干净地撤掉已经写进 DOM 的内联样式。状态行那一段是：

- ☑ 隐藏整行 —— 勾上就整行隐藏（作者预设默认隐藏）
- 不隐藏时显示：`输出速度 tok/s`、`缓存命中率`、`上下文占比`，任选若干项；
  三项全部不勾等于隐藏整行
- 状态行上下留白 —— 显示状态行时的单参数滑块：它上面（与输入卡之间）和下面（到窗口底）
  的留白保持相等（默认 12px，可 0–40）
- 隐藏时下留白 —— 隐藏状态行时输入卡到底部的距离（默认 8px，可 0–30）
- 输入框高度 —— 发送框输入区的最小高度（默认 72px，可 36–160）；调大后输入卡会变高
- 隐藏模式徽章 —— 隐藏「PTC 模式」「创造模式」「标准模式」等徽章；取消勾选即显示

**顶部按钮**那一段是逐项开关（勾选 = 显示）：

- `文件资源管理器（含更多打开方式）`、`更多操作`、`打开右侧边栏`、`展开底部面板`、`上下文诊断`
- 全部可以只留其中几个；隐藏「打开右侧边栏」后，仍可用 `Ctrl+Alt+L` 打开面板把它勾回来
- 这五个就是会话标题右侧那一排按钮；右侧栏自己的 `分栏` / `全屏` / `收起` 不在这组里，别混淆

### 兼容性

- **已验证**：DSH `0.2.1-rc.3`（Electron 44）/ Windows 11 / 浅色 + 深色主题；同时启用
  `dsh-ops`、`dshmarket`、`dsh-better-sidebar`、`dsh-context`、`wallpaper-engine` 做过联调
- **未验证**：其它 DSH 版本、macOS、Linux、英文/其它语言界面
- 插件靠宿主 DOM 工作：`data-slot`、`data-composer-*`、`data-conversation-*` 等属性，
  以及 `_markdown_`、`headerActions`、`headerUtilities`、`_split` 等类名后缀。宿主改结构或改文案时，
  对应功能可能**静默失效**（不会报错，也不会卡住页面）
- 顶部五个按钮（含文件夹 / 更多打开方式）按**中文可访问名**匹配；非中文界面可能不生效
- 状态行依赖宿主的两块统计（`activity` / `usage`）和末尾的上下文占用环；宿主调整统计结构时会失效

### 已知限制

- 切换预设、以及"恢复默认"会**刷新页面**；这是移除内联样式最可靠的方式
- 中途禁用插件不会自动撤销已经写进 DOM 的内联样式，需要刷新页面/重启后才会恢复宿主原样
- 「标准模式」徽章和某些 tab 悬停底色由宿主自己的渲染层绘制，**不在页面 DOM 内**，插件无法隐藏
- 浮动面板只覆盖常用项；其余常量仍需改 `lib/client.js` 后重启
- 侧栏「更多」由 `features.hideMoreNav` 控制（默认开，不在面板里；作者预设为关闭）
- 面板文案目前只有中文

### 安全说明

插件只做两件事：注入一个 `<style>` 标签、设置元素的内联样式与少量元素显隐。
**不读取、不上传任何会话内容**，不发起网络请求。

---

## English

A client-only DSH plugin that restyles the Web GUI conversation chrome: compact 50px header,
hover-revealed view tabs with a thin 2px sliding indicator, feathered top edge, calmer markdown
typography, a transcript column with a matching composer width, 16px sidebar labels, a selectable
composer status row and per-button header utilities — with **presets** for the stock look, the
author's look, or your own tuning.

**Status: 0.2.x beta.** Built and tested against DSH `0.2.1-rc.3` on Windows only. This is a
DOM-level theme; a host redesign can break individual features silently.

**Presets** (panel: `Ctrl+Alt+L`)

- **默认外观 / Stock** — the plugin does nothing (panel only); this is the pre-install DSH look
- **作者预设 / Author** — the tuned snapshot the plugin was built with (42px header, 1.65 line
  height, 370 body weight, 980px transcript, 72px composer input, etc.)
- **自定义 / Custom** — your own values; moving any slider switches to this
- Switching presets reloads the page: only a reload removes every inline tweak cleanly

**Header, tabs and composer**

- The five top-right utilities — `文件资源管理器（含更多打开方式）`, `更多操作`,
  `打开右侧边栏`, `展开底部面板`, `上下文诊断` — each have a show/hide checkbox in the panel.
  The right sidebar's own `分栏` / `全屏` / `收起` are not part of this group.
- Tabs: `对话` / `轨迹` are DSH's own; `上下文` / `编队` are registered by **`dsh-context`**.
  The hover-hide applies to the whole strip, third-party tabs included; without dsh-context only
  the first two exist.
- The composer card is measured against the transcript column and kept at the same width; the
  panel has an "输入框与正文同宽" toggle.
- The composer input's minimum height is tunable in the panel ("输入框高度", 36–160px, default 72).
- Mode badges (`PTC 模式`, `创造模式`, `标准模式`) can be hidden or shown with "隐藏模式徽章".
- The tab indicator is 2px (tunable via `barHeight`).

**Install**

```sh
dsh plugin --profile desktop add github:Sumnyte/dsh-clean-ui
```

**Restart DSH fully** (tray → quit) after installing or editing — client plugins are bundled at startup.

**Uninstall**

```sh
dsh plugin --profile desktop remove dsh-clean-ui
```

**Compatibility and limits**

- Verified: DSH `0.2.1-rc.3` (Electron 44) / Windows 11 / light and dark themes, together with
  `dsh-ops`, `dshmarket`, `dsh-better-sidebar`, `dsh-context` and `wallpaper-engine`.
- Not verified: other DSH versions, macOS, Linux, non-Chinese UI.
- The theme relies on host DOM attributes (`data-slot`, `data-composer-*`, `data-conversation-*`)
  and a few class-name suffixes (`_markdown_`, `headerActions`, `headerUtilities`, `_split`).
  When the host changes structure or copy, features can stop silently (no errors, no freeze).
- Several hide rules match **Chinese accessible names**, so they may not apply in other locales.
- Disabling the plugin mid-session does not undo the inline tweaks it already wrote; reload/restart
  to get the host look back. The **Stock** preset is the supported way to do that.
- Some host-rendered chrome (the "standard mode" badge, tab hover pill) lives outside the page DOM
  and cannot be hidden from a plugin.
- The panel copy is Chinese-only for now.

**Privacy:** injects one `<style>` tag and toggles inline styles only — no network access, no
conversation data is read or uploaded.

MIT Licensed.
