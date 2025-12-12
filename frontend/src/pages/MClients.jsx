import { Link } from 'react-router-dom';
import MClients from '../components/tools/mclients/MClients';
import { ToolProvider } from '../contexts/ToolContext';

const MClientsPage = () => {
  return (
    <ToolProvider>
      <div className="min-h-screen bg-gray-50">
        <MClients />
      </div>
    </ToolProvider>
  );
};

export default MClientsPage;

