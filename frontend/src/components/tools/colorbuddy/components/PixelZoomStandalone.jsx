import { useRef, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

export function PixelZoomStandalone({
  sourceCanvasRef,
  hoverPosition,
  pixelSize = 15,
  gridSize = 11,
  gridWidth,
  gridHeight,
  highlightColor = '#ff0000',
}) {
  const zoomCanvasRef = useRef(null);

  // Se gridWidth/gridHeight forem fornecidos, usar eles, senão usa gridSize (quadrado)
  const effectiveGridWidth = gridWidth !== undefined ? gridWidth : gridSize;
  const effectiveGridHeight = gridHeight !== undefined ? gridHeight : gridSize;

  useEffect(() => {
    if (!hoverPosition || !sourceCanvasRef.current || !zoomCanvasRef.current) return;

    const sourceCanvas = sourceCanvasRef.current;
    const zoomCanvas = zoomCanvasRef.current;
    const sourceCtx = sourceCanvas.getContext('2d');
    const zoomCtx = zoomCanvas.getContext('2d');

    if (!sourceCtx || !zoomCtx) return;

    const halfGridWidth = Math.floor(effectiveGridWidth / 2);
    const halfGridHeight = Math.floor(effectiveGridHeight / 2);

    zoomCanvas.width = effectiveGridWidth * pixelSize;
    zoomCanvas.height = effectiveGridHeight * pixelSize;

    zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);

    for (let dy = -halfGridHeight; dy <= halfGridHeight; dy++) {
      for (let dx = -halfGridWidth; dx <= halfGridWidth; dx++) {
        const sourceX = Math.floor(hoverPosition.x) + dx;
        const sourceY = Math.floor(hoverPosition.y) + dy;

        if (
          sourceX >= 0 &&
          sourceX < sourceCanvas.width &&
          sourceY >= 0 &&
          sourceY < sourceCanvas.height
        ) {
          const pixel = sourceCtx.getImageData(sourceX, sourceY, 1, 1).data;
          const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          zoomCtx.fillStyle = color;
          const drawX = (dx + halfGridWidth) * pixelSize;
          const drawY = (dy + halfGridHeight) * pixelSize;
          zoomCtx.fillRect(drawX, drawY, pixelSize, pixelSize);

          zoomCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          zoomCtx.lineWidth = 1;
          zoomCtx.strokeRect(drawX, drawY, pixelSize, pixelSize);
        }
      }
    }

    const centerX = halfGridWidth * pixelSize;
    const centerY = halfGridHeight * pixelSize;
    zoomCtx.strokeStyle = highlightColor;
    zoomCtx.lineWidth = 2;
    zoomCtx.strokeRect(centerX, centerY, pixelSize, pixelSize);
  }, [hoverPosition, sourceCanvasRef, pixelSize, effectiveGridWidth, effectiveGridHeight, highlightColor]);

  return (
    <div className="flex-shrink-0 w-full">
      <div className="border rounded-lg p-4 bg-card space-y-2">
        <div className="flex items-center gap-2 text-sm mb-2">
          <ZoomIn className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Visualização em Pixels</span>
        </div>
        <div className="border-2 border-muted rounded-lg overflow-hidden bg-white">
          <canvas
            ref={zoomCanvasRef}
            className="w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
    </div>
  );
}

