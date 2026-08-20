import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, UserRound } from 'lucide-react';
import { adminAPI } from '../api';

//渲染:渲染AdminUsers组件或页面内容
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
              //执行组件副作用逻辑

    adminAPI.getUsers().then(setUsers).catch((err) => {
                                               //处理异步请求异常
                                               return setError(err.message);
                                             }).finally(() => {
                                                                                       //处理异步请求结束状态
                                                                                       return setLoading(false);
                                                                                     });
  }, []);

  const filtered = useMemo(() => {
                             //计算并缓存派生数据

    const value = query.trim().toLowerCase();
    return users.filter((user) => {
                          //筛选符合条件的数据
                          return !value || `${user.name} ${user.username} ${user.role} ${user.id}`.toLowerCase().includes(value);
                        });
  }, [users, query]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-24">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="font-heading text-4xl font-bold text-slate-900">User information lookup</h1>
          <p className="mt-2 text-slate-500">Search account identifiers, names and permission roles. Passwords and tokens are never returned.</p>
        </header>
        <label className="relative mb-6 block max-w-xl"><span className="sr-only">Search users</span><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} /><input value={query} onChange={(event) => {
                                                                                                                                                                                                                              //处理页面交互事件
                                                                                                                                                                                                                              return setQuery(event.target.value);
                                                                                                                                                                                                                            }} placeholder="Search name, username, role or ID" className="w-full rounded-xl border-slate-300 py-3 pl-11" /></label>
        {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 text-sm text-slate-500">{loading ? 'Loading users…' : `${filtered.length} account(s)`}</div>
          <div className="overflow-x-auto"><table className="w-full"><thead className="bg-slate-50 text-left text-sm text-slate-500"><tr><th className="p-4">User</th><th className="p-4">Username</th><th className="p-4">Role</th><th className="p-4">ID</th></tr></thead><tbody>{filtered.map((user) => {
                                                                                                                                                                                                                                                                                                   //渲染:渲染列表内容
                                                                                                                                                                                                                                                                                                   return <tr key={user.id} className="border-t border-slate-100"><td className="p-4"><span className="flex items-center gap-3 font-semibold text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-primary"><UserRound size={18} /></span>{user.name}</span></td><td className="p-4 text-slate-600">@{user.username}</td><td className="p-4"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}`}><ShieldCheck size={13} />{user.role}</span></td><td className="p-4 font-mono text-xs text-slate-400">{user.id}</td></tr>;
                                                                                                                                                                                                                                                                                                 })}</tbody></table></div>
        </div>
      </main>
    </div>
  );
}
