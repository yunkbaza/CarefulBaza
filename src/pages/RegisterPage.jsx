import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Conta criada com sucesso para ${name}! (Simulação de Cadastro)`);
    navigate('/');
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Coluna da Imagem (Esquerda) */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 dark:bg-black relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-baza-mint/10 dark:bg-baza-lavender/10 z-10 mix-blend-multiply"></div>
        <img 
          src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop" 
          alt="Textura Skincare" 
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
        />
        <div className="absolute z-20 text-center text-white px-12">
          <h2 className="font-syne text-4xl font-bold mb-4 text-gray-900 dark:text-white">Seu ritual começa aqui.</h2>
          <p className="text-sm uppercase tracking-widest font-bold opacity-80 text-gray-900 dark:text-gray-300">Junte-se ao Baza Labs</p>
        </div>
      </div>

      {/* Coluna do Formulário (Direita) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32">
        <div className="w-full max-w-md mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender dark:hover:text-baza-mint transition-colors mb-12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para Home
          </Link>

          <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Criar Conta</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
            Preencha seus dados para criar sua conta na Careful Baza.
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Nome Completo</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>

            <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-colors shadow-lg mt-4">
              Finalizar Cadastro
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-bold text-gray-900 dark:text-white hover:text-baza-lavender dark:hover:text-baza-mint transition-colors">
                Faça login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}