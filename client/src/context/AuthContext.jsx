import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, wsClient } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 页面加载时检查本地存储的登录状态
  useEffect(() => {
    const saved = localStorage.getItem('mall_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.token) {
          setUser(parsed);
          // 验证 token 是否仍然有效
          authAPI.getMe().then(userData => {
            setUser({ ...userData, token: parsed.token });
          }).catch(() => {
            // token 失效，清除登录状态
            localStorage.removeItem('mall_user');
            wsClient.setToken(null);
            setUser(null);
          });
        } else {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem('mall_user');
      }
    }
    setLoading(false);
  }, []);

  // 登录函数
  const login = async (username, password) => {
    const res = await authAPI.login(username, password);
    const userData = { ...res.user, token: res.token };
    setUser(userData);
    localStorage.setItem('mall_user', JSON.stringify(userData));
    wsClient.setToken(res.token);
    return userData;
  };

  // 注册函数
  const register = async (username, password, name) => {
    const res = await authAPI.register(username, password, name);
    const userData = { ...res.user, token: res.token };
    setUser(userData);
    localStorage.setItem('mall_user', JSON.stringify(userData));
    wsClient.setToken(res.token);
    return userData;
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mall_user');
    wsClient.disconnect();
  };

  // 检查是否为管理员
  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
