import * as fs from 'fs';
import { sep } from 'path';
import * as vscode from 'vscode';

function show(ob: any) {
    vscode.window.showInformationMessage(JSON.stringify(ob, null, 2));
}

function withoutExtension(filename: string | undefined): string {
    const parts = filename!.split('.');
    parts.pop();
    return parts.join('.');
}

function replaceExtension(filename: string, extension: string): string {
    const fn = withoutExtension(
        filename
    );
    return `${fn}${extension}`;
}

function getActiveFilename(): string | undefined {
    return vscode.window.activeTextEditor?.document.fileName;
}

function findFilename(fullPath: string): string {
    return fullPath.split(sep).pop()!;
}

const createFile = vscode.commands.registerCommand('bigisle.createFile', () => {
    const config = vscode.workspace.getConfiguration('bigisle');
    const exts = config.get<string[]>('createFile.extensions')!;

    const qp = vscode.window.createQuickPick();
    qp.items = exts.map((ext) => ({ label: ext }));
    qp.onDidChangeSelection(([{ label }]) => {
        const activeFilename = getActiveFilename();
        if (activeFilename === undefined) {
            show('No active filename found.');
        } else {
            const newFn = replaceExtension(activeFilename, label);
            if (fs.existsSync(newFn)) {
                show(`File already exists: ${findFilename(newFn)}`);
            } else {
                fs.writeFileSync(newFn, '');
            }
        }
        qp.dispose();
    });
    qp.onDidHide(() => qp.dispose());
    qp.show();
});

export default createFile;
