import { useState, useEffect, useRef } from 'react';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);

  // Desabilitar scroll durante o loading
  useEffect(() => {
    if (isLoading) {
      // Salvar o valor atual do overflow
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyOverflowY = document.body.style.overflowY;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalHtmlOverflowY = document.documentElement.style.overflowY;
      
      // Desabilitar scroll no body e html
      document.body.style.overflow = 'hidden';
      document.body.style.overflowY = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overflowY = 'hidden';
      
      // Reabilitar scroll quando o loading terminar
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.overflowY = originalBodyOverflowY;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overflowY = originalHtmlOverflowY;
      };
    }
  }, [isLoading]);

  useEffect(() => {
    // Aguardar um pouco para garantir que os refs estão prontos
    const timer = setTimeout(() => {
      if (path1Ref.current && path2Ref.current) {
        // Calcular comprimentos dos paths
        const length1 = path1Ref.current.getTotalLength();
        const length2 = path2Ref.current.getTotalLength();

        // Configurar stroke-dasharray e stroke-dashoffset inicial
        path1Ref.current.setAttribute('stroke-dasharray', length1);
        path1Ref.current.setAttribute('stroke-dashoffset', length1);
        path2Ref.current.setAttribute('stroke-dasharray', length2);
        path2Ref.current.setAttribute('stroke-dashoffset', length2);

        // Animar o desenho
        const duration = 2000; // 2 segundos
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          if (path1Ref.current && path2Ref.current) {
            // Primeiro path (0-60% do tempo)
            if (progress <= 0.6) {
              const path1Progress = progress / 0.6;
              const path1Dash = length1 * path1Progress;
              path1Ref.current.setAttribute('stroke-dashoffset', length1 - path1Dash);
            } else {
              path1Ref.current.setAttribute('stroke-dashoffset', 0);
            }

            // Segundo path (40-100% do tempo)
            if (progress >= 0.4) {
              const path2Progress = (progress - 0.4) / 0.6;
              const path2Dash = length2 * path2Progress;
              path2Ref.current.setAttribute('stroke-dashoffset', length2 - path2Dash);
            }
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Animação completa, esperar um pouco e esconder
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          }
        };

        requestAnimationFrame(animate);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-white z-[99999] flex items-center justify-center"
      style={{ zIndex: 99999 }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <svg
          viewBox="0 0 268.26 256"
          className="w-24 h-24 md:w-28 md:h-28"
          style={{ maxWidth: '112px', maxHeight: '112px' }}
        >
          <defs>
            <style>
              {`
                .loader-path {
                  fill: none;
                  stroke: #011526;
                  stroke-miterlimit: 10;
                  stroke-width: 6px;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                }
              `}
            </style>
          </defs>
          <g>
            <path
              ref={path1Ref}
              className="loader-path"
              d="M265.26,178.24c0,.71-.01,1.42-.03,2.13-.4,14.34-4.84,27.68-12.23,38.9-2.02,3.08-4.27,6-6.71,8.73-5.25,5.89-11.42,10.94-18.29,14.92-7.59,4.42-16.02,7.53-25,9.03-4.07.69-8.24,1.05-12.5,1.05h-112.74c-8.51,0-16.88-1.45-24.76-4.22-9.16-3.21-17.67-8.19-25-14.74-1.06-.94-2.1-1.92-3.11-2.93-1.01-1.01-1.99-2.05-2.93-3.11-12.18-13.65-18.96-31.36-18.96-49.76V15.5c0-6.9,5.59-12.5,12.5-12.5,3.46,0,6.59,1.41,8.85,3.68l.4.41,3.25,3.25,17.61,17.66,7.39,7.41,25,25.08,25,25.07.55.55,24.45-26.9,3.25-3.57c2.28-2.51,5.58-4.09,9.25-4.09,6.9,0,12.5,5.59,12.5,12.5v89.43c0,2.81-.93,5.4-2.49,7.49-1.94,2.58-4.85,4.39-8.2,4.88-.58.09-1.18.13-1.79.13-6.89.01-12.52-5.79-12.52-12.67v-56.93s-6.45,7.1-6.45,7.1l-8.19,9h0s-.13.15-.13.15c-.16.18-.33.35-.5.52-2.69,2.64-6.25,3.82-9.73,3.54-2.88-.22-5.69-1.43-7.88-3.63l-.07-.07-9.02-9.05-.46-.46-7.57-7.59-25-25.07-25-25.08v132.5c0,13.2,5.24,25.86,14.57,35.19,3.13,3.14,6.64,5.81,10.43,7.98,7.47,4.28,16,6.59,24.76,6.59h112.74c4.32,0,8.5-.55,12.5-1.59,9.84-2.54,18.5-8.02,25-15.46,7.63-8.74,12.26-20.19,12.26-32.71s-4.63-23.97-12.26-32.71c-6.5-7.44-15.16-12.92-25-15.46-3.89-1.01-7.94-1.56-12.13-1.59-.02.01-.05.01-.07,0t-.02,0h-.02s-.01.01-.02,0h-.24c-.1,0-.2.01-.29,0h-.24c-.88-.04-1.75-.17-2.6-.39-4.3-1.11-7.87-4.48-9.02-9.09-.19-.74-.3-1.47-.35-2.19v-1.74c.37-5.26,4.06-9.92,9.45-11.27.23-.09.45-.18.68-.28.03-.01.07-.02.1-.04,5.83-2.42,10.84-6.12,14.77-10.69,6.04-7.04,9.53-16.11,9.53-25.67,0-1.62-.1-3.26-.31-4.91-.99-7.91-4.3-15.07-9.22-20.8-6.22-7.22-15.02-12.16-25-13.41h-95.86c-2.65,0-5.2-1.05-7.07-2.93L53,3h125c9.02.77,17.46,3.35,25,7.33,8.3,4.37,15.5,10.44,21.14,17.67,1.38,1.77,2.67,3.61,3.86,5.51,5.78,9.23,9.2,19.91,9.51,31.13.01.52.02,1.04.02,1.56v.05c0,.89-.02,1.77-.06,2.64-.49,11.15-4.07,21.08-9.47,29.52-1.12,1.75-2.32,3.44-3.58,5.07-1.59,2.03-3.29,3.96-5.07,5.78,2.99,1.24,5.88,2.68,8.65,4.3,10.06,5.84,18.63,13.96,25,23.66,7.39,11.23,11.83,24.56,12.23,38.9.02.7.03,1.41.03,2.12Z"
            />
            <path
              ref={path2Ref}
              className="loader-path"
              d="M190.5,179.34c0,3.55-1.48,6.76-3.86,9.03-.28.25-.56.5-.84.74-2.51,2.21-5.11,4.24-7.8,6.1-7.78,5.42-16.23,9.42-25,12.01-.81.25-1.63.48-2.45.69-1.54.41-3.08.78-4.64,1.09h0c-5.69,1.19-11.48,1.8-17.27,1.83-.07.01-.13.01-.2.01-.15,0-.29.01-.44,0h-.25c-.08,0-.16,0-.25-.01-.05.01-.09.01-.14,0-1.4,0-2.8-.05-4.2-.13-2.37-.13-4.75-.36-7.11-.68-4.4-.61-8.76-1.55-13.05-2.84-8.78-2.61-17.23-6.63-25-12.06-2.38-1.65-4.7-3.45-6.94-5.38-.85-.73-1.7-1.48-2.53-2.25-2.23-2.58-3.41-6.07-2.92-9.83.72-5.54,5.2-10,10.75-10.71,4.02-.51,7.72.89,10.33,3.42,4.99,4.36,10.5,7.79,16.31,10.31,4.21,1.82,8.59,3.17,13.03,4.02,3.61.7,7.26,1.08,10.92,1.13-.01.02-.01.04-.01.07.35-.03.7-.05,1.06-.05,4.4,0,8.81-.46,13.13-1.38,3.86-.82,7.66-2.01,11.34-3.57.18-.07.36-.15.53-.23,5.85-2.53,11.4-6,16.42-10.4.05-.04.09-.08.14-.12,2.22-2.05,5.19-3.3,8.44-3.3,6.91,0,12.5,5.59,12.5,12.49Z"
            />
          </g>
        </svg>
        <p className="text-brand-blue-900 text-lg font-semibold font-nunito">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

