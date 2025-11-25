# Setup Windows para rodar o sistema (Backend + Frontend + Desktop Check-in)

Este guia prepara um notebook Windows (10/11) para executar todo o ecossistema amanhã sem dores.

## 1. Visão Geral dos Componentes
- Backend Spring Boot (Java 17 + Maven + PostgreSQL)
- Frontend React (Node.js 18 buildado e servido via Nginx em Docker ou `npm start` local)
- Desktop Check-in (App Electron - Node.js 18)
- Banco de Dados PostgreSQL (Docker)
- Nginx Gateway (Docker) – opcional em dev local (pode acessar serviços diretamente)

## 2. Dependências Obrigatórias
| Ferramenta | Versão Recomendada | Uso |
|------------|--------------------|-----|
| Git        | Latest             | Clonar repositório |
| Java JDK   | 17 (Temurin)       | Executar backend / build Maven |
| Maven      | 3.9+               | Build backend local (se fora do Docker) |
| Node.js    | 18.x LTS           | Rodar frontend dev / desktop-checkin |
| npm        | bundled            | Instalar pacotes JS |
| Docker     | Latest             | Subir containers (backend, frontend, gateway, postgres) |
| Docker Compose | v2+           | Orquestrar serviços |
| PostgreSQL | 15 (via Docker)    | Persistência |
| Postman (opcional) | Latest    | Testar APIs |

## 3. Instalação Rápida com winget (Administrador)
Abra PowerShell como Administrador e execute:
```powershell
winget install --id Git.Git -e
winget install --id EclipseAdoptium.Temurin.17.JDK -e
winget install --id Apache.Maven -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Docker.DockerDesktop -e
winget install --id Postman.Postman -e  # opcional
```
Reinicie a máquina após instalar Docker Desktop (necessário para ativar WSL backend).

### Alternativa com Chocolatey (se preferir)
Instalar Chocolatey (Administrador):
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
Depois:
```powershell
choco install git temurin17 maven nodejs-lts docker-desktop -y
choco install postman -y  # opcional
```

## 4. Verificação das Instalações
```powershell
git --version
java -version
mvn -version
node -v
npm -v
docker --version
docker compose version
```
Se algum falhar, abra novamente PowerShell como Admin e verifique PATH.

## 5. Clonar Repositório
```powershell
cd C:\Users\<SeuUsuario>\Documents\GitHub
git clone https://github.com/FarwBr/spring-boot-app.git
cd spring-boot-app
```

## 6. Rodar Tudo com Docker (Modo Completo)
Certifique-se de que Docker Desktop está aberto.
```powershell
cd spring-boot-app
docker compose pull  # opcional se já houver imagens
docker compose up -d --build
```
Serviços esperados:
- Backend Java: acessível em `http://localhost:8082` (se configurado no compose) ou conforme portas do gateway
- Gateway / Nginx: `http://localhost:8080`
- Frontend React: `http://localhost:3000` (se rodar fora do Docker) ou via Nginx conforme compose
- PostgreSQL: porta `5432`

Para ver logs:
```powershell
docker compose ps
docker compose logs -f spring-backend
```
Parar tudo:
```powershell
docker compose down
```

## 7. Rodar Backend Local sem Docker (Opcional)
Pré-requisitos: PostgreSQL local ou container ativo.
1. Garanta que `application.properties` aponta para seu banco local (ajustar host se não usar Docker). Exemplo:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=postgres
```
2. Build + run:
```powershell
cd backend
mvn spring-boot:run
```
Backend sobe em `http://localhost:8081` (ou porta definida em `application.properties`).

## 8. Rodar Frontend em Dev (Hot Reload)
```powershell
cd frontend
npm install
npm start
```
Acessar em `http://localhost:3000`.
Se quiser buildar manualmente:
```powershell
npm run build
```

## 9. Rodar Aplicação Desktop de Check-in
```powershell
cd desktop-checkin
npm install
npm start  # ou npm run electron-dev se configurado
```
Verifique arquivo `GUIA_USO.md` para fluxo operacional.

## 10. Variáveis de Ambiente (se necessário)
Atualmente propriedades estão embutidas. Caso externalize:
- `DB_HOST`, `DB_USER`, `DB_PASS` para substituir no `application.properties` via placeholders.
- JWT secrets ou configurações de segurança (não presentes explicitamente aqui) podem ser adicionadas posteriormente.

## 11. Testes Básicos Após Subida
1. Abrir frontend e realizar login (usuário admin se existir).  
2. Acessar página de Eventos e verificar listagem.  
3. Criar/inscrever-se em evento e fazer check-in (se disponível).  
4. Gerar certificado e abrir PDF (novo endpoint inline).  
5. Verificar finalização manual de evento refletindo em `Meus Eventos`.  

### Checar API Manualmente (Postman ou curl)
```powershell
curl http://localhost:8081/api/health
curl http://localhost:8083/api/participants/user/1
```

## 12. Limpeza / Reset
Apagar containers/imagens:
```powershell
docker compose down -v
docker image prune -f
docker volume prune -f
```

## 13. Problemas Comuns
| Sintoma | Possível causa | Solução |
|---------|----------------|---------|
| Docker não inicia | WSL2 desativado | Ativar WSL + reiniciar |
| `mvn` não encontrado | PATH incorreto | Reabrir terminal / reiniciar |
| Frontend não acessa API | CORS/gateway parado | Verificar container gateway / porta |
| Certificado não abre | Check-in inexistente | Fazer check-in primeiro |

## 14. Script Automação
Veja `setup.ps1` (criado ao lado) para automatizar verificações e instalação mínima.

## 15. Desinstalação (Opcional)
Remover ferramentas via "Apps & Features" ou:
```powershell
winget uninstall EclipseAdoptium.Temurin.17.JDK
winget uninstall OpenJS.NodeJS.LTS
winget uninstall Docker.DockerDesktop
```

---
Pronto: com isso o notebook estará apto a rodar tudo amanhã. Qualquer ajuste adicional (ex: dados iniciais) pode ser feito via scripts SQL ou endpoints de criação.
