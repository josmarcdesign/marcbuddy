import { useState } from 'react';
import { mockData } from '../utils/mockData';

export const useMClientsState = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [demandView, setDemandView] = useState('list');
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // Estados de dados
  const [clients, setClients] = useState(mockData.clients || []);
  const [demands, setDemands] = useState(mockData.demands || []);
  const [payments, setPayments] = useState(mockData.payments || []);
  const [documents, setDocuments] = useState(mockData.documents || []);
  const [services, setServices] = useState(mockData.services || []);
  const [tasks, setTasks] = useState(mockData.tasks || []);
  const [comments, setComments] = useState(mockData.comments || []);
  const [activities, setActivities] = useState(mockData.activities || []);
  const [tags, setTags] = useState(mockData.tags || []);
  const [clientTags, setClientTags] = useState(mockData.clientTags || []);
  const [timeEntries, setTimeEntries] = useState(mockData.timeEntries || []);
  const [templates, setTemplates] = useState(mockData.templates || []);
  const [approvals, setApprovals] = useState(mockData.approvals || []);

  // Formulários
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    leadSource: '',
    leadSourceDetails: ''
  });

  const [demandForm, setDemandForm] = useState({
    clientId: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    clientId: '',
    demandId: '',
    amount: '',
    dueDate: '',
    paymentTime: '',
    description: '',
    paymentMethod: 'pix',
    senderName: '',
    receiverName: '',
    senderBank: '',
    receiverBank: '',
    status: 'pending',
    paidDate: null
  });

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'branding',
    duration: '',
    active: true
  });


  return {
    // Estados de UI
    activeTab, setActiveTab,
    currentMonth, setCurrentMonth,
    searchTerm, setSearchTerm,
    selectedClient, setSelectedClient,
    showClientModal, setShowClientModal,
    showDemandModal, setShowDemandModal,
    showPaymentModal, setShowPaymentModal,
    editingPayment, setEditingPayment,
    showServiceModal, setShowServiceModal,
    showDocumentModal, setShowDocumentModal,
    editingDocument, setEditingDocument,
    filterStatus, setFilterStatus,
    demandView, setDemandView,
    selectedDemand, setSelectedDemand,
    showTaskModal, setShowTaskModal,
    showCommentModal, setShowCommentModal,
    showTemplateModal, setShowTemplateModal,
    showTimeTrackingModal, setShowTimeTrackingModal,
    activeTimer, setActiveTimer,
    timerStart, setTimerStart,
    timerDisplay, setTimerDisplay,
    viewingReceipt, setViewingReceipt,
    
    // Estados de dados
    clients, setClients,
    demands, setDemands,
    payments, setPayments,
    documents, setDocuments,
    services, setServices,
    tasks, setTasks,
    comments, setComments,
    activities, setActivities,
    tags, setTags,
    clientTags, setClientTags,
    timeEntries, setTimeEntries,
    templates, setTemplates,
    approvals, setApprovals,
    
    // Formulários
    clientForm, setClientForm,
    demandForm, setDemandForm,
    paymentForm, setPaymentForm,
    serviceForm, setServiceForm,
  };
};

