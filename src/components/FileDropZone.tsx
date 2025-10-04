import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface FileDropZoneProps {
  onFileDrop: (files: File[]) => void;
}

export default function FileDropZone({ onFileDrop }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

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
    if (files.length > 0) {
      onFileDrop(files);
    }
  };

  if (!isDragging) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card className="p-12 border-4 border-dashed border-indigo-500 bg-white dark:bg-gray-800 animate-pulse">
        <div className="text-center">
          <Icon name="Upload" className="mx-auto mb-4 text-indigo-600 dark:text-indigo-400" size={64} />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Отпустите файлы здесь
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Файлы будут загружены автоматически
          </p>
        </div>
      </Card>
    </div>
  );
}
