import Category from '@/components/ui/Category';
import Tab from '@/components/ui/Tab';

type FavoriteTabsProps = {
  activeMain: '성장' | '네트워킹';
  handleMainChange: (value: '성장' | '네트워킹') => void;
  activeSubId?: string;
  activeSubType?: string;
  handleCategoryChange: (id: string, type: string) => void;
};

export default function FavoriteTabs({
  activeMain,
  handleMainChange,
  activeSubId,
  activeSubType,
  handleCategoryChange,
}: FavoriteTabsProps) {
  const mainTabs = [
    { value: '성장', label: '성장' },
    { value: '네트워킹', label: '네트워킹' },
  ] as const;

  return (
    <div className="mt-4 mb-4 sm:mt-8">
      <Tab<'성장' | '네트워킹'> items={mainTabs} value={activeMain} onChange={handleMainChange} />
      <div className="mt-4 flex flex-col gap-1.5 sm:mt-8 sm:items-start">
        {activeMain === '성장' && (
          <Category
            mainCategory="성장"
            activeId={activeSubId}
            activeType={activeSubType}
            onChange={handleCategoryChange}
          />
        )}
      </div>
    </div>
  );
}
