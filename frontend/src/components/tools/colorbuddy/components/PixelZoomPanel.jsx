import React from 'react';
import { PixelZoomStandalone } from './PixelZoomStandalone';

const PixelZoomPanel = ({
  imageUrl,
  pixelZoomCanvasRef,
  pixelZoomPosition,
  pixelSize = 14,
  gridWidth = 25,
  gridHeight = 11,
  highlightColor = '#ff0000',
}) => {
  if (!imageUrl) return null;

  return (
    <div className="mb-3 w-full flex items-start">
      <PixelZoomStandalone
        sourceCanvasRef={pixelZoomCanvasRef}
        hoverPosition={pixelZoomPosition}
        pixelSize={pixelSize}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        highlightColor={highlightColor}
      />
    </div>
  );
};

export default PixelZoomPanel;


