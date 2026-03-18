import { useState } from 'react';
import { Link } from 'react-router-dom';
// Certifique-se de que o caminho aponta para a pasta onde guardou o componente
import AdminAliExpressImporter from '../components/AdminAliExpressImporter'; 

export default function AdminProductsPage() {
  
  // Estado para mostrar os produtos recém-importados instantaneamente na tela
  const [recentImports, setRecentImports] = useState([]);

  // Função que o Importer vai chamar quando tiver sucesso
  const handleImportSuccess = (newProduct) => {
    setRecentImports((prev) => [newProduct, ...prev]);
  };
  
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pt-24 pb-32 px-5 sm:px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho do Admin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#a79af0] dark:hover:text-[#dff3c8] transition-colors mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Voltar à Loja
            </Link>
            <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Gestão de Catálogo
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Importe e gira os seus produtos de dropshipping.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Lado Esquerdo: A Ferramenta Mágica (Ocupa 1 coluna) */}
          <div className="lg:col-span-1 sticky top-32">
            {/* Aqui estamos a usar o componente que você criou no passo anterior */}
            <AdminAliExpressImporter onImportSuccess={handleImportSuccess} />
          </div>

          {/* Lado Direito: Produtos Recentes (Ocupa 2 colunas) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-['Syne',sans-serif] text-xl font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              Importações Recentes ({recentImports.length})
            </h2>

            {recentImports.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
                <svg className="w-12 h-12 mb-4 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Nenhum produto importado nesta sessão.</p>
                <p className="text-sm mt-1">Insira um ID do AliExpress ao lado para começar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentImports.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md">
                    <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                        Dropshipping
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-['Syne',sans-serif] font-bold text-zinc-900 dark:text-zinc-50 text-sm line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[#a79af0] dark:text-[#dff3c8] font-bold text-lg">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-zinc-400 line-through text-xs">
                              R$ {product.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                        <span>ID: {product.id.split('-')[0]}...</span>
                        <span className="text-green-500 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Ativo
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}