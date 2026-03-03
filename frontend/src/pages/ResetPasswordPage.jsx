import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage({ type: 'error', text: 'Token de recuperação inválido ou ausente no link.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessage({ type: 'success', text: data.message });
      // Redireciona para o login após 3 segundos para o cliente ver o sucesso
      setTimeout(() => navigate('/login'), 3000); 
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-10 max-w-lg w-full text-center border border-gray-100 dark:border-gray-700 shadow-xl rounded-sm">
        
        <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-4">Nova Senha</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Insira a sua nova senha de acesso à Careful Baza Labs.</p>

        {message.text && (
          <div className={`p-4 mb-6 border-l-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <input 
            type="password" 
            required 
            minLength={6}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-4 text-gray-900 dark:text-white outline-none focus:border-baza-lavender" 
            placeholder="Nova Senha (Mín. 6 caracteres)" 
          />
          <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender transition-colors disabled:opacity-50">
            {loading ? 'A processar...' : 'Atualizar Senha'}
          </button>
        </form>
        
        <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
           <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors">Cancelar e voltar ao Login</Link>
        </div>
      </div>
    </main>
  );
}