import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Компания',
      links: [
        { label: 'Возможности', href: '/#features' },
        { label: 'Обновления', href: '/#updates' },
        { label: 'О нас', href: '/about' },
        { label: 'Связаться с нами', href: '/contact' }
      ]
    },
    {
      title: 'Документы',
      links: [
        { label: 'Политика конфиденциальности', href: '/privacy' },
        { label: 'Условия использования', href: '/terms' },
        { label: 'Лицензионное соглашение', href: '/license' }
      ]
    }
  ];

  const socialLinks = [
    { icon: 'Github', href: '#', label: 'GitHub' },
    { icon: 'Twitter', href: '#', label: 'Twitter' },
    { icon: 'Linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'Mail', href: '#', label: 'Email' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-t border-white/10">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0iIzhhNWNmNiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={48} />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Богдан ИИ
                </h3>
                <p className="text-xs text-gray-400">Умный помощник нового поколения</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Современная платформа на базе искусственного интеллекта для общения, перевода, 
              обработки файлов и автоматизации задач.
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:border-purple-400"
                >
                  <Icon name={social.icon as any} size={18} className="text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Богдан ИИ. Все права защищены.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Карта сайта
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}