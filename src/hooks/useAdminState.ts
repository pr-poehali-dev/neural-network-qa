import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  SiteSettings, 
  UploadedFile, 
  CustomPage, 
  AdminTabType,
  FILE_UPLOAD_URL,
  getSessionId
} from '@/types/adminTypes';

export function useAdminState() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
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
    const auth = localStorage.getItem('admin_auth') === 'true' || localStorage.getItem('admin_session') === 'true';
    if (auth) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
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
    localStorage.removeItem('admin_session');
    window.location.href = '/';
  };

  return {
    uploadedFiles,
    isDragging,
    isAuthenticated,
    activeTab,
    siteSettings,
    customPages,
    setActiveTab,
    setSiteSettings,
    exportAllData,
    clearAllData,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    handleDeleteFile,
    handleUpdateDescription,
    addNewPage,
    updatePage,
    deletePage,
    savePages,
    handleLogin,
    handleLogout
  };
}
