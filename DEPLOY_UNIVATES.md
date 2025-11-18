# 🚀 DEPLOY NA VM UNIVATES

## 📋 INFORMAÇÕES DA VM
- **Host:** 177.44.248.75
- **Usuário:** univates
- **Sistema:** Ubuntu 24.04.2 LTS
- **Acesso:** SSH

---

## 🎯 PASSO A PASSO COMPLETO

### **ETAPA 1: Conectar na VM**

**No seu PowerShell local:**
```powershell
ssh univates@177.44.248.75
# Digite a senha quando solicitado
```

---

### **ETAPA 2: Verificar se Docker está instalado**

**Na VM, execute:**
```bash
docker --version
docker-compose --version
```

#### **Se Docker NÃO estiver instalado:**

```bash
# Atualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker univates

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# IMPORTANTE: Sair e entrar novamente para aplicar permissões
exit
# Conectar novamente
ssh univates@177.44.248.75

# Verificar instalação
docker --version
docker-compose --version
```

#### **Se Docker JÁ estiver instalado:**
✅ Pule para ETAPA 3

---

### **ETAPA 3: Criar diretório do projeto**

```bash
# Criar diretório (se precisar de sudo, use)
mkdir -p ~/spring-boot-app
cd ~/spring-boot-app

# OU se preferir em /opt (precisa sudo)
# sudo mkdir -p /opt/spring-boot-app
# sudo chown univates:univates /opt/spring-boot-app
# cd /opt/spring-boot-app
```

---

### **ETAPA 4: Transferir arquivos do projeto**

**Opção A: Via Git (Recomendado)**

**Na VM:**
```bash
cd ~/spring-boot-app

# Se Git não estiver instalado
sudo apt install git -y

# Clonar repositório
git clone https://github.com/FarwBr/spring-boot-app.git .
# ou
# git clone https://github.com/FarwBr/spring-boot-app.git
# cd spring-boot-app
```

**Opção B: Via SCP (Upload direto do seu PC)**

**No seu PowerShell local:**
```powershell
# Ir para pasta do projeto
cd c:\Users\Gustavo\Documents\GitHub\spring-boot-app

# Compactar projeto (excluindo node_modules e target)
# No PowerShell, use Compress-Archive
$exclude = @('node_modules', 'target', '.git', 'desktop-checkin')
Get-ChildItem -Exclude $exclude | Compress-Archive -DestinationPath spring-boot-app.zip

# Enviar para VM
scp spring-boot-app.zip univates@177.44.248.75:~/

# Conectar na VM e descompactar
ssh univates@177.44.248.75

# Na VM:
cd ~
unzip spring-boot-app.zip -d spring-boot-app
cd spring-boot-app
```

**Opção C: Usar rsync (mais rápido)**

**No seu PowerShell local:**
```powershell
# Instalar rsync no Windows via Chocolatey (se não tiver)
# choco install rsync

# Sincronizar projeto
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude '.git' --exclude 'desktop-checkin' c:\Users\Gustavo\Documents\GitHub\spring-boot-app\ univates@177.44.248.75:~/spring-boot-app/
```

---

### **ETAPA 5: Configurar variáveis de ambiente**

**Na VM:**
```bash
cd ~/spring-boot-app  # ou onde você colocou o projeto

# Copiar template
cp .env.example .env

# Editar arquivo
nano .env
```

**Configurações recomendadas para .env:**
```bash
# Database Configuration
POSTGRES_DB=springdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Univates2024!Strong  # ⚠️ TROQUE ISSO!

# Backend Configuration
SPRING_PROFILES_ACTIVE=docker

# Frontend Configuration
# Use o IP da VM
REACT_APP_API_URL=http://177.44.248.75:8080/api

# Port Configuration
BACKEND_PORT=8080
FRONTEND_PORT=80
POSTGRES_PORT=5432
```

**Salvar:** `Ctrl + O` → `Enter` → `Ctrl + X`

---

### **ETAPA 6: Verificar portas disponíveis**

```bash
# Ver o que está rodando nas portas que vamos usar
sudo netstat -tlnp | grep -E '(:80|:8080|:5432)'

# OU
sudo ss -tlnp | grep -E '(:80|:8080|:5432)'

# Se houver algo usando, você precisa:
# 1. Parar o serviço OU
# 2. Mudar as portas no .env
```

**Se porta 80 estiver em uso:**
```bash
# Editar .env e trocar porta do frontend
nano .env
# Mudar: FRONTEND_PORT=3000
```

---

### **ETAPA 7: Executar deploy**

```bash
cd ~/spring-boot-app

# Dar permissão de execução
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

**O script vai:**
1. ✅ Verificar Docker
2. ✅ Parar containers antigos
3. ✅ Construir imagens (5-10 minutos)
4. ✅ Iniciar containers
5. ✅ Testar conexões

**Aguarde... isso pode levar 10 minutos na primeira vez!**

---

### **ETAPA 8: Verificar se está funcionando**

```bash
# Ver status dos containers
docker-compose -f docker-compose.prod.yml ps

# Deve mostrar 3 containers "Up":
# - springboot-postgres-prod
# - springboot-backend-prod
# - springboot-frontend-prod

# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Ver apenas backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Pressione Ctrl+C para sair dos logs
```

---

### **ETAPA 9: Configurar firewall (se necessário)**

```bash
# Verificar se firewall está ativo
sudo ufw status

# Se estiver ativo, liberar portas
sudo ufw allow 22      # SSH
sudo ufw allow 80      # Frontend
sudo ufw allow 443     # HTTPS (futuro)
sudo ufw allow 8080    # Backend
sudo ufw reload
```

---

### **ETAPA 10: Acessar a aplicação**

**No seu navegador:**

```
Frontend:  http://177.44.248.75
Backend:   http://177.44.248.75:8080
Swagger:   http://177.44.248.75:8080/swagger-ui.html
```

**Se mudou a porta do frontend:**
```
Frontend:  http://177.44.248.75:3000
```

---

## 🔧 COMANDOS ÚTEIS

### Gerenciar containers

```bash
# Ver status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar tudo
docker-compose -f docker-compose.prod.yml restart

# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Iniciar novamente
docker-compose -f docker-compose.prod.yml up -d

# Ver uso de recursos (CPU, RAM)
docker stats

# Remover tudo e rebuild
docker-compose -f docker-compose.prod.yml down -v
./deploy.sh
```

### Atualizar aplicação

```bash
cd ~/spring-boot-app

# Se usa Git
git pull origin main

# Redeployar
./deploy.sh
```

### Backup do banco

```bash
# Criar backup
docker exec springboot-postgres-prod pg_dump -U postgres springdb > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i springboot-postgres-prod psql -U postgres springdb < backup_20241117.sql
```

### Acessar banco de dados

```bash
# Entrar no PostgreSQL
docker exec -it springboot-postgres-prod psql -U postgres -d springdb

# Comandos úteis dentro do psql:
# \dt          - Listar tabelas
# \d users     - Ver estrutura da tabela users
# SELECT * FROM users LIMIT 5;
# \q           - Sair
```

### Logs detalhados

```bash
# Logs do backend (Java)
docker-compose -f docker-compose.prod.yml logs backend | tail -100

# Logs do PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres | tail -50

# Seguir logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🆘 TROUBLESHOOTING

### Problema: "Permission denied" ao rodar Docker

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker univates

# Sair e entrar novamente
exit
ssh univates@177.44.248.75

# Testar
docker ps
```

### Problema: Porta já em uso

```bash
# Ver o que está usando porta 8080
sudo lsof -i :8080

# Ou
sudo netstat -tlnp | grep 8080

# Matar processo
sudo kill -9 PID_DO_PROCESSO

# Ou mudar porta no .env
nano .env
# BACKEND_PORT=8081
```

### Problema: Backend não inicia

```bash
# Ver logs de erro
docker-compose -f docker-compose.prod.yml logs backend

# Verificar se PostgreSQL está pronto
docker-compose -f docker-compose.prod.yml logs postgres | grep "ready to accept connections"

# Se PostgreSQL não iniciou, recriar
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d postgres
# Aguarde 30 segundos
docker-compose -f docker-compose.prod.yml up -d backend
```

### Problema: Sem espaço em disco

```bash
# Ver espaço
df -h

# Limpar containers antigos
docker system prune -a --volumes

# Limpar logs do sistema
sudo journalctl --vacuum-time=7d
```

### Problema: "Cannot connect to Docker daemon"

```bash
# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verificar status
sudo systemctl status docker
```

### Problema: Frontend não carrega

```bash
# Verificar se container está rodando
docker ps | grep frontend

# Ver logs
docker logs springboot-frontend-prod

# Rebuild do frontend
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d frontend
```

---

## 📊 MONITORAMENTO

### Ver uso de recursos

```bash
# Recursos por container
docker stats

# Uso de disco
df -h

# Uso de memória
free -h

# Processos
htop
# (Se não tiver: sudo apt install htop)
```

### Verificar saúde dos containers

```bash
# Status de saúde
docker inspect --format='{{.State.Health.Status}}' springboot-backend-prod
docker inspect --format='{{.State.Health.Status}}' springboot-postgres-prod

# Deve retornar: healthy
```

---

## 🔒 SEGURANÇA

### Trocar senha do PostgreSQL

```bash
# 1. Editar .env
nano .env
# Trocar POSTGRES_PASSWORD

# 2. Recriar containers
docker-compose -f docker-compose.prod.yml down -v
./deploy.sh
```

### Limitar acesso externo

Se você quiser que apenas a rede da Univates acesse:

```bash
# Configurar firewall
sudo ufw enable
sudo ufw allow from 177.44.0.0/16 to any port 80
sudo ufw allow from 177.44.0.0/16 to any port 8080
sudo ufw allow 22  # SSH
```

---

## 📝 CHECKLIST DE DEPLOY

- [ ] Conectado na VM via SSH
- [ ] Docker e Docker Compose instalados
- [ ] Projeto transferido para ~/spring-boot-app
- [ ] Arquivo .env configurado
- [ ] Senha do PostgreSQL alterada
- [ ] Deploy executado com sucesso (./deploy.sh)
- [ ] 3 containers rodando (docker ps)
- [ ] Frontend acessível em http://177.44.248.75
- [ ] Backend respondendo em http://177.44.248.75:8080
- [ ] Swagger funcionando em /swagger-ui.html
- [ ] Firewall configurado (se necessário)

---

## 🚀 COMANDOS RÁPIDOS (COPIAR/COLAR)

### Deploy inicial completo:

```bash
# 1. Conectar
ssh univates@177.44.248.75

# 2. Criar diretório
mkdir -p ~/spring-boot-app
cd ~/spring-boot-app

# 3. Clonar projeto (ou use SCP)
git clone https://github.com/FarwBr/spring-boot-app.git .

# 4. Configurar
cp .env.example .env
nano .env  # Editar senha e REACT_APP_API_URL

# 5. Deploy
chmod +x deploy.sh
./deploy.sh

# 6. Verificar
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

### Atualização rápida:

```bash
cd ~/spring-boot-app
git pull origin main
./deploy.sh
```

---

## 🎉 PRONTO!

Sua aplicação está rodando em:
- **Frontend:** http://177.44.248.75
- **Backend:** http://177.44.248.75:8080
- **Swagger:** http://177.44.248.75:8080/swagger-ui.html

**Qualquer problema, veja a seção TROUBLESHOOTING acima!** 🚀
