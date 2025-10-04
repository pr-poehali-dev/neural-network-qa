import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const FILE_UPLOAD_URL = 'https://functions.poehali.dev/b58abb29-2429-4b6e-aed0-e5aae54d2240';

const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default function Admin() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string; size: number; type: string; uploadedAt: string}>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'stats' | 'settings'>('files');
  const [settings, setSettings] = useState({
    siteName: 'Богдан AI',
    maxFileSize: '10',
    allowedTypes: '.txt,.pdf,.doc,.docx,.json'
  });
  const { toast } = useToast();

  const exportAllData = () => {
    const data = {
      files: uploadedFiles,
      settings: settings,
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

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в админ-панель Богдана",
      });
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный пароль",
        variant: "destructive",
      });
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
    for (const file of files) {
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
              content: content.substring(0, 50000),
              sessionId: getSessionId()
            })
          });
          
          if (response.ok) {
            setUploadedFiles(prev => [...prev, {
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date().toISOString()
            }]);
          }
        } catch (error) {
          console.error('Upload error:', error);
        }
      };
      reader.readAsText(file);
    }
    
    toast({
      title: "Файлы загружены",
      description: `Добавлено файлов: ${files.length}`,
    });
  };

  const handleDeleteFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    toast({ title: "Файл удален" });
  };

  const saveSettings = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    toast({ title: 'Настройки сохранены' });
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Icon name="Lock" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="border-purple-200"
            />
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="relative z-10">
        <header className="border-b border-white/20 backdrop-blur-md bg-white/30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Icon name="Shield" className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Админ-панель Богдана
                </h1>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="border-purple-300"
                >
                  <Icon name="Home" className="mr-2" size={18} />
                  На главную
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAuthenticated(false)}
                  className="border-purple-300"
                >
                  <Icon name="LogOut" className="mr-2" size={18} />
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="flex gap-4 mb-8">
            <Button 
              variant={activeTab === 'files' ? 'default' : 'outline'}
              onClick={() => setActiveTab('files')}
              className={activeTab === 'files' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
            >
              <Icon name="FileText" className="mr-2" size={18} />
              Файлы
            </Button>
            <Button 
              variant={activeTab === 'stats' ? 'default' : 'outline'}
              onClick={() => setActiveTab('stats')}
              className={activeTab === 'stats' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
            >
              <Icon name="BarChart" className="mr-2" size={18} />
              Статистика
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
              className={activeTab === 'settings' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
            >
              <Icon name="Settings" className="mr-2" size={18} />
              Настройки
            </Button>
          </div>

          {activeTab === 'files' && (
            <div className="space-y-6">
              <Card className="p-8 border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление файлами</h2>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-purple-300 bg-purple-50/30'
                  }`}
                >
                  <Icon name="Upload" className="mx-auto mb-4 text-purple-500" size={48} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Перетащите файлы сюда
                  </h3>
                  <p className="text-gray-600 mb-4">или</p>
                  <label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileInput}
                      className="hidden"
                      accept={settings.allowedTypes}
                    />
                    <Button 
                      variant="outline" 
                      className="border-purple-300"
                      onClick={(e) => {
                        e.preventDefault();
                        (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                      }}
                    >
                      <Icon name="FolderOpen" className="mr-2" size={18} />
                      Выбрать файлы
                    </Button>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Загруженные файлы ({uploadedFiles.length})
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportAllData}>
                          <Icon name="Download" className="mr-2" size={16} />
                          Экспорт
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearAllData}>
                          <Icon name="Trash2" className="mr-2" size={16} />
                          Очистить
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                          <div className="flex items-center gap-3">
                            <Icon name="FileText" className="text-indigo-600" size={24} />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB • {file.type || 'unknown'}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteFile(idx)}
                          >
                            <Icon name="Trash2" className="text-red-500" size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Icon name="FileText" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{uploadedFiles.length}</p>
                    <p className="text-sm text-gray-600">Всего файлов</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon name="HardDrive" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">KB использовано</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Icon name="Activity" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Активность</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки системы</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название сайта
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="border-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимальный размер файла (MB)
                  </label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                    className="border-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Разрешенные типы файлов
                  </label>
                  <Input
                    value={settings.allowedTypes}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowedTypes: e.target.value }))}
                    className="border-purple-200"
                    placeholder=".txt,.pdf,.doc"
                  />
                </div>

                <Button 
                  onClick={saveSettings}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Icon name="Save" className="mr-2" size={18} />
                  Сохранить настройки
                </Button>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
