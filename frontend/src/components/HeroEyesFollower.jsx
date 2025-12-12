import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import heroIllustrationSvg from '../assets/ilustrations/hero-ilustration.svg';

function clampEllipse(x, y, cx, cy, rx, ry) {
  const dx = x - cx;
  const dy = y - cy;
  const value = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
  if (value <= 1) return { x, y };

  const angle = Math.atan2(dy, dx);
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

export function HeroEyesFollower({ inline = false, size = 500 }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    // Carregar o SVG completo
    fetch(heroIllustrationSvg)
      .then(res => res.text())
      .then(text => {
        setSvgContent(text);
      })
      .catch(err => console.error('Erro ao carregar SVG:', err));
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    // Inserir o SVG no container
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) return;

    // Limpar container e adicionar o SVG
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(svgElement);

    // Ajustar o SVG para se adaptar ao container quando inline
    if (inline) {
      svgElement.setAttribute('width', `${size}px`);
      svgElement.setAttribute('height', 'auto');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      // Garantir que o SVG use o tamanho especificado
      svgElement.style.width = `${size}px`;
      svgElement.style.height = 'auto';
      svgElement.style.maxWidth = `${size}px`;
      svgElement.style.maxHeight = `${size}px`;
    }

    // Agora buscar os elementos dos olhos
    const eyeL = svgElement.querySelector('#eye-left');
    const eyeR = svgElement.querySelector('#eye-right');
    const frameL = svgElement.querySelector('#eye-frame-left');
    const frameR = svgElement.querySelector('#eye-frame-right');

    if (!eyeL || !eyeR || !frameL || !frameR) return;

    // Criar grupos para os olhos com transform
    const eyeLGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    eyeLGroup.setAttribute('transform', 'translate(0, 0)');
    const eyeRGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    eyeRGroup.setAttribute('transform', 'translate(0, 0)');

    // Mover os olhos para dentro dos grupos
    const eyeLParent = eyeL.parentNode;
    eyeLParent.insertBefore(eyeLGroup, eyeL);
    eyeLGroup.appendChild(eyeL);

    const eyeRParent = eyeR.parentNode;
    eyeRParent.insertBefore(eyeRGroup, eyeR);
    eyeRGroup.appendChild(eyeR);

    const getEllipseFromFrame = (frame, shrink = 0.7) => {
      const box = frame.getBBox();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      const rx = (box.width / 2) * shrink;
      const ry = (box.height / 2) * shrink;
      return { cx, cy, rx, ry };
    };

    const leftCfg = getEllipseFromFrame(frameL, 0.4);
    const rightCfg = getEllipseFromFrame(frameR, 0.4);

    // Obter a posição inicial do centro de cada olho
    const eyeLBox = eyeL.getBBox();
    const eyeRBox = eyeR.getBBox();
    const eyeLCenterX = eyeLBox.x + eyeLBox.width / 2;
    const eyeLCenterY = eyeLBox.y + eyeLBox.height / 2;
    const eyeRCenterX = eyeRBox.x + eyeRBox.width / 2;
    const eyeRCenterY = eyeRBox.y + eyeRBox.height / 2;

    // Criar elipses visíveis para mostrar os limites de movimento (40% do tamanho original)
    const createLimitEllipse = (cfg, id) => {
      const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ellipse.setAttribute('id', id);
      ellipse.setAttribute('cx', cfg.cx);
      ellipse.setAttribute('cy', cfg.cy);
      ellipse.setAttribute('rx', cfg.rx);
      ellipse.setAttribute('ry', cfg.ry);
      ellipse.setAttribute('stroke', '#ff0000');
      ellipse.setAttribute('stroke-width', '0');
      ellipse.setAttribute('fill', 'none');
      ellipse.setAttribute('stroke-dasharray', '5,5');
      ellipse.setAttribute('opacity', '0.6');
      return ellipse;
    };

    const leftLimitEllipse = createLimitEllipse(leftCfg, 'eye-limit-left');
    const rightLimitEllipse = createLimitEllipse(rightCfg, 'eye-limit-right');

    // Adicionar as elipses ao SVG (após os frames)
    frameL.parentNode.insertBefore(leftLimitEllipse, frameL.nextSibling);
    frameR.parentNode.insertBefore(rightLimitEllipse, frameR.nextSibling);

    const handleMove = (e) => {
      // Converter coordenadas do mouse da janela para coordenadas do SVG
      const rect = svgElement.getBoundingClientRect();
      const vb = svgElement.viewBox.baseVal;
      const mouseX = ((e.clientX - rect.left) / rect.width) * vb.width;
      const mouseY = ((e.clientY - rect.top) / rect.height) * vb.height;

      // Calcular onde o centro do olho estaria se seguisse o mouse diretamente
      // O centro do olho se move em direção ao mouse, mas limitado pela elipse
      const targetEyeLCenterX = mouseX;
      const targetEyeLCenterY = mouseY;
      const targetEyeRCenterX = mouseX;
      const targetEyeRCenterY = mouseY;

      // Limitar o centro do olho dentro da elipse de movimento
      const clampedEyeLCenter = clampEllipse(
        targetEyeLCenterX,
        targetEyeLCenterY,
        leftCfg.cx,
        leftCfg.cy,
        leftCfg.rx,
        leftCfg.ry
      );
      const clampedEyeRCenter = clampEllipse(
        targetEyeRCenterX,
        targetEyeRCenterY,
        rightCfg.cx,
        rightCfg.cy,
        rightCfg.rx,
        rightCfg.ry
      );

      // Calcular o deslocamento do centro do olho em relação à sua posição inicial
      const deltaXL = clampedEyeLCenter.x - eyeLCenterX;
      const deltaYL = clampedEyeLCenter.y - eyeLCenterY;
      const deltaXR = clampedEyeRCenter.x - eyeRCenterX;
      const deltaYR = clampedEyeRCenter.y - eyeRCenterY;

      gsap.to(eyeLGroup, {
        attr: {
          transform: `translate(${deltaXL}, ${deltaYL})`
        },
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(eyeRGroup, {
        attr: {
          transform: `translate(${deltaXR}, ${deltaYR})`
        },
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    // Verificar se é dispositivo móvel (sem mouse)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ||
                     'ontouchstart' in window;

    // Adicionar listener global na janela para seguir o mouse em toda a página (apenas se não for mobile)
    if (!isMobile) {
      window.addEventListener('mousemove', handleMove);
      return () => {
        window.removeEventListener('mousemove', handleMove);
      };
    }
  }, [svgContent, inline, size]);

  return (
    <div 
      ref={containerRef}
      style={inline ? {
        position: 'relative',
        width: `${size}px`,
        height: 'auto',
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        aspectRatio: '764.64 / 774.05',
        pointerEvents: 'auto'
      } : {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '260px',
        height: '260px',
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
    />
  );
}
