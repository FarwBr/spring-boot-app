# 🚀 Spring Boot Application - Sistema de Gestão Completo

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

Aplicação full-stack moderna com 5 microsserviços integrados: **Usuários**, **Produtos**, **Pedidos**, **Pagamentos** e **Notificações**.

[📖 Documentação API](#-documentação-da-api) • [🏗️ Arquitetura](#️-arquitetura) • [🚀 Quick Start](#-quick-start) • [📚 Guia Completo](#-guia-de-uso)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Quick Start](#-quick-start)
- [Arquitetura](#️-arquitetura)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Guia de Uso](#-guia-de-uso)
- [Desenvolvimento](#-desenvolvimento)
- [Docker](#-docker)
- [Contribuindo](#-contribuindo)

---

## 🎯 Visão Geral

Sistema completo de gestão desenvolvido com as melhores práticas de desenvolvimento full-stack, incluindo:

- ✅ **5 Serviços REST** totalmente funcionais
- ✅ **Relacionamentos JPA** complexos entre entidades
- ✅ **Interface React** moderna e responsiva
- ✅ **Dockerizado** com orquestração via Docker Compose
- ✅ **Documentação Swagger** interativa
- ✅ **Banco de dados PostgreSQL** com relacionamentos
- ✅ **CORS configurado** para desenvolvimento e produção

### 🎨 Funcionalidades Principais

| Serviço | Funcionalidades |
|---------|----------------|
| 👥 **Usuários** | Cadastro, listagem, edição, exclusão de usuários |
| 📦 **Produtos** | Gestão de estoque, preços e descrições |
| 🛒 **Pedidos** | Criação de pedidos com múltiplos itens, controle de status |
| 💳 **Pagamentos** | Processamento, confirmação e rastreamento de pagamentos |
| 🔔 **Notificações** | Sistema de alertas e mensagens para usuários |

---

## 🛠️ Tecnologias

### Backend
- **Java 17** - LTS version com recursos modernos
- **Spring Boot 3.2.0** - Framework principal
- **Spring Data JPA** - ORM para PostgreSQL
- **Spring Validation** - Validação de dados
- **Lombok** - Redução de boilerplate
- **SpringDoc OpenAPI** - Documentação Swagger
- **Maven** - Gerenciamento de dependências

### Frontend
- **React 18.2.0** - Biblioteca UI
- **Axios 1.6.2** - Cliente HTTP
- **React Hooks** - Gerenciamento de estado
- **CSS3** - Estilização responsiva

### Infraestrutura
- **PostgreSQL 15** - Banco de dados relacional
- **Docker & Docker Compose** - Containerização
- **Nginx** - Servidor web para React
- **Multi-stage builds** - Otimização de imagens

---

## 📋 Pré-requisitos

### Para executar com Docker (Recomendado):
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- 4GB de RAM disponível
- 5GB de espaço em disco

### Para desenvolvimento local:
- **Java 17+** ([Download JDK](https://adoptium.net/))
- **Node.js 18+** ([Download Node](https://nodejs.org/))
- **Maven 3.9+** ([Download Maven](https://maven.apache.org/))
- **PostgreSQL 15+** (ou usar via Docker)

---

## 🚀 Quick Start

### Opção 1: Docker Compose (Mais Rápido)

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd spring-boot-app

# 2. Inicie todos os serviços
docker-compose up --build

# 3. Aguarde a mensagem: "Started Application in X seconds"
# Pronto! ✅
```

**Acessos:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080/api
- 📖 **Swagger UI**: http://localhost:8080/swagger-ui.html
- 🗄️ **PostgreSQL**: localhost:5432 (user: `postgres`, pass: `postgres`)

### Opção 2: Desenvolvimento Local

#### 1. Backend

```bash
# PostgreSQL via Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=springdb -p 5432:5432 -d postgres:15-alpine

# Backend Spring Boot
cd backend
mvn clean install
mvn spring-boot:run
```

#### 2. Frontend

```bash
cd frontend
npm install
npm start
```

**Acessos (Local):**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

---

## 🏗️ Arquitetura

### Diagrama de Serviços

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP (Port 3000)
       ↓
┌─────────────────────────────┐
│   React Frontend (Nginx)    │
│  - UsersPage.js             │
│  - ProductsPage.js          │
│  - OrdersPage.js            │
│  - PaymentsPage.js          │
│  - NotificationsPage.js     │
└──────────┬──────────────────┘
           │ REST API (Port 8080)
           ↓
┌──────────────────────────────────┐
│   Spring Boot Backend            │
│  ┌────────────────────────────┐  │
│  │     Controllers Layer      │  │
│  │  - UserController          │  │
│  │  - ProductController       │  │
│  │  - OrderController         │  │
│  │  - PaymentController       │  │
│  │  - NotificationController  │  │
│  └────────────┬───────────────┘  │
│               ↓                  │
│  ┌────────────────────────────┐  │
│  │      Service Layer         │  │
│  │  - UserService             │  │
│  │  - ProductService          │  │
│  │  - OrderService            │  │
│  │  - PaymentService          │  │
│  │  - NotificationService     │  │
│  └────────────┬───────────────┘  │
│               ↓                  │
│  ┌────────────────────────────┐  │
│  │    Repository Layer        │  │
│  │  - UserRepository          │  │
│  │  - ProductRepository       │  │
│  │  - OrderRepository         │  │
│  │  - PaymentRepository       │  │
│  │  - NotificationRepository  │  │
│  └────────────┬───────────────┘  │
└───────────────┼──────────────────┘
                │ JPA/Hibernate
                ↓
┌─────────────────────────────┐
│   PostgreSQL Database       │
│  - users                    │
│  - products                 │
│  - orders                   │
│  - order_items              │
│  - payments                 │
│  - notifications            │
└─────────────────────────────┘
```

### Relacionamentos de Entidades

```
User (1) ─────< (N) Order
User (1) ─────< (N) Payment
User (1) ─────< (N) Notification

Order (1) ─────< (N) OrderItem
Order (1) ───── (1) Payment

Product (1) ─────< (N) OrderItem
```

---

## 📖 Documentação da API

### Swagger UI (Recomendado)

Acesse a documentação interativa completa:

🔗 **http://localhost:8080/swagger-ui.html**

A interface Swagger permite:
- ✅ Visualizar todos os endpoints
- ✅ Testar requisições diretamente
- ✅ Ver schemas de request/response
- ✅ Exemplos de uso

### Endpoints Principais

#### 👥 Usuários `/api/users`
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Lista todos os usuários |
| GET | `/api/users/{id}` | Busca usuário por ID |
| POST | `/api/users` | Cria novo usuário |
| PUT | `/api/users/{id}` | Atualiza usuário |
| DELETE | `/api/users/{id}` | Remove usuário |

**Exemplo Request (POST):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678900",
  "phone": "(11) 98765-4321"
}
```

#### 📦 Produtos `/api/products`
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Lista todos os produtos |
| GET | `/api/products/{id}` | Busca produto por ID |
| POST | `/api/products` | Cria novo produto |
| PUT | `/api/products/{id}` | Atualiza produto |
| DELETE | `/api/products/{id}` | Remove produto |
| PATCH | `/api/products/{id}/stock` | Atualiza estoque |

**Exemplo Request (POST):**
```json
{
  "name": "Notebook Dell",
  "description": "Notebook i7 16GB RAM",
  "price": 3500.00,
  "stock": 10,
  "category": "Eletrônicos"
}
```

#### 🛒 Pedidos `/api/orders`
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/orders` | Lista todos os pedidos |
| GET | `/api/orders/{id}` | Busca pedido por ID |
| GET | `/api/orders/user/{userId}` | Pedidos de um usuário |
| POST | `/api/orders` | Cria novo pedido |
| PUT | `/api/orders/{id}` | Atualiza pedido |
| PATCH | `/api/orders/{id}/status` | Atualiza status |
| DELETE | `/api/orders/{id}` | Cancela pedido |

**Exemplo Request (POST):**
```json
{
  "userId": 1,
  "status": "PENDING",
  "totalAmount": 3500.00,
  "items": []
}
```

**Status possíveis:** `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

#### 💳 Pagamentos `/api/payments`
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/payments` | Lista todos os pagamentos |
| GET | `/api/payments/{id}` | Busca pagamento por ID |
| GET | `/api/payments/user/{userId}` | Pagamentos de um usuário |
| POST | `/api/payments` | Cria novo pagamento |
| PATCH | `/api/payments/{id}/process` | Processa pagamento |
| PATCH | `/api/payments/{id}/complete` | Completa pagamento |

**Exemplo Request (POST):**
```json
{
  "userId": 1,
  "orderId": 1,
  "amount": 3500.00,
  "paymentMethod": "CREDIT_CARD",
  "status": "PENDING"
}
```

**Métodos:** `CREDIT_CARD`, `DEBIT_CARD`, `PIX`, `BANK_SLIP`  
**Status:** `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `REFUNDED`

#### 🔔 Notificações `/api/notifications`
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/notifications` | Lista todas as notificações |
| GET | `/api/notifications/{id}` | Busca notificação por ID |
| GET | `/api/notifications/user/{userId}` | Notificações de um usuário |
| GET | `/api/notifications/user/{userId}/unread` | Não lidas de um usuário |
| POST | `/api/notifications` | Cria notificação |
| PATCH | `/api/notifications/{id}/read` | Marca como lida |
| DELETE | `/api/notifications/{id}` | Remove notificação |

**Exemplo Request (POST):**
```json
{
  "userId": 1,
  "type": "ORDER_STATUS",
  "message": "Seu pedido foi enviado!",
  "read": false
}
```

**Tipos:** `ORDER_STATUS`, `PAYMENT_STATUS`, `PROMOTION`, `SYSTEM`

---

## 📁 Estrutura do Projeto

```
spring-boot-app/
├── 📂 backend/
│   ├── 📂 src/main/
│   │   ├── 📂 java/com/example/
│   │   │   ├── 📄 Application.java (⚡ Entry Point)
│   │   │   │
│   │   │   ├── 📂 config/
│   │   │   │   └── 📄 SwaggerConfig.java
│   │   │   │
│   │   │   ├── 📂 controller/ (REST Endpoints)
│   │   │   │   ├── 📄 UserController.java
│   │   │   │   ├── 📄 ProductController.java
│   │   │   │   ├── 📄 OrderController.java
│   │   │   │   ├── 📄 PaymentController.java
│   │   │   │   └── 📄 NotificationController.java
│   │   │   │
│   │   │   ├── 📂 model/ (Entities JPA)
│   │   │   │   ├── 📄 User.java
│   │   │   │   ├── 📄 Product.java
│   │   │   │   ├── 📄 Order.java
│   │   │   │   ├── 📄 OrderItem.java
│   │   │   │   ├── 📄 Payment.java
│   │   │   │   └── 📄 Notification.java
│   │   │   │
│   │   │   ├── 📂 repository/ (Data Access)
│   │   │   │   ├── 📄 UserRepository.java
│   │   │   │   ├── 📄 ProductRepository.java
│   │   │   │   ├── 📄 OrderRepository.java
│   │   │   │   ├── 📄 PaymentRepository.java
│   │   │   │   └── 📄 NotificationRepository.java
│   │   │   │
│   │   │   └── 📂 service/ (Business Logic)
│   │   │       ├── 📄 UserService.java
│   │   │       ├── 📄 ProductService.java
│   │   │       ├── 📄 OrderService.java
│   │   │       ├── 📄 PaymentService.java
│   │   │       └── 📄 NotificationService.java
│   │   │
│   │   └── 📂 resources/
│   │       ├── 📄 application.properties (Config local)
│   │       └── 📄 application-docker.properties (Config Docker)
│   │
│   ├── 📄 Dockerfile (Multi-stage build)
│   └── 📄 pom.xml (Dependencies)
│
├── 📂 frontend/
│   ├── 📂 public/
│   │   └── 📄 index.html
│   │
│   ├── 📂 src/
│   │   ├── 📄 App.js (Main component + Navigation)
│   │   ├── 📄 App.css (Global styles)
│   │   ├── 📄 index.js (Entry point)
│   │   │
│   │   ├── 📂 pages/ (UI Pages)
│   │   │   ├── 📄 UsersPage.js
│   │   │   ├── 📄 ProductsPage.js
│   │   │   ├── 📄 OrdersPage.js
│   │   │   ├── 📄 PaymentsPage.js
│   │   │   └── 📄 NotificationsPage.js
│   │   │
│   │   ├── 📂 services/ (API Integration)
│   │   │   ├── 📄 userService.js
│   │   │   ├── 📄 productService.js
│   │   │   ├── 📄 orderService.js
│   │   │   ├── 📄 paymentService.js
│   │   │   └── 📄 notificationService.js
│   │   │
│   │   └── 📂 components/ (Reusable)
│   │       ├── 📄 UserForm.js
│   │       └── 📄 UserList.js
│   │
│   ├── 📄 Dockerfile (Nginx)
│   ├── 📄 nginx.conf
│   └── 📄 package.json
│
├── 📄 docker-compose.yml (Orchestration)
├── 📄 README.md
├── 📄 CHECKLIST_FALTANTES.md
└── 📄 CHECKLIST_VISUAL.md
```

---

## 📚 Guia de Uso

### 1. Gerenciar Usuários

**Criar usuário:**
1. Acesse http://localhost:3000
2. Clique em "Usuários"
3. Preencha o formulário
4. Clique em "Adicionar Usuário"

**Editar usuário:**
1. Na lista de usuários, clique em "Editar"
2. Modifique os campos
3. Clique em "Atualizar Usuário"

**Excluir usuário:**
1. Na lista de usuários, clique em "Excluir"
2. Confirme a exclusão

### 2. Gerenciar Produtos

**Adicionar produto:**
1. Acesse a página "Produtos"
2. Preencha nome, descrição, preço, estoque e categoria
3. Clique em "Adicionar Produto"

**Atualizar estoque:**
1. Edite o produto
2. Altere o campo "Estoque"
3. Salve as alterações

### 3. Criar Pedido

1. Acesse "Pedidos"
2. Selecione o ID do usuário
3. Defina o valor total
4. Clique em "Adicionar Pedido"
5. Status inicial: PENDING

### 4. Processar Pagamento

1. Acesse "Pagamentos"
2. Crie um pagamento vinculado ao pedido
3. Use "Processar Pagamento" para mudar status
4. Use "Completar Pagamento" para finalizar

### 5. Gerenciar Notificações

1. Acesse "Notificações"
2. Crie notificações para usuários
3. Marque como lida após visualização
4. Filtre por não lidas

---

## 🔧 Desenvolvimento

### Variáveis de Ambiente

#### Backend (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/springdb
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server
server.port=8080
```

#### Frontend
```javascript
// src/services/*Service.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

### Adicionar Nova Entidade

1. **Model** (`backend/src/.../model/NewEntity.java`):
```java
@Entity
@Table(name = "new_entities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
}
```

2. **Repository** (`repository/NewEntityRepository.java`):
```java
public interface NewEntityRepository extends JpaRepository<NewEntity, Long> {
}
```

3. **Service** (`service/NewEntityService.java`):
```java
@Service
public class NewEntityService {
    @Autowired
    private NewEntityRepository repository;
    
    public List<NewEntity> getAll() {
        return repository.findAll();
    }
}
```

4. **Controller** (`controller/NewEntityController.java`):
```java
@RestController
@RequestMapping("/api/new-entities")
@CrossOrigin(origins = "http://localhost:3000")
public class NewEntityController {
    @Autowired
    private NewEntityService service;
    
    @GetMapping
    public ResponseEntity<List<NewEntity>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
```

5. **Frontend Service** (`services/newEntityService.js`):
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getAll = async () => {
    const response = await axios.get(`${API_URL}/new-entities`);
    return response.data;
};
```

6. **Frontend Page** (`pages/NewEntitiesPage.js`):
```javascript
import React, { useState, useEffect } from 'react';
import * as newEntityService from '../services/newEntityService';

function NewEntitiesPage() {
    const [entities, setEntities] = useState([]);
    
    useEffect(() => {
        loadEntities();
    }, []);
    
    const loadEntities = async () => {
        const data = await newEntityService.getAll();
        setEntities(data);
    };
    
    return <div>...</div>;
}
```

### Testes

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

---

## 🐳 Docker

### Comandos Úteis

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar serviços
docker-compose down

# Parar e remover volumes (limpa banco)
docker-compose down -v

# Rebuild completo
docker-compose up --build --force-recreate

# Acessar container
docker exec -it spring-boot-app-backend-1 bash

# Acessar PostgreSQL
docker exec -it spring-boot-app-postgres-1 psql -U postgres -d springdb
```

### Troubleshooting Docker

**Backend não inicia:**
```bash
# Verifica logs
docker-compose logs backend

# Rebuild sem cache
docker-compose build --no-cache backend
docker-compose up backend
```

**Banco não conecta:**
```bash
# Verifica se PostgreSQL está rodando
docker-compose ps

# Testa conexão
docker exec spring-boot-app-postgres-1 pg_isready

# Recria banco
docker-compose down -v
docker-compose up -d postgres
```

**Frontend não carrega:**
```bash
# Verifica se backend está respondendo
curl http://localhost:8080/api/users

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up frontend
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- 📧 Email: dev@example.com
- 📖 Wiki: [GitHub Wiki](https://github.com/seu-usuario/spring-boot-app/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/spring-boot-app/issues)

---

<div align="center">

**Desenvolvido com ❤️ usando Spring Boot e React**

⭐ Não esqueça de dar uma estrela se este projeto te ajudou!

</div>
│   │   ├── pages/
│   │   │   └── UsersPage.js
│   │   ├── services/
│   │   │   └── userService.js
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## 🔧 API Endpoints

### Users
- `GET /api/users` - Lista todos os usuários
- `GET /api/users/{id}` - Busca usuário por ID
- `POST /api/users` - Cria novo usuário
- `PUT /api/users/{id}` - Atualiza usuário
- `DELETE /api/users/{id}` - Deleta usuário

### Exemplo de Payload
```json
{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

## 🗄️ Banco de Dados

### Configuração PostgreSQL
- **Database**: springdb
- **Username**: postgres
- **Password**: postgres
- **Port**: 5432

### Conexão Local
```
jdbc:postgresql://localhost:5432/springdb
```

### Conexão Docker
```
jdbc:postgresql://postgres:5432/springdb
```

## 🛠️ Tecnologias Utilizadas

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL
- Lombok
- Maven

### Frontend
- React 18
- Axios
- Nginx (produção)

### DevOps
- Docker
- Docker Compose

## 📝 Comandos Úteis

### Docker
```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose up --build

# Remover volumes
docker-compose down -v
```

### Maven
```bash
# Compilar
mvn clean install

# Rodar testes
mvn test

# Executar aplicação
mvn spring-boot:run
```

### NPM
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm start

# Build para produção
npm run build
```

## 🔍 Troubleshooting

### Backend não conecta ao PostgreSQL
Certifique-se que o perfil Docker está ativo:
```bash
docker-compose logs backend
```

### Frontend não acessa o backend
Verifique se o backend está rodando:
```bash
curl http://localhost:8080/api/users
```

### Porta já em uso
Altere as portas no `docker-compose.yml` se necessário.

## 📄 Licença

Este projeto é livre para uso educacional e comercial.
```

Inside this directory, create the following structure:

```
my-spring-boot-app/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── example/
│   │   │   │           └── demo/
│   │   │   │               └── DemoApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── Dockerfile
│   └── pom.xml
└── frontend/
    ├── package.json
    ├── Dockerfile
    └── src/
        └── index.js
```

### Step 2: Backend - Spring Boot Setup

#### 2.1. Create `pom.xml`

Create a `pom.xml` file in the `backend` directory:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.0.0</spring-boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 2.2. Create `DemoApplication.java`

Create a file named `DemoApplication.java` in `backend/src/main/java/com/example/demo/`:

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

#### 2.3. Create `application.properties`

Create a file named `application.properties` in `backend/src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://db:5432/mydb
spring.datasource.username=myuser
spring.datasource.password=mypassword
spring.jpa.hibernate.ddl-auto=update
```

#### 2.4. Create `Dockerfile`

Create a `Dockerfile` in the `backend` directory:

```dockerfile
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Step 3: Frontend - JavaScript Setup

#### 3.1. Create `package.json`

Create a `package.json` file in the `frontend` directory:

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

#### 3.2. Create `index.js`

Create a file named `index.js` in `frontend/src/`:

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from the frontend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

#### 3.3. Create `Dockerfile`

Create a `Dockerfile` in the `frontend` directory:

```dockerfile
FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./src ./src
CMD ["npm", "start"]
```

### Step 4: Docker Compose Setup

Create a `docker-compose.yml` file in the `my-spring-boot-app` directory:

```yaml
version: '3.8'

services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
```

### Step 5: Build and Run the Application

1. Navigate to the root of your project:

```bash
cd my-spring-boot-app
```

2. Build and run the application using Docker Compose:

```bash
docker-compose up --build
```

### Step 6: Access the Application

- The Spring Boot backend will be accessible at `http://localhost:8080`.
- The frontend will be accessible at `http://localhost:3000`.

### Final Configurations

You can now add your business logic to the Spring Boot application and enhance the frontend as needed. Make sure to adjust the database configurations and any other settings according to your requirements.

### Conclusion

You have successfully set up a Java and JavaScript project using Docker with Spring Boot and PostgreSQL. You can now proceed with your application development!