# Arquitetura de Microsserviços - Sistema de Gestão de Eventos

## 📋 Visão Geral

O sistema foi refatorado para uma arquitetura baseada em **microsserviços com API Gateway**, onde cada funcionalidade está acessível através de uma porta dedicada.

## 🏗️ Componentes

### 1. API Gateway (Nginx)
- **Função**: Rotear requisições para o backend Spring Boot
- **Portas Expostas**: 8081, 8082, 8083, 8084, 8085
- **Container**: `api-gateway`
- **Configuração**: `/api-gateway/nginx.conf`

### 2. Backend (Spring Boot)
- **Porta Interna**: 8080
- **Container**: `spring-backend`
- **Função**: API REST monolítica (não exposta diretamente)

### 3. Frontend (React)
- **Porta**: 3000
- **Container**: `react-frontend`
- **Função**: Interface web do usuário

### 4. Database (PostgreSQL)
- **Porta**: 5432
- **Container**: `postgres-db`
- **Banco**: springdb

## 🔌 Mapeamento de Portas

| Porta | Serviço | Rota | Descrição |
|-------|---------|------|-----------|
| **8081** | User Service | `/api/users` | Gerenciamento de usuários |
| **8082** | Event Service | `/api/events` | Gerenciamento de eventos |
| **8083** | Participant Service | `/api/participants` | Gerenciamento de participantes |
| **8084** | Certificate Service | `/api/checkin` | Check-in e certificados |
| **8085** | Notification Service | `/api/notifications` | Notificações e emails |

## 📡 Fluxo de Requisições

```
Frontend (3000)
    ↓
API Gateway (8081-8085)
    ↓
Backend Spring Boot (8080)
    ↓
PostgreSQL (5432)
```

## 🛠️ Como Funciona

### Exemplo: Buscar Usuários

1. **Frontend** faz requisição para: `http://localhost:8081/api/users`
2. **API Gateway** (Nginx) recebe na porta 8081
3. **Nginx** roteia para: `http://backend:8080/api/users`
4. **Backend** processa e retorna os dados
5. **Dados** retornam pelo mesmo caminho

## 📁 Estrutura de Arquivos

```
spring-boot-app/
├── api-gateway/
│   ├── Dockerfile
│   └── nginx.conf              # Configuração de roteamento
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/example/
│           │   ├── controller/  # UserController, EventController, etc.
│           │   ├── service/     # UserService, EventService, etc.
│           │   ├── repository/  # Acesso ao banco
│           │   └── model/       # Entidades JPA
│           └── resources/
│               └── application.properties
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── services/
│       │   ├── userService.js        # Porta 8081
│       │   ├── eventService.js       # Porta 8082
│       │   ├── participantService.js # Porta 8083
│       │   └── notificationService.js # Porta 8085
│       └── pages/
└── docker-compose.yml
```

## 🚀 Comandos

### Iniciar o Sistema
```bash
docker-compose up -d
```

### Reconstruir e Iniciar
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Ver Logs
```bash
# API Gateway
docker logs api-gateway

# Backend
docker logs spring-backend

# Frontend
docker logs react-frontend
```

### Testar Portas
```powershell
# User Service
Invoke-RestMethod http://localhost:8081/api/users

# Event Service
Invoke-RestMethod http://localhost:8082/api/events

# Participant Service
Invoke-RestMethod http://localhost:8083/api/participants/event/1

# Notification Service
Invoke-RestMethod http://localhost:8085/api/notifications
```

## ✅ Vantagens desta Arquitetura

1. **Separação de Responsabilidades**: Cada porta representa um domínio específico
2. **Facilidade de Monitoramento**: Pode monitorar tráfego por porta
3. **Segurança**: Pode aplicar regras de firewall por serviço
4. **Escalabilidade**: No futuro pode separar em microsserviços reais
5. **Demonstração**: Mostra conhecimento de arquitetura distribuída

## 📊 Status Atual

✅ **User Service (8081)**: Funcionando  
✅ **Event Service (8082)**: Funcionando  
✅ **Participant Service (8083)**: Funcionando  
✅ **Certificate Service (8084)**: Funcionando  
✅ **Notification Service (8085)**: Funcionando  

## 🔧 Configurações Importantes

### Nginx (api-gateway/nginx.conf)
- CORS configurado para permitir requisições do frontend
- Proxy headers configurados corretamente
- Timeouts ajustados para 600 segundos

### Frontend Services
- Cada service aponta para sua porta dedicada
- URLs hardcoded para evitar problemas de variáveis de ambiente

### Backend
- Continua monolítico (mais fácil de manter)
- Não requer mudanças no código Java
- Todos os controllers funcionam normalmente

## 🎯 Para Apresentação

Demonstre que o sistema tem **5 serviços independentes**:

1. Abra 5 abas do browser/Postman
2. Teste cada porta separadamente
3. Mostre que cada uma retorna dados diferentes
4. Explique o papel do API Gateway
5. Mostre o docker-compose.yml com as portas expostas

## 📝 Observações

- O backend na porta 8080 **não** está exposto externamente
- Apenas o API Gateway (8081-8085) está acessível
- Frontend conecta apenas via API Gateway
- PostgreSQL só é acessível internamente na rede Docker
