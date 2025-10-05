import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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

interface FilesTabProps {
  files: UploadedFile[];
  isDragging: boolean;
  allowedTypes: string;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (idx: number) => void;
  onUpdateDescription: (idx: number, description: string) => void;
  onExportAll: () => void;
  onClearAll: () => void;
}

export default function FilesTab({
  files,
  isDragging,
  allowedTypes,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  onDeleteFile,
  onUpdateDescription,
  onExportAll,
  onClearAll
}: FilesTabProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempDescription, setTempDescription] = useState('');
  const { toast } = useToast();

  const startEdit = (idx: number, currentDescription: string) => {
    setEditingId(idx);
    setTempDescription(currentDescription || '');
  };

  const saveDescription = (idx: number) => {
    onUpdateDescription(idx, tempDescription);
    setEditingId(null);
    toast({ title: 'Описание сохранено' });
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление файлами</h2>
        
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
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
          <p className="text-gray-600 mb-2">Поддерживается массовая загрузка</p>
          <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF, PDF, TXT, DOC, JSON</p>
          <label>
            <input 
              type="file" 
              multiple 
              onChange={onFileInput}
              className="hidden"
              accept={allowedTypes}
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

        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Загруженные файлы ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onExportAll}>
                  <Icon name="Download" className="mr-2" size={16} />
                  Экспорт
                </Button>
                <Button variant="outline" size="sm" onClick={onClearAll}>
                  <Icon name="Trash2" className="mr-2" size={16} />
                  Очистить
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {files.map((file, idx) => (
                <Card key={idx} className="p-4 border border-purple-200">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {file.isImage && file.base64 ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-100">
                          <img 
                            src={`data:${file.mimeType || 'image/jpeg'};base64,${file.base64}`}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Icon name="FileText" className="text-indigo-600" size={32} />
                        </div>
                      )}
                    </div>

                    {/* Info & Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                            {file.isImage && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                                Изображение
                              </span>
                            )}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDeleteFile(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>

                      {/* Description Editor */}
                      {editingId === idx ? (
                        <div className="space-y-2">
                          <Textarea
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            placeholder="Добавьте описание для улучшения поиска..."
                            className="min-h-[80px] border-purple-200"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveDescription(idx)}>
                              <Icon name="Check" className="mr-1" size={14} />
                              Сохранить
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingId(null)}
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {file.description ? (
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {file.description}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">
                              Нет описания
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startEdit(idx, file.description || '')}
                          >
                            <Icon name="Edit" className="mr-1" size={14} />
                            {file.description ? 'Редактировать' : 'Добавить описание'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
