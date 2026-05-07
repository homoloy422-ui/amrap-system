import React from 'react';
import { 
  Download, 
  Search, 
  FileSpreadsheet, 
  Receipt,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Payment, Member } from '../types';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface PaymentManagementProps {
  payments: Payment[];
  members: Member[];
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ payments, members }) => {
  
  const getMemberName = (id: string) => members.find(m => m.id === id)?.fullName || 'Unknown';

  const exportToExcel = () => {
    const data = payments.map(p => ({
      'Member Name': getMemberName(p.memberId),
      'Amount': p.amount,
      'Date': p.date,
      'Method': p.method,
      'Type': p.type,
      'Invoice ID': p.invoiceId || 'N/A'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "Gym_Payments_Report.xlsx");
  };

  const generateReceiptPDF = (payment: Payment) => {
    const doc = new jsPDF();
    const memberName = getMemberName(payment.memberId);

    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(255, 0, 0);
    doc.setFontSize(30);
    doc.text('AMRAP THE GYM', 105, 40, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('PAYMENT RECEIPT', 105, 50, { align: 'center' });
    
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
    
    doc.setFontSize(10);
    doc.text(`Receipt ID: ${payment.id?.slice(0, 8)}`, 20, 75);
    doc.text(`Date: ${payment.date}`, 150, 75);
    
    doc.setFontSize(14);
    doc.text(`TITAN NAME: ${memberName.toUpperCase()}`, 20, 100);
    doc.text(`AMOUNT PAID: ₹${payment.amount}`, 20, 115);
    doc.text(`METHOD: ${payment.method.toUpperCase()}`, 20, 130);
    doc.text(`TYPE: ${payment.type.toUpperCase()}`, 20, 145);
    
    doc.setFontSize(10);
    // @ts-ignore
    if (typeof doc.setLineDash === 'function') {
      // @ts-ignore
      doc.setLineDash([2, 2], 0);
    }
    doc.line(20, 160, 190, 160);
    doc.text('Stay Strong. Stay Titan.', 105, 180, { align: 'center' });
    
    doc.save(`Receipt_${memberName}_${payment.date}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Vault Ledger</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Full transaction history and financial tracking protocol.</p>
        </div>
        <button 
          onClick={exportToExcel}
          className="w-full sm:w-auto bg-white/5 border border-white/10 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all shadow-xl"
        >
          <FileSpreadsheet size={16} />
          DATAFORM EXPORT
        </button>
      </div>

      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 border-b border-white/5">
                <th className="px-8 py-6">ID / Titan</th>
                <th className="px-8 py-6">Timeline</th>
                <th className="px-8 py-6">Channel</th>
                <th className="px-8 py-6">Protocol</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center font-black text-red-500 text-[10px]">
                          {payment.memberId.slice(0, 2).toUpperCase()}
                       </div>
                       <p className="font-bold text-sm tracking-tight">{getMemberName(payment.memberId)}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-mono font-bold text-slate-500">{payment.date}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-wider text-slate-400 border border-white/5">
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold uppercase tracking-tight text-slate-300">{payment.type}</td>
                  <td className="px-8 py-6 font-black text-green-400 text-sm">₹{payment.amount}</td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => generateReceiptPDF(payment)}
                      className="p-3 bg-white/5 group-hover:bg-red-600 rounded-xl text-slate-500 group-hover:text-white transition-all shadow-lg active:scale-90"
                    >
                      <Receipt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && (
          <div className="text-center py-32 flex flex-col items-center justify-center gap-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <Filter className="text-white/10" size={32} />
             </div>
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] italic">No Protocol Cycles Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
