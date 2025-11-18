# 📋 GUIA COMPLETO DE INSTALAÇÃO E USO

## ✅ Status do Projeto

**Última atualização:** 17 de Novembro de 2025

### 🎯 Implementações Concluídas

#### Backend (100% Funcional)
- ✅ **8 Entidades JPA** completas com validações
- ✅ **8 Controllers REST** com todos os endpoints
- ✅ **8 Services** com lógica de negócio
- ✅ **8 Repositories** com queries customizadas
- ✅ **GlobalExceptionHandler** - Tratamento centralizado de erros
- ✅ **Custom Exceptions** - ResourceNotFoundException e BadRequestException
- ✅ **Swagger/OpenAPI** - Documentação automática
- ✅ **OrderItems** - Sistema de pedidos com múltiplos itens

#### Frontend (100% Funcional)
- ✅ **7 Páginas React** (Users, Products, Orders, Payments, Notifications, Events, Participants)
- ✅ **7 Services** para comunicação com API
- ✅ **CSS Moderno** com animações e responsividade
- ✅ **Formulários completos** para CRUD
- ✅ **Feedback visual** com badges, alerts e loading states

#### Infraestrutura
- ✅ **Docker Compose** - Orquestração completa
- ✅ **PostgreSQL** - Banco de dados
- ✅ **Multi-stage builds** - Otimização de imagens
- ✅ **Health checks** - Monitoramento de serviços

---

## 🚀 INSTALAÇÃO E EXECUÇÃO

### Opção 1: Docker Compose (Recomendado - Mais Rápido)

#### Pré-requisitos
- Docker Desktop instalado
- 4GB RAM disponível
- 5GB espaço em disco

#### Passos

```powershell
# 1. Navegar até a pasta do projeto
cd c:\Users\Gustavo\Documents\GitHub\spring-boot-app

# 2. Iniciar todos os serviços (PostgreSQL + Backend + Frontend)
docker-compose up --build

# 3. Aguardar mensagem "Started Application in X seconds"
# Pronto! ✅
```

#### Acessos
- 🌐 **Frontend React**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080/api
- 📖 **Swagger UI**: http://localhost:8080/swagger-ui.html
- 🗄️ **PostgreSQL**: localhost:5432 (user: postgres, pass: postgres)

#### Parar os serviços
```powershell
docker-compose down
```

#### Limpar tudo e recomeçar
```powershell
docker-compose down -v  # Remove volumes (limpa banco)
docker-compose up --build --force-recreate
```

---

### Opção 2: Desenvolvimento Local

#### Pré-requisitos
- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+ (ou via Docker)

#### 1. Banco de Dados

```powershell
# Iniciar PostgreSQL via Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=springdb -p 5432:5432 -d postgres:15-alpine
```

#### 2. Backend

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

Backend iniciará em: http://localhost:8080

#### 3. Frontend

```powershell
cd frontend
npm install
npm start
```

Frontend iniciará em: http://localhost:3000

---

## 📚 GUIA DE USO

### 1. Gerenciar Usuários

**Acessar:** http://localhost:3000 → Usuários

**Criar usuário:**
1. Preencha o formulário (nome, email, CPF, telefone)
2. Clique em "Adicionar Usuário"

**Editar usuário:**
1. Clique em "Editar" na lista
2. Modifique os campos
3. Clique em "Atualizar"

**Excluir usuário:**
1. Clique em "Excluir"
2. Confirme a exclusão

---

### 2. Gerenciar Produtos

**Acessar:** Produtos

**Criar produto:**
- Nome, descrição, preço, estoque, categoria

**Atualizar estoque:**
- Edite o produto e altere quantidade

---

### 3. Gerenciar Pedidos

**Acessar:** Pedidos

**Criar pedido:**
1. Selecione o usuário
2. Sistema calculará total automaticamente com base nos itens
3. Status inicial: PENDING

**Atualizar status:**
- Use o dropdown para mudar: PENDING → PROCESSING → SHIPPED → DELIVERED

---

### 4. Processar Pagamentos

**Acessar:** Pagamentos

**Criar pagamento:**
1. Vincule ao pedido
2. Escolha método (CREDIT_CARD, DEBIT_CARD, PIX, BANK_SLIP)
3. Status inicial: PENDING

**Processar:**
- Botão "Processar Pagamento" → PROCESSING
- Botão "Completar Pagamento" → COMPLETED

---

### 5. Gerenciar Notificações

**Acessar:** Notificações

**Criar notificação:**
- Selecione usuário
- Tipo: ORDER_STATUS, PAYMENT_STATUS, PROMOTION, SYSTEM
- Mensagem

**Marcar como lida:**
- Clique em "Marcar como Lida"

**Filtrar:**
- Ver apenas não lidas de um usuário

---

### 6. Gerenciar Eventos ⭐ NOVO

**Acessar:** Eventos

**Criar evento:**
1. Nome, descrição, local
2. Data/hora início e fim
3. Capacidade máxima
4. Ativo/Inativo

**Editar evento:**
- Clique em "Editar"

**Ativar/Desativar:**
- Controla se evento aceita novos participantes

---

### 7. Gerenciar Participantes ⭐ NOVO

**Acessar:** Participantes

**Workflow:**
1. **Selecionar evento** (dropdown)
2. **Ver estatísticas** (total, check-in feito, pendentes)
3. **Adicionar participante** (pré-cadastro)
4. **Fazer check-in** (botão verde)

**Tipos de participante:**
- 📝 **Pré-cadastro**: Adicionado antes do evento
- 🚶 **Walk-in**: Adicionado no dia (via app desktop)

---

## 🔧 DOCUMENTAÇÃO DA API

### Swagger UI (Interface Interativa)

🔗 http://localhost:8080/swagger-ui.html

- ✅ Testar todos endpoints
- ✅ Ver schemas de request/response
- ✅ Exemplos de uso

### Endpoints Principais

#### Usuários (`/api/users`)
```
GET    /api/users              # Listar todos
GET    /api/users/{id}         # Buscar por ID
POST   /api/users              # Criar
PUT    /api/users/{id}         # Atualizar
DELETE /api/users/{id}         # Deletar
```

#### Produtos (`/api/products`)
```
GET    /api/products           # Listar todos
POST   /api/products           # Criar
PUT    /api/products/{id}      # Atualizar
PATCH  /api/products/{id}/stock # Atualizar estoque
DELETE /api/products/{id}      # Deletar
```

#### Pedidos (`/api/orders`)
```
GET    /api/orders             # Listar todos
GET    /api/orders/{id}        # Buscar por ID
GET    /api/orders/user/{id}   # Pedidos de usuário
POST   /api/orders             # Criar (com items)
PATCH  /api/orders/{id}/status # Atualizar status
DELETE /api/orders/{id}        # Deletar
```

#### Pagamentos (`/api/payments`)
```
GET    /api/payments           # Listar todos
POST   /api/payments           # Criar
PATCH  /api/payments/{id}/process  # Processar
PATCH  /api/payments/{id}/complete # Completar
```

#### Notificações (`/api/notifications`)
```
GET    /api/notifications                        # Listar todas
GET    /api/notifications/user/{id}/unread      # Não lidas
POST   /api/notifications                        # Criar
PATCH  /api/notifications/{id}/read             # Marcar lida
```

#### Eventos (`/api/events`)
```
GET    /api/events             # Listar todos
GET    /api/events/active      # Apenas ativos
GET    /api/events/current     # Acontecendo agora
POST   /api/events             # Criar
PUT    /api/events/{id}        # Atualizar
PATCH  /api/events/{id}/toggle-active # Ativar/Desativar
DELETE /api/events/{id}        # Deletar
```

#### Participantes (`/api/participants`)
```
GET    /api/participants/event/{eventId}                # Todos do evento
GET    /api/participants/event/{eventId}/pending        # Pendentes
GET    /api/participants/event/{eventId}/checked-in     # Com check-in
GET    /api/participants/event/{eventId}/stats          # Estatísticas
POST   /api/participants/event/{eventId}                # Adicionar
POST   /api/participants/event/{eventId}/walk-in        # Walk-in
PATCH  /api/participants/{id}/checkin                   # Fazer check-in
DELETE /api/participants/{id}                           # Deletar
```

---

## 🐛 TROUBLESHOOTING

### Backend não inicia

```powershell
# Verificar logs
docker-compose logs backend

# Rebuild sem cache
docker-compose build --no-cache backend
docker-compose up backend
```

### Banco não conecta

```powershell
# Verificar se PostgreSQL está rodando
docker-compose ps

# Testar conexão
docker exec spring-boot-app-postgres-1 pg_isready

# Recriar banco
docker-compose down -v
docker-compose up -d postgres
```

### Frontend não carrega

```powershell
# Verificar se backend está respondendo
curl http://localhost:8080/api/users

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up frontend
```

### Porta em uso

```powershell
# Verificar o que está usando a porta 8080
netstat -ano | findstr :8080

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou alterar porta no docker-compose.yml
# ports: - "8081:8080"
```

### Erro de CORS

Se encontrar erros de CORS:
1. Verifique se backend está rodando em http://localhost:8080
2. Verifique se frontend está em http://localhost:3000
3. Confirme variável `REACT_APP_API_URL` no frontend

---

## 📊 ARQUITETURA DO SISTEMA

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ Port 3000
       ↓
┌──────────────────┐
│ React Frontend   │
│ (Nginx)          │
└──────┬───────────┘
       │ REST API (Port 8080)
       ↓
┌──────────────────────────┐
│   Spring Boot Backend    │
│  - Controllers           │
│  - Services              │
│  - Repositories          │
│  - Exception Handling    │
└──────┬───────────────────┘
       │ JDBC/JPA
       ↓
┌──────────────────┐
│   PostgreSQL     │
│   (Port 5432)    │
└──────────────────┘
```

---

## 📝 ENTIDADES E RELACIONAMENTOS

```
User (1) ──< (N) Order
User (1) ──< (N) Payment  
User (1) ──< (N) Notification

Order (1) ──< (N) OrderItem
Order (1) ──── (1) Payment

Product (1) ──< (N) OrderItem

Event (1) ──< (N) Participant
```

---

## ✨ PRÓXIMOS PASSOS (Melhorias Opcionais)

### Backend
- [ ] Spring Security + JWT
- [ ] Testes unitários
- [ ] Paginação
- [ ] Cache com Redis
- [ ] Logs estruturados

### Frontend  
- [ ] React Router
- [ ] Toast notifications
- [ ] Context API
- [ ] Dark mode
- [ ] Dashboard com gráficos

### DevOps
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em cloud
- [ ] Monitoring

---

## 📞 SUPORTE

- 📧 Email: dev@example.com
- 🐛 Issues: https://github.com/FarwBr/spring-boot-app/issues
- 📖 Docs: https://github.com/FarwBr/spring-boot-app/wiki

---

## 📄 LICENÇA

MIT License - Livre para uso pessoal e comercial

---

**Desenvolvido com ❤️ usando Spring Boot 3.2.0 + React 18.2.0**
