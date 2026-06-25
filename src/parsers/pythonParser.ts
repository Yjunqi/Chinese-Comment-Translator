import { BaseParser } from './baseParser';

/**
 * Python 注释解析器
 */
export class PythonParser extends BaseParser {
    getLanguageId(): string {
        return 'python';
    }

    protected getCommentPatterns() {
        return [
            // 文档字符串 """ """
            {
                pattern: /"""[\s\S]*?"""/g,
                type: 'doc' as const,
                prefix: '"""',
                suffix: '"""'
            },
            // 文档字符串 ''' '''
            {
                pattern: /'''[\s\S]*?'''/g,
                type: 'doc' as const,
                prefix: "'''",
                suffix: "'''"
            },
            // 单行注释 #
            {
                pattern: /#.*$/gm,
                type: 'single-line' as const,
                prefix: '#',
                suffix: ''
            }
        ];
    }
}
