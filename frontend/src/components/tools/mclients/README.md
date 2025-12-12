# MClients - Estrutura de Arquivos

## Estrutura Atual

```
mclients/
├── MClients.jsx          # Componente principal (atualmente importa Project7)
├── components/          # Componentes de UI (a criar)
├── hooks/              # Hooks customizados
│   └── useOCR.js       # Hook para processamento OCR
├── utils/              # Funções utilitárias
│   ├── alertModal.js   # Sistema de modais de alerta/confirmação
│   └── mockData.js     # Dados mock iniciais
└── modals/             # Modais (a criar)
```

## Próximos Passos para Refatoração

### 1. Separar Componentes por Aba
Criar componentes individuais para cada seção:
- `components/Dashboard.jsx`
- `components/Clients.jsx`
- `components/Demands.jsx`
- `components/Payments.jsx`
- `components/Documents.jsx`
- `components/Services.jsx`
- `components/Calendar.jsx`
- `components/Tasks.jsx`
- `components/Pipeline.jsx`

### 2. Separar Modais
Criar modais individuais em `modals/`:
- `modals/ClientModal.jsx`
- `modals/DemandModal.jsx`
- `modals/PaymentModal.jsx`
- `modals/ServiceModal.jsx`
- `modals/DocumentModal.jsx`
- etc.

### 3. Criar Hooks Adicionais
- `hooks/useClients.js` - Gerenciar clientes
- `hooks/useDemands.js` - Gerenciar demandas
- `hooks/usePayments.js` - Gerenciar pagamentos

### 4. Separar Utils
- `utils/ocrExtraction.js` - Funções de extração de dados do OCR
- `utils/dateHelpers.js` - Funções de manipulação de datas
- `utils/validation.js` - Funções de validação

### 5. Criar Context (Opcional)
- `contexts/MClientsContext.jsx` - Context para compartilhar estados globais

## Como Refatorar

1. **Comece pelos componentes menores**: Modais e componentes de UI simples
2. **Extraia hooks**: Mova lógica de estado para hooks customizados
3. **Separe utils**: Mova funções puras para arquivos de utils
4. **Atualize imports**: Atualize o MClients.jsx para importar os novos componentes

## Nota

Atualmente, o `MClients.jsx` importa diretamente o `Project7` do painel admin para manter a funcionalidade enquanto a refatoração acontece gradualmente.

