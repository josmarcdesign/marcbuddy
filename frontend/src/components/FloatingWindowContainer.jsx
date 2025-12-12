import { useFloatingWindow } from '../contexts/FloatingWindowContext';
import FloatingWindow from './FloatingWindow';

const FloatingWindowContainer = () => {
  const { windows } = useFloatingWindow();

  return (
    <>
      {windows.map(window => (
        <FloatingWindow key={window.id} window={window} />
      ))}
    </>
  );
};

export default FloatingWindowContainer;

