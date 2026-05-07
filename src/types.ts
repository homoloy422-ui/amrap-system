export type Gender = 'male' | 'female' | 'other';
export type MemberStatus = 'active' | 'inactive';

export interface Member {
  id?: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  joinDate: string;
  planId: string;
  feesAmount: number;
  dueDate: string;
  gender: Gender;
  notes?: string;
  photoUrl?: string;
  status: MemberStatus;
}

export interface Plan {
  id?: string;
  name: string;
  amount: number;
  durationMonths: number;
}

export interface Payment {
  id?: string;
  memberId: string;
  amount: number;
  date: string;
  method: string;
  type: string;
  invoiceId?: string;
}

export interface AttendanceRecord {
  id?: string;
  memberId: string;
  date: string;
  checkInTime: string;
}

export interface GymStats {
  totalMembers: number;
  monthlyRevenue: number;
  duePayments: number;
  newJoinings: number;
}
