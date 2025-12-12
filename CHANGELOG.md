# Plataforma MarcBuddy — Resumo técnico

## Backend
- Servidor Node/Express em `backend/src/server.js`, porta 3001, suporta HTTPS se encontrar certs em `backend/certs` (`localhost+auto.pem` e `localhost+auto-key.pem` gerados pelo `setup-https.ps1`).
- CORS liberado para localhost e IPs locais (10.x, 192.168.x, 172.16-31.x); rotas protegidas exigem JWT em Authorization Bearer.
- Rotas principais:
  - `/api/auth`, `/api/users`, `/api/subscriptions`, `/api/payments`, `/api/admin`, `/api/coupons`, `/api/plans`.
  - `/api/mclients` (MClients): `GET /data` e `POST /data` (proteção JWT); públicos: `GET /briefing/:username/:token`, `POST /briefing/submit`.
- Persistência do MClients: arquivos JSON por usuário em `backend/data/mclients/<username>/data.json`; criação de pasta segura por username/email (sanitize).
- `setup-https.ps1` (na pasta backend) gera certificados com mkcert para localhost + IPs privados.

## Frontend
- Vite/React em `frontend`.
- API base configurada em `frontend/src/services/mclientsApi.js`: detecta protocolo/host; se em IP privado com HTTPS, força `https://<host>:3001`; pode usar `VITE_API_URL` para sobrescrever.
- Autenticação via contexto `AuthContext`; token salvo em localStorage e enviado em headers.
- MClients tool (`frontend/src/components/tools/mclients/MClients.jsx` + subcomponentes): dados agora via hook `useMClientsData` (cache local + sync backend). `localStorage` direto removido para followThrough/models/clients.
- Briefing público em `frontend/src/pages/Briefing.jsx`, busca followThrough por username/token via API e envia submissão via `submitBriefing`.

## Certificados / HTTPS
- Certs esperados em `backend/certs`: `localhost+auto.pem` e `localhost+auto-key.pem`.
- Gerar com: `cd backend; powershell -ExecutionPolicy Bypass -File .\setup-https.ps1`.
- Subir backend: `npm run dev` (em backend). Com certs, sobe HTTPS na 3001.
- Frontend deve apontar para o backend HTTPS (`VITE_API_URL=https://10.0.0.107:3001` ou host equivalente) e reiniciar o Vite.

## Persistência MClients
- Estrutura salva em cada `data.json`: `clients`, `demands`, `payments`, `documents`, `services`, `tasks`, `followThroughs`, `followThroughModels`, `pendingApprovals`, `timeEntries`, `activities`, `lastUpdated`.
- FollowThroughs: URLs geradas incluem `@username` e token; expiração/renovação implementadas; aprovação cria cliente/demanda.

## Problemas conhecidos recentes
- Salvamento falhou quando frontend rodava em HTTPS e backend apenas em HTTP (mixed content / ERR_EMPTY_RESPONSE). Solução: usar backend em HTTPS e apontar `VITE_API_URL` para `https://<host>:3001`.
- Antigo código de `localStorage` causava `JSON.parse("undefined")`; já removido em MClients.jsx, usar apenas `useMClientsData`.

