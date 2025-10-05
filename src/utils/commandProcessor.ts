export interface CommandResult {
  isCommand: boolean;
  response?: string;
  type?: 'time' | 'date' | 'calc' | 'note' | 'list' | 'clear';
}

const notes: string[] = [];

export function processCommand(text: string): CommandResult {
  const lowerText = text.toLowerCase().trim();

  if (lowerText.includes('сколько времени') || lowerText.includes('который час')) {
    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return {
      isCommand: true,
      response: `⏰ Сейчас ${time}`,
      type: 'time'
    };
  }

  if (lowerText.includes('какая дата') || lowerText.includes('какое число') || lowerText.includes('сегодня')) {
    const now = new Date();
    const date = now.toLocaleDateString('ru-RU', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return {
      isCommand: true,
      response: `📅 Сегодня ${date}`,
      type: 'date'
    };
  }

  if (lowerText.includes('посчитай') || lowerText.includes('вычисли') || /\d+\s*[\+\-\*\/]\s*\d+/.test(lowerText)) {
    try {
      const mathExpr = lowerText
        .replace(/посчитай|вычисли/g, '')
        .replace(/плюс/g, '+')
        .replace(/минус/g, '-')
        .replace(/умножить на|умноженное на/g, '*')
        .replace(/разделить на|делённое на/g, '/')
        .replace(/[^\d\+\-\*\/\.\(\)]/g, '');
      
      const result = eval(mathExpr);
      return {
        isCommand: true,
        response: `🔢 ${lowerText.replace(/посчитай|вычисли/g, '').trim()} = ${result}`,
        type: 'calc'
      };
    } catch {
      return { isCommand: false };
    }
  }

  if (lowerText.includes('запомни')) {
    const noteText = text.replace(/запомни/i, '').trim();
    if (noteText) {
      notes.push(noteText);
      return {
        isCommand: true,
        response: `💾 Запомнил: ${noteText}`,
        type: 'note'
      };
    }
  }

  if (lowerText.includes('что ты запомнил') || lowerText.includes('покажи заметки') || lowerText.includes('список заметок')) {
    if (notes.length === 0) {
      return {
        isCommand: true,
        response: '📝 Заметок пока нет',
        type: 'list'
      };
    }
    const notesList = notes.map((note, i) => `${i + 1}. ${note}`).join('\n');
    return {
      isCommand: true,
      response: `📝 Мои заметки:\n${notesList}`,
      type: 'list'
    };
  }

  if (lowerText.includes('очисти заметки') || lowerText.includes('удали заметки') || lowerText.includes('забудь всё')) {
    const count = notes.length;
    notes.length = 0;
    return {
      isCommand: true,
      response: `🗑️ Удалено заметок: ${count}`,
      type: 'clear'
    };
  }

  return { isCommand: false };
}

export function getNotesCount(): number {
  return notes.length;
}
