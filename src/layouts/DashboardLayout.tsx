import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  BarChart3, 
  LayoutDashboard, 
  PlusCircle, 
  CheckCircle2, 
  Settings, 
  LogOut,
  User,
  Users,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import React, { useMemo } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/employee', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
  { name: 'Team', path: '/manager', icon: Users, roles: ['manager', 'admin'] },
  { name: 'Admin', path: '/admin', icon: Shield, roles: ['admin'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['manager', 'admin'] },
];

export default function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS.filter(item => profile && item.roles.includes(profile.role));
  }, [profile]);

  const currentNavName = useMemo(() => {
    return NAV_ITEMS.find(i => location.pathname.startsWith(i.path))?.name || 'Dashboard';
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 flex flex-col shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center font-black text-white text-xl italic tracking-tighter">
            P
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">HR Pulse</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                  : "text-blue-300/50 hover:bg-blue-900 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-white" : "opacity-30")} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-blue-900/50">
          <div className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl bg-blue-900/30">
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center border border-blue-700 shadow-inner">
              <User className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">{profile?.name}</p>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black leading-none mt-1">{profile?.role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-blue-400 uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-transparent hover:border-blue-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              {currentNavName}
            </h2>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded uppercase tracking-wider leading-none">
              2024 Cycle Active
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Settings className="w-4 h-4 text-slate-400" />
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
