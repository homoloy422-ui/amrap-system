import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  AlertCircle,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { Member, Payment, GymStats } from '../types';

interface DashboardProps {
  stats: GymStats;
  recentPayments: Payment[];
  members: Member[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, recentPayments, members }) => {
  const chartData = [
    { name: 'Jan', revenue: 4000, members: 2400 },
    { name: 'Feb', revenue: 3000, members: 1398 },
    { name: 'Mar', revenue: 2000, members: 9800 },
    { name: 'Apr', revenue: 2780, members: 3908 },
    { name: 'May', revenue: 1890, members: 4800 },
    { name: 'Jun', revenue: 2390, members: 3800 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-lg relative overflow-hidden"
    >
      <div className="absolute -right-2 -top-2 w-16 h-16 bg-red-600/10 rounded-full blur-2xl"></div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className={`text-3xl font-black ${colorClass || ''}`}>{value}</h3>
      {trendValue && (
        <p className={`text-[10px] mt-2 font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? '+' : '-'}{trendValue} vs last month
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Members" value={stats.totalMembers} trend="up" trendValue="12.5%" />
        <StatCard title="Monthly Revenue" value={`₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`} trend="up" trendValue="8.2%" />
        <StatCard title="Due Payments" value={stats.duePayments} colorClass="text-red-500" trend="down" trendValue="3.1%" />
        <StatCard title="New Joinings" value={stats.newJoinings} trend="up" trendValue="15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8 px-2">
            <h4 className="font-bold text-lg">Revenue Overview</h4>
            <div className="flex gap-2">
              <button className="text-[10px] bg-white/10 px-3 py-1.5 rounded font-bold uppercase tracking-widest text-slate-400">Week</button>
              <button className="text-[10px] bg-red-600 px-3 py-1.5 rounded font-bold uppercase tracking-widest text-white shadow-lg shadow-red-600/20">Month</button>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col">
          <h4 className="font-bold mb-6">Recent Payments</h4>
          <div className="space-y-5 flex-1">
            {recentPayments.length > 0 ? recentPayments.map((payment, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center font-black text-red-500 text-xs shrink-0">
                  {payment.memberId.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Titan #{payment.memberId.slice(-4)}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{payment.type} • ₹{payment.amount}</p>
                </div>
                <span className="text-[10px] font-mono text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded">PAID</span>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-xs italic font-bold uppercase tracking-widest">No activity</div>
            )}
          </div>
          <button className="w-full mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-white/5 py-3 rounded-xl hover:bg-white/5 transition-colors">
            View All Transactions
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-600/20 to-transparent rounded-2xl border border-red-600/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="bg-red-600 p-3 rounded-xl shadow-lg shadow-red-600/30">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h5 className="font-bold text-sm">Automation Queue</h5>
            <p className="text-xs text-slate-400">{stats.duePayments * 2} reminders scheduled for the next 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">WA Status</p>
            <p className="text-xs font-mono text-green-400 font-bold">CONNECTED</p>
          </div>
          <button className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap">MANAGE RULES</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
