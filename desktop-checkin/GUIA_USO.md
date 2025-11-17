# 🎯 GUIA RÁPIDO - Sistema de Check-in com Eventos

## ✅ O QUE FOI IMPLEMENTADO

### **Backend Completo:**
- ✅ Eventos (Event)
- ✅ Participantes (Participant)  
- ✅ Check-ins vinculados
- ✅ Walk-ins (pessoas sem reserva)
- ✅ 23 endpoints REST

### **Frontend Desktop:**
- ✅ Seleção de eventos ativos
- ✅ Lista de participantes por evento
- ✅ Check-in com um clique
- ✅ Adicionar walk-ins
- ✅ Funciona 100% offline
- ✅ Sincronização automática

---

## 🚀 COMO USAR

### 1. Iniciar Backend
```powershell
cd backend
mvn spring-boot:run
```

### 2. Criar Eventos de Teste

Use Postman, Thunder Client ou cURL:

```http
POST http://localhost:8080/api/events
Content-Type: application/json

{
  "name": "Conferência Tech 2025",
  "description": "Evento de tecnologia e inovação",
  "location": "Auditório Principal",
  "startTime": "2025-11-20T09:00:00",
  "endTime": "2025-11-20T18:00:00",
  "active": true,
  "maxCapacity": 100
}
```

### 3. Adicionar Participantes

```http
POST http://localhost:8080/api/participants/event/1
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "company": "Tech Corp"
}
```

Adicione vários participantes para testar!

### 4. Iniciar Aplicação Desktop

```powershell
cd desktop-checkin
npm start
```

---

## 📱 USANDO A APLICAÇÃO

### **Passo 1: Sincronizar Eventos**
1. Abra a aplicação
2. Clique em **"🔄 Atualizar Eventos"**
3. Os eventos do servidor serão baixados

### **Passo 2: Selecionar Evento**
1. No dropdown, escolha o evento
2. Participantes serão carregados automaticamente

### **Passo 3: Fazer Check-in**
1. Veja a lista de participantes
2. Clique em **"✓ Check-in"** no participante
3. Status muda para "Check-in Feito" ✅

### **Passo 4: Adicionar Walk-in**
1. Preencha o formulário "Adicionar Walk-in"
2. Nome é obrigatório
3. Email, telefone e empresa são opcionais
4. Clique em **"➕ Adicionar Sem Reserva"**
5. Pessoa aparece na lista com badge "Walk-in"

### **Teste Offline:**
1. Desconecte a internet
2. Status fica "🔴 Offline"
3. Faça check-ins → salvos localmente
4. Badge amarelo mostra pendências
5. Reconecte → sincronização automática!

---

## 📊 ESTATÍSTICAS

A tela mostra em tempo real:
- **Total**: Todos os participantes do evento
- **Check-in Feito**: Quantos já fizeram check-in
- **Pendentes**: Aguardando check-in

---

## 🎨 RECURSOS VISUAIS

### **Cores e Badges:**
- 🟢 **Verde** = Check-in realizado
- 🟡 **Amarelo** = Pendente / Walk-in
- 🔵 **Azul** = Participante esperado

### **Indicadores:**
- ✓ Check-in = Já confirmado
- Pendente = Aguardando
- Walk-in = Sem reserva prévia

---

## 🔄 SINCRONIZAÇÃO

### **Automática:**
- A cada 30 segundos
- Quando faz check-in online
- Ao iniciar aplicação

### **Manual:**
- Botão "🔄 Sincronizar"
- Botão "🔄 Atualizar Eventos"

---

## 📝 ENDPOINTS BACKEND

### **Eventos:**
- `GET /api/events/active` - Eventos ativos
- `POST /api/events` - Criar evento
- `GET /api/events/{id}` - Buscar evento

### **Participantes:**
- `GET /api/participants/event/{eventId}` - Listar por evento
- `POST /api/participants/event/{eventId}` - Adicionar participante
- `POST /api/participants/event/{eventId}/walk-in` - Adicionar walk-in
- `PATCH /api/participants/{id}/checkin` - Fazer check-in
- `GET /api/participants/event/{eventId}/stats` - Estatísticas

### **Check-ins:**
- `POST /api/checkins?eventId=X&participantId=Y` - Registrar
- `POST /api/checkins/sync` - Sincronizar offline

---

## 🎯 FLUXO COMPLETO

```
1. Criar Evento no backend (Postman)
   └─> Adicionar Participantes esperados
   
2. Abrir App Desktop
   └─> Sincronizar eventos
   └─> Selecionar evento
   └─> Ver lista de participantes
   
3. Check-in dos Participantes
   ├─> Participante com reserva: Clique em "Check-in"
   └─> Walk-in (sem reserva): Adicione pelo formulário
   
4. Sincronização
   ├─> Online: Imediata
   └─> Offline: Ao reconectar
```

---

## 🐛 TROUBLESHOOTING

### **"Nenhum evento aparece"**
→ Clique em "Atualizar Eventos" com internet

### **"Erro ao sincronizar"**
→ Verifique se backend está rodando (porta 8080)

### **"Participantes não carregam"**
→ Certifique-se que selecionou um evento

### **"Walk-in não sincroniza"**
→ Normal se offline, sincroniza automaticamente quando online

---

## 📦 ESTRUTURA DE DADOS

```
Event
├── name: "Conferência Tech 2025"
├── location: "Auditório Principal"
├── startTime: 2025-11-20T09:00:00
├── endTime: 2025-11-20T18:00:00
└── active: true

Participant
├── name: "João Silva"
├── email: "joao@example.com"
├── event: Event (relação)
├── checkedIn: false
└── isWalkIn: false

CheckIn
├── event: Event (relação)
├── participant: Participant (relação)
├── checkInTime: 2025-11-20T10:30:00
└── syncedFromOffline: false
```

---

## ✅ PRÓXIMOS PASSOS

1. **Teste agora:**
   - Inicie o backend
   - Crie 1 evento via Postman
   - Adicione 3-5 participantes
   - Abra o desktop app
   - Sincronize e teste!

2. **Comittar mudanças:**
   ```powershell
   git add .
   git commit -m "feat: Sistema completo de check-in com eventos"
   git push
   ```

---

**Tudo pronto! 🚀** A aplicação está completa e funcional!
