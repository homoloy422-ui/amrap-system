import React, { useState } from 'react';
import { 
  QrCode, 
  UserCheck, 
  Calendar, 
  Search,
  User
} from 'lucide-react';
import { Member, AttendanceRecord } from '../types';
import { motion } from 'motion/react';
import QRCode from 'react-qr-code';

interface AttendanceSystemProps {
  members: Member[];
  onCheckIn: (memberId: string) => void;
}

const AttendanceSystem: React.FC<AttendanceSystemProps> = ({ members, onCheckIn }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Attendance</h2>
          <p className="text-white/50 mt-1">Daily check-in Titan tracking.</p>
        </div>
        <div className="w-full sm:w-auto">
           <button 
            onClick={() => setShowQR(!showQR)}
            className="w-full sm:w-auto bg-brand-red text-white red-glow px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <QrCode size={20} />
            Gym QR Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manual Check-in */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black italic tracking-tighter">Manual Check-in</h3>
            <div className="p-2 bg-red-600/10 rounded-lg text-red-500">
               <UserCheck size={20} />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search titan name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {filteredMembers.map(member => (
              <div 
                key={member.id}
                onClick={() => setSelectedMember(member.id!)}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${selectedMember === member.id ? 'bg-red-600/10 border-red-600/30' : 'bg-white/2 border-white/5 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-slate-500 border border-white/5">
                      {member.photoUrl ? <img src={member.photoUrl} className="w-full h-full rounded-xl object-cover" /> : member.fullName.charAt(0)}
                   </div>
                   <div>
                      <p className="text-sm font-bold tracking-tight">{member.fullName}</p>
                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{member.phone}</p>
                   </div>
                </div>
                {selectedMember === member.id && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCheckIn(member.id!);
                    }}
                    className="bg-red-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-lg shadow-lg shadow-red-600/20"
                  >
                    PASS
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* QR Code/Display */}
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-lg flex flex-col items-center justify-center text-center space-y-6">
          {showQR ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-2xl"
            >
              <QRCode value="https://iron-titan.gym/checkin" size={180} />
              <p className="text-black font-black mt-4 text-[10px] tracking-[0.3em] uppercase">TITAN PASS</p>
            </motion.div>
          ) : (
            <div className="w-48 h-48 bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center">
               <QrCode size={48} className="text-white/5" />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase">Titan Access QR</h3>
            <p className="text-slate-500 text-xs mt-3 leading-relaxed max-w-[240px]">
              Let members scan this QR to automatically validate their training session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
