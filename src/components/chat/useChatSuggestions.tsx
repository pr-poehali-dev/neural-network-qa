export function useChatSuggestions() {
  const getSmartSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase().trim();
    
    const suggestionMap: { [key: string]: string[] } = {
      'как': ['Как это работает?', 'Как мне начать?', 'Как настроить?'],
      'что': ['Что это значит?', 'Что мне делать?', 'Что ты умеешь?'],
      'когда': ['Когда лучше начать?', 'Когда это будет готово?'],
      'где': ['Где это найти?', 'Где можно узнать больше?'],
      'почему': ['Почему так происходит?', 'Почему это важно?'],
      'помоги': ['Помоги разобраться', 'Помоги решить проблему'],
      'расскажи': ['Расскажи подробнее', 'Расскажи про это'],
      'объясни': ['Объясни простыми словами', 'Объясни пошагово'],
    };

    for (const [key, suggestions] of Object.entries(suggestionMap)) {
      if (lowerInput.startsWith(key)) {
        return suggestions;
      }
    }

    if (lowerInput.length > 3) {
      return ['Продолжить эту тему?', 'Узнать больше деталей?', 'Пример использования?'];
    }

    return [];
  };

  return { getSmartSuggestions };
}
