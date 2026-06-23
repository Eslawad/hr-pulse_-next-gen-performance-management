import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Activity, 
  History, 
  AlertTriangle,
  UserPlus,
  RefreshCcw,
  BarChart2,
  FileText,
  Lock,
  Unlock,
  Terminal
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <AdminStat title="Active Nodes" value="1,240" sub="System Capacity: 98%" color="blue" />
         <AdminStat title="Global Delta" value="68%" sub="Avg Completion Rate" color="emerald" />
         <AdminStat title="Bypass Requests" value="24" sub="Pending Security Audit" color="amber" />
         <AdminStat title="Active Breaches" value="00" sub="Zero Threats Detected" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audit Log Terminal */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs">
              <Terminal className="w-4 h-4 text-blue-700" />
              Intelligence Feed
            </h2>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Live Link</span>
               <button onClick={loadAuditLogs} className="p-2 text-slate-400 hover:text-blue-700 transition-colors">
                 <RefreshCcw className="w-4 h-4" />
               </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto bg-slate-50/20">
            {logs.length === 0 ? (
              <div className="p-20 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-5" />
                <p className="text-xs font-bold uppercase tracking-widest italic leading-none">Zero activity in buffer</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Event Signature</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-blue-50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm shadow-black/20" />
                          <span className="font-bold text-slate-900 text-xs">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                         <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-100 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors uppercase">
                            {log.userId?.substring(0, 12)}
                         </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-[10px] font-bold text-slate-400 tabular-nums uppercase">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Protocols */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-blue-950 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden flex-1 group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-blue-500">Security Protocols</h2>
             
             <div className="space-y-6">
                <ProtocolItem label="Hard-Lock Cycle" status="ACTIVE" active icon={Lock} />
                <ProtocolItem label="Identity Audit" status="STANDBY" icon={Shield} />
                <ProtocolItem label="Maintenance" status="SCHEDULED" icon={RefreshCcw} />
                
                <div className="mt-12 p-6 bg-blue-900/30 border border-blue-800 rounded-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Cycle Horizon</p>
                   <div className="flex items-end justify-between mb-2">
                      <p className="text-2xl font-display font-black text-white italic">2024.1</p>
                      <p className="text-[10px] font-black text-blue-400 tracking-tighter uppercase italic">84% DEPLOYED</p>
                   </div>
                   <div className="w-full bg-blue-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[84%]" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStat({ title, value, sub, color }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full",
        color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : color === 'amber' ? 'bg-amber-600' : 'bg-slate-600'
      )} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{title}</p>
      <p className="text-3xl font-display font-black text-slate-950 tracking-tighter italic relative z-10 group-hover:text-blue-700 transition-colors leading-none">{value}</p>
      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight relative z-10 leading-none">{sub}</p>
    </div>
  );
}

function ProtocolItem({ label, status, active, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-900/40 border border-blue-800 rounded-2xl group hover:border-blue-500/50 transition-all cursor-pointer">
       <div className="flex items-center gap-3">
          <Icon className={cn("w-4 h-4", active ? "text-blue-400" : "text-blue-800")} />
          <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <span className={cn(
         "text-[9px] font-black px-2 py-0.5 rounded",
         active ? "bg-blue-600 text-white shadow-lg shadow-black/20" : "bg-blue-950 text-blue-800"
       )}>{status}</span>
    </div>
  );
}
