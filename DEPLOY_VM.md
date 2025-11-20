# Guia de Deploy - VM Univates

## IP do Servidor
```
177.44.248.75
```

## Passos para Deploy

### 1. Conectar ao servidor
```bash
ssh univates@177.44.248.75
```

### 2. Fazer upload do script de deploy
**Na sua máquina local (outro terminal):**
```powershell
scp deploy-vm.sh univates@177.44.248.75:~/
```

### 3. No servidor, executar o deploy
```bash
chmod +x ~/deploy-vm.sh
~/deploy-vm.sh
```

## OU - Deploy Manual (Passo a Passo)

Se preferir fazer manual, execute os comandos abaixo **no servidor SSH**:

```bash
# 1. Clonar repositório
cd ~
git clone https://github.com/FarwBr/spring-boot-app.git
cd spring-boot-app

# 2. Atualizar IPs do frontend (substituir localhost pelo IP do servidor)
sed -i 's|http://localhost:8081|http://177.44.248.75:8081|g' frontend/src/services/userService.js
sed -i 's|http://localhost:8082|http://177.44.248.75:8082|g' frontend/src/services/eventService.js
sed -i 's|http://localhost:8083|http://177.44.248.75:8083|g' frontend/src/services/participantService.js
sed -i 's|http://localhost:8085|http://177.44.248.75:8085|g' frontend/src/services/notificationService.js

# 3. Iniciar aplicação
docker-compose up -d --build

# 4. Verificar status
docker-compose ps

# 5. Ver logs
docker-compose logs -f
```

## Acessar Aplicação

Após o deploy, acesse:

- **Frontend:** http://177.44.248.75:3000
- **User Service:** http://177.44.248.75:8081/api/users
- **Event Service:** http://177.44.248.75:8082/api/events
- **Participant Service:** http://177.44.248.75:8083/api/participants
- **Certificate Service:** http://177.44.248.75:8084/api/checkin
- **Notification Service:** http://177.44.248.75:8085/api/notifications

## Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar todos os containers
docker-compose restart

# Parar aplicação
docker-compose down

# Parar e remover volumes (limpar banco de dados)
docker-compose down -v

# Ver status dos containers
docker-compose ps

# Reconstruir e reiniciar
docker-compose up -d --build
```

## Verificação de Portas

Certifique-se de que as portas estão abertas no firewall:

```bash
# Verificar portas em uso
sudo netstat -tlnp | grep -E ':(3000|8081|8082|8083|8084|8085|5432)'

# Ou com ss
sudo ss -tlnp | grep -E ':(3000|8081|8082|8083|8084|8085|5432)'
```

## Atualizar Aplicação

Para atualizar com novas versões do GitHub:

```bash
cd ~/spring-boot-app
git pull origin main
docker-compose up -d --build
```

## Troubleshooting

### Containers não iniciam
```bash
docker-compose logs
docker-compose ps
```

### Porta já em uso
```bash
# Ver o que está usando a porta
sudo lsof -i :3000
sudo lsof -i :8081

# Parar o processo (substitua PID)
sudo kill -9 PID
```

### Resetar tudo
```bash
docker-compose down -v
docker system prune -af
docker-compose up -d --build
```

### Verificar espaço em disco
```bash
df -h
docker system df
```

## Configuração de Firewall (se necessário)

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw allow 8081/tcp
sudo ufw allow 8082/tcp
sudo ufw allow 8083/tcp
sudo ufw allow 8084/tcp
sudo ufw allow 8085/tcp

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8081-8085/tcp
sudo firewall-cmd --reload
```
