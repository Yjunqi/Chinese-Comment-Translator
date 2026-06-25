import { BaseParser } from './baseParser';

/**
 * C/C++ 注释解析器
 */
export class CppParser extends BaseParser {
    getLanguageId(): string {
        return 'cpp';
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

/**
 * C 注释解析器（继承 C++ 解析器）
 */
export class CParser extends CppParser {
    getLanguageId(): string {
        return 'c';
    }
}
