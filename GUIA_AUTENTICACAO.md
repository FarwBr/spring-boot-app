# Guia de Autenticação - Sistema de Eventos

## 🔐 Sistema Implementado

O sistema agora possui autenticação JWT com dois tipos de usuários:
- **ADMIN**: Pode criar eventos, gerenciar participantes, acessar todas funcionalidades
- **CLIENT**: Pode fazer reservas em eventos e cancelar suas próprias reservas

## 📝 Endpoints de Autenticação

### Registro de Novo Usuário
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "(51) 99999-9999",
  "company": "Empresa XYZ",
  "role": "CLIENT"  // ou "ADMIN" (opcional, default é CLIENT)
}
```

**Resposta de Sucesso:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CLIENT"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CLIENT"
}
```

## 🔑 Como Usar o Token

Após login/registro, use o token em todas as requisições protegidas:

```
GET /api/events
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## 👨‍💼 Usuário Admin Padrão

Para criar um usuário admin inicial, execute no banco de dados:

```sql
INSERT INTO users (name, email, password, role, phone, company, created_at)
VALUES ('Administrator', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', '', '', NOW());
```

**Credenciais:**
- Email: `admin@example.com`
- Senha: `admin123`

## 🛡️ Permissões

### Endpoints Públicos (sem autenticação)
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/events/active` - Ver eventos ativos
- `GET /api/certificates/validate/{code}` - Validar certificado

### Endpoints Apenas ADMIN
- `POST /api/events` - Criar evento
- `PUT /api/events/{id}` - Editar evento
- `DELETE /api/events/{id}` - Deletar evento
- `DELETE /api/participants/{id}` - Remover participante
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/{id}` - Editar usuário
- `DELETE /api/users/{id}` - Deletar usuário

### Endpoints Autenticados (ADMIN ou CLIENT)
- `GET /api/events` - Listar todos eventos
- `GET /api/events/{id}` - Ver detalhes do evento
- `POST /api/participants` - Inscrever-se em evento
- `GET /api/participants/event/{eventId}` - Ver participantes
- `POST /api/participants/{id}/checkin` - Fazer check-in
- Todos os outros endpoints requerem autenticação

## 🔄 Fluxo de Uso

### Para Clientes:
1. Registrar conta (POST /api/auth/register)
2. Fazer login (POST /api/auth/login)
3. Ver eventos disponíveis (GET /api/events/active)
4. Inscrever-se em evento (POST /api/participants)
5. Fazer check-in no dia do evento

### Para Admins:
1. Login com credenciais admin
2. Criar eventos (POST /api/events)
3. Gerenciar participantes
4. Finalizar eventos e gerar certificados
5. Gerenciar usuários do sistema

## 🧪 Testar no Postman

1. **Fazer Login/Registro:**
   - Enviar POST para `/api/auth/login` ou `/api/auth/register`
   - Copiar o `token` da resposta

2. **Usar Token:**
   - Na aba "Authorization" do Postman
   - Selecionar tipo "Bearer Token"
   - Colar o token copiado

3. **Fazer Requisições:**
   - Agora pode acessar endpoints protegidos

## ⏰ Expiração do Token

- Tokens expiram em **24 horas**
- Após expiração, fazer login novamente
- Token pode ser atualizado mudando `app.jwt.expiration` no `application.properties`

## 🔧 Configuração

No `application.properties`:

```properties
# JWT Configuration
app.jwt.secret=mySecretKeyForJWTTokenGenerationThatIsLongEnoughForHS512Algorithm
app.jwt.expiration=86400000  # 24 hours in milliseconds
```

Para produção, **SEMPRE** mudar o `app.jwt.secret` para uma chave forte e única!

## 🚀 Próximos Passos

Agora que a autenticação está implementada, os próximos passos são:
1. Criar frontend de login/registro
2. Armazenar token no localStorage
3. Adicionar interceptor no axios para enviar token automaticamente
4. Implementar geração automática de certificados
5. Implementar validação de certificados
