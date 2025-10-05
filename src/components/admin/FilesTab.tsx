import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
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
  onExportAll,
  onClearAll
}: FilesTabProps) {
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
          <p className="text-gray-600 mb-4">или</p>
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
            <div className="space-y-2">
              {files.map((file, idx) => (
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
                    onClick={() => onDeleteFile(idx)}
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
  );
}
