import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GoalService, Goal } from '../services/goalService';
import { motion } from 'motion/react';
import { 
  Plus, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Target,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateCompletion, cn } from '../lib/utils';

export default function EmployeeDashboard() {
  const { profile } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadGoals();
    }
  }, [profile]);

  const loadGoals = async () => {
    try {
      const data = await GoalService.getUserGoals(profile!.uid);
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalWeightage = goals.reduce((sum, g) => sum + (g.weightage || 0), 0);
  const approvedGoals = goals.filter(g => g.status === 'approved');
  const pendingGoals = goals.filter(g => g.status === 'submitted');
  
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + calculateCompletion(0, g.target), 0) / goals.length) 
    : 0;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Dashboard</h1>
          <p className="text-slate-500">Cycle: 2024 Annual Performance Review</p>
        </div>
        <div className="flex gap-3">
          <Link
            id="create-goal-btn"
            to="/goals/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-black rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-black/20 uppercase tracking-widest text-[11px]"
          >
            <Plus className="w-4 h-4" />
            Set New Goals
          </Link>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Overall Completion</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{overallProgress}%</p>
            <p className="text-[10px] text-green-600 mb-1 font-bold">Targeted</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              className="bg-blue-900 h-full"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Goals</p>
          <p className="text-3xl font-bold text-slate-900">{goals.length.toString().padStart(2, '0')}</p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Maximum allowed: 08</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Weightage</p>
          <p className={cn("text-3xl font-bold", totalWeightage === 100 ? "text-blue-700" : "text-amber-500")}>
            {totalWeightage}%
          </p>
          <p className={cn(
            "text-[10px] mt-2 flex items-center font-bold uppercase tracking-wider",
            totalWeightage === 100 ? "text-green-600" : "text-amber-600"
          )}>
            <span className={cn("inline-block w-2 h-2 rounded-full mr-1.5", totalWeightage === 100 ? "bg-green-500" : "bg-amber-500")}></span>
            {totalWeightage === 100 ? 'Valid Balance' : 'Action Required'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cycle Status</p>
          <p className="text-3xl font-bold text-emerald-600 uppercase font-display italic tracking-tighter">Drafting</p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Closes in 14 days</p>
        </div>
      </div>

      {/* Goals Table/List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="font-bold text-slate-900">Quarterly Performance Goals</h2>
          <Link to="/goals/new" className="text-[10px] font-bold text-blue-700 uppercase tracking-widest hover:underline">
            + New Goal
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap">Goal Title</th>
                <th className="px-5 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap">Thrust Area</th>
                <th className="px-5 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap">UoM</th>
                <th className="px-5 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 text-center whitespace-nowrap">Weight</th>
                <th className="px-5 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap">Status</th>
                <th className="px-5 py-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {goals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic text-sm">
                    No goals set for this cycle yet. Use "+" to begin.
                  </td>
                </tr>
              ) : (
                goals.map((goal) => (
                  <tr key={goal.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="font-semibold text-slate-900 leading-snug">{goal.title}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-slate-500 italic text-xs">{goal.thrustArea}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-600 text-xs uppercase tracking-tight">
                       {goal.target} {goal.uom}
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {goal.weightage}%
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={goal.status} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button className="text-slate-400 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-all group-hover:translate-x-1">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    slate: 'bg-slate-50 text-slate-600',
    green: 'bg-emerald-50 text-emerald-600',
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
      <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    draft: 'bg-slate-100 text-slate-700',
    submitted: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize", styles[status])}>
      {status}
    </span>
  );
}
