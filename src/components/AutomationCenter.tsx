import React from 'react';
import { MessageSquare, Bell, Zap, Send, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';
import { Member } from '../types';

interface AutomationCenterProps {
  members: Member[];
  onSendBulk: (type: 'welcome' | 'reminder' | 'expiry') => void;
}

const AutomationCenter: React.FC<AutomationCenterProps> = ({ members, onSendBulk }) => {
  const dueMembers = members.filter(m => {
    const dueDate = new Date(m.dueDate);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= now;
  });

  const overdueMembers = members.filter(m => new Date(m.dueDate) < new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Automation Engine</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Smart notifications and AMRAP WhatsApp triggers.</p>
        </div>
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
           <CheckCircle2 className="text-green-500" size={16} />
           <span className="text-[10px] font-black tracking-widest text-green-400 uppercase">ENGINE OPTIMAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rules Card */}
        <div className="lg:col-span-2 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-600/30">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black italic tracking-tight uppercase">Protocol Rules</h3>
             </div>
             <button className="text-[10px] font-black tracking-widest uppercase bg-white/5 px-4 py-2 rounded-lg border border-white/10">MODIFIER</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Welcome Protocol', desc: 'Auto-send on registration', icon: MessageSquare, status: 'active' },
              { label: 'T-3 Reminder', desc: 'Pre-expiry notification', icon: Clock, status: 'active' },
              { label: 'T-0 Expiry Alert', desc: 'Sent on membership end', icon: Bell, status: 'active' },
              { label: 'Fortress Access', desc: 'Entrance confirmation', icon: Zap, status: 'inactive' },
            ].map((rule, i) => (
              <div key={i} className="flex items-center gap-5 bg-white/2 p-5 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all group">
                <div className={`w-12 h-12 ${rule.status === 'active' ? 'bg-red-600/10' : 'bg-slate-800'} rounded-2xl flex items-center justify-center shrink-0 border border-white/5`}>
                  <rule.icon className={rule.status === 'active' ? 'text-red-500' : 'text-slate-600'} size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-200">{rule.label}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{rule.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${rule.status === 'active' ? 'bg-red-600 shadow-inner' : 'bg-slate-800'}`}>
                   <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${rule.status === 'active' ? 'right-1 shadow-lg' : 'left-1 opacity-20'}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-red-600/5 border border-red-600/20 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <AlertTriangle className="text-red-500" size={24} />
                <p className="text-xs font-medium text-slate-300">WhatsApp API limit approaching (820/1000 messages)</p>
             </div>
             <button className="w-full sm:w-auto text-[10px] font-black bg-red-600 text-white px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg shadow-red-600/20">UPGRADE</button>
          </div>
        </div>

        {/* Console / System Logs */}
        <div className="bg-[#050505] p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl flex flex-col space-y-6">
           <div className="flex items-center gap-3">
              <Terminal className="text-red-600" size={20} />
              <h3 className="text-lg font-black tracking-tight italic uppercase">System Core</h3>
           </div>

           <div className="flex-1 font-mono text-[10px] overflow-hidden relative">
              <div className="space-y-3 opacity-50">
                 <p className="text-green-500">[SYSTEM] Initialization complete...</p>
                 <p className="text-slate-400">[CRON] Checking member databases...</p>
                 <p className="text-red-600">[ALERT] Titan #{Math.floor(Math.random()*9000)+1000} membership expired.</p>
                 <p className="text-green-500 text-xs">[WHATSAPP] Gateway connected - iron-titan-api-v2</p>
                 <p className="text-slate-500">[LOG] Message queue: 0 pending</p>
                 <p className="text-slate-500">[LOG] Memory usage: 128MB</p>
                 <p className="text-slate-500">[LOG] Uptime: 42 days 12h</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent" />
           </div>

           <div className="space-y-4 pt-6 border-t border-white/5">
              <button 
                onClick={() => onSendBulk('reminder')}
                disabled={dueMembers.length === 0}
                className="w-full bg-green-500 text-white font-black text-[10px] tracking-widest uppercase py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20 disabled:opacity-30 disabled:grayscale"
              >
                <Send size={16} />
                Blast {dueMembers.length} Expiring Titans
              </button>
              <button 
                onClick={() => onSendBulk('expiry')}
                disabled={overdueMembers.length === 0}
                className="w-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 font-black text-[10px] tracking-widest uppercase py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-30"
              >
                <Bell size={16} />
                Notify {overdueMembers.length} Expired
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationCenter;
