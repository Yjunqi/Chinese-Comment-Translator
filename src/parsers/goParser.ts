import { BaseParser } from './baseParser';

/**
 * Go 注释解析器
 */
export class GoParser extends BaseParser {
    getLanguageId(): string {
        return 'go';
    }

    protected getCommentPatterns() {
        return [
            // 文档注释 /** */
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
