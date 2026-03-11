import { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. INICIALIZAÇÃO INTELIGENTE (Lazy Initialization)
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

  // 🚀 OTIMIZAÇÃO: useMemo garante que os componentes filhos não re-renderizem à toa
  const value = useMemo(() => ({
    user,
    token,
    login,
    logout
  }), [user, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. IGNORAR AVISO DO FAST REFRESH
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);