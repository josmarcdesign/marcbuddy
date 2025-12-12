import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlansProvider } from './contexts/PlansContext';
import { ToolProvider } from './contexts/ToolContext';
import { FloatingWindowProvider } from './contexts/FloatingWindowContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import FloatingWindowContainer from './components/FloatingWindowContainer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Payment from './pages/Payment';
import Checkout from './pages/Checkout';
import StripeReturn from './pages/StripeReturn';
import SubscriptionManagement from './pages/SubscriptionManagement';
import Tools from './pages/Tools';
import Benefits from './pages/Benefits';
import Resources from './pages/Resources';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';
import AdminPayments from './pages/Admin/Payments';
import AdminPanel from './pages/Admin/AdminPanel';
import BotConfig from './bot/BotConfig';
import ProtectedRoute from './components/ProtectedRoute';
import ColorBuddyExtractor from './components/tools/colorbuddy/ColorBuddyExtractor';
import ColorBuddyGenerator from './components/tools/colorbuddy/ColorBuddyGenerator';
import ImageBuddy from './pages/ImageBuddy';
import MClientsPage from './pages/MClients';
import EmailDesigner from './pages/EmailDesigner';
import ToolsPageNavbar from './components/ToolsPageNavbar';
import ToolPageNavbar from './components/ToolPageNavbar';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import FAQ from './pages/FAQ';
import Assets from './pages/Assets';
import Plugins from './pages/Plugins';
import SupportBotWidget from './bot/SupportBotWidget';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlansProvider>
          <FloatingWindowProvider>
          <ScrollToTop />
            <FloatingWindowContainer />
        <Routes>
        {/* Rotas sem Layout (Login/Register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Rotas com Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/benefits" element={<Layout><Benefits /></Layout>} />
        <Route path="/plans" element={<Layout><Plans /></Layout>} />
        <Route path="/plans/:planId/checkout" element={<Checkout />} />
        <Route path="/plans/:planId/payment" element={<Layout><Payment /></Layout>} />
        <Route path="/stripe/return" element={<StripeReturn />} />
        <Route path="/subscription" element={<Layout><ProtectedRoute><SubscriptionManagement /></ProtectedRoute></Layout>} />
        <Route path="/ferramentas" element={<Layout hideFooter={true} customNavbar={<ToolsPageNavbar />}><Tools /></Layout>} />
        <Route path="/plugins" element={<Layout><Plugins /></Layout>} />
        <Route 
          path="/ferramentas/colorbuddy/extrator" 
          element={
            <ToolProvider>
              <Layout hideFooter={true} customNavbar={<ToolPageNavbar />}>
                <ProtectedRoute>
                  <ColorBuddyExtractor />
                </ProtectedRoute>
              </Layout>
            </ToolProvider>
          } 
        />
        <Route 
          path="/ferramentas/colorbuddy/gerador" 
          element={
            <Layout hideFooter={true} customNavbar={<ToolPageNavbar />}>
              <ProtectedRoute>
                <ColorBuddyGenerator />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route
          path="/ferramentas/imagebuddy"
          element={
            <Layout hideFooter={true} customNavbar={<ToolPageNavbar />}>
              <ProtectedRoute>
                <ImageBuddy />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/ferramentas/imagebuddy/"
          element={
            <Layout hideFooter={true} customNavbar={<ToolPageNavbar />}>
              <ProtectedRoute>
                <ImageBuddy />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/ferramentas/mclients"
          element={
            <ToolProvider>
              <Layout hideFooter={true} customNavbar={<ToolPageNavbar />}>
                <ProtectedRoute>
                  <MClientsPage />
                </ProtectedRoute>
              </Layout>
            </ToolProvider>
          }
        />
        <Route
          path="/ferramentas/emaildesigner"
          element={
            <Layout hideFooter={true} customNavbar={<ToolPageNavbar />}>
              <ProtectedRoute>
                <EmailDesigner />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />
        <Route path="/resources/documentation" element={<Documentation />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/resources/community" element={<Layout><Resources /></Layout>} />
        <Route path="/resources/tutorials" element={<Layout><Resources /></Layout>} />
        <Route path="/resources/faq" element={<Navigate to="/faq" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <Layout hideFooter={true}>
              <ProtectedRoute>
                <AdminPayments />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout hideFooter={true}>
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/admin/bot-config"
          element={
            <Layout hideFooter={true}>
              <ProtectedRoute>
                <BotConfig />
              </ProtectedRoute>
            </Layout>
          }
        />
        {/* Páginas Legais */}
        <Route path="/privacidade" element={<Layout><Privacy /></Layout>} />
        <Route path="/termos" element={<Layout><Terms /></Layout>} />
        <Route path="/reembolso" element={<Layout><Refund /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route 
          path="/biblioteca" 
          element={
            <Layout>
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            </Layout>
          } 
        />
        {/* Rotas antigas (redirecionamento) */}
        <Route path="/privacy" element={<Navigate to="/privacidade" replace />} />
        <Route path="/terms" element={<Navigate to="/termos" replace />} />
        <Route path="/refund" element={<Navigate to="/reembolso" replace />} />
        </Routes>
        {/* AdminWidget desabilitado */}
        <SupportBotWidget />
          </FloatingWindowProvider>
        </PlansProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

