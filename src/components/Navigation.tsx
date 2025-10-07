import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onSettingsClick: () => void;
}

export default function Navigation({ onSettingsClick }: NavigationProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { icon: 'Home', label: t.nav.home, href: '/' },
    { icon: 'Sparkles', label: t.nav.features, action: scrollToFeatures },
    { icon: 'BookOpen', label: t.nav.docs, href: '/docs' },
    { icon: 'MessageSquare', label: t.nav.support, href: '/support' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={40} />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Богдан ИИ
              </h1>
              <p className="text-xs text-gray-400">AI Assistant</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item, idx) => (
              item.href ? (
                <Link key={idx} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <Icon name={item.icon as any} size={16} />
                    {item.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  onClick={item.action as any}
                  className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
                >
                  <Icon name={item.icon as any} size={16} />
                  {item.label}
                </Button>
              )
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
            >
              <Icon name="Settings" size={16} />
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:bg-white/10"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-2">
              {menuItems.map((item, idx) => (
                item.href ? (
                  <Link key={idx} to={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 gap-3"
                    >
                      <Icon name={item.icon as any} size={18} />
                      {item.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-white hover:bg-white/10 gap-3"
                    onClick={() => {
                      (item.action as any)();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon name={item.icon as any} size={18} />
                    {item.label}
                  </Button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}