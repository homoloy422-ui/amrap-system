import React, { useState } from 'react';
import { Activity, Plus, Trash2, X } from 'lucide-react';
import { Plan } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface PlanManagementProps {
  plans: Plan[];
}

const PlanManagement: React.FC<PlanManagementProps> = ({ plans }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    durationMonths: 1,
    amount: 0,
    features: ['Access to all equipment', 'Free locker', 'Locker access']
  });

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'plans'), newPlan);
      setIsModalOpen(false);
      setNewPlan({ name: '', durationMonths: 1, amount: 0, features: ['Access to all equipment', 'Free locker', 'Locker access'] });
      alert('New Protocol Deployed successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure? This may affect existing members.')) {
      try {
        await deleteDoc(doc(db, 'plans', id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Titan Ranks</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Configure your forces and subscription tiers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 transition-all text-center"
        >
          CREATE NEW TIER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl flex flex-col gap-8 relative overflow-hidden group hover:bg-white/10 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-red-600/20 transition-all" />
            
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-red-600/10 rounded-[1.25rem] flex items-center justify-center border border-red-600/20">
                 <Activity className="text-red-500" size={28} />
              </div>
              <button 
                onClick={() => handleDeletePlan(plan.id!)}
                className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-xl transition-all"
              >
                 <Trash2 size={20} />
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">{plan.durationMonths} Month Protocol</p>
            </div>

            <div className="space-y-3">
               {['All Equipment Access', 'Elite Trainer Support', 'AMRAP Community'].map((f, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                   <span className="text-xs text-slate-400 font-medium">{f}</span>
                 </div>
               ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter">₹{plan.amount}</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">/ ONE TIME</span>
            </div>

            <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">
               MODIFY TIER
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic tracking-tighter">NEW PROTOCOL</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1">TIER NAME</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-red-600 transition-all font-bold"
                    placeholder="e.g. AMRAP Elite"
                    value={newPlan.name}
                    onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1">DURATION (MONTHS)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-red-600 transition-all font-bold"
                      value={newPlan.durationMonths || ''}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setNewPlan({...newPlan, durationMonths: isNaN(val) ? 0 : val});
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 px-1">FEE (₹)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-red-600 transition-all font-bold"
                      value={newPlan.amount || ''}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setNewPlan({...newPlan, amount: isNaN(val) ? 0 : val});
                      }}
                    />
                  </div>
                </div>
                  <button 
                    type="submit"
                    className="w-full bg-red-600 text-white py-5 rounded-2xl font-black tracking-[0.2em] uppercase shadow-xl shadow-red-600/20 active:scale-95 transition-all mt-4"
                  >
                    DEPLOY PROTOCOL
                  </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanManagement;
