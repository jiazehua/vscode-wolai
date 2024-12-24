const vscode = require('vscode');

function activate(context) {
    // 注册打开 Wolai 网站的命令
    let openWolaiDisposable = vscode.commands.registerCommand('wolai.openWebsite', function () {
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
        panel.webview.html = getWebviewContent('https://www.wolai.com');
    });

    // 注册打开自定义网站的命令
    let openCustomWebsiteDisposable = vscode.commands.registerCommand('wolai.openCustomWebsite', async function () {
        // 弹出输入框让用户输入网址
        const url = await vscode.window.showInputBox({
            prompt: '请输入要打开的网址',
            placeHolder: 'https://www.example.com'
        });

        if (url) {
            const panel = vscode.window.createWebviewPanel(
                'webview', // 标识
                'Custom Website', // 标签页标题
                vscode.ViewColumn.One, // 显示在编辑器的哪个位置
                {
                    enableScripts: true, // 启用JavaScript
                    retainContextWhenHidden: true // 保留上下文
                }
            );

            // 设置Webview的内容
            panel.webview.html = getWebviewContent(url, true);
        }
    });

    context.subscriptions.push(openWolaiDisposable);
    context.subscriptions.push(openCustomWebsiteDisposable);
}

function getWebviewContent(url, isCustom = false) {
    const customStyle = isCustom ? 'opacity: 0.1;' : '';

    const script = `
        (function() {
            const vscode = acquireVsCodeApi();
            window.addEventListener('message', event => {
                const links = document.querySelectorAll('a');
                links.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        vscode.postMessage({
                            command: 'openLink',
                            url: link.href
                        });
                    });
                });
            });

            const iframe = document.getElementById('iframe');
            iframe.addEventListener('load', () => {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const style = iframeDocument.createElement('style');
                style.textContent = 'body { opacity: 0.1; }';
                iframeDocument.head.appendChild(style);
            });
        }())
    `;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Custom Website</title>
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
                    ${customStyle}
                }
            </style>
        </head>
        <body>
            <iframe id="iframe" src="${url}" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
            <script>${script}</script>
        </body>
        </html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};