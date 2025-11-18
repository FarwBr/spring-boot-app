# 📧 CONFIGURAR ENVIO DE EMAIL E CERTIFICADOS

## 🎯 SISTEMA IMPLEMENTADO

O sistema agora envia automaticamente um **certificado em PDF** por email quando o participante faz check-in em um evento!

---

## 🔧 CONFIGURAÇÃO DO EMAIL (GMAIL)

### **PASSO 1: Criar Senha de App no Gmail**

1. Acesse: https://myaccount.google.com/security
2. Ative a **Verificação em duas etapas** (se ainda não estiver ativada)
3. Procure por "Senhas de app" ou acesse: https://myaccount.google.com/apppasswords
4. Selecione:
   - **App:** Email
   - **Dispositivo:** Windows Computer (ou outro)
5. Clique em **Gerar**
6. **Copie a senha de 16 caracteres** gerada (ex: `abcd efgh ijkl mnop`)

---

## ⚙️ CONFIGURAR NO PROJETO

### **Opção 1: Desenvolvimento Local**

Edite: `backend/src/main/resources/application.properties`

```properties
# Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu-email@gmail.com
spring.mail.password=abcdefghijklmnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
```

**Substitua:**
- `seu-email@gmail.com` → Seu email
- `abcdefghijklmnop` → Senha de app gerada (sem espaços!)

---

### **Opção 2: Docker (Produção)**

Edite o arquivo `.env` na raiz do projeto:

```bash
# Mail Configuration
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=abcdefghijklmnop
```

O `docker-compose.prod.yml` vai passar essas variáveis para o backend automaticamente.

---

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### **1. Envio Automático ao Check-in**
```
✅ Participante faz check-in
✅ Sistema gera certificado PDF automaticamente
✅ Email é enviado com o certificado anexado
✅ Processo é assíncrono (não trava o check-in)
```

### **2. Endpoint Manual para Reenvio**
```http
POST /api/participants/{id}/send-certificate
```

**Uso:** Reenviar certificado caso necessário

**Validações:**
- ✅ Participante deve ter feito check-in
- ✅ Participante deve ter email cadastrado
- ❌ Retorna erro 400 se não atender requisitos

---

## 📄 CERTIFICADO EM PDF

### **Características:**

✅ **Formato:** A4 Paisagem (horizontal)  
✅ **Design:** Borda colorida, fontes estilizadas  
✅ **Conteúdo:**
- Título "CERTIFICADO DE PARTICIPAÇÃO"
- Nome do participante (destaque)
- Nome do evento
- Local e data do evento
- Data/hora do check-in
- Data de emissão
- Linha de assinatura

✅ **Nome do arquivo:** `Certificado_NomeDoEvento.pdf`

---

## 📧 EMAIL HTML

### **Template Profissional:**

✅ Design responsivo  
✅ Cores gradiente (roxo/azul)  
✅ Mensagem personalizada  
✅ Certificado anexado automaticamente  
✅ Instruções para o participante  

**Assunto:** "Certificado de Participação - [Nome do Evento]"

---

## 🔍 TESTAR O SISTEMA

### **1. Configurar Email**
```bash
# Editar application.properties ou .env
nano backend/src/main/resources/application.properties
```

### **2. Iniciar Backend**
```bash
cd backend
mvn spring-boot:run
```

### **3. Fazer Check-in de um Participante**

**Via Swagger:**
```
http://localhost:8080/swagger-ui.html
```

**Via cURL:**
```bash
curl -X PATCH http://localhost:8080/api/participants/1/checkin
```

**Via Frontend:**
- Acessar "Participantes"
- Selecionar evento
- Clicar em "Check-in" para um participante com email válido

### **4. Verificar Logs**
```
✅ Certificado enviado para: joao@email.com
```

### **5. Verificar Email**
- Abrir caixa de entrada do participante
- Verificar email com certificado anexado
- Baixar e visualizar PDF

---

## 🧪 REENVIAR CERTIFICADO MANUALMENTE

Se precisar reenviar um certificado:

**Via Swagger:**
```
POST /api/participants/{id}/send-certificate
```

**Via cURL:**
```bash
curl -X POST http://localhost:8080/api/participants/1/send-certificate
```

**Resposta:**
```json
{
  "message": "Certificado enviado com sucesso!"
}
```

---

## 🔒 SEGURANÇA

### **Importante:**

⚠️ **NUNCA** commite senhas de email no Git!

✅ Use variáveis de ambiente (`.env`)  
✅ Adicione `.env` no `.gitignore`  
✅ Use senhas de app (não senha da conta)  
✅ Para produção, considere usar:
- AWS SES (Simple Email Service)
- SendGrid
- Mailgun
- SMTP da hospedagem

---

## 🐛 TROUBLESHOOTING

### **Erro: "Authentication failed"**
```
Solução:
1. Verifique se ativou verificação em 2 etapas
2. Gere nova senha de app
3. Copie senha SEM espaços
4. Reinicie o backend
```

### **Erro: "Could not connect to SMTP host"**
```
Solução:
1. Verifique conexão com internet
2. Firewall não está bloqueando porta 587
3. Host está correto: smtp.gmail.com
```

### **Email não chega**
```
Solução:
1. Verificar caixa de SPAM
2. Verificar logs do backend para erros
3. Confirmar que email do participante está correto
4. Testar envio manual via endpoint
```

### **Certificado não gera**
```
Solução:
1. Verificar se dependência iText está no pom.xml
2. Fazer rebuild: mvn clean install
3. Verificar logs de erro no console
```

---

## 📊 ESTATÍSTICAS DO SISTEMA

### **Dependências Adicionadas:**
- ✅ `spring-boot-starter-mail` - Envio de emails
- ✅ `itextpdf 5.5.13.3` - Geração de PDF

### **Novos Arquivos:**
- ✅ `EmailService.java` - Serviço de email
- ✅ `CertificateService.java` - Geração de PDF
- ✅ `ParticipantService.java` (atualizado) - Check-in + envio

### **Novos Endpoints:**
```
PATCH /api/participants/{id}/checkin        - Check-in + envio automático
POST  /api/participants/{id}/send-certificate - Reenviar certificado
```

---

## 🎯 FLUXO COMPLETO

```
1. Participante se inscreve em evento
   ↓
2. No dia do evento, faz check-in (desktop/web)
   ↓
3. Sistema atualiza status para "checked in"
   ↓
4. Sistema gera certificado PDF (assíncrono)
   ↓
5. Sistema envia email com PDF anexado
   ↓
6. Participante recebe certificado na caixa de entrada
   ↓
7. Participante pode baixar, imprimir ou compartilhar
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [ ] Criar senha de app no Gmail
- [ ] Configurar `application.properties` ou `.env`
- [ ] Adicionar dependências no `pom.xml`
- [ ] Rebuild do projeto (`mvn clean install`)
- [ ] Testar envio com participante real
- [ ] Verificar recebimento do email
- [ ] Abrir e validar certificado PDF
- [ ] Configurar email de produção (AWS SES, SendGrid, etc)

---

## 🎉 PRONTO!

Seu sistema agora envia certificados automaticamente! 

**Para apresentação:**
1. Configure email real
2. Faça check-in de teste
3. Mostre email recebido
4. Abra e apresente o certificado PDF

**Qualquer dúvida, verifique os logs do backend!** 📝
