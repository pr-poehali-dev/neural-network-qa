interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const exportToText = (messages: Message[], filename: string = 'chat') => {
  const content = messages
    .map(m => `${m.role === 'user' ? 'Пользователь' : 'AI'}: ${m.text}`)
    .join('\n\n');
  
  downloadFile(content, `${filename}.txt`, 'text/plain');
};

export const exportToMarkdown = (messages: Message[], filename: string = 'chat') => {
  const content = [
    '# Чат с Богдан ИИ\n',
    `*Экспортировано: ${new Date().toLocaleString('ru-RU')}*\n`,
    '---\n',
    ...messages.map(m => {
      const author = m.role === 'user' ? '👤 **Вы**' : '🤖 **AI**';
      return `### ${author}\n\n${m.text}\n`;
    })
  ].join('\n');
  
  downloadFile(content, `${filename}.md`, 'text/markdown');
};

export const exportToHTML = (messages: Message[], filename: string = 'chat') => {
  const content = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Чат с Богдан ИИ</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    h1 { color: #667eea; margin-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
    .message {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 8px;
    }
    .user {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin-left: 40px;
    }
    .ai {
      background: #f3f4f6;
      color: #333;
      margin-right: 40px;
      border-left: 4px solid #667eea;
    }
    .author {
      font-weight: bold;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Чат с Богдан ИИ</h1>
    <div class="meta">Экспортировано: ${new Date().toLocaleString('ru-RU')}</div>
    ${messages.map(m => `
      <div class="message ${m.role}">
        <div class="author">
          ${m.role === 'user' ? '👤 Вы' : '🤖 AI'}
        </div>
        <div>${m.text.replace(/\n/g, '<br>')}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  
  downloadFile(content, `${filename}.html`, 'text/html');
};

export const exportToJSON = (messages: Message[], filename: string = 'chat') => {
  const content = JSON.stringify({
    exported_at: new Date().toISOString(),
    platform: 'Богдан ИИ',
    messages: messages.map(m => ({
      role: m.role,
      content: m.text,
      timestamp: new Date().toISOString()
    }))
  }, null, 2);
  
  downloadFile(content, `${filename}.json`, 'application/json');
};

export const exportToWord = (messages: Message[], filename: string = 'chat') => {
  const header = `Чат с Богдан ИИ\nЭкспортировано: ${new Date().toLocaleString('ru-RU')}\n${'='.repeat(60)}\n\n`;
  
  const content = header + messages
    .map(m => {
      const author = m.role === 'user' ? 'ПОЛЬЗОВАТЕЛЬ' : 'AI';
      return `${author}:\n${m.text}\n${'-'.repeat(60)}`;
    })
    .join('\n\n');
  
  const blob = new Blob(
    ['\ufeff', content],
    { type: 'application/msword;charset=utf-8' }
  );
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};