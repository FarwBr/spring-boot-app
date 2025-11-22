const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const initSqlJs = require('sql.js');

let db;
let SQL;
let mainWindow;

// Usar IP da VM da Univates e porta do API Gateway
const BACKEND_URL = process.env.BACKEND_URL || 'http://177.44.248.75:8082/api';

async function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'checkin.db');
  SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Criar tabelas
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      location TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      maxCapacity INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY,
      eventId INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company TEXT,
      checkedIn INTEGER DEFAULT 0,
      checkInTime TEXT,
      isWalkIn INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (eventId) REFERENCES events(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER NOT NULL,
      participantId INTEGER NOT NULL,
      checkInTime TEXT NOT NULL,
      notes TEXT,
      synced INTEGER DEFAULT 0,
      localCreatedAt TEXT NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events(id),
      FOREIGN KEY (participantId) REFERENCES participants(id)
    )
  `);
  
  console.log('Database initialized at:', dbPath);
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
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Check-in Desktop - Eventos Offline'
  });

  mainWindow.loadFile('index.html');
  
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
  
  setInterval(checkConnectionAndSync, 30000);
}

// ===== EVENTS =====
ipcMain.handle('get-events', async () => {
  try {
    const result = db.exec('SELECT * FROM events WHERE active = 1 ORDER BY startTime ASC');
    const events = result.length > 0 ? result[0].values.map(row => ({
      id: row[0], name: row[1], description: row[2], location: row[3],
      startTime: row[4], endTime: row[5], active: row[6], maxCapacity: row[7], synced: row[8]
    })) : [];
    return { success: true, data: events };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('sync-events', async () => {
  try {
    const connection = await checkConnection();
    if (!connection.online) return { success: false, message: 'Offline' };
    
    const response = await axios.get(`${BACKEND_URL}/events/active`, { timeout: 5000 });
    const events = response.data;
    
    // Limpar eventos antigos e inserir novos
    db.run('DELETE FROM events');
    
    events.forEach(event => {
      db.run(
        'INSERT INTO events (id, name, description, location, startTime, endTime, active, maxCapacity, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [event.id, event.name, event.description, event.location, event.startTime, event.endTime, event.active ? 1 : 0, event.maxCapacity]
      );
    });
    
    saveDatabase();
    return { success: true, count: events.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ===== PARTICIPANTS =====
ipcMain.handle('get-participants', async (event, eventId) => {
  try {
    const result = db.exec(`SELECT * FROM participants WHERE eventId = ${eventId} ORDER BY name ASC`);
    const participants = result.length > 0 ? result[0].values.map(row => ({
      id: row[0], eventId: row[1], name: row[2], email: row[3], phone: row[4],
      company: row[5], checkedIn: row[6], checkInTime: row[7], isWalkIn: row[8], synced: row[9]
    })) : [];
    return { success: true, data: participants };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('sync-participants', async (event, eventId) => {
  try {
    const connection = await checkConnection();
    if (!connection.online) return { success: false, message: 'Offline' };
    
    const response = await axios.get(`${BACKEND_URL}/participants/event/${eventId}`, { timeout: 5000 });
    const participants = response.data;
    
    // Limpar apenas participantes sincronizados (preservar walk-ins locais pendentes)
    db.run(`DELETE FROM participants WHERE eventId = ${eventId} AND synced = 1`);
    
    // Inserir/atualizar participantes do servidor
    participants.forEach(p => {
      db.run(
        'INSERT OR REPLACE INTO participants (id, eventId, name, email, phone, company, checkedIn, checkInTime, isWalkIn, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [p.id, eventId, p.name || '', p.email || '', p.phone || '', p.company || '', p.checkedIn ? 1 : 0, p.checkInTime, p.isWalkIn ? 1 : 0]
      );
    });
    
    saveDatabase();
    return { success: true, count: participants.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('add-walkin', async (event, data) => {
  try {
    const maxId = db.exec('SELECT MAX(id) FROM participants')[0]?.values[0]?.[0] || 0;
    const newId = maxId + 1;
    
    db.run(
      'INSERT INTO participants (id, eventId, name, email, phone, company, checkedIn, isWalkIn, synced) VALUES (?, ?, ?, ?, ?, ?, 0, 1, 0)',
      [newId, data.eventId, data.name, data.email || '', data.phone || '', data.company || '']
    );
    
    saveDatabase();
    return { success: true, id: newId };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ===== CHECK-IN =====
ipcMain.handle('checkin-participant', async (event, data) => {
  try {
    // Atualizar participante como checked-in
    db.run(
      `UPDATE participants SET checkedIn = 1, checkInTime = ? WHERE id = ?`,
      [new Date().toISOString(), data.participantId]
    );
    
    // Criar registro de check-in
    db.run(
      'INSERT INTO checkins (eventId, participantId, checkInTime, notes, synced, localCreatedAt) VALUES (?, ?, ?, ?, 0, ?)',
      [data.eventId, data.participantId, new Date().toISOString(), data.notes || '', new Date().toISOString()]
    );
    
    saveDatabase();
    
    // Tentar sincronizar imediatamente
    trySync();
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-checkins', async (event, eventId) => {
  try {
    const result = db.exec(`
      SELECT c.*, p.name as participantName 
      FROM checkins c 
      JOIN participants p ON c.participantId = p.id 
      WHERE c.eventId = ${eventId} 
      ORDER BY c.checkInTime DESC
    `);
    const checkins = result.length > 0 ? result[0].values.map(row => ({
      id: row[0], eventId: row[1], participantId: row[2], checkInTime: row[3],
      notes: row[4], synced: row[5], localCreatedAt: row[6], participantName: row[7]
    })) : [];
    return { success: true, data: checkins };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-pending-count', async () => {
  try {
    const result = db.exec('SELECT COUNT(*) FROM checkins WHERE synced = 0');
    const count = result.length > 0 ? result[0].values[0][0] : 0;
    return { success: true, count };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ===== CONNECTION & SYNC =====
ipcMain.handle('check-connection', async () => {
  return await checkConnection();
});

ipcMain.handle('force-sync', async () => {
  return await trySync();
});

ipcMain.handle('force-sync-from-server', async () => {
  return await forceSyncFromServer();
});

async function checkConnection() {
  try {
    await axios.get(`${BACKEND_URL}/events`, { timeout: 3000 });
    return { online: true };
  } catch (error) {
    return { online: false };
  }
}

async function trySync() {
  try {
    const connection = await checkConnection();
    if (!connection.online) {
      return { success: false, message: 'Offline' };
    }
    
    let totalSynced = 0;
    
    // 1. ENVIAR walk-ins pendentes para o servidor
    const walkinsResult = db.exec('SELECT * FROM participants WHERE synced = 0 AND isWalkIn = 1');
    const walkins = walkinsResult.length > 0 ? walkinsResult[0].values : [];
    
    for (const w of walkins) {
      try {
        const response = await axios.post(`${BACKEND_URL}/participants/event/${w[1]}/walk-in`, {
          name: w[2],
          email: w[3],
          phone: w[4],
          company: w[5]
        });
        
        if (response.status === 201) {
          db.run(`UPDATE participants SET id = ${response.data.id}, synced = 1 WHERE id = ${w[0]}`);
          totalSynced++;
        }
      } catch (err) {
        console.error('Erro ao sincronizar walk-in:', err);
      }
    }
    
    // 2. BAIXAR participantes do servidor para TODOS os eventos locais
    const eventsResult = db.exec('SELECT id FROM events');
    const events = eventsResult.length > 0 ? eventsResult[0].values : [];
    
    for (const eventRow of events) {
      const eventId = eventRow[0];
      try {
        const response = await axios.get(`${BACKEND_URL}/participants/event/${eventId}`, { timeout: 5000 });
        const serverParticipants = response.data;
        
        // Limpar participantes SINCRONIZADOS (não remover walk-ins locais pendentes)
        db.run(`DELETE FROM participants WHERE eventId = ${eventId} AND synced = 1`);
        
        // Inserir participantes do servidor
        serverParticipants.forEach(p => {
          db.run(
            'INSERT OR REPLACE INTO participants (id, eventId, name, email, phone, company, checkedIn, checkInTime, isWalkIn, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
            [p.id, eventId, p.name || '', p.email || '', p.phone || '', p.company || '', p.checkedIn ? 1 : 0, p.checkInTime, p.isWalkIn ? 1 : 0]
          );
        });
      } catch (err) {
        console.error(`Erro ao baixar participantes do evento ${eventId}:`, err);
      }
    }
    
    // 3. ENVIAR check-ins pendentes
    const checkinsResult = db.exec('SELECT * FROM checkins WHERE synced = 0');
    const checkins = checkinsResult.length > 0 ? checkinsResult[0].values : [];
    
    for (const c of checkins) {
      try {
        await axios.post(`${BACKEND_URL}/checkins?eventId=${c[1]}&participantId=${c[2]}`, {
          checkInTime: c[3],
          notes: c[4] || ''
        });
        
        db.run(`UPDATE checkins SET synced = 1 WHERE id = ${c[0]}`);
        totalSynced++;
      } catch (err) {
        console.error('Erro ao sincronizar check-in:', err);
      }
    }
    
    saveDatabase();
    
    if (totalSynced > 0 && mainWindow) {
      mainWindow.webContents.send('sync-completed', {
        count: totalSynced,
        message: `${totalSynced} registro(s) sincronizado(s)!`
      });
    }
    
    return { success: true, count: totalSynced };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function checkConnectionAndSync() {
  await trySync();
}

// Sincronização forçada - limpa tudo e baixa do servidor
async function forceSyncFromServer() {
  try {
    const connection = await checkConnection();
    if (!connection.online) {
      return { success: false, error: 'Offline' };
    }
    
    // 1. LIMPAR TABELAS LOCAIS (preservar estrutura)
    db.run('DELETE FROM participants');
    db.run('DELETE FROM events');
    db.run('DELETE FROM checkins');
    
    let eventsCount = 0;
    let participantsCount = 0;
    
    // 2. BAIXAR TODOS OS EVENTOS
    try {
      const eventsResponse = await axios.get(`${BACKEND_URL}/events`, { timeout: 10000 });
      const serverEvents = eventsResponse.data;
      
      serverEvents.forEach(e => {
        db.run(
          'INSERT INTO events (id, name, description, location, startTime, endTime, active, synced) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [e.id, e.name, e.description || '', e.location || '', e.startTime, e.endTime, e.active ? 1 : 0]
        );
        eventsCount++;
      });
    } catch (err) {
      return { success: false, error: 'Erro ao baixar eventos: ' + err.message };
    }
    
    // 3. BAIXAR PARTICIPANTES DE CADA EVENTO
    const eventsResult = db.exec('SELECT id FROM events');
    const events = eventsResult.length > 0 ? eventsResult[0].values : [];
    
    for (const eventRow of events) {
      const eventId = eventRow[0];
      try {
        const response = await axios.get(`${BACKEND_URL}/participants/event/${eventId}`, { timeout: 5000 });
        const serverParticipants = response.data;
        
        serverParticipants.forEach(p => {
          db.run(
            'INSERT INTO participants (id, eventId, name, email, phone, company, checkedIn, checkInTime, isWalkIn, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
            [p.id, eventId, p.name || '', p.email || '', p.phone || '', p.company || '', p.checkedIn ? 1 : 0, p.checkInTime, p.isWalkIn ? 1 : 0]
          );
          participantsCount++;
        });
      } catch (err) {
        console.error(`Erro ao baixar participantes do evento ${eventId}:`, err);
      }
    }
    
    saveDatabase();
    
    return { 
      success: true, 
      eventsCount, 
      participantsCount,
      message: `${eventsCount} eventos e ${participantsCount} participantes sincronizados` 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

app.whenReady().then(async () => {
  await initDatabase();
  createWindow();
  setTimeout(trySync, 3000);
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) saveDatabase();
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) saveDatabase();
});
