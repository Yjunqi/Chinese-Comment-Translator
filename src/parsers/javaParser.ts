import { BaseParser } from './baseParser';

/**
 * Java 注释解析器
 */
export class JavaParser extends BaseParser {
    getLanguageId(): string {
        return 'java';
    }

    protected getCommentPatterns() {
        return [
            // Javadoc 注释 /** */
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
