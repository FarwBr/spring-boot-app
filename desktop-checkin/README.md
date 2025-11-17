# 🖥️ Check-in Desktop - Aplicação Offline

Aplicação desktop standalone para registro de check-ins com **funcionamento 100% offline** e **sincronização automática** quando a internet retornar.

## 🎯 Características

- ✅ **100% Funcional Offline** - Trabalha sem internet usando SQLite local
- ✅ **Sincronização Automática** - Envia dados quando detecta conexão
- ✅ **Interface Moderna** - Design responsivo e intuitivo
- ✅ **Multi-plataforma** - Windows, macOS e Linux
- ✅ **Banco Local** - SQLite armazena dados localmente
- ✅ **Indicador de Status** - Mostra status online/offline em tempo real
- ✅ **Contador de Pendências** - Visualiza quantos check-ins aguardam sincronização

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Backend Spring Boot rodando (para sincronização online)

## 🚀 Como Executar

### 1. Instalar Dependências

```powershell
cd desktop-checkin
npm install
```

### 2. Executar em Modo Desenvolvimento

```powershell
npm run dev
```

### 3. Executar em Modo Produção

```powershell
npm start
```

## 📦 Como Gerar Executável

### Windows (.exe)
```powershell
npm run build:win
```
Gera: `dist/Check-in Desktop Setup.exe` e versão portátil

### macOS (.dmg)
```bash
npm run build:mac
```
Gera: `dist/Check-in Desktop.dmg`

### Linux (.AppImage)
```bash
npm run build:linux
```
Gera: `dist/Check-in Desktop.AppImage` e `.deb`

## 🗂️ Estrutura de Arquivos

```
desktop-checkin/
├── package.json          # Configurações do projeto
├── main.js              # Processo principal do Electron
├── preload.js           # Bridge seguro entre Electron e UI
├── index.html           # Interface do usuário
├── README.md            # Esta documentação
└── assets/              # Ícones (criar depois)
    ├── icon.png
    ├── icon.ico
    └── icon.icns
```

## 💾 Banco de Dados Local

- **Tipo:** SQLite
- **Localização:** `%APPDATA%/checkin-desktop/checkin.db` (Windows)
- **Backup:** Copiar este arquivo para backup

### Estrutura da Tabela

```sql
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  checkInTime TEXT NOT NULL,
  synced INTEGER DEFAULT 0,
  localCreatedAt TEXT NOT NULL
)
```

## 🔄 Como Funciona a Sincronização

### Fluxo Offline
1. Usuário registra check-in
2. Dados salvos no SQLite local
3. Marcado como `synced = 0` (pendente)

### Fluxo Online
1. Aplicação detecta conexão a cada 30 segundos
2. Busca registros com `synced = 0`
3. Envia para `POST /api/checkins/sync`
4. Marca como `synced = 1` se sucesso
5. Notifica usuário sobre sincronização

## ⚙️ Configuração

### Mudar URL do Backend

Edite `main.js`:

```javascript
const BACKEND_URL = 'http://SEU-SERVIDOR:8080/api/checkins';
```

Ou defina variável de ambiente:

```powershell
$env:BACKEND_URL="http://seu-servidor:8080/api/checkins"
npm start
```

## 🎨 Funcionalidades da Interface

### Indicador de Status
- 🟢 **Online** - Conectado ao servidor, sincronização ativa
- 🔴 **Offline** - Sem conexão, salvando localmente

### Badges
- 🟡 **X pendentes** - Registros aguardando sincronização

### Estatísticas
- **Total** - Todos os check-ins registrados
- **Sincronizados** - Já enviados ao servidor
- **Pendentes** - Aguardando sincronização

### Ações
- ✅ **Registrar Check-in** - Criar novo registro
- 🔄 **Sincronizar** - Forçar sincronização manual
- 🗑️ **Excluir** - Remover check-in local

## 🔧 Desenvolvimento

### Estrutura do Código

**main.js** - Processo principal
- Gerencia banco SQLite
- Controla janela Electron
- Sincronização em background
- IPC handlers

**preload.js** - Contexto bridge
- Expõe APIs seguras
- Isola contextos

**index.html** - Interface
- Formulário de check-in
- Lista de registros
- Estatísticas
- Notificações

## 🐛 Troubleshooting

### Erro: "better-sqlite3 not found"
```powershell
npm rebuild better-sqlite3
```

### Erro: "Cannot find module electron"
```powershell
npm install --save-dev electron
```

### Banco de dados corrompido
```powershell
# Localizar arquivo
cd $env:APPDATA\checkin-desktop
# Deletar e reiniciar app
Remove-Item checkin.db
```

### Sincronização não funciona
1. Verificar se backend está rodando
2. Testar URL: `http://localhost:8080/api/checkins`
3. Verificar logs no DevTools (F12)

## 📝 Roadmap Futuro

- [ ] Adicionar campo de foto/assinatura
- [ ] Exportar relatórios em PDF/Excel
- [ ] Gráficos e dashboard
- [ ] Suporte a múltiplos usuários
- [ ] Backup automático na nuvem
- [ ] Tema dark/light
- [ ] Notificações desktop
- [ ] Atalhos de teclado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Sinta-se livre para usar em projetos pessoais e comerciais.

## 🆘 Suporte

- 📧 Email: suporte@example.com
- 💬 Issues: https://github.com/seu-usuario/checkin-desktop/issues
- 📚 Docs: https://github.com/seu-usuario/checkin-desktop/wiki
