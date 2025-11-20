#!/bin/bash

# Script de Instalação do Docker e Docker Compose
# Para Ubuntu/Debian

echo "=== Instalando Docker e Docker Compose ==="
echo ""

# 1. Atualizar sistema
echo "1. Atualizando sistema..."
sudo apt-get update

# 2. Instalar dependências
echo "2. Instalando dependências..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 3. Adicionar chave GPG oficial do Docker
echo "3. Adicionando chave GPG do Docker..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Adicionar repositório do Docker
echo "4. Adicionando repositório do Docker..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Atualizar apt novamente
echo "5. Atualizando lista de pacotes..."
sudo apt-get update

# 6. Instalar Docker
echo "6. Instalando Docker..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 7. Adicionar usuário ao grupo docker
echo "7. Adicionando usuário ao grupo docker..."
sudo usermod -aG docker $USER

# 8. Iniciar Docker
echo "8. Iniciando serviço Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# 9. Verificar instalação
echo ""
echo "=== Verificando instalação ==="
sudo docker --version
sudo docker compose version

echo ""
echo "=== Instalação Concluída! ==="
echo ""
echo "IMPORTANTE: Faça logout e login novamente para que as permissões do grupo docker sejam aplicadas."
echo "Ou execute: newgrp docker"
echo ""
echo "Após isso, você poderá executar docker sem sudo."
