import { ContentItem } from '@/types/content';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink, Newspaper, Film, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentCardProps {
  item: ContentItem;
  isDraggable?: boolean;
}

export const ContentCard = ({ item, isDraggable = false }: ContentCardProps) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.id === item.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(item));
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'news':
        return <Newspaper className="h-4 w-4" />;
      case 'movie':
        return <Film className="h-4 w-4" />;
      case 'social':
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer animate-fade-in",
        isDragging && "opacity-50 scale-95"
      )}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {getTypeIcon()}
            {item.type}
          </Badge>
          <Badge variant="outline">{item.category}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{item.source}</span>
            <span>•</span>
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-colors",
                isFavorite && "text-destructive hover:text-destructive"
              )}
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};