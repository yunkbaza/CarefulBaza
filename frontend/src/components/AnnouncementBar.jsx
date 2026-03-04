import { useTranslation } from 'react-i18next';

export default function AnnouncementBar() {
  const { t } = useTranslation();

  return (
    <div className="bg-black dark:bg-gray-950 text-baza-lavender dark:text-baza-mint text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-center py-2.5 px-4 z-[60] relative transition-colors duration-300">
      <span className="text-baza-lavender dark:text-baza-mint mr-2">✦</span> 
      {t('announcement.shipping')}
      <span className="text-baza-lavender dark:text-baza-mint ml-2">✦</span>
    </div>
  );
}