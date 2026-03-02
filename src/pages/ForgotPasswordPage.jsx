import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      navigate('/login');
    }, 4000);
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      
      <div className="hidden lg:flex w-1/2 bg-gray-50 dark:bg-black relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-baza-lavender/10 z-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <img 
          src="https://images.unsplash.com/photo-1571781926291-c477eb31f801?q=80&w=1000&auto=format&fit=crop" 
          alt="Textura Skincare" 
          className="w-full h-full object-cover grayscale opacity-80"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 md:px-20 lg:px-32">
        <div className="w-full max-w-md mx-auto">
          
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-baza-lavender transition-colors mb-12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para o Login
          </Link>

          {!isSent ? (
            <>
              <h1 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Esqueceu a senha?</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
                Digite o e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.
              </p>

              <form onSubmit={handleReset} className="space-y-6">
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

                <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-lavender hover:text-white transition-colors shadow-lg">
                  Enviar Link de Recuperação
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-baza-mint rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a79af0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">E-mail enviado!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Se o e-mail <strong>{email}</strong> estiver em nossa base, você receberá as instruções em instantes. Redirecionando...
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}