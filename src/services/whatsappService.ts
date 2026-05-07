import { Member } from '../types';

export const sendWhatsAppMessage = async (member: Member, type: string, amount?: number) => {
  let message = "";
  
  switch(type) {
    case 'welcome':
      message = `Hello ${member.fullName}, welcome to AMRAP THE GYM! We are excited to have you on board. Let's crush those goals!`;
      break;
    case 'payment_received':
      message = `Hello ${member.fullName}, your payment of ₹${amount} has been received successfully. Thank you for being part of AMRAP the gym.`;
      break;
    case 'expiry_reminder':
      message = `Hello ${member.fullName}, your gym membership at AMRAP expires on ${member.dueDate}. Please renew to continue training.`;
      break;
    case 'due_reminder':
      message = `Hello ${member.fullName}, your AMRAP gym fee is pending. Kindly complete payment before ${member.dueDate}.`;
      break;
    default:
      message = `Hello ${member.fullName}, this is a reminder from AMRAP THE GYM.`;
  }

  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: member.whatsapp, message })
    });
    return await response.json();
  } catch (error) {
    console.error('WhatsApp service error:', error);
    return { error: 'Failed to connect to server' };
  }
};
