#!/bin/bash

###############################################################################
# Script de Deploy - Spring Boot App
# Uso: ./deploy.sh
###############################################################################

set -e  # Para na primeira falha

echo "🚀 Iniciando deploy do Spring Boot App..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado!"
    echo "Instale o Docker primeiro: https://docs.docker.com/engine/install/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose não está instalado!"
    echo "Instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

print_success "Docker e Docker Compose encontrados"

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    print_warning "Arquivo .env não encontrado!"
    echo "Criando .env a partir de .env.example..."
    cp .env.example .env
    print_warning "IMPORTANTE: Edite o arquivo .env com suas configurações!"
    echo "Execute: nano .env"
    exit 1
fi

print_success "Arquivo .env encontrado"

# Parar containers existentes
echo ""
echo "📦 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
print_success "Containers parados"

# Limpar build antiga do frontend (opcional)
echo ""
echo "🧹 Limpando builds antigas..."
rm -rf frontend/build 2>/dev/null || true
print_success "Limpeza concluída"

# Build das imagens
echo ""
echo "🔨 Construindo imagens Docker..."
docker-compose -f docker-compose.prod.yml build --no-cache

if [ $? -eq 0 ]; then
    print_success "Build concluído com sucesso"
else
    print_error "Falha no build!"
    exit 1
fi

# Iniciar containers
echo ""
echo "🚀 Iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d

if [ $? -eq 0 ]; then
    print_success "Containers iniciados com sucesso"
else
    print_error "Falha ao iniciar containers!"
    exit 1
fi

# Aguardar backend iniciar
echo ""
echo "⏳ Aguardando backend inicializar..."
sleep 10

# Verificar status dos containers
echo ""
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

# Testar backend
echo ""
echo "🧪 Testando backend..."
BACKEND_PORT=$(grep BACKEND_PORT .env | cut -d '=' -f2)
BACKEND_PORT=${BACKEND_PORT:-8080}

if curl -s http://localhost:$BACKEND_PORT/actuator/health > /dev/null 2>&1 || \
   curl -s http://localhost:$BACKEND_PORT/api/users > /dev/null 2>&1; then
    print_success "Backend respondendo na porta $BACKEND_PORT"
else
    print_warning "Backend ainda não está respondendo. Isso é normal, pode levar até 60 segundos."
    echo "Use 'docker-compose -f docker-compose.prod.yml logs -f backend' para acompanhar"
fi

# Informações finais
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Deploy concluído!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Acessos:"
FRONTEND_PORT=$(grep FRONTEND_PORT .env | cut -d '=' -f2)
FRONTEND_PORT=${FRONTEND_PORT:-80}
echo "   Frontend: http://localhost:$FRONTEND_PORT"
echo "   Backend:  http://localhost:$BACKEND_PORT"
echo "   Swagger:  http://localhost:$BACKEND_PORT/swagger-ui.html"
echo ""
echo "📊 Comandos úteis:"
echo "   Ver logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "   Parar:        docker-compose -f docker-compose.prod.yml down"
echo "   Reiniciar:    docker-compose -f docker-compose.prod.yml restart"
echo "   Status:       docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "🔒 IMPORTANTE:"
echo "   1. Altere a senha do PostgreSQL no arquivo .env"
echo "   2. Configure firewall para expor apenas portas necessárias"
echo "   3. Use HTTPS em produção (Nginx + Let's Encrypt)"
echo ""
