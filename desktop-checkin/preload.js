const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Check-ins
  createCheckIn: (data) => ipcRenderer.invoke('create-checkin', data),
  getCheckIns: () => ipcRenderer.invoke('get-checkins'),
  getPendingCheckIns: () => ipcRenderer.invoke('get-pending-checkins'),
  deleteCheckIn: (id) => ipcRenderer.invoke('delete-checkin', id),
  
  // Conexão e sincronização
  checkConnection: () => ipcRenderer.invoke('check-connection'),
  forceSync: () => ipcRenderer.invoke('force-sync'),
  
  // Event listeners
  onSyncCompleted: (callback) => {
    ipcRenderer.on('sync-completed', (event, data) => callback(data));
  }
});
