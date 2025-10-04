import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const exportAllData = () => {
    const data = {
      files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      notes: notes,
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
        description: "Добро пожаловать в админ-панель",
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Файлы загружены",
      description: `Добавлено файлов: ${files.length}`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      toast({
        title: "Файлы загружены",
        description: `Добавлено файлов: ${files.length}`,
      });
    }
  };

  const handleDeleteFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    toast({
      title: "Файл удален",
    });
  };

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
          
          <p className="text-gray-600 mb-6">Введите пароль для доступа</p>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
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
                  Панель управления
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
          <div className="max-w-4xl mx-auto">
            <Card 
              className={`p-8 border-2 transition-all duration-300 ${
                isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-purple-200 hover:border-purple-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Icon name="Upload" className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Загрузите данные</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Перетащите файлы сюда или выберите с устройства
              </p>

              <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center mb-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                <Icon name="FileUp" className="mx-auto mb-4 text-indigo-600" size={48} />
                <p className="text-gray-700 mb-4">Перетащите файлы или</p>
                <label>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileInput}
                  />
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Выбрать файлы
                  </Button>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Загруженные файлы ({uploadedFiles.length}):</p>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                      <Icon name="FileText" className="text-indigo-600" size={20} />
                      <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
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
              )}

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-purple-200">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Icon name="Network" className="text-indigo-600" size={28} />
                  </div>
                  <p className="text-sm text-gray-600">Анализ данных</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon name="Upload" className="text-purple-600" size={28} />
                  </div>
                  <p className="text-sm text-gray-600">Загрузка</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Icon name="Brain" className="text-cyan-600" size={28} />
                  </div>
                  <p className="text-sm text-gray-600">AI обработка</p>
                </div>
              </div>
            </Card>

            <div className="mt-8 space-y-6">
              <Card className="p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="FileEdit" className="text-indigo-600" size={24} />
                  <h4 className="font-bold text-gray-900">Заметки</h4>
                </div>
                <textarea
                  className="w-full p-4 border border-purple-200 rounded-lg focus:border-indigo-500 outline-none resize-none"
                  rows={4}
                  placeholder="Добавьте заметки о загруженных данных..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="FileText" className="text-indigo-600" size={24} />
                    <h4 className="font-bold text-gray-900">Файлов</h4>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">{uploadedFiles.length}</p>
                </Card>

                <Card className="p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="HardDrive" className="text-purple-600" size={24} />
                    <h4 className="font-bold text-gray-900">Размер</h4>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">
                    {(uploadedFiles.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(1)} KB
                  </p>
                </Card>

                <Card className="p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Zap" className="text-cyan-600" size={24} />
                    <h4 className="font-bold text-gray-900">Статус</h4>
                  </div>
                  <p className="text-lg font-bold text-cyan-600">Готов</p>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={exportAllData}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Icon name="Download" className="mr-2" size={20} />
                  Экспортировать все данные
                </Button>
                <Button 
                  onClick={clearAllData}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Icon name="Trash2" className="mr-2" size={20} />
                  Очистить все
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}