const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('wolai.openWebsite', function () {
        const panel = vscode.window.createWebviewPanel(
            'webview', // 标识
            'Wolai', // 标签页标题
            vscode.ViewColumn.One, // 显示在编辑器的哪个位置
            {
                enableScripts: true, // 启用JavaScript
                retainContextWhenHidden: true // 保留上下文
            }
        );

        // 设置Webview的内容
        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wolai</title>
            <style>
                body, html {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            </style>
        </head>
        <body>
            <iframe src="https://www.wolai.com" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
        </body>
        </html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};