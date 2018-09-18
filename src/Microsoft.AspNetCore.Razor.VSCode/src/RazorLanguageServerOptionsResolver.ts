/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { Trace } from 'vscode-jsonrpc';
import { RazorLanguage } from './RazorLanguage';
import { RazorLanguageServerOptions } from './RazorLanguageServerOptions';

export function resolveRazorLanguageServerOptions(languageServerDir: string) {
    const languageServerExecutablePath = findLanguageServerExecutable(languageServerDir);
    const debugLanguageServer = RazorLanguage.serverConfig.get<boolean>('debug');
    const outputChannel = vscode.window.createOutputChannel('Razor Language Server');
    const traceString = RazorLanguage.serverConfig.get<string>('trace');

    return {
        serverDllPath: languageServerExecutablePath,
        debug: debugLanguageServer,
        outputChannel,
        trace: parseTraceString(traceString),
    } as RazorLanguageServerOptions;
}

function parseTraceString(traceString: string | undefined) {
    switch (traceString) {
        case 'Off':
            return Trace.Off;
        case 'Messages':
            return Trace.Messages;
        case 'Verbose':
            return Trace.Verbose;
        default:
            console.log('Invalid trace setting for Razor language server. Defaulting to \'Off\'');
            return Trace.Off;
    }
}

function findLanguageServerExecutable(withinDir: string) {
    const extension = isWindows() ? '.exe' : '';
    const fullPath = path.join(
        withinDir,
        `Microsoft.AspNetCore.Razor.LanguageServer${extension}`);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Could not find Razor Language Server executable at ${fullPath}`);
    }

    return fullPath;
}

function isWindows() {
    return !!os.platform().match(/^win/);
}