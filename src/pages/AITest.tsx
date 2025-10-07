import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function AITest() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_api_key') || '');
  const [model, setModel] = useState('deepseek/deepseek-chat');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const testAI = async () => {
    if (!apiKey.trim()) {
      toast({ title: 'Введите API ключ', variant: 'destructive' });
      return;
    }

    if (!message.trim()) {
      toast({ title: 'Введите сообщение', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setResponse('');
    setStats(null);

    try {
      const startTime = Date.now();
      
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Test'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'Ты полезный ассистент. Отвечай кратко и по делу.' },
            { role: 'user', content: message }
          ]
        })
      });

      const endTime = Date.now();

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await res.json();
      
      setResponse(data.choices[0].message.content);
      setStats({
        model: data.model,
        usage: data.usage,
        time: endTime - startTime,
        id: data.id
      });

      toast({ title: '✅ Тест пройден успешно!', description: 'AI работает корректно' });

      localStorage.setItem('openrouter_api_key', apiKey);
    } catch (error) {
      toast({
        title: '❌ Ошибка теста',
        description: error instanceof Error ? error.message : 'Не удалось получить ответ',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="TestTube" size={32} className="text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Тестирование</h1>
              <p className="text-gray-600 dark:text-gray-400">Проверка работы OpenRouter API</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* API Key */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                OpenRouter API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Получите на{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  openrouter.ai/keys
                </a>
              </p>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Модель AI
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <optgroup label="🔥 DeepSeek (рекомендуется)">
                  <option value="deepseek/deepseek-r1:free">DeepSeek R1 (бесплатно, мощная)</option>
                  <option value="deepseek/deepseek-chat">DeepSeek Chat (очень дешево)</option>
                  <option value="deepseek/deepseek-coder">DeepSeek Coder (для кода)</option>
                </optgroup>
                <optgroup label="OpenAI">
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="openai/gpt-4">GPT-4</option>
                  <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                </optgroup>
                <optgroup label="Anthropic">
                  <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                  <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
                </optgroup>
                <optgroup label="Meta">
                  <option value="meta-llama/llama-3-70b-instruct">Llama 3 70B (бесплатно)</option>
                </optgroup>
                <optgroup label="Google">
                  <option value="google/gemini-pro">Gemini Pro</option>
                </optgroup>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Тестовое сообщение
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите вопрос для AI..."
                rows={4}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Test Button */}
            <Button
              onClick={testAI}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                  Тестирование...
                </>
              ) : (
                <>
                  <Icon name="Zap" className="mr-2" size={20} />
                  Запустить тест
                </>
              )}
            </Button>

            {/* Response */}
            {response && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon name="MessageSquare" size={20} className="text-green-600" />
                  Ответ AI:
                </h3>
                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{response}</p>
                </Card>
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon name="BarChart3" size={20} className="text-blue-600" />
                  Статистика:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Модель</p>
                    <p className="font-mono text-sm font-bold text-blue-600">{stats.model}</p>
                  </Card>
                  <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Токены</p>
                    <p className="font-mono text-sm font-bold text-purple-600">{stats.usage?.total_tokens || 0}</p>
                  </Card>
                  <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Время</p>
                    <p className="font-mono text-sm font-bold text-green-600">{stats.time}ms</p>
                  </Card>
                  <Card className="p-4 bg-orange-50 dark:bg-orange-900/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Request ID</p>
                    <p className="font-mono text-xs font-bold text-orange-600">{stats.id?.slice(0, 12)}...</p>
                  </Card>
                </div>

                <Card className="mt-4 p-4 bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Детали токенов:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Промпт: </span>
                      <span className="font-mono font-bold">{stats.usage?.prompt_tokens || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Ответ: </span>
                      <span className="font-mono font-bold">{stats.usage?.completion_tokens || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Всего: </span>
                      <span className="font-mono font-bold">{stats.usage?.total_tokens || 0}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Test Examples */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-300"
            onClick={() => setMessage('Напиши короткое стихотворение про космос')}
          >
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-semibold text-sm mb-1">Креативный тест</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Стихотворение</p>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-300"
            onClick={() => setMessage('Объясни квантовую физику простыми словами за 3 предложения')}
          >
            <div className="text-2xl mb-2">🧠</div>
            <h4 className="font-semibold text-sm mb-1">Логический тест</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Квантовая физика</p>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-cyan-300"
            onClick={() => setMessage('Переведи "Hello, how are you?" на 5 языков')}
          >
            <div className="text-2xl mb-2">🌍</div>
            <h4 className="font-semibold text-sm mb-1">Языковой тест</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Перевод</p>
          </Card>
        </div>
      </div>
    </div>
  );
}