import React from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Calendar, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Activity,
  Plus,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'plans', label: 'Plans', icon: Activity },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col pt-2 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-8 mb-4 relative">
        <h1 className="text-2xl font-black tracking-tighter italic text-white flex items-center gap-2">
          <span className="bg-red-600 px-2 py-0.5 rounded text-black not-italic font-black">AMRAP</span>THE GYM
        </h1>
        <button 
          onClick={onClose}
          className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-semibold",
              activeTab === item.id 
                ? "bg-red-600/10 text-red-500 border border-red-600/20" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Admin Account</p>
          <p className="text-sm font-medium">AMRAP OPS</p>
          <button 
            onClick={onLogout}
            className="mt-3 w-full text-[10px] bg-red-600 py-2 rounded-lg font-black tracking-widest text-white hover:bg-red-700 transition-colors uppercase"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
