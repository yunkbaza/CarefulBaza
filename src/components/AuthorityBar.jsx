export default function AuthorityBar() {
  return (
    <div className="w-full bg-black py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 text-[10px] md:text-xs font-bold text-baza-lavender uppercase tracking-[0.2em]">
        <div className="flex items-center gap-3">
          <span className="text-baza-mint font-syne text-sm">01</span> Dermatologicamente Testado
        </div>
        <div className="flex items-center gap-3">
          <span className="text-baza-mint font-syne text-sm">02</span> Eficácia Comprovada
        </div>
        <div className="flex items-center gap-3">
          <span className="text-baza-mint font-syne text-sm">03</span> Ativos Concentrados
        </div>
      </div>
    </div>
  );
}