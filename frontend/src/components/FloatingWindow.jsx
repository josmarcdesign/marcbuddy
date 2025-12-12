import { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, Square } from 'lucide-react';
import { useFloatingWindow } from '../contexts/FloatingWindowContext';

const FloatingWindow = ({ window }) => {
  const { closeWindow, updateWindowPosition, updateWindowSize, bringToFront } = useFloatingWindow();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    bringToFront(window.id);
  }, []);

  const handleMouseDown = (e) => {
    if (e.target === headerRef.current || headerRef.current?.contains(e.target)) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      bringToFront(window.id);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isMaximized) {
      updateWindowPosition(window.id, {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    if (isResizing && !isMaximized) {
      const newWidth = e.clientX - window.position.x;
      const newHeight = e.clientY - window.position.y;
      updateWindowSize(window.id, {
        width: Math.max(400, newWidth),
        height: Math.max(300, newHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, window.position, window.id]);

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX - window.size.width,
      y: e.clientY - window.size.height
    });
    bringToFront(window.id);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      updateWindowSize(window.id, { width: 1200, height: 800 });
      updateWindowPosition(window.id, { x: 100, y: 100 });
    } else {
      setIsMaximized(true);
      updateWindowSize(window.id, { 
        width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
        height: typeof window !== 'undefined' ? window.innerHeight : 1080 
      });
      updateWindowPosition(window.id, { x: 0, y: 0 });
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bg-white border-2 border-gray-300 rounded-t-lg shadow-2xl cursor-pointer"
        style={{
          bottom: 0,
          left: `${window.position.x}px`,
          width: '200px',
          height: '40px',
          zIndex: window.zIndex
        }}
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center justify-between px-3 h-full">
          <span className="text-sm font-medium text-gray-700 font-poppins truncate">
            {window.toolName}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(window.id);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className="fixed bg-white border-2 border-gray-300 rounded-lg shadow-2xl flex flex-col overflow-hidden"
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
        zIndex: window.zIndex
      }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        onMouseDown={handleMouseDown}
        className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between cursor-move select-none"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 font-nunito truncate">
            {window.toolName}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Minimizar"
          >
            <Minimize2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title={isMaximized ? "Restaurar" : "Maximizar"}
          >
            {isMaximized ? <Square className="w-4 h-4 text-gray-600" /> : <Maximize2 className="w-4 h-4 text-gray-600" />}
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="p-1.5 hover:bg-red-200 rounded transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">
        {window.component}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 40%, #cbd5e1 40%, #cbd5e1 45%, transparent 45%, transparent 55%, #cbd5e1 55%, #cbd5e1 60%, transparent 60%)'
          }}
        />
      )}
    </div>
  );
};

export default FloatingWindow;

