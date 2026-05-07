import React, { useState, useEffect } from 'react';
import { X, Save, Upload, User, Smartphone, Calendar, CreditCard, ClipboardList } from 'lucide-react';
import { Member, Plan, Gender, MemberStatus } from '../types';
import { motion } from 'motion/react';

interface MemberFormProps {
  member?: Member | null;
  onClose: () => void;
  onSave: (memberData: Omit<Member, 'id'>) => void;
  plans: Plan[];
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onClose, onSave, plans }) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    fullName: '',
    phone: '',
    whatsapp: '',
    joinDate: new Date().toISOString().split('T')[0],
    planId: plans[0]?.id || '',
    feesAmount: plans[0]?.amount || 0,
    dueDate: '',
    gender: 'male',
    notes: '',
    photoUrl: '',
    status: 'active'
  });

  useEffect(() => {
    if (member) {
      const { id, ...rest } = member;
      setFormData(rest);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'feesAmount' ? parseFloat(value) : value 
    }));
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const planId = e.target.value;
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setFormData(prev => {
        // Calculate due date based on plan duration
        const joinDate = new Date(prev.joinDate);
        const dueDate = new Date(joinDate);
        dueDate.setMonth(dueDate.getMonth() + plan.durationMonths);
        
        return {
          ...prev,
          planId,
          feesAmount: plan.amount,
          dueDate: dueDate.toISOString().split('T')[0]
        };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gym-gray w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
          <h3 className="text-xl font-display font-bold">{member ? 'Edit Member' : 'New Member'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">WhatsApp Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50">
                  <Smartphone size={18} />
                </div>
                <input
                  required
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-green-500/30 focus:bg-white/10 transition-all font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-red/50 transition-all"
              >
                <option value="male" className="bg-gym-gray">Male</option>
                <option value="female" className="bg-gym-gray">Female</option>
                <option value="other" className="bg-gym-gray">Other</option>
              </select>
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Joining Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  required
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 transition-all"
                />
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Membership Plan</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <select
                  name="planId"
                  value={formData.planId}
                  onChange={handlePlanChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 transition-all"
                >
                  <option value="" disabled className="bg-gym-gray">Select Plan</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id} className="bg-gym-gray">{plan.name} - ₹{plan.amount}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fees Amount */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Fees Amount</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  required
                  type="number"
                  name="feesAmount"
                  value={formData.feesAmount}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 transition-all"
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Next Payment Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  required
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 transition-all"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-red/50 transition-all"
              >
                <option value="active" className="bg-gym-gray text-green-400">Active</option>
                <option value="inactive" className="bg-gym-gray text-red-400">Inactive</option>
              </select>
            </div>
            
            {/* Photo URL */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Profile Photo URL</label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-red/50 transition-all"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Notes / Health History</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-red/50 transition-all resize-none"
              placeholder="Any medical conditions, goals, or important details..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-white/10 rounded-xl text-white/60 font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-brand-red text-white red-glow-strong rounded-xl font-bold hover:bg-brand-red-dark transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Titan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MemberForm;
