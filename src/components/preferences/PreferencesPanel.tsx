import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCategory } from '@/store/slices/preferencesSlice';
import { AVAILABLE_CATEGORIES } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreferencesPanelProps {
  onClose: () => void;
}

export const PreferencesPanel = ({ onClose }: PreferencesPanelProps) => {
  const dispatch = useDispatch();
  const selectedCategories = useSelector((state: RootState) => state.preferences.categories);

  const handleToggleCategory = (category: string) => {
    dispatch(toggleCategory(category));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevated max-w-2xl w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Preferences</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your content feed by selecting your favorite categories
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Selected Categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories selected</p>
              ) : (
                selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="default"
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => handleToggleCategory(category)}
                  >
                    {category}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Available Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <Button
                    key={category}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      "justify-start capitalize",
                      isSelected && "bg-gradient-primary hover:opacity-90"
                    )}
                    onClick={() => handleToggleCategory(category)}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};