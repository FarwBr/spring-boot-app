# 🚀 GUIA RÁPIDO - Aplicação Desktop de Check-in Offline

## ⚡ Instalação Rápida

### 1. Instalar dependências
```powershell
cd desktop-checkin
npm install
```

### 2. Executar a aplicação
```powershell
npm start
```

## 🎯 Como Usar

### ✅ Registrar Check-in (Funciona OFFLINE)
1. Preencha o formulário:
   - Nome do Usuário
   - Local
   - Observações (opcional)
2. Clique em "Registrar Check-in"
3. Dados salvos localmente no SQLite

### 🔄 Sincronização Automática
- **Automática**: A cada 30 segundos quando online
- **Manual**: Clique no botão "🔄 Sincronizar"
- Notificação aparece quando sincronização completa

### 📊 Indicadores
- 🟢 **Online**: Verde - conectado ao servidor
- 🔴 **Offline**: Vermelho - trabalhando localmente
- 🟡 **Badge amarelo**: Mostra quantos check-ins aguardam sincronização

### 🗑️ Deletar Check-in
- Clique no botão "Excluir" em qualquer check-in
- Confirme a exclusão

## 📦 Gerar Executável

### Windows
```powershell
npm run build:win
```
**Resultado**: `dist/Check-in Desktop Setup.exe`

### macOS
```bash
npm run build:mac
```
**Resultado**: `dist/Check-in Desktop.dmg`

### Linux
```bash
npm run build:linux
```
**Resultado**: `dist/Check-in Desktop.AppImage`

## 🔧 Configuração Backend

### Certificar que o backend está rodando:
```powershell
cd ..\backend
mvn spring-boot:run
```

**URL padrão**: http://localhost:8080/api/checkins

### Mudar URL do servidor
Edite `main.js` linha 8:
```javascript
const BACKEND_URL = 'http://SEU-SERVIDOR:8080/api/checkins';
```

## 💾 Onde ficam os dados?

### Banco de dados local:
- **Windows**: `C:\Users\SEU-USUARIO\AppData\Roaming\checkin-desktop\checkin.db`
- **macOS**: `~/Library/Application Support/checkin-desktop/checkin.db`
- **Linux**: `~/.config/checkin-desktop/checkin.db`

### Fazer backup:
```powershell
# Windows
Copy-Item "$env:APPDATA\checkin-desktop\checkin.db" ".\backup-checkin.db"
```

## 🐛 Solução de Problemas

### Erro ao instalar dependências
```powershell
# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Sincronização não funciona
1. Verifique se backend está rodando
2. Teste no navegador: http://localhost:8080/api/checkins
3. Verifique firewall/antivírus

### Aplicação não abre
```powershell
# Executar com logs
npm run dev
# Pressione F12 para ver DevTools
```

### Resetar banco de dados
```powershell
# Localizar e deletar banco
cd $env:APPDATA\checkin-desktop
Remove-Item checkin.db
# Reiniciar aplicação
```

## 📝 Fluxo de Trabalho

### Cenário 1: Com Internet
1. Abrir aplicação → Status 🟢 Online
2. Registrar check-in → ✅ Salvo + Sincronizado imediatamente
3. Aparece na lista com badge "✓ Sincronizado"

### Cenário 2: Sem Internet
1. Abrir aplicação → Status 🔴 Offline
2. Registrar check-in → 💾 Salvo localmente
3. Badge amarelo mostra "1 pendente"
4. Check-in aparece com badge "⏳ Pendente"

### Cenário 3: Internet Retorna
1. Status muda para 🟢 Online
2. Após 30s: Sincronização automática
3. Notificação: "X check-in(s) sincronizado(s)"
4. Badge amarelo desaparece
5. Status muda para "✓ Sincronizado"

## 🎨 Recursos da Interface

### Formulário
- Validação em tempo real
- Campos obrigatórios marcados com *
- Limpa automaticamente após envio

### Lista de Check-ins
- Ordenada por data (mais recente primeiro)
- Scroll infinito
- Cores diferentes para status

### Estatísticas
- **Total**: Todos os registros
- **Sincronizados**: Já no servidor
- **Pendentes**: Aguardando sincronização

### Notificações
- Aparecem no canto superior direito
- Desaparecem após 4 segundos
- Cores: Verde (sucesso), Vermelho (erro)

## 🔐 Segurança

- Dados criptografados no SQLite
- Validação no backend
- CORS configurado
- Context Isolation ativado

## 📱 Distribuição

### Compartilhar com equipe:
1. Gerar executável: `npm run build:win`
2. Enviar arquivo: `dist/Check-in Desktop Setup.exe`
3. Duplo clique para instalar
4. Não precisa configurar nada!

### Updates:
1. Gerar novo executável
2. Desinstalar versão antiga
3. Instalar nova versão
4. Dados locais são mantidos

## 💡 Dicas

✅ **Deixe aberto**: Sincroniza automaticamente em background
✅ **Check-ins offline**: Funcionam normalmente
✅ **Badge amarelo**: Indica pendências
✅ **Botão sincronizar**: Use para forçar sync imediata
✅ **DevTools (F12)**: Para debug avançado

## 🆘 Suporte

- Issues: Crie um issue no GitHub
- Email: suporte@example.com
- Docs completas: Ver README.md

---

**Versão**: 1.0.0  
**Última atualização**: 17/11/2025
