import { useState, useEffect } from 'react';
import { 
  Image, 
  Square, 
  Copy, 
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  CreditCard as CardIcon,
  Library,
  X,
  Eye,
  Sparkles
} from 'lucide-react';
import { 
  Home as LucideHome,
  Settings as LucideSettings,
  User as LucideUser,
  Search as LucideSearch,
  Heart as LucideHeart,
  Star as LucideStar,
  Download as LucideDownload,
  Upload as LucideUpload,
  Edit as LucideEdit,
  Trash as LucideTrash,
  Plus as LucidePlus,
  Minus as LucideMinus,
  X as LucideX,
  Check as LucideCheck,
  ArrowRight as LucideArrowRight,
  ArrowLeft as LucideArrowLeft,
  Menu as LucideMenu,
  Bell as LucideBell,
  BellOff as LucideBellOff,
  Eye as LucideEye,
  EyeOff as LucideEyeOff,
  Lock as LucideLock,
  Unlock as LucideUnlock,
  Mail as LucideMail,
  Phone as LucidePhone,
  MapPin as LucideMapPin,
  Calendar as LucideCalendar,
  Clock as LucideClock,
  Image as LucideImage,
  File as LucideFile,
  Folder as LucideFolder,
  Share as LucideShare,
  Link as LucideLink,
  ExternalLink as LucideExternalLink,
  Save as LucideSave,
  RefreshCw as LucideRefreshCw,
  Filter as LucideFilter,
  SortAsc as LucideSortAsc,
  SortDesc as LucideSortDesc,
  Grid as LucideGrid,
  List as LucideList,
  MoreVertical as LucideMoreVertical,
  MoreHorizontal as LucideMoreHorizontal,
  ChevronDown as LucideChevronDown,
  ChevronUp as LucideChevronUp,
  ChevronLeft as LucideChevronLeft,
  AlertCircle as LucideAlertCircle,
  Info as LucideInfo,
  HelpCircle as LucideHelpCircle,
  AlertTriangle as LucideAlertTriangle,
  CheckCircle as LucideCheckCircle,
  XCircle as LucideXCircle,
  Loader as LucideLoader,
  Zap as LucideZap,
  Flame as LucideFlame,
  Sparkles as LucideSparkles,
  Crown as LucideCrown,
  Award as LucideAward,
  Trophy as LucideTrophy,
  Gift as LucideGift,
  ShoppingCart as LucideShoppingCart,
  CreditCard as LucideCreditCard,
  DollarSign as LucideDollarSign,
  TrendingUp as LucideTrendingUp,
  TrendingDown as LucideTrendingDown,
  BarChart as LucideBarChart,
  PieChart as LucidePieChart,
  LineChart as LucideLineChart,
  Activity as LucideActivity,
  Target as LucideTarget,
  Flag as LucideFlag,
  Bookmark as LucideBookmark,
  Tag as LucideTag,
  Tags as LucideTags,
  Hash as LucideHash,
  AtSign as LucideAtSign,
  Play as LucidePlay,
  Pause as LucidePause,
  Volume2 as LucideVolume2,
  Mic as LucideMic,
  Video as LucideVideo,
  Camera as LucideCamera,
  Music as LucideMusic,
  Headphones as LucideHeadphones,
  Monitor as LucideMonitor,
  Smartphone as LucideSmartphone,
  Laptop as LucideLaptop,
  Cloud as LucideCloud,
  Wifi as LucideWifi,
  Battery as LucideBattery,
  Power as LucidePower,
  Sun as LucideSun,
  Moon as LucideMoon,
  Droplet as LucideDroplet,
  Wind as LucideWind,
  Car as LucideCar,
  Bike as LucideBike,
  Plane as LucidePlane,
  Rocket as LucideRocket,
  Map as LucideMap,
  Building as LucideBuilding,
  Building2 as LucideBuilding2,
  Briefcase as LucideBriefcase,
  Wallet as LucideWallet,
  Coins as LucideCoins,
  ArrowUp as LucideArrowUp,
  ArrowDown as LucideArrowDown,
  RotateCw as LucideRotateCw,
  ZoomIn as LucideZoomIn,
  ZoomOut as LucideZoomOut,
  QrCode as LucideQrCode,
  Key as LucideKey,
  Shield as LucideShield,
  ShieldCheck as LucideShieldCheck,
  Users as LucideUsers
} from 'lucide-react';
import { 
  Home as MuiHome,
  Settings as MuiSettings,
  Person as MuiPerson,
  Search as MuiSearch,
  Favorite as MuiFavorite,
  Star as MuiStar,
  Download as MuiDownload,
  Upload as MuiUpload,
  Edit as MuiEdit,
  Delete as MuiDelete,
  Add as MuiAdd,
  Remove as MuiRemove,
  Close as MuiClose,
  Check as MuiCheck,
  ArrowForward as MuiArrowForward,
  ArrowBack as MuiArrowBack,
  Menu as MuiMenu,
  Notifications as MuiNotifications,
  NotificationsOff as MuiNotificationsOff,
  Visibility as MuiVisibility,
  VisibilityOff as MuiVisibilityOff,
  Lock as MuiLock,
  LockOpen as MuiLockOpen,
  Email as MuiEmail,
  Phone as MuiPhone,
  LocationOn as MuiLocationOn,
  CalendarToday as MuiCalendarToday,
  AccessTime as MuiAccessTime,
  Image as MuiImage,
  Description as MuiDescription,
  Folder as MuiFolder,
  Share as MuiShare,
  Link as MuiLink,
  OpenInNew as MuiOpenInNew,
  Save as MuiSave,
  Refresh as MuiRefresh,
  FilterList as MuiFilterList,
  Sort as MuiSort,
  ViewModule as MuiViewModule,
  ViewList as MuiViewList,
  MoreVert as MuiMoreVert,
  MoreHoriz as MuiMoreHoriz,
  ExpandMore as MuiExpandMore,
  ExpandLess as MuiExpandLess,
  ChevronLeft as MuiChevronLeft,
  Error as MuiError,
  Info as MuiInfo,
  Help as MuiHelp,
  Warning as MuiWarning,
  CheckCircle as MuiCheckCircle,
  Cancel as MuiCancel,
  HourglassEmpty as MuiHourglassEmpty,
  FlashOn as MuiFlashOn,
  Whatshot as MuiWhatshot,
  AutoAwesome as MuiAutoAwesome,
  WorkspacePremium as MuiWorkspacePremium,
  EmojiEvents as MuiEmojiEvents,
  CardGiftcard as MuiCardGiftcard,
  ShoppingCart as MuiShoppingCart,
  CreditCard as MuiCreditCard,
  AttachMoney as MuiAttachMoney,
  TrendingUp as MuiTrendingUp,
  TrendingDown as MuiTrendingDown,
  BarChart as MuiBarChart,
  PieChart as MuiPieChart,
  ShowChart as MuiShowChart,
  Timeline as MuiTimeline,
  TrackChanges as MuiTrackChanges,
  Flag as MuiFlag,
  Bookmark as MuiBookmark,
  Label as MuiLabel,
  LocalOffer as MuiLocalOffer,
  Tag as MuiTag
} from '@mui/icons-material';

const DesignAssets = () => {
  const [activeMenu, setActiveMenu] = useState('icons');
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null); // 'normal' ou 'animated'
  const [copiedId, setCopiedId] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'icon', 'button', 'card'

  const menus = [
    { id: 'icons', name: 'Ícones', icon: Image },
    { id: 'buttons', name: 'Botões', icon: Square },
    { id: 'cards', name: 'Cards', icon: CardIcon },
  ];

  // Ícones Lucide React (React Icons)
  const lucideIcons = [
    { name: 'Home', component: LucideHome, id: 'lucide-home' },
    { name: 'Settings', component: LucideSettings, id: 'lucide-settings' },
    { name: 'User', component: LucideUser, id: 'lucide-user' },
    { name: 'Search', component: LucideSearch, id: 'lucide-search' },
    { name: 'Heart', component: LucideHeart, id: 'lucide-heart' },
    { name: 'Star', component: LucideStar, id: 'lucide-star' },
    { name: 'Download', component: LucideDownload, id: 'lucide-download' },
    { name: 'Upload', component: LucideUpload, id: 'lucide-upload' },
    { name: 'Edit', component: LucideEdit, id: 'lucide-edit' },
    { name: 'Trash', component: LucideTrash, id: 'lucide-trash' },
    { name: 'Plus', component: LucidePlus, id: 'lucide-plus' },
    { name: 'Minus', component: LucideMinus, id: 'lucide-minus' },
    { name: 'X', component: LucideX, id: 'lucide-x' },
    { name: 'Check', component: LucideCheck, id: 'lucide-check' },
    { name: 'ArrowRight', component: LucideArrowRight, id: 'lucide-arrow-right' },
    { name: 'ArrowLeft', component: LucideArrowLeft, id: 'lucide-arrow-left' },
    { name: 'Menu', component: LucideMenu, id: 'lucide-menu' },
    { name: 'Bell', component: LucideBell, id: 'lucide-bell' },
    { name: 'BellOff', component: LucideBellOff, id: 'lucide-bell-off' },
    { name: 'Eye', component: LucideEye, id: 'lucide-eye' },
    { name: 'EyeOff', component: LucideEyeOff, id: 'lucide-eye-off' },
    { name: 'Lock', component: LucideLock, id: 'lucide-lock' },
    { name: 'Unlock', component: LucideUnlock, id: 'lucide-unlock' },
    { name: 'Mail', component: LucideMail, id: 'lucide-mail' },
    { name: 'Phone', component: LucidePhone, id: 'lucide-phone' },
    { name: 'MapPin', component: LucideMapPin, id: 'lucide-map-pin' },
    { name: 'Calendar', component: LucideCalendar, id: 'lucide-calendar' },
    { name: 'Clock', component: LucideClock, id: 'lucide-clock' },
    { name: 'Image', component: LucideImage, id: 'lucide-image' },
    { name: 'File', component: LucideFile, id: 'lucide-file' },
    { name: 'Folder', component: LucideFolder, id: 'lucide-folder' },
    { name: 'Share', component: LucideShare, id: 'lucide-share' },
    { name: 'Link', component: LucideLink, id: 'lucide-link' },
    { name: 'ExternalLink', component: LucideExternalLink, id: 'lucide-external-link' },
    { name: 'Save', component: LucideSave, id: 'lucide-save' },
    { name: 'RefreshCw', component: LucideRefreshCw, id: 'lucide-refresh-cw' },
    { name: 'Filter', component: LucideFilter, id: 'lucide-filter' },
    { name: 'SortAsc', component: LucideSortAsc, id: 'lucide-sort-asc' },
    { name: 'SortDesc', component: LucideSortDesc, id: 'lucide-sort-desc' },
    { name: 'Grid', component: LucideGrid, id: 'lucide-grid' },
    { name: 'List', component: LucideList, id: 'lucide-list' },
    { name: 'MoreVertical', component: LucideMoreVertical, id: 'lucide-more-vertical' },
    { name: 'MoreHorizontal', component: LucideMoreHorizontal, id: 'lucide-more-horizontal' },
    { name: 'ChevronDown', component: LucideChevronDown, id: 'lucide-chevron-down' },
    { name: 'ChevronUp', component: LucideChevronUp, id: 'lucide-chevron-up' },
    { name: 'ChevronLeft', component: LucideChevronLeft, id: 'lucide-chevron-left' },
    { name: 'AlertCircle', component: LucideAlertCircle, id: 'lucide-alert-circle' },
    { name: 'Info', component: LucideInfo, id: 'lucide-info' },
    { name: 'HelpCircle', component: LucideHelpCircle, id: 'lucide-help-circle' },
    { name: 'AlertTriangle', component: LucideAlertTriangle, id: 'lucide-alert-triangle' },
    { name: 'CheckCircle', component: LucideCheckCircle, id: 'lucide-check-circle' },
    { name: 'XCircle', component: LucideXCircle, id: 'lucide-x-circle' },
    { name: 'Loader', component: LucideLoader, id: 'lucide-loader' },
    { name: 'Zap', component: LucideZap, id: 'lucide-zap' },
    { name: 'Flame', component: LucideFlame, id: 'lucide-flame' },
    { name: 'Sparkles', component: LucideSparkles, id: 'lucide-sparkles' },
    { name: 'Crown', component: LucideCrown, id: 'lucide-crown' },
    { name: 'Award', component: LucideAward, id: 'lucide-award' },
    { name: 'Trophy', component: LucideTrophy, id: 'lucide-trophy' },
    { name: 'Gift', component: LucideGift, id: 'lucide-gift' },
    { name: 'ShoppingCart', component: LucideShoppingCart, id: 'lucide-shopping-cart' },
    { name: 'CreditCard', component: LucideCreditCard, id: 'lucide-credit-card' },
    { name: 'DollarSign', component: LucideDollarSign, id: 'lucide-dollar-sign' },
    { name: 'TrendingUp', component: LucideTrendingUp, id: 'lucide-trending-up' },
    { name: 'TrendingDown', component: LucideTrendingDown, id: 'lucide-trending-down' },
    { name: 'BarChart', component: LucideBarChart, id: 'lucide-bar-chart' },
    { name: 'PieChart', component: LucidePieChart, id: 'lucide-pie-chart' },
    { name: 'LineChart', component: LucideLineChart, id: 'lucide-line-chart' },
    { name: 'Activity', component: LucideActivity, id: 'lucide-activity' },
    { name: 'Target', component: LucideTarget, id: 'lucide-target' },
    { name: 'Flag', component: LucideFlag, id: 'lucide-flag' },
    { name: 'Bookmark', component: LucideBookmark, id: 'lucide-bookmark' },
    { name: 'Tag', component: LucideTag, id: 'lucide-tag' },
    { name: 'Tags', component: LucideTags, id: 'lucide-tags' },
    { name: 'Hash', component: LucideHash, id: 'lucide-hash' },
    { name: 'AtSign', component: LucideAtSign, id: 'lucide-at-sign' },
    { name: 'Play', component: LucidePlay, id: 'lucide-play' },
    { name: 'Pause', component: LucidePause, id: 'lucide-pause' },
    { name: 'Volume2', component: LucideVolume2, id: 'lucide-volume2' },
    { name: 'Mic', component: LucideMic, id: 'lucide-mic' },
    { name: 'Video', component: LucideVideo, id: 'lucide-video' },
    { name: 'Camera', component: LucideCamera, id: 'lucide-camera' },
    { name: 'Music', component: LucideMusic, id: 'lucide-music' },
    { name: 'Headphones', component: LucideHeadphones, id: 'lucide-headphones' },
    { name: 'Monitor', component: LucideMonitor, id: 'lucide-monitor' },
    { name: 'Smartphone', component: LucideSmartphone, id: 'lucide-smartphone' },
    { name: 'Laptop', component: LucideLaptop, id: 'lucide-laptop' },
    { name: 'Cloud', component: LucideCloud, id: 'lucide-cloud' },
    { name: 'Wifi', component: LucideWifi, id: 'lucide-wifi' },
    { name: 'Battery', component: LucideBattery, id: 'lucide-battery' },
    { name: 'Power', component: LucidePower, id: 'lucide-power' },
    { name: 'Sun', component: LucideSun, id: 'lucide-sun' },
    { name: 'Moon', component: LucideMoon, id: 'lucide-moon' },
    { name: 'Droplet', component: LucideDroplet, id: 'lucide-droplet' },
    { name: 'Wind', component: LucideWind, id: 'lucide-wind' },
    { name: 'Car', component: LucideCar, id: 'lucide-car' },
    { name: 'Bike', component: LucideBike, id: 'lucide-bike' },
    { name: 'Plane', component: LucidePlane, id: 'lucide-plane' },
    { name: 'Rocket', component: LucideRocket, id: 'lucide-rocket' },
    { name: 'Map', component: LucideMap, id: 'lucide-map' },
    { name: 'Building', component: LucideBuilding, id: 'lucide-building' },
    { name: 'Building2', component: LucideBuilding2, id: 'lucide-building2' },
    { name: 'Briefcase', component: LucideBriefcase, id: 'lucide-briefcase' },
    { name: 'Wallet', component: LucideWallet, id: 'lucide-wallet' },
    { name: 'Coins', component: LucideCoins, id: 'lucide-coins' },
    { name: 'ArrowUp', component: LucideArrowUp, id: 'lucide-arrow-up' },
    { name: 'ArrowDown', component: LucideArrowDown, id: 'lucide-arrow-down' },
    { name: 'RotateCw', component: LucideRotateCw, id: 'lucide-rotate-cw' },
    { name: 'ZoomIn', component: LucideZoomIn, id: 'lucide-zoom-in' },
    { name: 'ZoomOut', component: LucideZoomOut, id: 'lucide-zoom-out' },
    { name: 'QrCode', component: LucideQrCode, id: 'lucide-qr-code' },
    { name: 'Key', component: LucideKey, id: 'lucide-key' },
    { name: 'Shield', component: LucideShield, id: 'lucide-shield' },
    { name: 'ShieldCheck', component: LucideShieldCheck, id: 'lucide-shield-check' },
  ];

  // Ícones Material UI
  const muiIcons = [
    { name: 'Home', component: MuiHome, id: 'mui-home' },
    { name: 'Settings', component: MuiSettings, id: 'mui-settings' },
    { name: 'Person', component: MuiPerson, id: 'mui-person' },
    { name: 'Search', component: MuiSearch, id: 'mui-search' },
    { name: 'Favorite', component: MuiFavorite, id: 'mui-favorite' },
    { name: 'Star', component: MuiStar, id: 'mui-star' },
    { name: 'Download', component: MuiDownload, id: 'mui-download' },
    { name: 'Upload', component: MuiUpload, id: 'mui-upload' },
    { name: 'Edit', component: MuiEdit, id: 'mui-edit' },
    { name: 'Delete', component: MuiDelete, id: 'mui-delete' },
    { name: 'Add', component: MuiAdd, id: 'mui-add' },
    { name: 'Remove', component: MuiRemove, id: 'mui-remove' },
    { name: 'Close', component: MuiClose, id: 'mui-close' },
    { name: 'Check', component: MuiCheck, id: 'mui-check' },
    { name: 'ArrowForward', component: MuiArrowForward, id: 'mui-arrow-forward' },
    { name: 'ArrowBack', component: MuiArrowBack, id: 'mui-arrow-back' },
    { name: 'Menu', component: MuiMenu, id: 'mui-menu' },
    { name: 'Notifications', component: MuiNotifications, id: 'mui-notifications' },
    { name: 'NotificationsOff', component: MuiNotificationsOff, id: 'mui-notifications-off' },
    { name: 'Visibility', component: MuiVisibility, id: 'mui-visibility' },
    { name: 'VisibilityOff', component: MuiVisibilityOff, id: 'mui-visibility-off' },
    { name: 'Lock', component: MuiLock, id: 'mui-lock' },
    { name: 'LockOpen', component: MuiLockOpen, id: 'mui-lock-open' },
    { name: 'Email', component: MuiEmail, id: 'mui-email' },
    { name: 'Phone', component: MuiPhone, id: 'mui-phone' },
    { name: 'LocationOn', component: MuiLocationOn, id: 'mui-location-on' },
    { name: 'CalendarToday', component: MuiCalendarToday, id: 'mui-calendar-today' },
    { name: 'AccessTime', component: MuiAccessTime, id: 'mui-access-time' },
    { name: 'Image', component: MuiImage, id: 'mui-image' },
    { name: 'Description', component: MuiDescription, id: 'mui-description' },
    { name: 'Folder', component: MuiFolder, id: 'mui-folder' },
    { name: 'Share', component: MuiShare, id: 'mui-share' },
    { name: 'Link', component: MuiLink, id: 'mui-link' },
    { name: 'OpenInNew', component: MuiOpenInNew, id: 'mui-open-in-new' },
    { name: 'Save', component: MuiSave, id: 'mui-save' },
    { name: 'Refresh', component: MuiRefresh, id: 'mui-refresh' },
    { name: 'FilterList', component: MuiFilterList, id: 'mui-filter-list' },
    { name: 'Sort', component: MuiSort, id: 'mui-sort' },
    { name: 'ViewModule', component: MuiViewModule, id: 'mui-view-module' },
    { name: 'ViewList', component: MuiViewList, id: 'mui-view-list' },
    { name: 'MoreVert', component: MuiMoreVert, id: 'mui-more-vert' },
    { name: 'MoreHoriz', component: MuiMoreHoriz, id: 'mui-more-horiz' },
    { name: 'ExpandMore', component: MuiExpandMore, id: 'mui-expand-more' },
    { name: 'ExpandLess', component: MuiExpandLess, id: 'mui-expand-less' },
    { name: 'ChevronLeft', component: MuiChevronLeft, id: 'mui-chevron-left' },
    { name: 'Error', component: MuiError, id: 'mui-error' },
    { name: 'Info', component: MuiInfo, id: 'mui-info' },
    { name: 'Help', component: MuiHelp, id: 'mui-help' },
    { name: 'Warning', component: MuiWarning, id: 'mui-warning' },
    { name: 'CheckCircle', component: MuiCheckCircle, id: 'mui-check-circle' },
    { name: 'Cancel', component: MuiCancel, id: 'mui-cancel' },
    { name: 'HourglassEmpty', component: MuiHourglassEmpty, id: 'mui-hourglass-empty' },
    { name: 'FlashOn', component: MuiFlashOn, id: 'mui-flash-on' },
    { name: 'Whatshot', component: MuiWhatshot, id: 'mui-whatshot' },
    { name: 'AutoAwesome', component: MuiAutoAwesome, id: 'mui-auto-awesome' },
    { name: 'WorkspacePremium', component: MuiWorkspacePremium, id: 'mui-workspace-premium' },
    { name: 'EmojiEvents', component: MuiEmojiEvents, id: 'mui-emoji-events' },
    { name: 'CardGiftcard', component: MuiCardGiftcard, id: 'mui-card-giftcard' },
    { name: 'ShoppingCart', component: MuiShoppingCart, id: 'mui-shopping-cart' },
    { name: 'CreditCard', component: MuiCreditCard, id: 'mui-credit-card' },
    { name: 'AttachMoney', component: MuiAttachMoney, id: 'mui-attach-money' },
    { name: 'TrendingUp', component: MuiTrendingUp, id: 'mui-trending-up' },
    { name: 'TrendingDown', component: MuiTrendingDown, id: 'mui-trending-down' },
    { name: 'BarChart', component: MuiBarChart, id: 'mui-bar-chart' },
    { name: 'PieChart', component: MuiPieChart, id: 'mui-pie-chart' },
    { name: 'ShowChart', component: MuiShowChart, id: 'mui-show-chart' },
    { name: 'Timeline', component: MuiTimeline, id: 'mui-timeline' },
    { name: 'TrackChanges', component: MuiTrackChanges, id: 'mui-track-changes' },
    { name: 'Flag', component: MuiFlag, id: 'mui-flag' },
    { name: 'Bookmark', component: MuiBookmark, id: 'mui-bookmark' },
    { name: 'Label', component: MuiLabel, id: 'mui-label' },
    { name: 'LocalOffer', component: MuiLocalOffer, id: 'mui-local-offer' },
    { name: 'Tag', component: MuiTag, id: 'mui-tag' },
  ];

  const iconLibraries = [
    { id: 'lucide', name: 'Lucide React', icons: lucideIcons, color: '#87c508' },
    { id: 'mui', name: 'Material UI', icons: muiIcons, color: '#1976d2' },
  ];

  const buttonStyles = [
    {
      id: 'btn-primary',
      name: 'Primário',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors">
          Botão Primário
        </button>
      )
    },
    {
      id: 'btn-secondary',
      name: 'Secundário',
      component: (
        <button className="px-6 py-3 bg-brand-blue-900 text-white font-semibold rounded-lg hover:bg-brand-blue-800 transition-colors">
          Botão Secundário
        </button>
      )
    },
    {
      id: 'btn-outline',
      name: 'Outline',
      component: (
        <button className="px-6 py-3 border-2 border-brand-green text-brand-green font-semibold rounded-lg hover:bg-brand-green/10 transition-colors">
          Botão Outline
        </button>
      )
    },
    {
      id: 'btn-ghost',
      name: 'Ghost',
      component: (
        <button className="px-6 py-3 text-brand-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          Botão Ghost
        </button>
      )
    },
    {
      id: 'btn-gradient',
      name: 'Gradiente',
      component: (
        <button className="px-6 py-3 bg-gradient-to-r from-brand-green to-brand-blue-900 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
          Botão Gradiente
        </button>
      )
    },
    {
      id: 'btn-rounded',
      name: 'Arredondado',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-full hover:bg-brand-green/90 transition-colors">
          Botão Arredondado
        </button>
      )
    },
    {
      id: 'btn-icon-left',
      name: 'Com Ícone Esquerda',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors flex items-center gap-2">
          <LucideDownload className="w-5 h-5" />
          Download
        </button>
      )
    },
    {
      id: 'btn-icon-right',
      name: 'Com Ícone Direita',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors flex items-center gap-2">
          Continuar
          <LucideArrowRight className="w-5 h-5" />
        </button>
      )
    },
    {
      id: 'btn-small',
      name: 'Pequeno',
      component: (
        <button className="px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors text-sm">
          Botão Pequeno
        </button>
      )
    },
    {
      id: 'btn-large',
      name: 'Grande',
      component: (
        <button className="px-8 py-4 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors text-lg">
          Botão Grande
        </button>
      )
    },
    {
      id: 'btn-disabled',
      name: 'Desabilitado',
      component: (
        <button className="px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed" disabled>
          Botão Desabilitado
        </button>
      )
    },
    {
      id: 'btn-loading',
      name: 'Carregando',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors flex items-center gap-2" disabled>
          <LucideLoader className="w-5 h-5 animate-spin" />
          Carregando...
        </button>
      )
    },
    {
      id: 'btn-danger',
      name: 'Perigo',
      component: (
        <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
          Excluir
        </button>
      )
    },
    {
      id: 'btn-success',
      name: 'Sucesso',
      component: (
        <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
          Confirmar
        </button>
      )
    },
    {
      id: 'btn-warning',
      name: 'Aviso',
      component: (
        <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
          Atenção
        </button>
      )
    },
    {
      id: 'btn-info',
      name: 'Informação',
      component: (
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
          Informação
        </button>
      )
    },
    {
      id: 'btn-shadow',
      name: 'Com Sombra',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors shadow-lg hover:shadow-xl">
          Botão com Sombra
        </button>
      )
    },
    {
      id: 'btn-border-thick',
      name: 'Borda Grossa',
      component: (
        <button className="px-6 py-3 border-4 border-brand-green text-brand-green font-semibold rounded-lg hover:bg-brand-green/10 transition-colors">
          Borda Grossa
        </button>
      )
    },
    {
      id: 'btn-text-only',
      name: 'Apenas Texto',
      component: (
        <button className="px-6 py-3 text-brand-green font-semibold hover:underline transition-colors">
          Apenas Texto
        </button>
      )
    },
    {
      id: 'btn-icon-only',
      name: 'Apenas Ícone',
      component: (
        <button className="p-3 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green/90 transition-colors">
          <LucideHeart className="w-5 h-5" />
        </button>
      )
    },
    {
      id: 'btn-group-left',
      name: 'Grupo Esquerda',
      component: (
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-300">
          <button className="px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold hover:bg-brand-green/90 transition-colors">
            Esquerda
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors border-l border-gray-300">
            Direita
          </button>
        </div>
      )
    },
    {
      id: 'btn-group-center',
      name: 'Grupo Centro',
      component: (
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-300">
          <button className="px-4 py-2 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors border-r border-gray-300">
            Esquerda
          </button>
          <button className="px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold hover:bg-brand-green/90 transition-colors">
            Centro
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors border-l border-gray-300">
            Direita
          </button>
        </div>
      )
    },
  ];

  const cardStyles = [
    {
      id: 'card-basic',
      name: 'Básico',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Básico</h3>
          <p className="text-gray-600 font-poppins">Este é um card básico com borda e sombra suave.</p>
        </div>
      )
    },
    {
      id: 'card-elevated',
      name: 'Elevado',
      component: (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Elevado</h3>
          <p className="text-gray-600 font-poppins">Card com sombra mais pronunciada para destaque.</p>
        </div>
      )
    },
    {
      id: 'card-colored',
      name: 'Colorido',
      component: (
        <div className="bg-gradient-to-br from-brand-green to-brand-blue-900 rounded-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-2 font-poppins font-medium">Card Colorido</h3>
          <p className="text-white/90 font-poppins">Card com gradiente usando as cores da marca.</p>
        </div>
      )
    },
    {
      id: 'card-with-icon',
      name: 'Com Ícone',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
              <LucideStar className="w-6 h-6 text-brand-green" />
            </div>
            <h3 className="text-lg font-bold text-brand-blue-900 font-poppins font-medium">Card com Ícone</h3>
          </div>
          <p className="text-gray-600 font-poppins">Card com ícone destacado no topo.</p>
        </div>
      )
    },
    {
      id: 'card-with-image',
      name: 'Com Imagem',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-br from-brand-green to-brand-blue-900"></div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card com Imagem</h3>
            <p className="text-gray-600 font-poppins">Card com área de imagem no topo.</p>
          </div>
        </div>
      )
    },
    {
      id: 'card-hover',
      name: 'Hover Effect',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-brand-green transition-all cursor-pointer">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card com Hover</h3>
          <p className="text-gray-600 font-poppins">Passe o mouse para ver o efeito.</p>
        </div>
      )
    },
    {
      id: 'card-stats',
      name: 'Estatísticas',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 font-poppins">Total de Usuários</h3>
            <LucideUsers className="w-5 h-5 text-brand-green" />
          </div>
          <p className="text-3xl font-bold text-brand-blue-900 font-poppins font-medium">1,234</p>
          <p className="text-sm text-green-600 mt-2 font-poppins">+12% este mês</p>
        </div>
      )
    },
    {
      id: 'card-action',
      name: 'Com Ação',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card com Ação</h3>
          <p className="text-gray-600 mb-4 font-poppins">Card com botão de ação no rodapé.</p>
          <button className="w-full px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors">
            Ação
          </button>
        </div>
      )
    },
    {
      id: 'card-bordered',
      name: 'Borda Colorida',
      component: (
        <div className="bg-white rounded-lg border-l-4 border-brand-green p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Borda Colorida</h3>
          <p className="text-gray-600 font-poppins">Card com borda lateral colorida.</p>
        </div>
      )
    },
    {
      id: 'card-minimal',
      name: 'Minimalista',
      component: (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Minimalista</h3>
          <p className="text-gray-600 font-poppins">Card sem bordas ou sombras, estilo minimalista.</p>
        </div>
      )
    },
    {
      id: 'card-gradient',
      name: 'Gradiente',
      component: (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-2 font-poppins font-medium">Card Gradiente</h3>
          <p className="text-white/90 font-poppins">Card com gradiente colorido.</p>
        </div>
      )
    },
    {
      id: 'card-outlined',
      name: 'Outline',
      component: (
        <div className="bg-transparent rounded-lg border-2 border-brand-green p-6">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Outline</h3>
          <p className="text-gray-600 font-poppins">Card apenas com borda, sem fundo.</p>
        </div>
      )
    },
  ];

  // Biblioteca de Ícones Animados
  const animatedIcons = [
    {
      id: 'icon-heart-bounce',
      name: 'Heart Bounce',
      description: 'Ícone Heart com animação de pulo',
      component: (
        <div className="animate-bounce">
          <LucideHeart className="w-12 h-12 text-brand-green" />
        </div>
      )
    },
    {
      id: 'icon-star-pulse',
      name: 'Star Pulse',
      description: 'Ícone Star com animação de pulsação',
      component: (
        <div className="animate-pulse">
          <LucideStar className="w-12 h-12 text-brand-green" />
        </div>
      )
    },
    {
      id: 'icon-loader-spin',
      name: 'Loader Spin',
      description: 'Ícone Loader com animação de rotação',
      component: (
        <div className="animate-spin">
          <LucideLoader className="w-12 h-12 text-brand-green" />
        </div>
      )
    },
    {
      id: 'icon-bell-ping',
      name: 'Bell Ping',
      description: 'Ícone Bell com animação de ping',
      component: (
        <div className="relative">
          <LucideBell className="w-12 h-12 text-brand-green animate-ping absolute" />
          <LucideBell className="w-12 h-12 text-brand-green relative" />
        </div>
      )
    },
    {
      id: 'icon-sparkles-wiggle',
      name: 'Sparkles Wiggle',
      description: 'Ícone Sparkles com animação de balanço',
      component: (
        <div className="animate-[wiggle_1s_ease-in-out_infinite]">
          <LucideSparkles className="w-12 h-12 text-brand-green" />
        </div>
      )
    },
    {
      id: 'icon-cloud-float',
      name: 'Cloud Float',
      description: 'Ícone Cloud com animação de flutuação',
      component: (
        <div className="animate-[float_3s_ease-in-out_infinite]">
          <LucideCloud className="w-12 h-12 text-brand-green" />
        </div>
      )
    },
    // Mais ícones animados
    { id: 'icon-home-bounce', name: 'Home Bounce', description: 'Ícone Home com animação de pulo', component: (<div className="animate-bounce"><LucideHome className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-settings-spin', name: 'Settings Spin', description: 'Ícone Settings com animação de rotação', component: (<div className="animate-spin"><LucideSettings className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-user-pulse', name: 'User Pulse', description: 'Ícone User com animação de pulsação', component: (<div className="animate-pulse"><LucideUser className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-search-wiggle', name: 'Search Wiggle', description: 'Ícone Search com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideSearch className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-download-bounce', name: 'Download Bounce', description: 'Ícone Download com animação de pulo', component: (<div className="animate-bounce"><LucideDownload className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-upload-float', name: 'Upload Float', description: 'Ícone Upload com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideUpload className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-edit-pulse', name: 'Edit Pulse', description: 'Ícone Edit com animação de pulsação', component: (<div className="animate-pulse"><LucideEdit className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-trash-shake', name: 'Trash Shake', description: 'Ícone Trash com animação de tremor', component: (<div className="animate-[shake_0.5s_ease-in-out_infinite]"><LucideTrash className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-plus-bounce', name: 'Plus Bounce', description: 'Ícone Plus com animação de pulo', component: (<div className="animate-bounce"><LucidePlus className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-minus-pulse', name: 'Minus Pulse', description: 'Ícone Minus com animação de pulsação', component: (<div className="animate-pulse"><LucideMinus className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-check-spin', name: 'Check Spin', description: 'Ícone Check com animação de rotação', component: (<div className="animate-spin"><LucideCheck className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-x-wiggle', name: 'X Wiggle', description: 'Ícone X com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideX className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-arrow-right-bounce', name: 'ArrowRight Bounce', description: 'Ícone ArrowRight com animação de pulo', component: (<div className="animate-bounce"><LucideArrowRight className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-arrow-left-float', name: 'ArrowLeft Float', description: 'Ícone ArrowLeft com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideArrowLeft className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-menu-pulse', name: 'Menu Pulse', description: 'Ícone Menu com animação de pulsação', component: (<div className="animate-pulse"><LucideMenu className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-belloff-wiggle', name: 'BellOff Wiggle', description: 'Ícone BellOff com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideBellOff className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-eye-bounce', name: 'Eye Bounce', description: 'Ícone Eye com animação de pulo', component: (<div className="animate-bounce"><LucideEye className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-eyeoff-pulse', name: 'EyeOff Pulse', description: 'Ícone EyeOff com animação de pulsação', component: (<div className="animate-pulse"><LucideEyeOff className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-lock-spin', name: 'Lock Spin', description: 'Ícone Lock com animação de rotação', component: (<div className="animate-spin"><LucideLock className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-unlock-float', name: 'Unlock Float', description: 'Ícone Unlock com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideUnlock className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-mail-bounce', name: 'Mail Bounce', description: 'Ícone Mail com animação de pulo', component: (<div className="animate-bounce"><LucideMail className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-phone-pulse', name: 'Phone Pulse', description: 'Ícone Phone com animação de pulsação', component: (<div className="animate-pulse"><LucidePhone className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-mappin-wiggle', name: 'MapPin Wiggle', description: 'Ícone MapPin com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideMapPin className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-calendar-bounce', name: 'Calendar Bounce', description: 'Ícone Calendar com animação de pulo', component: (<div className="animate-bounce"><LucideCalendar className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-clock-spin', name: 'Clock Spin', description: 'Ícone Clock com animação de rotação', component: (<div className="animate-spin"><LucideClock className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-image-float', name: 'Image Float', description: 'Ícone Image com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideImage className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-file-pulse', name: 'File Pulse', description: 'Ícone File com animação de pulsação', component: (<div className="animate-pulse"><LucideFile className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-folder-bounce', name: 'Folder Bounce', description: 'Ícone Folder com animação de pulo', component: (<div className="animate-bounce"><LucideFolder className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-share-wiggle', name: 'Share Wiggle', description: 'Ícone Share com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideShare className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-link-pulse', name: 'Link Pulse', description: 'Ícone Link com animação de pulsação', component: (<div className="animate-pulse"><LucideLink className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-externallink-bounce', name: 'ExternalLink Bounce', description: 'Ícone ExternalLink com animação de pulo', component: (<div className="animate-bounce"><LucideExternalLink className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-save-spin', name: 'Save Spin', description: 'Ícone Save com animação de rotação', component: (<div className="animate-spin"><LucideSave className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-refreshcw-spin', name: 'RefreshCw Spin', description: 'Ícone RefreshCw com animação de rotação', component: (<div className="animate-spin"><LucideRefreshCw className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-filter-pulse', name: 'Filter Pulse', description: 'Ícone Filter com animação de pulsação', component: (<div className="animate-pulse"><LucideFilter className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-sortasc-bounce', name: 'SortAsc Bounce', description: 'Ícone SortAsc com animação de pulo', component: (<div className="animate-bounce"><LucideSortAsc className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-sortdesc-float', name: 'SortDesc Float', description: 'Ícone SortDesc com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideSortDesc className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-grid-wiggle', name: 'Grid Wiggle', description: 'Ícone Grid com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideGrid className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-list-pulse', name: 'List Pulse', description: 'Ícone List com animação de pulsação', component: (<div className="animate-pulse"><LucideList className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-morevertical-bounce', name: 'MoreVertical Bounce', description: 'Ícone MoreVertical com animação de pulo', component: (<div className="animate-bounce"><LucideMoreVertical className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-morehorizontal-float', name: 'MoreHorizontal Float', description: 'Ícone MoreHorizontal com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideMoreHorizontal className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-chevrondown-pulse', name: 'ChevronDown Pulse', description: 'Ícone ChevronDown com animação de pulsação', component: (<div className="animate-pulse"><LucideChevronDown className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-chevronup-bounce', name: 'ChevronUp Bounce', description: 'Ícone ChevronUp com animação de pulo', component: (<div className="animate-bounce"><LucideChevronUp className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-chevronleft-spin', name: 'ChevronLeft Spin', description: 'Ícone ChevronLeft com animação de rotação', component: (<div className="animate-spin"><LucideChevronLeft className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-alertcircle-wiggle', name: 'AlertCircle Wiggle', description: 'Ícone AlertCircle com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideAlertCircle className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-info-pulse', name: 'Info Pulse', description: 'Ícone Info com animação de pulsação', component: (<div className="animate-pulse"><LucideInfo className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-helpcircle-bounce', name: 'HelpCircle Bounce', description: 'Ícone HelpCircle com animação de pulo', component: (<div className="animate-bounce"><LucideHelpCircle className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-alerttriangle-float', name: 'AlertTriangle Float', description: 'Ícone AlertTriangle com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideAlertTriangle className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-checkcircle-pulse', name: 'CheckCircle Pulse', description: 'Ícone CheckCircle com animação de pulsação', component: (<div className="animate-pulse"><LucideCheckCircle className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-xcircle-wiggle', name: 'XCircle Wiggle', description: 'Ícone XCircle com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideXCircle className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-zap-bounce', name: 'Zap Bounce', description: 'Ícone Zap com animação de pulo', component: (<div className="animate-bounce"><LucideZap className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-flame-pulse', name: 'Flame Pulse', description: 'Ícone Flame com animação de pulsação', component: (<div className="animate-pulse"><LucideFlame className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-crown-spin', name: 'Crown Spin', description: 'Ícone Crown com animação de rotação', component: (<div className="animate-spin"><LucideCrown className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-award-float', name: 'Award Float', description: 'Ícone Award com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideAward className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-trophy-bounce', name: 'Trophy Bounce', description: 'Ícone Trophy com animação de pulo', component: (<div className="animate-bounce"><LucideTrophy className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-gift-pulse', name: 'Gift Pulse', description: 'Ícone Gift com animação de pulsação', component: (<div className="animate-pulse"><LucideGift className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-shoppingcart-wiggle', name: 'ShoppingCart Wiggle', description: 'Ícone ShoppingCart com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideShoppingCart className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-creditcard-bounce', name: 'CreditCard Bounce', description: 'Ícone CreditCard com animação de pulo', component: (<div className="animate-bounce"><LucideCreditCard className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-dollarsign-pulse', name: 'DollarSign Pulse', description: 'Ícone DollarSign com animação de pulsação', component: (<div className="animate-pulse"><LucideDollarSign className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-trendingup-float', name: 'TrendingUp Float', description: 'Ícone TrendingUp com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideTrendingUp className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-trendingdown-bounce', name: 'TrendingDown Bounce', description: 'Ícone TrendingDown com animação de pulo', component: (<div className="animate-bounce"><LucideTrendingDown className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-barchart-spin', name: 'BarChart Spin', description: 'Ícone BarChart com animação de rotação', component: (<div className="animate-spin"><LucideBarChart className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-piechart-pulse', name: 'PieChart Pulse', description: 'Ícone PieChart com animação de pulsação', component: (<div className="animate-pulse"><LucidePieChart className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-linechart-wiggle', name: 'LineChart Wiggle', description: 'Ícone LineChart com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideLineChart className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-activity-bounce', name: 'Activity Bounce', description: 'Ícone Activity com animação de pulo', component: (<div className="animate-bounce"><LucideActivity className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-target-pulse', name: 'Target Pulse', description: 'Ícone Target com animação de pulsação', component: (<div className="animate-pulse"><LucideTarget className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-flag-float', name: 'Flag Float', description: 'Ícone Flag com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideFlag className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-bookmark-bounce', name: 'Bookmark Bounce', description: 'Ícone Bookmark com animação de pulo', component: (<div className="animate-bounce"><LucideBookmark className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-tag-pulse', name: 'Tag Pulse', description: 'Ícone Tag com animação de pulsação', component: (<div className="animate-pulse"><LucideTag className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-tags-wiggle', name: 'Tags Wiggle', description: 'Ícone Tags com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideTags className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-hash-bounce', name: 'Hash Bounce', description: 'Ícone Hash com animação de pulo', component: (<div className="animate-bounce"><LucideHash className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-atsign-pulse', name: 'AtSign Pulse', description: 'Ícone AtSign com animação de pulsação', component: (<div className="animate-pulse"><LucideAtSign className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-play-bounce', name: 'Play Bounce', description: 'Ícone Play com animação de pulo', component: (<div className="animate-bounce"><LucidePlay className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-pause-pulse', name: 'Pause Pulse', description: 'Ícone Pause com animação de pulsação', component: (<div className="animate-pulse"><LucidePause className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-volume2-wiggle', name: 'Volume2 Wiggle', description: 'Ícone Volume2 com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideVolume2 className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-mic-bounce', name: 'Mic Bounce', description: 'Ícone Mic com animação de pulo', component: (<div className="animate-bounce"><LucideMic className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-video-pulse', name: 'Video Pulse', description: 'Ícone Video com animação de pulsação', component: (<div className="animate-pulse"><LucideVideo className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-camera-float', name: 'Camera Float', description: 'Ícone Camera com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideCamera className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-music-bounce', name: 'Music Bounce', description: 'Ícone Music com animação de pulo', component: (<div className="animate-bounce"><LucideMusic className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-headphones-pulse', name: 'Headphones Pulse', description: 'Ícone Headphones com animação de pulsação', component: (<div className="animate-pulse"><LucideHeadphones className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-monitor-wiggle', name: 'Monitor Wiggle', description: 'Ícone Monitor com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideMonitor className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-smartphone-bounce', name: 'Smartphone Bounce', description: 'Ícone Smartphone com animação de pulo', component: (<div className="animate-bounce"><LucideSmartphone className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-laptop-pulse', name: 'Laptop Pulse', description: 'Ícone Laptop com animação de pulsação', component: (<div className="animate-pulse"><LucideLaptop className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-wifi-spin', name: 'Wifi Spin', description: 'Ícone Wifi com animação de rotação', component: (<div className="animate-spin"><LucideWifi className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-battery-pulse', name: 'Battery Pulse', description: 'Ícone Battery com animação de pulsação', component: (<div className="animate-pulse"><LucideBattery className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-power-bounce', name: 'Power Bounce', description: 'Ícone Power com animação de pulo', component: (<div className="animate-bounce"><LucidePower className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-sun-pulse', name: 'Sun Pulse', description: 'Ícone Sun com animação de pulsação', component: (<div className="animate-pulse"><LucideSun className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-moon-float', name: 'Moon Float', description: 'Ícone Moon com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideMoon className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-droplet-bounce', name: 'Droplet Bounce', description: 'Ícone Droplet com animação de pulo', component: (<div className="animate-bounce"><LucideDroplet className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-wind-wiggle', name: 'Wind Wiggle', description: 'Ícone Wind com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideWind className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-car-bounce', name: 'Car Bounce', description: 'Ícone Car com animação de pulo', component: (<div className="animate-bounce"><LucideCar className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-bike-pulse', name: 'Bike Pulse', description: 'Ícone Bike com animação de pulsação', component: (<div className="animate-pulse"><LucideBike className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-plane-float', name: 'Plane Float', description: 'Ícone Plane com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucidePlane className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-rocket-bounce', name: 'Rocket Bounce', description: 'Ícone Rocket com animação de pulo', component: (<div className="animate-bounce"><LucideRocket className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-map-pulse', name: 'Map Pulse', description: 'Ícone Map com animação de pulsação', component: (<div className="animate-pulse"><LucideMap className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-building-wiggle', name: 'Building Wiggle', description: 'Ícone Building com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideBuilding className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-building2-bounce', name: 'Building2 Bounce', description: 'Ícone Building2 com animação de pulo', component: (<div className="animate-bounce"><LucideBuilding2 className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-briefcase-pulse', name: 'Briefcase Pulse', description: 'Ícone Briefcase com animação de pulsação', component: (<div className="animate-pulse"><LucideBriefcase className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-wallet-float', name: 'Wallet Float', description: 'Ícone Wallet com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideWallet className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-coins-bounce', name: 'Coins Bounce', description: 'Ícone Coins com animação de pulo', component: (<div className="animate-bounce"><LucideCoins className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-arrowup-pulse', name: 'ArrowUp Pulse', description: 'Ícone ArrowUp com animação de pulsação', component: (<div className="animate-pulse"><LucideArrowUp className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-arrowdown-bounce', name: 'ArrowDown Bounce', description: 'Ícone ArrowDown com animação de pulo', component: (<div className="animate-bounce"><LucideArrowDown className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-rotatecw-spin', name: 'RotateCw Spin', description: 'Ícone RotateCw com animação de rotação', component: (<div className="animate-spin"><LucideRotateCw className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-zoomin-bounce', name: 'ZoomIn Bounce', description: 'Ícone ZoomIn com animação de pulo', component: (<div className="animate-bounce"><LucideZoomIn className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-zoomout-pulse', name: 'ZoomOut Pulse', description: 'Ícone ZoomOut com animação de pulsação', component: (<div className="animate-pulse"><LucideZoomOut className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-qrcode-wiggle', name: 'QrCode Wiggle', description: 'Ícone QrCode com animação de balanço', component: (<div className="animate-[wiggle_1s_ease-in-out_infinite]"><LucideQrCode className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-key-bounce', name: 'Key Bounce', description: 'Ícone Key com animação de pulo', component: (<div className="animate-bounce"><LucideKey className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-shield-pulse', name: 'Shield Pulse', description: 'Ícone Shield com animação de pulsação', component: (<div className="animate-pulse"><LucideShield className="w-12 h-12 text-brand-green" /></div>) },
    { id: 'icon-shieldcheck-float', name: 'ShieldCheck Float', description: 'Ícone ShieldCheck com animação de flutuação', component: (<div className="animate-[float_3s_ease-in-out_infinite]"><LucideShieldCheck className="w-12 h-12 text-brand-green" /></div>) },
  ];

  // Biblioteca de Botões Animados
  const animatedButtons = [
    {
      id: 'btn-primary-shake',
      name: 'Primary Shake',
      description: 'Botão primário com animação de tremor ao hover',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">
          Shake on Hover
        </button>
      )
    },
    {
      id: 'btn-primary-glow',
      name: 'Primary Glow',
      description: 'Botão primário com efeito de brilho',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(135,197,8,0.6)] transition-all">
          Glow Effect
        </button>
      )
    },
    {
      id: 'btn-primary-scale',
      name: 'Primary Scale',
      description: 'Botão primário que aumenta ao hover',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-110 transition-transform">
          Scale on Hover
        </button>
      )
    },
    {
      id: 'btn-primary-rotate',
      name: 'Primary Rotate',
      description: 'Botão primário que rotaciona ao hover',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:rotate-3 transition-transform">
          Rotate on Hover
        </button>
      )
    },
    {
      id: 'btn-gradient-animated',
      name: 'Gradient Animated',
      description: 'Botão com gradiente animado',
      component: (
        <button className="px-6 py-3 bg-gradient-to-r from-brand-green via-brand-blue-900 to-brand-green bg-[length:200%_100%] text-white font-semibold rounded-lg hover:animate-[gradient_3s_linear_infinite] transition-all">
          Animated Gradient
        </button>
      )
    },
    {
      id: 'btn-primary-bounce',
      name: 'Primary Bounce',
      description: 'Botão primário com animação de pulo',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:animate-bounce transition-colors">
          Bounce on Hover
        </button>
      )
    },
    {
      id: 'btn-primary-pulse-border',
      name: 'Primary Pulse Border',
      description: 'Botão primário com borda pulsante',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg border-2 border-brand-green hover:border-brand-blue-900 animate-pulse transition-colors">
          Pulsing Border
        </button>
      )
    },
    {
      id: 'btn-primary-slide',
      name: 'Primary Slide',
      description: 'Botão primário com efeito de deslizamento',
      component: (
        <button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:translate-x-2 transition-transform relative overflow-hidden group">
          <span className="relative z-10">Slide Right</span>
          <span className="absolute inset-0 bg-brand-blue-900 transform translate-x-full group-hover:translate-x-0 transition-transform"></span>
        </button>
      )
    },
    // Mais botões animados
    { id: 'btn-secondary-shake', name: 'Secondary Shake', description: 'Botão secundário com animação de tremor', component: (<button className="px-6 py-3 bg-brand-blue-900 text-white font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-secondary-glow', name: 'Secondary Glow', description: 'Botão secundário com efeito de brilho', component: (<button className="px-6 py-3 bg-brand-blue-900 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(1,21,38,0.6)] transition-all">Glow</button>) },
    { id: 'btn-secondary-scale', name: 'Secondary Scale', description: 'Botão secundário que aumenta ao hover', component: (<button className="px-6 py-3 bg-brand-blue-900 text-white font-semibold rounded-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-secondary-rotate', name: 'Secondary Rotate', description: 'Botão secundário que rotaciona ao hover', component: (<button className="px-6 py-3 bg-brand-blue-900 text-white font-semibold rounded-lg hover:rotate-3 transition-transform">Rotate</button>) },
    { id: 'btn-outline-shake', name: 'Outline Shake', description: 'Botão outline com animação de tremor', component: (<button className="px-6 py-3 border-2 border-brand-green text-brand-green font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-outline-glow', name: 'Outline Glow', description: 'Botão outline com efeito de brilho', component: (<button className="px-6 py-3 border-2 border-brand-green text-brand-green font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(135,197,8,0.6)] transition-all">Glow</button>) },
    { id: 'btn-outline-scale', name: 'Outline Scale', description: 'Botão outline que aumenta ao hover', component: (<button className="px-6 py-3 border-2 border-brand-green text-brand-green font-semibold rounded-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-outline-rotate', name: 'Outline Rotate', description: 'Botão outline que rotaciona ao hover', component: (<button className="px-6 py-3 border-2 border-brand-green text-brand-green font-semibold rounded-lg hover:rotate-3 transition-transform">Rotate</button>) },
    { id: 'btn-ghost-shake', name: 'Ghost Shake', description: 'Botão ghost com animação de tremor', component: (<button className="px-6 py-3 text-brand-blue-900 font-semibold rounded-lg hover:animate-[shake_0.5s] hover:bg-gray-100 transition-colors">Shake</button>) },
    { id: 'btn-ghost-glow', name: 'Ghost Glow', description: 'Botão ghost com efeito de brilho', component: (<button className="px-6 py-3 text-brand-blue-900 font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(1,21,38,0.4)] hover:bg-gray-100 transition-all">Glow</button>) },
    { id: 'btn-ghost-scale', name: 'Ghost Scale', description: 'Botão ghost que aumenta ao hover', component: (<button className="px-6 py-3 text-brand-blue-900 font-semibold rounded-lg hover:scale-110 hover:bg-gray-100 transition-all">Scale</button>) },
    { id: 'btn-danger-shake', name: 'Danger Shake', description: 'Botão danger com animação de tremor', component: (<button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-danger-glow', name: 'Danger Glow', description: 'Botão danger com efeito de brilho', component: (<button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all">Glow</button>) },
    { id: 'btn-danger-scale', name: 'Danger Scale', description: 'Botão danger que aumenta ao hover', component: (<button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-success-shake', name: 'Success Shake', description: 'Botão success com animação de tremor', component: (<button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-success-glow', name: 'Success Glow', description: 'Botão success com efeito de brilho', component: (<button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(22,163,74,0.6)] transition-all">Glow</button>) },
    { id: 'btn-success-scale', name: 'Success Scale', description: 'Botão success que aumenta ao hover', component: (<button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-warning-shake', name: 'Warning Shake', description: 'Botão warning com animação de tremor', component: (<button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-warning-glow', name: 'Warning Glow', description: 'Botão warning com efeito de brilho', component: (<button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all">Glow</button>) },
    { id: 'btn-warning-scale', name: 'Warning Scale', description: 'Botão warning que aumenta ao hover', component: (<button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-info-shake', name: 'Info Shake', description: 'Botão info com animação de tremor', component: (<button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-info-glow', name: 'Info Glow', description: 'Botão info com efeito de brilho', component: (<button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all">Glow</button>) },
    { id: 'btn-info-scale', name: 'Info Scale', description: 'Botão info que aumenta ao hover', component: (<button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-rounded-shake', name: 'Rounded Shake', description: 'Botão arredondado com animação de tremor', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-full hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-rounded-glow', name: 'Rounded Glow', description: 'Botão arredondado com efeito de brilho', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-full hover:shadow-[0_0_20px_rgba(135,197,8,0.6)] transition-all">Glow</button>) },
    { id: 'btn-rounded-scale', name: 'Rounded Scale', description: 'Botão arredondado que aumenta ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-full hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-small-shake', name: 'Small Shake', description: 'Botão pequeno com animação de tremor', component: (<button className="px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg text-sm hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-small-glow', name: 'Small Glow', description: 'Botão pequeno com efeito de brilho', component: (<button className="px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg text-sm hover:shadow-[0_0_15px_rgba(135,197,8,0.6)] transition-all">Glow</button>) },
    { id: 'btn-small-scale', name: 'Small Scale', description: 'Botão pequeno que aumenta ao hover', component: (<button className="px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg text-sm hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-large-shake', name: 'Large Shake', description: 'Botão grande com animação de tremor', component: (<button className="px-8 py-4 bg-brand-green text-brand-blue-900 font-semibold rounded-lg text-lg hover:animate-[shake_0.5s] transition-colors">Shake</button>) },
    { id: 'btn-large-glow', name: 'Large Glow', description: 'Botão grande com efeito de brilho', component: (<button className="px-8 py-4 bg-brand-green text-brand-blue-900 font-semibold rounded-lg text-lg hover:shadow-[0_0_25px_rgba(135,197,8,0.6)] transition-all">Glow</button>) },
    { id: 'btn-large-scale', name: 'Large Scale', description: 'Botão grande que aumenta ao hover', component: (<button className="px-8 py-4 bg-brand-green text-brand-blue-900 font-semibold rounded-lg text-lg hover:scale-110 transition-transform">Scale</button>) },
    { id: 'btn-slide-up', name: 'Slide Up', description: 'Botão com efeito de deslizamento para cima', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:-translate-y-2 transition-transform relative overflow-hidden group"><span className="relative z-10">Slide Up</span><span className="absolute inset-0 bg-brand-blue-900 transform translate-y-full group-hover:translate-y-0 transition-transform"></span></button>) },
    { id: 'btn-slide-down', name: 'Slide Down', description: 'Botão com efeito de deslizamento para baixo', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:translate-y-2 transition-transform relative overflow-hidden group"><span className="relative z-10">Slide Down</span><span className="absolute inset-0 bg-brand-blue-900 transform -translate-y-full group-hover:translate-y-0 transition-transform"></span></button>) },
    { id: 'btn-slide-left', name: 'Slide Left', description: 'Botão com efeito de deslizamento para esquerda', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:-translate-x-2 transition-transform relative overflow-hidden group"><span className="relative z-10">Slide Left</span><span className="absolute inset-0 bg-brand-blue-900 transform -translate-x-full group-hover:translate-x-0 transition-transform"></span></button>) },
    { id: 'btn-fade-in', name: 'Fade In', description: 'Botão com efeito de fade in ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:opacity-80 transition-opacity">Fade In</button>) },
    { id: 'btn-brightness', name: 'Brightness', description: 'Botão com efeito de brilho ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:brightness-110 transition-all">Brightness</button>) },
    { id: 'btn-saturate', name: 'Saturate', description: 'Botão com efeito de saturação ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:saturate-150 transition-all">Saturate</button>) },
    { id: 'btn-blur', name: 'Blur', description: 'Botão com efeito de blur ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:blur-sm transition-all">Blur</button>) },
    { id: 'btn-skew', name: 'Skew', description: 'Botão com efeito de inclinação ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:skew-x-12 transition-transform">Skew</button>) },
    { id: 'btn-rotate-180', name: 'Rotate 180', description: 'Botão que rotaciona 180 graus ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:rotate-180 transition-transform">Rotate 180</button>) },
    { id: 'btn-rotate-90', name: 'Rotate 90', description: 'Botão que rotaciona 90 graus ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:rotate-90 transition-transform">Rotate 90</button>) },
    { id: 'btn-flip-horizontal', name: 'Flip Horizontal', description: 'Botão que vira horizontalmente ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-x-[-1] transition-transform">Flip H</button>) },
    { id: 'btn-flip-vertical', name: 'Flip Vertical', description: 'Botão que vira verticalmente ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-y-[-1] transition-transform">Flip V</button>) },
    { id: 'btn-3d-lift', name: '3D Lift', description: 'Botão com efeito 3D de elevação', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:translate-y-[-4px] hover:shadow-2xl transition-all">3D Lift</button>) },
    { id: 'btn-3d-press', name: '3D Press', description: 'Botão com efeito 3D de pressão', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg active:translate-y-1 active:shadow-md transition-all">3D Press</button>) },
    { id: 'btn-gradient-vertical', name: 'Gradient Vertical', description: 'Botão com gradiente vertical animado', component: (<button className="px-6 py-3 bg-gradient-to-b from-brand-green to-brand-blue-900 text-white font-semibold rounded-lg hover:from-brand-blue-900 hover:to-brand-green transition-all">Gradient V</button>) },
    { id: 'btn-gradient-diagonal', name: 'Gradient Diagonal', description: 'Botão com gradiente diagonal animado', component: (<button className="px-6 py-3 bg-gradient-to-br from-brand-green via-brand-blue-900 to-brand-green text-white font-semibold rounded-lg hover:from-brand-blue-900 hover:via-brand-green hover:to-brand-blue-900 transition-all">Gradient D</button>) },
    { id: 'btn-ripple', name: 'Ripple', description: 'Botão com efeito ripple ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:ring-4 hover:ring-brand-green/50 transition-all">Ripple</button>) },
    { id: 'btn-border-animated', name: 'Border Animated', description: 'Botão com borda animada', component: (<button className="px-6 py-3 bg-transparent border-2 border-brand-green text-brand-green font-semibold rounded-lg hover:border-brand-blue-900 hover:bg-brand-green hover:text-brand-blue-900 transition-all">Border</button>) },
    { id: 'btn-text-underline', name: 'Text Underline', description: 'Botão com sublinhado animado', component: (<button className="px-6 py-3 bg-transparent text-brand-green font-semibold rounded-lg hover:underline hover:underline-offset-4 transition-all">Underline</button>) },
    { id: 'btn-text-grow', name: 'Text Grow', description: 'Botão com texto que cresce ao hover', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:text-lg transition-all">Text Grow</button>) },
    { id: 'btn-icon-spin', name: 'Icon Spin', description: 'Botão com ícone que rotaciona', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg flex items-center gap-2 hover:[&_svg]:rotate-180 transition-all"><LucideLoader className="w-5 h-5" />Spin Icon</button>) },
    { id: 'btn-icon-bounce', name: 'Icon Bounce', description: 'Botão com ícone que pula', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg flex items-center gap-2 hover:[&_svg]:animate-bounce transition-all"><LucideHeart className="w-5 h-5" />Bounce Icon</button>) },
    { id: 'btn-icon-pulse', name: 'Icon Pulse', description: 'Botão com ícone que pulsa', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg flex items-center gap-2 hover:[&_svg]:animate-pulse transition-all"><LucideStar className="w-5 h-5" />Pulse Icon</button>) },
    { id: 'btn-shadow-animated', name: 'Shadow Animated', description: 'Botão com sombra animada', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg shadow-lg hover:shadow-[0_0_30px_rgba(135,197,8,0.8)] transition-shadow">Shadow</button>) },
    { id: 'btn-backdrop-blur', name: 'Backdrop Blur', description: 'Botão com backdrop blur', component: (<button className="px-6 py-3 bg-brand-green/80 backdrop-blur-sm text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green hover:backdrop-blur-none transition-all">Blur</button>) },
    { id: 'btn-neon', name: 'Neon', description: 'Botão com efeito neon', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:shadow-[0_0_10px_rgba(135,197,8,1),0_0_20px_rgba(135,197,8,0.8)] transition-all">Neon</button>) },
    { id: 'btn-magnetic', name: 'Magnetic', description: 'Botão com efeito magnético', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-105 hover:shadow-xl transition-all">Magnetic</button>) },
    { id: 'btn-elastic', name: 'Elastic', description: 'Botão com efeito elástico', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-110 active:scale-95 transition-transform">Elastic</button>) },
    { id: 'btn-squash', name: 'Squash', description: 'Botão com efeito de compressão', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-x-110 hover:scale-y-95 transition-transform">Squash</button>) },
    { id: 'btn-stretch', name: 'Stretch', description: 'Botão com efeito de esticamento', component: (<button className="px-6 py-3 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:scale-x-95 hover:scale-y-110 transition-transform">Stretch</button>) },
  ];

  // Biblioteca de Cards Animados
  const animatedCards = [
    {
      id: 'card-basic-hover-lift',
      name: 'Basic Hover Lift',
      description: 'Card básico que se eleva ao hover',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Hover Lift</h3>
          <p className="text-gray-600 font-poppins">Card que se eleva ao passar o mouse.</p>
        </div>
      )
    },
    {
      id: 'card-basic-flip',
      name: 'Basic Flip',
      description: 'Card básico com efeito de flip',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:rotateY(180deg)] transition-transform duration-500 perspective-1000">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Flip</h3>
          <p className="text-gray-600 font-poppins">Card com efeito de rotação 3D.</p>
        </div>
      )
    },
    {
      id: 'card-basic-glow',
      name: 'Basic Glow',
      description: 'Card básico com efeito de brilho',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-[0_0_30px_rgba(135,197,8,0.4)] transition-all duration-300">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Glow</h3>
          <p className="text-gray-600 font-poppins">Card com efeito de brilho ao hover.</p>
        </div>
      )
    },
    {
      id: 'card-basic-scale',
      name: 'Basic Scale',
      description: 'Card básico que aumenta ao hover',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Scale</h3>
          <p className="text-gray-600 font-poppins">Card que aumenta de tamanho ao hover.</p>
        </div>
      )
    },
    {
      id: 'card-basic-shimmer',
      name: 'Basic Shimmer',
      description: 'Card básico com efeito shimmer',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium relative z-10">Card Shimmer</h3>
          <p className="text-gray-600 font-poppins relative z-10">Card com efeito de brilho deslizante.</p>
        </div>
      )
    },
    {
      id: 'card-basic-rotate',
      name: 'Basic Rotate',
      description: 'Card básico que rotaciona ao hover',
      component: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rotate-2 transition-transform duration-300">
          <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3>
          <p className="text-gray-600 font-poppins">Card que rotaciona levemente ao hover.</p>
        </div>
      )
    },
    // Mais cards animados - Parte 1
    { id: 'card-basic-shake', name: 'Basic Shake', description: 'Card básico com animação de tremor', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:animate-[shake_0.5s] transition-all"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Shake</h3><p className="text-gray-600 font-poppins">Card com tremor ao hover.</p></div>) },
    { id: 'card-basic-bounce', name: 'Basic Bounce', description: 'Card básico com animação de pulo', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:animate-bounce transition-all"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Bounce</h3><p className="text-gray-600 font-poppins">Card que pula ao hover.</p></div>) },
    { id: 'card-basic-pulse', name: 'Basic Pulse', description: 'Card básico com animação de pulsação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:animate-pulse transition-all"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Pulse</h3><p className="text-gray-600 font-poppins">Card que pulsa ao hover.</p></div>) },
    { id: 'card-basic-wiggle', name: 'Basic Wiggle', description: 'Card básico com animação de balanço', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:animate-[wiggle_1s_ease-in-out_infinite] transition-all"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Wiggle</h3><p className="text-gray-600 font-poppins">Card que balança ao hover.</p></div>) },
    { id: 'card-basic-float', name: 'Basic Float', description: 'Card básico com animação de flutuação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:animate-[float_3s_ease-in-out_infinite] transition-all"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Float</h3><p className="text-gray-600 font-poppins">Card que flutua ao hover.</p></div>) },
    { id: 'card-colored-hover-lift', name: 'Colored Hover Lift', description: 'Card colorido que se eleva ao hover', component: (<div className="bg-gradient-to-br from-brand-green to-brand-blue-900 rounded-lg p-6 text-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><h3 className="text-lg font-bold mb-2 font-poppins font-medium">Card Lift</h3><p className="text-white/90 font-poppins">Card colorido que se eleva.</p></div>) },
    { id: 'card-colored-glow', name: 'Colored Glow', description: 'Card colorido com efeito de brilho', component: (<div className="bg-gradient-to-br from-brand-green to-brand-blue-900 rounded-lg p-6 text-white shadow-sm hover:shadow-[0_0_30px_rgba(135,197,8,0.6)] transition-all duration-300"><h3 className="text-lg font-bold mb-2 font-poppins font-medium">Card Glow</h3><p className="text-white/90 font-poppins">Card colorido com brilho.</p></div>) },
    { id: 'card-colored-scale', name: 'Colored Scale', description: 'Card colorido que aumenta ao hover', component: (<div className="bg-gradient-to-br from-brand-green to-brand-blue-900 rounded-lg p-6 text-white shadow-sm hover:scale-105 transition-transform duration-300"><h3 className="text-lg font-bold mb-2 font-poppins font-medium">Card Scale</h3><p className="text-white/90 font-poppins">Card colorido que aumenta.</p></div>) },
    { id: 'card-with-icon-hover-lift', name: 'With Icon Hover Lift', description: 'Card com ícone que se eleva ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center"><LucideStar className="w-6 h-6 text-brand-green" /></div><h3 className="text-lg font-bold text-brand-blue-900 font-poppins font-medium">Card Lift</h3></div><p className="text-gray-600 font-poppins">Card com ícone que se eleva.</p></div>) },
    { id: 'card-with-icon-glow', name: 'With Icon Glow', description: 'Card com ícone e efeito de brilho', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-[0_0_30px_rgba(135,197,8,0.4)] transition-all duration-300"><div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center"><LucideStar className="w-6 h-6 text-brand-green" /></div><h3 className="text-lg font-bold text-brand-blue-900 font-poppins font-medium">Card Glow</h3></div><p className="text-gray-600 font-poppins">Card com ícone e brilho.</p></div>) },
    { id: 'card-with-image-hover-lift', name: 'With Image Hover Lift', description: 'Card com imagem que se eleva ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><div className="h-32 bg-gradient-to-br from-brand-green to-brand-blue-900"></div><div className="p-6"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Lift</h3><p className="text-gray-600 font-poppins">Card com imagem que se eleva.</p></div></div>) },
    { id: 'card-stats-hover-lift', name: 'Stats Hover Lift', description: 'Card de estatísticas que se eleva ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><div className="flex items-center justify-between mb-4"><h3 className="text-sm font-medium text-gray-600 font-poppins">Total</h3><LucideUsers className="w-5 h-5 text-brand-green" /></div><p className="text-3xl font-bold text-brand-blue-900 font-poppins font-medium">1,234</p><p className="text-sm text-green-600 mt-2 font-poppins">+12%</p></div>) },
    { id: 'card-action-hover-lift', name: 'Action Hover Lift', description: 'Card com ação que se eleva ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Lift</h3><p className="text-gray-600 mb-4 font-poppins">Card com ação.</p><button className="w-full px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors">Ação</button></div>) },
    { id: 'card-bordered-hover-lift', name: 'Bordered Hover Lift', description: 'Card com borda colorida que se eleva', component: (<div className="bg-white rounded-lg border-l-4 border-brand-green p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Lift</h3><p className="text-gray-600 font-poppins">Card com borda que se eleva.</p></div>) },
    { id: 'card-minimal-hover-lift', name: 'Minimal Hover Lift', description: 'Card minimalista que se eleva ao hover', component: (<div className="bg-white rounded-lg p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Lift</h3><p className="text-gray-600 font-poppins">Card minimalista que se eleva.</p></div>) },
    { id: 'card-gradient-hover-lift', name: 'Gradient Hover Lift', description: 'Card gradiente que se eleva ao hover', component: (<div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"><h3 className="text-lg font-bold mb-2 font-poppins font-medium">Card Lift</h3><p className="text-white/90 font-poppins">Card gradiente que se eleva.</p></div>) },
    { id: 'card-outlined-hover-lift', name: 'Outlined Hover Lift', description: 'Card outline que se eleva ao hover', component: (<div className="bg-transparent rounded-lg border-2 border-brand-green p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Lift</h3><p className="text-gray-600 font-poppins">Card outline que se eleva.</p></div>) },
    { id: 'card-basic-flip-3d', name: 'Basic Flip 3D', description: 'Card básico com flip 3D', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:rotateY(180deg)] transition-transform duration-500 perspective-1000"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Flip</h3><p className="text-gray-600 font-poppins">Card com flip 3D.</p></div>) },
    { id: 'card-basic-shimmer-advanced', name: 'Basic Shimmer Advanced', description: 'Card básico com shimmer avançado', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm relative overflow-hidden group"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium relative z-10">Card Shimmer</h3><p className="text-gray-600 font-poppins relative z-10">Card com shimmer avançado.</p></div>) },
    { id: 'card-basic-rotate-advanced', name: 'Basic Rotate Advanced', description: 'Card básico com rotação avançada', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rotate-6 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3><p className="text-gray-600 font-poppins">Card com rotação avançada.</p></div>) },
    { id: 'card-basic-skew', name: 'Basic Skew', description: 'Card básico com inclinação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:skew-x-3 hover:skew-y-1 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Skew</h3><p className="text-gray-600 font-poppins">Card com inclinação.</p></div>) },
    { id: 'card-basic-zoom', name: 'Basic Zoom', description: 'Card básico com zoom', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-110 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Zoom</h3><p className="text-gray-600 font-poppins">Card com zoom.</p></div>) },
    { id: 'card-basic-shrink', name: 'Basic Shrink', description: 'Card básico que encolhe ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-95 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Shrink</h3><p className="text-gray-600 font-poppins">Card que encolhe.</p></div>) },
    { id: 'card-basic-fade', name: 'Basic Fade', description: 'Card básico com fade', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:opacity-80 transition-opacity duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Fade</h3><p className="text-gray-600 font-poppins">Card com fade.</p></div>) },
    { id: 'card-basic-brightness', name: 'Basic Brightness', description: 'Card básico com brilho', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:brightness-110 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Bright</h3><p className="text-gray-600 font-poppins">Card com brilho.</p></div>) },
    { id: 'card-basic-contrast', name: 'Basic Contrast', description: 'Card básico com contraste', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:contrast-125 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Contrast</h3><p className="text-gray-600 font-poppins">Card com contraste.</p></div>) },
    { id: 'card-basic-saturate', name: 'Basic Saturate', description: 'Card básico com saturação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:saturate-150 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Saturate</h3><p className="text-gray-600 font-poppins">Card com saturação.</p></div>) },
    { id: 'card-basic-blur', name: 'Basic Blur', description: 'Card básico com blur', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:blur-sm transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Blur</h3><p className="text-gray-600 font-poppins">Card com blur.</p></div>) },
    { id: 'card-basic-grayscale', name: 'Basic Grayscale', description: 'Card básico com escala de cinza', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:grayscale transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Gray</h3><p className="text-gray-600 font-poppins">Card em escala de cinza.</p></div>) },
    { id: 'card-basic-sepia', name: 'Basic Sepia', description: 'Card básico com efeito sépia', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:sepia transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Sepia</h3><p className="text-gray-600 font-poppins">Card com efeito sépia.</p></div>) },
    { id: 'card-basic-invert', name: 'Basic Invert', description: 'Card básico com inversão', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:invert transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Invert</h3><p className="text-gray-600 font-poppins">Card com inversão.</p></div>) },
    { id: 'card-basic-hue-rotate', name: 'Basic Hue Rotate', description: 'Card básico com rotação de matiz', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:hue-rotate-90 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Hue</h3><p className="text-gray-600 font-poppins">Card com rotação de matiz.</p></div>) },
    { id: 'card-basic-backdrop-blur', name: 'Basic Backdrop Blur', description: 'Card básico com backdrop blur', component: (<div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6 shadow-sm hover:backdrop-blur-md transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Blur</h3><p className="text-gray-600 font-poppins">Card com backdrop blur.</p></div>) },
    { id: 'card-basic-shadow-color', name: 'Basic Shadow Color', description: 'Card básico com sombra colorida', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-[0_0_20px_rgba(135,197,8,0.5)] transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Shadow</h3><p className="text-gray-600 font-poppins">Card com sombra colorida.</p></div>) },
    { id: 'card-basic-border-glow', name: 'Basic Border Glow', description: 'Card básico com borda brilhante', component: (<div className="bg-white rounded-lg border-2 border-brand-green p-6 shadow-sm hover:border-brand-blue-900 hover:shadow-[0_0_15px_rgba(135,197,8,0.6)] transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Border</h3><p className="text-gray-600 font-poppins">Card com borda brilhante.</p></div>) },
    { id: 'card-basic-text-shadow', name: 'Basic Text Shadow', description: 'Card básico com sombra no texto', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[&_h3]:drop-shadow-lg transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Text</h3><p className="text-gray-600 font-poppins">Card com sombra no texto.</p></div>) },
    { id: 'card-basic-gradient-border', name: 'Basic Gradient Border', description: 'Card básico com borda gradiente', component: (<div className="bg-white rounded-lg p-6 shadow-sm border-2 border-transparent bg-clip-padding hover:border-gradient-to-r hover:from-brand-green hover:to-brand-blue-900 transition-all duration-300" style={{backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #87c508, #011526)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Border</h3><p className="text-gray-600 font-poppins">Card com borda gradiente.</p></div>) },
    { id: 'card-basic-3d-perspective', name: 'Basic 3D Perspective', description: 'Card básico com perspectiva 3D', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:perspective(1000px)_rotateX(10deg)] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card 3D</h3><p className="text-gray-600 font-poppins">Card com perspectiva 3D.</p></div>) },
    { id: 'card-basic-3d-rotate', name: 'Basic 3D Rotate', description: 'Card básico com rotação 3D', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:perspective(1000px)_rotateY(15deg)] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card 3D</h3><p className="text-gray-600 font-poppins">Card com rotação 3D.</p></div>) },
    { id: 'card-basic-3d-combined', name: 'Basic 3D Combined', description: 'Card básico com transformações 3D combinadas', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:perspective(1000px)_rotateX(5deg)_rotateY(5deg)_translateZ(20px)] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card 3D</h3><p className="text-gray-600 font-poppins">Card com 3D combinado.</p></div>) },
    { id: 'card-basic-morph', name: 'Basic Morph', description: 'Card básico com morphing', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rounded-3xl transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Morph</h3><p className="text-gray-600 font-poppins">Card com morphing.</p></div>) },
    { id: 'card-basic-expand', name: 'Basic Expand', description: 'Card básico que expande ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-105 hover:shadow-2xl transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Expand</h3><p className="text-gray-600 font-poppins">Card que expande.</p></div>) },
    { id: 'card-basic-contract', name: 'Basic Contract', description: 'Card básico que contrai ao hover', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-95 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Contract</h3><p className="text-gray-600 font-poppins">Card que contrai.</p></div>) },
    { id: 'card-basic-slide-up', name: 'Basic Slide Up', description: 'Card básico que desliza para cima', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:-translate-y-4 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Slide</h3><p className="text-gray-600 font-poppins">Card que desliza para cima.</p></div>) },
    { id: 'card-basic-slide-down', name: 'Basic Slide Down', description: 'Card básico que desliza para baixo', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:translate-y-4 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Slide</h3><p className="text-gray-600 font-poppins">Card que desliza para baixo.</p></div>) },
    { id: 'card-basic-slide-left', name: 'Basic Slide Left', description: 'Card básico que desliza para esquerda', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:-translate-x-4 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Slide</h3><p className="text-gray-600 font-poppins">Card que desliza para esquerda.</p></div>) },
    { id: 'card-basic-slide-right', name: 'Basic Slide Right', description: 'Card básico que desliza para direita', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:translate-x-4 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Slide</h3><p className="text-gray-600 font-poppins">Card que desliza para direita.</p></div>) },
    { id: 'card-basic-tilt', name: 'Basic Tilt', description: 'Card básico com inclinação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:perspective(1000px)_rotateX(5deg)_rotateY(5deg)] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Tilt</h3><p className="text-gray-600 font-poppins">Card com inclinação.</p></div>) },
    { id: 'card-basic-wave', name: 'Basic Wave', description: 'Card básico com efeito de onda', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:animate-[wiggle_2s_ease-in-out_infinite] transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Wave</h3><p className="text-gray-600 font-poppins">Card com efeito de onda.</p></div>) },
    { id: 'card-basic-elastic', name: 'Basic Elastic', description: 'Card básico com efeito elástico', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-110 active:scale-95 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Elastic</h3><p className="text-gray-600 font-poppins">Card com efeito elástico.</p></div>) },
    { id: 'card-basic-rubber', name: 'Basic Rubber', description: 'Card básico com efeito de borracha', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-x-110 hover:scale-y-95 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rubber</h3><p className="text-gray-600 font-poppins">Card com efeito de borracha.</p></div>) },
    { id: 'card-basic-stretch', name: 'Basic Stretch', description: 'Card básico com efeito de esticamento', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-x-95 hover:scale-y-110 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Stretch</h3><p className="text-gray-600 font-poppins">Card com esticamento.</p></div>) },
    { id: 'card-basic-squash', name: 'Basic Squash', description: 'Card básico com efeito de compressão', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-x-110 hover:scale-y-90 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Squash</h3><p className="text-gray-600 font-poppins">Card com compressão.</p></div>) },
    { id: 'card-basic-neon', name: 'Basic Neon', description: 'Card básico com efeito neon', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-[0_0_10px_rgba(135,197,8,1),0_0_20px_rgba(135,197,8,0.8),0_0_30px_rgba(135,197,8,0.6)] transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Neon</h3><p className="text-gray-600 font-poppins">Card com efeito neon.</p></div>) },
    { id: 'card-basic-holographic', name: 'Basic Holographic', description: 'Card básico com efeito holográfico', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:bg-gradient-to-r hover:from-brand-green hover:via-brand-blue-900 hover:to-brand-green hover:bg-[length:200%_100%] hover:animate-[gradient_3s_linear_infinite] transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Holographic</h3><p className="text-gray-600 font-poppins">Card com efeito holográfico.</p></div>) },
    { id: 'card-basic-magnetic', name: 'Basic Magnetic', description: 'Card básico com efeito magnético', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-105 hover:shadow-2xl hover:border-brand-green transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Magnetic</h3><p className="text-gray-600 font-poppins">Card com efeito magnético.</p></div>) },
    { id: 'card-basic-glass', name: 'Basic Glass', description: 'Card básico com efeito de vidro', component: (<div className="bg-white/80 backdrop-blur-md rounded-lg border border-gray-200/50 p-6 shadow-sm hover:bg-white/90 hover:backdrop-blur-lg transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Glass</h3><p className="text-gray-600 font-poppins">Card com efeito de vidro.</p></div>) },
    { id: 'card-basic-frosted', name: 'Basic Frosted', description: 'Card básico com efeito fosco', component: (<div className="bg-white/70 backdrop-blur-lg rounded-lg border border-gray-200/30 p-6 shadow-sm hover:bg-white/90 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Frosted</h3><p className="text-gray-600 font-poppins">Card com efeito fosco.</p></div>) },
    { id: 'card-basic-mirror', name: 'Basic Mirror', description: 'Card básico com efeito de espelho', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-x-[-1] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Mirror</h3><p className="text-gray-600 font-poppins">Card com efeito de espelho.</p></div>) },
    { id: 'card-basic-flip-horizontal', name: 'Basic Flip Horizontal', description: 'Card básico que vira horizontalmente', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-x-[-1] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Flip</h3><p className="text-gray-600 font-poppins">Card que vira horizontalmente.</p></div>) },
    { id: 'card-basic-flip-vertical', name: 'Basic Flip Vertical', description: 'Card básico que vira verticalmente', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-y-[-1] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Flip</h3><p className="text-gray-600 font-poppins">Card que vira verticalmente.</p></div>) },
    { id: 'card-basic-rotate-360', name: 'Basic Rotate 360', description: 'Card básico que rotaciona 360 graus', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rotate-360 transition-transform duration-500"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3><p className="text-gray-600 font-poppins">Card que rotaciona 360°.</p></div>) },
    { id: 'card-basic-rotate-180', name: 'Basic Rotate 180', description: 'Card básico que rotaciona 180 graus', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rotate-180 transition-transform duration-500"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3><p className="text-gray-600 font-poppins">Card que rotaciona 180°.</p></div>) },
    { id: 'card-basic-rotate-90', name: 'Basic Rotate 90', description: 'Card básico que rotaciona 90 graus', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rotate-90 transition-transform duration-500"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3><p className="text-gray-600 font-poppins">Card que rotaciona 90°.</p></div>) },
    { id: 'card-basic-rotate-45', name: 'Basic Rotate 45', description: 'Card básico que rotaciona 45 graus', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:rotate-45 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3><p className="text-gray-600 font-poppins">Card que rotaciona 45°.</p></div>) },
    { id: 'card-basic-rotate-negative', name: 'Basic Rotate Negative', description: 'Card básico que rotaciona negativamente', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:-rotate-6 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate</h3><p className="text-gray-600 font-poppins">Card que rotaciona negativamente.</p></div>) },
    { id: 'card-basic-scale-x', name: 'Basic Scale X', description: 'Card básico que escala no eixo X', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-x-110 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Scale X</h3><p className="text-gray-600 font-poppins">Card que escala no eixo X.</p></div>) },
    { id: 'card-basic-scale-y', name: 'Basic Scale Y', description: 'Card básico que escala no eixo Y', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-y-110 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Scale Y</h3><p className="text-gray-600 font-poppins">Card que escala no eixo Y.</p></div>) },
    { id: 'card-basic-translate-z', name: 'Basic Translate Z', description: 'Card básico que se move no eixo Z', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:translateZ(30px)] transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Translate Z</h3><p className="text-gray-600 font-poppins">Card que se move no eixo Z.</p></div>) },
    { id: 'card-basic-rotate-x', name: 'Basic Rotate X', description: 'Card básico que rotaciona no eixo X', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:rotateX(15deg)] transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate X</h3><p className="text-gray-600 font-poppins">Card que rotaciona no eixo X.</p></div>) },
    { id: 'card-basic-rotate-y', name: 'Basic Rotate Y', description: 'Card básico que rotaciona no eixo Y', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:rotateY(15deg)] transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate Y</h3><p className="text-gray-600 font-poppins">Card que rotaciona no eixo Y.</p></div>) },
    { id: 'card-basic-rotate-z', name: 'Basic Rotate Z', description: 'Card básico que rotaciona no eixo Z', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:rotateZ(15deg)] transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Rotate Z</h3><p className="text-gray-600 font-poppins">Card que rotaciona no eixo Z.</p></div>) },
    { id: 'card-basic-combined-3d', name: 'Basic Combined 3D', description: 'Card básico com múltiplas transformações 3D', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:perspective(1000px)_rotateX(10deg)_rotateY(10deg)_translateZ(25px)] transition-transform duration-300" style={{transformStyle: 'preserve-3d'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card 3D</h3><p className="text-gray-600 font-poppins">Card com múltiplas transformações 3D.</p></div>) },
    { id: 'card-basic-zoom-in', name: 'Basic Zoom In', description: 'Card básico com zoom in', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-125 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Zoom In</h3><p className="text-gray-600 font-poppins">Card com zoom in.</p></div>) },
    { id: 'card-basic-zoom-out', name: 'Basic Zoom Out', description: 'Card básico com zoom out', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-75 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Zoom Out</h3><p className="text-gray-600 font-poppins">Card com zoom out.</p></div>) },
    { id: 'card-basic-fade-in-out', name: 'Basic Fade In Out', description: 'Card básico com fade in/out', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:opacity-50 transition-opacity duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Fade</h3><p className="text-gray-600 font-poppins">Card com fade in/out.</p></div>) },
    { id: 'card-basic-slide-rotate', name: 'Basic Slide Rotate', description: 'Card básico com deslizamento e rotação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:translate-x-4 hover:rotate-6 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Slide Rotate</h3><p className="text-gray-600 font-poppins">Card com deslizamento e rotação.</p></div>) },
    { id: 'card-basic-scale-rotate', name: 'Basic Scale Rotate', description: 'Card básico com escala e rotação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-110 hover:rotate-6 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Scale Rotate</h3><p className="text-gray-600 font-poppins">Card com escala e rotação.</p></div>) },
    { id: 'card-basic-lift-rotate', name: 'Basic Lift Rotate', description: 'Card básico que se eleva e rotaciona', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:-translate-y-4 hover:rotate-6 hover:shadow-2xl transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Lift Rotate</h3><p className="text-gray-600 font-poppins">Card que se eleva e rotaciona.</p></div>) },
    { id: 'card-basic-glow-rotate', name: 'Basic Glow Rotate', description: 'Card básico com brilho e rotação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-[0_0_30px_rgba(135,197,8,0.6)] hover:rotate-6 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Glow Rotate</h3><p className="text-gray-600 font-poppins">Card com brilho e rotação.</p></div>) },
    { id: 'card-basic-shimmer-rotate', name: 'Basic Shimmer Rotate', description: 'Card básico com shimmer e rotação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm relative overflow-hidden group hover:rotate-6 transition-all duration-300"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium relative z-10">Card Shimmer Rotate</h3><p className="text-gray-600 font-poppins relative z-10">Card com shimmer e rotação.</p></div>) },
    { id: 'card-basic-flip-rotate', name: 'Basic Flip Rotate', description: 'Card básico com flip e rotação', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:rotateY(180deg)_rotateZ(10deg)] transition-transform duration-500 perspective-1000"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Flip Rotate</h3><p className="text-gray-600 font-poppins">Card com flip e rotação.</p></div>) },
    { id: 'card-basic-3d-complex', name: 'Basic 3D Complex', description: 'Card básico com transformações 3D complexas', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:perspective(1000px)_rotateX(15deg)_rotateY(15deg)_rotateZ(5deg)_translateZ(30px)] transition-transform duration-500" style={{transformStyle: 'preserve-3d'}}><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card 3D Complex</h3><p className="text-gray-600 font-poppins">Card com 3D complexo.</p></div>) },
    { id: 'card-basic-matrix', name: 'Basic Matrix', description: 'Card básico com efeito matrix', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:[transform:matrix(1.1,0.1,-0.1,1.1,0,0)] transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Matrix</h3><p className="text-gray-600 font-poppins">Card com efeito matrix.</p></div>) },
    { id: 'card-basic-skew-combined', name: 'Basic Skew Combined', description: 'Card básico com inclinação combinada', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:skew-x-6 hover:skew-y-3 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Skew</h3><p className="text-gray-600 font-poppins">Card com inclinação combinada.</p></div>) },
    { id: 'card-basic-translate-combined', name: 'Basic Translate Combined', description: 'Card básico com translação combinada', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:translate-x-4 hover:translate-y-4 transition-transform duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card Translate</h3><p className="text-gray-600 font-poppins">Card com translação combinada.</p></div>) },
    { id: 'card-basic-all-transforms', name: 'Basic All Transforms', description: 'Card básico com todas as transformações', component: (<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:scale-110 hover:rotate-6 hover:skew-x-3 hover:translate-x-4 hover:translate-y-4 transition-all duration-300"><h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">Card All</h3><p className="text-gray-600 font-poppins">Card com todas as transformações.</p></div>) },
  ];

  const copyToClipboard = async (id) => {
    try {
      // Tentar usar a API moderna do clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = id;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
          console.error('Erro ao copiar:', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err);
      // Mesmo com erro, mostrar feedback visual
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Adicionar estilos CSS customizados para animações
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes wiggle {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Definir subcategoria padrão quando o menu mudar
  useEffect(() => {
    if (activeMenu && !activeSubCategory) {
      setActiveSubCategory('normal');
    }
  }, [activeMenu, activeSubCategory]);

  const openModal = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setModalItem(null);
    setModalType(null);
  };

  const renderSubCategoryPanel = (categories) => {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setActiveSubCategory(category.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              activeSubCategory === category.id
                ? 'border-brand-green bg-brand-green/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {category.icon && <category.icon className="w-5 h-5" style={{ color: activeSubCategory === category.id ? '#87c508' : '#666' }} />}
              <h3 className={`font-semibold font-poppins font-medium ${
                activeSubCategory === category.id ? 'text-brand-blue-900' : 'text-gray-700'
              }`}>
                {category.name}
              </h3>
            </div>
            {category.description && (
              <p className="text-xs text-gray-600 font-poppins">{category.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderLibraryContent = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-brand-blue-900 mb-6 font-poppins font-medium">Biblioteca de Componentes Animados</h2>
        
        {/* Ícones Animados */}
        <div>
          <h3 className="text-xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Ícones Animados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animatedIcons.map((icon) => (
              <div
                key={icon.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => openModal(icon, 'icon')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center justify-center mb-4 min-h-[80px]">
                  {icon.component}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{icon.name}</h4>
                    <p className="text-sm text-gray-600 font-poppins">{icon.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(icon.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copiar ID"
                  >
                    {copiedId === icon.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-2 font-poppins">ID: {icon.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botões Animados */}
        <div>
          <h3 className="text-xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Botões Animados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animatedButtons.map((button) => (
              <div
                key={button.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => openModal(button, 'button')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center justify-center mb-4 min-h-[60px]">
                  {button.component}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{button.name}</h4>
                    <p className="text-sm text-gray-600 font-poppins">{button.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(button.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copiar ID"
                  >
                    {copiedId === button.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-2 font-poppins">ID: {button.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cards Animados */}
        <div>
          <h3 className="text-xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Cards Animados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animatedCards.map((card) => (
              <div
                key={card.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => openModal(card, 'card')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="mb-4">
                  {card.component}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{card.name}</h4>
                    <p className="text-sm text-gray-600 font-poppins">{card.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(card.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copiar ID"
                  >
                    {copiedId === card.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-2 font-poppins">ID: {card.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderIconsContent = () => {
    const subCategories = [
      { 
        id: 'normal', 
        name: 'Ícones Normais', 
        description: 'Bibliotecas de ícones estáticos',
        icon: Image
      },
      { 
        id: 'animated', 
        name: 'Ícones Animados', 
        description: 'Ícones com animações',
        icon: Sparkles
      },
    ];

    return (
      <div className="flex h-full">
        {/* Painel Esquerdo com Subcategorias */}
        {renderSubCategoryPanel(subCategories)}
        
        {/* Conteúdo Direito */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubCategory === 'normal' && (
            <>
              {!activeLibrary ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Bibliotecas de Ícones</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {iconLibraries.map((library) => (
                      <div
                        key={library.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setActiveLibrary(library.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${library.color}20` }}
                            >
                              <Package className="w-6 h-6" style={{ color: library.color }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-brand-blue-900 font-poppins font-medium">{library.name}</h3>
                              <p className="text-sm text-gray-600 font-poppins">{library.icons.length} ícones disponíveis</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <button
                          className="w-full px-4 py-2 bg-brand-green text-brand-blue-900 font-semibold rounded-lg hover:bg-brand-green/90 transition-colors font-poppins font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLibrary(library.id);
                          }}
                        >
                          Ver Todos os Ícones
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setActiveLibrary(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
                        {iconLibraries.find(lib => lib.id === activeLibrary)?.name}
                      </h2>
                      <p className="text-sm text-gray-600 font-poppins">
                        {iconLibraries.find(lib => lib.id === activeLibrary)?.icons.length} ícones disponíveis
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {iconLibraries.find(lib => lib.id === activeLibrary)?.icons.map((icon) => {
                      const IconComponent = icon.component;
                      const library = iconLibraries.find(lib => lib.id === activeLibrary);
                      return (
                        <div
                          key={icon.id}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group relative"
                          onClick={() => copyToClipboard(icon.id)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal({ ...icon, library: library.name, color: library.color }, 'icon');
                            }}
                            className="absolute top-1 right-1 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                            title="Ver detalhes"
                          >
                            <Eye className="w-3 h-3 text-gray-600" />
                          </button>
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center">
                              <IconComponent className="w-6 h-6" style={{ color: library.color }} />
                            </div>
                            <p className="text-xs font-medium text-gray-700 text-center font-poppins">{icon.name}</p>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {copiedId === icon.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-500 font-poppins">
                                {copiedId === icon.id ? 'Copiado!' : 'Clique para copiar ID'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeSubCategory === 'animated' && (
            <div>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-6 font-poppins font-medium">Ícones Animados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animatedIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={() => openModal(icon, 'icon')}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center mb-4 min-h-[80px]">
                      {icon.component}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{icon.name}</h4>
                        <p className="text-sm text-gray-600 font-poppins">{icon.description}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(icon.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copiar ID"
                      >
                        {copiedId === icon.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-2 font-poppins">ID: {icon.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderButtonsContent = () => {
    const subCategories = [
      { 
        id: 'normal', 
        name: 'Botões Normais', 
        description: 'Estilos de botões estáticos',
        icon: Image
      },
      { 
        id: 'animated', 
        name: 'Botões Animados', 
        description: 'Botões com animações',
        icon: Sparkles
      },
    ];

    return (
      <div className="flex h-full">
        {/* Painel Esquerdo com Subcategorias */}
        {renderSubCategoryPanel(subCategories)}
        
        {/* Conteúdo Direito */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubCategory === 'normal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Estilos de Botões</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buttonStyles.map((button) => (
                  <div
                    key={button.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => openModal(button, 'button')}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(button.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Copiar ID"
                      >
                        {copiedId === button.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-brand-green transition-colors" />
                        )}
                      </button>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{button.name}</h3>
                    </div>
                    <div className="flex justify-center mb-3">
                      {button.component}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-mono font-poppins">ID: {button.id}</p>
                      {copiedId === button.id && (
                        <p className="text-xs text-green-500 mt-1 font-poppins">✓ ID copiado!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubCategory === 'animated' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Botões Animados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animatedButtons.map((button) => (
                  <div
                    key={button.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => openModal(button, 'button')}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(button.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Copiar ID"
                      >
                        {copiedId === button.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-brand-green transition-colors" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-center mb-4 min-h-[60px]">
                      {button.component}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{button.name}</h4>
                        <p className="text-sm text-gray-600 font-poppins">{button.description}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-2 font-poppins">ID: {button.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCardsContent = () => {
    const subCategories = [
      { 
        id: 'normal', 
        name: 'Cards Normais', 
        description: 'Estilos de cards estáticos',
        icon: Image
      },
      { 
        id: 'animated', 
        name: 'Cards Animados', 
        description: 'Cards com animações',
        icon: Sparkles
      },
    ];

    return (
      <div className="flex h-full">
        {/* Painel Esquerdo com Subcategorias */}
        {renderSubCategoryPanel(subCategories)}
        
        {/* Conteúdo Direito */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubCategory === 'normal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Estilos de Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardStyles.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => openModal(card, 'card')}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(card.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Copiar ID"
                      >
                        {copiedId === card.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-brand-green transition-colors" />
                        )}
                      </button>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{card.name}</h3>
                    </div>
                    <div className="mb-3">
                      {card.component}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-mono font-poppins">ID: {card.id}</p>
                      {copiedId === card.id && (
                        <p className="text-xs text-green-500 mt-1 font-poppins">✓ ID copiado!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubCategory === 'animated' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium">Cards Animados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animatedCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => openModal(card, 'card')}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(card.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Copiar ID"
                      >
                        {copiedId === card.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-brand-green transition-colors" />
                        )}
                      </button>
                    </div>
                    <div className="mb-4">
                      {card.component}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-brand-blue-900 font-poppins font-medium">{card.name}</h4>
                        <p className="text-sm text-gray-600 font-poppins">{card.description}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-2 font-poppins">ID: {card.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gray-50 rounded-lg overflow-hidden">
      {/* Painel Lateral Esquerdo */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-blue-900 font-poppins font-medium">Design Assets</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {menus.map((menu) => {
            const IconComponent = menu.icon;
            return (
              <button
                key={menu.id}
                onClick={() => {
                  setActiveMenu(menu.id);
                  setActiveSubCategory(null);
                  if (menu.id === 'icons') {
                    setActiveLibrary(null);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 font-poppins font-medium ${
                  activeMenu === menu.id
                    ? 'bg-brand-green text-brand-blue-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{menu.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Container Direito */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeMenu === 'icons' && renderIconsContent()}
        {activeMenu === 'buttons' && renderButtonsContent()}
        {activeMenu === 'cards' && renderCardsContent()}
        {activeMenu === 'library' && renderLibraryContent()}
      </div>

      {/* Modal */}
      {modalItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-brand-blue-900 font-poppins font-medium">
                {modalType === 'icon' ? 'Ícone' : modalType === 'button' ? 'Botão' : 'Card'}: {modalItem.name}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 min-h-[200px]">
                  {modalItem.component}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 font-poppins">Nome</h4>
                  <p className="text-base text-brand-blue-900 font-poppins font-medium">{modalItem.name}</p>
                </div>
                {modalItem.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 font-poppins">Descrição</h4>
                    <p className="text-base text-gray-600 font-poppins">{modalItem.description}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 font-poppins">ID</h4>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800">
                      {modalItem.id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(modalItem.id)}
                      className="p-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green/90 transition-colors"
                      title="Copiar ID"
                    >
                      {copiedId === modalItem.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {modalItem.library && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 font-poppins">Biblioteca</h4>
                    <p className="text-base text-gray-600 font-poppins">{modalItem.library}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignAssets;

