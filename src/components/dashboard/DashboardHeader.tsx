import { Search, Settings, Moon, Sun, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleDarkMode } from '@/store/slices/preferencesSlice';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onOpenSettings: () => void;
}

export const DashboardHeader = ({ onSearch, onOpenSettings }: DashboardHeaderProps) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.preferences.darkMode);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search content across all categories..."
            className="pl-10 w-full max-w-2xl bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDarkModeToggle}
            className="hover:bg-muted"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="hover:bg-muted"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="ml-2 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};