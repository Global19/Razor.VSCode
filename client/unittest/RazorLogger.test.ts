/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as assert from 'assert';
import { RazorLogger } from 'microsoft.aspnetcore.razor.vscode/dist/RazorLogger';
import { Trace } from 'microsoft.aspnetcore.razor.vscode/dist/Trace';
import { createLogSink as useOutputChannelSink, getFakeVsCodeApi } from './vscodeMock';

describe('Razor Logger', () => {
    function getAndAssertLog(sink: { [logName: string]: string[] }) {
        const log = sink[RazorLogger.logName];
        assert.ok(log);
        assert.ok(log.length > 0);

        return log;
    }

    it('Always logs information header', () => {
        // Arrange
        const vscodeApi = getFakeVsCodeApi();
        const sink = useOutputChannelSink(vscodeApi);

        // Act
        const logger = new RazorLogger(vscodeApi, Trace.Off);

        // Assert
        const log = getAndAssertLog(sink);
        const logContent = log.join('LF');
        assert.ok(logContent.indexOf('currently set to \'Off\'') > 0);
    });

    it('logAlways logs when trace is Off', () => {
        // Arrange
        const vscodeApi = getFakeVsCodeApi();
        const sink = useOutputChannelSink(vscodeApi);
        const logger = new RazorLogger(vscodeApi, Trace.Off);

        // Act
        logger.logAlways('Test');

        // Assert
        const log = getAndAssertLog(sink);
        const lastLog = log[log.length - 1].trim();
        assert.ok(lastLog.endsWith('Test'));
    });

    it('logError logs when trace is Off', () => {
        // Arrange
        const vscodeApi = getFakeVsCodeApi();
        const sink = useOutputChannelSink(vscodeApi);
        const logger = new RazorLogger(vscodeApi, Trace.Off);

        // Act
        logger.logError('Test Error');

        // Assert
        const log = getAndAssertLog(sink);
        const lastLog = log[log.length - 1].trim();
        assert.ok(lastLog.endsWith('Test Error'));
    });

    it('logMessage does not log when trace is Off', () => {
        // Arrange
        const vscodeApi = getFakeVsCodeApi();
        const sink = useOutputChannelSink(vscodeApi);
        const logger = new RazorLogger(vscodeApi, Trace.Off);

        // Act
        logger.logMessage('Test message');

        // Assert
        const log = getAndAssertLog(sink);
        const lastLog = log[log.length - 1].trim();
        assert.ok(lastLog.indexOf('Test message') === -1);
    });

    for (const trace of [Trace.Messages, Trace.Verbose]) {
        it(`logMessage logs when trace is ${Trace[trace]}`, () => {
            // Arrange
            const vscodeApi = getFakeVsCodeApi();
            const sink = useOutputChannelSink(vscodeApi);
            const logger = new RazorLogger(vscodeApi, trace);

            // Act
            logger.logMessage('Test message');

            // Assert
            const log = getAndAssertLog(sink);
            const lastLog = log[log.length - 1].trim();
            assert.ok(lastLog.endsWith('Test message'));
        });
    }

    for (const trace of [Trace.Off, Trace.Messages]) {
        it(`logVerbose does not log when trace is ${Trace[trace]}`, () => {
            // Arrange
            const vscodeApi = getFakeVsCodeApi();
            const sink = useOutputChannelSink(vscodeApi);
            const logger = new RazorLogger(vscodeApi, trace);

            // Act
            logger.logVerbose('Test message');

            // Assert
            const log = getAndAssertLog(sink);
            const lastLog = log[log.length - 1].trim();
            assert.ok(lastLog.indexOf('Test message') === -1);
        });
    }

    it('logVerbose logs when trace is Verbose', () => {
        // Arrange
        const vscodeApi = getFakeVsCodeApi();
        const sink = useOutputChannelSink(vscodeApi);
        const logger = new RazorLogger(vscodeApi, Trace.Verbose);

        // Act
        logger.logVerbose('Test message');

        // Assert
        const log = getAndAssertLog(sink);
        const lastLog = log[log.length - 1].trim();
        assert.ok(lastLog.endsWith('Test message'));
    });
});