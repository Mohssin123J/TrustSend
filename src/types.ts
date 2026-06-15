export type Currency = 'MAD' | 'USD' | 'EUR';
export type Language = 'en' | 'fr';

export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  nationalId: string;
  birthDate: string;
  address: string;
  city: string;
  email: string;
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  idFrontUrl?: string;
  idBackUrl?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  balance: number; // in MAD
  currency: Currency;
  userId: string;
}

export interface Transaction {
  id: string;
  reference: string;
  userId: string;
  type: 'TRANSFER' | 'DEPOSIT' | 'BILL_PAY' | 'CARD_FEE' | 'RECEIVED';
  amount: number; // original amount
  currency: Currency;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  reference: string;
  senderId?: string;
  type: 'NATIONAL' | 'INTERNATIONAL';
  beneficiaryName: string;
  beneficiaryPhone: string;
  beneficiaryId?: string; // CIN
  country?: string;
  amount: number;
  currency: Currency;
  reason?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  withdrawalCode?: string; // Code for non-users cash pickup
  createdAt: string;
}

export interface BillPayment {
  id: string;
  reference: string;
  userId: string;
  serviceType: 'WATER' | 'ELECTRICITY' | 'INTERNET' | 'RECHARGE' | 'TAX' | 'FINE' | 'TICKET';
  billerName: string;
  accountNumber: string;
  amount: number;
  currency: Currency;
  status: 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface CardRequest {
  id: string;
  userId: string;
  cardType: 'VISA_CLASSIC' | 'MASTERCARD_PREMIUM';
  cardNumber?: string;
  status: 'REQUESTED' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'ACTIVE' | 'DEACTIVATED';
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintMessage {
  sender: 'CLIENT' | 'ADMIN';
  message: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  reference: string;
  userId: string;
  title: string;
  description: string;
  documentUrl?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: ComplaintMessage[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userPhone?: string;
  userEmail?: string;
  action: string;
  ipAddress?: string;
  createdAt: string;
}

export interface OTPRequest {
  phoneNumber: string;
  code: string;
}
