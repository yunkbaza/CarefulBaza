import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Novo Estado: Controla se a conta foi criada para mostrar o ecrã de sucesso
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao criar conta.');

      // Em vez de alert e redirecionar, mostramos o ecrã de sucesso no mesmo lugar!
      setIsRegistered(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="hidden lg:flex w-1/2 bg-gray-50 dark:bg-black relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-baza-mint/10 dark:bg-baza-lavender/10 z-10 mix-blend-multiply"></div>
        <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop" alt="Textura Skincare" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute z-20 text-center text-white px-12">
          <h2 className="font-syne text-4xl font-bold mb-4">Seu ritual começa aqui.</h2>
          <p className="text-sm uppercase tracking-widest font-bold opacity-80">Junte-se à Careful Baza</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32">
        <div className="w-full max-w-md mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para Home
          </Link>

          {isRegistered ? (
            // ================= ECRÃ DE SUCESSO ELEGANTE =================
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-4">Verifique o seu E-mail</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 leading-relaxed">
                Enviámos um link de verificação para <strong>{email}</strong>. 
                Por favor, clique no link recebido para ativar a sua conta antes de fazer o login.
              </p>
              <Link to="/login" className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors">
                Ir para o Login
              </Link>
            </div>
          ) : (
            // ================= FORMULÁRIO ORIGINAL =================
            <div className="animate-fade-in">
              <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Criar Conta</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Preencha os dados para criar a sua conta de acesso.</p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Nome Completo</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="O seu nome" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">E-mail</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="o.seu@email.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Senha</label>
                  <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" placeholder="Mínimo de 6 caracteres" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors shadow-lg mt-4 flex justify-center">
                  {loading ? <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div> : 'Finalizar Cadastro'}
                </button>
              </form>

              <div className="mt-10 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Já tem uma conta? <Link to="/login" className="font-bold text-gray-900 dark:text-white hover:text-baza-lavender transition-colors">Faça login</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}