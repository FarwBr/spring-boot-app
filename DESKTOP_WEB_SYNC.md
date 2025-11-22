# 🔄 Sincronização Desktop vs Web

## Arquitetura do Sistema

### 🌐 **Web (Frontend React)**
- **Tipo**: Aplicação online
- **Backend**: Conecta diretamente ao backend via HTTP
- **Base de dados**: PostgreSQL no servidor (177.44.248.75)
- **Portas da API Gateway**:
  - 8081: Usuários e Autenticação
  - 8082: Eventos
  - 8083: Participantes
  - 8084: Certificados
  - 8085: Notificações
- **Operação**: Todas as operações são em tempo real no banco de dados

### 💻 **Desktop (Electron)**
- **Tipo**: Aplicação offline-first
- **Backend**: SQLite local + sincronização com servidor
- **Base de dados local**: SQLite em `%APPDATA%/checkin.db`
- **Porta do backend**: 8082 (Events API)
- **Operação**: 
  1. Trabalha com dados locais (SQLite)
  2. Sincroniza com servidor quando online
  3. Permite check-ins offline
  4. Envia dados ao servidor quando conexão retorna

---

## 🔍 Por que os dados podem ser diferentes?

### **Causa 1: Desktop usa cache local**
O desktop baixa eventos ativos do servidor e armazena localmente. Se um evento é criado no web DEPOIS que o desktop sincronizou, o desktop não saberá até a próxima sincronização.

```javascript
// Desktop sincroniza eventos ativos a cada 30 segundos
setInterval(checkConnectionAndSync, 30000);
```

### **Causa 2: Sincronização manual necessária**
No desktop, usuário precisa clicar em "Sincronizar Eventos" para buscar novos dados do servidor.

### **Causa 3: Eventos inativos não aparecem no desktop**
Desktop busca apenas `/events/active`, enquanto web mostra todos os eventos (ativos e inativos).

```javascript
// Desktop main.js linha 121
const response = await axios.get(`${BACKEND_URL}/events/active`);
```

### **Causa 4: Desktop cria participantes walk-in localmente**
Walk-ins (participantes sem pré-cadastro) são criados localmente no desktop e sincronizados depois.

---

## ✅ Solução para manter dados sincronizados

### **No Desktop:**
1. Sempre clicar em "Sincronizar Eventos" antes de usar
2. Manter conexão com internet quando possível
3. Aguardar sincronização automática (a cada 30 segundos)

### **No Web:**
1. Eventos criados no web aparecem imediatamente
2. Desktop verá eventos quando sincronizar
3. **Importante**: Marcar eventos como "Ativos" para aparecerem no desktop

### **Para Administradores:**
- Criar eventos sempre como **ATIVOS** se quiser que apareçam no desktop
- Eventos **inativos** só aparecem no web
- Desktop não mostra eventos **finalizados**

---

## 🛠️ Comandos úteis para verificar sincronização

### **Verificar eventos no banco de dados:**
```bash
ssh univates@177.44.248.75
cd spring-boot-app
sudo docker exec -i postgres-db psql -U event_user -d event_db -c "SELECT id, name, active, finished FROM events;"
```

### **Ver logs do desktop:**
- Abrir desktop com `npm start -- --dev`
- Console mostrará tentativas de sincronização
- Verificar mensagens: "X eventos sincronizados"

### **Forçar sincronização no desktop:**
1. Abrir aplicativo desktop
2. Clicar em "Sincronizar Eventos"
3. Aguardar mensagem de confirmação

---

## 📊 Fluxo de Dados

```
WEB (React)
   ↓
   ├─→ API Gateway (8081-8085)
   ↓
   └─→ PostgreSQL (Tempo Real)


DESKTOP (Electron)
   ↓
   ├─→ SQLite Local (Offline)
   ↓
   ├─→ Sincroniza quando online
   ↓
   └─→ Backend API (8082) → PostgreSQL
```

---

## 🎯 Recomendações

1. **Para eventos que precisam aparecer no desktop:**
   - ✅ Marcar como "Ativo"
   - ✅ Não finalizar até depois do evento
   - ✅ Desktop sincroniza automaticamente a cada 30s

2. **Para gestão completa:**
   - Use **WEB** para criar/editar eventos
   - Use **DESKTOP** para check-ins (funciona offline)
   - Ambos compartilham o mesmo banco PostgreSQL

3. **Se dados estiverem dessincronizados:**
   - Desktop: Clicar em "Sincronizar Eventos"
   - Web: Recarregar página (Ctrl+Shift+R)
   - Verificar se evento está marcado como "Ativo"

---

## 🔧 Configuração Atual

### **Backend (main.js)**
```javascript
const BACKEND_URL = 'http://177.44.248.75:8082/api';
```

### **Web (React Services)**
- Events: `http://177.44.248.75:8082/api`
- Users: `http://177.44.248.75:8081/api`
- Participants: `http://177.44.248.75:8083/api`
- Certificates: `http://177.44.248.75:8084/api`

### **Banco de Dados**
- Servidor: `177.44.248.75:5432`
- Database: `event_db`
- User: `event_user`

---

## ❗ Importante

**Desktop e Web usam o MESMO banco de dados PostgreSQL!**

A diferença é apenas que:
- **Web** acessa banco diretamente via API
- **Desktop** mantém cópia local (SQLite) para funcionar offline
- Desktop sincroniza com servidor quando possível

Isso garante que:
- ✅ Check-ins funcionam offline no desktop
- ✅ Dados são sincronizados automaticamente
- ✅ Web sempre mostra dados em tempo real
- ✅ Nenhum dado é perdido

---

**Última atualização:** 22 de Novembro de 2025
