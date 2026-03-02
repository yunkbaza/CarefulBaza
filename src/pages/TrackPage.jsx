import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TrackPage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');

  const handleTrack = (e) => {
    e.preventDefault();
    if (!code) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('found');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-32 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-baza-lavender dark:hover:text-baza-lavender transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar para Home
        </Link>
        
        {/* Cartão de Rastreio */}
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 rounded-sm transition-colors duration-300">
          <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Rastreie seu Pedido</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 transition-colors">Insira o código de rastreio enviado para o seu e-mail.</p>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Ex: BR123456789" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-baza-lavender dark:focus:border-baza-lavender transition-colors"
            />
            <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-lavender hover:text-white transition-colors shadow-md">
              Rastrear
            </button>
          </form>

          {/* Animação de Carregamento */}
          {status === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-baza-lavender dark:border-t-baza-lavender rounded-full animate-spin"></div>
            </div>
          )}

          {/* Resultado do Rastreio (Linha do Tempo) */}
          {status === 'found' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-gray-100 dark:border-gray-700 pt-8 transition-colors">
              <span className="text-baza-mint font-bold uppercase tracking-widest text-[10px] mb-4 block">Status Atualizado</span>
              
              <div className="relative pl-6 border-l-2 border-baza-mint space-y-8">
                {/* Passo Atual */}
                <div className="relative">
                  <span className="absolute -left-[31px] bg-baza-mint w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 transition-colors"></span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors">Em trânsito para sua região</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Hoje, 09:42 - Centro Logístico, São Paulo</p>
                </div>
                {/* Passos Anteriores */}
                <div className="relative opacity-50">
                  <span className="absolute -left-[31px] bg-gray-300 dark:bg-gray-600 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 transition-colors"></span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors">Pedido Despachado</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Ontem, 15:30 - Careful Baza Labs</p>
                </div>
                <div className="relative opacity-50">
                  <span className="absolute -left-[31px] bg-gray-300 dark:bg-gray-600 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 transition-colors"></span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors">Pagamento Aprovado</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Ontem, 10:15 - Operadora de Cartão</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}