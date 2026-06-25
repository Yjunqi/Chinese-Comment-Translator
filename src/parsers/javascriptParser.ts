import { BaseParser } from './baseParser';

/**
 * JavaScript/TypeScript 注释解析器
 */
export class JavaScriptParser extends BaseParser {
    getLanguageId(): string {
        return 'javascript';
    }

    protected getCommentPatterns() {
        return [
            // JSDoc 注释 /** */
            {
                pattern: /\/\*\*[\s\S]*?\*\//g,
                type: 'doc' as const,
                prefix: '/**',
                suffix: '*/'
            },
            // 多行注释 /* */
            {
                pattern: /\/\*[\s\S]*?\*\//g,
                type: 'multi-line' as const,
                prefix: '/*',
                suffix: '*/'
            },
            // 单行注释 //
            {
                pattern: /\/\/.*$/gm,
                type: 'single-line' as const,
                prefix: '//',
                suffix: ''
            }
        ];
    }
}

/**
 * TypeScript 注释解析器（继承 JavaScript 解析器）
 */
export class TypeScriptParser extends JavaScriptParser {
    getLanguageId(): string {
        return 'typescript';
    }
}
