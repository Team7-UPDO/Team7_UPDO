import Tab from '@/components/ui/Tab';

type GroupTabProps = {
  activeMain: '성장' | '네트워킹';
  handleMainChange: (value: '성장' | '네트워킹') => void;
};

export default function GroupTab({ activeMain, handleMainChange }: GroupTabProps) {
  const mainTabs = [
    { value: '성장', label: '성장' },
    { value: '네트워킹', label: '네트워킹' },
  ] as const;

  return (
    <div className="sm:mt-8">
      <Tab<'성장' | '네트워킹'> items={mainTabs} value={activeMain} onChange={handleMainChange} />
    </div>
  );
}
