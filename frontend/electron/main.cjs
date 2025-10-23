const { app, BrowserWindow, ipcMain } = require('electron');
const { PythonShell } = require('python-shell');
const path = require('path');

let pyShell;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1450,
        height: 825,
        minWidth: 1100,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        backgroundColor: '#2b2b2b',
        frame: false,
    });

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        mainWindow.loadURL('http://localhost:3000');
    }
}

app.whenReady().then(() => {
    pyShell = new PythonShell(path.join(__dirname, '../backend/model.py'));
    createWindow();
});

// обработчики для управления окном (для title bar)
ipcMain.handle('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.handle('window-close', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.handle('recognize', async (event, imagePath) => {
    return new Promise((resolve, reject) => {
        pyShell.send(JSON.stringify({ path: imagePath }));
        pyShell.once('message', (message) => {
            resolve(JSON.parse(message).result);
        });
    });
});