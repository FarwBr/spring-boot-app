# Sistema de Notificações por E-mail

## 📧 Alterações Implementadas

O sistema agora envia notificações automáticas por e-mail para os participantes em três momentos importantes:

### 1. **Reserva/Inscrição em Evento** ✅
- **Quando:** Usuário se inscreve em um evento
- **Destinatário:** Usuário que fez a inscrição
- **Conteúdo do E-mail:**
  - Confirmação da inscrição
  - Nome do evento
  - Data e horário do evento
  - Local do evento
  - Mensagem de boas-vindas

### 2. **Check-in Realizado** ✅
- **Quando:** Participante faz check-in no evento
- **Destinatário:** Participante que fez o check-in
- **Conteúdo do E-mail:**
  - Confirmação do check-in
  - Nome do evento
  - Agradecimento pela presença
  - Informação sobre o envio do certificado

### 3. **Evento Finalizado** ✅
- **Quando:** Organizador marca o evento como finalizado
- **Destinatário:** Todos os participantes que fizeram check-in
- **Conteúdo do E-mail:**
  - Confirmação de finalização do evento
  - Agradecimento pela participação
  - Certificado em PDF anexado
  - Mensagem de encerramento

## 🔧 Arquivos Modificados

### NotificationService.java
- Adicionado envio automático de e-mail ao criar notificação
- Criados métodos específicos:
  - `notifyEventRegistration()` - Notifica inscrição
  - `notifyCheckIn()` - Notifica check-in
  - `notifyEventFinished()` - Notifica conclusão do evento
- Envio assíncrono para não bloquear as operações

### ParticipantService.java
- Integrado com NotificationService
- Chama `notifyEventRegistration()` ao registrar usuário
- Chama `notifyCheckIn()` ao fazer check-in

### EventService.java
- Integrado com NotificationService
- Chama `notifyEventFinished()` ao finalizar evento
- Envia notificação junto com o certificado

### EmailService.java
- Já existente, mantido com suporte para HTML
- Envia e-mails com template profissional
- Suporta anexos (certificados em PDF)

## 📬 Formato dos E-mails

Todos os e-mails possuem:
- **Design profissional** com HTML/CSS
- **Header colorido** com gradiente
- **Conteúdo estruturado** e legível
- **Footer** com informações do sistema
- **Responsivo** para mobile

### Exemplo de Template

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .content { background: #f9f9f9; padding: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nova Notificação</h1>
        </div>
        <div class="content">
            <h2>Olá, [Nome]!</h2>
            <div class="notification-box">
                <h3>[Título]</h3>
                <p>[Mensagem]</p>
            </div>
        </div>
    </div>
</body>
</html>
```

## ⚙️ Configuração Necessária

O sistema usa as configurações de e-mail do `application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=gutohorst@gmail.com
spring.mail.password=lipb kmrm spsf eyso
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 🔄 Fluxo de Funcionamento

### Inscrição em Evento
```
Usuário se inscreve
    ↓
ParticipantService.registerUserToEvent()
    ↓
NotificationService.notifyEventRegistration()
    ↓
Salva notificação no banco
    ↓
Envia e-mail assíncrono (Thread separada)
```

### Check-in
```
Participante faz check-in
    ↓
ParticipantService.checkInParticipant()
    ↓
NotificationService.notifyCheckIn()
    ↓
Salva notificação no banco
    ↓
Envia e-mail assíncrono
    ↓
Envia certificado (já existente)
```

### Finalização do Evento
```
Organizador finaliza evento
    ↓
EventService.finishEvent()
    ↓
Para cada participante com check-in:
    ↓
    Gera certificado PDF
    ↓
    Envia certificado por e-mail
    ↓
    NotificationService.notifyEventFinished()
    ↓
    Salva notificação no banco
    ↓
    Envia e-mail de conclusão
```

## ✅ Benefícios

1. **Comunicação Automática:** Usuários recebem atualizações sem intervenção manual
2. **Dupla Notificação:** Sistema interno + E-mail
3. **Assíncrono:** Não bloqueia operações principais
4. **Profissional:** E-mails com design bonito e responsivo
5. **Rastreável:** Notificações salvas no banco de dados

## 🧪 Testando

### 1. Testar Inscrição
```bash
POST /api/participants/register?userId=1&eventId=1
```
- Verifica se e-mail foi recebido com confirmação

### 2. Testar Check-in
```bash
PUT /api/participants/1/checkin
```
- Verifica se e-mail de check-in foi recebido
- Verifica se certificado foi anexado

### 3. Testar Finalização
```bash
PUT /api/events/1/finish
```
- Verifica se todos os participantes receberam e-mail
- Verifica se certificados foram anexados

## 📊 Monitoramento

Os logs do console mostram:
```
📧 Notificação enviada por e-mail para: usuario@email.com
✅ Certificado enviado para: usuario@email.com
❌ Erro ao enviar notificação por e-mail: [erro]
```

## 🔐 Segurança

- E-mails enviados em thread separada (não expõe dados sensíveis)
- Falhas no envio não afetam operações principais
- Try-catch em todos os pontos de envio
- Logs de erro detalhados

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar templates mais elaborados
- [ ] Configurar sistema de filas (RabbitMQ/Kafka)
- [ ] Implementar retry automático em falhas
- [ ] Adicionar estatísticas de entrega
- [ ] Permitir usuário desativar notificações por e-mail
- [ ] Adicionar opção de notificação por SMS

---

**Data de Implementação:** 26 de Novembro de 2025  
**Versão:** 1.0
