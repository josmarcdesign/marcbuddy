# Templates de Email MarcBuddy

Esta pasta contém os templates HTML para os emails enviados pela plataforma MarcBuddy.

## Estrutura

Cada template é um arquivo `.html` individual com o mesmo nome do tipo do email:

- `welcome.html` - Email de boas-vindas para novos usuários
- `confirmation.html` - Email de confirmação de conta
- `reset.html` - Email de redefinição de senha
- `newsletter.html` - Email de newsletter/marketing (futuro)
- `notification.html` - Email de notificações gerais (futuro)

## Como Funciona

1. **Metadados no Banco**: O banco de dados (`email_templates`) armazena apenas os metadados:
   - `name`: Nome do template
   - `type`: Tipo do email (corresponde ao nome do arquivo)
   - `subject`: Assunto do email
   - `variables`: Array de variáveis disponíveis

2. **Conteúdo HTML**: O conteúdo HTML vem dos arquivos nesta pasta

3. **Variáveis**: Use `{{nome_da_variavel}}` no HTML para substituir dinamicamente:
   - `{{user_name}}` - Nome do usuário
   - `{{confirmation_url}}` - Link de confirmação
   - `{{reset_url}}` - Link de reset de senha
   - `{{dashboard_url}}` - Link para dashboard
   - `{{support_url}}` - Link para suporte
   - `{{privacy_url}}` - Link para política de privacidade
   - `{{terms_url}}` - Link para termos de uso

## Criando Novos Templates

### 1. Criar Arquivo HTML
Crie um novo arquivo `novo_tipo.html` nesta pasta com o conteúdo HTML do email.

**Exemplo de estrutura básica:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título do Email</title>
  <style>
    /* Seus estilos CSS aqui */
    body { font-family: 'Nunito', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 MarcBuddy</h1>
    </div>
    <div class="content">
      <h2>Olá {{user_name}}!</h2>
      <p>Conteúdo do seu email personalizado aqui...</p>
      <p style="text-align: center;">
        <a href="{{action_url}}" class="button">Clique Aqui</a>
      </p>
    </div>
  </div>
</body>
</html>
```

### 2. Adicionar ao Banco de Dados
Use o painel admin para criar o template:
- **Nome**: Nome descritivo do template
- **Tipo**: Mesmo nome do arquivo (ex: `novo_tipo`)
- **Assunto**: Assunto do email
- **Variáveis**: Liste as variáveis usadas no HTML

### 3. Testar
Use o botão "Visualizar" no painel admin para testar o template.

## Vantagens

- ✅ **Edição fácil**: Modifique HTML diretamente nos arquivos
- ✅ **Controle de versão**: Templates versionados com Git
- ✅ **Separação clara**: Metadados vs conteúdo visual
- ✅ **Flexibilidade**: Fácil adicionar novos tipos de email
- ✅ **Performance**: Templates carregados do sistema de arquivos

## Dicas de Design

### Responsividade
- Use `max-width: 600px` para containers
- Teste em dispositivos móveis
- Use media queries quando necessário

### Compatibilidade
- Use CSS inline quando possível
- Evite propriedades CSS complexas
- Teste em diferentes clientes de email

### Variáveis
- Sempre use `{{nome_da_variavel}}` para substituição
- Documente todas as variáveis no README
- Mantenha consistência nos nomes

## Exemplo Completo

**Arquivo: `order_confirmation.html`**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; }
    .header { background: #10b981; color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Pedido Confirmado!</h1>
    </div>
    <div class="content">
      <p>Olá {{user_name}},</p>
      <p>Seu pedido #{{order_id}} foi confirmado com sucesso!</p>
      <p>Total: R$ {{order_total}}</p>
    </div>
  </div>
</body>
</html>
```

**Configuração no Admin:**
- Nome: Confirmação de Pedido
- Tipo: order_confirmation
- Assunto: Seu pedido foi confirmado!
- Variáveis: ["{{user_name}}", "{{order_id}}", "{{order_total}}"]