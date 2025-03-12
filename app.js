const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let appWindow;

function createWindow() {
    appWindow = new BrowserWindow({
        frame: false,
        minWidth: 1100,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,  
            contextIsolation: true,
            scrollBounce: true
        }
    });

    appWindow.loadFile('dist/new-funds/browser/index.html');

    appWindow.on('closed', () => {
        appWindow = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('minimize-window', (event) => {
    BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on('maximize-window', (event) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow.isMaximized()) {
        focusedWindow.restore();
    } else {
        focusedWindow.maximize();
    }
});


ipcMain.on('close-window', (event) => {
    BrowserWindow.getFocusedWindow().close();
}); 