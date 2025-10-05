import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NoAIToolsProps {
  onClose: () => void;
}

export default function NoAITools({ onClose }: NoAIToolsProps) {
  const tools = [
    {
      id: 'calc',
      title: 'Калькулятор',
      icon: 'Calculator',
      description: 'Быстрые расчёты и вычисления',
      action: () => window.open('https://www.google.com/search?q=calculator', '_blank'),
    },
    {
      id: 'timer',
      title: 'Таймер',
      icon: 'Timer',
      description: 'Установите таймер или будильник',
      action: () => {
        const minutes = prompt('Сколько минут?');
        if (minutes) {
          const ms = parseInt(minutes) * 60 * 1000;
          setTimeout(() => {
            alert(`⏰ ${minutes} минут прошло!`);
            new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LZjHAU7k9n0y3gqBS1+x/DaklELElyx6OyrWBUIRp/e8rttIgUsgs/z2og1Bxpqvvbkm08MDlCl4fC2ZBwFO5LY9Mx6LAUtfsjx25JQCxNdsubus1kVCEaf3/K7bCMFLILP89qJNQcaa7/35JxPDA5RpuHwtmMdBTuS2PTLeixFLX/I8dySUQsTXLLp77NZFQhHoN/yu20kBS2C0PPaiTQHG2y+9+ScUAwOUqfi8LdjHQU8k9j0zHksBS6Ax/HcklALE12y6e+zWRUIR6Df8rpuJAUugdDz2ok0Bxprv/fknFALDlKn4vC3Yx0FPJPa9cxAIwYugsf13ZJRCxRcsunut1kVCEih3/K6bSQFLYHR89qINAcba7/35JxQCw5Sp+PwuGIdBTuT2vXOQCMGLoLH9d2SUQsUXbLp77dZFQhJod/yum0kBSyB0fPaiTQHG2u/9+ScUAwOUqfj8LdjHAU7ktr1zkAjBi+Bx/XdkVALFVyy6e+3WRUIS6Lf8rpuJAUsgdHz2og0Bxtrv/fknFAMDlKn4/C3YxwFO5La9c9AIwYvgcf13pBQCxVdsunvt1oVCEui3/K6biUFLIHR89qJNAcaa7725ZxPDA5Sp+Lwt2McBTuS2vXPQCMGL4HH9d6QTwsWXbLp77dZFQhLot/yum4lBSyB0fPaiTQHG2u+9+WcTwwOUqfj8LdjHAU7ktr1z0AjBi+Bx/XekE8LFl2y6e+3WhUIS6Lf8rpuJgUsgtHz2ok0Bxtrv/fknE8MDlGn4/C3Yx0FO5La9s9AIwYugcf13pBPCxZcsunvt1oVCEyi3/K6biYFLYLR89qJNQcba7/35JxPDA5RpuPwt2MdBTuS2vbPQCMGLoHH9d6QUAsWXLDp77daFQhLoN/yuG4mBS2C0fPbiDUHG2u/9+ScUAwPUqfj8LdjHAU8k9r2zkAiBi+Bx/XeklALFlyv6e+3WhUIS6Hf8rhuJgUtgtDz2og1Bxtrv/fknFAMD1Kn4/C3YxwFPJPa9s5AIgYvgcf13pFQCxZcr+nvt1oVCEuh4PKu3ycFLoLQ89uHNAcba7/25JxPDA9Sp+Pxt2McBTyU2vbNQCIGL4HH9d6RUAsWXK/o77dZFQhLod/yum4lBS6C0PPahzUHGmu/9uSbUAwPUabj8LdjGwU8lNr2z0AiBi+Bx/XekVALFlyv6e+3WhUIS6Hf8rpuJQUugtDz2oc1Bxprv/bkm08MD1Km4/C3YxsFPJPa9c9AJAY') 
          }, ms);
          alert(`✅ Таймер на ${minutes} минут запущен!`);
        }
      },
    },
    {
      id: 'notes',
      title: 'Быстрые заметки',
      icon: 'StickyNote',
      description: 'Сохраните важную мысль',
      action: () => {
        const note = prompt('Введите заметку:');
        if (note) {
          const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
          notes.push({ text: note, date: new Date().toLocaleString() });
          localStorage.setItem('quickNotes', JSON.stringify(notes));
          alert('✅ Заметка сохранена!');
        }
      },
    },
    {
      id: 'view_notes',
      title: 'Просмотр заметок',
      icon: 'FileText',
      description: 'Посмотрите сохранённые заметки',
      action: () => {
        const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
        if (notes.length === 0) {
          alert('📝 У вас пока нет заметок');
        } else {
          const text = notes.map((n: any, i: number) => 
            `${i + 1}. ${n.text}\n   (${n.date})`
          ).join('\n\n');
          alert(`📝 Ваши заметки:\n\n${text}`);
        }
      },
    },
    {
      id: 'qr',
      title: 'QR-код',
      icon: 'QrCode',
      description: 'Создайте QR-код из текста или ссылки',
      action: () => {
        const text = prompt('Введите текст или ссылку для QR-кода:');
        if (text) {
          window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`, '_blank');
        }
      },
    },
    {
      id: 'translate',
      title: 'Переводчик',
      icon: 'Languages',
      description: 'Быстрый перевод без ИИ',
      action: () => {
        const text = prompt('Введите текст для перевода:');
        if (text) {
          window.open(`https://translate.google.com/?sl=auto&tl=ru&text=${encodeURIComponent(text)}`, '_blank');
        }
      },
    },
    {
      id: 'weather',
      title: 'Погода',
      icon: 'CloudSun',
      description: 'Узнайте погоду в вашем городе',
      action: () => {
        const city = prompt('Введите название города:');
        if (city) {
          window.open(`https://www.google.com/search?q=погода+${encodeURIComponent(city)}`, '_blank');
        }
      },
    },
    {
      id: 'random',
      title: 'Генератор случайных чисел',
      icon: 'Dices',
      description: 'Получите случайное число',
      action: () => {
        const min = prompt('Минимум:');
        const max = prompt('Максимум:');
        if (min && max) {
          const num = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
          alert(`🎲 Ваше число: ${num}`);
        }
      },
    },
    {
      id: 'password',
      title: 'Генератор паролей',
      icon: 'KeyRound',
      description: 'Создайте надёжный пароль',
      action: () => {
        const length = prompt('Длина пароля (8-32):', '12');
        if (length) {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
          let password = '';
          for (let i = 0; i < parseInt(length); i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          navigator.clipboard.writeText(password);
          alert(`🔐 Пароль скопирован:\n${password}`);
        }
      },
    },
    {
      id: 'todo',
      title: 'Список дел',
      icon: 'CheckSquare',
      description: 'Создайте и управляйте задачами',
      action: () => {
        const task = prompt('Добавить задачу:');
        if (task) {
          const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
          todos.push({ text: task, done: false, date: new Date().toLocaleString() });
          localStorage.setItem('todoList', JSON.stringify(todos));
          alert('✅ Задача добавлена!');
        }
      },
    },
    {
      id: 'view_todo',
      title: 'Мои задачи',
      icon: 'ListTodo',
      description: 'Посмотрите список дел',
      action: () => {
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        if (todos.length === 0) {
          alert('✅ Список дел пуст');
        } else {
          const text = todos.map((t: any, i: number) => 
            `${t.done ? '✅' : '⬜'} ${i + 1}. ${t.text}`
          ).join('\n');
          alert(`📋 Ваши задачи:\n\n${text}`);
        }
      },
    },
    {
      id: 'color',
      title: 'Выбор цвета',
      icon: 'Palette',
      description: 'Получите HEX код цвета',
      action: () => {
        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        navigator.clipboard.writeText(color);
        alert(`🎨 Цвет скопирован: ${color}`);
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 border-2 border-purple-200 dark:border-purple-800 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Icon name="Wrench" className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Инструменты без ИИ</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Полезные функции прямо в браузере</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700"
              onClick={tool.action}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center flex-shrink-0">
                  <Icon name={tool.icon as any} size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tool.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{tool.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Совет:</strong> Все эти инструменты работают без подключения к ИИ и доступны всегда!
          </p>
        </div>
      </Card>
    </div>
  );
}
