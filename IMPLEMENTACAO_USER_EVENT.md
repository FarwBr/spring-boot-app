# ✅ IMPLEMENTAÇÃO: Relacionamento User ↔ Event

## 🎯 O QUE FOI IMPLEMENTADO

Implementei o relacionamento correto entre **User** e **Event** através da entidade **Participant**.

---

## 📊 MUDANÇAS NO MODELO

### **1. User.java** (Atualizado)
```java
@Entity
@Table(name = "users")
public class User {
    private Long id;
    private String name;
    private String email;
    private String phone;      // ✅ NOVO
    private String company;    // ✅ NOVO
    private LocalDateTime createdAt;
}
```

**Novos campos:**
- `phone` - Telefone do usuário
- `company` - Empresa do usuário

---

### **2. Participant.java** (Refatorado)
```java
@Entity
@Table(name = "participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "event_id"})  // ✅ NOVO
})
public class Participant {
    private Long id;
    
    // ✅ NOVO: Relacionamento com User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
    // Campos para walk-ins (nullable)
    private String name;
    private String email;
    private String phone;
    private String company;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    private Boolean checkedIn = false;
    private LocalDateTime checkInTime;
    private Boolean isWalkIn = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // ✅ NOVOS: Helper methods
    public String getDisplayName() {
        return user != null ? user.getName() : name;
    }
    
    public String getDisplayEmail() {
        return user != null ? user.getEmail() : email;
    }
}
```

**Principais mudanças:**
1. **user_id** agora é FK para `users`
2. **Constraint UNIQUE** (user_id + event_id) - Usuário não pode se inscrever 2x no mesmo evento
3. **Campos name/email/phone/company** agora são opcionais (para usuários registrados)
4. **Helper methods** para pegar dados do user ou do walk-in

---

## 🔧 FUNCIONALIDADES IMPLEMENTADAS

### **Backend**

#### **1. ParticipantRepository** (Novos métodos)
```java
List<Participant> findByUserId(Long userId);
Optional<Participant> findByUserIdAndEventId(Long userId, Long eventId);
Long countByUserId(Long userId);
```

#### **2. ParticipantService** (Novos métodos)
```java
// Usuário se inscrever em evento
Participant registerUserToEvent(Long userId, Long eventId);

// Buscar eventos de um usuário
List<Participant> getParticipantsByUser(Long userId);

// Contar eventos do usuário
Long getUserEventsCount(Long userId);
```

**Validações implementadas:**
- ✅ Verifica se usuário já está inscrito
- ✅ Verifica capacidade máxima do evento
- ✅ Previne check-in duplicado
- ✅ Usa exceptions customizadas (ResourceNotFoundException, BadRequestException)

#### **3. ParticipantController** (Novos endpoints)
```java
// Listar eventos de um usuário
GET /api/participants/user/{userId}

// Estatísticas do usuário
GET /api/participants/user/{userId}/stats

// Inscrever usuário em evento
POST /api/participants/user/{userId}/event/{eventId}/register
```

---

## 🌐 NOVOS ENDPOINTS API

### **1. Inscrever usuário em evento**
```http
POST /api/participants/user/{userId}/event/{eventId}/register
```

**Exemplo:**
```bash
POST http://localhost:8080/api/participants/user/1/event/5/register
```

**Resposta (201 Created):**
```json
{
  "id": 10,
  "user": { "id": 1, "name": "João Silva", "email": "joao@email.com" },
  "event": { "id": 5, "name": "Workshop de Spring Boot" },
  "checkedIn": false,
  "isWalkIn": false,
  "createdAt": "2025-11-18T10:30:00"
}
```

**Erros possíveis:**
- `404 Not Found` - Usuário ou evento não existe
- `400 Bad Request` - Usuário já inscrito ou evento lotado

---

### **2. Listar eventos de um usuário**
```http
GET /api/participants/user/{userId}
```

**Exemplo:**
```bash
GET http://localhost:8080/api/participants/user/1
```

**Resposta:**
```json
[
  {
    "id": 10,
    "event": { "id": 5, "name": "Workshop de Spring Boot", "startTime": "2025-11-20T14:00:00" },
    "checkedIn": false,
    "checkInTime": null
  },
  {
    "id": 15,
    "event": { "id": 8, "name": "Meetup DevOps", "startTime": "2025-11-25T19:00:00" },
    "checkedIn": true,
    "checkInTime": "2025-11-25T19:15:00"
  }
]
```

---

### **3. Estatísticas do usuário**
```http
GET /api/participants/user/{userId}/stats
```

**Exemplo:**
```bash
GET http://localhost:8080/api/participants/user/1/stats
```

**Resposta:**
```json
{
  "totalEvents": 3
}
```

---

## 🎨 FRONTEND (A IMPLEMENTAR)

### **Página "Meus Eventos"**

Precisa criar em `frontend/src/pages/MyEventsPage.js`:

```javascript
// Funcionalidades:
1. Seletor de usuário (dropdown)
2. Botão "Buscar Eventos Disponíveis"
3. Lista de eventos disponíveis com botão "Inscrever-se"
4. Lista de "Meus Eventos" (inscritos)
5. Mostrar se já fez check-in
6. Contador de eventos
```

### **Service necessário**

Criar `frontend/src/services/myEventsService.js`:

```javascript
export const getAvailableEvents = () => axios.get('/api/events/active');
export const getMyEvents = (userId) => axios.get(`/api/participants/user/${userId}`);
export const registerToEvent = (userId, eventId) => 
    axios.post(`/api/participants/user/${userId}/event/${eventId}/register`);
export const getUserStats = (userId) => axios.get(`/api/participants/user/${userId}/stats`);
```

---

## 🔄 FLUXO COMPLETO

### **1. Usuário se cadastra no sistema**
```
POST /api/users
{ "name": "João", "email": "joao@email.com", "phone": "51999999999", "company": "TechCorp" }
```

### **2. Admin cria evento**
```
POST /api/events
{ "name": "Workshop Spring Boot", "startTime": "2025-11-20T14:00:00", ... }
```

### **3. Usuário se inscreve no evento**
```
POST /api/participants/user/1/event/5/register
```

### **4. Sistema cria Participant vinculado**
```sql
INSERT INTO participants (user_id, event_id, checked_in, is_walk_in) 
VALUES (1, 5, false, false);
```

### **5. No dia do evento: Check-in (Desktop)**
```
PATCH /api/participants/10/checkin
```

### **6. Após check-in: Enviar certificado (FUTURO)**
```
POST /api/notifications (EMAIL com certificado PDF)
```

---

## 📊 ESTRUTURA DO BANCO

### **Tabela `users`**
```sql
id BIGSERIAL PRIMARY KEY
name VARCHAR(255) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
phone VARCHAR(50)
company VARCHAR(255)
created_at TIMESTAMP
```

### **Tabela `participants`**
```sql
id BIGSERIAL PRIMARY KEY
user_id BIGINT REFERENCES users(id)  -- ✅ NOVO
event_id BIGINT NOT NULL REFERENCES events(id)
name VARCHAR(255)  -- Para walk-ins
email VARCHAR(255)  -- Para walk-ins
phone VARCHAR(50)
company VARCHAR(255)
checked_in BOOLEAN DEFAULT FALSE
check_in_time TIMESTAMP
is_walk_in BOOLEAN DEFAULT FALSE
created_at TIMESTAMP
updated_at TIMESTAMP
UNIQUE(user_id, event_id)  -- ✅ NOVO
```

---

## ✅ VALIDAÇÕES IMPLEMENTADAS

1. **Inscrição duplicada:** Usuário não pode se inscrever 2x no mesmo evento
2. **Capacidade máxima:** Verifica se evento está lotado
3. **Check-in duplicado:** Não permite check-in 2x
4. **Usuário/Evento inexistente:** Retorna 404
5. **Dados do user:** Quando user se inscreve, dados são copiados automaticamente

---

## 🎯 TIPOS DE PARTICIPANTES

### **1. Usuário Registrado (user_id preenchido)**
```json
{
  "id": 10,
  "user": { "id": 1, "name": "João", "email": "joao@email.com" },
  "event": { "id": 5 },
  "isWalkIn": false,
  "name": null,  // Pega do user
  "email": null  // Pega do user
}
```

### **2. Walk-in (user_id = null)**
```json
{
  "id": 11,
  "user": null,
  "event": { "id": 5 },
  "isWalkIn": true,
  "name": "Maria Santos",
  "email": "maria@email.com"
}
```

---

## 🚀 PRÓXIMOS PASSOS

### **Para a apresentação de amanhã:**

**OPÇÃO 1: Implementar frontend completo**
- ✅ Criar MyEventsPage.js
- ✅ Adicionar no App.js
- ✅ Criar service
- ⏱️ Tempo estimado: 30-40 minutos

**OPÇÃO 2: Demonstrar via API (Swagger/Postman)**
- ✅ Mostrar endpoints funcionando
- ✅ Explicar o relacionamento
- ✅ Mostrar no banco de dados
- ⏱️ Tempo: Imediato

### **O que você prefere?**

Me diga e eu implemento agora! 🚀

---

## 📝 RESUMO

**✅ IMPLEMENTADO:**
- Relacionamento User ↔ Event via Participant
- Campos adicionais em User (phone, company)
- Constraint UNIQUE para prevenir inscrições duplicadas
- Novos métodos em Repository, Service, Controller
- 3 novos endpoints API
- Validações completas
- Suporte a walk-ins e usuários registrados

**❌ FALTA IMPLEMENTAR:**
- Frontend "Meus Eventos"
- Sistema de certificados (PDF + Email)

**Status:** Backend 100% funcional! 🎉
