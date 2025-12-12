# 🎨 Guia de Uso das Cores da Marca

Este guia explica como usar as cores da marca MarcBuddy nos componentes.

## 📋 Regra Principal

**SEMPRE use nomes de cores da marca ao invés de códigos hex quando se referir às cores primárias:**
- ✅ `'blue'` → `#011526` (Azul Marinho)
- ✅ `'green'` → `#87c508` (Verde Vibrante)
- ✅ `'white'` → `#F5F5F5` (Off-White)
- ❌ ~~`'#011526'`~~ (use apenas para cores que não são da marca)

## 🚀 Formas de Usar

### 1. Usando `brandStyle()` (Recomendado)

```jsx
import { brandStyle } from '../config/brand';

// Fundo verde, texto azul
<div style={brandStyle({ bg: 'green', color: 'blue' })}>
  Botão
</div>

// Fundo azul, texto branco
<div style={brandStyle({ bg: 'blue', color: '#ffffff' })}>
  Card
</div>

// Com outros estilos
<div style={brandStyle({ bg: 'white', color: 'blue', padding: '16px' })}>
  Dropdown
</div>
```

### 2. Usando `brandColors` diretamente

```jsx
import { brandColors } from '../config/brand';

// Acessar cores diretamente
<div style={{ backgroundColor: brandColors.green }}>
  Verde
</div>

<div style={{ color: brandColors.blue }}>
  Texto Azul
</div>
```

### 3. Usando `brandColor()` (função)

```jsx
import { brandColor } from '../config/brand';

// Retorna o hex da cor
const blueColor = brandColor('blue'); // '#011526'
const greenColor = brandColor('green'); // '#87c508'
const whiteColor = brandColor('white'); // '#F5F5F5'

// Se passar um código hex que não é da marca, retorna o próprio valor
const customColor = brandColor('#FF0000'); // '#FF0000'
```

## 📝 Exemplos Práticos

### Botão Primário (Verde)
```jsx
<button style={brandStyle({ bg: 'green', color: 'blue' })}>
  Clique Aqui
</button>
```

### Botão Secundário (Azul)
```jsx
<button style={brandStyle({ bg: 'blue', color: '#ffffff' })}>
  Entrar
</button>
```

### Card com Fundo Off-White
```jsx
<div style={brandStyle({ bg: 'white', color: 'blue' })}>
  Conteúdo do Card
</div>
```

### Dropdown
```jsx
<div style={brandStyle({ bg: 'white' })}>
  <a style={brandStyle({ color: 'blue' })}>Link</a>
</div>
```

## 🎯 Cores Disponíveis

### Cores Primárias da Marca
- `'green'` → `#87c508` (Verde Vibrante - Action Green)
- `'blue'` → `#011526` (Azul Marinho - Trust Blue)
- `'white'` → `#F5F5F5` (Off-White - Clean White)

### Cores de Status
- `'success'` → `#10B981`
- `'warning'` → `#F59E0B`
- `'error'` → `#EF4444`
- `'info'` → `#3B82F6`

## ⚠️ Importante

1. **Cores da marca**: Use sempre nomes (`'blue'`, `'green'`, `'white'`)
2. **Cores customizadas**: Use códigos hex diretamente (`'#FF0000'`, `'#ffffff'`)
3. **Consistência**: Todas as cores da marca estão centralizadas em `brand.js`
4. **Manutenção**: Se precisar mudar uma cor da marca, altere apenas em `brand.js`

## 🔄 Migração

Para migrar código antigo:

**Antes:**
```jsx
style={{ backgroundColor: '#87c508', color: '#011526' }}
```

**Depois:**
```jsx
style={brandStyle({ bg: 'green', color: 'blue' })}
```

## 📚 Referência Completa

Veja `brand.js` para todas as cores, tipografia, espaçamentos e outros elementos da identidade visual.

