# ⚡ COMANDOS RÁPIDOS - Spring Boot App

## 🚀 INICIAR O PROJETO

### Método Rápido (Docker - Recomendado)
```powershell
cd c:\Users\Gustavo\Documents\GitHub\spring-boot-app
docker-compose up --build
```

**Aguardar mensagem:** "Started Application in X seconds"

**Acessar:**
- Frontend: http://localhost:3000
- Swagger: http://localhost:8080/swagger-ui.html

---

## 🛑 PARAR O PROJETO

```powershell
# Parar containers (mantém dados)
docker-compose down

# Parar e limpar TUDO (apaga banco de dados)
docker-compose down -v
```

---

## 🔄 REINICIAR/ATUALIZAR

```powershell
# Rebuild completo (após mudanças no código)
docker-compose down
docker-compose up --build

# Rebuild forçado (se algo não funcionar)
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## 📊 MONITORAR

```powershell
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs apenas do backend
docker-compose logs -f backend

# Ver logs apenas do frontend
docker-compose logs -f frontend

# Ver logs apenas do PostgreSQL
docker-compose logs -f postgres

# Ver status dos containers
docker-compose ps
```

---

## 🗄️ ACESSAR BANCO DE DADOS

```powershell
# Conectar ao PostgreSQL
docker exec -it postgres-db psql -U postgres -d springdb

# Dentro do PostgreSQL, comandos úteis:
\dt              # Listar tabelas
\d users         # Ver estrutura da tabela users
SELECT * FROM users;         # Ver todos os usuários
SELECT * FROM events;        # Ver todos os eventos
SELECT * FROM participants;  # Ver todos os participantes
\q               # Sair
```

---

## 🧹 LIMPEZA

```powershell
# Remover containers parados
docker-compose rm

# Limpar imagens não utilizadas
docker image prune -a

# Limpar volumes não utilizados
docker volume prune

# Limpeza completa do Docker
docker system prune -a --volumes
```

---

## 🐛 TROUBLESHOOTING

### Backend não inicia

```powershell
# Ver erro específico
docker-compose logs backend

# Rebuild backend sem cache
docker-compose build --no-cache backend
docker-compose up backend
```

### Porta 8080 em uso

```powershell
# Descobrir qual processo está usando
netstat -ano | findstr :8080

# Matar processo (substitua <PID>)
taskkill /PID <PID> /F

# Ou alterar porta no docker-compose.yml
# Mudar "8080:8080" para "8081:8080"
```

### Porta 3000 em uso

```powershell
# Descobrir processo
netstat -ano | findstr :3000

# Matar processo
taskkill /PID <PID> /F
```

### Banco não conecta

```powershell
# Verificar se PostgreSQL está rodando
docker-compose ps

# Testar conexão
docker exec postgres-db pg_isready

# Recriar banco do zero
docker-compose down -v
docker-compose up -d postgres
# Aguardar 10 segundos
docker-compose up backend frontend
```

### Frontend mostra erro 404 na API

```powershell
# Verificar se backend está respondendo
curl http://localhost:8080/api/users

# Ou abrir no navegador:
# http://localhost:8080/swagger-ui.html
```

---

## 📦 DESENVOLVIMENTO LOCAL (Sem Docker)

### Backend

```powershell
cd backend

# Compilar
mvn clean install

# Executar
mvn spring-boot:run

# Executar testes
mvn test
```

### Frontend

```powershell
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build
```

---

## 🔍 TESTAR API (Sem Interface)

### Via PowerShell (curl)

```powershell
# Listar usuários
curl http://localhost:8080/api/users

# Criar usuário
curl -X POST http://localhost:8080/api/users `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"cpf\":\"12345678900\",\"phone\":\"11999999999\"}'

# Buscar usuário por ID
curl http://localhost:8080/api/users/1

# Deletar usuário
curl -X DELETE http://localhost:8080/api/users/1
```

### Via Swagger (Recomendado)

1. Abrir: http://localhost:8080/swagger-ui.html
2. Escolher endpoint
3. Clicar em "Try it out"
4. Preencher dados
5. Clicar em "Execute"

---

## 📊 POPULAR BANCO COM DADOS DE TESTE

### Via Swagger

1. Acessar: http://localhost:8080/swagger-ui.html

2. **Criar Usuários** (POST /api/users)
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678900",
  "phone": "11999999999"
}
```

3. **Criar Produtos** (POST /api/products)
```json
{
  "name": "Notebook Dell",
  "description": "i7 16GB RAM",
  "price": 3500.00,
  "stock": 10,
  "category": "Eletrônicos"
}
```

4. **Criar Evento** (POST /api/events)
```json
{
  "name": "Tech Conference 2025",
  "description": "Evento de tecnologia",
  "location": "Convention Center",
  "startTime": "2025-11-20T09:00:00",
  "endTime": "2025-11-20T18:00:00",
  "maxCapacity": 100,
  "active": true
}
```

5. **Adicionar Participantes** (POST /api/participants/event/1)
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "phone": "11988888888",
  "company": "Tech Corp"
}
```

---

## 📱 TESTAR FLUXO COMPLETO

1. **Iniciar sistema**
   ```powershell
   docker-compose up --build
   ```

2. **Abrir frontend**
   - http://localhost:3000

3. **Criar dados:**
   - Usuários: Adicionar 3 usuários
   - Produtos: Adicionar 5 produtos
   - Eventos: Criar 1 evento
   - Participantes: Adicionar 10 participantes ao evento

4. **Testar funcionalidades:**
   - Fazer check-in de 5 participantes
   - Criar pedido com 2 produtos
   - Processar pagamento
   - Enviar notificação

5. **Verificar:**
   - Dashboard de participantes (estatísticas)
   - Status dos pedidos
   - Notificações não lidas

---

## 🎯 COMANDOS MAIS USADOS (Resumo)

```powershell
# Iniciar
docker-compose up --build

# Parar
docker-compose down

# Ver logs
docker-compose logs -f backend

# Rebuild completo
docker-compose down -v
docker-compose up --build

# Acessar banco
docker exec -it postgres-db psql -U postgres -d springdb

# Limpeza completa
docker-compose down -v
docker system prune -a --volumes
```

---

## 📚 DOCUMENTAÇÃO

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/v3/api-docs
- **Frontend:** http://localhost:3000
- **Guia Instalação:** `GUIA_INSTALACAO.md`
- **Resumo Implementações:** `RESUMO_IMPLEMENTACOES.md`

---

## 🆘 PRECISA DE AJUDA?

1. **Ver logs:**
   ```powershell
   docker-compose logs -f
   ```

2. **Verificar containers:**
   ```powershell
   docker-compose ps
   ```

3. **Testar backend:**
   ```powershell
   curl http://localhost:8080/api/users
   ```

4. **Recomeçar do zero:**
   ```powershell
   docker-compose down -v
   docker-compose up --build
   ```

---

**💡 Dica:** Sempre use `docker-compose logs -f` para ver o que está acontecendo em tempo real!
