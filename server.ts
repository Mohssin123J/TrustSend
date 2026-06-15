import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  nationalId: string;
  birthDate: string;
  address: string;
  city: string;
  email: string;
  status: "PENDING" | "VERIFIED" | "SUSPENDED";
  idFrontUrl?: string;
  idBackUrl?: string;
  createdAt: string;
}

interface Wallet {
  id: string;
  balance: number; // In MAD
  userId: string;
}

interface Transaction {
  id: string;
  reference: string;
  userId: string;
  type: "TRANSFER" | "DEPOSIT" | "BILL_PAY" | "CARD_FEE" | "RECEIVED";
  amount: number;
  currency: "MAD" | "USD" | "EUR";
  status: "COMPLETED" | "PENDING" | "FAILED";
  description: string;
  createdAt: string;
}

interface Transfer {
  id: string;
  reference: string;
  senderId?: string;
  type: "NATIONAL" | "INTERNATIONAL";
  beneficiaryName: string;
  beneficiaryPhone: string;
  beneficiaryId?: string; // CIN
  country?: string;
  amount: number;
  currency: "MAD" | "USD" | "EUR";
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  reason: string;
  withdrawalCode?: string;
  createdAt: string;
}

interface BillPayment {
  id: string;
  reference: string;
  userId: string;
  serviceType: "WATER" | "ELECTRICITY" | "INTERNET" | "RECHARGE" | "TAX" | "FINE" | "TICKET";
  billerName: string;
  accountNumber: string;
  amount: number;
  currency: "MAD" | "USD" | "EUR";
  status: "COMPLETED" | "FAILED";
  createdAt: string;
}

interface CardRequest {
  id: string;
  userId: string;
  cardType: "VISA_CLASSIC" | "MASTERCARD_PREMIUM";
  cardNumber?: string;
  status: "REQUESTED" | "PRINTING" | "SHIPPED" | "DELIVERED" | "ACTIVE" | "DEACTIVATED";
  createdAt: string;
  updatedAt: string;
}

interface ComplaintMessage {
  sender: "CLIENT" | "ADMIN";
  message: string;
  timestamp: string;
}

interface Complaint {
  id: string;
  reference: string;
  userId: string;
  title: string;
  description: string;
  documentUrl?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  messages: ComplaintMessage[];
}

interface AuditLog {
  id: string;
  userId?: string;
  userPhone?: string;
  userEmail?: string;
  action: string;
  ipAddress?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Global Stateful Mock Data
const users: User[] = [
  {
    id: "user-1",
    phoneNumber: "+212611223344",
    fullName: "Mohamed El Idrissi",
    nationalId: "JB123456",
    birthDate: "1994-05-15",
    address: "Avenue Mohammed V, Appt 12",
    city: "Rabat",
    email: "mohamed@idrissi.ma",
    status: "VERIFIED",
    idFrontUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop",
    idBackUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop",
    createdAt: "2026-01-10T14:30:00Z",
  },
  {
    id: "user-2",
    phoneNumber: "+212655667788",
    fullName: "Yasmine Benziane",
    nationalId: "AE987654",
    birthDate: "1998-09-22",
    address: "Boulevard Anfa, Res d'Anfa",
    city: "Casablanca",
    email: "yasmine.b@gmail.com",
    status: "PENDING",
    idFrontUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop",
    idBackUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop",
    createdAt: "2026-06-11T09:15:00Z",
  },
  {
    id: "user-3",
    phoneNumber: "+212622446688",
    fullName: "Karim Guessous",
    nationalId: "C321456",
    birthDate: "1989-11-02",
    address: "Quarter Gueliz, Rue de la Liberte",
    city: "Marrakech",
    email: "karim@guessous.co",
    status: "SUSPENDED",
    idFrontUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop",
    idBackUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop",
    createdAt: "2026-03-05T11:00:00Z",
  }
];

const wallets: Wallet[] = [
  { id: "wallet-1", balance: 8450.00, userId: "user-1" },
  { id: "wallet-2", balance: 120.00, userId: "user-2" },
  { id: "wallet-3", balance: 0.00, userId: "user-3" }
];

const transactions: Transaction[] = [
  {
    id: "tx-1",
    reference: "TX-992182",
    userId: "user-1",
    type: "DEPOSIT",
    amount: 10000.00,
    currency: "MAD",
    status: "COMPLETED",
    description: "Initial cash deposit - Rabat Agency #2",
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "tx-2",
    reference: "TX-283192",
    userId: "user-1",
    type: "BILL_PAY",
    amount: 450.00,
    currency: "MAD",
    status: "COMPLETED",
    description: "Paid Water Bill - REDAL Rabat",
    createdAt: "2026-06-05T14:40:00Z"
  },
  {
    id: "tx-3",
    reference: "TX-882711",
    userId: "user-1",
    type: "TRANSFER",
    amount: 1100.00,
    currency: "MAD",
    status: "COMPLETED",
    description: "National Transfer to Reda Tazi (TS-441292)",
    createdAt: "2026-06-10T16:20:00Z"
  }
];

const transfers: Transfer[] = [
  {
    id: "tr-1",
    reference: "TS-441292",
    senderId: "user-1",
    type: "NATIONAL",
    beneficiaryName: "Reda Tazi",
    beneficiaryPhone: "+212677889900",
    beneficiaryId: "G771822",
    amount: 1100.00,
    currency: "MAD",
    status: "COMPLETED",
    reason: "Family support",
    withdrawalCode: "W-441292",
    createdAt: "2026-06-10T16:20:00Z"
  }
];

const billPayments: BillPayment[] = [
  {
    id: "bp-1",
    reference: "BL-992381",
    userId: "user-1",
    serviceType: "WATER",
    billerName: "REDAL Rabat",
    accountNumber: "992184128",
    amount: 450.00,
    currency: "MAD",
    status: "COMPLETED",
    createdAt: "2026-06-05T14:40:00Z"
  }
];

const cardRequests: CardRequest[] = [
  {
    id: "card-1",
    userId: "user-1",
    cardType: "VISA_CLASSIC",
    cardNumber: "4532 •••• •••• 9821",
    status: "ACTIVE",
    createdAt: "2026-01-12T09:00:00Z",
    updatedAt: "2026-01-15T15:30:00Z"
  }
];

const complaints: Complaint[] = [
  {
    id: "ticket-1",
    reference: "TKT-8271-MAD",
    userId: "user-1",
    title: "Delayed International Transfer to France",
    description: "I completed an international transfer of 500 EUR, but the recipient states they have not received any notice yet. Please check.",
    status: "IN_PROGRESS",
    createdAt: "2026-06-11T12:00:00Z",
    updatedAt: "2026-06-11T16:00:00Z",
    messages: [
      {
        sender: "CLIENT",
        message: "I completed an international transfer of 500 EUR, but the recipient states they have not received any notice yet. Please check.",
        timestamp: "2026-06-11T12:00:00Z"
      },
      {
        sender: "ADMIN",
        message: "Hello Mohamed, your transfer reference is currently under routing validations. It takes up to 24 business hours. We expect delivery by tomorrow morning.",
        timestamp: "2026-06-11T16:00:00Z"
      }
    ]
  }
];

const auditLogs: AuditLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    userPhone: "+212611223344",
    userEmail: "mohamed@idrissi.ma",
    action: "User logged into client area with OTP successfully",
    ipAddress: "196.115.2.4",
    createdAt: "2026-06-12T04:30:00Z"
  },
  {
    id: "log-2",
    userId: "user-1",
    userPhone: "+212611223344",
    userEmail: "mohamed@idrissi.ma",
    action: "Requested a replacement Visa Card",
    ipAddress: "196.115.2.4",
    createdAt: "2026-06-12T05:01:00Z"
  }
];

const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Welcome to TrustSend",
    message: "Thank you for joining our platform. Complete your ID verification to unlock full transfer bounds.",
    read: false,
    createdAt: "2026-06-12T01:00:00Z"
  }
];

// Helper to update balance
function deductBalance(userId: string, amount: number): boolean {
  const wallet = wallets.find((w) => w.userId === userId);
  if (!wallet || wallet.balance < amount) return false;
  wallet.balance = parseFloat((wallet.balance - amount).toFixed(2));
  return true;
}

function addBalance(userId: string, amount: number) {
  const wallet = wallets.find((w) => w.userId === userId);
  if (wallet) {
    wallet.balance = parseFloat((wallet.balance + amount).toFixed(2));
  }
}

// Service execution logic
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log all non-static requests for administrative audit
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`[API CALL] ${req.method} ${req.path}`);
    }
    next();
  });

  // --- API Routes ---

  // Auth & OTP Simulator
  app.post("/api/auth/otp/send", (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    
    // Simulate SMS dispatch
    console.log(`[OTP DISPATCH] SMS successfully routed to ${phoneNumber}. Simulated code: 1234`);
    res.json({ message: "OTP code successfully generated", code: "1234" });
  });

  app.post("/api/auth/otp/verify", (req, res) => {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res.status(400).json({ error: "Phone number and code are required" });
    }

    if (code !== "1234") {
      return res.status(400).json({ error: "Invalid OTP code" });
    }

    // Check if user exists
    let user = users.find((u) => u.phoneNumber === phoneNumber);
    let isNewUser = false;

    if (!user) {
      // Return flag to complete step-form registration
      isNewUser = true;
      return res.json({ success: true, isNewUser, phoneNumber });
    }

    // Track login activity
    auditLogs.unshift({
      id: "log-" + Date.now(),
      userId: user.id,
      userPhone: user.phoneNumber,
      userEmail: user.email,
      action: `User logged into client area with OTP successfully (Status: ${user.status})`,
      ipAddress: req.ip || "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, isNewUser, user });
  });

  // Register New Client (Multi-step)
  app.post("/api/auth/register", (req, res) => {
    const { fullName, nationalId, birthDate, address, city, phone, email, idFrontUrl, idBackUrl } = req.body;

    if (!fullName || !nationalId || !phone || !email) {
      return res.status(400).json({ error: "Required legal details are missing" });
    }

    // Prevent duplicates
    if (users.some((u) => u.phoneNumber === phone || u.nationalId === nationalId)) {
      return res.status(400).json({ error: "User with this Phone or National ID already exists" });
    }

    const newUser: User = {
      id: "user-" + (users.length + 1),
      phoneNumber: phone,
      fullName,
      nationalId,
      birthDate: birthDate || "1995-01-01",
      address: address || "N/A",
      city: city || "Rabat",
      email,
      status: "PENDING", // Wait for admin approval
      idFrontUrl: idFrontUrl || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&auto=format&fit=crop",
      idBackUrl: idBackUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Initial Wallet
    wallets.push({
      id: "wallet-" + wallets.length + 1,
      balance: 1000.00, // Seed verification with initial 1000 MAD bonus to test easily!
      userId: newUser.id
    });

    // Logging
    auditLogs.unshift({
      id: "log-" + Date.now(),
      userId: newUser.id,
      userPhone: newUser.phoneNumber,
      userEmail: newUser.email,
      action: "Created new profile with documentation pending review",
      ipAddress: req.ip || "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, user: newUser });
  });

  // Fetch Current User Dashboard Assets
  app.get("/api/user/me", (req, res) => {
    const phone = req.query.phone as string;
    if (!phone) return res.status(400).json({ error: "Identification query missing" });

    // Admin login shortcut
    if (phone === "+212600000000") {
      return res.json({
        isAdmin: true,
        user: { fullName: "TrustSend General Administrator", role: "ADMINISTRATOR", id: "admin-root" }
      });
    }

    const user = users.find((u) => u.phoneNumber === phone);
    if (!user) return res.status(404).json({ error: "Client profile not found" });

    const wallet = wallets.find((w) => w.userId === user.id) || { balance: 0.00 };
    const notificationsList = notifications.filter((n) => n.userId === user.id);
    const userCards = cardRequests.filter((c) => c.userId === user.id);

    res.json({
      user,
      wallet,
      cards: userCards,
      notifications: notificationsList,
    });
  });

  // Get Client Specific Transactions
  app.get("/api/transactions", (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "Missing identity credentials" });

    const filteredTx = transactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(filteredTx);
  });

  // National Transfer Flow
  app.post("/api/transfers/national", (req, res) => {
    const { senderId, beneficiaryName, beneficiaryPhone, beneficiaryId, amount, reason } = req.body;

    if (!senderId || !beneficiaryName || !beneficiaryPhone || !amount) {
      return res.status(400).json({ error: "Required recipient parameters are missing" });
    }

    const sender = users.find((u) => u.id === senderId);
    if (!sender) return res.status(404).json({ error: "Sender verification failed" });
    if (sender.status !== "VERIFIED") {
      return res.status(403).json({ error: "Transfer blocked. Account verification is mandatory." });
    }

    const amt = parseFloat(amount);
    if (amt <= 0) return res.status(400).json({ error: "Invalid transfer amount" });

    // Check balance
    const balanceDeducted = deductBalance(senderId, amt);
    if (!balanceDeducted) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    const reference = "TS-" + Math.floor(100000 + Math.random() * 900000);
    const withdrawalCode = "W-" + Math.floor(100000 + Math.random() * 900000);

    // Is the receiver a registered user?
    const beneficiaryUser = users.find((u) => u.phoneNumber === beneficiaryPhone);
    let description = "";

    if (beneficiaryUser) {
      // Direct electronic deposit
      addBalance(beneficiaryUser.id, amt);
      description = `Direct Wallet remittance to ${beneficiaryName}`;
      
      // Store transaction for receiver
      transactions.unshift({
        id: "tx-rcv-" + Date.now(),
        reference,
        userId: beneficiaryUser.id,
        type: "RECEIVED",
        amount: amt,
        currency: "MAD",
        status: "COMPLETED",
        description: `Direct Wallet deposit from ${sender.fullName}`,
        createdAt: new Date().toISOString()
      });

      notifications.unshift({
        id: "notif-rcv-" + Date.now(),
        userId: beneficiaryUser.id,
        title: "Funds Deposited",
        message: `You received ${amt} MAD from ${sender.fullName} directly in your wallet.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    } else {
      // Non-user generated withdrawal code
      description = `Cash pick-up generated for ${beneficiaryName}. Ref: ${withdrawalCode}`;
      console.log(`[SMS OUTBOUND] Sent to beneficiary ${beneficiaryPhone}: Hello ${beneficiaryName}! ${sender.fullName} sent you ${amt} MAD. Withdraw at any agency with CIN and cash-out code: ${withdrawalCode}`);
    }

    // Save outbound transaction record
    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      reference,
      userId: senderId,
      type: "TRANSFER",
      amount: amt,
      currency: "MAD",
      status: "COMPLETED",
      description,
      createdAt: new Date().toISOString()
    };

    transactions.unshift(newTx);

    // Save Transfer Record
    const newTransfer: Transfer = {
      id: "tr-" + Date.now(),
      reference,
      senderId,
      type: "NATIONAL",
      beneficiaryName,
      beneficiaryPhone,
      beneficiaryId: beneficiaryId || "N/A",
      amount: amt,
      currency: "MAD",
      status: "COMPLETED",
      reason: reason || "Family support",
      withdrawalCode: beneficiaryUser ? undefined : withdrawalCode,
      createdAt: new Date().toISOString()
    };

    transfers.unshift(newTransfer);

    // Logging
    auditLogs.unshift({
      id: "log-" + Date.now(),
      userId: senderId,
      userPhone: sender.phoneNumber,
      userEmail: sender.email,
      action: `Initiated National Transfer of ${amt} MAD to ${beneficiaryName}`,
      ipAddress: req.ip || "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, transfer: newTransfer, transaction: newTx });
  });

  // International Transfer Flow
  app.post("/api/transfers/international", (req, res) => {
    const { senderId, beneficiaryName, beneficiaryPhone, country, amount, currency, reason } = req.body;

    if (!senderId || !beneficiaryName || !country || !amount || !currency) {
      return res.status(400).json({ error: "Required international parameters are missing" });
    }

    const sender = users.find((u) => u.id === senderId);
    if (!sender) return res.status(404).json({ error: "Sender verification failed" });
    if (sender.status !== "VERIFIED") {
      return res.status(403).json({ error: "International remittance blocked. Unverified identity bounds." });
    }

    const amt = parseFloat(amount);
    if (amt <= 0) return res.status(400).json({ error: "Invalid transfer amount" });

    // Mathematical conversions and fees (MAD is local pool)
    // 1 USD = 10 MAD, 1 EUR = 11 MAD approx
    let amountInMAD = amt;
    if (currency === "USD") amountInMAD = amt * 10;
    else if (currency === "EUR") amountInMAD = amt * 11;

    // Standard high-bounds fee
    const transmissionFeeInMAD = parseFloat((amountInMAD * 0.015 + 20).toFixed(2));
    const totalDeductionInMAD = amountInMAD + transmissionFeeInMAD;

    // Check balance
    const balanceDeducted = deductBalance(senderId, totalDeductionInMAD);
    if (!balanceDeducted) {
      return res.status(400).json({ error: `Insufficient funds. Total transaction cost is ${totalDeductionInMAD.toFixed(2)} MAD (Conversion + 1.5% routing premium fee)` });
    }

    const reference = "TS-GBL-" + Math.floor(100000 + Math.random() * 900000);

    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      reference,
      userId: senderId,
      type: "TRANSFER",
      amount: totalDeductionInMAD,
      currency: "MAD",
      status: "COMPLETED",
      description: `International remit to ${beneficiaryName} (${country}) in ${currency}. Fee: ${transmissionFeeInMAD} MAD`,
      createdAt: new Date().toISOString()
    };

    transactions.unshift(newTx);

    const newTransfer: Transfer = {
      id: "tr-" + Date.now(),
      reference,
      senderId,
      type: "INTERNATIONAL",
      beneficiaryName,
      beneficiaryPhone,
      country,
      amount: amt,
      currency,
      status: "COMPLETED",
      reason: reason || "Remittance",
      createdAt: new Date().toISOString()
    };

    transfers.unshift(newTransfer);

    // Logging
    auditLogs.unshift({
      id: "log-" + Date.now(),
      userId: senderId,
      userPhone: sender.phoneNumber,
      userEmail: sender.email,
      action: `Completed International Remit of ${amt} ${currency} to ${beneficiaryName} in ${country}`,
      ipAddress: req.ip || "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, transfer: newTransfer, totalDeduct: totalDeductionInMAD });
  });

  // Services & Bill Payments
  app.post("/api/bills/pay", (req, res) => {
    const { userId, serviceType, billerName, accountNumber, amount } = req.body;

    if (!userId || !serviceType || !billerName || !accountNumber || !amount) {
      return res.status(400).json({ error: "Bill invoice details are incomplete" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "Identity mismatch" });

    const amt = parseFloat(amount);
    if (amt <= 0) return res.status(400).json({ error: "Invalid bill amount" });

    // Deduct
    const balanceDeducted = deductBalance(userId, amt);
    if (!balanceDeducted) {
      return res.status(400).json({ error: `Insufficient account balance to pay ${billerName} Invoice (${amt} MAD)` });
    }

    const reference = "TS-BILL-" + Math.floor(100000 + Math.random() * 900000);

    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      reference,
      userId,
      type: "BILL_PAY",
      amount: amt,
      currency: "MAD",
      status: "COMPLETED",
      description: `Utility settlement: Paid ${serviceType} Bill to ${billerName} (Acct: ${accountNumber})`,
      createdAt: new Date().toISOString()
    };

    transactions.unshift(newTx);

    const newBill: BillPayment = {
      id: "bp-" + Date.now(),
      reference,
      userId,
      serviceType,
      billerName,
      accountNumber,
      amount: amt,
      currency: "MAD",
      status: "COMPLETED",
      createdAt: new Date().toISOString()
    };

    billPayments.unshift(newBill);

    // Logging
    auditLogs.unshift({
      id: "log-" + Date.now(),
      userId,
      userPhone: user.phoneNumber,
      userEmail: user.email,
      action: `Paid Bill to ${billerName} amount ${amt} MAD`,
      ipAddress: req.ip || "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, bill: newBill, transaction: newTx });
  });

  // Card Ordering & Status Management
  app.post("/api/cards/request", (req, res) => {
    const { userId, cardType } = req.body;
    if (!userId || !cardType) {
      return res.status(400).json({ error: "Credentials required" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const wallet = wallets.find((w) => w.userId === userId);
    if (!wallet || wallet.balance < 50.0) {
      return res.status(400).json({ error: "Account requests require at least 50.00 MAD balance." });
    }

    // Check duplicate pending requests
    const pathIncomplete = cardRequests.some((c) => c.userId === userId && c.status !== "DEACTIVATED");
    if (pathIncomplete) {
      return res.status(400).json({ error: "You already have an active card or card request pending review." });
    }

    const newCard: CardRequest = {
      id: "card-" + (cardRequests.length + 1),
      userId,
      cardType,
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cardRequests.push(newCard);

    auditLogs.unshift({
      id: "log-" + Date.now(),
      userId,
      userPhone: user.phoneNumber,
      userEmail: user.email,
      action: `Requested standard physical card: ${cardType}`,
      ipAddress: req.ip || "127.0.0.1",
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, card: newCard });
  });

  app.post("/api/cards/action", (req, res) => {
    const { cardId, action } = req.body; // TOGGLE_STATUS, REPORT_LOST, REPLACE
    if (!cardId || !action) return res.status(400).json({ error: "Parametric parameters missing" });

    const card = cardRequests.find((c) => c.id === cardId);
    if (!card) return res.status(404).json({ error: "Physical card asset not registered" });

    const user = users.find((u) => u.id === card.userId);

    if (action === "TOGGLE_STATUS") {
      card.status = card.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
      if (!card.cardNumber && card.status === "ACTIVE") {
        card.cardNumber = "4532 •••• •••• " + Math.floor(1000 + Math.random() * 9000);
      }
    } else if (action === "REPORT_LOST") {
      card.status = "DEACTIVATED";
    } else if (action === "REPLACE") {
      card.status = "REQUESTED";
      card.updatedAt = new Date().toISOString();
    }

    card.updatedAt = new Date().toISOString();

    if (user) {
      auditLogs.unshift({
        id: "log-" + Date.now(),
        userId: user.id,
        userPhone: user.phoneNumber,
        userEmail: user.email,
        action: `Modified Card State ${cardId} to Action ${action} (New Status: ${card.status})`,
        ipAddress: req.ip || "127.0.0.1",
        createdAt: new Date().toISOString()
      });
    }

    res.json({ success: true, card });
  });

  // Help center / Complaints Desk & AI Automated Triage Flow
  app.post("/api/complaints", async (req, res) => {
    const { userId, title, description, documentName } = req.body;

    if (!userId || !title || !description) {
      return res.status(400).json({ error: "Support descriptions cannot be empty" });
    }

    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "Profile mismatch" });

    const reference = "TKT-" + Math.floor(1000 + Math.random() * 9000) + "-MAD";

    const newComplaint: Complaint = {
      id: "ticket-" + Date.now(),
      reference,
      userId,
      title,
      description,
      documentUrl: documentName || undefined,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          sender: "CLIENT",
          message: description,
          timestamp: new Date().toISOString()
        }
      ]
    };

    complaints.unshift(newComplaint);

    // AI Assist: Triggers immediate supportive triage response by calling actual Gemini API server-side!
    let aiResponse = "Hello, thank you for contacting TrustSend Customer Support. We have logged your ticket and an administrative representative is reviewing your details. We stand by our 24/7 service commitment.";

    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
        const prompt = `You are the Support AI Agent for TrustSend (Digital Money Transfer & Payment Platform).
A user named ${user.fullName} filed a complaint:
Title: "${title}"
Details: "${description}"

Generate a short, helpful, reassuring official response from TrustSend Support. Address them directly by name, note that their reference is ${reference}, keep it within 3-4 sentences, very professional.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        if (response && response.text) {
          aiResponse = response.text.trim();
        }
      }
    } catch (err) {
      console.warn("Gemini support response draft fallback used", err);
    }

    // Staggered AI feedback message appending
    setTimeout(() => {
      newComplaint.messages.push({
        sender: "ADMIN",
        message: aiResponse,
        timestamp: new Date().toISOString()
      });
      newComplaint.status = "IN_PROGRESS";
      newComplaint.updatedAt = new Date().toISOString();
      console.log(`[AI SUPPORT RESPONSE APPENDED] Ticket: ${reference}`);
    }, 1200);

    res.json({ success: true, complaint: newComplaint });
  });

  // Messages flow on support tickets
  app.post("/api/complaints/message", (req, res) => {
    const { ticketId, sender, message } = req.body; // sender: CLIENT or ADMIN
    if (!ticketId || !sender || !message) {
      return res.status(400).json({ error: "Message elements cannot be empty" });
    }

    const complaint = complaints.find((c) => c.id === ticketId);
    if (!complaint) return res.status(404).json({ error: "Support ticket not found" });

    complaint.messages.push({
      sender,
      message,
      timestamp: new Date().toISOString()
    });

    complaint.updatedAt = new Date().toISOString();
    if (sender === "CLIENT") {
      complaint.status = "OPEN";
    }

    res.json({ success: true, complaint });
  });

  // --- ADMINISTRATION PANELS DRIVERS ---

  // User Management Board
  app.get("/api/admin/users", (req, res) => {
    res.json(users);
  });

  app.post("/api/admin/users/action", (req, res) => {
    const { userId, action } = req.body; // APPROVE, SUSPEND
    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "Customer profile not found" });

    if (action === "APPROVE") {
      user.status = "VERIFIED";
    } else if (action === "SUSPEND") {
      user.status = "SUSPENDED";
    }

    auditLogs.unshift({
      id: "log-" + Date.now(),
      action: `Administrator changed user ${user.fullName} (${user.phoneNumber}) status to ${user.status}`,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, user });
  });

  // Cards Management Oversight
  app.get("/api/admin/cards", (req, res) => {
    // Return all cards with client name attached
    const enrichedCards = cardRequests.map((c) => {
      const cl = users.find((u) => u.id === c.userId);
      return {
        ...c,
        clientName: cl ? cl.fullName : "N/A",
        clientPhone: cl ? cl.phoneNumber : "N/A"
      };
    });
    res.json(enrichedCards);
  });

  app.post("/api/admin/cards/action", (req, res) => {
    const { cardId, status } = req.body; // PRINTING, SHIPPED, DELIVERED, ACTIVE, DEACTIVATED
    const card = cardRequests.find((c) => c.id === cardId);
    if (!card) return res.status(404).json({ error: "Card request search failed" });

    card.status = status;
    card.updatedAt = new Date().toISOString();

    if (status === "ACTIVE" && !card.cardNumber) {
      card.cardNumber = "4532 •••• •••• " + Math.floor(1000 + Math.random() * 9000);
    }

    auditLogs.unshift({
      id: "log-" + Date.now(),
      action: `Administrator updated card ${cardId} routing status to ${status}`,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, card });
  });

  // Support Tickets Dashboard
  app.get("/api/admin/complaints", (req, res) => {
    const enrichedTickets = complaints.map((c) => {
      const cl = users.find((u) => u.id === c.userId);
      return {
        ...c,
        clientName: cl ? cl.fullName : "N/A",
        clientPhone: cl ? cl.phoneNumber : "N/A"
      };
    });
    res.json(enrichedTickets);
  });

  app.post("/api/admin/complaints/action", (req, res) => {
    const { ticketId, status } = req.body; // IN_PROGRESS, RESOLVED, CLOSED
    const complaint = complaints.find((c) => c.id === ticketId);
    if (!complaint) return res.status(404).json({ error: "Complaint ticket mismatch" });

    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();

    res.json({ success: true, complaint });
  });

  // Audit Logs database
  app.get("/api/admin/logs", (req, res) => {
    res.json(auditLogs);
  });

  // Transfers & Analytics
  app.get("/api/admin/transfers", (req, res) => {
    const enrichedTransfers = transfers.map((t) => {
      const snd = users.find((u) => u.id === t.senderId);
      return {
        ...t,
        senderName: snd ? snd.fullName : "N/A",
        senderPhone: snd ? snd.phoneNumber : "N/A"
      };
    });
    res.json(enrichedTransfers);
  });

  app.get("/api/admin/analytics", (req, res) => {
    const verifiedUsersCount = users.filter((u) => u.status === "VERIFIED").length;
    const pendingVerificationCount = users.filter((u) => u.status === "PENDING").length;
    
    // Total capital active in wallets
    const totalBalanceMAD = wallets.reduce((acc, curr) => acc + curr.balance, 0);

    // Transfer Volumes check
    const totalTransactionsCount = transactions.length;
    
    // Compute revenue (1.5% fee on outbound international transfers + minor 10 MAD service rates)
    const transferVolume = transfers.reduce((acc, curr) => acc + curr.amount, 0);
    const mockRevenueMAD = parseFloat((transferVolume * 0.015 + billPayments.length * 5 + 420).toFixed(2));

    // Growth Metrics trend line
    const dailyVolumes = [
      { day: "Mon", income: 120, userJoin: 1, count: 4 },
      { day: "Tue", income: 240, userJoin: 2, count: 6 },
      { day: "Wed", income: 180, userJoin: 1, count: 3 },
      { day: "Thu", income: 390, userJoin: 4, count: 9 },
      { day: "Fri", income: 450, userJoin: 2, count: 12 }
    ];

    res.json({
      verifiedUsersCount,
      pendingVerificationCount,
      totalBalanceMAD,
      totalTransactionsCount,
      mockRevenueMAD,
      dailyVolumes
    });
  });

  // Simulated PDF Receipt Generator Endpoint
  app.get("/api/receipt/:reference", (req, res) => {
    const { reference } = req.params;
    
    // Search in transactions or bills or transfers
    const tx = transactions.find((t) => t.reference === reference) || 
               transfers.find((t) => t.reference === reference) ||
               billPayments.find((b) => b.reference === reference);

    if (!tx) {
      return res.status(404).send("Transaction receipt reference was not found.");
    }

    const type = ("type" in tx) ? tx.type : "BILL PAYMENT";
    const amount = tx.amount;
    const date = tx.createdAt;
    const desc = "description" in tx ? tx.description : `Ref: ${tx.reference}`;

    const textReceipt = `
========================================
            TRUSTSEND FINANCIALS
       OFFICIAL DIGITAL TRANSACTION RECEIPT
========================================
Reference   : ${reference}
Operation   : ${type}
Date Issued : ${date}
Amount      : ${amount} MAD
Currency    : MAD
Status      : COMPLETED
Security    : VERIFIED BY SMS SMS-OTP

Details & Allocations:
----------------------------------------
${desc}

Thank you for choosing TrustSend!
Securing Your Global and National Remittances.
Support Desk: support@trustsend.co
========================================
`;
    
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="Receipt-${reference}.txt"`);
    res.send(textReceipt);
  });


  // --- Vite & Frontend mounting middleware ---

  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware for dev flow
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production built assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TrustSend Server] Running smoothly on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server failure on boot:", err);
});
