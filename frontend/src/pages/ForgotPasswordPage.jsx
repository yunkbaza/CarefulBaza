import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessage({ type: 'success', text: data.message });
      setEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro ao solicitar a recuperação.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-10 max-w-lg w-full border border-gray-100 dark:border-gray-700 shadow-xl rounded-sm">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Voltar para o Login
        </Link>

        <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-2">Recuperar Senha</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
          Insira o e-mail associado à sua conta. Se ele existir no nosso sistema, enviar-lhe-emos um link para criar uma nova senha.
        </p>

        {message.text && (
          <div className={`p-4 mb-6 border-l-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleForgot} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Seu E-mail</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-4 text-gray-900 dark:text-white outline-none focus:border-baza-lavender" 
              placeholder="seu@email.com" 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors disabled:opacity-50">
            {loading ? 'A Enviar...' : 'Enviar Link de Recuperação'}
          </button>
        </form>
      </div>
    </main>
  );
}