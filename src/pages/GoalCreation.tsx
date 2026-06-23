import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoalService, Goal } from '../services/goalService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  Trophy,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

interface GoalFormItem {
  id: string;
  title: string;
  description: string;
  thrustArea: string;
  target: number;
  uom: string;
  weightage: number;
}

const THRUST_AREAS = [
  'Revenue Growth',
  'Operational Excellence',
  'Customer Success',
  'Innovation & Learning',
  'Risk & Compliance'
];

export default function GoalCreation() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [goalForms, setGoalForms] = useState<GoalFormItem[]>([
    { id: '1', title: '', description: '', thrustArea: '', target: 0, uom: '', weightage: 0 }
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGoal = () => {
    if (goalForms.length >= 8) {
      setError('Maximum 8 goals allowed per cycle.');
      return;
    }
    setGoalForms([...goalForms, { 
      id: Math.random().toString(36).substr(2, 9), 
      title: '', 
      description: '', 
      thrustArea: '', 
      target: 0, 
      uom: '', 
      weightage: 0 
    }]);
    setError(null);
  };

  const removeGoal = (id: string) => {
    if (goalForms.length === 1) return;
    setGoalForms(goalForms.filter(g => g.id !== id));
  };

  const updateGoal = (id: string, updates: Partial<GoalFormItem>) => {
    setGoalForms(goalForms.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const totalWeightage = goalForms.reduce((sum, g) => sum + (g.weightage || 0), 0);

  const validate = () => {
    if (totalWeightage !== 100) return 'Total weightage must be exactly 100%.';
    if (goalForms.some(g => (g.weightage || 0) < 10)) return 'Minimum weightage for any goal is 10%.';
    if (goalForms.some(g => !g.title || !g.thrustArea || !g.target)) return 'Please fill in all required fields for each goal.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    try {
      for (const form of goalForms) {
        await GoalService.createGoal({
          employeeId: profile!.uid,
          managerId: profile!.managerId || 'PENDING',
          title: form.title,
          description: form.description,
          target: form.target,
          uom: form.uom,
          weightage: form.weightage,
          thrustArea: form.thrustArea,
          cycle: '2024-Annual',
        });
      }
      navigate('/employee');
    } catch (err) {
      setError('Failed to save goals. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-900" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-950 tracking-tight uppercase italic">Strategic Objectives</h1>
            <p className="text-slate-500 font-medium text-sm">Targeting Excellence for 2024 Cycle</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Configuration Pulse</p>
            <p className={cn(
              "text-3xl font-display font-black tracking-tighter italic",
              totalWeightage === 100 ? "text-blue-700" : "text-amber-500"
            )}>
              {totalWeightage}% <span className="text-slate-300 text-xl font-normal not-italic">/ 100%</span>
            </p>
          </div>
          <button
            id="submit-goals-btn"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-3 px-8 py-4 bg-blue-900 text-white font-black rounded-2xl hover:bg-blue-800 transition-all shadow-2xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]"
          >
            {saving ? 'Transmitting...' : (
              <>
                Deploy Protocol
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 p-5 bg-red-50 text-red-700 rounded-2xl border-l-4 border-red-500 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-black uppercase tracking-widest">{error}</p>
        </motion.div>
      )}

      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {goalForms.map((form, index) => (
            <motion.div
              key={form.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 font-display font-black text-9xl italic -translate-y-1/4 translate-x-1/4 select-none">
                {index + 1}
              </div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-black italic shadow-lg shadow-black/20">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-950">Goal Specification</h3>
                </div>
                {goalForms.length > 1 && (
                  <button
                    onClick={() => removeGoal(form.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Objective Statement *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateGoal(form.id, { title: e.target.value })}
                    placeholder="e.g., Optimize regional supply chain latency by 12.5%"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-bold text-slate-900 outline-none placeholder:text-slate-300 placeholder:italic"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Strategic Thrust Area *</label>
                  <select
                    value={form.thrustArea}
                    onChange={(e) => updateGoal(form.id, { thrustArea: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none"
                  >
                    <option value="">Matrix Category</option>
                    {THRUST_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Impact Weightage (%) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={form.weightage || ''}
                      onChange={(e) => updateGoal(form.id, { weightage: parseInt(e.target.value) || 0 })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl italic">%</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantified Target *</label>
                  <input
                    type="number"
                    value={form.target || ''}
                    onChange={(e) => updateGoal(form.id, { target: parseInt(e.target.value) || 0 })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit descriptor (UoM) *</label>
                  <input
                    type="text"
                    value={form.uom}
                    onChange={(e) => updateGoal(form.id, { uom: e.target.value })}
                    placeholder="KPI Metric"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={addGoal}
          className="w-full py-12 border-4 border-dashed border-slate-100 rounded-3xl text-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-black uppercase tracking-[0.3em] text-xs">Append New Objective</span>
          <span className="text-[10px] font-black opacity-50 italic">Deployment Slot {goalForms.length} / 08</span>
        </button>
      </div>

      <div className="h-20" /> {/* Spacer */}
    </div>
  );
}
