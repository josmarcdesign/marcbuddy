import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Mail, Lock, Save, ArrowLeft, Camera, X } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Atualizar formData e avatarPreview quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAvatarPreview(user.avatar_url || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida' });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB' });
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem' });
      return;
    }

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Foto de perfil atualizada com sucesso!' });
        await refreshUser();
        // Atualizar preview com a URL do servidor
        setAvatarPreview(response.data.data.avatar_url);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao fazer upload da foto de perfil' 
      });
      // Reverter preview em caso de erro
      setAvatarPreview(user?.avatar_url || null);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Tem certeza que deseja remover sua foto de perfil?')) {
      return;
    }

    setRemovingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.delete('/users/avatar');

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Foto de perfil removida com sucesso!' });
        setAvatarPreview(null);
        await refreshUser();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao remover foto de perfil' 
      });
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        await refreshUser();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      setLoading(false);
      return;
    }

    try {
      // TODO: Implementar chamada à API para alterar senha
      // const response = await fetch('/api/user/password', { ... });
      
      // Simulação de sucesso
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha. Verifique a senha atual.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brand-blue-900 hover:text-brand-green transition-colors mb-4 font-poppins"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-brand-blue-900" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-brand-blue-900 font-poppins font-medium">
                Configurações da Conta
              </h1>
              <p className="text-gray-600 font-poppins">
                Gerencie suas informações pessoais e segurança
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem de feedback */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-poppins">{message.text}</p>
          </div>
        )}

        {/* Abas estilo navegador */}
        <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium font-poppins transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-brand-blue-900 border-b-2 border-brand-green'
                  : 'text-gray-600 hover:text-brand-blue-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Informações do Perfil</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 text-sm font-medium font-poppins transition-colors relative ${
                activeTab === 'password'
                  ? 'text-brand-blue-900 border-b-2 border-brand-green'
                  : 'text-gray-600 hover:text-brand-blue-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Alterar Senha</span>
              </div>
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 shadow-sm">
          <div className="p-6">
            {/* Aba: Informações do Perfil */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Upload de Foto de Perfil */}
                <div className="pb-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview.startsWith('data:') || avatarPreview.startsWith('http') ? avatarPreview : avatarPreview}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center border-2 border-gray-200">
                          <User className="w-12 h-12 text-brand-green" />
                        </div>
                      )}
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          disabled={removingAvatar}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        className="hidden"
                        id="avatar-upload"
                      />
                      <div className="flex gap-2">
                        <label
                          htmlFor="avatar-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-brand-blue-900 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors cursor-pointer font-poppins font-medium"
                        >
                          <Camera className="w-4 h-4" />
                          {avatarPreview ? 'Alterar Foto' : 'Adicionar Foto'}
                        </label>
                        {fileInputRef.current?.files[0] && (
                          <button
                            type="button"
                            onClick={handleAvatarUpload}
                            disabled={uploadingAvatar}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-blue-900 text-white rounded-lg font-semibold hover:bg-brand-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-medium"
                          >
                            {uploadingAvatar ? 'Enviando...' : 'Salvar Foto'}
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 font-poppins">
                        Formatos aceitos: JPEG, PNG, GIF, WEBP (máx. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-green text-brand-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}

            {/* Aba: Alterar Senha */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500 font-poppins">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    required
                    minLength={6}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-green text-brand-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-5 h-5" />
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

