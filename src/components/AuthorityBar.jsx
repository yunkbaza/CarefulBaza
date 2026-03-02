export default function AuthorityBar() {
  return (
    <div className="w-full bg-black dark:bg-gray-950 py-6 border-t-2 border-baza-mint transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 text-[10px] md:text-xs font-bold text-baza-lavender dark:text-baza-mint uppercase tracking-[0.2em]">
        <div className="flex items-center gap-3">
          <span className="text-baza-lavender dark:text-baza-mint font-syne text-sm bg-baza-mint/10 w-6 h-6 flex items-center justify-center rounded-full">01</span> 
          Dermatologicamente Testado
        </div>
        <div className="flex items-center gap-3">
          <span className="text-baza-lavender dark:text-baza-mint font-syne text-sm bg-baza-mint/10 w-6 h-6 flex items-center justify-center rounded-full">02</span> 
          Eficácia Comprovada
        </div>
        <div className="flex items-center gap-3">
          <span className="text-baza-lavender dark:text-baza-mint font-syne text-sm bg-baza-mint/10 w-6 h-6 flex items-center justify-center rounded-full">03</span> 
          Ativos Concentrados
        </div>
      </div>
    </div>
  );
}