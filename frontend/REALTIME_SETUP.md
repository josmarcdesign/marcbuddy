# Configuração do Realtime do Supabase

## ✅ O que foi configurado

1. **Backend (Migração V15):**
   - Realtime habilitado em todas as tabelas `mclients_*`
   - Políticas RLS criadas para permitir Realtime
   - Tabelas adicionadas à publicação `supabase_realtime`

2. **Frontend:**
   - Cliente Supabase configurado (`src/utils/supabaseClient.js`)
   - Hook `useRealtime` criado (`src/hooks/useRealtime.js`)
   - Componente `RealtimeConsole` criado (`src/components/RealtimeConsole.jsx`)

## 📦 Instalação

O pacote `@supabase/supabase-js` já foi instalado.

## 🚀 Como usar

### Opção 1: Usar o componente RealtimeConsole

```jsx
import RealtimeConsole from '../components/RealtimeConsole';
import { useState } from 'react';

function MyComponent() {
  const [showConsole, setShowConsole] = useState(false);
  const userId = 1; // ID do usuário logado

  return (
    <>
      <button onClick={() => setShowConsole(!showConsole)}>
        Abrir Console Realtime
      </button>
      
      {showConsole && (
        <RealtimeConsole
          tableName="mclients_clients"
          userId={userId}
          onClose={() => setShowConsole(false)}
        />
      )}
    </>
  );
}
```

### Opção 2: Usar o hook useRealtime diretamente

```jsx
import { useRealtime } from '../hooks/useRealtime';

function MyComponent() {
  const userId = 1;
  const { data, loading, error, events } = useRealtime(
    'mclients_clients',
    `user_id=eq.${userId}`
  );

  return (
    <div>
      <h2>Clientes (Tempo Real)</h2>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <ul>
        {data.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
      
      <div>
        <h3>Eventos Recentes ({events.length})</h3>
        {events.map((event, i) => (
          <div key={i}>
            {event.type} - {event.timestamp}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Opção 3: Adicionar ao MClients.jsx

No arquivo `MClients.jsx`, você pode adicionar um botão para abrir o console:

```jsx
import { useState } from 'react';
import RealtimeConsole from '../RealtimeConsole';

// Dentro do componente MClients:
const [showRealtimeConsole, setShowRealtimeConsole] = useState(false);

// No JSX, adicione um botão:
<button onClick={() => setShowRealtimeConsole(true)}>
  📡 Console Realtime
</button>

// E o componente:
{showRealtimeConsole && (
  <RealtimeConsole
    tableName="mclients_clients"
    userId={user?.id}
    onClose={() => setShowRealtimeConsole(false)}
  />
)}
```

## 📋 Tabelas disponíveis para Realtime

- `mclients_clients`
- `mclients_follow_through_models`
- `mclients_follow_throughs`
- `mclients_demands`
- `mclients_payments`
- `mclients_documents`
- `mclients_services`
- `mclients_tasks`
- `mclients_pending_approvals`
- `mclients_time_entries`
- `mclients_activities`
- `mclients_briefing_submissions`

## 🔧 Variáveis de Ambiente

Adicione ao `.env` do frontend (opcional, já tem valores padrão):

```env
VITE_SUPABASE_URL=https://umydjofqoknbggwtwtqv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Funcionalidades

- **Monitoramento em tempo real**: Veja mudanças nas tabelas instantaneamente
- **Eventos**: INSERT, UPDATE, DELETE são capturados automaticamente
- **Filtros**: Filtre por `user_id` ou outros campos
- **Console visual**: Interface bonita para ver os eventos
- **Auto-scroll**: Rola automaticamente para novos eventos

## ⚠️ Notas Importantes

1. O Realtime funciona apenas para usuários autenticados (com JWT válido)
2. As políticas RLS garantem que usuários só vejam seus próprios dados
3. O console mostra apenas eventos do usuário logado
4. Para ver eventos de outros usuários, você precisa ser admin ou usar service_role

