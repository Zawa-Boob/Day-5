"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  BarChart3,
  GraduationCap,
  Plus,
  Bell,
  Eye,
  EyeOff,
  Search,
  Calendar,
  ArrowRight,
  Mic,
  CreditCard,
  ChevronDown,
  Download,
  Send,
  AlertCircle,
  Lock,
  TrendingUp,
  X,
  Trash2,
  UtensilsCrossed,
  Coffee,
  Landmark,
  BookOpen,
  Bike,
  Music,
  ShoppingBag,
  Receipt,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  PiggyBank,
  Laptop,
  Shield,
  Ticket,
  Sparkles,
  ClipboardCopy,
  Check,
  Clock,
  Zap,
  Camera,
  ScanLine,
  Tag,
  CircleDollarSign,
  Briefcase,
  Home,
  Menu,
} from "lucide-react";

/* ================================================================
   Types
   ================================================================ */
interface Transaction {
  id: string;
  title: string;
  category: string;
  iconType: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  wallet: string;
  tags: string[];
}

interface SavingGoal {
  id: string;
  title: string;
  target: number;
  saved: number;
  iconType: string;
  deadline: string;
}

interface DueBill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

/* ================================================================
   Icon Map Helper
   ================================================================ */
function CategoryIcon({ type, size = 18 }: { type: string; size?: number }) {
  switch (type) {
    case "food":
      return <UtensilsCrossed size={size} />;
    case "coffee":
      return <Coffee size={size} />;
    case "income":
      return <Landmark size={size} />;
    case "edu":
      return <BookOpen size={size} />;
    case "transport":
      return <Bike size={size} />;
    case "entertainment":
      return <Music size={size} />;
    case "bills":
      return <Receipt size={size} />;
    case "shopping":
      return <ShoppingBag size={size} />;
    case "laptop":
      return <Laptop size={size} />;
    case "shield":
      return <Shield size={size} />;
    case "ticket":
      return <Ticket size={size} />;
    case "freelance":
      return <Briefcase size={size} />;
    default:
      return <CircleDollarSign size={size} />;
  }
}

/* ================================================================
   Main Component
   ================================================================ */
export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isIncognito, setIsIncognito] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"manual" | "ocr">("manual");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(4250000);

  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Peringatan Batas Kopi", desc: "Pengeluaran kopi kamu sudah 80% dari budget bulanan.", time: "10 m lalu", unread: true },
    { id: "n2", title: "Jatuh Tempo Kosan", desc: "Pembayaran kosan jatuh tempo dalam 5 hari.", time: "2 jam lalu", unread: true },
    { id: "n3", title: "Skor Finansial Naik", desc: "Skor kesehatan finansial kamu naik ke 88/100.", time: "1 hari lalu", unread: false },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "tx-1", title: "Makan Siang Warteg Kharisma", category: "Makanan & Minuman", iconType: "food", amount: 18000, type: "expense", date: "Hari ini, 12:45", wallet: "Tunai", tags: ["#makan"] },
    { id: "tx-2", title: "Kopi Kenangan Mantan", category: "Kopi & Nongkrong", iconType: "coffee", amount: 28000, type: "expense", date: "Hari ini, 09:15", wallet: "GoPay", tags: ["#kopi"] },
    { id: "tx-3", title: "Transfer Uang Saku Bulanan", category: "Uang Saku", iconType: "income", amount: 2500000, type: "income", date: "Kemarin, 14:00", wallet: "BCA", tags: ["#bulanan"] },
    { id: "tx-4", title: "Print Laporan Praktikum", category: "Kuliah & Tugas", iconType: "edu", amount: 22000, type: "expense", date: "23 Sep, 16:30", wallet: "Tunai", tags: ["#kuliah"] },
    { id: "tx-5", title: "Spotify Student Subscription", category: "Langganan", iconType: "entertainment", amount: 27500, type: "expense", date: "22 Sep, 08:00", wallet: "GoPay", tags: ["#hiburan"] },
    { id: "tx-6", title: "Bensin Vario Full Tank", category: "Transportasi", iconType: "transport", amount: 35000, type: "expense", date: "20 Sep, 11:20", wallet: "Tunai", tags: ["#transport"] },
  ]);

  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([
    { id: "g-1", title: "Laptop Skripsi M3", target: 12000000, saved: 4800000, iconType: "laptop", deadline: "Desember 2026" },
    { id: "g-2", title: "Dana Darurat Kosan", target: 2000000, saved: 1450000, iconType: "shield", deadline: "November 2026" },
    { id: "g-3", title: "Tiket Konser Akhir Semester", target: 1500000, saved: 850000, iconType: "ticket", deadline: "Januari 2027" },
  ]);

  const [dueBills, setDueBills] = useState<DueBill[]>([
    { id: "b-1", title: "Sewa Kamar Kos", amount: 850000, dueDate: "01 Okt (5 hari lagi)", isPaid: false },
    { id: "b-2", title: "Token Listrik Kosan", amount: 75000, dueDate: "03 Okt (7 hari lagi)", isPaid: false },
    { id: "b-3", title: "Iuran Kas Kelas", amount: 30000, dueDate: "28 Sep (2 hari lagi)", isPaid: true },
  ]);

  const [splitTotal, setSplitTotal] = useState(145000);
  const [splitPeople, setSplitPeople] = useState(4);
  const [splitTax, setSplitTax] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWalletFilter, setSelectedWalletFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "expense" | "income">("all");
  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<"expense" | "income">("expense");
  const [formCategory, setFormCategory] = useState("Makanan & Minuman");
  const [formWallet, setFormWallet] = useState("Tunai");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const formatRupiah = (val: number) => {
    if (isIncognito) return "Rp ••••••••";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  };

  const totalExpense = useMemo(() => transactions.filter((t) => t.type === "expense").reduce((a, c) => a + c.amount, 0), [transactions]);
  const totalIncome = useMemo(() => transactions.filter((t) => t.type === "income").reduce((a, c) => a + c.amount, 0), [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const s = searchQuery.toLowerCase();
      const matchSearch = t.title.toLowerCase().includes(s) || t.category.toLowerCase().includes(s) || t.tags.some((tg) => tg.includes(s));
      const matchWallet = selectedWalletFilter === "all" || t.wallet.toLowerCase() === selectedWalletFilter.toLowerCase();
      const matchType = selectedTypeFilter === "all" || t.type === selectedTypeFilter;
      return matchSearch && matchWallet && matchType;
    });
  }, [transactions, searchQuery, selectedWalletFilter, selectedTypeFilter]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(formAmount.replace(/\D/g, ""), 10);
    if (!formTitle.trim() || isNaN(num) || num <= 0) {
      showToast("Mohon isi judul dan nominal yang valid.");
      return;
    }
    const iconMap: Record<string, string> = { "Makanan & Minuman": "food", "Kopi & Nongkrong": "coffee", "Kuliah & Tugas": "edu", Transportasi: "transport", "Kosan & Tagihan": "bills", "Hiburan & Belanja": "shopping", "Uang Saku Ortu": "income", "Gaji / Freelance": "freelance" };
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      iconType: iconMap[formCategory] || "default",
      amount: num,
      type: formType,
      date: "Baru saja",
      wallet: formWallet,
      tags: [`#${formCategory.toLowerCase().split(" ")[0]}`],
    };
    setTransactions([newTx, ...transactions]);
    if (formType === "expense") {
      setTotalBalance((p) => p - num);
      showToast(`Pengeluaran ${formatRupiah(num)} dicatat.`);
    } else {
      setTotalBalance((p) => p + num);
      showToast(`Pemasukan ${formatRupiah(num)} ditambahkan.`);
    }
    setFormTitle("");
    setFormAmount("");
    setIsModalOpen(false);
  };

  const applyPreset = (title: string, amount: number, cat: string, wal: string) => {
    setFormTitle(title);
    setFormAmount(amount.toString());
    setFormCategory(cat);
    setFormWallet(wal);
    setFormType("expense");
  };

  const handleAddDeposit = (goalId: string, amount: number) => {
    setSavingGoals((p) => p.map((g) => (g.id === goalId ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g)));
    setTotalBalance((p) => Math.max(0, p - amount));
    showToast(`Berhasil menabung Rp ${amount.toLocaleString("id-ID")} ke celengan.`);
  };

  const handleToggleBill = (billId: string) => {
    setDueBills((p) => p.map((b) => {
      if (b.id === billId) {
        const next = !b.isPaid;
        if (next) { setTotalBalance((c) => c - b.amount); showToast(`${b.title} ditandai lunas.`); }
        else showToast(`${b.title} dikembalikan ke belum lunas.`);
        return { ...b, isPaid: next };
      }
      return b;
    }));
  };

  const splitCalc = useMemo(() => {
    const tax = (splitTotal * splitTax) / 100;
    const grand = splitTotal + tax;
    const per = splitPeople > 0 ? Math.ceil(grand / splitPeople) : 0;
    return { tax, grand, per };
  }, [splitTotal, splitPeople, splitTax]);

  const copySplit = () => {
    const summary = `Ringkasan Split Bill\nTotal: Rp ${splitCalc.grand.toLocaleString("id-ID")} (${splitPeople} orang)\nPer orang: Rp ${splitCalc.per.toLocaleString("id-ID")}`;
    navigator.clipboard?.writeText(summary);
    showToast("Rincian Split Bill disalin ke clipboard.");
  };

  const today = new Date();
  const dayNum = today.getDate();
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const tabs = [
    { id: "overview", label: "Ringkasan", icon: <LayoutDashboard size={15} /> },
    { id: "transactions", label: "Transaksi", icon: <ArrowRightLeft size={15} /> },
    { id: "budgets", label: "Anggaran & Goals", icon: <Target size={15} /> },
    { id: "analytics", label: "Analitik", icon: <BarChart3 size={15} /> },
    { id: "hub", label: "Mahasiswa Hub", icon: <GraduationCap size={15} /> },
  ];

  return (
    <div className="app-shell">
      {/* ====== TOP HEADER ====== */}
      <header className="top-header">
        <div className="header-left">
          <div className="brand-mark">MH</div>
          <div className="brand-info">
            <h1>Financial Dashboard</h1>
            <span>MahasiswaHemat</span>
          </div>
        </div>

        <nav className="header-center">
          {tabs.map((t) => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-right">
          <button className={`icon-btn ${isIncognito ? "accent-active" : ""}`} title="Mode Penyamaran Saldo" onClick={() => { setIsIncognito(!isIncognito); showToast(isIncognito ? "Saldo ditampilkan." : "Saldo disamarkan."); }}>
            {isIncognito ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <div style={{ position: "relative" }}>
            <button className="icon-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={16} />
              {notifications.some((n) => n.unread) && <span className="notif-dot" />}
            </button>
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-head">
                  <span>Pemberitahuan</span>
                  <span className="mark-read" onClick={() => { setNotifications((p) => p.map((n) => ({ ...n, unread: false }))); showToast("Semua dibaca."); }}>Tandai dibaca</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
                    <h5>{n.title}</h5>
                    <p>{n.desc}</p>
                    <div className="notif-time">{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={() => { setModalMode("manual"); setIsModalOpen(true); }}>
            <Plus size={15} />
            <span>Catat Transaksi</span>
          </button>

          <div className="user-pill" onClick={() => showToast("Level 4 — Hemat Genius (820/1000 XP)")}>
            <div className="user-avatar">AL</div>
            <div className="user-meta">
              <span className="user-name">Alexander</span>
              <span className="user-role">Mahasiswa Aktif</span>
            </div>
          </div>
        </div>
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <main className="main-content">

        {/* ====== OVERVIEW ====== */}
        {activeTab === "overview" && (
          <div>
            {/* Date & Greeting Bar */}
            <div className="date-greeting-bar">
              <div className="date-section">
                <div className="date-circle">{dayNum}</div>
                <div className="date-text">
                  <span className="date-day">{dayNames[today.getDay()]},</span>
                  <span className="date-month">{monthNames[today.getMonth()]}</span>
                </div>
                <button className="tasks-pill" onClick={() => setActiveTab("budgets")}>
                  <span>Show my Tasks</span>
                  <ArrowRight size={14} />
                </button>
                <button className="icon-btn"><Calendar size={16} /></button>
              </div>
              <div className="greeting-section">
                <div className="greeting-text">
                  <h2>Hey, Need help?</h2>
                  <p>Just ask me anything!</p>
                </div>
                <button className="search-circle"><Mic size={18} /></button>
              </div>
            </div>

            {/* Top Dashboard Grid */}
            <div className="dash-grid-top">
              {/* Wallet Card */}
              <div className="card wallet-card-light">
                <div className="wallet-top-row">
                  <span className="wallet-brand">BCA</span>
                  <div className="card-badge"><CreditCard size={12} /> Direct Debit <ChevronDown size={12} /></div>
                </div>
                <div className="wallet-account">
                  <span className="wallet-link-label">Linked to main account</span>
                  <span className="wallet-number">**** 8492</span>
                </div>
                <div className="wallet-actions">
                  <button className="wallet-btn fill"><Download size={13} /> Receive</button>
                  <button className="wallet-btn outline"><Send size={13} /> Send</button>
                </div>
                <div className="wallet-fee-row">
                  <div>
                    <div className="fee-label">Monthly regular fee</div>
                    <div className="fee-value">{formatRupiah(25000)}</div>
                  </div>
                  <span className="fee-link"><AlertCircle size={12} /> Edit cards limitation</span>
                </div>
              </div>

              {/* Income Card */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title"><CircleDollarSign size={16} /> Total Income</span>
                  <div className="card-badge">Weekly <ChevronDown size={12} /></div>
                </div>
                <div className="stat-big-value">{formatRupiah(totalIncome)}</div>
                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "12px", marginTop: "12px" }}>
                  <div className="flex-between">
                    <div>
                      <div className="fee-label">Total paid</div>
                      <div className="fee-value">{formatRupiah(totalExpense)}</div>
                    </div>
                    <span className="fee-link"><BarChart3 size={12} /> View on chart mode</span>
                  </div>
                </div>
              </div>

              {/* System Lock (Incognito) */}
              <div className="card feature-card-center" onClick={() => { setIsIncognito(!isIncognito); showToast(isIncognito ? "Saldo ditampilkan." : "Saldo disamarkan."); }} style={{ cursor: "pointer" }}>
                <div className="feature-icon-lg">
                  <Lock size={22} />
                </div>
                <span className="feature-label">System Lock</span>
                {/* Growth Gauge */}
                <div className="gauge-container" style={{ marginTop: "4px" }}>
                  <div className="gauge-ring">
                    <div className="gauge-inner">
                      <span className="gauge-pct">88%</span>
                      <span className="gauge-label">Health</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stats Column */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title"><TrendingUp size={16} /> Sisa Hari</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "800" }}>
                    {Math.max(0, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate())}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Hari</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {Math.max(0, (new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate()) * 24)} hours remaining
                </div>
                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "12px", marginTop: "12px" }}>
                  <div className="flex-between">
                    <div>
                      <div className="fee-label">Jatah harian aman</div>
                      <div className="fee-value">{formatRupiah(Math.floor(totalBalance / Math.max(1, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate())))}</div>
                    </div>
                    <div className="icon-circle-sm"><TrendingUp size={14} /></div>
                  </div>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", marginTop: "12px" }}>
                  {formatRupiah(totalBalance)}
                </div>
              </div>
            </div>

            {/* Bottom Dashboard Grid */}
            <div className="dash-grid-bottom">
              {/* Budget Bars */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title"><Target size={16} /> Budget Bulanan</span>
                  <div className="card-badge">{monthNames[today.getMonth()]} <ChevronDown size={12} /></div>
                </div>
                <div className="budget-list">
                  {[
                    { name: "Makanan & Minuman", icon: "food", spent: 540000, limit: 1200000, fill: "fill-success" },
                    { name: "Kopi & Nongkrong", icon: "coffee", spent: 280000, limit: 350000, fill: "fill-warning" },
                    { name: "Transportasi", icon: "transport", spent: 110000, limit: 250000, fill: "fill-accent" },
                    { name: "Kuliah & Tugas", icon: "edu", spent: 65000, limit: 200000, fill: "fill-muted" },
                  ].map((b) => {
                    const pct = Math.round((b.spent / b.limit) * 100);
                    return (
                      <div className="budget-item" key={b.name}>
                        <div className="budget-labels">
                          <span className="budget-name"><CategoryIcon type={b.icon} size={14} /> {b.name}</span>
                          <span className="budget-ratio">{pct}%</span>
                        </div>
                        <div className="budget-track">
                          <div className={`budget-fill ${b.fill}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Manager (Recent Transactions) */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title"><ArrowRightLeft size={16} /> Activity manager</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div className="card-badge" onClick={() => setActiveTab("transactions")} style={{ cursor: "pointer" }}>Lihat Semua</div>
                  </div>
                </div>
                <div className="filter-bar">
                  <div className="search-wrap">
                    <Search size={14} className="search-icon-abs" />
                    <input type="text" className="input-clean" placeholder="Search in activities ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  {["Tunai", "GoPay", "BCA"].map((w) => (
                    <span key={w} className={`filter-chip ${selectedWalletFilter === w ? "active-chip" : ""}`} onClick={() => setSelectedWalletFilter(selectedWalletFilter === w ? "all" : w)}>
                      {w} {selectedWalletFilter === w && <X size={11} />}
                    </span>
                  ))}
                </div>
                <div className="tx-list">
                  {(searchQuery ? filteredTransactions : transactions).slice(0, 4).map((tx) => (
                    <div className="tx-row" key={tx.id}>
                      <div className="tx-left">
                        <div className={`tx-icon-box ${tx.iconType}`}><CategoryIcon type={tx.iconType} size={18} /></div>
                        <div>
                          <div className="tx-title">{tx.title}</div>
                          <div className="tx-meta">
                            <span>{tx.category}</span>
                            <span className="tx-wallet-tag">{tx.wallet}</span>
                          </div>
                        </div>
                      </div>
                      <div className="tx-right">
                        <div className={`tx-amount ${tx.type === "expense" ? "expense" : "income-val"}`}>
                          {tx.type === "expense" ? "- " : "+ "}{formatRupiah(tx.amount)}
                        </div>
                        <div className="tx-date">{tx.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions / Wallet Verification */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title"><Zap size={16} /> Quick Actions</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button className="btn-primary" style={{ justifyContent: "center", width: "100%", borderRadius: "var(--radius-md)", padding: "12px" }} onClick={() => { setModalMode("manual"); setIsModalOpen(true); }}>
                    <Plus size={15} /> Catat Pengeluaran Cepat
                  </button>
                  <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }} onClick={() => { setModalMode("ocr"); setIsModalOpen(true); }}>
                    <ScanLine size={15} /> Scan Struk Belanja
                  </button>
                  <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }} onClick={() => setActiveTab("hub")}>
                    <Receipt size={15} /> Split Bill Calculator
                  </button>
                  <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }} onClick={() => setActiveTab("budgets")}>
                    <PiggyBank size={15} /> Celengan Impian
                  </button>
                </div>

                <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "16px", paddingTop: "14px" }}>
                  <div className="flex-between" style={{ marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700" }}>Wallet Verification</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "10px" }}>Enable 2-step verification to secure your wallet.</p>
                  <button className="btn-primary" style={{ borderRadius: "var(--radius-md)", padding: "10px 18px" }}>Enable</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== TRANSACTIONS ====== */}
        {activeTab === "transactions" && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Riwayat Transaksi</h2>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Kelola seluruh mutasi uang saku kamu.</p>
              </div>
              <button className="btn-primary" onClick={() => { setModalMode("manual"); setIsModalOpen(true); }}>
                <Plus size={15} /> Tambah
              </button>
            </div>
            <div className="filter-bar">
              <div className="search-wrap">
                <Search size={14} className="search-icon-abs" />
                <input type="text" className="input-clean" placeholder="Cari transaksi, tag, kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="select-clean" value={selectedWalletFilter} onChange={(e) => setSelectedWalletFilter(e.target.value)}>
                <option value="all">Semua Dompet</option>
                <option value="Tunai">Tunai</option>
                <option value="BCA">BCA</option>
                <option value="GoPay">GoPay</option>
              </select>
              <select className="select-clean" value={selectedTypeFilter} onChange={(e) => setSelectedTypeFilter(e.target.value as any)}>
                <option value="all">Semua Tipe</option>
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>
            <div className="tx-list">
              {filteredTransactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <Search size={28} style={{ marginBottom: "8px", opacity: 0.4 }} />
                  <p>Tidak ada transaksi yang cocok.</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div className="tx-row" key={tx.id}>
                    <div className="tx-left">
                      <div className={`tx-icon-box ${tx.iconType}`}><CategoryIcon type={tx.iconType} /></div>
                      <div>
                        <div className="tx-title">{tx.title}</div>
                        <div className="tx-meta">
                          <span>{tx.category}</span>
                          <span className="tx-wallet-tag">{tx.wallet}</span>
                          {tx.tags.map((tg) => (<span key={tg} className="text-accent" style={{ fontSize: "11px" }}>{tg}</span>))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div className="tx-right">
                        <div className={`tx-amount ${tx.type === "expense" ? "expense" : "income-val"}`}>
                          {tx.type === "expense" ? "- " : "+ "}{formatRupiah(tx.amount)}
                        </div>
                        <div className="tx-date">{tx.date}</div>
                      </div>
                      <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }} title="Hapus" onClick={() => { setTransactions((p) => p.filter((i) => i.id !== tx.id)); showToast(`"${tx.title}" dihapus.`); }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ====== BUDGETS & GOALS ====== */}
        {activeTab === "budgets" && (
          <div>
            <div className="card mb-24">
              <div className="card-header">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}><PiggyBank size={20} /> Celengan Impian</h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Sisihkan uang untuk target impianmu.</p>
                </div>
                <button className="btn-primary" onClick={() => {
                  const name = prompt("Nama Target Celengan:");
                  if (name) {
                    const targetStr = prompt("Nominal Target (Rp):", "1000000");
                    const targetNum = parseInt(targetStr || "0", 10);
                    if (targetNum > 0) {
                      setSavingGoals((p) => [...p, { id: `g-${Date.now()}`, title: name, target: targetNum, saved: 0, iconType: "default", deadline: "Semester Ini" }]);
                      showToast(`Celengan "${name}" dibuat.`);
                    }
                  }
                }}>
                  <Plus size={15} /> Buat Celengan
                </button>
              </div>
              <div className="goals-grid">
                {savingGoals.map((g) => {
                  const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                  return (
                    <div className="goal-card" key={g.id}>
                      <div className="goal-top">
                        <div className="goal-icon"><CategoryIcon type={g.iconType} size={22} /></div>
                        <div className="goal-info">
                          <h4>{g.title}</h4>
                          <span>Deadline: {g.deadline}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex-between" style={{ fontSize: "12px", marginBottom: "6px" }}>
                          <span className="text-muted">Terkumpul</span>
                          <span className="fw-700 text-accent">{formatRupiah(g.saved)} / {formatRupiah(g.target)} ({pct}%)</span>
                        </div>
                        <div className="budget-track">
                          <div className="budget-fill fill-accent" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button className="goal-deposit-btn" onClick={() => handleAddDeposit(g.id, 50000)}>+ Rp 50.000</button>
                        <button className="goal-deposit-btn" onClick={() => handleAddDeposit(g.id, 100000)}>+ Rp 100.000</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}><Lock size={16} /> Kunci Anggaran (Lock Budget)</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Proteksi jatah kos agar tidak terpakai jajan.</p>
                </div>
                <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={() => showToast("Anggaran Kos Rp 850.000 terkunci aman.")}>
                  <Lock size={13} /> Kunci Saldo Kos
                </button>
              </div>
              <div style={{ background: "var(--bg-page)", padding: "14px", borderRadius: "var(--radius-md)", fontSize: "13px", color: "var(--text-secondary)" }}>
                <Shield size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                Status Proteksi: <strong>Rp 850.000</strong> dialokasikan untuk kamar kosan 1 Oktober. Sisa saldo bebas: <strong>{formatRupiah(totalBalance - 850000)}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* ====== ANALYTICS ====== */}
        {activeTab === "analytics" && (
          <div>
            <div className="advisor-box mb-24">
              <div className="advisor-head">
                <Sparkles size={18} className="text-accent" />
                <h3>Financial Advisor</h3>
              </div>
              <p className="advisor-text">
                Berdasarkan histori transaksi minggu ini, kamu menghabiskan <strong>{formatRupiah(140000)}</strong> untuk kopi dan nongkrong. Jika mengurangi 2 cup per minggu dan menyeduh sendiri di kos, kamu bisa hemat <strong>{formatRupiah(280000)}/bulan</strong> untuk Celengan Laptop Skripsi.
              </p>
              <button className="btn-primary mt-16" onClick={() => showToast("Challenge 'No Jajan Kopi 3 Hari' diaktifkan.")}>
                <Zap size={14} /> Ikuti Challenge Hemat
              </button>
            </div>

            <div className="card mb-24">
              <div className="card-header">
                <span className="card-title"><BarChart3 size={16} /> Tren Pengeluaran 7 Hari</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Rata-rata: Rp 42.000/hari</span>
              </div>
              <div className="bar-chart-wrap">
                {[
                  { day: "Sen", amount: 28000, h: "35%", peak: false },
                  { day: "Sel", amount: 45000, h: "55%", peak: false },
                  { day: "Rab", amount: 32000, h: "40%", peak: false },
                  { day: "Kam", amount: 22000, h: "28%", peak: false },
                  { day: "Jum", amount: 65000, h: "80%", peak: true },
                  { day: "Sab", amount: 78000, h: "95%", peak: true },
                  { day: "Min", amount: 35000, h: "45%", peak: false },
                ].map((b) => (
                  <div key={b.day} className="bar-col" onClick={() => showToast(`${b.day}: ${formatRupiah(b.amount)}`)}>
                    <div className="bar-stick" style={{ height: b.h, background: b.peak ? "var(--accent)" : "var(--bg-elevated)", width: "28px" }} />
                    <span className="bar-day">{b.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="card">
                <div className="card-header"><span className="card-title"><BarChart3 size={16} /> Perbandingan Mahasiswa</span></div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  Kamu berada di peringkat <strong>Top 15%</strong> mahasiswa paling disiplin bulan ini. Rata-rata pengeluaran Rp 2.800.000/bulan, sedangkan proyeksi kamu hanya Rp 2.100.000.
                </p>
              </div>
              <div className="card">
                <div className="card-header"><span className="card-title"><Calendar size={16} /> Kalender Keuangan</span></div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  Hari pengeluaran tertinggi: <strong>Jumat Malam & Sabtu</strong> (frekuensi jajan naik 210%).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====== MAHASISWA HUB ====== */}
        {activeTab === "hub" && (
          <div>
            {/* Split Bill */}
            <div className="card mb-24">
              <div className="card-header">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}><Receipt size={20} /> Split Bill Calculator</h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Bagi tagihan nongkrong bareng tanpa pusing.</p>
                </div>
              </div>
              <div className="split-grid">
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="form-group">
                    <label className="form-label">Total Tagihan (Rp)</label>
                    <input type="number" className="input-plain" value={splitTotal} onChange={(e) => setSplitTotal(Math.max(0, parseInt(e.target.value || "0", 10)))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jumlah Orang</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input type="range" min="2" max="12" value={splitPeople} onChange={(e) => setSplitPeople(parseInt(e.target.value, 10))} style={{ flex: 1, accentColor: "var(--accent)" }} />
                      <span style={{ fontSize: "15px", fontWeight: "700", width: "40px" }}>{splitPeople}</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pajak & Service (%)</label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[0, 10, 11].map((p) => (
                        <span key={p} className={`filter-chip ${splitTax === p ? "active-chip" : ""}`} onClick={() => setSplitTax(p)}>{p}%</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="split-result">
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Per Orang:</span>
                  <div className="split-value">Rp {splitCalc.per.toLocaleString("id-ID")}</div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total: Rp {splitCalc.grand.toLocaleString("id-ID")}</span>
                  <button className="btn-primary mt-16" onClick={copySplit}><ClipboardCopy size={14} /> Salin Rincian</button>
                </div>
              </div>
            </div>

            {/* Due Bills */}
            <div className="card mb-24">
              <div className="card-header">
                <span className="card-title"><Clock size={16} /> Pengingat Jatuh Tempo</span>
              </div>
              <div className="tx-list">
                {dueBills.map((b) => (
                  <div className="tx-row" key={b.id}>
                    <div className="tx-left">
                      <div className={`tx-icon-box ${b.isPaid ? "income" : "bills"}`}>{b.isPaid ? <Check size={18} /> : <Clock size={18} />}</div>
                      <div>
                        <div className="tx-title" style={{ textDecoration: b.isPaid ? "line-through" : "none" }}>{b.title}</div>
                        <div className="tx-meta">
                          <span>{b.dueDate}</span>
                          <span style={{ color: b.isPaid ? "var(--success)" : "var(--accent)", fontWeight: "600" }}>{b.isPaid ? "Lunas" : "Belum"}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="fw-700">{formatRupiah(b.amount)}</span>
                      <button className={`due-btn ${b.isPaid ? "paid" : ""}`} onClick={() => handleToggleBill(b.id)}>{b.isPaid ? "Batalkan" : "Lunas"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promos */}
            <div className="card">
              <div className="card-header">
                <span className="card-title"><Tag size={16} /> Promo Mahasiswa</span>
              </div>
              <div className="promos-grid">
                {[
                  { badge: "Diskon 50%", title: "Spotify Premium Student", desc: "Hanya Rp 27.500/bulan dengan KTM aktif." },
                  { badge: "Diskon 20%", title: "Kereta Api Indonesia", desc: "Diskon tiket antarkota khusus mahasiswa." },
                  { badge: "Gratis 100%", title: "GitHub Student Pack", desc: "Domain gratis, cloud hosting, Copilot." },
                  { badge: "Diskon 60%", title: "Adobe Creative Cloud", desc: "Premiere Pro & Photoshop untuk tugas kampus." },
                ].map((pr) => (
                  <div className="promo-card" key={pr.title}>
                    <span className="promo-badge">{pr.badge}</span>
                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>{pr.title}</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{pr.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====== MODAL ====== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modalMode === "manual" ? <><Receipt size={18} /> Catat Transaksi</> : <><ScanLine size={18} /> Scan Struk</>}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <div style={{ padding: "10px 22px 0" }}>
              <div className="toggle-group">
                <button className={`toggle-btn ${modalMode === "manual" ? "active-expense" : ""}`} onClick={() => setModalMode("manual")}><Receipt size={14} /> Input Manual</button>
                <button className={`toggle-btn ${modalMode === "ocr" ? "active-income" : ""}`} onClick={() => setModalMode("ocr")}><Camera size={14} /> Scan Struk</button>
              </div>
            </div>
            {modalMode === "manual" ? (
              <form onSubmit={handleAddTransaction}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Jenis Transaksi</label>
                    <div className="toggle-group">
                      <button type="button" className={`toggle-btn ${formType === "expense" ? "active-expense" : ""}`} onClick={() => setFormType("expense")}><ArrowUpCircle size={14} /> Pengeluaran</button>
                      <button type="button" className={`toggle-btn ${formType === "income" ? "active-income" : ""}`} onClick={() => setFormType("income")}><ArrowDownCircle size={14} /> Pemasukan</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Keterangan</label>
                    <input type="text" className="input-plain" placeholder="cth: Makan Siang Nasi Padang" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nominal (Rp)</label>
                    <input type="number" className="input-plain" placeholder="20000" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required />
                    <div className="preset-row">
                      <span className="preset-tag" onClick={() => setFormAmount("15000")}>15k</span>
                      <span className="preset-tag" onClick={() => setFormAmount("25000")}>25k</span>
                      <span className="preset-tag" onClick={() => setFormAmount("50000")}>50k</span>
                      <span className="preset-tag" onClick={() => setFormAmount("100000")}>100k</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shortcut Cepat</label>
                    <div className="preset-row">
                      <span className="preset-tag" onClick={() => applyPreset("Nasi Padang", 18000, "Makanan & Minuman", "Tunai")}>Nasi Padang (18k)</span>
                      <span className="preset-tag" onClick={() => applyPreset("Es Kopi Susu", 20000, "Kopi & Nongkrong", "GoPay")}>Es Kopi (20k)</span>
                      <span className="preset-tag" onClick={() => applyPreset("Token Listrik Kos", 50000, "Kosan & Tagihan", "BCA")}>Listrik (50k)</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="form-group">
                      <label className="form-label">Kategori</label>
                      <select className="select-clean" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)" }}>
                        <option value="Makanan & Minuman">Makanan & Minuman</option>
                        <option value="Kopi & Nongkrong">Kopi & Nongkrong</option>
                        <option value="Kuliah & Tugas">Kuliah & Tugas</option>
                        <option value="Transportasi">Transportasi</option>
                        <option value="Kosan & Tagihan">Kosan & Tagihan</option>
                        <option value="Hiburan & Belanja">Hiburan & Belanja</option>
                        <option value="Uang Saku Ortu">Uang Saku Ortu</option>
                        <option value="Gaji / Freelance">Gaji / Freelance</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sumber Dana</label>
                      <select className="select-clean" value={formWallet} onChange={(e) => setFormWallet(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)" }}>
                        <option value="Tunai">Dompet Tunai</option>
                        <option value="BCA">Rekening BCA</option>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-foot">
                  <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-primary">Simpan Transaksi</button>
                </div>
              </form>
            ) : (
              <div className="modal-body">
                <div className="upload-zone">
                  <Camera size={32} style={{ margin: "0 auto 8px", color: "var(--text-muted)" }} />
                  <h4>Upload / Foto Struk Belanja</h4>
                  <p>AI Vision akan membaca merchant, tanggal, dan total belanja otomatis.</p>
                  <button type="button" className="btn-primary" style={{ margin: "0 auto" }} onClick={() => { applyPreset("Struk Indomaret (Roti + Air + Kopi)", 34500, "Makanan & Minuman", "GoPay"); setModalMode("manual"); showToast("Struk berhasil dibaca."); }}>
                    <ScanLine size={14} /> Simulasi Baca Struk
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== TOAST ====== */}
      {toastMessage && (
        <div className="toast-wrap">
          <div className="toast-msg">
            <Check size={15} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
