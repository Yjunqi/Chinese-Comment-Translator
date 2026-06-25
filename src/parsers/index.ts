import { BaseParser, CommentInfo } from './baseParser';
import { JavaScriptParser, TypeScriptParser } from './javascriptParser';
import { PythonParser } from './pythonParser';
import { JavaParser } from './javaParser';
import { CppParser, CParser } from './cppParser';
import { GoParser } from './goParser';

// 重新导出 CommentInfo 供外部使用
export { CommentInfo } from './baseParser';

/**
 * 解析器创建函数类型
 */
type ParserCreator = () => BaseParser;

/**
 * 支持的语言映射
 */
const languageParsers = new Map<string, ParserCreator>([
    ['javascript', () => new JavaScriptParser()],
    ['javascriptreact', () => new JavaScriptParser()],
    ['typescript', () => new TypeScriptParser()],
    ['typescriptreact', () => new TypeScriptParser()],
    ['python', () => new PythonParser()],
    ['java', () => new JavaParser()],
    ['c', () => new CParser()],
    ['cpp', () => new CppParser()],
    ['go', () => new GoParser()]
]);

/**
 * 解析器工厂
 */
export class ParserFactory {
    /**
     * 根据语言 ID 创建解析器
     * @param languageId 语言 ID
     * @returns 解析器实例，如果不支持则返回 null
     */
    static createParser(languageId: string): BaseParser | null {
        const factory = languageParsers.get(languageId);
        return factory ? factory() : null;
    }

    /**
     * 检查是否支持指定语言
     * @param languageId 语言 ID
     */
    static isLanguageSupported(languageId: string): boolean {
        return languageParsers.has(languageId);
    }

    /**
     * 获取所有支持的语言 ID
     */
    static getSupportedLanguages(): string[] {
        return Array.from(languageParsers.keys());
    }
}

// 导出所有解析器
export { BaseParser } from './baseParser';
export { JavaScriptParser, TypeScriptParser } from './javascriptParser';
export { PythonParser } from './pythonParser';
export { JavaParser } from './javaParser';
export { CppParser, CParser } from './cppParser';
export { GoParser } from './goParser';
