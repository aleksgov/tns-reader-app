const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    recognize: (imagePath) => ipcRenderer.invoke('recognize', imagePath)
});
