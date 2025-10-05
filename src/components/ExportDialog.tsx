import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Message } from './ChatContainer';

interface ExportDialogProps {
  messages: Message[];
  onClose: () => void;
}

export default function ExportDialog({ messages, onClose }: ExportDialogProps) {
  const exportToTXT = () => {
    const text = messages
      .map(msg => `${msg.role === 'user' ? 'Вы' : 'Ассистент'}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportToHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Экспорт чата - ${new Date().toLocaleDateString('ru-RU')}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .message {
            margin: 20px 0;
            padding: 15px;
            border-radius: 12px;
        }
        .user {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-left: 20%;
        }
        .ai {
            background: white;
            margin-right: 20%;
            border: 1px solid #e5e7eb;
        }
        .role {
            font-weight: bold;
            margin-bottom: 8px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
    </style>
</head>
<body>
    <h1>📝 Экспорт диалога</h1>
    <p style="text-align: center; color: #666;">Сохранено: ${new Date().toLocaleString('ru-RU')}</p>
    ${messages.map(msg => `
        <div class="message ${msg.role}">
            <div class="role">${msg.role === 'user' ? '👤 Вы' : '🤖 Ассистент'}</div>
            <div>${msg.text.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('')}
</body>
</html>
    `;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportToMarkdown = () => {
    const markdown = `# 📝 Экспорт диалога

**Дата:** ${new Date().toLocaleString('ru-RU')}

---

${messages.map(msg => `
### ${msg.role === 'user' ? '👤 Вы' : '🤖 Ассистент'}

${msg.text}

---
`).join('\n')}
    `;
    
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        role: msg.role,
        text: msg.text,
        timestamp: new Date().toISOString()
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Экспорт чата - ${new Date().toLocaleDateString('ru-RU')}</title>
    <style>
        @media print {
            body { margin: 0; }
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .date {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .message {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            page-break-inside: avoid;
        }
        .user {
            background: #f3f4f6;
            border-left: 4px solid #667eea;
        }
        .ai {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
        }
        .role {
            font-weight: bold;
            margin-bottom: 8px;
            color: #111827;
        }
        .text {
            white-space: pre-wrap;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>📝 Экспорт диалога</h1>
    <div class="date">Сохранено: ${new Date().toLocaleString('ru-RU')}</div>
    ${messages.map(msg => `
        <div class="message ${msg.role}">
            <div class="role">${msg.role === 'user' ? '👤 Вы' : '🤖 Ассистент'}</div>
            <div class="text">${msg.text}</div>
        </div>
    `).join('')}
    <script>
        window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 100);
        };
    </script>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Icon name="Download" className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Экспорт диалога</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={exportToPDF}
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <Icon name="FileText" className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">PDF документ</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Для печати и архива</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={exportToHTML}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Icon name="Globe" className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">HTML страница</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Открыть в браузере</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={exportToTXT}
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <Icon name="FileText" className="text-gray-600 dark:text-gray-400" size={20} />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Текстовый файл</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Простой текст .txt</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={exportToMarkdown}
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Icon name="Hash" className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Markdown</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Для документации</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={exportToJSON}
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <Icon name="Code" className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">JSON данные</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Для программистов</div>
            </div>
          </Button>
        </div>

        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📊 Сообщений для экспорта: <span className="font-semibold text-purple-600 dark:text-purple-400">{messages.length}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
