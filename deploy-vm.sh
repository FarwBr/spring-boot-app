#!/bin/bash

# Script de Deploy para VM da Univates
# Execute este script no servidor após conectar via SSH

echo "=== Iniciando Deploy da Aplicação ==="
echo ""

# 1. Criar diretório para o projeto
echo "1. Criando diretório do projeto..."
mkdir -p ~/spring-boot-app
cd ~/spring-boot-app

# 2. Clonar repositório (ou atualizar se já existe)
echo "2. Clonando/Atualizando repositório..."
if [ -d ".git" ]; then
    echo "Repositório já existe. Atualizando..."
    git pull origin main
else
    echo "Clonando repositório..."
    git clone https://github.com/FarwBr/spring-boot-app.git .
fi

# 3. Obter IP do servidor
echo "3. Detectando IP do servidor..."
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP="177.44.248.75"
fi
echo "IP do servidor: $SERVER_IP"

# 4. Atualizar URLs do frontend
echo "4. Atualizando URLs do frontend para usar IP do servidor..."

# userService.js
sed -i "s|http://localhost:8081|http://$SERVER_IP:8081|g" frontend/src/services/userService.js

# eventService.js
sed -i "s|http://localhost:8082|http://$SERVER_IP:8082|g" frontend/src/services/eventService.js

# participantService.js
sed -i "s|http://localhost:8083|http://$SERVER_IP:8083|g" frontend/src/services/participantService.js

# notificationService.js
sed -i "s|http://localhost:8085|http://$SERVER_IP:8085|g" frontend/src/services/notificationService.js

echo "URLs atualizadas para $SERVER_IP"

# 5. Parar containers existentes (se houver)
echo "5. Parando containers existentes..."
docker-compose down 2>/dev/null || true

# 6. Limpar imagens antigas (opcional)
echo "6. Limpando imagens antigas..."
docker system prune -f

# 7. Build e iniciar containers
echo "7. Construindo e iniciando containers..."
docker-compose up -d --build

# 8. Aguardar containers iniciarem
echo "8. Aguardando containers iniciarem..."
sleep 15

# 9. Verificar status
echo "9. Verificando status dos containers..."
docker-compose ps

# 10. Verificar logs
echo ""
echo "10. Verificando logs (últimas 20 linhas)..."
docker-compose logs --tail=20

# 11. Teste de conectividade
echo ""
echo "=== Testando conectividade ==="
echo "Frontend: http://$SERVER_IP:3000"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000 || echo "Frontend ainda iniciando..."

echo "User Service: http://$SERVER_IP:8081/api/users"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8081/api/users || echo "User Service ainda iniciando..."

echo "Event Service: http://$SERVER_IP:8082/api/events"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8082/api/events || echo "Event Service ainda iniciando..."

echo ""
echo "=== Deploy Concluído! ==="
echo ""
echo "Acesse a aplicação em:"
echo "  Frontend: http://$SERVER_IP:3000"
echo ""
echo "APIs disponíveis:"
echo "  User Service:        http://$SERVER_IP:8081/api/users"
echo "  Event Service:       http://$SERVER_IP:8082/api/events"
echo "  Participant Service: http://$SERVER_IP:8083/api/participants"
echo "  Certificate Service: http://$SERVER_IP:8084/api/checkin"
echo "  Notification Service: http://$SERVER_IP:8085/api/notifications"
echo ""
echo "Para ver logs em tempo real: docker-compose logs -f"
echo "Para parar: docker-compose down"
echo "Para reiniciar: docker-compose restart"
