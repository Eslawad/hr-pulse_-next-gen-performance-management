import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Download } from 'lucide-react';

const DATA = [
  { name: 'Q1', actual: 450, target: 400 },
  { name: 'Q2', actual: 520, target: 500 },
  { name: 'Q3', actual: 480, target: 550 },
  { name: 'Q4', actual: 610, target: 600 },
];

const DISTRIBUTION = [
  { name: 'Revenue', value: 40, color: '#1e3a8a' }, // Blue 900
  { name: 'Ops', value: 25, color: '#1d4ed8' },    // Blue 700
  { name: 'Innovation', value: 20, color: '#2563eb' }, // Blue 600
  { name: 'Customer', value: 15, color: '#2dd4bf' },   // Teal 400
];

export default function Analytics() {
  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Quarter,Actual,Target\n"
      + DATA.map(r => `${r.name},${r.actual},${r.target}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 italic tracking-tighter uppercase">Market Intelligence</h1>
          <p className="text-slate-500 font-medium">Strategic insight into organization-wide achievement metrics</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest text-[11px]"
        >
          <Download className="w-4 h-4" />
          Export Datastream
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Over Time */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col group hover:border-blue-100 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs">
              <TrendingUp className="w-4 h-4 text-blue-700" />
              Efficiency Target Delta
            </h2>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eff6ff" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  cursor={{fill: '#f0f9ff'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="actual" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#dbeafe" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col group hover:border-blue-100 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest text-xs">
              <PieIcon className="w-4 h-4 text-blue-500" />
              Strategic Objective Weightage
            </h2>
          </div>
          <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-center relative gap-8">
            <div className="w-full h-[250px] sm:w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 sm:flex sm:flex-col gap-4">
              {DISTRIBUTION.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-xl shadow-sm" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.name}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Efficiency */}
        <div className="lg:col-span-2 bg-blue-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-500/20">
                System Intelligence
              </div>
              <h2 className="text-4xl font-display font-black italic uppercase tracking-tighter leading-none">Operational Velocity</h2>
              <p className="text-slate-400 max-w-md font-medium leading-relaxed">Our data indicates organizational synchronization is peaking. Goal alignment velocity has increased by <span className="text-blue-400 font-black">22.4%</span> since the previous audit cycle.</p>
              
              <div className="flex flex-wrap gap-10 border-t border-white/5 pt-8 mt-4">
                <div className="group/stat">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 group-hover/stat:text-blue-400 transition-colors">Avg Resolution</p>
                  <p className="text-3xl font-mono font-bold tracking-tighter italic">3.8 <span className="text-xs text-slate-700 not-italic uppercase font-sans">Days</span></p>
                </div>
                <div className="group/stat">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 group-hover/stat:text-blue-400 transition-colors">Sync Rate</p>
                  <p className="text-3xl font-mono font-bold text-emerald-400 tracking-tighter italic">98.2%</p>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-sm h-48 bg-white/5 rounded-[2rem] border border-white/5 p-8 backdrop-blur-xl group-hover:border-blue-500/20 transition-all flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA}>
                      <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <p className="text-[9px] uppercase font-black tracking-[0.4em] text-slate-600 leading-none">Trend Velocity</p>
                  <span className="text-[10px] font-black text-blue-400">+12%</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
