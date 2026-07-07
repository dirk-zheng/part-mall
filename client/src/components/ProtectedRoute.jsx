import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// 需要登录才能访问的组件
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-primary animate-spin" />
          <p className="text-dark-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // 未登录，重定向到登录页，并记录当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 需要管理员权限才能访问的组件
export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-primary animate-spin" />
          <p className="text-dark-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // 非管理员，重定向到首页
    return <Navigate to="/" replace />;
  }

  return children;
}
