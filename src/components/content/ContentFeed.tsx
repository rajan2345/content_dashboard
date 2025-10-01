import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchContent } from '@/store/slices/contentSlice';
import { ContentCard } from './ContentCard';
import { Loader2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { reorderContent } from '@/store/slices/contentSlice';

interface ContentFeedProps {
  searchQuery?: string;
  isDraggable?: boolean;
}

export const ContentFeed = ({ searchQuery = '', isDraggable = false }: ContentFeedProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, hasMore, page } = useSelector((state: RootState) => state.content);
  const categories = useSelector((state: RootState) => state.preferences.categories);
  const observerTarget = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchContent({ page: 1, categories }));
  }, [dispatch, categories]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchContent({ page: page + 1, categories }));
    }
  }, [dispatch, loading, hasMore, page, categories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  const filteredItems = searchQuery
    ? items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredItems.findIndex(item => item.id === active.id);
      const newIndex = filteredItems.findIndex(item => item.id === over.id);
      const newOrder = arrayMove(filteredItems, oldIndex, newIndex);
      dispatch(reorderContent(newOrder));
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg font-medium text-muted-foreground">No content found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or preferences
        </p>
      </div>
    );
  }

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <ContentCard key={item.id} item={item} isDraggable={isDraggable} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {isDraggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredItems.map(i => i.id)} strategy={rectSortingStrategy}>
            {content}
          </SortableContext>
        </DndContext>
      ) : (
        content
      )}

      {hasMore && (
        <div ref={observerTarget} className="flex items-center justify-center py-8">
          {loading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
      )}
    </div>
  );
};
