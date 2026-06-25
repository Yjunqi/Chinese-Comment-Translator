import * as vscode from 'vscode';
import { ParserFactory, BaseParser, CommentInfo } from '../parsers';
import { getTranslationService } from '../services/translationService';

/**
 * 翻译命令处理器
 */
export class TranslateCommand {
    /**
     * 执行翻译命令
     */
    async execute(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        const languageId = document.languageId;

        // 检查语言支持
        const parser = ParserFactory.createParser(languageId);
        if (!parser) {
            const supported = ParserFactory.getSupportedLanguages().join(', ');
            vscode.window.showWarningMessage(
                `Language "${languageId}" is not supported. Supported languages: ${supported}`
            );
            return;
        }

        // 检查是否有选中文本
        const selection = editor.selection;
        const hasSelection = !selection.isEmpty;

        // 提取注释
        const comments = parser.extractComments(
            document,
            hasSelection ? selection : undefined
        );

        // 过滤出包含中文的注释
        const chineseComments = comments.filter(c => BaseParser.containsChinese(c.text));

        if (chineseComments.length === 0) {
            vscode.window.showInformationMessage(
                hasSelection
                    ? 'No Chinese comments found in selection.'
                    : 'No Chinese comments found in this file.'
            );
            return;
        }

        // 执行翻译
        await this.translateComments(editor, chineseComments);
    }

    /**
     * 翻译注释列表
     */
    private async translateComments(
        editor: vscode.TextEditor,
        comments: CommentInfo[]
    ): Promise<void> {
        const config = vscode.workspace.getConfiguration('chineseCommentTranslator');
        const keepOriginal = config.get<boolean>('keepOriginalComment', false);
        const delay = config.get<number>('translationDelay', 300);

        const translationService = getTranslationService();
        const total = comments.length;
        let successCount = 0;
        let failCount = 0;

        // 显示进度
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Translating comments',
                cancellable: false
            },
            async (progress) => {
                // 从后往前翻译，避免位置偏移问题
                const sortedComments = [...comments].reverse();

                for (let i = 0; i < sortedComments.length; i++) {
                    const comment = sortedComments[i];
                    const current = i + 1;

                    progress.report({
                        message: `(${current}/${total})`,
                        increment: (100 / total)
                    });

                    try {
                        // 翻译注释内容
                        const translatedContent = await translationService.translate(comment.content);
                        const translatedComment = this.formatTranslatedComment(
                            translatedContent,
                            comment,
                            keepOriginal
                        );

                        // 应用编辑
                        await editor.edit(editBuilder => {
                            editBuilder.replace(comment.range, translatedComment);
                        });

                        successCount++;

                        // 添加延迟避免 API 限流
                        if (i < sortedComments.length - 1) {
                            await this.sleep(delay);
                        }
                    } catch (error) {
                        console.error('Translation failed:', error);
                        failCount++;
                    }
                }
            }
        );

        // 显示结果
        if (failCount === 0) {
            vscode.window.showInformationMessage(
                `Successfully translated ${successCount} comment(s).`
            );
        } else {
            vscode.window.showWarningMessage(
                `Translated ${successCount} comment(s), ${failCount} failed.`
            );
        }
    }

    /**
     * 格式化翻译后的注释
     */
    private formatTranslatedComment(
        translatedContent: string,
        original: CommentInfo,
        keepOriginal: boolean
    ): string {
        let result = '';

        if (keepOriginal) {
            // 在翻译结果上方添加原始注释
            result = original.text + '\n';
        }

        // 根据注释类型格式化
        if (original.type === 'single-line') {
            result += `${original.prefix} ${translatedContent}`;
        } else if (original.type === 'doc') {
            // JSDoc 风格
            const lines = translatedContent.split('\n');
            if (lines.length === 1) {
                result += `/** ${translatedContent} */`;
            } else {
                const formattedLines = lines.map(line => ` * ${line}`).join('\n');
                result += `/**\n${formattedLines}\n */`;
            }
        } else {
            // 多行注释
            const lines = translatedContent.split('\n');
            if (lines.length === 1) {
                result += `/* ${translatedContent} */`;
            } else {
                result += `/* ${lines.join('\n')} */`;
            }
        }

        return result;
    }

    /**
     * 延迟函数
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
