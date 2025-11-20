# 🌐 Como Acessar o Sistema

## 📍 URLs de Acesso

### Frontend (Interface Web)
```
http://177.44.248.75:3000
```

### Backend (API direta - para testes)
```
http://177.44.248.75:8080
```

### API Gateway (Microservices)
- **Users/Auth:** http://177.44.248.75:8081/api/auth
- **Events:** http://177.44.248.75:8082/api/events
- **Participants:** http://177.44.248.75:8083/api/participants
- **Certificates:** http://177.44.248.75:8084/api/certificates
- **Notifications:** http://177.44.248.75:8085/api/notifications

---

## 🔐 Credenciais de Teste

### Admin
```
Email: admin@example.com
Senha: admin123
```

### Cliente (criar nova conta)
```
Use o botão "Cadastre-se" na tela de login
```

---

## 🚀 Deploy no Servidor

### Opção 1: Script Automático
```bash
ssh univates@177.44.248.75
cd spring-boot-app
bash quick-deploy.sh
```

### Opção 2: Comandos Manuais
```bash
ssh univates@177.44.248.75
cd spring-boot-app
git pull origin main
sudo docker compose down
sudo docker compose up -d --build
```

### Verificar Status
```bash
sudo docker compose ps
sudo docker compose logs -f
```

---

## ❌ Solução de Problemas

### Containers não estão rodando?
```bash
cd ~/spring-boot-app
sudo docker compose ps  # Ver status
sudo docker compose up -d --build  # Subir containers
```

### Erro de conexão?
1. Verifique se containers estão UP:
   ```bash
   sudo docker compose ps
   ```

2. Verifique logs para erros:
   ```bash
   sudo docker compose logs backend
   sudo docker compose logs frontend
   ```

3. Reinicie containers:
   ```bash
   sudo docker compose restart
   ```

### Página não carrega (erro 502)?
- Backend pode estar iniciando, aguarde 1-2 minutos
- Verifique logs: `sudo docker compose logs -f backend`

### Erro de CORS?
- Verifique se API Gateway está rodando:
  ```bash
  sudo docker compose ps api-gateway
  ```

---

## 📱 Aplicativo Desktop (Check-in)

### Localização
```
desktop-checkin/
```

### Executar
```bash
cd desktop-checkin
npm install
npm start
```

### Configuração
- Arquivo: `main.js`
- URL da API: `http://177.44.248.75:8082/api` (já configurado)

---

## 🎓 Validar Certificado

### Acesso Público (sem login)
```
http://177.44.248.75:3000/validate
```

Ou clique no link "🔍 Validar Certificado" na tela de login.

---

## 📊 Monitoramento

### Ver todos os logs
```bash
sudo docker compose logs -f
```

### Ver logs de um serviço específico
```bash
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
sudo docker compose logs -f postgres
```

### Restart de um serviço
```bash
sudo docker compose restart backend
```

### Rebuild de um serviço
```bash
sudo docker compose up -d --build backend
```

---

## 🔧 Portas Usadas

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 3000 | Interface React |
| Backend | 8080 | API Spring Boot |
| PostgreSQL | 5432 | Banco de dados |
| API Gateway (Users) | 8081 | Autenticação |
| API Gateway (Events) | 8082 | Eventos |
| API Gateway (Participants) | 8083 | Participantes |
| API Gateway (Certificates) | 8084 | Certificados |
| API Gateway (Notifications) | 8085 | Notificações |

---

## ✅ Checklist Pré-Apresentação

- [ ] Containers estão rodando: `sudo docker compose ps`
- [ ] Frontend acessível: http://177.44.248.75:3000
- [ ] Login funciona com admin@example.com / admin123
- [ ] Desktop app configurado com IP do servidor
- [ ] Banco de dados tem eventos de teste
- [ ] Certificados podem ser validados em /validate

---

## 📞 Comandos Rápidos

```bash
# SSH no servidor
ssh univates@177.44.248.75

# Ver status
cd spring-boot-app && sudo docker compose ps

# Deploy completo
cd spring-boot-app && bash quick-deploy.sh

# Restart rápido (sem rebuild)
cd spring-boot-app && sudo docker compose restart

# Ver logs em tempo real
cd spring-boot-app && sudo docker compose logs -f

# Parar tudo
cd spring-boot-app && sudo docker compose down

# Limpar tudo e recomeçar
cd spring-boot-app && sudo docker compose down -v && sudo docker compose up -d --build
```
