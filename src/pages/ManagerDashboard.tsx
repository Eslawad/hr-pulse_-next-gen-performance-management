import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Goal, GoalService } from '../services/goalService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function ManagerDashboard() {
  const { profile } = useAuth();
  const [teamGoals, setTeamGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadTeamData();
    }
  }, [profile]);

  const loadTeamData = async () => {
    try {
      const data = await GoalService.getTeamGoals(profile!.uid);
      setTeamGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingApprovals = teamGoals.filter(g => g.status === 'submitted');
  const approvedGoals = teamGoals.filter(g => g.status === 'approved');

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Manager Command Center</h1>
        <p className="text-slate-500">Monitor team performance and approve objectives</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Direct Reports</p>
          <p className="text-3xl font-bold text-slate-900">08</p>
          <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-blue-700 h-full w-[100%]"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Approvals</p>
          <p className="text-3xl font-bold text-amber-500">{pendingApprovals.length.toString().padStart(2, '0')}</p>
          <Link to="/manager/approvals" className="text-[10px] text-blue-700 mt-2 font-bold uppercase hover:underline">Review Now</Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approved Goals</p>
          <p className="text-3xl font-bold text-blue-700">{approvedGoals.length.toString().padStart(2, '0')}</p>
          <p className="text-[10px] text-emerald-600 mt-2 flex items-center font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span> On Schedule
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Team Wellness</p>
          <p className="text-3xl font-bold text-blue-700 uppercase font-display italic tracking-tighter">Optimal</p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Updated 4h ago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[460px]">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 uppercase tracking-widest text-[11px]">Pending Goal Configurations</h2>
              <Link to="/manager/approvals" className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-blue-700 transition-colors">Audit All</Link>
            </div>
            
            <div className="flex-1 overflow-auto divide-y divide-slate-50">
              {pendingApprovals.length === 0 ? (
                <div className="p-20 text-center text-slate-400 italic text-sm">
                  Active cycle monitoring: No pending protocols found.
                </div>
              ) : (
                pendingApprovals.map(goal => (
                  <div key={goal.id} className="p-5 flex items-center justify-between hover:bg-blue-50/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-black/20">
                        {goal.title.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{goal.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">
                          Weight: <span className="font-bold text-slate-900">{goal.weightage}%</span> • Target: <span className="font-bold text-slate-900">{goal.target} {goal.uom}</span>
                        </p>
                      </div>
                    </div>
                    <Link 
                      to="/manager/approvals"
                      className="p-2 text-slate-200 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all group-hover:translate-x-1"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-blue-950 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden flex-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-blue-500 group-hover:text-blue-400 transition-colors">
              Operations Center
            </h2>
            <div className="space-y-4">
              <ManagerAction label="Schedule Q2 Review" />
              <ManagerAction label="Generate Intel Report" />
              <ManagerAction label="Audit Team Balance" />
              <button className="w-full text-center py-4 rounded-2xl bg-white text-blue-950 hover:bg-blue-50 transition-all text-xs font-black uppercase tracking-[0.2em] mt-8 shadow-lg">
                Broadcast Update
              </button>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
             <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Cycle Tip</p>
             <p className="text-sm font-medium italic leading-relaxed opacity-90">"Ensure all team weightages aggregate to precisely 100% before the Friday lockdown."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerAction({ label }: { label: string }) {
  return (
    <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-between group">
      {label}
      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 font-mono">{value}</h3>
    </div>
  );
}
