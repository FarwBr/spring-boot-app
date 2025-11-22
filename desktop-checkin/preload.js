const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Events
  getEvents: () => ipcRenderer.invoke('get-events'),
  syncEvents: () => ipcRenderer.invoke('sync-events'),
  
  // Participants
  getParticipants: (eventId) => ipcRenderer.invoke('get-participants', eventId),
  syncParticipants: (eventId) => ipcRenderer.invoke('sync-participants', eventId),
  addWalkIn: (data) => ipcRenderer.invoke('add-walkin', data),
  
  // Check-ins
  checkinParticipant: (data) => ipcRenderer.invoke('checkin-participant', data),
  getCheckIns: (eventId) => ipcRenderer.invoke('get-checkins', eventId),
  getPendingCount: () => ipcRenderer.invoke('get-pending-count'),
  
  // Connection
  checkConnection: () => ipcRenderer.invoke('check-connection'),
  forceSync: () => ipcRenderer.invoke('force-sync'),
  forceSyncFromServer: () => ipcRenderer.invoke('force-sync-from-server'),
  
  // Events
  onSyncCompleted: (callback) => {
    ipcRenderer.on('sync-completed', (event, data) => callback(data));
  }
});
