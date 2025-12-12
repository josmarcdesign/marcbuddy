# 🔐 Configurar Credenciais Git para Push

## ⚠️ Problema

O Git está tentando usar credenciais de outro usuário (`jmsah19`) ao invés de `josmarcdesign`.

## ✅ Solução: Usar Personal Access Token

### 1. Criar Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note**: `MarcBuddy Push Token`
   - **Expiration**: Escolha uma data (ou "No expiration")
   - **Scopes**: Marque `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"**
5. **Copie o token** (você só verá uma vez!)

### 2. Configurar Git para Usar o Token

**Opção A: Usar token na URL do remote (Recomendado)**

```bash
# Remover remote atual
git remote remove origin

# Adicionar remote com token
git remote add origin https://SEU_TOKEN@github.com/josmarcdesign/marcbuddy.git

# Fazer push
git push -u origin main
```

**Opção B: Usar Git Credential Manager (Windows)**

```bash
# Configurar credenciais
git config --global credential.helper wincred

# Fazer push (vai pedir usuário e senha)
# Usuário: josmarcdesign
# Senha: SEU_TOKEN (não sua senha do GitHub!)
git push -u origin main
```

**Opção C: Usar SSH (Alternativa)**

```bash
# Gerar chave SSH (se ainda não tiver)
ssh-keygen -t ed25519 -C "josmarcdesign@gmail.com"

# Adicionar chave ao GitHub
# Copie o conteúdo de ~/.ssh/id_ed25519.pub
# Adicione em: https://github.com/settings/keys

# Mudar remote para SSH
git remote set-url origin git@github.com:josmarcdesign/marcbuddy.git

# Fazer push
git push -u origin main
```

### 3. Verificar Configuração

```bash
# Ver remote configurado
git remote -v

# Ver usuário Git configurado
git config user.name
git config user.email
```

---

## 🚀 Após Configurar

Execute novamente:

```bash
git push -u origin main
```

---

## 📝 Nota

O commit já foi feito localmente com sucesso:
- ✅ 360 arquivos commitados
- ✅ Branch `main` criada
- ⚠️ Falta apenas fazer o push

---

**Última atualização:** Dezembro 2024
