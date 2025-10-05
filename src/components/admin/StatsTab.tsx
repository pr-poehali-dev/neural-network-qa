import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface CustomPage {
  id: string;
  title: string;
  content: string;
}

interface StatsTabProps {
  files: UploadedFile[];
  pages: CustomPage[];
}

export default function StatsTab({ files, pages }: StatsTabProps) {
  const totalSize = files.reduce((acc, f) => acc + f.size, 0) / 1024;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="p-6 border-2 border-purple-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Icon name="FileText" className="text-white" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{files.length}</p>
            <p className="text-sm text-gray-600">Всего файлов</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-purple-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Icon name="FileEdit" className="text-white" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{pages.length}</p>
            <p className="text-sm text-gray-600">Страниц создано</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-purple-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Icon name="HardDrive" className="text-white" size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalSize.toFixed(2)}</p>
            <p className="text-sm text-gray-600">KB использовано</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
