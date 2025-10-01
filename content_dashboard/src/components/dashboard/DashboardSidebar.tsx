import { Home, Star, TrendingUp, Newspaper, Film, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'feed', label: 'My Feed', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'social', label: 'Social', icon: MessageCircle },
];

export const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ContentHub
          </h1>
          <p className="text-sm text-muted-foreground">Your personalized dashboard</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-elevated"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          <div className="rounded-lg bg-gradient-primary p-4 text-primary-foreground">
            <p className="text-sm font-medium">Upgrade to Pro</p>
            <p className="text-xs opacity-90 mt-1">Get unlimited access to all features</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
