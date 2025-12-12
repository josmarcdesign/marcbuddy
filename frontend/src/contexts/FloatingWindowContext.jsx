import { createContext, useContext, useState, useCallback } from 'react';

const FloatingWindowContext = createContext();

export const FloatingWindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);

  const openWindow = useCallback((toolId, toolName, toolPath, component) => {
    const newWindow = {
      id: `${toolId}-${Date.now()}`,
      toolId,
      toolName,
      toolPath,
      component,
      position: { x: 100 + (windows.length * 30), y: 100 + (windows.length * 30) },
      size: { width: 1200, height: 800 },
      zIndex: 1000 + windows.length
    };
    setWindows(prev => [...prev, newWindow]);
    return newWindow.id;
  });

  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  });

  const updateWindowPosition = useCallback((windowId, position) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position } : w
    ));
  });

  const updateWindowSize = useCallback((windowId, size) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, size } : w
    ));
  });

  const bringToFront = useCallback((windowId) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1000);
      return prev.map(w => 
        w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
  });

  return (
    <FloatingWindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      updateWindowPosition,
      updateWindowSize,
      bringToFront
    }}>
      {children}
    </FloatingWindowContext.Provider>
  );
};

export const useFloatingWindow = () => {
  const context = useContext(FloatingWindowContext);
  if (!context) {
    throw new Error('useFloatingWindow must be used within FloatingWindowProvider');
  }
  return context;
};

