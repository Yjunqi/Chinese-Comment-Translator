import * as vscode from 'vscode';
import { TranslateCommand } from './commands/translateCommand';

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Chinese Comment Translator extension is now active!');

    // 创建翻译命令实例
    const translateCommand = new TranslateCommand();

    // 注册翻译命令
    const disposable = vscode.commands.registerCommand(
        'chineseCommentTranslator.translate',
        () => translateCommand.execute()
    );

    context.subscriptions.push(disposable);
}

/**
 * 扩展停用时调用
 */
export function deactivate() {
    console.log('Chinese Comment Translator extension is now deactivated.');
}
