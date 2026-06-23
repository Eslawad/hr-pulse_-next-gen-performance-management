import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Goal, GoalService } from '../services/goalService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ArrowLeft,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function GoalApproval() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) loadPendingGoals();
  }, [profile]);

  const loadPendingGoals = async () => {
    try {
      const data = await GoalService.getTeamGoals(profile!.uid);
      setGoals(data.filter(g => g.status === 'submitted'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (goalId: string, action: 'approved' | 'rejected') => {
    setProcessingId(goalId);
    try {
      await GoalService.updateGoal(goalId, {
        status: action,
        isLocked: action === 'approved'
      });
      setGoals(goals.filter(g => g.id !== goalId));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-900" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-black text-slate-950 tracking-tight uppercase italic">Auditing Logic</h1>
          <p className="text-slate-500 font-medium text-sm italic">Review and validate team deployment protocols</p>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {goals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 italic text-sm font-medium"
            >
              Zero pending protocols detected. All team members aligned.
            </motion.div>
          ) : (
            goals.map(goal => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-8 md:items-center justify-between group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 font-display font-black text-6xl italic -translate-y-1/4 translate-x-1/4">
                   OBJ
                </div>

                <div className="flex-1 space-y-3 relative z-10">
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded border border-blue-100">
                      {goal.thrustArea}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest font-mono">ID: {goal.id?.substring(0, 8)}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-950 leading-tight">{goal.title}</h3>
                  <div className="flex flex-wrap gap-6 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                       TARGET <span className="text-slate-950 font-mono italic text-sm">{goal.target} {goal.uom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       IMPACT <span className="text-slate-950 font-mono italic text-sm">{goal.weightage}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <button
                    disabled={processingId === goal.id}
                    onClick={() => handleAction(goal.id!, 'rejected')}
                    className="flex items-center justify-center w-12 h-12 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                  <button
                    disabled={processingId === goal.id}
                    onClick={() => handleAction(goal.id!, 'approved')}
                    className="flex items-center gap-3 px-8 py-4 bg-blue-900 text-white font-black rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-black/20 disabled:opacity-50 uppercase tracking-widest text-[11px]"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Authorize
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="flex gap-6">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6 text-slate-950" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Deployment Lock Protocol</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Authorization of an objective initiates an immediate <span className="text-white font-bold">STATE_LOCK</span>. Employee modification privileges are revoked globally. Administrative override required for post-lock delta.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
