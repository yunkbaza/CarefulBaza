import { useState } from 'react';

export default function AdminAliExpressImporter({ onImportSuccess }) {
  const [aliExpressId, setAliExpressId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleImport = async (e) => {
    e.preventDefault();
    
    if (!aliExpressId.trim()) {
      setStatus({ type: 'error', message: 'Por favor, insira o ID do produto ou o link.' });
      return;
    }

    // Extrai apenas os números caso você cole o link inteiro sem querer
    const cleanId = aliExpressId.replace(/\D/g, '');

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // 📡 Dispara a requisição para a nossa rota recém-criada no Backend
      const response = await fetch('http://localhost:3000/api/products/import-aliexpress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Se tiver um token de Admin, adicione aqui: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ aliExpressId: cleanId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao importar produto.');
      }

      setStatus({ type: 'success', message: `Sucesso! "${data.product.name}" adicionado ao catálogo.` });
      setAliExpressId(''); // Limpa o campo
      
      // Atualiza a lista de produtos na tela (se a função for passada)
      if (onImportSuccess) onImportSuccess(data.product);

    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2 className="font-['Syne',sans-serif] text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Importação AliExpress
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Puxe dados, imagens e preços instantaneamente.
          </p>
        </div>
      </div>

      <form onSubmit={handleImport} className="flex flex-col gap-4">
        <div>
          <label htmlFor="aliExpressId" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
            ID do Produto
          </label>
          <input
            id="aliExpressId"
            type="text"
            value={aliExpressId}
            onChange={(e) => setAliExpressId(e.target.value)}
            placeholder="Ex: 100500123456789"
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#a79af0] dark:focus:ring-[#dff3c8] transition-all"
            disabled={isLoading}
          />
        </div>

        {status.message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/50' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800/50'
          }`}>
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold uppercase tracking-widest text-xs py-3.5 rounded-lg hover:bg-[#a79af0] dark:hover:bg-[#dff3c8] dark:hover:text-zinc-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              A Sincronizar...
            </>
          ) : (
            'Importar Produto'
          )}
        </button>
      </form>
    </div>
  );
}