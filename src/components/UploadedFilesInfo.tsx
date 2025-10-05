import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: number;
  isImage: boolean;
  base64?: string;
  mimeType?: string;
}

interface UploadedFilesInfoProps {
  fileUploadUrl: string;
  sessionId: string;
}

export default function UploadedFilesInfo({ fileUploadUrl, sessionId }: UploadedFilesInfoProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showFiles, setShowFiles] = useState(false);

  const loadFiles = async () => {
    try {
      const response = await fetch(fileUploadUrl);
      const data = await response.json();
      
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  if (files.length === 0) return null;

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFiles(!showFiles)}
        className="w-full border-purple-200 dark:border-purple-800"
      >
        <Icon name="FileText" className="mr-2" size={16} />
        Загруженные файлы ({files.length})
        <Icon 
          name={showFiles ? 'ChevronUp' : 'ChevronDown'} 
          className="ml-auto" 
          size={16} 
        />
      </Button>

      {showFiles && (
        <Card className="mt-2 p-4 border-purple-200 dark:border-purple-800 max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                {file.isImage && file.base64 ? (
                  <img 
                    src={`data:${file.mimeType || 'image/jpeg'};base64,${file.base64}`}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded flex items-center justify-center">
                    <Icon name="FileText" className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {file.isImage && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded">
                    Изображение
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
