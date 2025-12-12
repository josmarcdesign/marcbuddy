import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import heroIllustrationSvg from '../assets/ilustrations/hero-ilustration.svg';
import heroIllustrationDizzySvg from '../assets/ilustrations/hero-ilustration-dizzy.svg';

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

const HeroIllustration = ({ size = 420, onHitByBall }) => {
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);
  const [dizzySvgContent, setDizzySvgContent] = useState(null);
  const [isDizzy, setIsDizzy] = useState(false);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const activateDizzyRef = useRef(null);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const lastMouseTime = useRef(0);
  const velocityHistory = useRef([]);
  const quickMovementsRef = useRef([]); // Array de timestamps de movimentos rápidos
  const dizzyTimeoutRef = useRef(null);
  const dizzyDelayTimeoutRef = useRef(null);
  const eyeAnimationRef = useRef(null);
  const isDizzyActiveRef = useRef(false);
  const lastDizzyTimeRef = useRef(0); // Timestamp da última vez que entrou em modo dizzy
  const DIZZY_COOLDOWN = 3500; // Cooldown de 3.5 segundos após sair do modo dizzy

  // Carregar SVGs
  useEffect(() => {
    Promise.all([
      fetch(heroIllustrationSvg).then(res => res.text()),
      fetch(heroIllustrationDizzySvg).then(res => res.text())
    ])
      .then(([normalSvg, dizzySvg]) => {
        setSvgContent(normalSvg);
        setDizzySvgContent(dizzySvg);
      })
      .catch(err => console.error('Erro ao carregar SVG:', err));
  }, []);

  // Função para ativar modo dizzy com delay
  const activateDizzy = useCallback(() => {
    const currentTime = Date.now();
    
    // Verificar cooldown - não pode ativar se ainda estiver no período de cooldown
    if (lastDizzyTimeRef.current > 0) {
      const timeSinceLastDizzy = currentTime - lastDizzyTimeRef.current;
      if (timeSinceLastDizzy < DIZZY_COOLDOWN) {
        return; // Ainda está em cooldown
      }
    }
    
    if (isDizzy || isDizzyActiveRef.current) return; // Já está dizzy ou já está ativando
    
    // Limpar delay anterior se existir
    if (dizzyDelayTimeoutRef.current) {
      clearTimeout(dizzyDelayTimeoutRef.current);
    }
    
    isDizzyActiveRef.current = true;
    
    // Delay de 500ms antes de ativar o modo dizzy
    dizzyDelayTimeoutRef.current = setTimeout(() => {
      setIsDizzy(true);
    }, 500);
  }, [isDizzy]);

  // Expor função para ativação externa (ex: quando bola colide)
  useEffect(() => {
    activateDizzyRef.current = activateDizzy;
    
    // Expor função para componente pai via ref
    if (onHitByBall) {
      onHitByBall.current = activateDizzy;
    }
  }, [activateDizzy, onHitByBall]);
  
  // Efeito para gerenciar o timeout de voltar ao normal quando entrar em modo dizzy
  useEffect(() => {
    if (isDizzy) {
      // Limpar timeout anterior se existir
      if (dizzyTimeoutRef.current) {
        clearTimeout(dizzyTimeoutRef.current);
      }
      
      // Voltar ao normal após 3.5 segundos
      dizzyTimeoutRef.current = setTimeout(() => {
        setIsDizzy(false);
        isDizzyActiveRef.current = false;
        // Registrar o timestamp quando o modo dizzy termina (volta ao normal)
        // O cooldown começa a partir daqui
        lastDizzyTimeRef.current = Date.now();
      }, 3500);
      
      return () => {
        if (dizzyTimeoutRef.current) {
          clearTimeout(dizzyTimeoutRef.current);
        }
      };
    }
  }, [isDizzy]);

  // Efeito 3D de perspectiva e detecção de movimento rápido
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calcular a distância do mouse ao centro
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Detectar velocidade do movimento em qualquer direção (horizontal, vertical, diagonal)
      const currentTime = Date.now();
      const timeDelta = currentTime - lastMouseTime.current;
      
      if (timeDelta > 0 && lastMouseTime.current > 0) {
        const deltaX = e.clientX - lastMouseX.current;
        const deltaY = e.clientY - lastMouseY.current;
        // Calcular distância total usando Pitágoras (qualquer direção)
        const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const velocity = totalDistance / timeDelta; // pixels por milissegundo
        
        // Adicionar à história de velocidades (manter últimas 5 medições)
        velocityHistory.current.push(velocity);
        if (velocityHistory.current.length > 5) {
          velocityHistory.current.shift();
        }
        
        // Calcular velocidade média
        const avgVelocity = velocityHistory.current.reduce((a, b) => a + b, 0) / velocityHistory.current.length;
        
        // Verificar se está em cooldown
        const timeSinceLastDizzy = currentTime - lastDizzyTimeRef.current;
        const isInCooldown = lastDizzyTimeRef.current > 0 && timeSinceLastDizzy < DIZZY_COOLDOWN;
        
        // Se a velocidade média for muito alta (movimento realmente rápido), registrar o movimento
        // Threshold reduzido: ~4.5 pixels por milissegundo (mais sensível)
        // Não ativar se estiver em cooldown
        if (avgVelocity > 4.5 && velocityHistory.current.length >= 3 && !isDizzy && !isDizzyActiveRef.current && !isInCooldown) {
          // Adicionar timestamp do movimento rápido
          quickMovementsRef.current.push(currentTime);
          
          // Remover movimentos antigos (mais de 0.15 segundos atrás) - janela maior
          quickMovementsRef.current = quickMovementsRef.current.filter(
            timestamp => currentTime - timestamp < 150
          );
          
          // Só ativar dizzy se houver pelo menos 5 movimentos muito rápidos em 0.15 segundos
          if (quickMovementsRef.current.length >= 5) {
            activateDizzy();
            // Limpar histórico após ativar
            quickMovementsRef.current = [];
          }
        } else if (avgVelocity <= 0.5 && velocityHistory.current.length >= 3 && !isDizzy && isDizzyActiveRef.current) {
          // Se a velocidade diminuir antes do delay terminar, cancelar
          if (dizzyDelayTimeoutRef.current) {
            clearTimeout(dizzyDelayTimeoutRef.current);
            dizzyDelayTimeoutRef.current = null;
            isDizzyActiveRef.current = false;
          }
        }
        
        // Limpar movimentos rápidos antigos periodicamente
        quickMovementsRef.current = quickMovementsRef.current.filter(
          timestamp => currentTime - timestamp < 150
        );
      }
      
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      lastMouseTime.current = currentTime;
      
      // Normalizar os valores (-1 a 1) e aplicar intensidade
      const maxDistance = Math.max(rect.width, rect.height) / 2;
      const normalizedX = mouseX / maxDistance;
      const normalizedY = mouseY / maxDistance;
      
      // Limitar a rotação (máximo de 15 graus)
      const maxRotation = 15;
      const rotateY = normalizedX * maxRotation;
      const rotateX = -normalizedY * maxRotation; // Negativo para inclinar na direção correta
      
      setTransform({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
      // Resetar suavemente quando o mouse sair
      setTransform({ rotateX: 0, rotateY: 0 });
      // Limpar histórico de velocidade e movimentos rápidos
      velocityHistory.current = [];
      quickMovementsRef.current = [];
      lastMouseX.current = 0;
      lastMouseY.current = 0;
      lastMouseTime.current = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (dizzyTimeoutRef.current) {
        clearTimeout(dizzyTimeoutRef.current);
      }
      if (dizzyDelayTimeoutRef.current) {
        clearTimeout(dizzyDelayTimeoutRef.current);
      }
    };
  }, [isDizzy, activateDizzy]);

  // Configurar SVG e olhos que seguem o mouse
  useEffect(() => {
    // Parar animação anterior se existir
    if (eyeAnimationRef.current) {
      eyeAnimationRef.current.kill();
      eyeAnimationRef.current = null;
    }
    
    const currentSvgContent = isDizzy ? dizzySvgContent : svgContent;
    if (!currentSvgContent || !svgContainerRef.current) return;

    // Inserir o SVG no container
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(currentSvgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) return;

    // Limpar container e adicionar o SVG
    svgContainerRef.current.innerHTML = '';
    svgContainerRef.current.appendChild(svgElement);

    // Ajustar o SVG para se adaptar ao container
    svgElement.setAttribute('width', `${size}`);
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svgElement.style.width = `${size}px`;
    svgElement.style.maxWidth = `${size}px`;
    svgElement.style.maxHeight = `${size}px`;

    // Se estiver dizzy, animar os olhos girando
    if (isDizzy) {
      const eyeDizzyL = svgElement.querySelector('#eye-dizzy-left');
      const eyeDizzyR = svgElement.querySelector('#eye-dizzy-right');
      
      if (eyeDizzyL && eyeDizzyR) {
        // Obter o centro de cada olho para rotação
        const boxL = eyeDizzyL.getBBox();
        const boxR = eyeDizzyR.getBBox();
        const centerXL = boxL.x + boxL.width / 2;
        const centerYL = boxL.y + boxL.height / 2;
        const centerXR = boxR.x + boxR.width / 2;
        const centerYR = boxR.y + boxR.height / 2;
        
        // Criar grupos para rotação
        const eyeLGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        eyeLGroup.setAttribute('transform', `translate(${centerXL}, ${centerYL})`);
        const eyeRGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        eyeRGroup.setAttribute('transform', `translate(${centerXR}, ${centerYR})`);
        
        // Mover os olhos para dentro dos grupos
        const eyeLParent = eyeDizzyL.parentNode;
        eyeLParent.insertBefore(eyeLGroup, eyeDizzyL);
        eyeLGroup.appendChild(eyeDizzyL);
        
        const eyeRParent = eyeDizzyR.parentNode;
        eyeRParent.insertBefore(eyeRGroup, eyeDizzyR);
        eyeRGroup.appendChild(eyeDizzyR);
        
        // Ajustar posição dos olhos para que a rotação seja no centro
        eyeDizzyL.setAttribute('transform', `translate(${-centerXL}, ${-centerYL})`);
        eyeDizzyR.setAttribute('transform', `translate(${-centerXR}, ${-centerYR})`);
        
        // Animar rotação contínua para a direita enquanto estiver dizzy
        let rotationL = 0;
        let rotationR = 0;
        let shouldContinueAnimating = true;
        
        const animateEyes = () => {
          if (!shouldContinueAnimating || !isDizzy) {
            return;
          }
          
          rotationL += 360;
          rotationR += 360;
          
          const tl = gsap.timeline({
            onComplete: () => {
              // Continuar animando enquanto estiver no modo dizzy
              if (shouldContinueAnimating && isDizzy) {
                animateEyes();
              }
            }
          });
          
          tl.to(eyeLGroup, {
            attr: { transform: `translate(${centerXL}, ${centerYL}) rotate(${rotationL})` },
            duration: 0.4,
            ease: 'linear',
          })
          .to(eyeRGroup, {
            attr: { transform: `translate(${centerXR}, ${centerYR}) rotate(${rotationR})` },
            duration: 0.4,
            ease: 'linear',
          }, 0); // Começar ao mesmo tempo
          
          eyeAnimationRef.current = tl;
        };
        
        animateEyes();
        
        // Limpar animação quando sair do modo dizzy
        return () => {
          shouldContinueAnimating = false;
          if (eyeAnimationRef.current) {
            eyeAnimationRef.current.kill();
          }
        };
      }
      return; // Não precisa configurar olhos que seguem o mouse quando está dizzy
    }

    // Buscar os elementos dos olhos (modo normal)
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

    const handleMove = (e) => {
      // Converter coordenadas do mouse da janela para coordenadas do SVG
      const rect = svgElement.getBoundingClientRect();
      const vb = svgElement.viewBox.baseVal;
      const mouseX = ((e.clientX - rect.left) / rect.width) * vb.width;
      const mouseY = ((e.clientY - rect.top) / rect.height) * vb.height;

      // Calcular onde o centro do olho estaria se seguisse o mouse diretamente
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
  }, [svgContent, dizzySvgContent, isDizzy, size]);

  return (
    <div 
      ref={containerRef}
      className="w-full flex items-center justify-center mx-auto pt-5 pb-2 lg:pt-5 lg:pb-5" 
      style={{ maxWidth: '100%', perspective: '1000px', overflowX: 'hidden', overflowY: 'visible', position: 'relative' }}
    >
      <div 
        className="w-full flex items-center justify-center animate-float" 
        style={{ 
          maxWidth: '100%',
          transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
          overflowX: 'hidden',
          overflowY: 'visible'
        }}
      >
        <div 
          ref={svgContainerRef}
          className="max-w-full"
          style={{
            position: 'relative',
            width: `${size}px`,
            maxWidth: '100%',
            height: 'auto',
            aspectRatio: '764.64 / 774.05',
            pointerEvents: 'auto',
            overflowX: 'hidden',
            overflowY: 'visible'
          }}
        />
      </div>
    </div>
  );
};

export default HeroIllustration;
