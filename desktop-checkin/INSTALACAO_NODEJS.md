# 📥 INSTALAÇÃO DO NODE.JS - Necessário para a Aplicação Desktop

## ⚠️ Problema Atual
Você precisa instalar o **Node.js** para executar a aplicação desktop de check-in.

---

## 🚀 OPÇÃO 1: Instalar Node.js (Recomendado)

### Passo 1: Download
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Escolha: **Windows Installer (.msi) - 64-bit**

### Passo 2: Instalação
1. Execute o arquivo baixado (ex: `node-v20.10.0-x64.msi`)
2. Clique em **Next** em todas as telas
3. Aceite os termos
4. **IMPORTANTE**: Marque a opção "Automatically install necessary tools"
5. Clique em **Install**
6. Aguarde a instalação (pode levar 5-10 minutos)

### Passo 3: Verificar Instalação
Abra um **NOVO** PowerShell e execute:
```powershell
node --version
npm --version
```

Deve aparecer algo como:
```
v20.10.0
10.2.3
```

### Passo 4: Executar Aplicação
```powershell
cd C:\Users\ghorst\Documents\Projet\spring-boot-app\desktop-checkin
npm install
npm start
```

---

## 🎯 OPÇÃO 2: Versão Web Simples (SEM Node.js)

Se não quiser instalar Node.js, posso criar uma **versão web simples** que:
- ✅ Funciona no navegador
- ✅ Usa localStorage (offline)
- ✅ Sincroniza com backend
- ❌ Não é executável desktop

Para criar a versão web, me diga: **"Crie a versão web"**

---

## 🎯 OPÇÃO 3: Aplicação Java Desktop (SEM Node.js)

Posso criar uma aplicação desktop em **Java Swing/JavaFX** que:
- ✅ Usa Java que você já tem instalado (Maven)
- ✅ Funciona 100% offline com H2/SQLite
- ✅ Sincroniza com backend
- ✅ Gera .exe com launch4j

Para criar a versão Java, me diga: **"Crie em Java"**

---

## 📊 Comparação das Opções

| Característica | Electron (Node.js) | Web (Browser) | Java Desktop |
|----------------|-------------------|---------------|--------------|
| Instalação | Node.js | Nenhuma | Nenhuma (usa Java do Maven) |
| Offline | ✅ SQLite | ✅ localStorage | ✅ H2/SQLite |
| Executável | .exe | ❌ | .exe/.jar |
| Multi-plataforma | ✅ | ✅ | ✅ |
| Performance | Média | Alta | Alta |
| Tamanho | ~150MB | ~500KB | ~50MB |

---

## 💡 Recomendações

### Se você vai usar em MÚLTIPLAS máquinas:
→ **Opção 3** (Java Desktop) - não precisa instalar nada extra

### Se é só para VOCÊ:
→ **Opção 1** (Electron) - mais moderno e bonito

### Se quer testar RÁPIDO:
→ **Opção 2** (Web) - abre no navegador e pronto

---

## 🆘 Me diga qual opção prefere:

1. **"Instalar Node.js"** - Te ajudo com o processo
2. **"Crie a versão web"** - Crio versão HTML que abre no navegador
3. **"Crie em Java"** - Crio aplicação desktop em Java Swing

Ou se já instalou o Node.js:
4. **"Já instalei"** - Te ajudo a executar a aplicação Electron
