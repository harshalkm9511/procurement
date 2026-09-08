import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Settings, User as UserIcon, Sliders, ShieldCheck, Bell, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, scoringWeights, updateScoringWeights } = useProcurement();

  const [weights, setWeights] = useState(scoringWeights);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateScoringWeights(weights);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" />
            Platform Settings & AI Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage user profile, multi-criteria AI scoring weights & risk sensitivity parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Profile Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-cyan-400" />
            User Profile
          </h3>

          <div className="flex items-center gap-4 pt-2">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20"
            />
            <div>
              <h4 className="text-base font-bold text-white">{user.name}</h4>
              <p className="text-xs text-cyan-400 font-semibold">{user.role}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{user.organization}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <p><strong>Department:</strong> {user.department}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Access Level:</strong> Global Administrator (Full CRUD)</p>
          </div>
        </div>

        {/* AI Scoring Weights Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 lg:col-span-2">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                AI Evaluation Weight Model
              </h3>
              <p className="text-xs text-slate-400">Adjust decision matrix weight distribution (Must total 100%)</p>
            </div>

            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Weights Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Price Weight</span>
                <span className="text-cyan-300">{weights.price}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={weights.price}
                onChange={e => setWeights({ ...weights, price: Number(e.target.value) })}
                className="w-full accent-cyan-400 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Quality Weight</span>
                <span className="text-emerald-400">{weights.quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={weights.quality}
                onChange={e => setWeights({ ...weights, quality: Number(e.target.value) })}
                className="w-full accent-emerald-400 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Delivery Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Delivery Speed Weight</span>
                <span className="text-indigo-400">{weights.delivery}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={weights.delivery}
                onChange={e => setWeights({ ...weights, delivery: Number(e.target.value) })}
                className="w-full accent-indigo-400 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Risk Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Supplier Risk Weight</span>
                <span className="text-rose-400">{weights.risk}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.risk}
                onChange={e => setWeights({ ...weights, risk: Number(e.target.value) })}
                className="w-full accent-rose-400 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Performance Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Historical Performance Weight</span>
                <span className="text-blue-400">{weights.performance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.performance}
                onChange={e => setWeights({ ...weights, performance: Number(e.target.value) })}
                className="w-full accent-blue-400 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Model Parameters</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
