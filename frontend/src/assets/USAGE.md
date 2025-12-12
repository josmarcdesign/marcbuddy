# Como Usar os Assets

## Importação com Aliases

O Vite está configurado com aliases para facilitar a importação de assets:

### Usando o alias `@assets`

```jsx
// ✅ Recomendado
import logo from '@assets/logos/marcbuddy-logo.svg';
import heroImage from '@assets/images/hero-image.jpg';
import checkIcon from '@assets/icons/check-icon.svg';
```

### Usando o alias `@` (raiz do src)

```jsx
import logo from '@/assets/logos/marcbuddy-logo.svg';
import heroImage from '@/assets/images/hero-image.jpg';
```

### Importação relativa tradicional

```jsx
import logo from '../assets/logos/marcbuddy-logo.svg';
```

## Exemplos Práticos

### Em Componentes React

```jsx
import React from 'react';
import logo from '@assets/logos/marcbuddy-logo.svg';
import heroImage from '@assets/images/hero-image.jpg';

const MyComponent = () => {
  return (
    <div>
      <img src={logo} alt="MarcBuddy Logo" />
      <img src={heroImage} alt="Hero" />
    </div>
  );
};
```

### Em CSS/Tailwind

```css
/* No arquivo CSS */
.hero {
  background-image: url('@assets/images/hero-background.jpg');
}
```

### Com Vite e React

O Vite processa automaticamente:
- **SVG**: Importado como URL ou componente React
- **Imagens**: Otimizadas e com hash no build
- **Fontes**: Processadas automaticamente

## Tipos de Assets

### Imagens (images/)
- Fotos e ilustrações
- Screenshots
- Placeholders
- Formatos: JPG, PNG, WebP, SVG

### Ícones (icons/)
- Ícones SVG (recomendado)
- Ícones PNG quando necessário
- Ícones de funcionalidades
- Ícones sociais

### Logos (logos/)
- Logo principal
- Variações (horizontal, vertical)
- Versões para dark/light mode
- Formatos: SVG (preferencial), PNG

### Fontes (fonts/)
- Fontes customizadas (se necessário)
- Nota: Nunito e Poppins são carregadas via Google Fonts

## Otimização

O Vite otimiza automaticamente:
- **Imagens**: Hash no nome para cache
- **SVG**: Minificação
- **Build**: Assets organizados na pasta `assets/`

## Dicas

1. **Use SVG** para logos e ícones (escalável e leve)
2. **Otimize imagens** antes de adicionar (use TinyPNG, ImageOptim)
3. **Use WebP** quando possível (melhor compressão)
4. **Mantenha nomes descritivos** em kebab-case

