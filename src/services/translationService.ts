import axios from 'axios';
import * as vscode from 'vscode';

/**
 * 翻译服务接口
 */
export interface ITranslationService {
    translate(text: string): Promise<string>;
}

/**
 * MyMemory 翻译服务实现
 * 免费使用，无需 API key
 * 文档: https://mymemory.translated.net/doc/spec.php
 */
export class MyMemoryService implements ITranslationService {
    private readonly baseUrl = 'https://api.mymemory.translated.net/get';
    private readonly sourceLang = 'zh-CN';
    private readonly targetLang = 'en';

    /**
     * 翻译文本
     * @param text 要翻译的中文文本
     * @returns 翻译后的英文文本
     */
    async translate(text: string): Promise<string> {
        if (!text || !text.trim()) {
            return text;
        }

        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    q: text,
                    langpair: `${this.sourceLang}|${this.targetLang}`
                },
                timeout: 10000
            });

            if (response.data && response.data.responseStatus === 200) {
                return response.data.responseData.translatedText;
            }

            throw new Error(response.data?.responseDetails || 'Translation failed');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Translation request timed out');
                }
                throw new Error(`Translation request failed: ${error.message}`);
            }
            throw error;
        }
    }
}

/**
 * 带重试机制的翻译服务
 */
export class TranslationServiceWithRetry implements ITranslationService {
    private service: ITranslationService;
    private maxRetries: number;
    private delay: number;

    constructor(service: ITranslationService, maxRetries: number = 3, delay: number = 1000) {
        this.service = service;
        this.maxRetries = maxRetries;
        this.delay = delay;
    }

    async translate(text: string): Promise<string> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await this.service.translate(text);
            } catch (error) {
                lastError = error as Error;

                if (attempt < this.maxRetries) {
                    await this.sleep(this.delay * attempt);
                }
            }
        }

        throw lastError || new Error('Translation failed after retries');
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * 获取翻译服务实例
 */
export function getTranslationService(): ITranslationService {
    const baseService = new MyMemoryService();
    return new TranslationServiceWithRetry(baseService, 3, 500);
}
