import * as vscode from 'vscode';
import createFile from './commands/create-file';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(createFile);
}

export function deactivate() {}
