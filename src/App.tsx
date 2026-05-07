import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth } from './lib/firebase';
import { Member, Plan, Payment, GymStats, AttendanceRecord } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import MemberForm from './components/MemberForm';
import AttendanceSystem from './components/AttendanceSystem';
import PaymentManagement from './components/PaymentManagement';
import PlanManagement from './components/PlanManagement';
import AutomationCenter from './components/AutomationCenter';
import { sendWhatsAppMessage } from './services/whatsappService';
import { LogIn, Activity, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Error Handler
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch Members
    const membersPath = 'members';
    const unsubMembers = onSnapshot(query(collection(db, membersPath), orderBy('fullName')), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
      setMembers(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, membersPath));

    // Fetch Plans
    const plansPath = 'plans';
    const unsubPlans = onSnapshot(collection(db, plansPath), (snap) => {
      if (snap.empty) {
        // Bootstrap plans if none exist
        const defaultPlans = [
          { name: 'Monthly Protocol', amount: 1000, durationMonths: 1 },
          { name: '2 Month Protocol', amount: 2000, durationMonths: 2 },
          { name: '6 Month Protocol', amount: 3500, durationMonths: 6 },
          { name: '12 Month Protocol', amount: 6500, durationMonths: 12 },
        ];
        defaultPlans.forEach(p => addDoc(collection(db, plansPath), p));
      }

      // Cleanup old plans if they exist
      snap.docs.forEach(d => {
        const p = d.data();
        if (p.name === 'Monthly Basic' || p.name === 'Monthly Pro' || p.name === 'Quarterly' || p.name === 'Annual Titan') {
          deleteDoc(doc(db, plansPath, d.id));
        }
      });

      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
      setPlans(data.filter(p => !['Monthly Basic', 'Monthly Pro', 'Quarterly', 'Annual Titan'].includes(p.name)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, plansPath));

    // Fetch Payments
    const paymentsPath = 'payments';
    const unsubPayments = onSnapshot(query(collection(db, paymentsPath), orderBy('date', 'desc')), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
      setPayments(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, paymentsPath));

    return () => {
      unsubMembers();
      unsubPlans();
      unsubPayments();
    };
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const stats: GymStats = {
    totalMembers: members.length,
    monthlyRevenue: payments
      .filter(p => {
        const pDate = new Date(p.date);
        const now = new Date();
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0),
    duePayments: members.filter(m => new Date(m.dueDate) < new Date()).length,
    newJoinings: members.filter(m => {
      const jDate = new Date(m.joinDate);
      const now = new Date();
      return jDate.getMonth() === now.getMonth() && jDate.getFullYear() === now.getFullYear();
    }).length,
  };

  const handleSaveMember = async (memberData: Omit<Member, 'id'>) => {
    const path = 'members';
    try {
      if (editingMember?.id) {
        await updateDoc(doc(db, path, editingMember.id), memberData as any);
      } else {
        await addDoc(collection(db, path), memberData);
      }
      setIsMemberModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this titan?')) return;
    const path = 'members';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full bg-gym-black flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center red-glow"
        >
          <Activity size={32} className="text-white" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-gym-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/5 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8 z-10"
        >
          <div className="w-20 h-20 bg-brand-red rounded-3xl flex items-center justify-center mx-auto red-glow-strong overflow-hidden relative">
             <Activity size={40} className="text-white z-10" />
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          
          <div>
            <h1 className="text-5xl font-display font-black tracking-tighter italic mb-3 underline decoration-brand-red/50 decoration-4 underline-offset-8">
              AMRAP THE GYM
            </h1>
            <p className="text-white/40 text-lg uppercase tracking-[0.2em] font-medium italic">Command Center</p>
          </div>

          <div className="glass-card p-10 space-y-6">
            <p className="text-white/60">Level up your gym management with premium analytics and automation.</p>
            <button 
              onClick={handleLogin}
              className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-brand-red/5"
            >
              <LogIn size={20} />
              Admin Login
            </button>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Authorized Personnel Only</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gym-black overflow-hidden relative">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      
      <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search titans..." 
                className="bg-white/5 border border-white/10 rounded-full px-10 py-1.5 text-sm w-48 md:w-80 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
              />
              <Activity className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[10px] text-green-400 font-mono font-bold tracking-widest uppercase">● SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
               <button 
                onClick={() => {
                  setEditingMember(null);
                  setIsMemberModalOpen(true);
                }}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-lg shadow-red-600/20 active:scale-95 transition-all"
               >
                 + <span className="hidden sm:inline">NEW TITAN</span><span className="sm:hidden">ADD</span>
               </button>
               <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0">
                  <img src={user.photoURL || ''} alt="Admin" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  stats={stats} 
                  recentPayments={payments.slice(0, 5)} 
                  members={members} 
                />
              )}
              {activeTab === 'members' && (
                <MemberManagement 
                  members={members}
                  plans={plans}
                  onAddMember={() => {
                    setEditingMember(null);
                    setIsMemberModalOpen(true);
                  }}
                  onEditMember={(m) => {
                    setEditingMember(m);
                    setIsMemberModalOpen(true);
                  }}
                  onDeleteMember={handleDeleteMember}
                  onSendWhatsApp={async (member, type, amount) => {
                    const result = await sendWhatsAppMessage(member, type, amount);
                    if (result.success) {
                      alert(`WhatsApp message sent to ${member.fullName}!`);
                    } else {
                      alert(`Failed to send WhatsApp: ${result.error || 'Unknown error'}`);
                    }
                  }}
                />
              )}
              {activeTab === 'plans' && (
                 <PlanManagement plans={plans} />
              )}
              {activeTab === 'payments' && (
                <PaymentManagement 
                  payments={payments}
                  members={members}
                />
              )}
              {activeTab === 'attendance' && (
                <AttendanceSystem 
                  members={members}
                  onCheckIn={async (memberId) => {
                    const path = 'attendance';
                    try {
                      await addDoc(collection(db, path), {
                        memberId,
                        date: new Date().toISOString().split('T')[0],
                        checkInTime: new Date().toISOString()
                      });
                      alert('Check-in successful!');
                    } catch (err) {
                      handleFirestoreError(err, OperationType.WRITE, path);
                    }
                  }}
                />
              )}
               {activeTab === 'whatsapp' && (
                 <AutomationCenter 
                  members={members}
                  onSendBulk={async (type) => {
                    const targets = type === 'reminder' 
                      ? members.filter(m => {
                          const dueDate = new Date(m.dueDate);
                          const threeDaysFromNow = new Date();
                          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                          return dueDate <= threeDaysFromNow && dueDate >= new Date();
                        })
                      : members.filter(m => new Date(m.dueDate) < new Date());

                    if (targets.length === 0) {
                      alert(`No titans found for ${type} protocol.`);
                      return;
                    }

                    if (!confirm(`Deploy ${type} protocol to ${targets.length} titans?`)) return;

                    let successCount = 0;
                    for (const member of targets) {
                      const result = await sendWhatsAppMessage(member, type === 'reminder' ? 'due_reminder' : 'expiry_reminder');
                      if (result.success) successCount++;
                    }

                    alert(`Automation Blast Complete: ${successCount}/${targets.length} messages delivered successfully.`);
                  }}
                 />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isMemberModalOpen && (
          <MemberForm 
            member={editingMember}
            plans={plans}
            onClose={() => setIsMemberModalOpen(false)}
            onSave={handleSaveMember}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
