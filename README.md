# 🎫 Sistema de Gestão de Eventos - Spring Boot + React

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=for-the-badge&logo=electron)

Sistema completo de gestão de eventos com check-in, certificados digitais, notificações e aplicativo desktop offline.

[📖 API](#-endpoints-da-api) • [🏗️ Arquitetura](#️-arquitetura) • [🚀 Quick Start](#-quick-start) • [🐳 Docker](#-docker)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Quick Start](#-quick-start)
- [Arquitetura](#️-arquitetura)
- [Endpoints da API](#-endpoints-da-api)
- [Acesso ao Banco de Dados](#-acesso-ao-banco-de-dados)
- [Docker](#-docker)

---

## 🎯 Visão Geral

Plataforma completa para gestão de eventos presenciais, desenvolvida com Spring Boot e React, incluindo:

- ✅ **Gestão de Eventos** - Criação, edição e controle de eventos
- ✅ **Sistema de Participantes** - Inscrições online e walk-ins
- ✅ **Check-in Digital** - Aplicativo desktop Electron para check-in offline
- ✅ **Certificados PDF** - Geração automática com validação por QR Code
- ✅ **Notificações** - Sistema de alertas para participantes
- ✅ **Logs de Atividade** - Rastreamento completo de ações
- ✅ **Autenticação JWT** - Login seguro com roles (ADMIN/CLIENT)
- ✅ **Arquitetura de Microserviços** - API Gateway com portas segregadas

### 🎨 Funcionalidades por Módulo

| Módulo | Recursos |
|--------|----------|
| 🎪 **Eventos** | Criar, editar, ativar/desativar, finalizar eventos manualmente |
| 👥 **Usuários** | Cadastro com roles, autenticação JWT, gestão de perfis |
| 🎟️ **Participantes** | Inscrição online, walk-ins, estatísticas por evento/usuário |
| ✅ **Check-in** | Desktop app offline, sincronização automática, histórico |
| 📜 **Certificados** | Geração PDF com iText, validação por código único, visualização inline |
| 🔔 **Notificações** | Alertas personalizados, marcação de leitura, filtros |
| 📊 **Activity Logs** | Registro de ações, filtros por evento/usuário/nível |

---

## 🛠️ Tecnologias

### Backend
- **Java 17** - LTS com recursos modernos
- **Spring Boot 3.1.5** - Framework principal
- **Spring Data JPA** - ORM para PostgreSQL
- **Spring Security** - Autenticação JWT
- **Spring Mail** - Envio de notificações
- **iText 7** - Geração de certificados PDF
- **Lombok** - Redução de boilerplate
- **Maven** - Gerenciamento de dependências

### Frontend
- **React 18.2.0** - Biblioteca UI
- **Axios** - Cliente HTTP
- **CSS3** - Estilização inline/modular

### Desktop
- **Electron** - App desktop multiplataforma
- **Node.js 18** - Runtime JavaScript
- **LocalStorage** - Armazenamento offline de check-ins

### Infraestrutura
- **PostgreSQL 15 Alpine** - Banco de dados relacional
- **Docker & Docker Compose** - Containerização
- **Nginx** - API Gateway e servidor frontend
- **Multi-stage builds** - Otimização de imagens Docker

---

## 🚀 Quick Start

### Docker Compose (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/FarwBr/spring-boot-app.git
cd spring-boot-app

# 2. Inicie todos os serviços
docker-compose up -d --build

# 3. Aguarde ~30 segundos para inicialização completa
docker-compose logs -f spring-backend
```

### ✅ Serviços Disponíveis

| Serviço | URL | Porta | Descrição |
|---------|-----|-------|-----------|
| 🌐 **Frontend React** | http://localhost:3000 | 3000 | Interface web principal |
| 🔧 **Backend Spring** | http://localhost:8080 | 8080 | API REST principal |
| 👥 **User Service** | http://localhost:8081/api/users | 8081 | Gestão de usuários |
| 🎪 **Event Service** | http://localhost:8082/api/events | 8082 | Gestão de eventos |
| 🎟️ **Participant Service** | http://localhost:8083/api/participants | 8083 | Inscrições/participantes |
| 📜 **Certificate Service** | http://localhost:8084/api/certificates | 8084 | Certificados PDF |
| 🔔 **Notification Service** | http://localhost:8085/api/notifications | 8085 | Notificações |
| 🗄️ **PostgreSQL** | localhost:5432 | 5432 | Banco de dados |

**Credenciais PostgreSQL:**
- Database: `springdb`
- Username: `postgres`
- Password: `postgres`

### 🖥️ Aplicativo Desktop Check-in

```bash
cd desktop-checkin
npm install
npm start
```

Consulte `desktop-checkin/GUIA_USO.md` para instruções detalhadas.

---

## 🏗️ Arquitetura

### Visão Geral do Sistema

```
┌─────────────────────┐
│   Browser (Web)     │
│  - Login/Dashboard  │
│  - Gestão Eventos   │
│  - Meus Eventos     │
│  - Participantes    │
│  - Certificados     │
└──────────┬──────────┘
           │ HTTP :3000
           ↓
┌─────────────────────────────────┐
│   React Frontend (Nginx)        │
│  📄 LoginPage.js                │
│  📄 EventsPage.js               │
│  📄 MyEventsPage.js             │
│  📄 ParticipantsPage.js         │
│  📄 UsersPage.js                │
│  📄 NotificationsPage.js        │
│  📄 LogsPage.js                 │
│  📄 CertificateValidation.js    │
└──────────┬──────────────────────┘
           │ REST API
           ↓
┌──────────────────────────────────────┐
│      Nginx API Gateway               │
│   Port Segregation by Service:       │
│   :8081 (Users)                      │
│   :8082 (Events)                     │
│   :8083 (Participants)               │
│   :8084 (Certificates)               │
│   :8085 (Notifications)              │
└──────────┬───────────────────────────┘
           │
           ↓
┌────────────────────────────────────────────┐
│   Spring Boot Backend :8080                │
│  ┌──────────────────────────────────────┐  │
│  │       Controller Layer               │  │
│  │  🔐 AuthController (JWT)             │  │
│  │  👤 UserController                   │  │
│  │  🎪 EventController                  │  │
│  │  🎟️ ParticipantController            │  │
│  │  ✅ CheckInController                │  │
│  │  📜 CertificateController (PDF)      │  │
│  │  🔔 NotificationController           │  │
│  │  📊 ActivityLogController            │  │
│  └──────────┬───────────────────────────┘  │
│             ↓                              │
│  ┌──────────────────────────────────────┐  │
│  │       Service Layer                  │  │
│  │  - UserService                       │  │
│  │  - EventService                      │  │
│  │  - ParticipantService                │  │
│  │  - CheckInService                    │  │
│  │  - CertificateService (iText)        │  │
│  │  - NotificationService (Mail)        │  │
│  │  - ActivityLogService                │  │
│  └──────────┬───────────────────────────┘  │
│             ↓                              │
│  ┌──────────────────────────────────────┐  │
│  │       Repository Layer (JPA)         │  │
│  │  - UserRepository                    │  │
│  │  - EventRepository                   │  │
│  │  - ParticipantRepository             │  │
│  │  - CheckInRepository                 │  │
│  │  - NotificationRepository            │  │
│  │  - ActivityLogRepository             │  │
│  └──────────┬───────────────────────────┘  │
└─────────────┼────────────────────────────────┘
              │ JDBC
              ↓
┌───────────────────────────────────┐
│   PostgreSQL 15 Alpine :5432      │
│  📊 Database: springdb             │
│  ┌─────────────────────────────┐  │
│  │ Tables:                     │  │
│  │  • users (id, name, email,  │  │
│  │           role, password)   │  │
│  │  • events (id, name,        │  │
│  │            startTime,       │  │
│  │            endTime, active, │  │
│  │            finished)        │  │
│  │  • participants (id, name,  │  │
│  │                 checkedIn,  │  │
│  │                 event_id,   │  │
│  │                 user_id)    │  │
│  │  • checkins                 │  │
│  │  • notifications            │  │
│  │  • activity_logs            │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘

┌─────────────────────────────────┐
│  Electron Desktop App (Offline) │
│  - Check-in participantes        │
│  - Sync automática quando online │
│  - LocalStorage persistência     │
└─────────────────────────────────┘
```

### Relacionamentos de Entidades

```
User (1) ─────< (N) Event (creator)
User (1) ─────< (N) Participant (registration)
User (1) ─────< (N) Notification

Event (1) ─────< (N) Participant
Event (1) ─────< (N) CheckIn
Event (1) ─────< (N) ActivityLog

Participant (1) ───── (1) CheckIn
Participant (1) ─────< (N) Certificate (validation)
```

---

## 📖 Endpoints da API

### 🔐 Autenticação `/api/auth`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registra novo usuário |
| POST | `/api/auth/login` | Login com JWT token |

**Exemplo Login:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "senha123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "id": 1,
  "name": "Admin",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

---

### 👥 Usuários `/api/users` (Porta 8081)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Lista todos os usuários |
| GET | `/api/users/{id}` | Busca usuário por ID |
| POST | `/api/users` | Cria novo usuário |
| PUT | `/api/users/{id}` | Atualiza usuário |
| DELETE | `/api/users/{id}` | Remove usuário |

**Exemplo:**
```json
POST /api/users
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "CLIENT",
  "cpf": "12345678900",
  "phone": "(51) 98765-4321"
}
```

---

### 🎪 Eventos `/api/events` (Porta 8082)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/events` | Lista todos os eventos |
| GET | `/api/events/active` | Lista eventos ativos |
| GET | `/api/events/current` | Eventos acontecendo agora |
| GET | `/api/events/{id}` | Busca evento por ID |
| GET | `/api/events/location/{location}` | Eventos por localização |
| GET | `/api/events/range?start=&end=` | Eventos por período |
| POST | `/api/events` | Cria novo evento |
| PUT | `/api/events/{id}` | Atualiza evento |
| PATCH | `/api/events/{id}/toggle-active` | Ativa/desativa evento |
| POST | `/api/events/{id}/finish` | Finaliza evento manualmente |
| DELETE | `/api/events/{id}` | Remove evento |

**Exemplo:**
```json
POST /api/events
{
  "name": "Workshop React 2025",
  "description": "Aprenda React do zero",
  "location": "Sala 101",
  "startTime": "2025-12-01T14:00:00",
  "endTime": "2025-12-01T18:00:00",
  "maxCapacity": 50,
  "requiresRegistration": true
}
```

---

### 🎟️ Participantes `/api/participants` (Porta 8083)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/participants` | Lista todos os participantes |
| GET | `/api/participants/event/{eventId}` | Participantes de um evento |
| GET | `/api/participants/user/{userId}` | Participações de um usuário |
| GET | `/api/participants/event/{eventId}/pending` | Sem check-in |
| GET | `/api/participants/event/{eventId}/checked-in` | Com check-in |
| GET | `/api/participants/event/{eventId}/walk-ins` | Walk-ins do evento |
| GET | `/api/participants/event/{eventId}/stats` | Estatísticas do evento |
| GET | `/api/participants/user/{userId}/stats` | Estatísticas do usuário |
| GET | `/api/participants/{id}` | Busca participante por ID |
| POST | `/api/participants/user/{userId}/event/{eventId}/register` | Inscreve usuário |
| POST | `/api/participants/event/{eventId}` | Cria participante |
| POST | `/api/participants/event/{eventId}/walk-in` | Registra walk-in |
| PUT | `/api/participants/{id}` | Atualiza participante |
| PATCH | `/api/participants/{id}/checkin` | Faz check-in |
| POST | `/api/participants/{id}/send-certificate` | Envia certificado por email |
| DELETE | `/api/participants/{id}` | Cancela participação |

**Exemplo Walk-in:**
```json
POST /api/participants/event/1/walk-in
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "phone": "(51) 99999-8888",
  "company": "Tech Corp"
}
```

---

### ✅ Check-ins `/api/checkins` (Porta 8084)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/checkins` | Lista todos os check-ins |
| GET | `/api/checkins/{id}` | Busca check-in por ID |
| GET | `/api/checkins/range?start=&end=` | Check-ins por período |
| GET | `/api/checkins/offline-synced` | Check-ins sincronizados offline |
| POST | `/api/checkins` | Registra check-in |
| POST | `/api/checkins/sync` | Sincroniza check-ins offline |
| PUT | `/api/checkins/{id}` | Atualiza check-in |
| DELETE | `/api/checkins/{id}` | Remove check-in |

**Exemplo Sync Offline:**
```json
POST /api/checkins/sync
[
  {
    "participantId": 1,
    "eventId": 1,
    "checkInTime": "2025-11-24T15:30:00",
    "offlineSync": true
  }
]
```

---

### 📜 Certificados `/api/certificates` (Porta 8084)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/certificates/validate/{code}` | Valida certificado por código |
| GET | `/api/certificates/participant/{participantId}` | Certificado do participante |
| GET | `/api/certificates/participant/{participantId}/event/{eventId}` | Gera/visualiza PDF |

**Exemplo:**
```bash
# Abre certificado no navegador
GET http://localhost:8084/api/certificates/participant/1/event/1

# Retorna PDF com Content-Disposition: inline
# Validação: apenas participantes com check-in realizado
```

---

### 🔔 Notificações `/api/notifications` (Porta 8085)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/notifications` | Lista todas as notificações |
| GET | `/api/notifications/{id}` | Busca notificação por ID |
| GET | `/api/notifications/user/{userId}` | Notificações de um usuário |
| GET | `/api/notifications/user/{userId}/unread` | Não lidas |
| POST | `/api/notifications` | Cria notificação |
| PATCH | `/api/notifications/{id}/read` | Marca como lida |
| PATCH | `/api/notifications/user/{userId}/read-all` | Marca todas como lidas |
| DELETE | `/api/notifications/{id}` | Remove notificação |

---

### 📊 Activity Logs `/api/activity-logs` (Porta 8080)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/activity-logs` | Lista todos os logs |
| GET | `/api/activity-logs/event/{eventId}` | Logs de um evento |
| GET | `/api/activity-logs/user/{userId}` | Logs de um usuário |
| GET | `/api/activity-logs/action/{action}` | Logs por ação |
| GET | `/api/activity-logs/level/{level}` | Logs por nível |
| GET | `/api/activity-logs/range?start=&end=` | Logs por período |
| GET | `/api/activity-logs/stats` | Estatísticas gerais |

**Níveis:** `INFO`, `WARNING`, `ERROR`, `SUCCESS`  
**Ações:** `USER_CREATED`, `EVENT_CREATED`, `CHECKIN_PERFORMED`, `CERTIFICATE_GENERATED`, etc.

---

## 🗄️ Acesso ao Banco de Dados

### Informações de Conexão

| Parâmetro | Valor |
|-----------|-------|
| **Host** | `localhost` |
| **Porta** | `5432` |
| **Database** | `springdb` |
| **Usuário** | `postgres` |
| **Senha** | `postgres` |

### Via Docker CLI

```bash
# Acessar PostgreSQL
docker exec -it postgres-db psql -U postgres -d springdb

# Listar tabelas
\dt

# Ver registros
SELECT * FROM users;
SELECT * FROM events;
SELECT * FROM participants WHERE event_id = 1;
```

### Com DBeaver (Recomendado)

1. **Instalar DBeaver:**
```bash
winget install --id DBeaver.DBeaver -e
```

2. **Configurar Conexão:**
   - Abrir DBeaver
   - Nova Conexão → PostgreSQL
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `springdb`
   - **Username:** `postgres`
   - **Password:** `postgres`
   - Testar Conexão → OK

3. **Explorar Dados:**
   - Schemas → public → Tables
   - 9 tabelas disponíveis: `users`, `events`, `participants`, `checkins`, `notifications`, `activity_logs`, etc.

### Tabelas Principais

```sql
-- Estrutura básica das tabelas

-- USERS
id BIGINT PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255) UNIQUE
password VARCHAR(255)
role VARCHAR(20) -- ADMIN, CLIENT
cpf VARCHAR(14)
phone VARCHAR(20)

-- EVENTS  
id BIGINT PRIMARY KEY
name VARCHAR(255)
description TEXT
location VARCHAR(255)
start_time TIMESTAMP
end_time TIMESTAMP
max_capacity INTEGER
active BOOLEAN
finished BOOLEAN
requires_registration BOOLEAN

-- PARTICIPANTS
id BIGINT PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255)
phone VARCHAR(20)
company VARCHAR(255)
checked_in BOOLEAN
check_in_time TIMESTAMP
is_walk_in BOOLEAN
event_id BIGINT FOREIGN KEY
user_id BIGINT FOREIGN KEY (nullable)

-- CHECKINS
id BIGINT PRIMARY KEY
participant_id BIGINT FOREIGN KEY
event_id BIGINT FOREIGN KEY
check_in_time TIMESTAMP
offline_sync BOOLEAN

-- NOTIFICATIONS
id BIGINT PRIMARY KEY
user_id BIGINT FOREIGN KEY
type VARCHAR(50)
message TEXT
read BOOLEAN
created_at TIMESTAMP
```

---

## 🐳 Docker

### Comandos Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d --build

# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de serviço específico
docker-compose logs -f spring-backend
docker-compose logs -f postgres-db

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (⚠️ APAGA DADOS DO BANCO)
docker-compose down -v

# Rebuild forçado sem cache
docker-compose build --no-cache
docker-compose up -d --build

# Acessar container do backend
docker exec -it spring-backend bash

# Acessar PostgreSQL
docker exec -it postgres-db psql -U postgres -d springdb

# Ver estatísticas de recursos
docker stats
```

### Troubleshooting

**🔴 Docker Desktop não inicia:**
```bash
# Windows: Ativar WSL2
wsl --install
wsl --set-default-version 2

# Reiniciar Docker Desktop
```

**🔴 Backend não conecta ao banco:**
```bash
# Verificar logs do banco
docker-compose logs postgres-db

# Verificar saúde do container
docker inspect postgres-db | grep -i health

# Testar conexão manual
docker exec postgres-db pg_isready -U postgres
```

**🔴 Porta já em uso:**
```bash
# Windows: Encontrar processo usando porta
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Ou alterar porta no docker-compose.yml
ports:
  - "8081:8080"  # Host:Container
```

**🔴 Frontend não acessa backend:**
```bash
# Verificar se backend está respondendo
curl http://localhost:8080/api/users

# Verificar logs de CORS
docker-compose logs api-gateway
```

**🔴 Rebuild não funciona:**
```bash
# Limpar tudo e reconstruir
docker-compose down -v
docker system prune -a --volumes
docker-compose up -d --build
```

### Containers do Sistema

| Container | Imagem | Função |
|-----------|--------|--------|
| `postgres-db` | postgres:15-alpine | Banco de dados PostgreSQL |
| `spring-backend` | spring-boot-app-backend | API REST Spring Boot |
| `react-frontend` | spring-boot-app-frontend | Interface React + Nginx |
| `api-gateway` | spring-boot-app-api-gateway | Gateway Nginx para segregação de portas |

### Volumes Persistentes

```bash
# Listar volumes
docker volume ls

# Inspecionar volume do banco
docker volume inspect spring-boot-app_postgres-data

# Backup do volume
docker run --rm -v spring-boot-app_postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Restaurar backup
docker run --rm -v spring-boot-app_postgres-data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/postgres-backup.tar.gz"
```

---

## 📄 Documentação Adicional

- **Setup Windows**: `SETUP_WINDOWS.md` - Guia completo de instalação no Windows
- **Desktop Check-in**: `desktop-checkin/GUIA_USO.md` - Manual do app Electron
- **Arquitetura**: `ARCHITECTURE.md` - Detalhes técnicos da arquitetura
- **Checklists**: `CHECKLIST_*.md` - Listas de verificação de funcionalidades

---

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/FarwBr/spring-boot-app/issues)
- 📧 **Email**: gutohorst@gmail.com
- 🌐 **Servidor Produção**: http://177.44.248.75:3000

---

<div align="center">

**Desenvolvido com ❤️ para gestão de eventos**

⭐ Dê uma estrela se este projeto te ajudou!

</div>
│   ├── 📂 src/main/
│   │   ├── 📂 java/com/example/
