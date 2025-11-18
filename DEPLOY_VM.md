# 🚀 GUIA COMPLETO DE DEPLOY EM VM

## 📋 ÍNDICE
1. [Criar e Configurar VM](#1-criar-e-configurar-vm)
2. [Instalar Docker na VM](#2-instalar-docker-na-vm)
3. [Transferir Projeto para VM](#3-transferir-projeto-para-vm)
4. [Deploy na VM](#4-deploy-na-vm)
5. [Configurar Domínio e HTTPS](#5-configurar-domínio-e-https-opcional)
6. [Monitoramento e Manutenção](#6-monitoramento-e-manutenção)

---

## 1️⃣ CRIAR E CONFIGURAR VM

### Opção A: DigitalOcean (Recomendado para iniciantes)

**Passo 1:** Criar conta em https://www.digitalocean.com

**Passo 2:** Criar Droplet
```
- Image: Ubuntu 22.04 LTS
- Plan: Basic ($6/mês - 1GB RAM) ou ($12/mês - 2GB RAM recomendado)
- Region: Escolha o mais próximo de você
- Authentication: SSH Key (mais seguro) ou Password
- Hostname: spring-boot-app
```

**Passo 3:** Após criar, anote:
- IP público da VM (ex: 164.92.xxx.xxx)
- Senha root (se escolheu password)

### Opção B: AWS EC2

```
- AMI: Ubuntu Server 22.04 LTS
- Instance type: t2.small (mínimo) ou t2.medium (recomendado)
- Security Group: Abrir portas 22 (SSH), 80 (HTTP), 443 (HTTPS), 8080 (backend)
- Key pair: Criar novo ou usar existente
```

### Opção C: Google Cloud

```
- Machine type: e2-small ou e2-medium
- Boot disk: Ubuntu 22.04 LTS
- Firewall: Allow HTTP, HTTPS traffic
```

### Opção D: Oracle Cloud (Gratuito)

```
- Shape: VM.Standard.E2.1.Micro (Always Free)
- Image: Ubuntu 22.04
- Assign public IP
```

---

## 2️⃣ INSTALAR DOCKER NA VM

### Conectar à VM via SSH

**Windows (PowerShell):**
```powershell
# Se você tem a chave SSH
ssh -i caminho\para\chave.pem ubuntu@SEU_IP_DA_VM

# Se você usa senha
ssh root@SEU_IP_DA_VM
# Digite a senha quando solicitado
```

**Exemplo:**
```powershell
ssh root@164.92.123.456
```

### Instalar Docker (Execute na VM)

```bash
# Atualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar repositório Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar usuário ao grupo docker (se não for root)
sudo usermod -aG docker $USER

# Verificar instalação
docker --version
docker-compose --version

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**Saída esperada:**
```
Docker version 24.0.x
Docker Compose version 2.x.x
```

---

## 3️⃣ TRANSFERIR PROJETO PARA VM

### Opção A: Via Git (Recomendado)

**Na sua máquina local:**
```powershell
# 1. Fazer commit de tudo
cd c:\Users\Gustavo\Documents\GitHub\spring-boot-app
git add .
git commit -m "Preparar para deploy"
git push origin main
```

**Na VM:**
```bash
# Instalar Git
sudo apt install -y git

# Clonar repositório
cd /opt
sudo git clone https://github.com/FarwBr/spring-boot-app.git
cd spring-boot-app

# Se repositório é privado, configure SSH key ou use token
```

### Opção B: Via SCP (Upload direto)

**Na sua máquina local (PowerShell):**
```powershell
# Compactar projeto (sem node_modules e target)
cd c:\Users\Gustavo\Documents\GitHub\
tar -czf spring-boot-app.tar.gz spring-boot-app --exclude=node_modules --exclude=target

# Enviar para VM
scp spring-boot-app.tar.gz root@SEU_IP_DA_VM:/opt/

# Na VM, descompactar
# ssh root@SEU_IP_DA_VM
# cd /opt
# tar -xzf spring-boot-app.tar.gz
# cd spring-boot-app
```

### Opção C: Via GitHub Release

**Criar release no GitHub e baixar na VM:**
```bash
cd /opt
wget https://github.com/FarwBr/spring-boot-app/archive/refs/heads/main.zip
unzip main.zip
mv spring-boot-app-main spring-boot-app
cd spring-boot-app
```

---

## 4️⃣ DEPLOY NA VM

### Configurar variáveis de ambiente

```bash
cd /opt/spring-boot-app

# Copiar exemplo
cp .env.example .env

# Editar configurações
nano .env
```

**Alterar no .env:**
```bash
# Trocar senha do banco!
POSTGRES_PASSWORD=SuaSenhaForteAqui123!

# Se VM tem IP público, alterar para ele
REACT_APP_API_URL=http://SEU_IP_DA_VM:8080/api

# Portas (padrão está OK)
BACKEND_PORT=8080
FRONTEND_PORT=80
POSTGRES_PORT=5432
```

**Salvar:** `Ctrl + O`, `Enter`, `Ctrl + X`

### Executar deploy

```bash
# Dar permissão de execução ao script
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

**O script irá:**
1. ✅ Verificar Docker instalado
2. ✅ Parar containers antigos
3. ✅ Fazer build das imagens
4. ✅ Iniciar containers
5. ✅ Testar se está funcionando

**Tempo estimado:** 5-10 minutos

### Verificar se funcionou

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Ver apenas backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Ver status dos containers
docker-compose -f docker-compose.prod.yml ps
```

**Todos devem estar "Up"**

### Testar no navegador

```
Frontend: http://SEU_IP_DA_VM
Backend:  http://SEU_IP_DA_VM:8080
Swagger:  http://SEU_IP_DA_VM:8080/swagger-ui.html
```

**Exemplo:**
```
http://164.92.123.456
http://164.92.123.456:8080/swagger-ui.html
```

---

## 5️⃣ CONFIGURAR DOMÍNIO E HTTPS (Opcional)

### Se você tem um domínio (ex: meuapp.com)

**Passo 1:** Apontar domínio para IP da VM

No seu provedor de domínio (GoDaddy, Namecheap, etc):
```
Tipo: A
Nome: @
Valor: SEU_IP_DA_VM
TTL: 3600
```

**Passo 2:** Instalar Nginx e Certbot

```bash
# Instalar Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/spring-boot-app
```

**Conteúdo:**
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Swagger
    location /swagger-ui.html {
        proxy_pass http://localhost:8080/swagger-ui.html;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/spring-boot-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Instalar certificado SSL (HTTPS)
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

**Agora acesse:** https://seudominio.com

---

## 6️⃣ MONITORAMENTO E MANUTENÇÃO

### Comandos úteis

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar serviços
docker-compose -f docker-compose.prod.yml restart

# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Atualizar aplicação (após git pull)
./deploy.sh

# Ver uso de recursos
docker stats

# Backup do banco de dados
docker exec springboot-postgres-prod pg_dump -U postgres springdb > backup.sql

# Restaurar backup
docker exec -i springboot-postgres-prod psql -U postgres springdb < backup.sql
```

### Configurar auto-restart

Os containers já estão configurados com `restart: unless-stopped`, então:
- ✅ Reiniciam automaticamente se crasharem
- ✅ Iniciam automaticamente ao reiniciar a VM

### Monitorar uso de recursos

```bash
# CPU e memória em tempo real
htop

# Se não tiver, instalar:
sudo apt install htop

# Espaço em disco
df -h

# Logs do sistema
sudo journalctl -u docker.service -f
```

### Atualizar aplicação

```bash
cd /opt/spring-boot-app

# Se usa Git
git pull origin main

# Redeployar
./deploy.sh
```

---

## 🔒 SEGURANÇA

### Configurar firewall

```bash
# Instalar UFW
sudo apt install ufw

# Permitir SSH
sudo ufw allow 22

# Permitir HTTP e HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Permitir backend (se necessário acesso direto)
sudo ufw allow 8080

# Ativar firewall
sudo ufw enable
sudo ufw status
```

### Trocar senha do PostgreSQL

```bash
# Editar .env
nano .env
# Trocar POSTGRES_PASSWORD

# Recriar containers
docker-compose -f docker-compose.prod.yml down -v
./deploy.sh
```

### Backup automático

Criar script de backup:
```bash
nano /opt/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec springboot-postgres-prod pg_dump -U postgres springdb > /opt/backups/backup_$DATE.sql
# Manter apenas últimos 7 dias
find /opt/backups/ -name "backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /opt/backup.sh

# Agendar no cron (todo dia às 3h)
crontab -e
# Adicionar linha:
0 3 * * * /opt/backup.sh
```

---

## 🆘 TROUBLESHOOTING

### Containers não iniciam

```bash
# Ver logs de erro
docker-compose -f docker-compose.prod.yml logs

# Reconstruir sem cache
docker-compose -f docker-compose.prod.yml build --no-cache
./deploy.sh
```

### Porta em uso

```bash
# Ver o que está usando porta 8080
sudo lsof -i :8080

# Matar processo
sudo kill -9 PID
```

### Sem espaço em disco

```bash
# Limpar Docker
docker system prune -a --volumes

# Limpar logs antigos
sudo journalctl --vacuum-time=7d
```

### Backend não conecta ao banco

```bash
# Ver logs do PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# Verificar se PostgreSQL está rodando
docker-compose -f docker-compose.prod.yml ps postgres

# Recriar banco
docker-compose -f docker-compose.prod.yml down -v
./deploy.sh
```

---

## 📊 CHECKLIST FINAL

Antes de colocar em produção:

- [ ] VM criada e SSH funcionando
- [ ] Docker e Docker Compose instalados
- [ ] Projeto transferido para VM
- [ ] Arquivo .env configurado com senha forte
- [ ] Deploy executado com sucesso
- [ ] Frontend acessível via navegador
- [ ] Backend respondendo em /swagger-ui.html
- [ ] Firewall configurado
- [ ] Domínio apontado (se aplicável)
- [ ] HTTPS configurado (se aplicável)
- [ ] Backup automático configurado
- [ ] Monitoramento funcionando

---

## 🎯 RESUMO RÁPIDO

```bash
# 1. Na VM: Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Clonar projeto
cd /opt
git clone https://github.com/FarwBr/spring-boot-app.git
cd spring-boot-app

# 3. Configurar
cp .env.example .env
nano .env  # Trocar senha!

# 4. Deploy
chmod +x deploy.sh
./deploy.sh

# 5. Acessar
# http://SEU_IP:80 (Frontend)
# http://SEU_IP:8080 (Backend)
```

---

**🎉 Pronto! Sua aplicação está rodando em produção na VM!** 🚀
