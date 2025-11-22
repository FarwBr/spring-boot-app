# ✅ Checklist de Testes - Sincronização Desktop ↔ Web

## 🎯 Objetivo
Verificar se dados sincronizam corretamente entre Desktop e Web após as correções.

---

## ✅ Teste 1: Web → Desktop (Participante)

**Objetivo:** Verificar se participante cadastrado no Web aparece no Desktop

### Passos:
- [ ] 1. Abrir Web: http://177.44.248.75:3000
- [ ] 2. Login como ADMIN (admin@example.com / admin123)
- [ ] 3. Menu "👤 Participantes"
- [ ] 4. Selecionar um evento
- [ ] 5. Clicar "➕ Adicionar Participante"
- [ ] 6. Preencher:
  - Nome: **Teste Web 1**
  - Email: **testeweb1@exemplo.com**
  - Telefone: 51999999999
  - Empresa: Empresa Teste
- [ ] 7. Clicar "➕ Adicionar"
- [ ] 8. Abrir Desktop (se já estiver aberto, aguardar 30 segundos)
- [ ] 9. Selecionar o mesmo evento
- [ ] 10. Verificar lista de participantes

### ✅ Resultado Esperado:
- **"Teste Web 1"** deve aparecer na lista do Desktop
- Email: testeweb1@exemplo.com
- Badge: **"📝 Pré-cadastro"** (não é walk-in)
- Dados completos (telefone, empresa)

### ❌ Se Falhar:
- Verificar se Desktop está online
- Clicar em "🔄 Atualizar Eventos" no Desktop
- Aguardar mais 30 segundos
- Verificar logs do Desktop (console)

---

## ✅ Teste 2: Desktop → Web (Walk-in)

**Objetivo:** Verificar se walk-in cadastrado no Desktop aparece no Web

### Passos:
- [ ] 1. Abrir Desktop
- [ ] 2. Selecionar um evento
- [ ] 3. Clicar "➕ Adicionar Participante"
- [ ] 4. Preencher:
  - Nome: **Teste Desktop 1**
  - Email: **testedesktop1@exemplo.com**
  - Telefone: 51888888888
  - Empresa: Desktop Ltda
- [ ] 5. Clicar "Adicionar"
- [ ] 6. Aguardar 30 segundos (sincronização automática)
- [ ] 7. Ir para o Web (navegador)
- [ ] 8. F5 para atualizar a página
- [ ] 9. Menu "👤 Participantes"
- [ ] 10. Selecionar o mesmo evento

### ✅ Resultado Esperado:
- **"Teste Desktop 1"** deve aparecer na lista do Web
- Email: testedesktop1@exemplo.com
- Badge: **"🚶 Walk-in"** (criado no desktop)
- Dados completos (telefone, empresa)

### ❌ Se Falhar:
- Verificar se Desktop está online (olhar indicador de conexão)
- Desktop deve mostrar mensagem "X registro(s) sincronizado(s)!"
- Aguardar mais 30 segundos
- Tentar sincronização manual no Desktop

---

## ✅ Teste 3: Login com Participante Criado

**Objetivo:** Verificar se participante virou usuário e pode fazer login

### Passos:
- [ ] 1. Usar email de participante cadastrado: **testeweb1@exemplo.com**
- [ ] 2. Fazer logout no Web (se logado)
- [ ] 3. Tela de login
- [ ] 4. Preencher:
  - Email: testeweb1@exemplo.com
  - Senha: **123** (senha padrão)
- [ ] 5. Clicar "Entrar"

### ✅ Resultado Esperado:
- ✅ Login deve funcionar
- Usuário: "Teste Web 1"
- Role: 👨 **Cliente** (não Admin)
- Menu: NÃO deve ver "👥 Usuários" nem "👤 Participantes"
- Menu: DEVE ver "🎫 Meus Eventos"

### ❌ Se Falhar:
- Verificar se backend foi rebuilado (correção de createParticipant)
- Verificar na tela "👥 Usuários" (como Admin) se usuário foi criado
- Tentar senha diferente (caso já existisse antes)

---

## ✅ Teste 4: Meus Eventos (Cliente)

**Objetivo:** Verificar se tela "Meus Eventos" carrega sem erros

### Passos:
- [ ] 1. Login como CLIENT (usar conta criada no teste 3)
- [ ] 2. Menu "🎫 Meus Eventos"
- [ ] 3. Verificar se dropdown de usuários carrega

### ✅ Resultado Esperado:
- ❌ NÃO deve aparecer erro "Usuários não carregados"
- ✅ Dropdown deve mostrar lista de usuários
- ✅ Pode selecionar usuário e ver eventos

### ❌ Se Falhar:
- Verificar se frontend foi rebuilado (correção de MyEventsPage.js)
- Abrir console do navegador (F12) e verificar erros
- Verificar se URL das APIs está correta (8081, 8082, 8083)

---

## ✅ Teste 5: Sincronização Bidirecional

**Objetivo:** Verificar sincronização simultânea de ambos os lados

### Passos:
- [ ] 1. Web: Adicionar participante "João" no Evento A
- [ ] 2. Desktop: Adicionar walk-in "Pedro" no Evento A
- [ ] 3. Aguardar 30 segundos
- [ ] 4. Atualizar Web (F5)
- [ ] 5. Verificar Desktop

### ✅ Resultado Esperado:
**No Desktop:**
- ✅ João (do Web) aparece
- ✅ Pedro (local) permanece

**No Web:**
- ✅ João (Web) aparece
- ✅ Pedro (Desktop) aparece com badge "🚶 Walk-in"

### ❌ Se Falhar:
- Verificar logs do Desktop
- Forçar sincronização manual (botão "Atualizar Eventos")
- Verificar se ambos estão no mesmo evento

---

## ✅ Teste 6: Offline → Online

**Objetivo:** Verificar sincronização após Desktop ficar offline

### Passos:
- [ ] 1. Desktop: Desconectar internet (WiFi off ou cabo)
- [ ] 2. Adicionar 2 walk-ins: "Ana Offline" e "Bruno Offline"
- [ ] 3. Verificar que participantes aparecem no Desktop
- [ ] 4. Reconectar internet
- [ ] 5. Aguardar 30 segundos
- [ ] 6. Desktop deve mostrar mensagem "X registro(s) sincronizado(s)!"
- [ ] 7. Verificar no Web

### ✅ Resultado Esperado:
- ✅ Desktop: 2 participantes locais visíveis mesmo offline
- ✅ Após reconectar: Mensagem de sincronização
- ✅ Web: Ana e Bruno aparecem com badge "🚶 Walk-in"
- ✅ Usuários criados automaticamente (podem fazer login com senha "123")

---

## 📊 Resumo dos Testes

| Teste | Descrição | Status |
|-------|-----------|--------|
| 1 | Web → Desktop | ⬜ |
| 2 | Desktop → Web | ⬜ |
| 3 | Login Participante | ⬜ |
| 4 | Meus Eventos | ⬜ |
| 5 | Bidirecional | ⬜ |
| 6 | Offline → Online | ⬜ |

---

## 🚨 Problemas Comuns

### Participante não aparece:
- ✅ Aguardar 30 segundos (sincronização automática)
- ✅ Clicar "Atualizar Eventos" no Desktop
- ✅ F5 no navegador Web
- ✅ Verificar se está no mesmo evento

### Erro "Usuários não carregados":
- ✅ Frontend precisa rebuild
- ✅ Limpar cache do navegador (Ctrl+Shift+R)
- ✅ Verificar console do navegador (F12)

### Login não funciona:
- ✅ Backend precisa rebuild
- ✅ Senha é **123** (padrão)
- ✅ Verificar se usuário foi criado (menu "Usuários" como Admin)

### Desktop não sincroniza:
- ✅ Verificar conexão internet
- ✅ Olhar console do Desktop (npm start -- --dev)
- ✅ Verificar URL do backend (177.44.248.75:8082)

---

## 🔧 Deploy Necessário

### Backend:
```bash
ssh univates@177.44.248.75
cd spring-boot-app
git pull origin main
sudo docker compose up -d --build backend
```

### Frontend:
```bash
sudo docker compose up -d --build frontend
```

### Desktop:
```bash
# Se rodar do repositório:
cd desktop-checkin
git pull origin main
# Fechar e reabrir aplicativo
npm start
```

---

## ✅ Tudo Passou?

Se todos os testes passarem:
- 🎉 **Sistema 100% funcional!**
- 🔄 **Sincronização bidirecional funcionando**
- ✅ **Desktop e Web sempre com mesmos dados**

---

**Data:** 22 de Novembro de 2025  
**Versão:** Sincronização Bidirecional v1.0
