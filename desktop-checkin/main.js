const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const initSqlJs = require('sql.js');

// Configuração do banco de dados SQLite local
let db;
let SQL;
let mainWindow;

// URL do backend (pode ser configurada)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api/checkins';

async function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'checkin.db');
  
  // Inicializar sql.js
  SQL = await initSqlJs();
  
  // Verificar se banco existe e carregar, senão criar novo
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Criar tabela de check-ins se não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT NOT NULL,
      location TEXT NOT NULL,
      notes TEXT,
      checkInTime TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      localCreatedAt TEXT NOT NULL
    )
  `);
  
  console.log('Database initialized at:', dbPath);
  
  // Salvar banco após cada operação
  saveDatabase();
}

function saveDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'checkin.db');
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Check-in Desktop - Offline Ready',
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');
  
  // Abrir DevTools em modo desenvolvimento
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
  
  // Verificar conexão periodicamente
  setInterval(checkConnectionAndSync, 30000); // A cada 30 segundos
}

// IPC Handlers - Comunicação entre Electron e Renderer

// Criar novo check-in
ipcMain.handle('create-checkin', async (event, data) => {
  try {
    db.run(
      `INSERT INTO checkins (userName, location, notes, checkInTime, localCreatedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [data.userName, data.location, data.notes || '', data.checkInTime, new Date().toISOString()]
    );
    
    saveDatabase();
    
    // Tentar sincronizar imediatamente
    trySync();
    
    return { success: true, id: db.exec('SELECT last_insert_rowid()')[0].values[0][0] };
  } catch (error) {
    console.error('Error creating check-in:', error);
    return { success: false, error: error.message };
  }
});

// Buscar todos os check-ins
ipcMain.handle('get-checkins', async () => {
  try {
    const result = db.exec('SELECT * FROM checkins ORDER BY checkInTime DESC');
    const checkins = result.length > 0 ? result[0].values.map(row => ({
      id: row[0],
      userName: row[1],
      location: row[2],
      notes: row[3],
      checkInTime: row[4],
      synced: row[5],
      localCreatedAt: row[6]
    })) : [];
    return { success: true, data: checkins };
  } catch (error) {
    console.error('Error getting check-ins:', error);
    return { success: false, error: error.message };
  }
});

// Buscar check-ins pendentes de sincronização
ipcMain.handle('get-pending-checkins', async () => {
  try {
    const result = db.exec('SELECT COUNT(*) FROM checkins WHERE synced = 0');
    const count = result.length > 0 ? result[0].values[0][0] : 0;
    return { success: true, count };
  } catch (error) {
    console.error('Error getting pending check-ins:', error);
    return { success: false, error: error.message };
  }
});

// Deletar check-in
ipcMain.handle('delete-checkin', async (event, id) => {
  try {
    db.run('DELETE FROM checkins WHERE id = ?', [id]);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Error deleting check-in:', error);
    return { success: false, error: error.message };
  }
});

// Verificar status da conexão
ipcMain.handle('check-connection', async () => {
  return await checkConnection();
});

// Forçar sincronização manual
ipcMain.handle('force-sync', async () => {
  return await trySync();
});

// Função para verificar conexão com o backend
async function checkConnection() {
  try {
    const response = await axios.get(BACKEND_URL, { timeout: 5000 });
    return { online: true, message: 'Conectado ao servidor' };
  } catch (error) {
    return { online: false, message: 'Sem conexão com o servidor' };
  }
}

// Função para sincronizar dados locais com o backend
async function trySync() {
  try {
    // Verificar se está online
    const connection = await checkConnection();
    if (!connection.online) {
      return { success: false, message: 'Offline - dados salvos localmente' };
    }
    
    // Buscar check-ins não sincronizados
    const result = db.exec('SELECT * FROM checkins WHERE synced = 0');
    const pendingCheckIns = result.length > 0 ? result[0].values.map(row => ({
      userName: row[1],
      location: row[2],
      notes: row[3],
      checkInTime: row[4],
      syncedFromOffline: true
    })) : [];
    
    if (pendingCheckIns.length === 0) {
      return { success: true, message: 'Nenhum dado pendente para sincronizar' };
    }
    
    // Preparar dados para envio
    const dataToSync = pendingCheckIns;
    
    // Enviar para o backend
    const response = await axios.post(`${BACKEND_URL}/sync`, dataToSync, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.status === 201) {
      // Marcar como sincronizado
      db.run('UPDATE checkins SET synced = 1 WHERE synced = 0');
      saveDatabase();
      
      // Notificar a interface
      if (mainWindow) {
        mainWindow.webContents.send('sync-completed', {
          count: pendingCheckIns.length,
          message: `${pendingCheckIns.length} check-in(s) sincronizado(s) com sucesso!`
        });
      }
      
      return { 
        success: true, 
        message: `${pendingCheckIns.length} check-in(s) sincronizado(s)`,
        count: pendingCheckIns.length
      };
    }
    
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, message: 'Erro ao sincronizar: ' + error.message };
  }
}

// Verificar conexão e sincronizar periodicamente
async function checkConnectionAndSync() {
  const result = await trySync();
  if (mainWindow && result.success && result.count > 0) {
    console.log('Auto-sync completed:', result.message);
  }
}

// Lifecycle do app
app.whenReady().then(async () => {
  await initDatabase();
  createWindow();
  
  // Sincronizar ao iniciar
  setTimeout(trySync, 3000); // Aguarda 3s após abrir
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) {
      saveDatabase();
    }
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) {
    saveDatabase();
  }
});
