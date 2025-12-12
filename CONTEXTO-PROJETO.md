# Contexto do Projeto MarcBuddy - Log de Desenvolvimento

**Data da última atualização:** 2025-01-XX  
**Status:** Em desenvolvimento - Fase 3 (Web Tools)

---

## 📋 Estado Atual do Projeto

### ✅ Implementações Recentes

#### Hero Illustration com Olhos Interativos
- **Arquivo:** `frontend/src/components/HeroIllustration.jsx`
- **Funcionalidade:** Ilustração SVG do hero com olhos que seguem o movimento do mouse
- **Características:**
  - Usa o SVG original de `frontend/src/assets/ilustrations/hero-ilustration.svg`
  - Olhos (grupo "Eyes") seguem o mouse dentro dos limites do grupo "EyesFrame" (formas ovais)
  - Olho esquerdo não pode passar da posição original à esquerda (personagem olhando para esquerda)
  - Transições suaves com `transition: transform 0.15s ease-out`
  - Cálculo preciso das coordenadas do mouse em relação ao viewBox do SVG

#### Páginas e Componentes Principais
- **Home:** `frontend/src/pages/Home.jsx` - Página inicial com Hero, Features, Plans, How It Works, CTA
- **Login/Register:** Layout de duas colunas sem Navbar/Footer
- **Navbar:** `frontend/src/components/Navbar.jsx` - Menu responsivo com dropdown "Recursos"
- **Footer:** `frontend/src/components/Footer.jsx` - Rodapé fixo
- **PlanCard:** `frontend/src/components/PlanCard.jsx` - Cards de planos reutilizáveis
- **BillingToggle:** `frontend/src/components/BillingToggle.jsx` - Toggle mensal/anual

---

## 🗂️ Estrutura de Arquivos Importantes

### Frontend
```
frontend/
├── src/
│   ├── assets/
│   │   ├── ilustrations/
│   │   │   └── hero-ilustration.svg (SVG com grupos Eyes e EyesFrame)
│   │   ├── logos/
│   │   │   ├── mbuddy-horizontal-logo+suite-badge.svg
│   │   │   ├── Isotipo+tipografia.svg (azul)
│   │   │   └── Isotipo+tipografia-white.svg (branco)
│   │   └── fonts/
│   │       ├── Nunito/static/ (fontes locais)
│   │       └── Poppins/
│   ├── components/
│   │   ├── HeroIllustration.jsx ⭐ (NOVO - olhos interativos)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PlanCard.jsx
│   │   ├── BillingToggle.jsx
│   │   └── animations/ (LiquidBubbles, BorderGlow, RainbowGradient, GlassReflection)
│   ├── pages/
│   │   ├── Home.jsx (usa HeroIllustration)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Plans.jsx
│   │   └── Dashboard.jsx
│   ├── config/
│   │   ├── plans.js (planos: MBuddy Classic, MBuddy Pro, MBuddy Team)
│   │   └── brand.js (cores e tipografia da marca)
│   └── index.css (fontes locais com @font-face)
```

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── subscription.controller.js
│   │   └── payment.controller.js
│   ├── routes/
│   │   ├── subscription.routes.js
│   │   └── payment.routes.js
│   └── utils/
│       ├── plans.js
│       └── licenseKey.js
```

---

## 🎨 Identidade Visual

### Cores da Marca
- **Action Green:** `#87c508`
- **Trust Blue:** `#011526`
- **Clean White:** `#F5F5F5`

### Tipografia
- **Nunito:** Títulos (Black para hero title)
- **Poppins:** Corpo de texto (Medium para descrições)

### Fontes Locais
- Fontes carregadas localmente de `assets/fonts/`
- `font-display: block` para evitar FOUT
- Preload configurado no `index.css`

---

## 🔧 Tecnologias Utilizadas

### Frontend
- React 18
- React Router DOM v6
- Tailwind CSS
- Vite
- Axios
- React Query

### Backend
- Node.js + Express
- PostgreSQL
- JWT para autenticação
- bcryptjs para senhas
- qrcode para QR Codes Pix

---

## 📝 Planos de Assinatura

### Planos Atuais
1. **MBuddy Classic** (antigo Basic)
   - 7 dias grátis
   - R$ 29,90/mês
   - Botão verde direciona para checkout

2. **MBuddy Pro** (antigo Premium)
   - R$ 59,90/mês
   - Plano destacado (featured)
   - Botão direciona para `/plans` (não checkout direto)

3. **MBuddy Team** (antigo Enterprise)
   - R$ 149,90/mês
   - Botão direciona para `/plans` (não checkout direto)

### Toggle de Cobrança
- Mensal/Anual disponível
- Mostra valor mensal quando anual está selecionado
- Tag "Economize 2 meses" no toggle anual

---

## 🐛 Problemas Conhecidos / Ajustes Necessários

### Hero Illustration
- ✅ Implementado: Olhos seguem mouse
- ✅ Implementado: Limites baseados em EyesFrame
- ✅ Implementado: Olho esquerdo não passa da posição original à esquerda
- ⚠️ Pode precisar ajuste: Valores de limite (leftEyeMaxXRight, leftEyeMaxY, etc.) podem precisar calibração visual

---

## 🚀 Próximos Passos Sugeridos

### Fase 3 - Web Tools (Em andamento)
1. **Extrator de Cores**
   - Upload de imagem
   - Extração de paleta
   - Exportação de códigos HEX, RGB, HSL

2. **Compressor de Imagens**
   - Upload e compressão
   - Preview antes/depois
   - Download otimizado

3. **Renomeador em Lote**
   - Upload múltiplos arquivos
   - Padrões customizáveis
   - Preview e download

### Melhorias Futuras
- [ ] Otimização de performance das animações
- [ ] Testes de acessibilidade (WCAG)
- [ ] Internacionalização (i18n)
- [ ] PWA (Progressive Web App)

---

## 📌 Comandos Úteis

### Desenvolvimento
```bash
# Frontend
cd frontend
npm run dev  # Inicia em http://localhost:3000

# Backend
cd backend
npm run dev  # Inicia em http://localhost:3001
```

### Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

---

## 🔗 Rotas Principais

- `/` - Home (com HeroIllustration)
- `/login` - Login (layout 2 colunas)
- `/register` - Registro (layout 2 colunas)
- `/plans` - Página de planos
- `/plans/:planId/checkout` - Checkout (apenas MBuddy Classic vai direto)
- `/dashboard` - Dashboard do usuário
- `/tools` - Página de ferramentas
- `/benefits` - Página de benefícios

---

## 💡 Notas Importantes

1. **Hero Illustration:** O SVG original está em `assets/ilustrations/hero-ilustration.svg` e contém os grupos `Eyes` e `EyesFrame` que são usados para controlar o movimento dos olhos.

2. **Limites dos Olhos:** Os limites são calculados manualmente baseados nas coordenadas do viewBox. Se precisar ajustar, modifique os valores `leftEyeMaxXRight`, `leftEyeMaxY`, `rightEyeMaxX`, `rightEyeMaxY` no componente `HeroIllustration.jsx`.

3. **Personagem olhando para esquerda:** O olho esquerdo tem limite mínimo de 0 (não pode ir para esquerda), enquanto o direito pode ir para ambos os lados.

4. **Fontes:** As fontes Nunito e Poppins são carregadas localmente. Certifique-se de que os arquivos estão em `assets/fonts/`.

5. **Cores da marca:** Todas as cores estão centralizadas em `config/brand.js` e configuradas no `tailwind.config.js`.

---

## 📞 Informações de Contato / Suporte

Para continuar o desenvolvimento:
- Verificar `verificar.md` para visão geral completa
- Consultar `docs/processo-concluido/` para fases concluídas
- Consultar `docs/proximos-passos/` para próximas implementações

---

**Última atualização:** Implementação do HeroIllustration com olhos interativos seguindo o mouse.

