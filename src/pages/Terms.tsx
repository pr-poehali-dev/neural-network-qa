import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Icon name="FileText" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Условия использования</h1>
                <p className="text-gray-400">Обновлено: {new Date().toLocaleDateString('ru-RU')}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Принятие условий</h2>
                <p>
                  Используя сервис "Богдан ИИ", вы соглашаетесь с настоящими Условиями использования.
                  Если вы не согласны с какими-либо условиями, пожалуйста, не используйте наш сервис.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Описание сервиса</h2>
                <p>
                  "Богдан ИИ" — это платформа для взаимодействия с искусственным интеллектом, 
                  предоставляющая возможности чат-бота, обработки файлов, перевода текста, 
                  голосового ввода и других функций на основе ИИ-технологий.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Регистрация и аккаунт</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Вы обязаны предоставлять точную и актуальную информацию при регистрации</li>
                  <li>Вы несете ответственность за сохранность данных своего аккаунта</li>
                  <li>Запрещено создавать несколько аккаунтов для одного пользователя</li>
                  <li>Мы оставляем право заблокировать аккаунт при нарушении условий</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Правила использования</h2>
                <p className="mb-3">При использовании сервиса запрещено:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Нарушать законодательство РФ и международное право</li>
                  <li>Распространять вредоносный контент или спам</li>
                  <li>Использовать сервис для незаконной деятельности</li>
                  <li>Пытаться получить несанкционированный доступ к системе</li>
                  <li>Нарушать права интеллектуальной собственности</li>
                  <li>Использовать автоматизированные средства для массовых запросов</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Интеллектуальная собственность</h2>
                <p>
                  Все права на программное обеспечение, дизайн, логотипы и контент сервиса 
                  принадлежат правообладателям. Запрещено копирование, распространение или 
                  модификация без письменного разрешения.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Контент пользователей</h2>
                <p>
                  Загружая контент в сервис, вы подтверждаете наличие всех необходимых прав.
                  Мы не несем ответственности за контент, загруженный пользователями, но 
                  оставляем право удалять материалы, нарушающие правила.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Ограничение ответственности</h2>
                <p>
                  Сервис предоставляется "как есть". Мы не гарантируем бесперебойную работу 
                  и не несем ответственности за возможные убытки, связанные с использованием 
                  или невозможностью использования сервиса.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Тарифы и оплата</h2>
                <p>
                  Некоторые функции сервиса могут быть платными. Условия оплаты и возврата средств 
                  указаны на соответствующих страницах. Мы оставляем право изменять тарифы с 
                  предварительным уведомлением пользователей.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Изменение условий</h2>
                <p>
                  Мы оставляем за собой право изменять настоящие Условия использования. 
                  Существенные изменения вступают в силу через 30 дней после публикации.
                  Продолжение использования сервиса означает согласие с новыми условиями.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Контактная информация</h2>
                <p>
                  По вопросам использования сервиса: <br />
                  Email: <a href="mailto:support@bogdan-ai.com" className="text-purple-400 hover:text-purple-300">support@bogdan-ai.com</a><br />
                  Телефон: +7 (495) 123-45-67
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
