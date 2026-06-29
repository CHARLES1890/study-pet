# 伴学桌宠 (Study Buddy Desktop Pet)

一个轻量、可爱的桌面学习陪伴小工具。桌宠常驻在屏幕角落，提供专注计时、待办清单、提醒、励志语录和数据统计等功能，帮助学生更专注地学习，同时保持桌面简洁不打扰。

## 功能特性

- 桌宠互动：点击桌宠打开/关闭功能面板，右键可上传自定义桌宠图片。
- 专注计时：番茄钟式专注计时，记录每一次专注时长。
- 待办清单：管理学习任务，完成后标记并查看进度。
- 提醒事项：设置学习提醒（如喝水、休息、上课提醒），到点弹出系统通知。
- 励志语录：内置多条励志语录，支持自定义添加，点击桌宠随机显示鼓励语。
- 数据统计：查看专注次数、时长和待办完成率。
- 个性化：可设置桌宠名称、窗口透明度、窗口置顶。
- 数据持久化：所有数据通过本地 JSON 文件保存，自动备份恢复。
- 系统托盘：最小化到系统托盘，右键快速显示/隐藏/设置/退出。
- 系统通知：通过 Tauri 系统通知发送提醒。

## 技术栈

- 前端：React 18 + TypeScript + Vite
- 桌面端：Tauri v2 (Rust)
- 样式：CSS
- 图标：Python Pillow 生成

## 安装依赖

请确保已安装以下环境：

- Node.js 18+
- Rust 工具链（cargo 1.80+）
- Python 3.x + Pillow（用于生成图标，可选）

然后执行：

```bash
cd study-pet
npm install
```

> 首次安装会下载 Tauri CLI 和相关 Rust 依赖，可能需要几分钟。

## 启动方式

### 开发预览

```bash
npm run tauri dev
```

启动后桌宠窗口会出现在屏幕中央，前端 dev server 运行在 `http://localhost:1420`。

### 构建安装包

```bash
npm run tauri build
```

构建成功后，Windows 安装包位于：

```
src-tauri/target/release/bundle/nsis/伴学桌宠_1.0.0_x64-setup.exe   (NSIS 安装程序)
src-tauri/target/release/bundle/msi/伴学桌宠_1.0.0_x64_zh-CN.msi     (MSI 安装包)
```

> MSI 打包使用简体中文 locale（codepage 936），配置文件位于 `src-tauri/wix/zh-cn.wxl`。

macOS 安装包位于：

```
src-tauri/target/release/bundle/macos/伴学桌宠.app
src-tauri/target/release/bundle/dmg/伴学桌宠_1.0.0_x64.dmg
```

Linux 安装包位于：

```
src-tauri/target/release/bundle/appimage/伴学桌宠_1.0.0_x64.AppImage
src-tauri/target/release/bundle/deb/伴学桌宠_1.0.0_amd64.deb
```

## 项目结构

```
study-pet/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── App.tsx                 # 主应用入口
│   ├── App.css                 # 全局样式
│   ├── main.tsx                # React 渲染入口
│   ├── types.ts                # 类型定义
│   ├── utils/
│   │   ├── defaultData.ts      # 默认数据
│   │   └── storage.ts          # Tauri 命令封装
│   ├── hooks/
│   │   └── useStorage.ts       # 自动持久化 hook
│   └── components/
│       ├── Pet.tsx             # 桌宠组件
│       ├── SettingsPanel.tsx   # 设置面板
│       ├── Timer.tsx           # 专注计时器
│       ├── TodoList.tsx        # 待办清单
│       ├── Reminders.tsx       # 提醒管理
│       ├── Quotes.tsx          # 语录管理
│       └── Stats.tsx           # 数据统计
├── src-tauri/
│   ├── Cargo.toml              # Rust 依赖
│   ├── tauri.conf.json         # Tauri 配置
│   ├── capabilities/default.json # 权限配置
│   ├── build.rs
│   ├── src/
│   │   ├── lib.rs              # 应用入口、托盘、提醒调度
│   │   ├── commands.rs         # 前端可调用的 Rust 命令
│   │   └── tray.rs             # 系统托盘逻辑
│   ├── wix/
│   │   └── zh-cn.wxl           # WiX 中文 locale（codepage 936）
│   └── icons/                  # 应用图标
└── scripts/
    └── generate-icons.py       # 图标生成脚本
```

## 数据存储

应用数据保存在本地应用数据目录下：

- Windows: `%APPDATA%/com.studypet.app/data.json`
- macOS: `~/Library/Application Support/com.studypet.app/data.json`
- Linux: `~/.local/share/com.studypet.app/data.json`

备份文件默认保存到用户桌面：`%USERPROFILE%/Desktop/studypet-backup.json`。

## 备份与恢复

在“设置”面板中点击：

- **备份数据**：将当前数据导出到桌面备份文件。
- **恢复数据**：从桌面备份文件恢复数据。

## 自定义桌宠形象

右键点击桌宠 → 选择“上传桌宠形象”，选择 PNG/JPG 图片即可替换。图片路径会保存在本地配置中。

## 兼容性

- 已在 Windows 10/11 上测试构建与运行。
- macOS 和 Linux 同样可构建，部分系统通知和托盘行为可能因平台略有差异。

## 后续优化点

- 支持音效与动画反馈，增强陪伴感。
- 增加更多桌宠皮肤与动态表情。
- 支持学习白名单/应用屏蔽，提升专注体验。
- 接入日历/课程表，自动生成提醒。
- 支持插件扩展主题与计时器样式。
- 增加多语言支持（i18n）。
- 优化打包体积，提供自动更新能力。

## 许可

MIT License — 仅供学习交流使用。
