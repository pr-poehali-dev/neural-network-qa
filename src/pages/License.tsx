import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { useEffect } from 'react';

export default function License() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation onSettingsClick={() => {}} />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgxODNmNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Icon name="Award" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Лицензионное соглашение</h1>
                <p className="text-gray-400">Версия 1.0 от {new Date().toLocaleDateString('ru-RU')}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Лицензия на использование программного обеспечения</h2>
                <p>
                  Настоящее лицензионное соглашение регулирует использование программного обеспечения 
                  "Богдан ИИ" (далее — "ПО") и предоставляет вам ограниченную, неисключительную, 
                  непередаваемую лицензию на использование ПО.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Предоставление лицензии</h2>
                <p>
                  Правообладатель предоставляет вам право использовать ПО в соответствии с условиями 
                  настоящего соглашения. Данная лицензия не подразумевает передачу права собственности 
                  на ПО.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Разрешенное использование</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Использование ПО в личных и коммерческих целях</li>
                  <li>Доступ к функциям ИИ через веб-интерфейс</li>
                  <li>Загрузка и обработка файлов в рамках сервиса</li>
                  <li>Интеграция с другими приложениями через API (при наличии)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Ограничения</h2>
                <p className="mb-3">Вам НЕ разрешается:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Копировать, модифицировать или создавать производные работы на основе ПО</li>
                  <li>Распространять, продавать или сублицензировать ПО третьим лицам</li>
                  <li>Декомпилировать, дизассемблировать или изучать исходный код</li>
                  <li>Обходить технические ограничения и системы защиты</li>
                  <li>Использовать ПО для незаконной деятельности</li>
                  <li>Удалять или изменять уведомления об авторских правах</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Интеллектуальная собственность</h2>
                <p>
                  Все права на ПО, включая авторские права, товарные знаки и патенты, принадлежат 
                  правообладателю. Вы признаете и соглашаетесь, что ПО и все связанные с ним 
                  материалы защищены законами об интеллектуальной собственности.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Обновления и поддержка</h2>
                <p>
                  Правообладатель может предоставлять обновления ПО по своему усмотрению. 
                  Техническая поддержка предоставляется в соответствии с выбранным тарифным планом.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Ограничение ответственности</h2>
                <p>
                  ПО предоставляется "как есть", без каких-либо гарантий. Правообладатель не несет 
                  ответственности за убытки, возникшие в результате использования или невозможности 
                  использования ПО, включая, но не ограничиваясь, потерей данных или упущенной выгодой.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Срок действия</h2>
                <p>
                  Настоящая лицензия действует до момента ее прекращения. Вы можете прекратить 
                  использование ПО в любое время, удалив его. Правообладатель может прекратить 
                  действие лицензии при нарушении условий настоящего соглашения.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Применимое право</h2>
                <p>
                  Настоящее соглашение регулируется законодательством Российской Федерации. 
                  Все споры разрешаются в судебном порядке по месту нахождения правообладателя.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Контактная информация</h2>
                <p>
                  По вопросам лицензирования: <br />
                  Email: <a href="mailto:license@bogdan-ai.com" className="text-purple-400 hover:text-purple-300">license@bogdan-ai.com</a>
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