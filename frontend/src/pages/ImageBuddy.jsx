import ImageBuddyCompressor from '../components/tools/imagebuddy/ImageBuddyCompressor';
import { ToolProvider } from '../contexts/ToolContext';
import { useTheme } from '../contexts/ThemeContext';

const ImageBuddy = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-brand-white'} transition-colors`}>
      {/* Ferramenta Unificada */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <ToolProvider>
          <ImageBuddyCompressor />
        </ToolProvider>
      </div>
    </div>
  );
};

export default ImageBuddy;

