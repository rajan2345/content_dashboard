import { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ContentFeed } from '@/components/content/ContentFeed';
import { PreferencesPanel } from '@/components/preferences/PreferencesPanel';
import { ContentCard } from '@/components/content/ContentCard';
import { Sparkles } from 'lucide-react';

const DashboardContent = () => {
  const [activeSection, setActiveSection] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const darkMode = useSelector((state: RootState) => state.preferences.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    if (activeSection === 'favorites') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">My Favorites</h2>
              <p className="text-sm text-muted-foreground">
                {favorites.length} saved items
              </p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-lg font-medium text-muted-foreground">No favorites yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start adding content to your favorites by clicking the heart icon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      );
    }

    const sectionTitles: Record<string, { title: string; subtitle: string }> = {
      feed: { title: 'My Feed', subtitle: 'Personalized content based on your preferences' },
      trending: { title: 'Trending Now', subtitle: 'Most popular content across all categories' },
      news: { title: 'Latest News', subtitle: 'Breaking news and updates' },
      movies: { title: 'Movies & Shows', subtitle: 'Recommended entertainment for you' },
      social: { title: 'Social Feed', subtitle: 'Trending posts and updates' },
    };

    const { title, subtitle } = sectionTitles[activeSection] || sectionTitles.feed;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <ContentFeed searchQuery={searchQuery} isDraggable={activeSection === 'feed'} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onSearch={setSearchQuery}
        onOpenSettings={() => setShowPreferences(true)}
      />

      <div className="flex">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>

      {showPreferences && (
        <PreferencesPanel onClose={() => setShowPreferences(false)} />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  );
};

export default Index;
