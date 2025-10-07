import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Политика конфиденциальности</h1>
                <p className="text-gray-400">Обновлено: {new Date().toLocaleDateString('ru-RU')}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Введение</h2>
                <p>
                  Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем 
                  вашу персональную информацию при использовании нашего ИИ-сервиса "Богдан ИИ".
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Сбор информации</h2>
                <p className="mb-3">Мы собираем следующие виды информации:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Информация, которую вы предоставляете добровольно (имя, email)</li>
                  <li>Данные об использовании сервиса (запросы к ИИ, файлы)</li>
                  <li>Технические данные (IP-адрес, тип браузера, устройство)</li>
                  <li>Cookies и аналогичные технологии отслеживания</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Использование данных</h2>
                <p className="mb-3">Мы используем собранную информацию для:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Предоставления и улучшения наших услуг</li>
                  <li>Персонализации пользовательского опыта</li>
                  <li>Обработки запросов и обеспечения поддержки</li>
                  <li>Анализа использования и оптимизации функционала</li>
                  <li>Отправки уведомлений и обновлений (с вашего согласия)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Защита данных</h2>
                <p>
                  Мы применяем современные технологии шифрования и защиты данных. 
                  Все данные хранятся на защищенных серверах с ограниченным доступом.
                  Мы регулярно проводим аудит безопасности и обновляем системы защиты.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Передача данных третьим лицам</h2>
                <p>
                  Мы не продаем и не передаем ваши персональные данные третьим лицам без вашего 
                  явного согласия, за исключением случаев, предусмотренных законом или необходимых 
                  для работы сервиса (например, использование облачных хранилищ).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Ваши права</h2>
                <p className="mb-3">Вы имеете право:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Запросить доступ к своим персональным данным</li>
                  <li>Исправить неточные данные</li>
                  <li>Удалить свои данные (право на забвение)</li>
                  <li>Ограничить обработку ваших данных</li>
                  <li>Получить копию данных в машиночитаемом формате</li>
                  <li>Отозвать согласие на обработку в любое время</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                <p>
                  Мы используем cookies для улучшения работы сервиса. Вы можете настроить 
                  параметры cookies в своем браузере, но это может ограничить функциональность сайта.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Изменения в политике</h2>
                <p>
                  Мы оставляем за собой право обновлять данную Политику конфиденциальности. 
                  О существенных изменениях мы будем уведомлять пользователей заранее.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Контакты</h2>
                <p>
                  По вопросам конфиденциальности обращайтесь: <br />
                  Email: <a href="mailto:privacy@bogdan-ai.com" className="text-purple-400 hover:text-purple-300">privacy@bogdan-ai.com</a><br />
                  Адрес: Россия, Москва, ул. Примерная, д. 1
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
