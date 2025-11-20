#!/bin/bash

# Script de deploy rápido para o servidor Univates
# Uso: bash quick-deploy.sh

echo "🚀 Iniciando deploy no servidor Univates..."

# Atualizar código
echo "📥 Atualizando código..."
cd ~/spring-boot-app
git pull origin main

# Parar containers antigos
echo "🛑 Parando containers..."
sudo docker compose down

# Rebuild e subir containers
echo "🔨 Construindo e iniciando containers..."
sudo docker compose up -d --build

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers iniciarem (30s)..."
sleep 30

# Verificar status
echo "📊 Status dos containers:"
sudo docker compose ps

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 URLs de acesso:"
echo "   Frontend: http://177.44.248.75:3000"
echo "   Backend:  http://177.44.248.75:8080"
echo "   API Gateway:"
echo "     - Users:        http://177.44.248.75:8081"
echo "     - Events:       http://177.44.248.75:8082"
echo "     - Participants: http://177.44.248.75:8083"
echo "     - Certificates: http://177.44.248.75:8084"
echo "     - Notifications: http://177.44.248.75:8085"
echo ""
echo "📋 Para ver logs:"
echo "   sudo docker compose logs -f"
