# Assets - MarcBuddy Platform

Esta pasta contém todos os assets estáticos da plataforma MarcBuddy.

## Estrutura

```
assets/
├── images/          # Imagens gerais (fotos, ilustrações, etc.)
├── icons/           # Ícones SVG e PNG
├── logos/           # Logos e variações da marca
└── fonts/           # Fontes customizadas (se necessário)
```

## Uso

### Importando Imagens

```jsx
import logo from '../assets/logos/marcbuddy-logo.svg';
import heroImage from '../assets/images/hero-image.jpg';
import icon from '../assets/icons/check-icon.svg';
```

### Em Componentes React

```jsx
<img src={logo} alt="MarcBuddy Logo" />
```

### Em CSS/Tailwind

```css
background-image: url('../assets/images/background.jpg');
```

## Convenções

- **Nomes de arquivos**: Use kebab-case (ex: `hero-image.jpg`, `check-icon.svg`)
- **Formato de imagens**: 
  - PNG para imagens com transparência
  - JPG para fotos
  - SVG para ícones e logos
  - WebP quando possível (melhor compressão)
- **Tamanhos**: Otimize imagens antes de adicionar (use ferramentas como TinyPNG, ImageOptim)
- **Organização**: Mantenha arquivos relacionados agrupados em subpastas quando necessário

## Assets Importantes

### Logos
- Logo principal da marca
- Variações (horizontal, vertical, ícone)
- Versões para dark/light mode

### Ícones
- Ícones de funcionalidades
- Ícones sociais
- Ícones de status

### Imagens
- Imagens do hero
- Screenshots de features
- Ilustrações
- Placeholders

