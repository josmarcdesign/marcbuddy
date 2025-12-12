# Componentes de Animação

Esta pasta contém componentes de animação reutilizáveis que podem ser usados em qualquer parte da aplicação para criar efeitos visuais consistentes e customizáveis.

## Componentes Disponíveis

### `LiquidBubbles`

Cria um efeito de bolhas de líquido coloridas se movendo e colidindo suavemente.

#### Props

- `colors` (Array, opcional): Array de objetos com `color` (classe CSS) e `position` (objeto com top/bottom/left/right em %)
  - Padrão: 3 bolhas com cores verde e azul em posições pré-definidas
- `sizes` (Array, opcional): Tamanhos das bolhas em múltiplos de 4px (ex: [32, 40, 36])
  - Padrão: [32, 40, 36]
- `durations` (Array, opcional): Durações de animação em segundos
  - Padrão: ['8s', '10s', '12s']
- `blur` (String, opcional): Intensidade do blur (classes Tailwind)
  - Padrão: 'blur-3xl'
- `className` (String, opcional): Classes CSS adicionais
- `showOverlay` (Boolean, opcional): Mostra overlay glassmorphism
  - Padrão: true
- `overlayGradient` (String, opcional): Classes do gradiente do overlay
  - Padrão: 'from-white/5 via-transparent to-transparent'

#### Exemplo de Uso

```jsx
import { LiquidBubbles } from './components/animations';

// Uso básico
<LiquidBubbles />

// Customizado
<LiquidBubbles
  colors={[
    { color: 'bg-blue-500/20', position: { top: '20%', left: '30%' } },
    { color: 'bg-purple-500/15', position: { top: '60%', right: '20%' } },
    { color: 'bg-pink-500/25', position: { bottom: '30%', left: '60%' } }
  ]}
  sizes={[40, 48, 36]}
  durations={['6s', '8s', '10s']}
  blur="blur-2xl"
  showOverlay={true}
/>
```

---

### `BorderGlow`

Cria um efeito de luz que percorre continuamente a borda de um elemento.

#### Props

- `color` (String, opcional): Cor da luz em formato rgba ou hex
  - Padrão: 'rgba(135, 197, 8, 0.9)' (verde)
- `duration` (String, opcional): Duração da animação
  - Padrão: '3s'
- `maskColor` (String, opcional): Cor da máscara interna (deve combinar com o fundo do elemento)
  - Padrão: '#011526' (azul marinho)
- `borderWidth` (Number, opcional): Largura da borda em pixels
  - Padrão: 3
- `className` (String, opcional): Classes CSS adicionais
- `rounded` (String, opcional): Classes de arredondamento
  - Padrão: 'rounded-lg'

#### Exemplo de Uso

```jsx
import { BorderGlow } from './components/animations';

// Uso básico
<BorderGlow />

// Customizado
<BorderGlow
  color="rgba(59, 130, 246, 0.9)"
  duration="4s"
  maskColor="#ffffff"
  borderWidth={4}
  rounded="rounded-xl"
/>
```

---

## Animações CSS Necessárias

Estes componentes dependem de animações CSS definidas em:

- `frontend/src/index.css` - Keyframes `borderGlow`
- `frontend/tailwind.config.js` - Keyframes `bubble1`, `bubble2`, `bubble3`

Certifique-se de que essas animações estão configuradas antes de usar os componentes.

---

## Exemplo Completo

```jsx
import { LiquidBubbles, BorderGlow } from './components/animations';

function FeaturedCard() {
  return (
    <div className="relative">
      {/* Luz na borda */}
      <BorderGlow
        color="rgba(135, 197, 8, 0.9)"
        duration="3s"
        maskColor="#011526"
        borderWidth={3}
      />
      
      {/* Card */}
      <div className="bg-brand-blue-900 rounded-lg p-6 relative" style={{ zIndex: 2 }}>
        {/* Bolhas de líquido */}
        <LiquidBubbles
          colors={[
            { color: 'bg-brand-green/20', position: { top: '25%', left: '25%' } },
            { color: 'bg-blue-400/15', position: { top: '50%', right: '25%' } },
            { color: 'bg-brand-green/25', position: { bottom: '25%', left: '50%' } }
          ]}
        />
        
        {/* Conteúdo do card */}
        <div className="relative z-20">
          <h2>Conteúdo do Card</h2>
        </div>
      </div>
    </div>
  );
}
```

---

## Notas Importantes

1. **Z-Index**: Os componentes de animação usam z-index baixos (0-1). Certifique-se de que o conteúdo principal tenha z-index maior (ex: 20).

2. **Performance**: As animações usam `transform` e `opacity` para melhor performance. Evite usar muitas instâncias simultâneas.

3. **Customização**: Todos os componentes são totalmente customizáveis através de props, permitindo criar variações únicas para diferentes contextos.

4. **Responsividade**: Os componentes são responsivos por padrão, mas você pode ajustar tamanhos e posições através das props.

