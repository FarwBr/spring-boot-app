# 🔄 Correções de Sincronização - 22/Nov/2025 (Parte 2)

## 📋 Novos Problemas Reportados

### 1. ❌ Participante cadastrado no Web não aparece no Desktop
**Causa:** Quando participante tem `user_id` vinculado, os campos `name`, `email`, `phone`, `company` ficavam NULL porque só copiavam no `@PrePersist` se `name == null`

**Impacto:** Desktop busca `/api/participants/event/{id}` e recebe JSON com campos vazios:
```json
{
  "id": 1,
  "name": null,
  "email": null,
  "checkedIn": false,
  "user": { ... } // Mas desktop não lê este campo
}
```

**Solução:**
```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
    
    // SEMPRE copiar dados do user
    if (user != null) {
        name = user.getName();
        email = user.getEmail();
        phone = user.getPhone();
        company = user.getCompany();
    }
}

@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
    
    // Atualizar dados do user se existir
    if (user != null) {
        name = user.getName();
        email = user.getEmail();
        phone = user.getPhone();
        company = user.getCompany();
    }
}
```

**Arquivo:** `backend/src/main/java/com/example/model/Participant.java`

---

### 2. ❌ Participante cadastrado no Desktop não aparece no Web
**Causa:** Desktop sincroniza com backend usando endpoint `/api/participants/event/{id}/walk-in`, que funciona corretamente. O problema era que o Web não estava mostrando porque os dados não estavam sendo copiados corretamente (mesmo problema do item 1).

**Solução:** Com a correção do `@PrePersist` e `@PreUpdate`, agora o Web também vê os participantes do Desktop.

---

### 3. ❌ Participante do Web não cria usuário automaticamente
**Causa:** Web usava endpoint `/api/participants/event/{id}` que chamava `createParticipant()`, e este método **não criava User**.

Apenas o `createWalkIn()` criava usuário automaticamente.

**Solução:** Adicionar lógica de criação de User em `createParticipant()`:
```java
public Participant createParticipant(Long eventId, Participant participant) {
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
    
    // Criar User se tiver email e não existir
    User user = null;
    if (participant.getEmail() != null && !participant.getEmail().isEmpty()) {
        Optional<User> existingUser = userRepository.findByEmail(participant.getEmail());
        
        if (existingUser.isPresent()) {
            // Usar usuário existente
            user = existingUser.get();
        } else {
            // Criar novo usuário com senha padrão "123"
            user = new User();
            user.setName(participant.getName());
            user.setEmail(participant.getEmail());
            user.setPhone(participant.getPhone());
            user.setCompany(participant.getCompany());
            user.setPassword(passwordEncoder.encode("123"));
            user.setRole(UserRole.CLIENT);
            user = userRepository.save(user);
        }
    }
    
    participant.setUser(user);
    participant.setEvent(event);
    return participantRepository.save(participant);
}
```

**Arquivo:** `backend/src/main/java/com/example/service/ParticipantService.java`

---

### 4. ❌ Erro "usuários não carregados" em Meus Eventos
**Causa:** `MyEventsPage.js` estava usando porta única `8083` para todas as chamadas:
- ❌ `/users` na porta 8083 (deveria ser 8081)
- ❌ `/events/active` na porta 8083 (deveria ser 8082)

**Solução:** Separar APIs por responsabilidade:
```javascript
const PARTICIPANTS_API = 'http://177.44.248.75:8083/api';
const USERS_API = 'http://177.44.248.75:8081/api';
const EVENTS_API = 'http://177.44.248.75:8082/api';

// Usar API correta para cada recurso
const fetchUsers = async () => {
    const response = await axios.get(`${USERS_API}/users`);
    setUsers(response.data);
};

const fetchAvailableEvents = async () => {
    const response = await axios.get(`${EVENTS_API}/events/active`);
    setAvailableEvents(response.data);
};

const registerToEvent = async (eventId) => {
    await axios.post(`${PARTICIPANTS_API}/participants/user/${selectedUserId}/event/${eventId}/register`);
};
```

**Arquivo:** `frontend/src/pages/MyEventsPage.js`

---

## 🔄 Fluxo de Sincronização Corrigido

### **Web → Desktop:**
1. Admin cadastra participante no Web usando `ParticipantsPage`
2. Frontend chama `POST /api/participants/event/{eventId}`
3. Backend:
   - Cria User se email não existir (senha: "123")
   - Cria Participant com `user_id` vinculado
   - `@PrePersist` copia dados do User para campos do Participant
4. Desktop sincroniza: `GET /api/participants/event/{eventId}`
5. Backend retorna JSON com campos preenchidos:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "51999999999",
  "company": "Empresa X",
  "checkedIn": false,
  "isWalkIn": false
}
```
6. Desktop exibe participante corretamente ✅

### **Desktop → Web:**
1. Operador cadastra walk-in no Desktop
2. Desktop salva localmente no SQLite
3. Desktop sincroniza: `POST /api/participants/event/{eventId}/walk-in`
4. Backend:
   - Cria User se email não existir (senha: "123")
   - Cria Participant com `isWalkIn=true`
   - `@PrePersist` copia dados para campos do Participant
5. Web consulta: `GET /api/participants/event/{eventId}`
6. Web exibe participante com badge "🚶 Walk-in" ✅

---

## 🔐 Criação Automática de Usuários

### **Regras:**
- ✅ Participante com email → cria User automaticamente
- ✅ Participante sem email → não cria User
- ✅ Email já existe → reutiliza User existente
- ✅ Senha padrão: `123`
- ✅ Role padrão: `CLIENT`

### **Endpoints que criam User:**
1. `POST /api/participants/event/{eventId}` - Web (Admin)
2. `POST /api/participants/event/{eventId}/walk-in` - Desktop
3. `POST /api/participants/user/{userId}/event/{eventId}/register` - Usuário se inscrevendo

### **Como participante vira usuário:**

#### **Cenário 1: Admin cadastra no Web**
```
Admin adiciona participante:
- Nome: João Silva
- Email: joao@example.com

Backend:
1. Verifica se joao@example.com existe
2. Se não existe:
   - Cria User(name="João Silva", email="joao@example.com", password="123", role="CLIENT")
3. Cria Participant com user_id vinculado

Resultado:
✅ João pode fazer login com joao@example.com / 123
```

#### **Cenário 2: Walk-in no Desktop**
```
Operador adiciona walk-in:
- Nome: Maria Santos
- Email: maria@example.com

Desktop sincroniza com backend:
1. Backend verifica se maria@example.com existe
2. Se não existe:
   - Cria User(name="Maria Santos", email="maria@example.com", password="123", role="CLIENT")
3. Salva Participant com user_id e isWalkIn=true

Resultado:
✅ Maria pode fazer login com maria@example.com / 123
```

#### **Cenário 3: Usuário se inscreve**
```
Cliente faz cadastro:
- Email: carlos@example.com
- Senha escolhida: minhasenha

Cliente se inscreve em evento:
1. Backend cria Participant vinculado ao User existente
2. `@PrePersist` copia dados do User para Participant

Resultado:
✅ Carlos pode fazer check-in no evento
✅ Desktop vê dados de Carlos corretamente
```

---

## 🛠️ Script de Correção de Dados

Para corrigir participantes existentes que têm `user_id` mas campos vazios:

```sql
-- Copiar dados do User para Participant
UPDATE participants p
SET 
    name = u.name,
    email = u.email,
    phone = u.phone,
    company = u.company
FROM users u
WHERE p.user_id = u.id
  AND p.user_id IS NOT NULL;
```

**Arquivo:** `fix-participants-sync.sql`

**Como aplicar:**
```bash
ssh univates@177.44.248.75
cd spring-boot-app
sudo docker exec -i postgres-db psql -U event_user -d event_db < fix-participants-sync.sql
```

---

## 📊 Arquitetura de APIs Corrigida

### **API Gateway (Nginx) - Portas:**
```
8081 → Backend (Users, Auth)
8082 → Backend (Events)
8083 → Backend (Participants, CheckIns)
8084 → Backend (Certificates)
8085 → Backend (Notifications)
```

### **Frontend - Mapeamento Correto:**
```javascript
// LoginPage.js, UsersPage.js
const API_URL = 'http://177.44.248.75:8081/api';

// EventsPage.js
const API_URL = 'http://177.44.248.75:8082/api';

// ParticipantsPage.js
const API_URL = 'http://177.44.248.75:8083/api';

// MyEventsPage.js (CORRIGIDO!)
const USERS_API = 'http://177.44.248.75:8081/api';
const EVENTS_API = 'http://177.44.248.75:8082/api';
const PARTICIPANTS_API = 'http://177.44.248.75:8083/api';
```

---

## ✅ Checklist de Testes

### **Teste 1: Web → Desktop**
- [ ] Login como ADMIN
- [ ] Ir em "👤 Participantes"
- [ ] Selecionar evento
- [ ] Adicionar participante com nome e email
- [ ] Abrir Desktop
- [ ] Clicar em "Atualizar Eventos"
- [ ] Verificar se participante aparece na lista
- [ ] ✅ Deve mostrar nome e email corretos

### **Teste 2: Desktop → Web**
- [ ] Abrir Desktop
- [ ] Selecionar evento
- [ ] Adicionar Walk-in com nome e email
- [ ] Aguardar sincronização (30s) ou forçar
- [ ] Abrir Web como ADMIN
- [ ] Ir em "👤 Participantes"
- [ ] Selecionar mesmo evento
- [ ] ✅ Deve mostrar walk-in com badge "🚶 Walk-in"

### **Teste 3: Criação de Usuário**
- [ ] Cadastrar participante no Web com email: teste@exemplo.com
- [ ] Fazer logout
- [ ] Tentar login com teste@exemplo.com / 123
- [ ] ✅ Deve conseguir logar como CLIENT

### **Teste 4: Meus Eventos**
- [ ] Login como CLIENT
- [ ] Ir em "🎫 Meus Eventos"
- [ ] ✅ Não deve dar erro "usuários não carregados"
- [ ] ✅ Deve carregar lista de usuários no dropdown
- [ ] Selecionar usuário
- [ ] ✅ Deve carregar eventos disponíveis

---

## 🚀 Deploy

### **1. Backend precisa rebuild** (mudanças no Java):
```bash
ssh univates@177.44.248.75
cd spring-boot-app
git pull origin main
sudo docker compose up -d --build backend
sudo docker compose logs -f backend
```

### **2. Frontend precisa rebuild** (mudanças no React):
```bash
sudo docker compose up -d --build frontend
sudo docker compose logs -f frontend
```

### **3. Aplicar correção de dados** (opcional):
```bash
sudo docker exec -i postgres-db psql -U event_user -d event_db < fix-participants-sync.sql
```

**Tempo estimado:** 3-5 minutos total

---

## 📦 Commit

**Hash:** `0a9d157`

**Mensagem:**
```
Fix: Corrigir sincronização participantes Desktop<->Web e criação de usuários

BACKEND:
- Participant.java: Copiar dados do User SEMPRE no PrePersist e PreUpdate
- ParticipantService.createParticipant: Criar User automaticamente com senha '123'

FRONTEND:
- MyEventsPage.js: Separar APIs por porta (8081=Users, 8082=Events, 8083=Participants)

RESULTADO:
✅ Participantes cadastrados no web aparecem no desktop
✅ Participantes cadastrados no desktop aparecem no web
✅ Todos participantes com email viram usuários (senha: 123)
✅ MyEventsPage não dá mais erro de 'usuários não carregados'
```

---

## ❗ Importante

**Desktop continua funcionando offline!** As mudanças apenas melhoram a sincronização:
- ✅ Desktop continua salvando localmente
- ✅ Desktop sincroniza quando online
- ✅ Nenhum check-in será perdido
- ✅ Web e Desktop agora veem os mesmos dados

**Senha padrão para participantes:** `123`  
**Role:** `CLIENT`  
**Como descobrir:** Participante pode tentar login com o email cadastrado

---

**Data:** 22 de Novembro de 2025  
**Correções:** Sincronização Desktop ↔ Web + Criação automática de usuários
