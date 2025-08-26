const { app, BrowserWindow, ipcMain } = require('electron');
const { PythonShell } = require('python-shell');
const path = require('path');

let pyShell;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
    });

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        win.loadURL('http://localhost:3000');
    }
}

app.whenReady().then(() => {
    pyShell = new PythonShell(path.join(__dirname, '../backend/model.py'));
    createWindow();
});

ipcMain.handle('recognize', async (event, imagePath) => {
    return new Promise((resolve, reject) => {
        pyShell.send(JSON.stringify({ path: imagePath }));
        pyShell.once('message', (message) => {
            resolve(JSON.parse(message).result);
        });
    });
});
