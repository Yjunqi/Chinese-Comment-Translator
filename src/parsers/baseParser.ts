import * as vscode from 'vscode';

/**
 * 注释信息
 */
export interface CommentInfo {
    /** 注释文本 */
    text: string;
    /** 注释在文档中的范围 */
    range: vscode.Range;
    /** 注释类型 */
    type: 'single-line' | 'multi-line' | 'doc';
    /** 注释前缀（如 //, #, /*） */
    prefix: string;
    /** 注释后缀 */
    suffix: string;
    /** 注释内容（不含前后缀） */
    content: string;
}

/**
 * 注释解析器基类
 */
export abstract class BaseParser {
    /**
     * 获取解析器支持的语言 ID
     */
    abstract getLanguageId(): string;

    /**
     * 提取文档中的所有注释
     * @param document 文档对象
     * @param selection 可选的选中范围
     * @returns 注释信息数组
     */
    extractComments(document: vscode.TextDocument, selection?: vscode.Range): CommentInfo[] {
        const text = selection
            ? document.getText(selection)
            : document.getText();

        const comments: CommentInfo[] = [];
        const patterns = this.getCommentPatterns();

        for (const { pattern, type, prefix, suffix } of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const offset = selection ? document.offsetAt(selection.start) : 0;
                const startPos = document.positionAt(offset + match.index);
                const endPos = document.positionAt(offset + match.index + match[0].length);

                const fullText = match[0];
                const content = this.extractContent(fullText, prefix, suffix);

                comments.push({
                    text: fullText,
                    range: new vscode.Range(startPos, endPos),
                    type,
                    prefix,
                    suffix,
                    content
                });
            }
        }

        return this.sortAndDeduplicate(comments);
    }

    /**
     * 获取注释模式数组
     */
    protected abstract getCommentPatterns(): Array<{
        pattern: RegExp;
        type: 'single-line' | 'multi-line' | 'doc';
        prefix: string;
        suffix: string;
    }>;

    /**
     * 提取注释内容（去除前后缀）
     */
    protected extractContent(fullText: string, prefix: string, suffix: string): string {
        let content = fullText;

        // 移除前缀
        if (prefix && content.startsWith(prefix)) {
            content = content.substring(prefix.length);
        }

        // 移除后缀
        if (suffix && content.endsWith(suffix)) {
            content = content.substring(0, content.length - suffix.length);
        }

        // 清理首尾空白
        content = content.trim();

        // 处理多行注释中的 * 前缀
        if (suffix) {
            content = content.replace(/^\s*\* ?/gm, '');
        }

        return content;
    }

    /**
     * 排序并去重
     */
    private sortAndDeduplicate(comments: CommentInfo[]): CommentInfo[] {
        // 按位置排序
        comments.sort((a, b) => {
            const startCompare = a.range.start.line - b.range.start.line;
            if (startCompare !== 0) {
                return startCompare;
            }
            return a.range.start.character - b.range.start.character;
        });

        // 去重（移除嵌套的注释）
        const result: CommentInfo[] = [];
        for (const comment of comments) {
            const isNested = result.some(existing =>
                existing.range.contains(comment.range)
            );
            if (!isNested) {
                result.push(comment);
            }
        }

        return result;
    }

    /**
     * 检查文本是否包含中文
     */
    static containsChinese(text: string): boolean {
        return /[一-龥]/.test(text);
    }
}
