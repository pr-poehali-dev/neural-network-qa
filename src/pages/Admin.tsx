import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import SiteSettingsTab from '@/components/admin/SiteSettingsTab';
import ContentTab from '@/components/admin/ContentTab';
import FilesTab from '@/components/admin/FilesTab';
import StatsTab from '@/components/admin/StatsTab';
import QuickButtonsTab from '@/components/admin/QuickButtonsTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import VoiceDiagnostics from '@/components/VoiceDiagnostics';
import FullControlTab from '@/components/admin/FullControlTab';
import VisualEditorTab from '@/components/admin/VisualEditorTab';
import DashboardTab from '@/components/admin/DashboardTab';
import SecurityTab from '@/components/admin/SecurityTab';

const FILE_UPLOAD_URL = 'https://functions.poehali.dev/b58abb29-2429-4b6e-aed0-e5aae54d2240';

const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

interface SiteSettings {
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  footerText: string;
  welcomeMessage: string;
  enableChat: boolean;
  enableVoice: boolean;
  maxFileSize: string;
  allowedTypes: string;
  whatsappNumber?: string;
  telegramUsername?: string;
  telegramBotId?: string;
  telegramAdminChatId?: string;
  openrouterApiKey?: string;
  aiModel?: string;
  enableAiChat?: boolean;
}

interface UploadedFile {
  id?: number;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  isImage?: boolean;
  base64?: string;
  mimeType?: string;
  description?: string;
}

interface CustomPage {
  id: string;
  title: string;
  content: string;
}

export default function Admin() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'site' | 'files' | 'stats' | 'content' | 'buttons' | 'analytics' | 'voice' | 'control' | 'visual' | 'security'>('dashboard');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: 'Богдан AI',
    subtitle: 'Интеллектуальный помощник нового поколения',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    logo: '',
    footerText: '© 2024 Богдан AI. Все права защищены.',
    welcomeMessage: 'Привет! 👋 Я помощник Богдан. Задавайте мне вопросы, и я отвечу на основе загруженных документов.',
    enableChat: true,
    enableVoice: true,
    maxFileSize: '10',
    allowedTypes: '.txt,.pdf,.doc,.docx,.json,.jpg,.jpeg,.png,.gif,.bmp,.webp'
  });
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const { toast } = useToast();

  const exportAllData = () => {
    const data = {
      files: uploadedFiles,
      settings: siteSettings,
      pages: customPages,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `данные-${Date.now()}.json`;
    a.click();
    toast({ title: 'Данные экспортированы' });
  };

  const clearAllData = () => {
    if (confirm('Удалить все загруженные файлы?')) {
      setUploadedFiles([]);
      toast({ title: 'Все файлы удалены' });
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    const savedSettings = localStorage.getItem('site_settings');
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    }
    
    const savedPages = localStorage.getItem('custom_pages');
    if (savedPages) {
      setCustomPages(JSON.parse(savedPages));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadFilesFromBackend();
    }
  }, [isAuthenticated]);

  const loadFilesFromBackend = async () => {
    try {
      const response = await fetch(FILE_UPLOAD_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.files) {
          setUploadedFiles(data.files.map((f: any) => ({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type,
            uploadedAt: f.uploadedAt,
            isImage: f.isImage,
            base64: f.base64,
            mimeType: f.mimeType,
            description: f.description
          })));
        }
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFilesToBackend(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await uploadFilesToBackend(files);
    }
  };

  const uploadFilesToBackend = async (files: File[]) => {
    let successCount = 0;
    
    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        
        try {
          const response = await fetch(FILE_UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              fileType: file.type,
              fileSize: file.size,
              content: isImage ? content.split(',')[1] : content.substring(0, 50000),
              sessionId: getSessionId()
            })
          });
          
          if (response.ok) {
            successCount++;
            await loadFilesFromBackend();
          }
        } catch (error) {
          console.error('Upload error:', error);
        }
      };
      
      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
    
    setTimeout(() => {
      toast({
        title: "Файлы загружены",
        description: `Добавлено файлов: ${files.length}`,
      });
    }, 500);
  };

  const handleDeleteFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    toast({ title: "Файл удален" });
  };

  const handleUpdateDescription = async (idx: number, description: string) => {
    const file = uploadedFiles[idx];
    
    if (!file.id) {
      toast({ title: 'Ошибка: ID файла не найден', variant: 'destructive' });
      return;
    }
    
    try {
      const response = await fetch(FILE_UPLOAD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: file.id,
          description: description
        })
      });
      
      if (response.ok) {
        setUploadedFiles(prev => prev.map((f, i) => 
          i === idx ? { ...f, description } : f
        ));
      } else {
        toast({ title: 'Ошибка сохранения', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating description:', error);
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const addNewPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      title: 'Новая страница',
      content: '<h1>Заголовок</h1><p>Содержимое страницы...</p>'
    };
    setCustomPages(prev => [...prev, newPage]);
  };

  const updatePage = (id: string, field: 'title' | 'content', value: string) => {
    setCustomPages(prev => prev.map(page => 
      page.id === id ? { ...page, [field]: value } : page
    ));
  };

  const deletePage = (id: string) => {
    setCustomPages(prev => prev.filter(page => page.id !== id));
    toast({ title: 'Страница удалена' });
  };

  const savePages = () => {
    localStorage.setItem('custom_pages', JSON.stringify(customPages));
    toast({ title: 'Страницы сохранены' });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <div className="relative z-10">
        <AdminHeader onLogout={handleLogout} />

        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Панель управления</h1>
            <p className="text-purple-200">Управляйте контентом и настройками вашего сайта</p>
          </div>
          
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <Button 
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className={`transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="LayoutDashboard" className="mr-2" size={18} />
              Дашборд
            </Button>
            <Button 
              variant={activeTab === 'site' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('site')}
              className={`transition-all whitespace-nowrap ${activeTab === 'site' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="Globe" className="mr-2" size={18} />
              Настройки сайта
            </Button>
            <Button 
              variant={activeTab === 'content' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('content')}
              className={`transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="FileEdit" className="mr-2" size={18} />
              Контент
            </Button>
            <Button 
              variant={activeTab === 'files' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('files')}
              className={`transition-all whitespace-nowrap ${activeTab === 'files' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="FileText" className="mr-2" size={18} />
              Файлы
            </Button>
            <Button 
              variant={activeTab === 'stats' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('stats')}
              className={`transition-all whitespace-nowrap ${activeTab === 'stats' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="BarChart" className="mr-2" size={18} />
              Статистика
            </Button>
            <Button 
              variant={activeTab === 'buttons' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('buttons')}
              className={`transition-all whitespace-nowrap ${activeTab === 'buttons' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="Zap" className="mr-2" size={18} />
              Быстрые кнопки
            </Button>
            <Button 
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className={`transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="TrendingUp" className="mr-2" size={18} />
              Аналитика
            </Button>
            <Button 
              variant={activeTab === 'voice' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('voice')}
              className={`transition-all whitespace-nowrap ${activeTab === 'voice' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="Mic" className="mr-2" size={18} />
              Озвучка
            </Button>
            <Button 
              variant={activeTab === 'control' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('control')}
              className={`transition-all whitespace-nowrap ${activeTab === 'control' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="Shield" className="mr-2" size={18} />
              Полный контроль
            </Button>
            <Button 
              variant={activeTab === 'visual' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('visual')}
              className={`transition-all whitespace-nowrap ${activeTab === 'visual' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="Layers" className="mr-2" size={18} />
              Визуальный редактор
            </Button>
            <Button 
              variant={activeTab === 'security' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('security')}
              className={`transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="Lock" className="mr-2" size={18} />
              Безопасность
            </Button>
          </div>

          {activeTab === 'dashboard' && (
            <DashboardTab 
              filesCount={uploadedFiles.length}
              pagesCount={customPages.length}
            />
          )}

          {activeTab === 'site' && (
            <SiteSettingsTab 
              settings={siteSettings}
              onUpdateSettings={setSiteSettings}
            />
          )}

          {activeTab === 'content' && (
            <ContentTab
              pages={customPages}
              onAddPage={addNewPage}
              onUpdatePage={updatePage}
              onDeletePage={deletePage}
              onSavePages={savePages}
            />
          )}

          {activeTab === 'files' && (
            <FilesTab
              files={uploadedFiles}
              isDragging={isDragging}
              allowedTypes={siteSettings.allowedTypes}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              onDeleteFile={handleDeleteFile}
              onUpdateDescription={handleUpdateDescription}
              onExportAll={exportAllData}
              onClearAll={clearAllData}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab 
              files={uploadedFiles}
              pages={customPages}
            />
          )}

          {activeTab === 'buttons' && (
            <QuickButtonsTab />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab />
          )}

          {activeTab === 'voice' && (
            <VoiceDiagnostics />
          )}

          {activeTab === 'control' && (
            <FullControlTab />
          )}

          {activeTab === 'visual' && (
            <VisualEditorTab />
          )}

          {activeTab === 'security' && (
            <SecurityTab />
          )}
        </main>
      </div>
    </div>
  );
}