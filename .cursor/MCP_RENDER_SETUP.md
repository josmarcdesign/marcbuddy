# 🔧 Configuração dos MCP Servers

## Servidores Configurados

### 1. Supabase MCP
- **URL:** `https://mcp.supabase.com/mcp?project_ref=umydjofqoknbggwtwtqv`
- **Project Ref:** `umydjofqoknbggwtwtqv`

### 2. Stripe MCP
- **URL:** `https://mcp.stripe.com`

### 3. Render MCP
- **API Key:** `rnd_1bMxZgmLayMdEbE2BrAx5yYcNxGQ`
- **URL:** `https://mcp.render.com/mcp`

## Configuração Completa

O arquivo `%USERPROFILE%\.cursor\mcp.json` contém:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=umydjofqoknbggwtwtqv"
    },
    "stripe": {
      "url": "https://mcp.stripe.com"
    },
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer rnd_1bMxZgmLayMdEbE2BrAx5yYcNxGQ"
      }
    }
  }
}
```

### Localização do Arquivo de Configuração

O arquivo de configuração do MCP no Cursor geralmente fica em:

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## Como Verificar se Está Funcionando

Após adicionar a configuração:
1. Reinicie o Cursor
2. O MCP do Render deve aparecer na lista de servidores MCP disponíveis
3. Você poderá usar comandos do Render através do MCP

## Recursos Disponíveis

Com o MCP do Render configurado, você poderá:
- Gerenciar serviços do Render
- Deploy de aplicações
- Visualizar logs
- Gerenciar variáveis de ambiente
- E muito mais!

---

**Última atualização:** Dezembro 2024
