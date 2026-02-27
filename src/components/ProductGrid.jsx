export default function ProductGrid() {
  // Lista temporária de produtos (depois isso virá do banco de dados/API)
  const produtos = [
    {
      id: 1,
      nome: "Sérum Facial Iluminador",
      preco: "R$ 129,90",
      imagem: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tag: "Mais Vendido",
    },
    {
      id: 2,
      nome: "Base Líquida Efeito Blur",
      preco: "R$ 145,00",
      imagem: "https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tag: "Novidade",
    },
    {
      id: 3,
      nome: "Gloss Labial Velvet",
      preco: "R$ 79,90",
      imagem: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tag: "",
    },
    {
      id: 4,
      nome: "Hidratante Nuvem Base",
      preco: "R$ 110,00",
      imagem: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tag: "Vegano",
    },
  ];

  return (
    <section className="px-6 py-16 md:px-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-black text-gray-800 mb-10 text-center">
        Favoritos da <span className="text-baza-lavender">Estação</span>
      </h2>

      {/* Grid: 1 coluna no celular, 2 no tablet, 4 no PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {produtos.map((produto) => (
          <div key={produto.id} className="group bg-white rounded-2xl p-4 shadow-sm border border-baza-lavender/10 hover:shadow-xl hover:border-baza-lavender/30 transition-all duration-300 relative flex flex-col">
            
            {/* Imagem do Produto */}
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-baza-creme mb-4 relative">
              <img 
                src={produto.imagem} 
                alt={produto.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Etiqueta condicional */}
              {produto.tag && (
                <span className="absolute top-3 left-3 bg-baza-mint text-baza-lavender text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                  {produto.tag}
                </span>
              )}
            </div>

            {/* Informações */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                {produto.nome}
              </h3>
              <p className="text-baza-lavender font-black text-lg mb-4 mt-auto">
                {produto.preco}
              </p>
              
              {/* Botão de Compra */}
              <button className="w-full bg-gray-50 text-gray-800 border border-gray-200 py-2.5 rounded-xl text-sm font-bold group-hover:bg-baza-lavender group-hover:text-white group-hover:border-baza-lavender transition-colors">
                Adicionar à Sacola
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}