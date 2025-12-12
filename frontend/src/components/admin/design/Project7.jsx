import { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { 
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  FileText,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Upload,
  Download,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  MoreVertical,
  Tag,
  FileEdit,
  FolderOpen,
  Paperclip,
  CheckSquare,
  Square,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Timer,
  FileCheck,
  Layers,
  History,
  Bell,
  Download as DownloadIcon,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  StopCircle,
  Kanban,
  List,
  Grid3x3,
  FileImage,
  Loader2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { BRAND_COLORS } from '../../../config/brand';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

const Project7 = ({ isFullscreen = false }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, clients, demands, payments, documents, services, calendar, tasks, pipeline, followthrough
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
  const [demandView, setDemandView] = useState('list'); // list, kanban
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [showFollowThroughModal, setShowFollowThroughModal] = useState(false);
  const [editingFollowThrough, setEditingFollowThrough] = useState(null);
  
  // Modal de alerta/confirmação customizado
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: 'info', // 'info', 'warning', 'error', 'success', 'confirm'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });
  
  // Funções auxiliares para exibir modais
  const showAlert = (message, type = 'info', title = '') => {
    setAlertModal({
      show: true,
      type,
      title: title || (type === 'error' ? 'Erro' : type === 'warning' ? 'Atenção' : type === 'success' ? 'Sucesso' : 'Informação'),
      message,
      onConfirm: () => setAlertModal({ ...alertModal, show: false }),
      onCancel: null
    });
  };
  
  const showConfirm = (message, onConfirm, title = 'Confirmar', type = 'warning') => {
    setAlertModal({
      show: true,
      type,
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setAlertModal({ ...alertModal, show: false });
      },
      onCancel: () => setAlertModal({ ...alertModal, show: false })
    });
  };

  // Estados principais
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 99999-9999',
      company: 'Tech Solutions',
      address: 'Rua Exemplo, 123 - São Paulo, SP',
      notes: 'Cliente preferencial',
      createdAt: '2025-01-15',
      status: 'active',
      leadSource: 'instagram',
      leadSourceDetails: 'Anúncio patrocinado'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(11) 88888-8888',
      company: 'Design Studio',
      address: 'Av. Principal, 456 - Rio de Janeiro, RJ',
      notes: '',
      createdAt: '2025-01-10',
      status: 'active',
      leadSource: 'indicacao',
      leadSourceDetails: 'Indicado por João Silva'
    }
  ]);

  const [demands, setDemands] = useState([
    {
      id: 1,
      clientId: 1,
      title: 'Criação de Logo',
      description: 'Desenvolvimento de identidade visual completa',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2025-02-01',
      createdAt: '2025-01-15',
      documents: [1, 2]
    },
    {
      id: 2,
      clientId: 2,
      title: 'Redesign de Site',
      description: 'Atualização completa do site institucional',
      status: 'pending',
      priority: 'medium',
      dueDate: '2025-02-15',
      createdAt: '2025-01-10',
      documents: []
    }
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      clientId: 1,
      demandId: 1,
      amount: 2500.00,
      dueDate: '2025-02-01',
      paidDate: null,
      status: 'pending',
      description: 'Pagamento inicial - Logo',
      paymentMethod: 'pix'
    },
    {
      id: 2,
      clientId: 2,
      demandId: 2,
      amount: 5000.00,
      dueDate: '2025-02-15',
      paidDate: null,
      status: 'pending',
      description: 'Pagamento inicial - Redesign',
      paymentMethod: 'bank_transfer'
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      clientId: 1,
      demandId: 1,
      name: 'Briefing_Cliente.pdf',
      type: 'pdf',
      size: '2.5 MB',
      uploadedAt: '2025-01-15',
      content: 'Conteúdo do documento...',
      category: 'briefing'
    },
    {
      id: 2,
      clientId: 1,
      demandId: 1,
      name: 'Proposta_Comercial.docx',
      type: 'docx',
      size: '1.2 MB',
      uploadedAt: '2025-01-16',
      content: 'Conteúdo da proposta...',
      category: 'proposal'
    }
  ]);

  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Criação de Logo',
      description: 'Desenvolvimento de identidade visual',
      price: 2500.00,
      category: 'branding',
      duration: '15 dias',
      active: true
    },
    {
      id: 2,
      name: 'Redesign de Site',
      description: 'Atualização completa de site',
      price: 5000.00,
      category: 'web',
      duration: '30 dias',
      active: true
    },
    {
      id: 3,
      name: 'Social Media',
      description: 'Gestão de redes sociais',
      price: 1500.00,
      category: 'marketing',
      duration: 'Mensal',
      active: true
    }
  ]);

  // Novos estados para funcionalidades adicionais
  const [tasks, setTasks] = useState([
    {
      id: 1,
      demandId: 1,
      title: 'Criar moodboard inicial',
      completed: false,
      dueDate: '2025-01-20',
      priority: 'high',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      demandId: 1,
      title: 'Desenvolver 3 opções de logo',
      completed: false,
      dueDate: '2025-01-25',
      priority: 'high',
      createdAt: '2025-01-15'
    },
    {
      id: 3,
      demandId: 2,
      title: 'Análise de concorrência',
      completed: true,
      dueDate: '2025-01-18',
      priority: 'medium',
      createdAt: '2025-01-10'
    }
  ]);

  const [comments, setComments] = useState([
    {
      id: 1,
      demandId: 1,
      clientId: 1,
      content: 'Gostei muito da primeira opção! Podemos ajustar as cores?',
      author: 'João Silva',
      createdAt: '2025-01-16T10:30:00',
      type: 'client'
    },
    {
      id: 2,
      demandId: 1,
      clientId: null,
      content: 'Claro! Vou preparar as variações de cor.',
      author: 'Você',
      createdAt: '2025-01-16T11:00:00',
      type: 'internal'
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'demand_created',
      demandId: 1,
      clientId: 1,
      description: 'Demanda "Criação de Logo" criada',
      createdAt: '2025-01-15T09:00:00'
    },
    {
      id: 2,
      type: 'payment_added',
      paymentId: 1,
      clientId: 1,
      description: 'Pagamento de R$ 2.500,00 adicionado',
      createdAt: '2025-01-15T10:00:00'
    },
    {
      id: 3,
      type: 'document_uploaded',
      documentId: 1,
      clientId: 1,
      description: 'Documento "Briefing_Cliente.pdf" enviado',
      createdAt: '2025-01-15T14:30:00'
    }
  ]);

  const [tags, setTags] = useState([
    { id: 1, name: 'Urgente', color: 'red' },
    { id: 2, name: 'Novo Cliente', color: 'blue' },
    { id: 3, name: 'Recorrente', color: 'green' },
    { id: 4, name: 'Social Media', color: 'purple' },
    { id: 5, name: 'Branding', color: 'orange' }
  ]);

  const [clientTags, setClientTags] = useState([
    { clientId: 1, tagId: 2 },
    { clientId: 1, tagId: 5 },
    { clientId: 2, tagId: 3 }
  ]);

  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      demandId: 1,
      description: 'Desenvolvimento de logo',
      hours: 4.5,
      date: '2025-01-15',
      status: 'completed'
    },
    {
      id: 2,
      demandId: 1,
      description: 'Reunião com cliente',
      hours: 1.0,
      date: '2025-01-16',
      status: 'completed'
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Proposta Logo Básico',
      content: 'Prezado(a) {cliente},\n\nSegue proposta para criação de logo...',
      category: 'proposal',
      active: true
    },
    {
      id: 2,
      name: 'Contrato Design',
      content: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS...',
      category: 'contract',
      active: true
    }
  ]);

  const [approvals, setApprovals] = useState([
    {
      id: 1,
      demandId: 1,
      documentId: 1,
      status: 'pending',
      requestedAt: '2025-01-16',
      approvedAt: null,
      comments: ''
    }
  ]);

  const [followThroughModels, setFollowThroughModels] = useState([
    {
      id: 1,
      name: 'Identidade Visual',
      questions: [
        { id: 1, question: 'Qual é o objetivo principal do projeto?', required: true },
        { id: 2, question: 'Quem é o público-alvo?', required: true },
        { id: 3, question: 'Quais são suas referências ou inspirações?', required: false },
        { id: 4, question: 'Qual é o prazo desejado?', required: true },
        { id: 5, question: 'Existe algum orçamento definido?', required: false }
      ],
      createdAt: '2025-01-15'
    }
  ]);

  const [followThroughs, setFollowThroughs] = useState([
    {
      id: 1,
      clientId: 1,
      modelId: 1,
      briefingUrl: 'https://marcbuddy.com/briefing/abc123xyz',
      status: 'pending', // pending, completed, expired
      createdAt: '2025-01-15',
      completedAt: null,
      expiresAt: '2025-01-22',
      answers: null // Respostas do cliente quando preencher
    }
  ]);

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

  const [followThroughModelForm, setFollowThroughModelForm] = useState({
    name: '',
    questions: [
      { id: 1, question: '', required: true }
    ]
  });

  const [showFollowThroughModelModal, setShowFollowThroughModelModal] = useState(false);
  const [editingFollowThroughModel, setEditingFollowThroughModel] = useState(null);

  // Funções de Clientes
  const handleAddClient = () => {
    if (!clientForm.name || !clientForm.email) {
      showAlert('Nome e email são obrigatórios', 'error');
      return;
    }

    const newClient = {
      id: clients.length + 1,
      ...clientForm,
      leadSource: clientForm.leadSource || null,
      leadSourceDetails: clientForm.leadSourceDetails || null,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setClients([...clients, newClient]);
    
    // Perguntar se deseja criar Follow Through
    if (followThroughModels.length > 0) {
      showConfirm(
        'Deseja criar um Follow Through para este cliente?',
        () => {
          setEditingFollowThrough({ clientId: newClient.id });
          setShowFollowThroughModal(true);
        },
        'Criar Follow Through',
        'confirm'
      );
    }
    
    setClientForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: '',
      leadSource: '',
      leadSourceDetails: ''
    });
    setShowClientModal(false);
  };

  const handleEditClient = (client) => {
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company || '',
      address: client.address || '',
      notes: client.notes || ''
    });
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleUpdateClient = () => {
    if (!clientForm.name || !clientForm.email) {
      showAlert('Nome e email são obrigatórios', 'error');
      return;
    }

    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, ...clientForm }
        : c
    ));
    setShowClientModal(false);
    setSelectedClient(null);
    setClientForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: '',
      leadSource: '',
      leadSourceDetails: ''
    });
  };

  const handleDeleteClient = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir este cliente?',
      () => {
        setClients(clients.filter(c => c.id !== id));
        setDemands(demands.filter(d => d.clientId !== id));
        setPayments(payments.filter(p => p.clientId !== id));
        setDocuments(documents.filter(d => d.clientId !== id));
      },
      'Confirmar Exclusão',
      'confirm'
    );
  };

  // Funções de Demandas
  const handleAddDemand = () => {
    if (!demandForm.clientId || !demandForm.title) {
      showAlert('Cliente e título são obrigatórios', 'error');
      return;
    }

    const newDemand = {
      id: demands.length + 1,
      ...demandForm,
      clientId: parseInt(demandForm.clientId),
      createdAt: new Date().toISOString().split('T')[0],
      documents: []
    };

    setDemands([...demands, newDemand]);
    setDemandForm({
      clientId: '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    });
    setShowDemandModal(false);
  };

  const handleUpdateDemandStatus = (id, status) => {
    setDemands(demands.map(d => 
      d.id === id ? { ...d, status } : d
    ));
  };

  const handleDeleteDemand = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir esta demanda?',
      () => {
        setDemands(demands.filter(d => d.id !== id));
        setPayments(payments.filter(p => p.demandId !== id));
        setDocuments(documents.filter(d => d.demandId !== id));
      },
      'Confirmar Exclusão',
      'warning'
    );
  };

  // Funções de Pagamentos
  const handleAddPayment = () => {
    if (!paymentForm.clientId || !paymentForm.amount || !paymentForm.dueDate) {
      showAlert('Cliente, valor e data são obrigatórios', 'error');
      return;
    }

    if (editingPayment) {
      // Atualizar pagamento existente
      const updatedPayment = {
        ...editingPayment,
        clientId: parseInt(paymentForm.clientId),
        demandId: paymentForm.demandId ? parseInt(paymentForm.demandId) : null,
        amount: parseFloat(paymentForm.amount),
        dueDate: paymentForm.dueDate || null,
        paidDate: paymentForm.paidDate || null,
        status: paymentForm.status || 'pending',
        description: paymentForm.description || '',
        paymentMethod: paymentForm.paymentMethod || 'pix',
        paymentTime: paymentForm.paymentTime || null,
        senderName: paymentForm.senderName || null,
        receiverName: paymentForm.receiverName || null,
        senderBank: paymentForm.senderBank || null,
        receiverBank: paymentForm.receiverBank || null,
        receiptImage: receiptPreview || editingPayment.receiptImage
      };

      setPayments(payments.map(p => p.id === editingPayment.id ? updatedPayment : p));
      setEditingPayment(null);
      showAlert('Pagamento atualizado com sucesso!', 'success');
    } else {
      // Criar novo pagamento
      const newPayment = {
        id: payments.length + 1,
        clientId: parseInt(paymentForm.clientId),
        demandId: paymentForm.demandId ? parseInt(paymentForm.demandId) : null,
        amount: parseFloat(paymentForm.amount),
        dueDate: paymentForm.dueDate || null,
        paidDate: paymentForm.paidDate || null,
        status: paymentForm.status || 'pending',
        description: paymentForm.description || '',
        paymentMethod: paymentForm.paymentMethod || 'pix',
        paymentTime: paymentForm.paymentTime || null,
        senderName: paymentForm.senderName || null,
        receiverName: paymentForm.receiverName || null,
        senderBank: paymentForm.senderBank || null,
        receiverBank: paymentForm.receiverBank || null,
        receiptImage: receiptPreview
      };

      setPayments([...payments, newPayment]);
      showAlert('Pagamento criado com sucesso!', 'success');
    }

    setPaymentForm({
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
    setReceiptImage(null);
    setReceiptPreview(null);
    setOcrResults(null);
    setEditingPayment(null);
    setShowPaymentModal(false);
  };
  
  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentForm({
      clientId: payment.clientId.toString(),
      demandId: payment.demandId ? payment.demandId.toString() : '',
      amount: payment.amount.toString(),
      dueDate: payment.dueDate || '',
      paymentTime: payment.paymentTime || '',
      description: payment.description || '',
      paymentMethod: payment.paymentMethod || 'pix',
      senderName: payment.senderName || '',
      receiverName: payment.receiverName || '',
      senderBank: payment.senderBank || '',
      receiverBank: payment.receiverBank || '',
      status: payment.status || 'pending',
      paidDate: payment.paidDate || null
    });
    
    // Carregar imagem do comprovante se existir
    if (payment.receiptImage) {
      setReceiptPreview(payment.receiptImage);
      setReceiptImage(null); // Não temos o arquivo original, apenas a URL/base64
    } else {
      setReceiptPreview(null);
      setReceiptImage(null);
    }
    
    setOcrResults(null);
    setShowPaymentModal(true);
  };

  // Função para pré-processar imagem (melhorar qualidade para OCR)
  const preprocessImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Aumentar resolução para melhor OCR (mínimo 300 DPI equivalente)
          const scale = Math.max(2, 300 / 72); // Assumindo 72 DPI original
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Configurar contexto para melhor qualidade
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Desenhar imagem escalada
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Aplicar filtros para melhorar OCR
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Converter para escala de cinza e aumentar contraste
          for (let i = 0; i < data.length; i += 4) {
            // Converter para escala de cinza
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            
            // Aumentar contraste (ajustar para melhor leitura)
            const contrast = ((gray - 128) * 1.8) + 128;
            
            // Ajustar brilho
            const brightness = Math.min(255, Math.max(0, contrast + 15));
            
            // Aplicar threshold suave para melhorar legibilidade
            const threshold = brightness > 200 ? 255 : (brightness < 50 ? 0 : brightness);
            
            data[i] = threshold;     // R
            data[i + 1] = threshold; // G
            data[i + 2] = threshold; // B
            // data[i + 3] mantém o alpha
          }
          
          ctx.putImageData(imageData, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Se falhar, retornar a imagem original
              resolve(null);
            }
          }, 'image/png', 1.0);
        } catch (error) {
          console.error('Erro ao pré-processar imagem:', error);
          resolve(null); // Retornar null para usar imagem original
        }
      };
      img.onerror = () => {
        console.error('Erro ao carregar imagem para pré-processamento');
        resolve(null); // Retornar null para usar imagem original
      };
      img.src = imageUrl;
    });
  };

  // Função para processar OCR do comprovante usando Tesseract.js
  const processReceiptOCR = async (file) => {
    setIsProcessingOCR(true);
    
    // Limpar resultados anteriores do OCR antes de processar nova imagem
    setOcrResults(null);
    console.log('🔄 Iniciando novo processamento OCR - resultados anteriores limpos');
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = async (e) => {
      setReceiptPreview(e.target.result);
      setReceiptImage(file);

      try {
        // Pré-processar imagem para melhorar qualidade do OCR
        const processedBlob = await preprocessImage(e.target.result);
        
        // Criar worker do Tesseract (sempre criar novo worker para evitar problemas)
        const worker = await createWorker('por'); // Português brasileiro
        
        // Configurar parâmetros do OCR para melhor precisão
        await worker.setParameters({
          tessedit_char_whitelist: '0123456789R$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚáéíóúÂÊÔâêôÀàÇçÃÕãõ.,/:- ',
          tessedit_pageseg_mode: '6', // Assume uniform block of text
          tessedit_ocr_engine_mode: '1' // LSTM OCR Engine
        });
        
        // Processar a imagem pré-processada
        const { data: { text, confidence } } = await worker.recognize(processedBlob || file);
        
        console.log('Texto extraído pelo OCR:', text); // Debug
        console.log('Linhas do texto:', text.split('\n')); // Debug
        
        // Extrair dados do texto
        const extractedData = extractDataFromOCRText(text);
        
        console.log('=== DADOS EXTRAÍDOS PELO OCR ===');
        console.log('Valor:', extractedData.amount);
        console.log('Data:', extractedData.date);
        console.log('Horário:', extractedData.paymentTime);
        console.log('Remetente:', extractedData.senderName);
        console.log('Destinatário:', extractedData.receiverName);
        console.log('Banco Remetente:', extractedData.senderBank);
        console.log('Banco Destinatário:', extractedData.receiverBank);
        console.log('Método:', extractedData.paymentMethod);
        console.log('Descrição:', extractedData.description);
        console.log('Dados completos:', extractedData);
        
        // Adicionar confiança e texto original
        extractedData.confidence = confidence;
        extractedData.rawText = text; // Manter texto original para debug
        
        setOcrResults(extractedData);
        
        // Preencher campos automaticamente (sempre sobrescrever se houver dados do OCR)
        console.log('=== Preenchendo formulário com dados do OCR ===');
        console.log('Dados extraídos:', extractedData);
        
        // Usar função de callback para garantir que estamos usando o estado mais recente
        setPaymentForm(prev => {
          const updated = { ...prev };
          console.log('Estado anterior do formulário:', prev);
          
          if (extractedData.amount) {
            updated.amount = extractedData.amount;
            console.log('✅ Preenchendo valor:', extractedData.amount);
          }
          
          if (extractedData.date) {
            updated.dueDate = extractedData.date;
            // Se há comprovante escaneado, marcar como pago automaticamente
            updated.status = 'paid';
            updated.paidDate = extractedData.date;
            console.log('✅ Preenchendo data:', extractedData.date);
            console.log('✅ Pagamento marcado como PAGO automaticamente (comprovante escaneado)');
          } else {
            console.log('⚠️ Data não encontrada no OCR');
            console.log('Estado atual do dueDate:', prev.dueDate);
            // Mesmo sem data, se há comprovante, marcar como pago
            // A data de pagamento será a data atual ou a dueDate se existir
            updated.status = 'paid';
            updated.paidDate = prev.dueDate || new Date().toISOString().split('T')[0];
            console.log('✅ Pagamento marcado como PAGO automaticamente (comprovante escaneado, sem data no OCR)');
          }
          
          if (extractedData.paymentMethod) {
            updated.paymentMethod = extractedData.paymentMethod;
          }
          
          if (extractedData.description) {
            updated.description = extractedData.description;
          }
          
          if (extractedData.senderName) {
            updated.senderName = extractedData.senderName;
          }
          
          if (extractedData.receiverName) {
            updated.receiverName = extractedData.receiverName;
          }
          
          if (extractedData.paymentTime) {
            // Converter formato HH:MM:SS para HH:MM (formato do input type="time")
            const timeFormatted = extractedData.paymentTime.split(':').slice(0, 2).join(':');
            updated.paymentTime = timeFormatted;
            console.log('Preenchendo horário:', extractedData.paymentTime, '->', timeFormatted);
          }
          
          if (extractedData.senderBank) {
            updated.senderBank = extractedData.senderBank;
            console.log('Preenchendo banco remetente:', extractedData.senderBank);
          }
          
          if (extractedData.receiverBank) {
            updated.receiverBank = extractedData.receiverBank;
            console.log('Preenchendo banco destinatário:', extractedData.receiverBank);
          }
          
          console.log('Formulário atualizado:', updated);
          return updated;
        });

        // Terminar worker
        await worker.terminate();
        setIsProcessingOCR(false);
        console.log('✅ Processamento OCR concluído');
      } catch (error) {
        console.error('❌ Erro ao processar OCR:', error);
        showAlert('Erro ao processar o comprovante. Por favor, preencha os campos manualmente.', 'error');
        setIsProcessingOCR(false);
        // Limpar estados em caso de erro
        setOcrResults(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Função para corrigir erros comuns do OCR em nomes
  const correctOCRNameErrors = (name) => {
    if (!name) return name;
    
    // Correções comuns de OCR para nomes brasileiros
    const corrections = [
      // Correções de "Junior"
      { pattern: /\bJurio\b/gi, replacement: 'Junior' },
      { pattern: /\bJurior\b/gi, replacement: 'Junior' },
      { pattern: /\bJuri0\b/gi, replacement: 'Junior' },
      { pattern: /\bJuri0r\b/gi, replacement: 'Junior' },
      { pattern: /\bJunio\b/gi, replacement: 'Junior' },
      { pattern: /\bJunlor\b/gi, replacement: 'Junior' },
      
      // Correções de "Silva"
      { pattern: /\bSllva\b/gi, replacement: 'Silva' },
      { pattern: /\bSllva\b/gi, replacement: 'Silva' },
      { pattern: /\bS1lva\b/gi, replacement: 'Silva' },
      
      // Correções de "Marcio"
      { pattern: /\bMarclo\b/gi, replacement: 'Marcio' },
      { pattern: /\bMarcia\b/gi, replacement: 'Marcio' },
      { pattern: /\bMarc10\b/gi, replacement: 'Marcio' },
      
      // Correções de "Santos"
      { pattern: /\bSant0s\b/gi, replacement: 'Santos' },
      { pattern: /\bSantos\b/gi, replacement: 'Santos' },
      
      // Correções de "Oliveira"
      { pattern: /\bOliveira\b/gi, replacement: 'Oliveira' },
      { pattern: /\bOlive1ra\b/gi, replacement: 'Oliveira' },
      
      // Correções de "Souza"
      { pattern: /\bSouza\b/gi, replacement: 'Souza' },
      { pattern: /\bSou2a\b/gi, replacement: 'Souza' },
      
      // Correções de "da" (artigo)
      { pattern: /\bd0\b/gi, replacement: 'da' },
      { pattern: /\bd@\b/gi, replacement: 'da' },
      
      // Correções de "de" (artigo)
      { pattern: /\bd3\b/gi, replacement: 'de' },
      { pattern: /\bd€\b/gi, replacement: 'de' },
      
      // Correções de "dos" (artigo)
      { pattern: /\bd0s\b/gi, replacement: 'dos' },
      { pattern: /\bdos\b/gi, replacement: 'dos' },
      
      // Correções comuns de caracteres
      { pattern: /0/g, replacement: 'o' }, // Zero para 'o' (apenas em contexto de nome)
      { pattern: /1/g, replacement: 'i' }, // Um para 'i' (apenas em contexto de nome)
      { pattern: /3/g, replacement: 'e' }, // Três para 'e' (apenas em contexto de nome)
      { pattern: /5/g, replacement: 's' }, // Cinco para 's' (apenas em contexto de nome)
    ];
    
    let corrected = name;
    
    // Aplicar correções específicas primeiro (mais precisas)
    for (const correction of corrections.slice(0, -4)) { // Todas exceto as últimas 4 (substituições gerais)
      corrected = corrected.replace(correction.pattern, correction.replacement);
    }
    
    // Aplicar correções de caracteres apenas em palavras que parecem nomes
    // (não aplicar em números ou códigos)
    const words = corrected.split(/\s+/);
    const correctedWords = words.map(word => {
      // Se a palavra tem mais letras que números, aplicar correções de caracteres
      const letterCount = (word.match(/[a-zA-ZÀ-ÿ]/g) || []).length;
      const digitCount = (word.match(/\d/g) || []).length;
      
      if (letterCount > digitCount && word.length > 2) {
        let correctedWord = word;
        // Aplicar correções de caracteres apenas em contexto de nome
        correctedWord = correctedWord.replace(/0(?=[a-z])/gi, 'o');
        correctedWord = correctedWord.replace(/1(?=[a-z])/gi, 'i');
        correctedWord = correctedWord.replace(/3(?=[a-z])/gi, 'e');
        correctedWord = correctedWord.replace(/5(?=[a-z])/gi, 's');
        return correctedWord;
      }
      return word;
    });
    
    corrected = correctedWords.join(' ');
    
    // Limpar espaços extras
    corrected = corrected.replace(/\s+/g, ' ').trim();
    
    if (corrected !== name) {
      console.log(`🔧 Nome corrigido: "${name}" -> "${corrected}"`);
    }
    
    return corrected;
  };

  // Função para extrair dados do texto OCR
  const extractDataFromOCRText = (text) => {
    const result = {
      amount: null,
      date: null,
      paymentTime: null,
      paymentMethod: null,
      description: null,
      senderName: null,
      receiverName: null,
      senderBank: null,
      receiverBank: null
    };

    // Manter quebras de linha para análise linha por linha
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const normalizedText = text.toUpperCase();

    // Extrair valor monetário - analisar linha por linha para maior precisão
    let foundAmount = null;
    
    // Primeiro: procurar linha com "VALOR" seguida de R$ e número
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toUpperCase();
      const lineOriginal = lines[i];
      
      // Ignorar linhas que são claramente não-valores (CPF, conta, etc.)
      if (line.includes('CPF') || line.includes('CNPJ') || 
          line.includes('AGENCIA') || line.includes('CONTA') ||
          line.match(/^\d{11,}$/) || // Apenas números longos (CPF)
          line.match(/^\d{4,5}-\d$/)) { // Formato de conta
        continue;
      }
      
      // Padrão específico: "VALOR" seguido de R$ e número na mesma linha
      const valorMatch = line.match(/VALOR[:\s]*R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/);
      if (valorMatch) {
        const valueStr = valorMatch[1].replace(/\./g, '').replace(',', '.');
        const value = parseFloat(valueStr);
        // Validar valor razoável (entre 0.01 e 1.000.000)
        if (value >= 0.01 && value <= 1000000) {
          foundAmount = value.toFixed(2);
          console.log('Valor encontrado na linha com VALOR:', lineOriginal, '->', foundAmount);
          break;
        }
      }
      
      // Padrão alternativo: linha que contém apenas "R$" e número (sem prefixo)
      // Verificar se a linha anterior contém "VALOR"
      if (i > 0 && lines[i - 1].toUpperCase().includes('VALOR')) {
        const directValueMatch = line.match(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/);
        if (directValueMatch) {
          const valueStr = directValueMatch[1].replace(/\./g, '').replace(',', '.');
          const value = parseFloat(valueStr);
          if (value >= 0.01 && value <= 1000000) {
            foundAmount = value.toFixed(2);
            console.log('Valor encontrado na linha após VALOR:', lineOriginal, '->', foundAmount);
            break;
          }
        }
      }
      
      // Padrão: linha que começa com "R$" e tem um valor (sem outras palavras)
      const simpleValueMatch = line.match(/^R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)$/);
      if (simpleValueMatch && !foundAmount) {
        const valueStr = simpleValueMatch[1].replace(/\./g, '').replace(',', '.');
        const value = parseFloat(valueStr);
        if (value >= 0.01 && value <= 1000000) {
          foundAmount = value.toFixed(2);
          console.log('Valor encontrado em linha simples:', lineOriginal, '->', foundAmount);
        }
      }
    }

    // Se não encontrou na linha específica, procurar padrões gerais
    if (!foundAmount) {
      // Procurar por padrões R$ seguido de número
      const amountPatterns = [
        /VALOR[:\s]*R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/gi,
        /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g
      ];

      const allAmounts = [];
      for (const pattern of amountPatterns) {
        const matches = [...normalizedText.matchAll(pattern)];
        matches.forEach(match => {
          const valueStr = match[1].replace(/\./g, '').replace(',', '.');
          const value = parseFloat(valueStr);
          if (value >= 0.01 && value <= 1000000) {
            allAmounts.push(value);
          }
        });
      }

      if (allAmounts.length > 0) {
        // Se há múltiplos valores, preferir o menor que seja >= 1 (evitar centavos isolados)
        // ou o primeiro valor encontrado após "VALOR"
        const validAmounts = allAmounts.filter(a => a >= 1);
        if (validAmounts.length > 0) {
          // Pegar o menor valor válido (geralmente é o valor principal do comprovante)
          // ou o primeiro se todos forem similares
          foundAmount = Math.min(...validAmounts).toFixed(2);
        } else {
          // Se só há valores menores que 1, pegar o maior
          foundAmount = Math.max(...allAmounts).toFixed(2);
        }
      }
    }

    result.amount = foundAmount;

    // Extrair data (padrões brasileiros)
    const foundDates = [];
    
    // Padrão 1: DD/MM/YYYY ou DD-MM-YYYY
    const datePattern1 = /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/g;
    const matches1 = [...text.matchAll(datePattern1)];
    matches1.forEach(match => {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        const dateYear = date.getFullYear();
        if (dateYear >= 2020 && dateYear <= 2030) {
          foundDates.push(date);
          console.log(`📅 Data encontrada (padrão 1): ${day}/${month + 1}/${year}`);
        }
      }
    });

    // Padrão 2: "01 DEZ 2025" (formato brasileiro com mês por extenso)
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const datePattern2 = /(\d{1,2})\s+DE\s+(\w+)\s+(\d{4})/gi;
    const matches2 = [...normalizedText.matchAll(datePattern2)];
    matches2.forEach(match => {
      const day = parseInt(match[1]);
      const monthName = match[2].toUpperCase();
      const monthIndex = monthNames.findIndex(m => m === monthName);
      if (monthIndex !== -1) {
        const year = parseInt(match[3]);
        const date = new Date(year, monthIndex, day);
        if (!isNaN(date.getTime()) && year >= 2020 && year <= 2030) {
          foundDates.push(date);
        }
      }
    });

    // Padrão 3: "DATA DE EMISSÃO" seguido de data
    const datePattern3 = /DATA[:\s]*DE[:\s]*EMISSAO[:\s]*(\d{2})[\/\-](\d{2})[\/\-](\d{4})/gi;
    const matches3 = [...normalizedText.matchAll(datePattern3)];
    matches3.forEach(match => {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && year >= 2020 && year <= 2030) {
        foundDates.push(date);
      }
    });

    if (foundDates.length > 0) {
      // Usar a data mais recente (geralmente é a data do comprovante)
      const latestDate = foundDates.reduce((latest, current) => 
        current > latest ? current : latest
      );
      result.date = latestDate.toISOString().split('T')[0];
      console.log('✅ Data extraída:', result.date);
    } else {
      console.log('⚠️ Nenhuma data válida encontrada');
    }

    // Extrair horário (formato HH:MM:SS ou HH:MM)
    // Estratégia: procurar em todas as linhas e próximo a palavras-chave
    console.log('=== Iniciando extração de horário ===');
    
    // Lista de horários encontrados para escolher o melhor
    const foundTimes = [];
    
    // Procurar em cada linha
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineUpper = line.toUpperCase();
      
      // Procurar padrões de horário na linha
      const timePatterns = [
        /(\d{1,2})\s*DE\s*\w+\s*\d{4}\s*[-\s]+\s*(\d{2}):(\d{2}):(\d{2})/gi, // "01 DEZ 2025 - 16:29:31"
        /(\d{2}):(\d{2}):(\d{2})/g, // HH:MM:SS
        /(\d{2}):(\d{2})/g,          // HH:MM
        /(\d{1,2})h(\d{2})/gi,       // "23h22" (formato Inter)
        /HORA[:\s]*(\d{2}):(\d{2}):?(\d{2})?/gi,
        /HORARIO[:\s]*(\d{2}):(\d{2}):?(\d{2})?/gi,
        /HORARIO[:\s]*(\d{1,2})h(\d{2})/gi, // "Horário: 23h22"
        /[-\s]+(\d{2}):(\d{2}):(\d{2})/g, // " - 16:29:31"
      ];
      
        for (const pattern of timePatterns) {
        const matches = [...line.matchAll(pattern)];
        for (const match of matches) {
          let hours, minutes, seconds;
          
          // Verificar se é formato "HHhMM" (ex: 23h22)
          if (pattern.source.includes('h') && match.length >= 3) {
            hours = match[1].padStart(2, '0');
            minutes = match[2].padStart(2, '0');
            seconds = '00';
          }
          // Determinar qual grupo contém o horário
          else if (match.length >= 5 && match[2] && (match[2].length === 2 || match[2].length === 1)) {
            // Padrão com data e horário (grupos 2, 3, 4)
            hours = match[2].padStart(2, '0');
            minutes = match[3].padStart(2, '0');
            seconds = match[4] || '00';
          } else if (match.length >= 4 && match[1] && (match[1].length === 2 || match[1].length === 1)) {
            // Padrão direto HH:MM:SS ou HH:MM
            hours = match[1].padStart(2, '0');
            minutes = match[2].padStart(2, '0');
            seconds = match[3] || '00';
          } else {
            continue;
          }
          
          // Validar horário (0-23 horas, 0-59 minutos)
          const h = parseInt(hours);
          const m = parseInt(minutes);
          if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            const timeStr = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
            
            // Priorizar horários próximos a palavras-chave
            const priority = 
              lineUpper.includes('HORA') || lineUpper.includes('HORARIO') ? 3 :
              lineUpper.includes('DATA') && lineUpper.includes('HORA') ? 2 :
              lineUpper.includes('PIX') || lineUpper.includes('TRANSACAO') || lineUpper.includes('TRANSFERENCIA') ? 1 : 0;
            
            foundTimes.push({ time: timeStr, priority, lineIndex: i });
            console.log(`Horário encontrado na linha ${i}: ${timeStr} (prioridade: ${priority}, padrão: ${pattern.source})`);
          }
        }
      }
    }
    
    // Escolher o melhor horário (maior prioridade, ou o primeiro se todos tiverem mesma prioridade)
    if (foundTimes.length > 0) {
      foundTimes.sort((a, b) => b.priority - a.priority);
      result.paymentTime = foundTimes[0].time;
      console.log('✅ Horário selecionado:', result.paymentTime);
    } else {
      console.log('❌ Nenhum horário válido encontrado');
    }

    // Extrair método de pagamento
    if (normalizedText.includes('PIX') || 
        (normalizedText.includes('TIPO') && normalizedText.includes('TRANSFERENCIA') && normalizedText.includes('PIX'))) {
      result.paymentMethod = 'pix';
    } else if (normalizedText.includes('TED') || 
               (normalizedText.includes('TRANSFERENCIA') && !normalizedText.includes('PIX'))) {
      result.paymentMethod = 'bank_transfer';
    } else if (normalizedText.includes('CARTAO') || normalizedText.includes('CREDITO') || normalizedText.includes('DEBITO')) {
      result.paymentMethod = 'credit_card';
    } else if (normalizedText.includes('DINHEIRO')) {
      result.paymentMethod = 'cash';
    }

    // Extrair nomes (ORIGEM e DESTINO) - Versão melhorada
    let foundSender = null;
    let foundReceiver = null;
    
    console.log('=== Iniciando extração de nomes ===');
    console.log('Total de linhas:', lines.length);
    console.log('Primeiras 20 linhas:', lines.slice(0, 20));
    
    // Função auxiliar para validar se uma linha parece um nome de pessoa (não banco)
    const isValidName = (line) => {
      if (!line || line.trim().length < 3) return false;
      
      const upperLine = line.toUpperCase();
      const trimmed = line.trim();
      
      // Não pode ser só números ou símbolos
      if (trimmed.match(/^[\d\sR$.,\/\-:]+$/)) return false;
      
      // NÃO PODE ser um nome de banco ou instituição
      const bankKeywords = [
        'INSTITUICAO', 'INSTITUIÇÃO', 'BANCO', 'BANK', 'PAGAMENTOS', 
        'FINANCEIRA', 'S.A.', 'S/A', 'S.A', 'IP', 'INSTITUICAO DE PAGAMENTO',
        'NU PAGAMENTOS', 'NUBANK', 'BANCO DO BRASIL', 'ITAU', 'BRADESCO',
        'SANTANDER', 'CAIXA', 'INTER', 'BANRISUL', 'SICREDI', 'PICPAY',
        'MERCADO PAGO', 'CEF', 'BB'
      ];
      for (const keyword of bankKeywords) {
        if (upperLine.includes(keyword)) {
          console.log(`❌ Rejeitado como nome (contém ${keyword}):`, trimmed);
          return false;
        }
      }
      
      // Não pode conter palavras-chave de dados bancários
      const invalidKeywords = ['CPF', 'CNPJ', 'CONTA', 'AGENCIA', 
                               'TRANSFERENCIA', 'PIX', 'TED', 'VALOR', 'DATA', 'VENCIMENTO',
                               'ORIGEM', 'DESTINO', 'NOME', 'ID', 'TRANSACAO'];
      for (const keyword of invalidKeywords) {
        if (upperLine.includes(keyword) && !upperLine.match(new RegExp(`^${keyword}[:\s]`, 'i'))) {
          return false;
        }
      }
      
      // Deve ter pelo menos uma letra
      if (!trimmed.match(/[A-Za-zÀ-ÿ]/)) return false;
      
      // Não pode ser muito curto (menos de 3 caracteres) nem muito longo (mais de 100)
      if (trimmed.length < 3 || trimmed.length > 100) return false;
      
      // Deve parecer um nome de pessoa (geralmente tem espaços entre palavras, não só maiúsculas)
      // Nomes de bancos geralmente são tudo maiúsculas ou têm padrões específicos
      const allUpperCase = trimmed === trimmed.toUpperCase() && trimmed.length > 10;
      const hasBankPattern = /(BANCO|BANK|PAGAMENTOS|FINANCEIRA)/i.test(trimmed);
      if (allUpperCase && hasBankPattern) {
        return false;
      }
      
      return true;
    };
    
    // Estratégia 1: Procurar por seções "ORIGEM"/"QUEM PAGOU" e "DESTINO"/"QUEM RECEBEU"
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toUpperCase();
      const lineOriginal = lines[i];
      
      // Procurar por "ORIGEM" ou "QUEM PAGOU" ou "QUEM ENVIOU"
      const isOriginSection = line.includes('ORIGEM') || 
                              line.includes('QUEM PAGOU') || 
                              line.includes('QUEM ENVIOU');
      
      if (isOriginSection && !foundSender) {
        console.log(`Encontrado ORIGEM/QUEM PAGOU na linha ${i}:`, lineOriginal);
        
        // Procurar "NOME" nas próximas 8 linhas
        for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
          const searchLine = lines[j].toUpperCase();
          const searchLineOriginal = lines[j];
          
          // Se encontrou "NOME", a próxima linha geralmente tem o nome
          // IMPORTANTE: Ignorar se a linha contém "INSTITUICAO" ou "BANCO" antes
          if ((searchLine.includes('NOME') || searchLine.match(/^NOME[:\s]/)) && 
              !searchLine.includes('INSTITUICAO') && 
              !searchLine.includes('INSTITUIÇÃO') &&
              !searchLine.includes('BANCO')) {
            console.log(`Encontrado NOME na linha ${j} após ORIGEM:`, searchLineOriginal);
            
            // Tentar a linha seguinte (mas pular se for "INSTITUICAO")
            if (j + 1 < lines.length) {
              const nextLine = lines[j + 1].trim();
              const nextLineUpper = nextLine.toUpperCase();
              // Pular se a próxima linha contém "INSTITUICAO" ou "BANCO"
              if (!nextLineUpper.includes('INSTITUICAO') && 
                  !nextLineUpper.includes('INSTITUIÇÃO') &&
                  !nextLineUpper.includes('BANCO') &&
                  !nextLineUpper.includes('PAGAMENTOS')) {
                if (isValidName(nextLine)) {
                  foundSender = nextLine;
                  console.log('✅ Nome do remetente encontrado:', foundSender);
                  break;
                }
              }
            }
            
            // Tentar a mesma linha (formato "NOME: João Silva")
            const nomeMatch = searchLineOriginal.match(/NOME[:\s]+(.+)/i);
            if (nomeMatch) {
              const nameCandidate = nomeMatch[1].trim();
              if (isValidName(nameCandidate)) {
                foundSender = nameCandidate;
                console.log('✅ Nome do remetente encontrado (mesma linha):', foundSender);
                break;
              }
            }
          }
          
          // Se a linha atual parece um nome e não encontramos "NOME" ainda, pode ser o nome direto
          // MAS pular se contém palavras de banco
          if (isValidName(searchLineOriginal) && 
              !searchLine.includes('NOME') &&
              !searchLine.includes('INSTITUICAO') &&
              !searchLine.includes('INSTITUIÇÃO') &&
              !searchLine.includes('BANCO')) {
            foundSender = searchLineOriginal.trim();
            console.log('✅ Nome do remetente encontrado (direto após ORIGEM):', foundSender);
            break;
          }
        }
      }
      
      // Procurar por "DESTINO" ou "QUEM RECEBEU" ou "QUEM RECEBE"
      const isDestinationSection = line.includes('DESTINO') || 
                                   line.includes('QUEM RECEBEU') ||
                                   line.includes('QUEM RECEBE');
      
      if (isDestinationSection && !foundReceiver) {
        console.log(`Encontrado DESTINO/QUEM RECEBEU na linha ${i}:`, lineOriginal);
        
        // Procurar "NOME" nas próximas 8 linhas
        for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
          const searchLine = lines[j].toUpperCase();
          const searchLineOriginal = lines[j];
          
          // Se encontrou "NOME", a próxima linha geralmente tem o nome
          // IMPORTANTE: Ignorar se a linha contém "INSTITUICAO" ou "BANCO" antes
          if ((searchLine.includes('NOME') || searchLine.match(/^NOME[:\s]/)) && 
              !searchLine.includes('INSTITUICAO') && 
              !searchLine.includes('INSTITUIÇÃO') &&
              !searchLine.includes('BANCO')) {
            console.log(`Encontrado NOME na linha ${j} após DESTINO:`, searchLineOriginal);
            
            // Tentar a linha seguinte (mas pular se for "INSTITUICAO")
            if (j + 1 < lines.length) {
              const nextLine = lines[j + 1].trim();
              const nextLineUpper = nextLine.toUpperCase();
              // Pular se a próxima linha contém "INSTITUICAO" ou "BANCO"
              if (!nextLineUpper.includes('INSTITUICAO') && 
                  !nextLineUpper.includes('INSTITUIÇÃO') &&
                  !nextLineUpper.includes('BANCO') &&
                  !nextLineUpper.includes('PAGAMENTOS')) {
                if (isValidName(nextLine)) {
                  foundReceiver = nextLine;
                  console.log('✅ Nome do destinatário encontrado:', foundReceiver);
                  break;
                }
              }
            }
            
            // Tentar a mesma linha (formato "NOME: João Silva")
            const nomeMatch = searchLineOriginal.match(/NOME[:\s]+(.+)/i);
            if (nomeMatch) {
              const nameCandidate = nomeMatch[1].trim();
              if (isValidName(nameCandidate)) {
                foundReceiver = nameCandidate;
                console.log('✅ Nome do destinatário encontrado (mesma linha):', foundReceiver);
                break;
              }
            }
          }
          
          // Se a linha atual parece um nome e não encontramos "NOME" ainda, pode ser o nome direto
          // MAS pular se contém palavras de banco
          if (isValidName(searchLineOriginal) && 
              !searchLine.includes('NOME') &&
              !searchLine.includes('INSTITUICAO') &&
              !searchLine.includes('INSTITUIÇÃO') &&
              !searchLine.includes('BANCO')) {
            foundReceiver = searchLineOriginal.trim();
            console.log('✅ Nome do destinatário encontrado (direto após DESTINO):', foundReceiver);
            break;
          }
        }
      }
    }
    
    // Estratégia 2: Se não encontrou, procurar por padrões "NOME:" em todo o texto
    if (!foundSender || !foundReceiver) {
      console.log('=== Estratégia 2: Buscando padrões NOME: ===');
      
      let nomeCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const upperLine = line.toUpperCase();
        
        // Procurar por "NOME:" ou "NOME " seguido de texto
        // IMPORTANTE: Ignorar se a linha contém "INSTITUICAO" ou "BANCO"
        if (!upperLine.includes('INSTITUICAO') && 
            !upperLine.includes('INSTITUIÇÃO') &&
            !upperLine.includes('BANCO')) {
          const nomeMatch = line.match(/NOME[:\s]+(.+)/i);
          if (nomeMatch) {
            const nameCandidate = nomeMatch[1].trim();
            if (isValidName(nameCandidate)) {
              nomeCount++;
              console.log(`Encontrado NOME ${nomeCount} na linha ${i}:`, nameCandidate);
              
              // Verificar contexto (linhas anteriores e posteriores)
              let isOrigin = false;
              let isDestination = false;
              
              // Verificar linhas anteriores
              for (let j = Math.max(0, i - 15); j < i; j++) {
                const contextLine = lines[j].toUpperCase();
                if ((contextLine.includes('ORIGEM') || contextLine.includes('QUEM PAGOU')) && 
                    !contextLine.includes('DESTINO')) {
                  isOrigin = true;
                }
                if (contextLine.includes('DESTINO') || contextLine.includes('QUEM RECEBEU')) {
                  isDestination = true;
                }
              }
              
              // Verificar linhas posteriores (para evitar pegar nome de banco)
              let hasInstitutionAfter = false;
              for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                const nextLine = lines[j].toUpperCase();
                if (nextLine.includes('INSTITUICAO') || nextLine.includes('INSTITUIÇÃO') || 
                    nextLine.includes('BANCO') || nextLine.includes('PAGAMENTOS')) {
                  hasInstitutionAfter = true;
                  break;
                }
              }
              
              // Se tem instituição logo depois, provavelmente é nome de banco, não pessoa
              if (hasInstitutionAfter) {
                console.log(`⚠️ Ignorado (tem instituição depois):`, nameCandidate);
                continue;
              }
              
              if (isOrigin && !foundSender) {
                foundSender = nameCandidate;
                console.log('✅ Remetente encontrado por contexto:', foundSender);
              } else if (isDestination && !foundReceiver) {
                foundReceiver = nameCandidate;
                console.log('✅ Destinatário encontrado por contexto:', foundReceiver);
              } else if (!foundSender && nomeCount === 1) {
                // Primeiro nome encontrado sem contexto claro = remetente
                foundSender = nameCandidate;
                console.log('✅ Remetente assumido (primeiro nome):', foundSender);
              } else if (!foundReceiver && nomeCount === 2) {
                // Segundo nome encontrado sem contexto claro = destinatário
                foundReceiver = nameCandidate;
                console.log('✅ Destinatário assumido (segundo nome):', foundReceiver);
              }
            }
          }
        }
      }
    }
    
    console.log('=== Resultado final ===');
    console.log('Remetente (antes da correção):', foundSender);
    console.log('Destinatário (antes da correção):', foundReceiver);

    // Aplicar correções de OCR aos nomes
    if (foundSender) {
      foundSender = correctOCRNameErrors(foundSender);
    }
    if (foundReceiver) {
      foundReceiver = correctOCRNameErrors(foundReceiver);
    }

    console.log('Remetente (após correção):', foundSender);
    console.log('Destinatário (após correção):', foundReceiver);

    result.senderName = foundSender;
    result.receiverName = foundReceiver;

    // Extrair bancos (INSTITUICAO ou BANCO) de ORIGEM e DESTINO
    let foundSenderBank = null;
    let foundReceiverBank = null;

    console.log('=== Iniciando extração de bancos ===');
    
    // Lista de bancos conhecidos para busca direta (com variações)
    const knownBanks = [
      // Nubank variações
      'NU PAGAMENTOS', 'NUBANK', 'NUBANK S.A.', 'NU PAGAMENTOS - IP',
      'Nu Pagamentos', 'Nu Pagamentos - Ip', 'NUBANK S.A',
      // Banco do Brasil
      'BANCO DO BRASIL', 'BANCO DO BRASIL S.A.', 'BB',
      // Itaú
      'ITAU', 'ITAU UNIBANCO', 'ITAU UNIBANCO S.A.', 'ITAU S.A.',
      // Bradesco
      'BRADESCO', 'BANCO BRADESCO', 'BANCO BRADESCO S.A.',
      // Santander
      'SANTANDER', 'BANCO SANTANDER', 'BANCO SANTANDER BRASIL',
      // Caixa
      'CAIXA', 'CAIXA ECONOMICA FEDERAL', 'CEF', 'CAIXA ECONOMICA',
      // Outros
      'BANRISUL', 'BANCO BANRISUL',
      'SICREDI', 'BANCO SICREDI',
      'INTER', 'BANCO INTER', 'BANCO INTER S.A.', 'Banco Inter S.A.',
      'PICPAY', 'PICPAY BANCO',
      'MERCADO PAGO', 'MERCADO PAGO BANCO', 'MERCADO PAGO BANCO S.A.'
    ];

    // Função para extrair banco de uma linha
    const extractBankFromLine = (line, lineUpper) => {
      // Procurar bancos conhecidos (busca case-insensitive e flexível)
      for (const bank of knownBanks) {
        const bankUpper = bank.toUpperCase();
        // Buscar o banco na linha (case-insensitive)
        if (lineUpper.includes(bankUpper)) {
          // Extrair o nome completo do banco da linha
          // Tentar diferentes padrões de busca
          const patterns = [
            new RegExp(`(${bank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*)`, 'i'),
            new RegExp(`(${bankUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*)`, 'i'),
            new RegExp(`(${bank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\\s-]+')}[^\\n]*)`, 'i')
          ];
          
          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
              let bankName = match[1].trim();
              // Limpar sufixos
              bankName = bankName.replace(/\s*-\s*IP\s*$/i, '')
                                .replace(/\s*S\.A\.\s*$/i, '')
                                .replace(/\s*S\/A\s*$/i, '')
                                .trim();
              // Pegar apenas a primeira parte se tiver múltiplas palavras
              const parts = bankName.split(/\s+/);
              if (parts.length > 4) {
                bankName = parts.slice(0, 4).join(' ');
              }
              if (bankName.length > 2) {
                return bankName;
              }
            }
          }
        }
      }
      
      // Procurar padrão "INSTITUICAO: Nome" ou "Instituição: Nome" (com ou sem acento)
      const instMatch = line.match(/(?:INSTITUICAO|INSTITUIÇÃO|BANCO|INSTITUICAO FINANCEIRA)[:\s]+(.+)/i);
      if (instMatch) {
        let bankName = instMatch[1].trim();
        // Limpar sufixos
        bankName = bankName.replace(/\s*-\s*IP\s*$/i, '')
                          .replace(/\s*S\.A\.\s*$/i, '')
                          .replace(/\s*S\/A\s*$/i, '')
                          .trim();
        // Validar que não é apenas números ou caracteres especiais
        if (bankName.length > 3 && !bankName.match(/^[\d\s.,\/\-]+$/)) {
          return bankName;
        }
      }
      
      return null;
    };

    // Procurar por seções de origem/destino (suporta múltiplos formatos)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineUpper = line.toUpperCase();
      
      // Identificar seção de origem (remetente/quem pagou)
      const isOriginSection = lineUpper.includes('ORIGEM') || 
                              lineUpper.includes('QUEM PAGOU') || 
                              lineUpper.includes('QUEM ENVIOU');
      
      // Identificar seção de destino (destinatário/quem recebeu)
      const isDestinationSection = lineUpper.includes('DESTINO') || 
                                   lineUpper.includes('QUEM RECEBEU') ||
                                   lineUpper.includes('QUEM RECEBE');
      
      if (isOriginSection && !foundSenderBank) {
        console.log(`Encontrado seção ORIGEM/QUEM PAGOU na linha ${i}:`, line);
        
        // Procurar nas próximas 20 linhas
        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
          const searchLine = lines[j];
          const searchLineUpper = searchLine.toUpperCase();
          
          // Procurar por "INSTITUICAO" ou "Instituição" (com ou sem acento)
          const hasInstitution = searchLineUpper.includes('INSTITUICAO') || 
                                 searchLineUpper.includes('INSTITUIÇÃO') ||
                                 searchLineUpper.includes('INSTITUICAO FINANCEIRA');
          
          if (hasInstitution) {
            console.log(`Encontrado INSTITUICAO na linha ${j}:`, searchLine);
            
            // Tentar extrair da mesma linha (formato "Instituição: Nome do Banco")
            const instMatch = searchLine.match(/(?:INSTITUICAO|INSTITUIÇÃO|INSTITUICAO FINANCEIRA)[:\s]+(.+)/i);
            if (instMatch) {
              let bankName = instMatch[1].trim();
              // Limpar sufixos
              bankName = bankName.replace(/\s*-\s*IP\s*$/i, '')
                                .replace(/\s*S\.A\.\s*$/i, '')
                                .replace(/\s*S\/A\s*$/i, '')
                                .trim();
              if (bankName.length > 3 && !bankName.match(/^[\d\s.,\/\-]+$/)) {
                foundSenderBank = bankName;
                console.log(`✅ Banco do remetente encontrado na linha ${j} (mesma linha):`, foundSenderBank);
                break;
              }
            }
            
            // Tentar a linha seguinte
            if (j + 1 < lines.length) {
              const nextLine = lines[j + 1].trim();
              const nextLineUpper = nextLine.toUpperCase();
              
              // Validar que parece um nome de banco
              if (nextLine.length > 3 && 
                  !nextLine.match(/^[\d\s.,\/\-]+$/) &&
                  !nextLineUpper.includes('AGENCIA') &&
                  !nextLineUpper.includes('CONTA') &&
                  !nextLineUpper.includes('CPF') &&
                  !nextLineUpper.includes('CNPJ') &&
                  !nextLineUpper.includes('NOME') &&
                  !nextLineUpper.includes('ENDERECO')) {
                let bankName = nextLine;
                // Limpar sufixos
                bankName = bankName.replace(/\s*-\s*IP\s*$/i, '')
                                  .replace(/\s*S\.A\.\s*$/i, '')
                                  .replace(/\s*S\/A\s*$/i, '')
                                  .trim();
                foundSenderBank = bankName;
                console.log(`✅ Banco do remetente encontrado na linha ${j + 1}:`, foundSenderBank);
                break;
              }
            }
          }
          
          // Procurar banco conhecido diretamente na linha
          const bank = extractBankFromLine(searchLine, searchLineUpper);
          if (bank) {
            foundSenderBank = bank;
            console.log(`✅ Banco do remetente encontrado na linha ${j} (banco conhecido):`, foundSenderBank);
            break;
          }
        }
      }
      
      // Procurar por seção de destino
      if (isDestinationSection && !foundReceiverBank) {
        console.log(`Encontrado seção DESTINO/QUEM RECEBEU na linha ${i}:`, line);
        
        // Procurar nas próximas 20 linhas
        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
          const searchLine = lines[j];
          const searchLineUpper = searchLine.toUpperCase();
          
          // Procurar por "INSTITUICAO" ou "Instituição" (com ou sem acento)
          const hasInstitution = searchLineUpper.includes('INSTITUICAO') || 
                                 searchLineUpper.includes('INSTITUIÇÃO') ||
                                 searchLineUpper.includes('INSTITUICAO FINANCEIRA');
          
          if (hasInstitution) {
            console.log(`Encontrado INSTITUICAO na linha ${j}:`, searchLine);
            
            // Tentar extrair da mesma linha (formato "Instituição: Nome do Banco")
            const instMatch = searchLine.match(/(?:INSTITUICAO|INSTITUIÇÃO|INSTITUICAO FINANCEIRA)[:\s]+(.+)/i);
            if (instMatch) {
              let bankName = instMatch[1].trim();
              // Limpar sufixos
              bankName = bankName.replace(/\s*-\s*IP\s*$/i, '')
                                .replace(/\s*S\.A\.\s*$/i, '')
                                .replace(/\s*S\/A\s*$/i, '')
                                .trim();
              if (bankName.length > 3 && !bankName.match(/^[\d\s.,\/\-]+$/)) {
                foundReceiverBank = bankName;
                console.log(`✅ Banco do destinatário encontrado na linha ${j} (mesma linha):`, foundReceiverBank);
                break;
              }
            }
            
            // Tentar a linha seguinte
            if (j + 1 < lines.length) {
              const nextLine = lines[j + 1].trim();
              const nextLineUpper = nextLine.toUpperCase();
              
              // Validar que parece um nome de banco
              if (nextLine.length > 3 && 
                  !nextLine.match(/^[\d\s.,\/\-]+$/) &&
                  !nextLineUpper.includes('AGENCIA') &&
                  !nextLineUpper.includes('CONTA') &&
                  !nextLineUpper.includes('CPF') &&
                  !nextLineUpper.includes('CNPJ') &&
                  !nextLineUpper.includes('NOME') &&
                  !nextLineUpper.includes('ENDERECO')) {
                let bankName = nextLine;
                // Limpar sufixos
                bankName = bankName.replace(/\s*-\s*IP\s*$/i, '')
                                  .replace(/\s*S\.A\.\s*$/i, '')
                                  .replace(/\s*S\/A\s*$/i, '')
                                  .trim();
                foundReceiverBank = bankName;
                console.log(`✅ Banco do destinatário encontrado na linha ${j + 1}:`, foundReceiverBank);
                break;
              }
            }
          }
          
          // Procurar banco conhecido diretamente na linha
          const bank = extractBankFromLine(searchLine, searchLineUpper);
          if (bank) {
            foundReceiverBank = bank;
            console.log(`✅ Banco do destinatário encontrado na linha ${j} (banco conhecido):`, foundReceiverBank);
            break;
          }
        }
      }
    }

    console.log('=== Resultado final dos bancos ===');
    console.log('Banco Remetente:', foundSenderBank);
    console.log('Banco Destinatário:', foundReceiverBank);
    console.log('Total de linhas analisadas:', lines.length);
    console.log('Primeiras 10 linhas do texto:', lines.slice(0, 10));

    result.senderBank = foundSenderBank;
    result.receiverBank = foundReceiverBank;
    
    // Log final de todos os dados extraídos
    console.log('=== RESUMO FINAL DOS DADOS EXTRAÍDOS ===');
    console.log('Valor:', result.amount);
    console.log('Data:', result.date);
    console.log('Horário:', result.paymentTime);
    console.log('Remetente:', result.senderName);
    console.log('Destinatário:', result.receiverName);
    console.log('Banco Remetente:', result.senderBank);
    console.log('Banco Destinatário:', result.receiverBank);
    console.log('Método de Pagamento:', result.paymentMethod);

    // Extrair descrição
    if (normalizedText.includes('COMPROVANTE')) {
      if (normalizedText.includes('TRANSFERENCIA')) {
        result.description = 'Comprovante de transferência';
      } else if (normalizedText.includes('PAGAMENTO')) {
        result.description = 'Comprovante de pagamento';
      } else {
        result.description = 'Comprovante';
      }
    } else {
      // Pegar primeira linha relevante que não seja dados bancários
      const relevantLines = lines
        .filter(line => {
          const upperLine = line.toUpperCase();
          return !upperLine.includes('BANCO') && 
                 !upperLine.includes('AGENCIA') && 
                 !upperLine.includes('CONTA') &&
                 !upperLine.includes('CPF') &&
                 !upperLine.includes('INSTITUICAO') &&
                 !upperLine.match(/^[\d\sR$.,\/\-]+$/) && // Não é só números e símbolos
                 line.trim().length > 5;
        })
        .slice(0, 1);
      
      if (relevantLines.length > 0) {
        result.description = relevantLines[0].substring(0, 100);
      }
    }

    return result;
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      showAlert('Por favor, selecione uma imagem válida', 'error');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('A imagem deve ter no máximo 5MB', 'error');
      return;
    }

    // Limpar resultados anteriores e resetar campos relacionados ao OCR
    // mas manter outros campos do formulário (como clientId, status, paidDate)
    setOcrResults(null);
    setPaymentForm(prev => ({
      ...prev,
      amount: '',
      dueDate: '',
      paymentTime: '',
      description: '',
      senderName: '',
      receiverName: '',
      senderBank: '',
      receiverBank: '',
      // Não limpar status e paidDate aqui, pois o OCR pode marcar como pago automaticamente
    }));
    
    console.log('🔄 Nova imagem selecionada - campos do OCR limpos');
    
    processReceiptOCR(file);
  };

  const handleMarkPaymentAsPaid = (id) => {
    setPayments(payments.map(p => 
      p.id === id 
        ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : p
    ));
  };

  const handleDeletePayment = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir este pagamento?',
      () => setPayments(payments.filter(p => p.id !== id)),
      'Confirmar Exclusão',
      'confirm'
    );
  };

  // Funções de Documentos
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newDocument = {
        id: documents.length + 1,
        clientId: selectedClient ? selectedClient.id : parseInt(demandForm.clientId) || 1,
        demandId: demandForm.clientId ? demands.find(d => d.clientId === parseInt(demandForm.clientId))?.id : null,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        content: event.target.result,
        category: 'other'
      };

      setDocuments([...documents, newDocument]);
    };
    reader.readAsDataURL(file);
  };

  const handleEditDocument = (doc) => {
    setEditingDocument(doc);
    setShowDocumentModal(true);
  };

  const handleSaveDocument = () => {
    if (!editingDocument) return;

    setDocuments(documents.map(d => 
      d.id === editingDocument.id 
        ? { ...d, content: editingDocument.content, name: editingDocument.name }
        : d
    ));
    setEditingDocument(null);
    setShowDocumentModal(false);
  };

  const handleDeleteDocument = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir este documento?',
      () => setDocuments(documents.filter(d => d.id !== id)),
      'Confirmar Exclusão',
      'confirm'
    );
  };

  const handleSendDocument = (doc) => {
    const client = clients.find(c => c.id === doc.clientId);
    if (client) {
      showAlert(`Documento "${doc.name}" enviado para ${client.email}`, 'success');
    }
  };

  // Funções de Serviços
  const handleAddService = () => {
    if (!serviceForm.name || !serviceForm.price) {
      showAlert('Nome e preço são obrigatórios', 'error');
      return;
    }

    const newService = {
      id: services.length + 1,
      ...serviceForm,
      price: parseFloat(serviceForm.price),
      active: serviceForm.active
    };

    setServices([...services, newService]);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      category: 'branding',
      duration: '',
      active: true
    });
    setShowServiceModal(false);
  };

  const handleEditService = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
      duration: service.duration,
      active: service.active
    });
    setSelectedClient(service);
    setShowServiceModal(true);
  };

  const handleUpdateService = () => {
    if (!serviceForm.name || !serviceForm.price) {
      showAlert('Nome e preço são obrigatórios', 'error');
      return;
    }

    setServices(services.map(s => 
      s.id === selectedClient.id 
        ? { 
            ...s, 
            ...serviceForm, 
            price: parseFloat(serviceForm.price),
            active: serviceForm.active
          }
        : s
    ));
    setShowServiceModal(false);
    setSelectedClient(null);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      category: 'branding',
      duration: '',
      active: true
    });
  };

  const handleDeleteService = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir este serviço?',
      () => setServices(services.filter(s => s.id !== id)),
      'Confirmar Exclusão',
      'confirm'
    );
  };

  // Funções de Follow Through - Modelos
  const handleAddFollowThroughModel = () => {
    if (!followThroughModelForm.name || followThroughModelForm.questions.length === 0) {
      showAlert('Nome do modelo e pelo menos uma pergunta são obrigatórios', 'error');
      return;
    }

    // Validar que todas as perguntas têm texto
    const hasEmptyQuestions = followThroughModelForm.questions.some(q => !q.question.trim());
    if (hasEmptyQuestions) {
      showAlert('Todas as perguntas devem ter texto', 'error');
      return;
    }

    if (editingFollowThroughModel) {
      // Atualizar modelo existente
      const updated = {
        ...editingFollowThroughModel,
        name: followThroughModelForm.name,
        questions: followThroughModelForm.questions
      };
      setFollowThroughModels(followThroughModels.map(m => m.id === editingFollowThroughModel.id ? updated : m));
      setEditingFollowThroughModel(null);
      showAlert('Modelo atualizado com sucesso!', 'success');
    } else {
      // Criar novo modelo
      const newModel = {
        id: followThroughModels.length + 1,
        name: followThroughModelForm.name,
        questions: followThroughModelForm.questions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          required: q.required
        })),
        createdAt: new Date().toISOString().split('T')[0]
      };

      setFollowThroughModels([...followThroughModels, newModel]);
      showAlert('Modelo criado com sucesso!', 'success');
    }

    setFollowThroughModelForm({
      name: '',
      questions: [{ id: 1, question: '', required: true }]
    });
    setShowFollowThroughModelModal(false);
  };

  const handleEditFollowThroughModel = (model) => {
    setEditingFollowThroughModel(model);
    setFollowThroughModelForm({
      name: model.name,
      questions: model.questions.map(q => ({ ...q }))
    });
    setShowFollowThroughModelModal(true);
  };

  const handleDeleteFollowThroughModel = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir este modelo? Isso não afetará os follow throughs já criados.',
      () => setFollowThroughModels(followThroughModels.filter(m => m.id !== id)),
      'Confirmar Exclusão',
      'confirm'
    );
  };

  const handleAddQuestion = () => {
    const newId = Math.max(...followThroughModelForm.questions.map(q => q.id), 0) + 1;
    setFollowThroughModelForm({
      ...followThroughModelForm,
      questions: [...followThroughModelForm.questions, { id: newId, question: '', required: false }]
    });
  };

  const handleRemoveQuestion = (questionId) => {
    if (followThroughModelForm.questions.length === 1) {
      showAlert('O modelo deve ter pelo menos uma pergunta', 'error');
      return;
    }
    setFollowThroughModelForm({
      ...followThroughModelForm,
      questions: followThroughModelForm.questions.filter(q => q.id !== questionId)
    });
  };

  const handleUpdateQuestion = (questionId, field, value) => {
    setFollowThroughModelForm({
      ...followThroughModelForm,
      questions: followThroughModelForm.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  // Funções de Follow Through - Instâncias
  const generateBriefingUrl = () => {
    // Gerar URL mock única
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let url = '';
    for (let i = 0; i < 12; i++) {
      url += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `https://marcbuddy.com/briefing/${url}`;
  };

  const handleCreateFollowThroughForClient = (clientId, modelId) => {
    const model = followThroughModels.find(m => m.id === modelId);
    if (!model) {
      showAlert('Modelo não encontrado', 'error');
      return;
    }

    const briefingUrl = generateBriefingUrl();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    const newFollowThrough = {
      id: followThroughs.length + 1,
      clientId: parseInt(clientId),
      modelId: parseInt(modelId),
      briefingUrl,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: null,
      expiresAt: expiresAt.toISOString().split('T')[0],
      answers: null
    };

    setFollowThroughs([...followThroughs, newFollowThrough]);
    showAlert('Follow Through criado com sucesso!', 'success');
  };

  const handleEditFollowThrough = (followThrough) => {
    setEditingFollowThrough(followThrough);
    setShowFollowThroughModal(true);
  };

  const handleDeleteFollowThrough = (id) => {
    showConfirm(
      'Tem certeza que deseja excluir este Follow Through?',
      () => setFollowThroughs(followThroughs.filter(ft => ft.id !== id)),
      'Confirmar Exclusão',
      'confirm'
    );
  };

  const handleCopyBriefingUrl = (url) => {
    navigator.clipboard.writeText(url);
    showAlert('URL copiada para a área de transferência!', 'success');
  };

  const handleMarkBriefingAsCompleted = (id) => {
    setFollowThroughs(followThroughs.map(ft => 
      ft.id === id 
        ? { ...ft, status: 'completed', completedAt: new Date().toISOString().split('T')[0] }
        : ft
    ));
    showAlert('Briefing marcado como concluído!', 'success');
  };

  const handleMoveService = (id, direction) => {
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return;

    const newServices = [...services];
    if (direction === 'up' && index > 0) {
      [newServices[index - 1], newServices[index]] = [newServices[index], newServices[index - 1]];
    } else if (direction === 'down' && index < newServices.length - 1) {
      [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
    }
    setServices(newServices);
  };

  // Filtros e busca
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getClientDemands = (clientId) => {
    return demands.filter(d => d.clientId === clientId);
  };

  const getClientPayments = (clientId) => {
    return payments.filter(p => p.clientId === clientId);
  };

  const getClientDocuments = (clientId) => {
    return documents.filter(d => d.clientId === clientId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'completed':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Funções do Calendário
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Dias do mês anterior para preencher a primeira semana
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events = [];
    
    // Demandas com vencimento
    demands.forEach(demand => {
      if (demand.dueDate === dateStr) {
        const client = clients.find(c => c.id === demand.clientId);
        events.push({
          type: 'demand',
          id: demand.id,
          title: demand.title,
          client: client?.name,
          status: demand.status,
          priority: demand.priority,
          time: null
        });
      }
    });
    
    // Pagamentos com vencimento
    payments.forEach(payment => {
      if (payment.dueDate === dateStr) {
        const client = clients.find(c => c.id === payment.clientId);
        events.push({
          type: 'payment',
          id: payment.id,
          title: payment.description || 'Pagamento',
          client: client?.name,
          amount: payment.amount,
          status: payment.status,
          time: null
        });
      }
    });
    
    return events;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  // Atualizar timer em tempo real
  useEffect(() => {
    if (activeTimer && timerStart) {
      const interval = setInterval(() => {
        const elapsed = new Date() - new Date(timerStart);
        const hours = Math.floor(elapsed / 1000 / 60 / 60);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const seconds = Math.floor((elapsed / 1000) % 60);
        setTimerDisplay({ hours, minutes, seconds });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimerDisplay(null);
    }
  }, [activeTimer, timerStart]);

  // Limpar estados do OCR quando o modal de pagamento é aberto
  useEffect(() => {
    if (showPaymentModal && !editingPayment) {
      // Limpar estados do OCR ao abrir o modal apenas se não estiver editando
      setReceiptImage(null);
      setReceiptPreview(null);
      setOcrResults(null);
      setIsProcessingOCR(false);
      console.log('🔄 Modal de pagamento aberto - estados do OCR limpos');
    }
  }, [showPaymentModal, editingPayment]);

  return (
    <div className={`bg-gray-50 ${isFullscreen ? 'h-screen' : 'min-h-[600px]'} flex flex-col`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 font-poppins">MClients</h1>
            <p className="text-sm text-gray-500 font-poppins">Gestão completa de clientes e projetos</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-poppins mb-1">Clientes</div>
              <div className="text-xl font-semibold text-gray-900 font-poppins">{clients.length}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 font-poppins mb-1">Demandas</div>
              <div className="text-xl font-semibold text-gray-900 font-poppins">
                {demands.filter(d => d.status === 'in_progress' || d.status === 'pending').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 font-poppins mb-1">Pendentes</div>
              <div className="text-xl font-semibold text-gray-900 font-poppins">
                {payments.filter(p => p.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-1 px-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'clients', name: 'Clientes', icon: Users },
            { id: 'demands', name: 'Demandas', icon: Briefcase },
            { id: 'pipeline', name: 'Pipeline', icon: Kanban },
            { id: 'tasks', name: 'Tarefas', icon: CheckSquare },
            { id: 'payments', name: 'Pagamentos', icon: DollarSign },
            { id: 'documents', name: 'Documentos', icon: FileText },
            { id: 'services', name: 'Serviços', icon: Tag },
            { id: 'calendar', name: 'Calendário', icon: CalendarIcon },
            { id: 'followthrough', name: 'Follow Through', icon: LinkIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors font-poppins ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 font-poppins">Dashboard</h2>
            
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 font-poppins">Receita Total</span>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
                  R$ {payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toFixed(2).replace('.', ',')}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-poppins">Este mês</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 font-poppins">Pendente</span>
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
                  R$ {payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2).replace('.', ',')}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-poppins">{payments.filter(p => p.status === 'pending').length} pagamentos</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 font-poppins">Horas Trabalhadas</span>
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
                  {timeEntries.reduce((sum, t) => sum + t.hours, 0).toFixed(1)}h
                </div>
                <div className="text-xs text-gray-500 mt-1 font-poppins">Este mês</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 font-poppins">Taxa de Conclusão</span>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
                  {demands.length > 0 ? Math.round((demands.filter(d => d.status === 'completed').length / demands.length) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1 font-poppins">{demands.filter(d => d.status === 'completed').length} de {demands.length}</div>
              </div>
            </div>

            {/* Gráficos e Listas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Demandas por Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-poppins">Demandas por Status</h3>
                <div className="space-y-3">
                  {['pending', 'in_progress', 'completed', 'cancelled'].map(status => {
                    const count = demands.filter(d => d.status === status).length;
                    const percentage = demands.length > 0 ? (count / demands.length) * 100 : 0;
                    const statusLabels = {
                      pending: 'Pendente',
                      in_progress: 'Em Andamento',
                      completed: 'Concluída',
                      cancelled: 'Cancelada'
                    };
                    return (
                      <div 
                        key={status}
                        onClick={() => {
                          setActiveTab('pipeline');
                          setDemandView('kanban');
                          // Scroll para a coluna específica após um pequeno delay
                          setTimeout(() => {
                            const column = document.querySelector(`[data-status="${status}"]`);
                            if (column) {
                              column.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                              // Destacar a coluna
                              column.style.transform = 'scale(1.02)';
                              column.style.transition = 'transform 0.3s';
                              setTimeout(() => {
                                column.style.transform = 'scale(1)';
                              }, 500);
                            }
                          }, 100);
                        }}
                        className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors -m-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 font-poppins">
                            {statusLabels[status]}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 font-poppins">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              status === 'pending' ? 'bg-yellow-500' : 
                              status === 'in_progress' ? 'bg-blue-500' : 
                              status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Atividades Recentes */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-poppins">Atividades Recentes</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activities.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <History className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-poppins">{activity.description}</p>
                        <p className="text-xs text-gray-500 font-poppins">
                          {new Date(activity.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Origem dos Leads */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-poppins">Origem dos Leads</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {['instagram', 'facebook', 'indicacao', 'site', 'outro'].map(source => {
                  const count = clients.filter(c => c.leadSource === source).length;
                  const sourceClients = clients.filter(c => c.leadSource === source);
                  return (
                    <div 
                      key={source} 
                      onClick={() => {
                        setActiveTab('clients');
                        setFilterStatus('all');
                        setSearchTerm(source);
                      }}
                      className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins">{count}</div>
                      <div className="text-sm text-gray-600 font-poppins capitalize mt-1">
                        {source === 'indicacao' ? 'Indicação' : source.charAt(0).toUpperCase() + source.slice(1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Clientes Tab */}
        {activeTab === 'clients' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <div className="flex items-center gap-3 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700 placeholder-gray-400"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedClient(null);
                  setClientForm({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    address: '',
                    notes: ''
                  });
                  setShowClientModal(true);
                }}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Novo Cliente
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredClients.map(client => (
                <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-3 sm:mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 font-poppins mb-1 truncate">{client.name}</h3>
                      {client.company && (
                        <p className="text-xs sm:text-sm text-gray-500 font-poppins truncate">{client.company}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(client.status)} font-poppins`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="font-poppins truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-poppins">{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-poppins line-clamp-1">{client.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setDemandForm({
                            clientId: client.id.toString(),
                            title: '',
                            description: '',
                            status: 'pending',
                            priority: 'medium',
                            dueDate: ''
                          });
                          setShowDemandModal(true);
                        }}
                        className="flex-1 bg-brand-green text-white px-3 py-2 rounded text-xs sm:text-sm font-medium hover:bg-brand-green-500 transition-colors font-poppins flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Nova Demanda
                      </button>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors font-poppins"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-gray-400 hover:text-red-500 px-2 sm:px-3 py-2 rounded text-xs sm:text-sm transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 sm:mb-2">
                      <span className="font-poppins">Demandas</span>
                      <span className="font-medium text-gray-900 font-poppins">{getClientDemands(client.id).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 sm:mb-2">
                      <span className="font-poppins">Pagamentos</span>
                      <span className="font-medium text-gray-900 font-poppins">{getClientPayments(client.id).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-poppins">Documentos</span>
                      <span className="font-medium text-gray-900 font-poppins">{getClientDocuments(client.id).length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demandas Tab */}
        {activeTab === 'demands' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Demandas</h2>
              <button
                onClick={() => {
                  setDemandForm({
                    clientId: '',
                    title: '',
                    description: '',
                    status: 'pending',
                    priority: 'medium',
                    dueDate: ''
                  });
                  setShowDemandModal(true);
                }}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Nova Demanda
              </button>
            </div>

            <div className="space-y-3">
              {demands.map(demand => {
                const client = clients.find(c => c.id === demand.clientId);
                return (
                  <div key={demand.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900 font-poppins">{demand.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(demand.status)} font-poppins`}>
                            {demand.status === 'pending' ? 'Pendente' : demand.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                            {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 font-poppins">{demand.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-poppins">{client?.name}</span>
                          {demand.dueDate && (
                            <span className="font-poppins flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <select
                          value={demand.status}
                          onChange={(e) => handleUpdateDemandStatus(demand.id, e.target.value)}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700"
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="completed">Concluída</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                        <button
                          onClick={() => handleDeleteDemand(demand.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pipeline/Kanban Tab */}
        {activeTab === 'pipeline' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-poppins">Pipeline de Demandas</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemandView('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    demandView === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDemandView('kanban')}
                  className={`p-2 rounded-lg transition-colors ${
                    demandView === 'kanban' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                </button>
              </div>
            </div>

            {demandView === 'kanban' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {['pending', 'in_progress', 'completed', 'cancelled'].map(status => {
                  const statusDemands = demands.filter(d => d.status === status);
                  const statusLabels = {
                    pending: 'Pendente',
                    in_progress: 'Em Andamento',
                    completed: 'Concluída',
                    cancelled: 'Cancelada'
                  };
                  const statusColors = {
                    pending: 'bg-yellow-50 border-yellow-200',
                    in_progress: 'bg-blue-50 border-blue-200',
                    completed: 'bg-green-50 border-green-200',
                    cancelled: 'bg-red-50 border-red-200'
                  };
                  
                  return (
                    <div key={status} data-status={status} className={`border-2 rounded-lg p-3 sm:p-4 ${statusColors[status]}`}>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="font-semibold text-gray-900 font-poppins text-sm sm:text-base">{statusLabels[status]}</h3>
                        <span className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700 font-poppins">
                          {statusDemands.length}
                        </span>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {statusDemands.map(demand => {
                          const client = clients.find(c => c.id === demand.clientId);
                          return (
                            <div
                              key={demand.id}
                              onClick={() => {
                                setSelectedDemand(demand);
                                setActiveTab('demands');
                              }}
                              className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 cursor-pointer hover:shadow-md transition-shadow"
                            >
                              <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 font-poppins">{demand.title}</h4>
                              <p className="text-xs text-gray-600 mb-2 font-poppins">{client?.name}</p>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                                  {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                                {demand.dueDate && (
                                  <span className="text-xs text-gray-500 font-poppins">
                                    {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
            <div className="space-y-3">
              {demands.map(demand => {
                const client = clients.find(c => c.id === demand.clientId);
                const demandTasks = tasks.filter(t => t.demandId === demand.id);
                const demandComments = comments.filter(c => c.demandId === demand.id);
                const demandTimeEntries = timeEntries.filter(t => t.demandId === demand.id);
                const totalHours = demandTimeEntries.reduce((sum, t) => sum + t.hours, 0);
                
                return (
                  <div 
                    key={demand.id} 
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 
                            className="text-base font-semibold text-gray-900 font-poppins cursor-pointer hover:text-gray-600"
                            onClick={() => {
                              setSelectedDemand(demand);
                            }}
                          >
                            {demand.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(demand.status)} font-poppins`}>
                            {demand.status === 'pending' ? 'Pendente' : demand.status === 'in_progress' ? 'Em Andamento' : demand.status === 'completed' ? 'Concluída' : 'Cancelada'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                            {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 font-poppins">{demand.description}</p>
                        
                        {/* Informações adicionais */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="font-poppins flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {client?.name}
                          </span>
                          {demand.dueDate && (
                            <span className="font-poppins flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          {demandTasks.length > 0 && (
                            <span className="font-poppins flex items-center gap-1">
                              <CheckSquare className="w-3.5 h-3.5" />
                              {demandTasks.filter(t => t.completed).length}/{demandTasks.length} tarefas
                            </span>
                          )}
                          {demandComments.length > 0 && (
                            <span className="font-poppins flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {demandComments.length} comentários
                            </span>
                          )}
                          {totalHours > 0 && (
                            <span className="font-poppins flex items-center gap-1">
                              <Timer className="w-3.5 h-3.5" />
                              {totalHours.toFixed(1)}h
                            </span>
                          )}
                        </div>

                        {/* Ações rápidas */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setShowTaskModal(true);
                              setDemandForm({ ...demandForm, clientId: demand.clientId.toString() });
                              // Criar tarefa vinculada
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors font-poppins flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Tarefa
                          </button>
                          <button
                            onClick={() => {
                              setShowCommentModal(true);
                              setSelectedDemand(demand);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors font-poppins flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Comentar
                          </button>
                          <button
                            onClick={() => {
                              setShowTimeTrackingModal(true);
                              setSelectedDemand(demand);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors font-poppins flex items-center gap-1"
                          >
                            <Timer className="w-3 h-3" />
                            Registrar Tempo
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <select
                          value={demand.status}
                          onChange={(e) => handleUpdateDemandStatus(demand.id, e.target.value)}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700"
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="completed">Concluída</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                        <button
                          onClick={() => handleDeleteDemand(demand.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* Tarefas Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Tarefas</h2>
              <button
                onClick={() => {
                  setShowTaskModal(true);
                }}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Nova Tarefa
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map(task => {
                const demand = demands.find(d => d.id === task.demandId);
                const client = demand ? clients.find(c => c.id === demand.clientId) : null;
                return (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => {
                          setTasks(tasks.map(t => 
                            t.id === task.id ? { ...t, completed: !t.completed } : t
                          ));
                        }}
                        className="mt-1"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-green-500" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-base font-semibold font-poppins ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)} font-poppins`}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          {demand && (
                            <span className="font-poppins">Demanda: {demand.title}</span>
                          )}
                          {client && (
                            <span className="font-poppins">Cliente: {client.name}</span>
                          )}
                          {task.dueDate && (
                            <span className="font-poppins flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setTasks(tasks.filter(t => t.id !== task.id));
                        }}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagamentos Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Pagamentos</h2>
              <button
                onClick={() => {
                  setEditingPayment(null);
                  setPaymentForm({
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
                  setReceiptImage(null);
                  setReceiptPreview(null);
                  setOcrResults(null);
                  setShowPaymentModal(true);
                }}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Novo Pagamento
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Cliente</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Descrição</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Valor</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Vencimento</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Comprovante</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => {
                    const client = clients.find(c => c.id === payment.clientId);
                    return (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900 font-poppins">{client?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{payment.description}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 font-poppins">
                          R$ {payment.amount.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 font-poppins">
                          {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(payment.status)} font-poppins`}>
                            {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {payment.receiptImage ? (
                            <span className="text-xs text-green-600 font-poppins flex items-center gap-1">
                              <FileImage className="w-3.5 h-3.5" />
                              Enviado
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 font-poppins">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {payment.receiptImage && (
                              <button
                                onClick={() => setViewingReceipt(payment.receiptImage)}
                                className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                                title="Ver comprovante"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {payment.status === 'pending' && (
                              <button
                                onClick={() => handleMarkPaymentAsPaid(payment.id)}
                                className="text-xs text-gray-600 hover:text-green-600 px-2 py-1 rounded transition-colors font-poppins"
                              >
                                Marcar como Pago
                              </button>
                            )}
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                              title="Editar pagamento"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                              title="Excluir pagamento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Documentos Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Documentos</h2>
              <label className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer font-poppins">
                <Upload className="w-4 h-4" />
                Upload Documento
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => {
                const client = clients.find(c => c.id === doc.clientId);
                return (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 font-poppins truncate text-sm">{doc.name}</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-poppins mb-1">{client?.name}</p>
                        <p className="text-xs text-gray-400 font-poppins">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEditDocument(doc)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors font-poppins"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleSendDocument(doc)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                        title="Enviar"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Serviços Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-xl font-semibold text-gray-900 font-poppins">Serviços</h2>
              <button
                onClick={() => {
                  setServiceForm({
                    name: '',
                    description: '',
                    price: '',
                    category: 'branding',
                    duration: '',
                    active: true
                  });
                  setSelectedClient(null);
                  setShowServiceModal(true);
                }}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Novo Serviço
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins w-12"></th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Nome</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Descrição</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Categoria</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Preço</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Duração</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveService(service.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveService(service.id, 'down')}
                            disabled={index === services.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 font-poppins">{service.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{service.description}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 font-poppins">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 font-poppins">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{service.duration}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${service.active ? getStatusColor('active') : getStatusColor('cancelled')} font-poppins`}>
                          {service.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendário Tab */}
        {activeTab === 'calendar' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-xl font-semibold text-gray-900 font-poppins">Calendário</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header do Calendário */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
                >
                  Hoje
                </button>
              </div>

              {/* Grid do Calendário */}
              <div className="p-6">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Dias do mês */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((dayObj, index) => {
                    const events = getEventsForDate(dayObj.date);
                    const isToday = dayObj.date.toDateString() === new Date().toDateString();
                    const dateStr = dayObj.date.toISOString().split('T')[0];
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] border border-gray-200 p-2 relative group ${
                          dayObj.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${isToday ? 'ring-2 ring-gray-400' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className={`text-sm font-medium font-poppins ${
                            dayObj.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          } ${isToday ? 'text-gray-900 font-semibold' : ''}`}>
                            {dayObj.date.getDate()}
                          </div>
                          {dayObj.isCurrentMonth && (
                            <button
                              onClick={() => {
                                setDemandForm({
                                  clientId: '',
                                  title: '',
                                  description: '',
                                  status: 'pending',
                                  priority: 'medium',
                                  dueDate: dateStr
                                });
                                setShowDemandModal(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                              title="Adicionar demanda nesta data"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-1">
                          {events.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              onClick={() => {
                                if (event.type === 'demand') {
                                  const demand = demands.find(d => d.id === event.id);
                                  if (demand) {
                                    setSelectedDemand(demand);
                                    setActiveTab('demands');
                                  }
                                } else if (event.type === 'payment') {
                                  setActiveTab('payments');
                                }
                              }}
                              className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity font-poppins ${
                                event.type === 'demand'
                                  ? event.priority === 'high'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : event.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : event.status === 'paid'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              }`}
                              title={`${event.title} - ${event.client} (Clique para ver detalhes)`}
                            >
                              {event.type === 'payment' && event.status === 'pending' && '💰 '}
                              {event.type === 'demand' && '📋 '}
                              {event.title}
                            </div>
                          ))}
                          {events.length > 3 && (
                            <div 
                              onClick={() => {
                                // Mostrar modal com todos os eventos do dia
                                const eventsList = events.map(e => `• ${e.title}`).join('\n');
                                showAlert(`${events.length} eventos neste dia:\n\n${eventsList}`, 'info', 'Eventos do Dia');
                              }}
                              className="text-xs text-gray-500 font-poppins px-1.5 cursor-pointer hover:text-gray-700"
                            >
                              +{events.length - 3} mais
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 font-poppins">Legenda</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
                  <span className="text-xs text-gray-600 font-poppins">Demanda Alta Prioridade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
                  <span className="text-xs text-gray-600 font-poppins">Demanda Média Prioridade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
                  <span className="text-xs text-gray-600 font-poppins">Demanda Baixa Prioridade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></div>
                  <span className="text-xs text-gray-600 font-poppins">Pagamento Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                  <span className="text-xs text-gray-600 font-poppins">Pagamento Pago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow Through Tab */}
        {activeTab === 'followthrough' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Modelos de Follow Through</h2>
              <button
                onClick={() => {
                  setEditingFollowThroughModel(null);
                  setFollowThroughModelForm({
                    name: '',
                    questions: [{ id: 1, question: '', required: true }]
                  });
                  setShowFollowThroughModelModal(true);
                }}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Novo Modelo
              </button>
            </div>

            {/* Lista de Modelos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {followThroughModels.map(model => (
                <div key={model.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 font-poppins text-lg mb-2">{model.name}</h3>
                      <p className="text-xs text-gray-500 font-poppins">
                        {model.questions.length} {model.questions.length === 1 ? 'pergunta' : 'perguntas'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {model.questions.map((q, index) => (
                      <div key={q.id} className="text-xs text-gray-600 font-poppins flex items-start gap-2">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{q.question}</span>
                        {q.required && <span className="text-red-500">*</span>}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditFollowThroughModel(model)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors font-poppins"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteFollowThroughModel(model.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {followThroughModels.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg mb-8">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-poppins">Nenhum modelo criado ainda</p>
              </div>
            )}

            {/* Lista de Follow Throughs Ativos */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">Follow Throughs Ativos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followThroughs.map(ft => {
                  const client = clients.find(c => c.id === ft.clientId);
                  const model = followThroughModels.find(m => m.id === ft.modelId);
                  const isExpired = new Date(ft.expiresAt) < new Date() && ft.status === 'pending';
                  const statusColor = ft.status === 'completed' 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : isExpired
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200';
                  
                  return (
                    <div key={ft.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 font-poppins text-lg mb-1">{client?.name || 'Cliente não encontrado'}</h3>
                          <p className="text-sm text-gray-600 font-poppins mb-2">{model?.name || 'Modelo não encontrado'}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${statusColor} font-poppins`}>
                            {ft.status === 'completed' ? 'Concluído' : isExpired ? 'Expirado' : 'Pendente'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 font-poppins block mb-1">URL do Briefing</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={ft.briefingUrl}
                              readOnly
                              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 font-poppins"
                            />
                            <button
                              onClick={() => handleCopyBriefingUrl(ft.briefingUrl)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copiar URL"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 font-poppins block mb-1">Criado em</label>
                          <p className="text-xs text-gray-600 font-poppins">
                            {new Date(ft.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        {ft.status === 'pending' && !isExpired && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 font-poppins block mb-1">Expira em</label>
                            <p className="text-xs text-gray-600 font-poppins">
                              {new Date(ft.expiresAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}

                        {ft.status === 'completed' && ft.completedAt && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 font-poppins block mb-1">Concluído em</label>
                            <p className="text-xs text-gray-600 font-poppins">
                              {new Date(ft.completedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        {ft.status === 'pending' && !isExpired && (
                          <button
                            onClick={() => handleMarkBriefingAsCompleted(ft.id)}
                            className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-200 transition-colors font-poppins"
                          >
                            Marcar como Concluído
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteFollowThrough(ft.id)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {followThroughs.length === 0 && (
                <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-500 font-poppins">Nenhum Follow Through ativo</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Cliente */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                {selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button
                onClick={() => {
                  setShowClientModal(false);
                  setSelectedClient(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Nome *</label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Email *</label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Telefone</label>
                <input
                  type="text"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Empresa</label>
                <input
                  type="text"
                  value={clientForm.company}
                  onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                  placeholder="Nome da empresa"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Endereço</label>
                <input
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  placeholder="Endereço completo"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Observações</label>
                <textarea
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  placeholder="Observações sobre o cliente..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400 resize-none"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Origem do Lead</label>
                  <select
                    value={clientForm.leadSource}
                    onChange={(e) => setClientForm({ ...clientForm, leadSource: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900"
                  >
                    <option value="">Selecione...</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="indicacao">Indicação</option>
                    <option value="site">Site</option>
                    <option value="google">Google Ads</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Detalhes da Origem</label>
                  <input
                    type="text"
                    value={clientForm.leadSourceDetails}
                    onChange={(e) => setClientForm({ ...clientForm, leadSourceDetails: e.target.value })}
                    placeholder="Ex: Anúncio patrocinado, Post orgânico..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowClientModal(false);
                  setSelectedClient(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={selectedClient ? handleUpdateClient : handleAddClient}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
              >
                {selectedClient ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Demanda */}
      {showDemandModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 font-poppins">Nova Demanda</h2>
              <button
                onClick={() => setShowDemandModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Select
                label="Cliente *"
                value={demandForm.clientId}
                onChange={(e) => setDemandForm({ ...demandForm, clientId: e.target.value })}
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </Select>
              <Input
                label="Título *"
                value={demandForm.title}
                onChange={(e) => setDemandForm({ ...demandForm, title: e.target.value })}
                placeholder="Título da demanda"
              />
              <div>
                <label className="block text-sm font-semibold text-brand-blue-900 mb-2 font-poppins">Descrição</label>
                <textarea
                  value={demandForm.description}
                  onChange={(e) => setDemandForm({ ...demandForm, description: e.target.value })}
                  placeholder="Descrição da demanda..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  rows="4"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Select
                  label="Status"
                  value={demandForm.status}
                  onChange={(e) => setDemandForm({ ...demandForm, status: e.target.value })}
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </Select>
                <Select
                  label="Prioridade"
                  value={demandForm.priority}
                  onChange={(e) => setDemandForm({ ...demandForm, priority: e.target.value })}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </Select>
              </div>
              <Input
                label="Data de Vencimento"
                type="date"
                value={demandForm.dueDate}
                onChange={(e) => setDemandForm({ ...demandForm, dueDate: e.target.value })}
              />
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => setShowDemandModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddDemand}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                {editingPayment ? 'Editar Pagamento' : 'Novo Pagamento'}
              </h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setEditingPayment(null);
                  // Resetar formulário e estados do OCR
                  setPaymentForm({
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
                  setReceiptImage(null);
                  setReceiptPreview(null);
                  setOcrResults(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Upload de Comprovante */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 font-poppins">
                    Upload de Comprovante de Pagamento
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 font-poppins">
                    Faça upload do comprovante e os campos serão preenchidos automaticamente
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer font-poppins">
                    <Upload className="w-4 h-4" />
                    {receiptImage ? 'Trocar Imagem' : 'Selecionar Comprovante'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview da imagem */}
                {receiptPreview && (
                  <div className="mt-4 relative">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img 
                        src={receiptPreview} 
                        alt="Comprovante" 
                        className="w-full h-auto max-h-64 object-contain"
                      />
                      {isProcessingOCR && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                            <p className="text-white text-sm font-poppins">Processando comprovante...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setReceiptImage(null);
                        setReceiptPreview(null);
                        setOcrResults(null);
                        // Limpar campos do formulário relacionados ao OCR
                        setPaymentForm(prev => ({
                          ...prev,
                          amount: '',
                          dueDate: '',
                          paymentTime: '',
                          description: '',
                          senderName: '',
                          receiverName: '',
                          senderBank: '',
                          receiverBank: ''
                        }));
                        console.log('🔄 Imagem removida - campos do OCR limpos');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Resultados do OCR */}
                {ocrResults && !isProcessingOCR && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-900 font-poppins">
                        Dados extraídos do comprovante
                      </span>
                    </div>
                    <div className="space-y-2 text-xs text-green-800 font-poppins">
                      {ocrResults.amount && (
                        <div>💰 Valor: R$ {ocrResults.amount}</div>
                      )}
                      {ocrResults.date && (
                        <div>📅 Data: {new Date(ocrResults.date).toLocaleDateString('pt-BR')}</div>
                      )}
                      {ocrResults.paymentTime && (
                        <div>🕐 Horário: {ocrResults.paymentTime}</div>
                      )}
                      {ocrResults.senderName && (
                        <div>👤 Remetente: {ocrResults.senderName}</div>
                      )}
                      {ocrResults.receiverName && (
                        <div>👤 Destinatário: {ocrResults.receiverName}</div>
                      )}
                      {ocrResults.senderBank && (
                        <div>🏦 Banco Remetente: {ocrResults.senderBank}</div>
                      )}
                      {ocrResults.receiverBank && (
                        <div>🏦 Banco Destinatário: {ocrResults.receiverBank}</div>
                      )}
                      {ocrResults.paymentMethod && (
                        <div>💳 Método: {
                          ocrResults.paymentMethod === 'pix' ? 'PIX' :
                          ocrResults.paymentMethod === 'bank_transfer' ? 'Transferência Bancária' :
                          ocrResults.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Dinheiro'
                        }</div>
                      )}
                      {ocrResults.description && (
                        <div>📝 Descrição: {ocrResults.description}</div>
                      )}
                    </div>
                    <p className="text-xs text-green-700 mt-3 font-poppins">
                      💡 Revise e ajuste os campos abaixo se necessário
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 font-poppins">Informações do Pagamento</h3>
              </div>

              <Select
                label="Cliente *"
                value={paymentForm.clientId}
                onChange={(e) => setPaymentForm({ ...paymentForm, clientId: e.target.value })}
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </Select>
              <Select
                label="Demanda (opcional)"
                value={paymentForm.demandId}
                onChange={(e) => setPaymentForm({ ...paymentForm, demandId: e.target.value })}
              >
                <option value="">Nenhuma</option>
                {demands.filter(d => d.clientId === parseInt(paymentForm.clientId)).map(demand => (
                  <option key={demand.id} value={demand.id}>{demand.title}</option>
                ))}
              </Select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Valor *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-poppins pointer-events-none">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="0.00"
                    className={`pl-8 ${ocrResults?.amount ? "pr-10" : ""}`}
                  />
                  {ocrResults?.amount && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" title="Preenchido automaticamente pelo OCR">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Data de Vencimento *</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={paymentForm.dueDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                    className={ocrResults?.date ? "pr-10" : ""}
                  />
                  {ocrResults?.date && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" title="Preenchido automaticamente pelo OCR">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              <Input
                label="Descrição"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                placeholder="Descrição do pagamento"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Nome de Quem Enviou</label>
                <div className="relative">
                  <Input
                    value={paymentForm.senderName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, senderName: e.target.value })}
                    placeholder="Nome do remetente"
                    className={ocrResults?.senderName ? "pr-28" : ""}
                  />
                  {ocrResults?.senderName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                      <span className="text-xs text-gray-400 font-poppins whitespace-nowrap">Remetente</span>
                      <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Nome de Quem Recebeu</label>
                <div className="relative">
                  <Input
                    value={paymentForm.receiverName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, receiverName: e.target.value })}
                    placeholder="Nome do destinatário"
                    className={ocrResults?.receiverName ? "pr-32" : ""}
                  />
                  {ocrResults?.receiverName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                      <span className="text-xs text-gray-400 font-poppins whitespace-nowrap">Destinatário</span>
                      <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Horário do Pagamento</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={paymentForm.paymentTime}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentTime: e.target.value })}
                    placeholder="HH:MM:SS"
                    className={ocrResults?.paymentTime ? "pr-10" : ""}
                  />
                  {ocrResults?.paymentTime && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" title="Preenchido automaticamente pelo OCR">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Banco do Remetente</label>
                <div className="relative">
                  <Input
                    value={paymentForm.senderBank}
                    onChange={(e) => setPaymentForm({ ...paymentForm, senderBank: e.target.value })}
                    placeholder="Nome do banco do remetente"
                    className={ocrResults?.senderBank ? "pr-10" : ""}
                  />
                  {ocrResults?.senderBank && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" title="Preenchido automaticamente pelo OCR">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Banco do Destinatário</label>
                <div className="relative">
                  <Input
                    value={paymentForm.receiverBank}
                    onChange={(e) => setPaymentForm({ ...paymentForm, receiverBank: e.target.value })}
                    placeholder="Nome do banco do destinatário"
                    className={ocrResults?.receiverBank ? "pr-10" : ""}
                  />
                  {ocrResults?.receiverBank && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" title="Preenchido automaticamente pelo OCR">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Método de Pagamento</label>
                <div className="relative">
                  <Select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className={ocrResults?.paymentMethod ? "pr-10" : ""}
                  >
                    <option value="pix">PIX</option>
                    <option value="bank_transfer">Transferência Bancária</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="cash">Dinheiro</option>
                  </Select>
                  {ocrResults?.paymentMethod && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" title="Preenchido automaticamente pelo OCR">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              
              {/* Checkbox para marcar como pago */}
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="markAsPaid"
                  checked={paymentForm.status === 'paid'}
                  onChange={(e) => {
                    const isPaid = e.target.checked;
                    setPaymentForm(prev => ({
                      ...prev,
                      status: isPaid ? 'paid' : 'pending',
                      paidDate: isPaid ? (prev.paidDate || prev.dueDate || new Date().toISOString().split('T')[0]) : null
                    }));
                  }}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <label htmlFor="markAsPaid" className="text-sm font-medium text-gray-700 cursor-pointer font-poppins">
                  Marcar como Pago
                </label>
                {paymentForm.status === 'paid' && paymentForm.paidDate && (
                  <span className="text-xs text-gray-500 ml-auto font-poppins">
                    Data de pagamento: {new Date(paymentForm.paidDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setEditingPayment(null);
                  setReceiptImage(null);
                  setReceiptPreview(null);
                  setOcrResults(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPayment}
                disabled={isProcessingOCR}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessingOCR && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingPayment ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Serviço */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                {selectedClient ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setSelectedClient(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Nome *"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="Nome do serviço"
              />
              <div>
                <label className="block text-sm font-semibold text-brand-blue-900 mb-2 font-poppins">Descrição</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Descrição do serviço..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Preço *"
                  type="number"
                  step="0.01"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Duração"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                  placeholder="Ex: 15 dias"
                />
              </div>
              <Select
                label="Categoria"
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
              >
                <option value="branding">Branding</option>
                <option value="web">Web</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="other">Outro</option>
              </Select>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="serviceActive"
                  checked={serviceForm.active}
                  onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                  className="w-4 h-4 text-brand-green rounded focus:ring-brand-green"
                />
                <label htmlFor="serviceActive" className="text-sm font-semibold text-brand-blue-900 font-poppins">
                  Serviço ativo
                </label>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setSelectedClient(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={selectedClient ? handleUpdateService : handleAddService}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
              >
                {selectedClient ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Comentários */}
      {showCommentModal && selectedDemand && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">Comentários - {selectedDemand.title}</h2>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedDemand(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Lista de comentários */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.filter(c => c.demandId === selectedDemand.id).map(comment => (
                  <div key={comment.id} className={`p-4 rounded-lg ${
                    comment.type === 'client' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900 font-poppins">{comment.author}</span>
                      <span className="text-xs text-gray-500 font-poppins">
                        {new Date(comment.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-poppins">{comment.content}</p>
                  </div>
                ))}
              </div>
              
              {/* Formulário de novo comentário */}
              <div className="border-t border-gray-200 pt-4">
                <textarea
                  placeholder="Adicionar comentário..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins mb-3"
                  rows="3"
                  id="newComment"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowCommentModal(false);
                      setSelectedDemand(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const commentInput = document.getElementById('newComment');
                      if (commentInput && commentInput.value.trim()) {
                        const newComment = {
                          id: comments.length + 1,
                          demandId: selectedDemand.id,
                          clientId: null,
                          content: commentInput.value,
                          author: 'Você',
                          createdAt: new Date().toISOString(),
                          type: 'internal'
                        };
                        setComments([...comments, newComment]);
                        commentInput.value = '';
                      }
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Tarefa */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">Nova Tarefa</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Select
                label="Demanda *"
                value={demandForm.clientId}
                onChange={(e) => {
                  const demandId = parseInt(e.target.value);
                  setDemandForm({ ...demandForm, clientId: e.target.value });
                }}
              >
                <option value="">Selecione uma demanda</option>
                {demands.map(demand => {
                  const client = clients.find(c => c.id === demand.clientId);
                  return (
                    <option key={demand.id} value={demand.id}>
                      {demand.title} - {client?.name}
                    </option>
                  );
                })}
              </Select>
              <Input
                label="Título da Tarefa *"
                placeholder="Ex: Criar moodboard inicial"
                id="taskTitle"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Data de Vencimento"
                  type="date"
                  id="taskDueDate"
                />
                <Select
                  label="Prioridade"
                  id="taskPriority"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </Select>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const titleInput = document.getElementById('taskTitle');
                  const dueDateInput = document.getElementById('taskDueDate');
                  const priorityInput = document.getElementById('taskPriority');
                  
                  if (titleInput && titleInput.value && demandForm.clientId) {
                    const newTask = {
                      id: tasks.length + 1,
                      demandId: parseInt(demandForm.clientId),
                      title: titleInput.value,
                      completed: false,
                      dueDate: dueDateInput?.value || null,
                      priority: priorityInput?.value || 'medium',
                      createdAt: new Date().toISOString().split('T')[0]
                    };
                    setTasks([...tasks, newTask]);
                    setShowTaskModal(false);
                    titleInput.value = '';
                    if (dueDateInput) dueDateInput.value = '';
                    if (priorityInput) priorityInput.value = 'medium';
                  }
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Time Tracking */}
      {showTimeTrackingModal && selectedDemand && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">Registrar Tempo - {selectedDemand.title}</h2>
              <button
                onClick={() => {
                  setShowTimeTrackingModal(false);
                  setSelectedDemand(null);
                  if (activeTimer) {
                    setActiveTimer(null);
                    setTimerStart(null);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Timer ativo */}
              {activeTimer === selectedDemand.id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-poppins mb-1">Timer em execução</p>
                      <p className="text-2xl font-bold text-gray-900 font-poppins">
                        {timerDisplay ? `${timerDisplay.hours}h ${timerDisplay.minutes}m ${timerDisplay.seconds}s` : '0h 0m 0s'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const hours = timerStart ? (new Date() - new Date(timerStart)) / 1000 / 60 / 60 : 0;
                          const newEntry = {
                            id: timeEntries.length + 1,
                            demandId: selectedDemand.id,
                            description: 'Trabalho realizado',
                            hours: parseFloat(hours.toFixed(2)),
                            date: new Date().toISOString().split('T')[0],
                            status: 'completed'
                          };
                          setTimeEntries([...timeEntries, newEntry]);
                          setActiveTimer(null);
                          setTimerStart(null);
                          setTimerDisplay(null);
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors font-poppins flex items-center gap-2"
                      >
                        <StopCircle className="w-4 h-4" />
                        Parar e Salvar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão iniciar timer */}
              {activeTimer !== selectedDemand.id && (
                <button
                  onClick={() => {
                    setActiveTimer(selectedDemand.id);
                    setTimerStart(new Date().toISOString());
                  }}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors font-poppins flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Iniciar Timer
                </button>
              )}

              {/* Formulário manual */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 font-poppins">Registrar tempo manualmente</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Descrição do trabalho..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    id="timeDescription"
                  />
                  <input
                    type="number"
                    step="0.25"
                    placeholder="Horas (ex: 2.5)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    id="timeHours"
                  />
                  <button
                    onClick={() => {
                      const descInput = document.getElementById('timeDescription');
                      const hoursInput = document.getElementById('timeHours');
                      if (descInput && hoursInput && hoursInput.value) {
                        const newEntry = {
                          id: timeEntries.length + 1,
                          demandId: selectedDemand.id,
                          description: descInput.value || 'Trabalho realizado',
                          hours: parseFloat(hoursInput.value),
                          date: new Date().toISOString().split('T')[0],
                          status: 'completed'
                        };
                        setTimeEntries([...timeEntries, newEntry]);
                        descInput.value = '';
                        hoursInput.value = '';
                      }
                    }}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Histórico de tempo */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 font-poppins">Histórico</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {timeEntries.filter(t => t.demandId === selectedDemand.id).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm text-gray-900 font-poppins">{entry.description}</p>
                        <p className="text-xs text-gray-500 font-poppins">{new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 font-poppins">{entry.hours.toFixed(2)}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Modelo de Follow Through */}
      {showFollowThroughModelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                {editingFollowThroughModel ? 'Editar Modelo' : 'Novo Modelo de Follow Through'}
              </h2>
              <button
                onClick={() => {
                  setShowFollowThroughModelModal(false);
                  setEditingFollowThroughModel(null);
                  setFollowThroughModelForm({
                    name: '',
                    questions: [{ id: 1, question: '', required: true }]
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">
                  Nome do Modelo *
                </label>
                <Input
                  value={followThroughModelForm.name}
                  onChange={(e) => setFollowThroughModelForm({ ...followThroughModelForm, name: e.target.value })}
                  placeholder="Ex: Identidade Visual, Site, Social Media..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 font-poppins">
                    Perguntas *
                  </label>
                  <button
                    onClick={handleAddQuestion}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 font-poppins"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Pergunta
                  </button>
                </div>
                <div className="space-y-3">
                  {followThroughModelForm.questions.map((q, index) => (
                    <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-gray-500 mt-2 font-poppins">{index + 1}.</span>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => handleUpdateQuestion(q.id, 'question', e.target.value)}
                            placeholder="Digite a pergunta..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-poppins"
                          />
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
                              <input
                                type="checkbox"
                                checked={q.required}
                                onChange={(e) => handleUpdateQuestion(q.id, 'required', e.target.checked)}
                                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                              />
                              Obrigatória
                            </label>
                            {followThroughModelForm.questions.length > 1 && (
                              <button
                                onClick={() => handleRemoveQuestion(q.id)}
                                className="ml-auto text-red-500 hover:text-red-700 text-sm font-poppins"
                              >
                                Remover
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowFollowThroughModelModal(false);
                  setEditingFollowThroughModel(null);
                  setFollowThroughModelForm({
                    name: '',
                    questions: [{ id: 1, question: '', required: true }]
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddFollowThroughModel}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
              >
                {editingFollowThroughModel ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Selecionar Modelo ao Criar Follow Through */}
      {showFollowThroughModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                Criar Follow Through
              </h2>
              <button
                onClick={() => {
                  setShowFollowThroughModal(false);
                  setEditingFollowThrough(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Selecione um Modelo *
                </label>
                {followThroughModels.length === 0 ? (
                  <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-500 font-poppins mb-4">Nenhum modelo disponível</p>
                    <button
                      onClick={() => {
                        setShowFollowThroughModal(false);
                        setShowFollowThroughModelModal(true);
                      }}
                      className="text-sm text-gray-900 hover:text-gray-700 font-poppins"
                    >
                      Criar um modelo primeiro
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {followThroughModels.map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (editingFollowThrough?.clientId) {
                            handleCreateFollowThroughForClient(editingFollowThrough.clientId, model.id);
                            setShowFollowThroughModal(false);
                            setEditingFollowThrough(null);
                          }
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 font-poppins mb-1">{model.name}</div>
                        <div className="text-xs text-gray-500 font-poppins">
                          {model.questions.length} {model.questions.length === 1 ? 'pergunta' : 'perguntas'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Comprovante */}
      {viewingReceipt && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingReceipt(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl m-2 sm:m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-poppins">Comprovante de Pagamento</h3>
              <button
                onClick={() => setViewingReceipt(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <img 
                src={viewingReceipt} 
                alt="Comprovante" 
                className="w-full h-auto rounded-lg border border-gray-200 max-h-[70vh] object-contain mx-auto" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Documento */}
      {showDocumentModal && editingDocument && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">Editar Documento</h2>
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setEditingDocument(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Nome do Documento"
                value={editingDocument.name}
                onChange={(e) => setEditingDocument({ ...editingDocument, name: e.target.value })}
              />
              <div>
                <label className="block text-sm font-semibold text-brand-blue-900 mb-2 font-poppins">Conteúdo</label>
                <textarea
                  value={editingDocument.content}
                  onChange={(e) => setEditingDocument({ ...editingDocument, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  rows="15"
                />
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setEditingDocument(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDocument}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-poppins"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alerta/Confirmação Customizado */}
      {alertModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200">
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
              alertModal.type === 'error' ? 'bg-red-50 border-red-200' :
              alertModal.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              alertModal.type === 'success' ? 'bg-green-50 border-green-200' :
              alertModal.type === 'confirm' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {alertModal.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {alertModal.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                  {alertModal.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {alertModal.type === 'confirm' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                  {(alertModal.type === 'info' || !alertModal.type) && <AlertCircle className="w-5 h-5 text-blue-600" />}
                  <h3 className={`text-lg font-semibold font-poppins ${
                    alertModal.type === 'error' ? 'text-red-900' :
                    alertModal.type === 'warning' ? 'text-yellow-900' :
                    alertModal.type === 'success' ? 'text-green-900' :
                    alertModal.type === 'confirm' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    {alertModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setAlertModal({ ...alertModal, show: false })}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-gray-700 whitespace-pre-line font-poppins">
                {alertModal.message}
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
              {alertModal.type === 'confirm' && alertModal.onCancel && (
                <button
                  onClick={alertModal.onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-poppins"
                >
                  Não
                </button>
              )}
              <button
                onClick={alertModal.onConfirm || (() => setAlertModal({ ...alertModal, show: false }))}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors font-poppins ${
                  alertModal.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                  alertModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  alertModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                  alertModal.type === 'confirm' ? 'bg-gray-900 hover:bg-gray-800' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {alertModal.type === 'confirm' ? 'Sim' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project7;

