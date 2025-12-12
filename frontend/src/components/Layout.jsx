import Navbar from './Navbar';
import Footer from './Footer';
import DashboardFooter from './DashboardFooter';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children, hideFooter = false, customFooter = null, customNavbar = null }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-brand-white'} transition-colors`}>
      {customNavbar ? customNavbar : <Navbar />}
      <main className={`flex-grow ${darkMode ? 'bg-gray-900' : 'bg-brand-white'} transition-colors`}>
        {children}
      </main>
      {!hideFooter && (
        <>
          {customFooter ? customFooter : isDashboard ? <DashboardFooter /> : <Footer />}
        </>
      )}
    </div>
  );
};

export default Layout;

