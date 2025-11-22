# 🔄 Sincronização Bidirecional Desktop ↔ Web

## 🚨 Problema Identificado

### **Situação Anterior:**
- Desktop **enviava** walk-ins para o servidor ✅
- Desktop **enviava** check-ins para o servidor ✅  
- Desktop **NÃO baixava** participantes cadastrados no Web ❌
- Resultado: **Dados dessincronizados entre Desktop e Web**

### **Exemplo do Problema:**
1. Admin cadastra "João Silva" no Web
2. João aparece no banco PostgreSQL ✅
3. Desktop sincroniza...
4. João **NÃO aparece** no Desktop ❌

**Motivo:** `trySync()` apenas **ENVIAVA** dados locais, não **BAIXAVA** dados do servidor.

---

## ✅ Solução Implementada

### **Nova Função `trySync()` - Sincronização Completa**

Agora a sincronização funciona em **3 etapas**:

```javascript
async function trySync() {
  // 1️⃣ ENVIAR walk-ins locais → Servidor
  // 2️⃣ BAIXAR participantes Servidor → Desktop  
  // 3️⃣ ENVIAR check-ins locais → Servidor
}
```

---

## 📊 Fluxo Detalhado

### **1️⃣ Enviar Walk-ins Pendentes (Desktop → Servidor)**

```javascript
// Buscar walk-ins não sincronizados (synced = 0)
const walkins = db.exec('SELECT * FROM participants WHERE synced = 0 AND isWalkIn = 1');

// Para cada walk-in:
for (const w of walkins) {
  // POST para o servidor
  await axios.post(`${BACKEND_URL}/participants/event/${eventId}/walk-in`, {
    name, email, phone, company
  });
  
  // Marcar como sincronizado
  db.run(`UPDATE participants SET synced = 1 WHERE id = ${w[0]}`);
}
```

**Resultado:**
- ✅ Walk-ins criados no Desktop aparecem no Web
- ✅ Servidor cria User automaticamente (senha: 123)

---

### **2️⃣ Baixar Participantes (Servidor → Desktop)** 🆕

```javascript
// Buscar todos os eventos locais
const events = db.exec('SELECT id FROM events');

// Para cada evento:
for (const eventId of events) {
  // GET participantes do servidor
  const response = await axios.get(`${BACKEND_URL}/participants/event/${eventId}`);
  const serverParticipants = response.data;
  
  // Limpar apenas participantes SINCRONIZADOS (preservar walk-ins locais pendentes)
  db.run(`DELETE FROM participants WHERE eventId = ${eventId} AND synced = 1`);
  
  // Inserir participantes do servidor
  serverParticipants.forEach(p => {
    db.run('INSERT OR REPLACE INTO participants (...) VALUES (?, ?, ?, ...)', 
      [p.id, eventId, p.name, p.email, p.phone, ...]);
  });
}
```

**Resultado:**
- ✅ Participantes cadastrados no Web aparecem no Desktop
- ✅ Walk-ins locais pendentes são preservados
- ✅ Desktop sempre tem dados atualizados do servidor

---

### **3️⃣ Enviar Check-ins Pendentes (Desktop → Servidor)**

```javascript
// Buscar check-ins não sincronizados
const checkins = db.exec('SELECT * FROM checkins WHERE synced = 0');

// Para cada check-in:
for (const c of checkins) {
  // POST para o servidor
  await axios.post(`${BACKEND_URL}/checkins?eventId=${eventId}&participantId=${participantId}`, {
    checkInTime, notes
  });
  
  // Marcar como sincronizado
  db.run(`UPDATE checkins SET synced = 1 WHERE id = ${c[0]}`);
}
```

**Resultado:**
- ✅ Check-ins feitos offline são enviados quando online
- ✅ Web vê check-ins do Desktop em tempo real

---

## 🔄 Quando a Sincronização Acontece

### **Automática:**
- ⏰ **A cada 30 segundos** quando Desktop está online
- 🚀 **Na inicialização** do Desktop (3 segundos após abrir)

```javascript
// main.js linha 340
setInterval(checkConnectionAndSync, 30000); // 30s
setTimeout(trySync, 3000); // 3s após abrir
```

### **Manual:**
- 🖱️ Botão **"Atualizar Eventos"** no Desktop
- 🖱️ Botão de sincronização específico (se implementado)

---

## 📝 Alterações no Código

### **Arquivo: `desktop-checkin/main.js`**

#### **Função `trySync()` - Linha ~270**
```diff
async function trySync() {
  const connection = await checkConnection();
  if (!connection.online) return { success: false, message: 'Offline' };
  
+ let totalSynced = 0;
  
- // Sincronizar walk-ins pendentes
+ // 1. ENVIAR walk-ins pendentes para o servidor
  const walkinsResult = db.exec('SELECT * FROM participants WHERE synced = 0 AND isWalkIn = 1');
  // ... (código existente)
  
+ // 2. BAIXAR participantes do servidor para TODOS os eventos locais
+ const eventsResult = db.exec('SELECT id FROM events');
+ const events = eventsResult.length > 0 ? eventsResult[0].values : [];
+ 
+ for (const eventRow of events) {
+   const eventId = eventRow[0];
+   try {
+     const response = await axios.get(`${BACKEND_URL}/participants/event/${eventId}`);
+     const serverParticipants = response.data;
+     
+     // Limpar participantes SINCRONIZADOS (preservar walk-ins locais pendentes)
+     db.run(`DELETE FROM participants WHERE eventId = ${eventId} AND synced = 1`);
+     
+     // Inserir participantes do servidor
+     serverParticipants.forEach(p => {
+       db.run('INSERT OR REPLACE INTO participants (...)', [...]);
+     });
+   } catch (err) {
+     console.error('Erro ao baixar participantes:', err);
+   }
+ }
  
- // Sincronizar check-ins pendentes
+ // 3. ENVIAR check-ins pendentes
  const checkinsResult = db.exec('SELECT * FROM checkins WHERE synced = 0');
  // ... (código existente)
}
```

#### **Função `sync-participants` - Linha ~155**
```diff
ipcMain.handle('sync-participants', async (event, eventId) => {
  const response = await axios.get(`${BACKEND_URL}/participants/event/${eventId}`);
  const participants = response.data;
  
- // Limpar participantes do evento e inserir novos
- db.run(`DELETE FROM participants WHERE eventId = ${eventId}`);
+ // Limpar apenas participantes sincronizados (preservar walk-ins locais pendentes)
+ db.run(`DELETE FROM participants WHERE eventId = ${eventId} AND synced = 1`);
  
  participants.forEach(p => {
-   db.run('INSERT INTO participants (...)', [...]);
+   db.run('INSERT OR REPLACE INTO participants (...)', [...]);
  });
});
```

---

## 🎯 Cenários de Teste

### **Teste 1: Web → Desktop**

**Passos:**
1. Login como ADMIN no Web
2. Ir em "👤 Participantes"
3. Selecionar evento
4. Adicionar participante: "Maria Silva" / maria@teste.com
5. Abrir Desktop
6. Aguardar 30s (sincronização automática) OU clicar "Atualizar Eventos"

**Resultado Esperado:**
- ✅ "Maria Silva" aparece na lista do Desktop
- ✅ Email: maria@teste.com
- ✅ Badge: "📝 Pré-cadastro"

---

### **Teste 2: Desktop → Web**

**Passos:**
1. Abrir Desktop
2. Selecionar evento
3. Adicionar Walk-in: "Carlos Souza" / carlos@teste.com
4. Aguardar 30s (sincronização automática)
5. Atualizar página no Web
6. Ir em "👤 Participantes"

**Resultado Esperado:**
- ✅ "Carlos Souza" aparece na lista do Web
- ✅ Email: carlos@teste.com
- ✅ Badge: "🚶 Walk-in"
- ✅ User criado com senha "123"

---

### **Teste 3: Offline → Online**

**Passos:**
1. Desktop offline
2. Adicionar 2 walk-ins: "Ana" e "Bruno"
3. Fazer check-in de "Ana"
4. Conectar internet
5. Aguardar 30s

**Resultado Esperado:**
- ✅ 2 walk-ins sincronizados com servidor
- ✅ 1 check-in sincronizado
- ✅ Desktop exibe: "3 registro(s) sincronizado(s)!"
- ✅ Web mostra Ana e Bruno
- ✅ Ana aparece com check-in feito

---

### **Teste 4: Bidirecional Simultâneo**

**Passos:**
1. Web: Adicionar "João" no Evento A
2. Desktop: Adicionar Walk-in "Pedro" no Evento A
3. Aguardar 30s no Desktop
4. Atualizar Web

**Resultado Esperado:**
- ✅ Desktop vê: João (Web) + Pedro (Local)
- ✅ Web vê: João (Web) + Pedro (Desktop)
- ✅ Ambos sincronizados corretamente

---

## 🛡️ Proteções Implementadas

### **1. Preservar Walk-ins Pendentes**
```javascript
// NÃO deleta walk-ins locais não sincronizados
db.run(`DELETE FROM participants WHERE eventId = ${eventId} AND synced = 1`);
```

**Por quê?**
- Walk-ins criados offline ainda não foram enviados ao servidor
- Deletar todos os participantes perderia dados locais

---

### **2. INSERT OR REPLACE**
```javascript
db.run('INSERT OR REPLACE INTO participants ...');
```

**Por quê?**
- Evita conflitos de ID
- Atualiza participantes existentes
- Insere novos participantes

---

### **3. Tratamento de Erros**
```javascript
for (const eventRow of events) {
  try {
    // Sincronização
  } catch (err) {
    console.error('Erro:', err);
    // Continua para próximo evento
  }
}
```

**Por quê?**
- Erro em 1 evento não para toda sincronização
- Desktop continua funcional mesmo com erros pontuais

---

## 📊 Comparação: Antes vs Depois

| Operação | Antes | Depois |
|----------|-------|--------|
| **Cadastro no Web** | ❌ Não aparece no Desktop | ✅ Aparece após 30s |
| **Walk-in no Desktop** | ✅ Sincroniza para Web | ✅ Sincroniza para Web |
| **Check-in Offline** | ✅ Sincroniza quando online | ✅ Sincroniza quando online |
| **Atualização Manual** | ⚠️ Só eventos, não participantes | ✅ Eventos + Participantes |
| **Sincronização Automática** | ⏰ 30s (só upload) | ⏰ 30s (upload + download) |

---

## 🚀 Deploy

### **1. Commit e Push**
```bash
cd spring-boot-app
git add desktop-checkin/main.js
git commit -m "Fix: Implementar sincronização bidirecional Desktop<->Web

- trySync() agora baixa participantes do servidor
- Preserva walk-ins locais pendentes
- Sincronização completa a cada 30s
- Participantes do Web aparecem no Desktop automaticamente"
git push origin main
```

### **2. Rebuild Desktop (Não necessário)**
- Desktop lê código JavaScript diretamente
- Apenas fazer `git pull` no servidor onde está o código
- Usuários precisam fechar e reabrir o aplicativo

### **3. Testar**
```bash
# Se Desktop estiver sendo executado do repositório:
cd spring-boot-app/desktop-checkin
git pull origin main
npm start
```

---

## ⚠️ Notas Importantes

### **Conflitos de Dados**
- Se mesmo participante for editado em Desktop e Web simultaneamente: **Web vence**
- Desktop baixa dados do servidor e sobrescreve locais (exceto walk-ins pendentes)

### **Performance**
- Desktop baixa participantes de **TODOS** os eventos a cada 30s
- Se tiver muitos eventos, pode demorar alguns segundos
- Considerar otimizar no futuro (baixar só eventos recentes)

### **Offline-First**
- Desktop continua funcionando 100% offline
- Walk-ins e check-ins são salvos localmente
- Sincronização acontece automaticamente quando conectar

---

## 📄 Arquivos Modificados

- ✅ `desktop-checkin/main.js` - Função `trySync()` e `sync-participants`

---

## ✅ Resultado Final

**Agora Desktop e Web estão SEMPRE sincronizados!**

- 🔄 Desktop baixa dados do Web a cada 30s
- 🔄 Desktop envia dados para Web a cada 30s
- ✅ Participantes aparecem em ambos os lados
- ✅ Check-ins sincronizam automaticamente
- ✅ Sistema funciona offline e online

---

**Data:** 22 de Novembro de 2025  
**Desenvolvido por:** GitHub Copilot (Claude Sonnet 4.5)
