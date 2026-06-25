# Chinese Comment Translator

一个 VS Code 扩展，通过快捷键将代码中的中文注释自动翻译成英文。

## 功能特性

- 🚀 **快捷键触发**: 按 `Ctrl+Shift+T` (Windows/Linux) 或 `Cmd+Shift+T` (macOS) 即可翻译
- 🌐 **免费翻译**: 使用 MyMemory 免费翻译 API，无需配置 API key
- 📝 **多语言支持**: 支持 JavaScript/TypeScript、Python、Java、C/C++、Go
- ✂️ **智能选择**: 有选中文本时只翻译选中区域，否则翻译整个文件
- ⚡ **批量处理**: 一次性翻译文件中所有中文注释

## 使用方法

1. 打开包含中文注释的代码文件
2. （可选）选中要翻译的代码区域
3. 按 `Ctrl+Shift+T` (Windows/Linux) 或 `Cmd+Shift+T` (macOS)
4. 等待翻译完成，注释将自动替换为英文

## 示例

**翻译前:**
```javascript
// 这是一个示例函数
function hello() {
    /* 这是多行注释
       用于说明函数的功能 */
    return "Hello World";
}
```

**翻译后:**
```javascript
// This is an example function
function hello() {
    /* This is a multi-line comment
       Used to explain the function's functionality */
    return "Hello World";
}
```

## 配置选项

在 VS Code 设置中搜索 "Chinese Comment Translator" 可以配置以下选项:

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `keepOriginalComment` | 是否保留原始中文注释 | `false` |
| `translationDelay` | 翻译间隔时间(毫秒)，避免API限流 | `300` |

## 支持的语言

| 语言 | 文件扩展名 |
|------|-----------|
| JavaScript | .js, .jsx |
| TypeScript | .ts, .tsx |
| Python | .py |
| Java | .java |
| C | .c, .h |
| C++ | .cpp, .hpp, .cc |
| Go | .go |

## 开发和调试

### 前置要求
- Node.js 18+
- VS Code 1.85+

### 本地开发

```bash
# 进入项目目录
cd chinese-comment-translator

# 安装依赖
npm install

# 编译
npm run compile

# 按 F5 启动调试，会打开一个新的 VS Code 窗口
```

### 打包发布

```bash
# 安装 vsce 工具
npm install -g @vscode/vsce

# 打包为 .vsix 文件
vsce package

# 本地安装测试
code --install-extension chinese-comment-translator-1.0.0.vsix
```

## 注意事项

- MyMemory 免费版每天有 10,000 字符的限制，对于日常使用通常足够
- 翻译大文件时请耐心等待，扩展会在翻译过程中显示进度
- 如果翻译失败，请检查网络连接后重试

## 许可证

MIT License

## 反馈和贡献

如有问题或建议，欢迎提交 Issue 或 Pull Request。
