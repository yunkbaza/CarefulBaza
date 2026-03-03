import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. INICIALIZAÇÃO INTELIGENTE (Lazy Initialization)
  // Resolve o erro do useEffect e evita re-renderizações desnecessárias
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('@CarefulBaza:user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('@CarefulBaza:token') || null;
  });

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('@CarefulBaza:user', JSON.stringify(userData));
    localStorage.setItem('@CarefulBaza:token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@CarefulBaza:user');
    localStorage.removeItem('@CarefulBaza:token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. IGNORAR AVISO DO FAST REFRESH
// Permite manter o hook "useAuth" junto com o seu Provider para o código ficar mais limpo
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);