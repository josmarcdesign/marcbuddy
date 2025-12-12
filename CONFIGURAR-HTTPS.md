# 🔒 Configurar HTTPS no MarcBuddy

Este guia explica como configurar certificados SSL para usar HTTPS no ambiente de desenvolvimento local, eliminando o aviso de "não é seguro" no navegador.

---

## 📋 Pré-requisitos

### 1. Instalar mkcert

O `mkcert` é uma ferramenta que gera certificados SSL confiáveis localmente.

#### **Opção A: Usando Chocolatey (Recomendado no Windows)**

1. **Instalar Chocolatey** (se ainda não tiver):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Instalar mkcert**:
   ```powershell
   choco install mkcert
   ```

#### **Opção B: Download Manual**

1. Baixe o `mkcert` de: https://github.com/FiloSottile/mkcert/releases
2. Extraia o executável e adicione ao PATH do sistema

---

## 🚀 Configuração Automática

### Passo 1: Executar o Script

Execute o script PowerShell na raiz do projeto:

```powershell
.\setup-https.ps1
```

O script irá:
- ✅ Verificar se o mkcert está instalado
- ✅ Instalar o certificado root local
- ✅ Gerar certificados SSL para `localhost`
- ✅ Salvar os certificados na pasta `certs/`

### Passo 2: Reiniciar os Servidores

Após gerar os certificados, reinicie os servidores:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Passo 3: Acessar via HTTPS

- **Frontend:** `https://localhost:3000`
- **Backend:** `https://localhost:3001`

---

## 🔧 Configuração Manual

Se preferir configurar manualmente:

### 1. Instalar Certificado Root

```bash
mkcert -install
```

### 2. Gerar Certificados

Na raiz do projeto, crie a pasta `certs` e gere os certificados:

```bash
mkdir certs
cd certs
mkcert localhost 127.0.0.1 ::1
cd ..
```

Isso criará dois arquivos:
- `localhost+2.pem` (certificado)
- `localhost+2-key.pem` (chave privada)

### 3. Verificar Configuração

Os arquivos `vite.config.js` (frontend) e `server.js` (backend) já estão configurados para usar os certificados automaticamente se eles existirem na pasta `certs/`.

---

## ✅ Verificação

### Como Saber se Está Funcionando

1. **Frontend:** Acesse `https://localhost:3000`
   - Deve mostrar um cadeado 🔒 na barra de endereço
   - Não deve mostrar aviso de "não é seguro"

2. **Backend:** Acesse `https://localhost:3001/api/health`
   - Deve retornar JSON com status "ok"
   - Não deve mostrar aviso de certificado inválido

### Se Ainda Mostrar "Não Seguro"

1. **Certifique-se de que executou `mkcert -install`** (instala o certificado root)
2. **Limpe o cache do navegador**
3. **Reinicie o navegador completamente**
4. **Verifique se os certificados estão na pasta `certs/`**

---

## 🛠️ Troubleshooting

### Erro: "mkcert não encontrado"

**Solução:** Instale o mkcert seguindo as instruções na seção "Pré-requisitos".

### Erro: "Certificados não encontrados"

**Solução:** Execute o script `setup-https.ps1` novamente ou gere os certificados manualmente.

### Erro: "CORS Error" após configurar HTTPS

**Solução:** Os arquivos já estão configurados para aceitar HTTPS. Certifique-se de que:
- O frontend está acessando `https://localhost:3000`
- O backend está rodando em `https://localhost:3001`
- As variáveis de ambiente estão atualizadas (se necessário)

### Erro: "Porta já em uso"

**Solução:** 
1. Feche outros processos usando as portas 3000 e 3001
2. Ou altere as portas nos arquivos de configuração

---

## 📝 Notas Importantes

- ⚠️ **Os certificados gerados são apenas para desenvolvimento local**
- ⚠️ **NÃO use estes certificados em produção**
- ✅ **Para produção, use certificados válidos (Let's Encrypt, Cloudflare, etc.)**
- ✅ **Os certificados são confiáveis apenas no seu computador local**

---

## 🔄 Desabilitar HTTPS

Se quiser voltar a usar HTTP:

1. **Remova ou renomeie a pasta `certs/`**
2. **Reinicie os servidores**

Os servidores detectarão automaticamente a ausência dos certificados e usarão HTTP.

---

## 📚 Referências

- [mkcert GitHub](https://github.com/FiloSottile/mkcert)
- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Express HTTPS](https://expressjs.com/en/5x/api.html#app.listen)

