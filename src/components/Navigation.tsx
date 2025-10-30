import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: 'Home', label: 'Главная' },
  { path: '/game', icon: 'Gamepad2', label: 'Игра' },
  { path: '/cheat', icon: 'Zap', label: 'Читы' },
  { path: '/profile', icon: 'User', label: 'Профиль' },
  { path: '/settings', icon: 'Settings', label: 'Настройки' }
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-blue-500/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-500">nursultan</span>
            <span className="text-xs text-gray-500 mt-1">client</span>
          </div>

          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
