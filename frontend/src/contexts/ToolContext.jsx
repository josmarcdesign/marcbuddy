import { createContext, useContext, useState } from 'react';

const ToolContext = createContext(null);

export const ToolProvider = ({ children }) => {
  // Modo escuro removido - sempre claro
  const darkMode = false;
  const setDarkMode = () => {}; // Função vazia para compatibilidade
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ToolContext.Provider value={{
      darkMode,
      setDarkMode,
      showHistory,
      setShowHistory,
      showSettings,
      setShowSettings
    }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useTool must be used within a ToolProvider');
  }
  return context;
};

