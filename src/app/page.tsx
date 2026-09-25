"use client";

import React, { useState, useMemo } from "react";

interface Transaction {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
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
  icon: string;
  deadline: string;
}

interface DueBill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: string;
}

export default function Home() {
  // Navigation State (Moved all left column buttons to top tabs)
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "budgets" | "analytics" | "hub">("overview");

  // Interactive Features from PRD
  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"manual" | "ocr">("manual");
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Financial States
  const [totalBalance, setTotalBalance] = useState<number>(4250000);
  const [monthlyAllowance] = useState<number>(3000000);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Peringatan Batas Kopi", desc: "Pengeluaran kopi kamu sudah 80% dari budget bulanan.", time: "10 m lalu", unread: true },
    { id: "n2", title: "Jatuh Tempo Kosan", desc: "Pembayaran kosan jatuh tempo dalam 5 hari ke depan.", time: "2 jam lalu", unread: true },
    { id: "n3", title: "Skor Finansial Meningkat", desc: "Selamat! Skor kesehatan finansial kamu naik ke 88/100.", time: "1 hari lalu", unread: false }
  ]);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      title: "Makan Siang Warteg Kharisma",
      category: "Makanan & Minuman",
      categoryIcon: "🍛",
      amount: 18000,
      type: "expense",
      date: "Hari ini, 12:45",
      wallet: "Tunai",
      tags: ["#makan", "#warteg", "#kampus"],
    },
    {
      id: "tx-2",
      title: "Kopi Kenangan Mantan + Donat",
      category: "Kopi & Nongkrong",
      categoryIcon: "☕",
      amount: 28000,
      type: "expense",
      date: "Hari ini, 09:15",
      wallet: "GoPay",
      tags: ["#kopi", "#nugas"],
    },
    {
      id: "tx-3",
      title: "Transfer Uang Saku Bulanan",
      category: "Uang Saku Ortu",
      categoryIcon: "🏦",
      amount: 2500000,
      type: "income",
      date: "Kemarin, 14:00",
      wallet: "BCA",
      tags: ["#bulanan", "#keluarga"],
    },
    {
      id: "tx-4",
      title: "Print Laporan Praktikum & Jilid",
      category: "Kuliah & Tugas",
      categoryIcon: "📚",
      amount: 22000,
      type: "expense",
      date: "23 Sep, 16:30",
      wallet: "Tunai",
      tags: ["#kuliah", "#tugas"],
    },
    {
      id: "tx-5",
      title: "Spotify Student Subscription",
      category: "Langganan Digital",
      categoryIcon: "🎵",
      amount: 27500,
      type: "expense",
      date: "22 Sep, 08:00",
      wallet: "GoPay",
      tags: ["#hiburan", "#student"],
    },
    {
      id: "tx-6",
      title: "Bensin Vario Full Tank",
      category: "Transportasi",
      categoryIcon: "🛵",
      amount: 35000,
      type: "expense",
      date: "20 Sep, 11:20",
      wallet: "Tunai",
      tags: ["#transport", "#kampus"],
    },
  ]);

  // Saving Goals State (PRD #31: Celengan Impian)
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([
    {
      id: "g-1",
      title: "Laptop Skripsi & Coding M3",
      target: 12000000,
      saved: 4800000,
      icon: "💻",
      deadline: "Desember 2026",
    },
    {
      id: "g-2",
      title: "Dana Darurat Kosan",
      target: 2000000,
      saved: 1450000,
      icon: "🛡️",
      deadline: "November 2026",
    },
    {
      id: "g-3",
      title: "Tiket Konser / Healing Akhir Semester",
      target: 1500000,
      saved: 850000,
      icon: "🎫",
      deadline: "Januari 2027",
    },
  ]);

  // Bills & Due Dates State (PRD #50: Pengingat Jatuh Tempo)
  const [dueBills, setDueBills] = useState<DueBill[]>([
    {
      id: "b-1",
      title: "Sewa Kamar Kos Bulanan",
      amount: 850000,
      dueDate: "01 Oktober (5 hari lagi)",
      isPaid: false,
      category: "Tempat Tinggal",
    },
    {
      id: "b-2",
      title: "Tagihan Token Listrik Kosan",
      amount: 75000,
      dueDate: "03 Oktober (7 hari lagi)",
      isPaid: false,
      category: "Utilitas",
    },
    {
      id: "b-3",
      title: "Iuran Kas Kelas Angkatan",
      amount: 30000,
      dueDate: "28 September (2 hari lagi)",
      isPaid: true,
      category: "Kuliah",
    },
  ]);

  // Split Bill Calculator States (PRD #21)
  const [splitTotal, setSplitTotal] = useState<number>(145000);
  const [splitPeople, setSplitPeople] = useState<number>(4);
  const [splitTax, setSplitTax] = useState<number>(10);

  // Transaction Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWalletFilter, setSelectedWalletFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "expense" | "income">("all");

  // Form States for "+ Catat Transaksi"
  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<"expense" | "income">("expense");
  const [formCategory, setFormCategory] = useState("Makanan & Minuman");
  const [formWallet, setFormWallet] = useState("Tunai");

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Helper Currency
  const formatRupiah = (val: number, masked: boolean = false) => {
    if (masked || isIncognito) return "Rp ••••••••";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Derived Totals
  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchWallet = selectedWalletFilter === "all" || t.wallet.toLowerCase() === selectedWalletFilter.toLowerCase();
      const matchType = selectedTypeFilter === "all" || t.type === selectedTypeFilter;

      return matchSearch && matchWallet && matchType;
    });
  }, [transactions, searchQuery, selectedWalletFilter, selectedTypeFilter]);

  // Handle Submit New Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(formAmount.replace(/\D/g, ""), 10);
    if (!formTitle.trim() || isNaN(num) || num <= 0) {
      showToast("⚠️ Mohon isi judul dan nominal yang valid.");
      return;
    }

    const categoryIcons: Record<string, string> = {
      "Makanan & Minuman": "🍛",
      "Kopi & Nongkrong": "☕",
      "Kuliah & Tugas": "📚",
      Transportasi: "🛵",
      "Kosan & Tagihan": "🏠",
      "Hiburan & Belanja": "🛍️",
      "Uang Saku Ortu": "🏦",
      "Gaji / Freelance": "💼",
    };

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      categoryIcon: categoryIcons[formCategory] || "💸",
      amount: num,
      type: formType,
      date: "Baru saja",
      wallet: formWallet,
      tags: [`#${formCategory.toLowerCase().split(" ")[0]}`],
    };

    setTransactions([newTx, ...transactions]);

    if (formType === "expense") {
      setTotalBalance((prev) => prev - num);
      showToast(`✅ Pengeluaran ${formatRupiah(num)} berhasil dicatat!`);
    } else {
      setTotalBalance((prev) => prev + num);
      showToast(`🎉 Pemasukan ${formatRupiah(num)} berhasil ditambahkan!`);
    }

    // Reset Form
    setFormTitle("");
    setFormAmount("");
    setIsModalOpen(false);
  };

  // Quick Preset Helper for Form
  const applyPreset = (title: string, amount: number, cat: string, wal: string) => {
    setFormTitle(title);
    setFormAmount(amount.toString());
    setFormCategory(cat);
    setFormWallet(wal);
    setFormType("expense");
  };

  // Add Deposit to Saving Goal
  const handleAddDeposit = (goalId: string, amount: number) => {
    setSavingGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const nextSaved = Math.min(g.target, g.saved + amount);
          return { ...g, saved: nextSaved };
        }
        return g;
      })
    );
    setTotalBalance((prev) => Math.max(0, prev - amount));
    showToast(`🎯 Berhasil menabung Rp ${amount.toLocaleString("id-ID")} ke celengan!`);
  };

  // Toggle Bill Paid
  const handleToggleBill = (billId: string) => {
    setDueBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const nextPaid = !b.isPaid;
          if (nextPaid) {
            setTotalBalance((curr) => curr - b.amount);
            showToast(`🎉 ${b.title} ditandai lunas! Saldo terpotong ${formatRupiah(b.amount)}`);
          } else {
            showToast(`Tagihan ${b.title} dikembalikan ke status belum lunas.`);
          }
          return { ...b, isPaid: nextPaid };
        }
        return b;
      })
    );
  };

  // Split Bill Calculations
  const splitCalculated = useMemo(() => {
    const taxAmount = (splitTotal * splitTax) / 100;
    const grandTotal = splitTotal + taxAmount;
    const perPerson = splitPeople > 0 ? Math.ceil(grandTotal / splitPeople) : 0;
    return { taxAmount, grandTotal, perPerson };
  }, [splitTotal, splitPeople, splitTax]);

  const copySplitSummary = () => {
    const summary = `🧾 *Ringkasan Split Bill MahasiswaHemat*\nTotal: Rp ${splitCalculated.grandTotal.toLocaleString("id-ID")} (${splitPeople} orang)\n👉 Patungan per orang: *Rp ${splitCalculated.perPerson.toLocaleString("id-ID")}*\n(Bisa transfer via BCA / GoPay / ShopeePay ya guys!)`;
    navigator.clipboard?.writeText(summary);
    showToast("📋 Rincian Split Bill berhasil disalin ke clipboard!");
  };

  return (
    <div className="app-container">
      {/* Background Ambience & Cyber Grid */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb-1"></div>
        <div className="ambient-orb-2"></div>
        <div className="ambient-grid"></div>
      </div>

      {/* ========================================================
          TOP NAVIGATION BAR (Moved all left column buttons here)
          ======================================================== */}
      <header className="top-navbar">
        <div className="navbar-inner">
          {/* Brand Identity */}
          <div className="brand-group" onClick={() => setActiveTab("overview")}>
            <div className="brand-badge-3d"></div>
            <div className="brand-text-wrap">
              <span className="brand-title">MahasiswaHemat</span>
              <span className="brand-subtitle">
                <span className="status-dot-pulse"></span>
                Semester 5 • Finansial Aktif
              </span>
            </div>
          </div>

          {/* Dynamic Top Tabs with Sleek Tactile Depth */}
          <nav className="nav-tab-container" aria-label="Navigasi Utama">
            <button
              className={`nav-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="nav-icon">📊</span>
              <span>Ringkasan</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === "transactions" ? "active" : ""}`}
              onClick={() => setActiveTab("transactions")}
            >
              <span className="nav-icon">💸</span>
              <span>Transaksi</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === "budgets" ? "active" : ""}`}
              onClick={() => setActiveTab("budgets")}
            >
              <span className="nav-icon">🎯</span>
              <span>Anggaran & Goals</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <span className="nav-icon">📈</span>
              <span>Analitik</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === "hub" ? "active" : ""}`}
              onClick={() => setActiveTab("hub")}
            >
              <span className="nav-icon">🎓</span>
              <span>Mahasiswa Hub</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="navbar-actions">
            {/* Mode Penyamaran Toggle (PRD #8: Incognito Mode) */}
            <button
              className={`btn-icon-tactile ${isIncognito ? "active-mode" : ""}`}
              title={isIncognito ? "Matikan Mode Penyamaran (Saldo Disembunyikan)" : "Aktifkan Mode Penyamaran (Sembunyikan Saldo)"}
              onClick={() => {
                const next = !isIncognito;
                setIsIncognito(next);
                showToast(next ? "👁️ Mode Penyamaran Aktif: Saldo disamarkan!" : "🔓 Mode Normal: Saldo ditampilkan.");
              }}
            >
              {isIncognito ? "🔒" : "👁️"}
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                className="btn-icon-tactile"
                title="Notifikasi & Peringatan Budget"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                🔔
                {notifications.some((n) => n.unread) && <span className="badge-dot"></span>}
              </button>

              {/* Notif Dropdown */}
              {isNotifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "48px",
                    right: "0",
                    width: "320px",
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "16px",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
                    zIndex: 150,
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700" }}>Pemberitahuan</span>
                    <span
                      style={{ fontSize: "11px", color: "var(--accent-cyan)", cursor: "pointer" }}
                      onClick={() => {
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                        showToast("Semua notifikasi ditandai dibaca.");
                      }}
                    >
                      Tandai dibaca
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          background: n.unread ? "rgba(0, 210, 255, 0.06)" : "transparent",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#fff" }}>{n.title}</div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "3px" }}>{n.desc}</div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Add Button (PRD #14) */}
            <button
              className="btn-add-action"
              onClick={() => {
                setModalMode("manual");
                setIsModalOpen(true);
              }}
            >
              <span>+</span>
              <span>Catat Transaksi</span>
            </button>

            {/* Gamified Profile Badge (PRD #43: Level/XP) */}
            <div
              className="user-profile-badge"
              title="Profil Mahasiswa & Level Penghematan"
              onClick={() => showToast("⭐ Peringkat Mahasiswa: Level 4 Hemat Genius (820/1000 XP)!")}
            >
              <div className="user-avatar-mini">MH</div>
              <div className="user-xp-label">
                <span className="user-xp-title">Alexander</span>
                <span className="user-xp-sub">Lv. 4 • Hemat</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN VIEW CONTAINER
          ======================================================== */}
      <main className="main-content">
        {/* Dynamic Campus Ticker / AI Advisor Quick Tip (PRD #15) */}
        <div className="student-ticker">
          <div className="ticker-left">
            <span className="ticker-tag">AI Finansial Kampus</span>
            <span>
              💡 Pengeluaran makan siang kamu minggu ini stabil di <strong>Rp 18.000/hari</strong>. Jatah uang saku kamu aman hingga akhir bulan!
            </span>
          </div>
          <button
            className="ticker-action-btn"
            onClick={() => setActiveTab("analytics")}
          >
            Lihat Rekomendasi →
          </button>
        </div>

        {/* ========================================================
            TAB 1: RINGKASAN (OVERVIEW)
            ======================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Top Grid: 3D Virtual ATM Card + Quick Metrics + Health Score */}
            <div className="overview-top-grid">
              {/* Virtual Neo-Skeuomorphic Card */}
              <div
                className="virtual-card-3d"
                onClick={() => {
                  setIsIncognito(!isIncognito);
                  showToast("Kartu disentuh: Mode penyamaran saldo diubah.");
                }}
                title="Sentuh kartu untuk menyamarkan / melihat saldo"
              >
                <div className="card-top-row">
                  <div className="card-bank-info">
                    <span className="card-type-chip">Student Platinum Card</span>
                    <span className="card-holder-name">ALEXANDER • TEKNIK INFORMATIKA</span>
                  </div>
                  <div className="emv-chip" title="Chip Logam EMV Skeuomorphic"></div>
                </div>

                <div className="card-balance-block">
                  <div className="card-balance-label">
                    <span>Total Saldo Aktif</span>
                    {isIncognito && <span style={{ fontSize: "10px", color: "var(--accent-cyan)" }}>(Disamarkan)</span>}
                  </div>
                  <div className="card-balance-value">{formatRupiah(totalBalance)}</div>
                </div>

                <div className="card-footer-row">
                  <span className="card-number-masked">•••• 8492</span>
                  <span className="card-network-pill">BCA / GOPAY LINKED</span>
                </div>
              </div>

              {/* Quick Metrics Panel */}
              <div className="metrics-panel">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.2px", color: "var(--text-secondary)" }}>
                    ARUS KAS BULAN INI
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--accent-emerald)", fontWeight: "600" }}>● Realtime Updated</span>
                </div>

                <div className="metric-cards-grid">
                  <div className="mini-stat-card">
                    <div className="stat-header-row">
                      <span className="stat-title">Pemasukan / Uang Saku</span>
                      <div className="stat-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)" }}>
                        ↓
                      </div>
                    </div>
                    <div className="stat-val text-positive">{formatRupiah(totalIncome)}</div>
                    <div className="stat-footer-text">Dari transfer bulanan orang tua</div>
                  </div>

                  <div className="mini-stat-card">
                    <div className="stat-header-row">
                      <span className="stat-title">Total Pengeluaran</span>
                      <div className="stat-icon-wrap" style={{ background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)" }}>
                        ↑
                      </div>
                    </div>
                    <div className="stat-val text-negative">{formatRupiah(totalExpense)}</div>
                    <div className="stat-footer-text">
                      <span className="text-positive">38%</span> dari batas wajar
                    </div>
                  </div>
                </div>

                {/* Sisa Hari & Uang Saku Harian */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-elevated)", padding: "12px 16px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Jatah Aman Harian (s/d Akhir Bulan):
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--accent-cyan)" }}>
                    {formatRupiah(Math.floor(totalBalance / 25))} / hari
                  </div>
                </div>
              </div>

              {/* Financial Health Score (PRD #13) */}
              <div className="health-widget">
                <div className="health-header">
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-secondary)" }}>SKOR FINANSIAL</span>
                  <span style={{ fontSize: "11px", color: "var(--accent-cyan)" }}>PRD #13</span>
                </div>

                <div className="health-gauge-box">
                  <div className="gauge-score">88<span className="gauge-max">/100</span></div>
                  <div className="gauge-label">Kondisi Sehat & Terkendali</div>
                </div>

                <div className="health-tips-list">
                  <div className="health-tip-item">
                    <span>🟢</span>
                    <span>Rasio jajan makan warteg vs cafe seimbang</span>
                  </div>
                  <div className="health-tip-item">
                    <span>🟡</span>
                    <span>Budget kopi tersisa 20% bulan ini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Dock (Floating Dock with PRD feature triggers) */}
            <div className="quick-dock">
              <button
                className="dock-btn"
                onClick={() => {
                  setModalMode("manual");
                  setIsModalOpen(true);
                }}
              >
                <span className="dock-icon">➕</span>
                <span>Catat Pengeluaran Cepat</span>
              </button>
              <button
                className="dock-btn"
                onClick={() => {
                  setModalMode("ocr");
                  setIsModalOpen(true);
                }}
              >
                <span className="dock-icon">🧾</span>
                <span>Scan Struk Belanja (AI OCR)</span>
              </button>
              <button
                className="dock-btn"
                onClick={() => setActiveTab("hub")}
              >
                <span className="dock-icon">⚡</span>
                <span>Kalkulator Split Bill Nongkrong</span>
              </button>
              <button
                className="dock-btn"
                onClick={() => setActiveTab("budgets")}
              >
                <span className="dock-icon">🎯</span>
                <span>Cek Celengan Impian</span>
              </button>
            </div>

            {/* Secondary Grid: Recent Transactions & Category Budgets */}
            <div className="content-grid-duo">
              {/* Recent Transactions List */}
              <div className="panel-card">
                <div className="panel-header-row">
                  <h3 className="panel-heading">
                    <span>Transaksi Terakhir</span>
                  </h3>
                  <button
                    className="panel-sub-btn"
                    onClick={() => setActiveTab("transactions")}
                  >
                    Lihat Semua ({transactions.length}) →
                  </button>
                </div>

                <div className="tx-list">
                  {transactions.slice(0, 5).map((tx) => (
                    <div className="tx-row" key={tx.id}>
                      <div className="tx-left">
                        <div className="tx-cat-icon">{tx.categoryIcon}</div>
                        <div>
                          <div className="tx-title-text">{tx.title}</div>
                          <div className="tx-meta-text">
                            <span>{tx.category}</span>
                            <span>•</span>
                            <span className="tx-wallet-tag">{tx.wallet}</span>
                          </div>
                        </div>
                      </div>
                      <div className="tx-right">
                        <div className={`tx-value ${tx.type === "expense" ? "text-negative" : "text-positive"}`}>
                          {tx.type === "expense" ? "-" : "+"} {formatRupiah(tx.amount)}
                        </div>
                        <div className="tx-date-small">{tx.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Budgets & Warnings */}
              <div className="panel-card">
                <div className="panel-header-row">
                  <h3 className="panel-heading">
                    <span>Anggaran Pengeluaran Bulan Ini</span>
                  </h3>
                  <button
                    className="panel-sub-btn"
                    onClick={() => setActiveTab("budgets")}
                  >
                    Kelola Budget →
                  </button>
                </div>

                <div className="budget-bars-list">
                  {/* Makanan & Minuman */}
                  <div className="budget-bar-item">
                    <div className="budget-bar-labels">
                      <span className="budget-name">🍛 Makanan & Minuman Warteg</span>
                      <span className="budget-ratio">
                        {formatRupiah(540000)} / {formatRupiah(1200000)} (45%)
                      </span>
                    </div>
                    <div className="budget-track">
                      <div className="budget-fill" style={{ width: "45%", background: "var(--accent-emerald)" }}></div>
                    </div>
                  </div>

                  {/* Kopi & Nongkrong */}
                  <div className="budget-bar-item">
                    <div className="budget-bar-labels">
                      <span className="budget-name">☕ Kopi, Cafe & Nongkrong</span>
                      <span className="budget-ratio" style={{ color: "var(--accent-amber)" }}>
                        {formatRupiah(280000)} / {formatRupiah(350000)} (80% ⚠️)
                      </span>
                    </div>
                    <div className="budget-track">
                      <div className="budget-fill" style={{ width: "80%", background: "var(--accent-amber)" }}></div>
                    </div>
                  </div>

                  {/* Transportasi */}
                  <div className="budget-bar-item">
                    <div className="budget-bar-labels">
                      <span className="budget-name">🛵 Bensin & Transportasi Kampus</span>
                      <span className="budget-ratio">
                        {formatRupiah(110000)} / {formatRupiah(250000)} (44%)
                      </span>
                    </div>
                    <div className="budget-track">
                      <div className="budget-fill" style={{ width: "44%", background: "var(--accent-cyan)" }}></div>
                    </div>
                  </div>

                  {/* Kuliah & Tugas */}
                  <div className="budget-bar-item">
                    <div className="budget-bar-labels">
                      <span className="budget-name">📚 Print Tugas & Buku Kuliah</span>
                      <span className="budget-ratio">
                        {formatRupiah(65000)} / {formatRupiah(200000)} (32%)
                      </span>
                    </div>
                    <div className="budget-track">
                      <div className="budget-fill" style={{ width: "32%", background: "var(--accent-purple)" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: TRANSAKSI (DETAILED LIST & SEARCH)
            ======================================================== */}
        {activeTab === "transactions" && (
          <div className="panel-card">
            <div className="panel-header-row">
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Daftar Riwayat Transaksi</h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Kelola dan cari seluruh mutasi uang saku dan jajan kamu.
                </p>
              </div>
              <button
                className="btn-add-action"
                onClick={() => {
                  setModalMode("manual");
                  setIsModalOpen(true);
                }}
              >
                + Tambah Transaksi
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="filter-bar">
              <div className="search-input-wrap">
                <input
                  type="text"
                  placeholder="Cari transaksi, warteg, kopi, tag #makan..."
                  className="input-tactile"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={selectedWalletFilter}
                onChange={(e) => setSelectedWalletFilter(e.target.value)}
              >
                <option value="all">Semua Dompet / Rekening</option>
                <option value="Tunai">Dompet Tunai</option>
                <option value="BCA">Rekening BCA</option>
                <option value="GoPay">GoPay / E-Wallet</option>
              </select>

              <select
                className="filter-select"
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
              >
                <option value="all">Semua Tipe</option>
                <option value="expense">Pengeluaran Saja</option>
                <option value="income">Pemasukan Saja</option>
              </select>
            </div>

            {/* Full Transaction List */}
            <div className="tx-list" style={{ marginTop: "16px" }}>
              {filteredTransactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                  <p>Tidak ada transaksi yang cocok dengan pencarian.</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div className="tx-row" key={tx.id}>
                    <div className="tx-left">
                      <div className="tx-cat-icon">{tx.categoryIcon}</div>
                      <div>
                        <div className="tx-title-text">{tx.title}</div>
                        <div className="tx-meta-text">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span className="tx-wallet-tag">{tx.wallet}</span>
                          {tx.tags.map((tg) => (
                            <span key={tg} style={{ color: "var(--accent-cyan)", fontSize: "11px" }}>
                              {tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div className="tx-right">
                        <div className={`tx-value ${tx.type === "expense" ? "text-negative" : "text-positive"}`}>
                          {tx.type === "expense" ? "-" : "+"} {formatRupiah(tx.amount)}
                        </div>
                        <div className="tx-date-small">{tx.date}</div>
                      </div>
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "6px",
                          fontSize: "14px",
                        }}
                        title="Hapus Transaksi"
                        onClick={() => {
                          setTransactions((prev) => prev.filter((item) => item.id !== tx.id));
                          showToast(`Transaksi "${tx.title}" dihapus.`);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ANGGARAN & GOALS (BUDGETS & CELENGAN IMPIAN)
            ======================================================== */}
        {activeTab === "budgets" && (
          <div>
            <div className="panel-card" style={{ marginBottom: "28px" }}>
              <div className="panel-header-row">
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "700" }}>🎯 Celengan Impian (Saving Goals)</h2>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Simpan dan sisihkan uang saku untuk membeli barang impian atau persiapan skripsi (PRD #31).
                  </p>
                </div>
                <button
                  className="btn-add-action"
                  onClick={() => {
                    const name = prompt("Nama Target Celengan Baru:");
                    if (name) {
                      const targetStr = prompt("Nominal Target (Rp):", "1000000");
                      const targetNum = parseInt(targetStr || "0", 10);
                      if (targetNum > 0) {
                        setSavingGoals((prev) => [
                          ...prev,
                          {
                            id: `g-${Date.now()}`,
                            title: name,
                            target: targetNum,
                            saved: 0,
                            icon: "✨",
                            deadline: "Target Semester Ini",
                          },
                        ]);
                        showToast(`Celengan "${name}" berhasil dibuat!`);
                      }
                    }
                  }}
                >
                  + Buat Celengan Baru
                </button>
              </div>

              {/* Goals Grid */}
              <div className="goals-grid">
                {savingGoals.map((goal) => {
                  const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
                  return (
                    <div className="goal-card" key={goal.id}>
                      <div className="goal-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div className="goal-icon-badge">{goal.icon}</div>
                          <div>
                            <div style={{ fontSize: "14.5px", fontWeight: "700", color: "#fff" }}>{goal.title}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                              Deadline: {goal.deadline}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "6px" }}>
                          <span style={{ color: "var(--text-secondary)" }}>Terkumpul:</span>
                          <span style={{ fontWeight: "700", color: "var(--accent-cyan)" }}>
                            {formatRupiah(goal.saved)} / {formatRupiah(goal.target)} ({percent}%)
                          </span>
                        </div>
                        <div className="budget-track">
                          <div
                            className="budget-fill"
                            style={{
                              width: `${percent}%`,
                              background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          className="goal-btn-deposit"
                          onClick={() => handleAddDeposit(goal.id, 50000)}
                        >
                          + Tabung Rp 50.000
                        </button>
                        <button
                          className="goal-btn-deposit"
                          onClick={() => handleAddDeposit(goal.id, 100000)}
                        >
                          + Tabung Rp 100.000
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lock Budget Simulator (PRD #33) */}
            <div className="panel-card">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-heading">🔒 Fitur Kunci Anggaran Uang Saku (Lock Budget)</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Simulasikan uang saku terkunci agar tidak terpakai foya-foya sebelum tanggal bayar kosan.
                  </p>
                </div>
                <button
                  className="panel-sub-btn"
                  onClick={() => showToast("🔒 Anggaran Kos Rp 850.000 terkunci aman di brankas!")}
                >
                  Kunci Saldo Kos Sekarang
                </button>
              </div>
              <div style={{ background: "var(--bg-elevated)", padding: "16px", borderRadius: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                🛡️ Status Proteksi: <strong>Rp 850.000</strong> telah dialokasikan khusus untuk kamar kosan pada 1 Oktober. Sisa saldo bebas jajan kamu saat ini adalah <strong>{formatRupiah(totalBalance - 850000)}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ANALITIK & AI ADVISOR
            ======================================================== */}
        {activeTab === "analytics" && (
          <div>
            {/* AI Financial Advisor Box (PRD #40) */}
            <div className="ai-advisor-box" style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px" }}>🤖</span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>
                  AI Financial Advisor Mahasiswa (PRD #40)
                </h3>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                &ldquo;Halo Alexander! Berdasarkan histori transaksi minggu ini, kamu telah menghabiskan <strong>Rp 140.000</strong> untuk kopi dan nongkrong (sekitar 14% dari pengeluaran mingguan). Jika kamu mengurangi 2 cup kopi per minggu dan menyeduh sendiri di kos, kamu bisa menghemat hingga <strong>Rp 280.000/bulan</strong> yang bisa langsung dialokasikan ke <strong>Celengan Laptop Skripsi</strong> kamu.&rdquo;
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
                <button
                  className="dock-btn"
                  onClick={() => showToast("🎯 Target tantangan 'No Jajan Kopi 3 Hari' diaktifkan!")}
                >
                  ⚡ Ikuti Challenge Hemat 3 Hari
                </button>
              </div>
            </div>

            {/* Weekly Spending Trend (Interactive Visual Representation) */}
            <div className="panel-card" style={{ marginBottom: "28px" }}>
              <div className="panel-header-row">
                <h3 className="panel-heading">Tren Pengeluaran 7 Hari Terakhir (Mingguan)</h3>
                <span style={{ fontSize: "12px", color: "var(--accent-cyan)" }}>Rata-rata: Rp 42.000 / hari</span>
              </div>

              {/* Bar Chart Visualization */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  height: "200px",
                  padding: "20px 10px 0 10px",
                  background: "var(--bg-elevated)",
                  borderRadius: "14px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {[
                  { day: "Senin", amount: 28000, height: "35%" },
                  { day: "Selasa", amount: 45000, height: "55%" },
                  { day: "Rabu", amount: 32000, height: "40%" },
                  { day: "Kamis", amount: 22000, height: "28%" },
                  { day: "Jumat", amount: 65000, height: "80%", peak: true },
                  { day: "Sabtu", amount: 78000, height: "95%", peak: true },
                  { day: "Minggu", amount: 35000, height: "45%" },
                ].map((bar) => (
                  <div
                    key={bar.day}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      flex: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => showToast(`Pengeluaran hari ${bar.day}: ${formatRupiah(bar.amount)}`)}
                  >
                    <span style={{ fontSize: "11px", color: bar.peak ? "var(--accent-amber)" : "var(--text-muted)", fontWeight: "600" }}>
                      {bar.amount > 50000 ? "⚠️" : ""}
                    </span>
                    <div
                      style={{
                        width: "36px",
                        height: bar.height,
                        borderRadius: "6px 6px 0 0",
                        background: bar.peak
                          ? "linear-gradient(180deg, var(--accent-rose) 0%, #991b1b 100%)"
                          : "linear-gradient(180deg, var(--accent-cyan) 0%, #0369a1 100%)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                        transition: "transform 0.2s",
                      }}
                    ></div>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Info & Peer Comparison (PRD #41) */}
            <div className="content-grid-duo">
              <div className="panel-card">
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>📊 Perbandingan Antar Mahasiswa (Anonim)</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  Kamu berada di peringkat <strong>Top 15% Mahasiswa Paling Disiplin</strong> di kampus kamu bulan ini. Rata-rata mahasiswa sekitarmu menghabiskan Rp 2.800.000/bulan, sementara pengeluaran kamu diproyeksikan hanya Rp 2.100.000.
                </p>
              </div>

              <div className="panel-card">
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>🗓️ Kalender Keuangan (Peak Days)</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  Hari dengan tingkat pengeluaran tertinggi jatuh pada hari <strong>Jumat Malam dan Sabtu</strong> (frekuensi jajan dan nongkrong naik hingga 210%).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: MAHASISWA HUB (SPLIT BILL, TAGIHAN KOS, DISKON)
            ======================================================== */}
        {activeTab === "hub" && (
          <div>
            {/* Split Bill Calculator (PRD #21) */}
            <div className="split-bill-card" style={{ marginBottom: "28px" }}>
              <div className="panel-header-row">
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "700" }}>⚡ Kalkulator Split Bill Nongkrong (PRD #21)</h2>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Bagi tagihan makan bareng temen kos atau kelompok tugas tanpa pusing hitung manual.
                  </p>
                </div>
              </div>

              <div className="split-calc-grid">
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="form-group">
                    <label className="form-label">Total Tagihan Kasir (Rp)</label>
                    <input
                      type="number"
                      className="input-tactile"
                      value={splitTotal}
                      onChange={(e) => setSplitTotal(Math.max(0, parseInt(e.target.value || "0", 10)))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Jumlah Orang Patungan</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="range"
                        min="2"
                        max="12"
                        value={splitPeople}
                        onChange={(e) => setSplitPeople(parseInt(e.target.value, 10))}
                        style={{ flex: 1, accentColor: "var(--accent-cyan)" }}
                      />
                      <span style={{ fontSize: "16px", fontWeight: "700", width: "40px", textAlign: "center" }}>
                        {splitPeople} org
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pajak Resto & Service (%)</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[0, 10, 11].map((pct) => (
                        <button
                          key={pct}
                          className={`nav-tab-btn ${splitTax === pct ? "active" : ""}`}
                          onClick={() => setSplitTax(pct)}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="split-result-box">
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Patungan Per Orang:</span>
                  <div className="split-per-person">
                    Rp {splitCalculated.perPerson.toLocaleString("id-ID")}
                  </div>
                  <span style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
                    Total Termasuk Pajak: Rp {splitCalculated.grandTotal.toLocaleString("id-ID")}
                  </span>
                  <button className="btn-add-action" onClick={copySplitSummary}>
                    📋 Salin Rincian Split Bill
                  </button>
                </div>
              </div>
            </div>

            {/* Due Bills & Rent Reminders (PRD #50) */}
            <div className="panel-card" style={{ marginBottom: "28px" }}>
              <div className="panel-header-row">
                <h3 className="panel-heading">🗓️ Pengingat Jatuh Tempo Kos & UKT (PRD #50)</h3>
                <span style={{ fontSize: "12px", color: "var(--accent-cyan)" }}>Otomatis Terpantau</span>
              </div>

              <div className="tx-list">
                {dueBills.map((b) => (
                  <div className="tx-row" key={b.id}>
                    <div className="tx-left">
                      <div className="tx-cat-icon">{b.isPaid ? "✅" : "⏰"}</div>
                      <div>
                        <div className="tx-title-text" style={{ textDecoration: b.isPaid ? "line-through" : "none" }}>
                          {b.title}
                        </div>
                        <div className="tx-meta-text">
                          <span>{b.dueDate}</span>
                          <span>•</span>
                          <span style={{ color: b.isPaid ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: "600" }}>
                            {b.isPaid ? "Lunas" : "Belum Dibayar"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div className="tx-value text-primary">{formatRupiah(b.amount)}</div>
                      <button
                        className={`panel-sub-btn ${b.isPaid ? "" : "active"}`}
                        onClick={() => handleToggleBill(b.id)}
                      >
                        {b.isPaid ? "Batalkan Lunas" : "Tandai Lunas"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Student Promos Database (PRD #52) */}
            <div className="panel-card">
              <div className="panel-header-row">
                <h3 className="panel-heading">🏷️ Database Promo Khusus Mahasiswa Aktif (PRD #52)</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Verified Student Benefits</span>
              </div>

              <div className="promos-grid">
                <div className="promo-card">
                  <span className="promo-badge">Diskon 50%</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Spotify Premium Student</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Hanya Rp 27.500/bulan dengan upload KTM atau kartu mahasiswa aktif.
                  </p>
                </div>

                <div className="promo-card">
                  <span className="promo-badge">Diskon 20%</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Kereta Api Indonesia (KAI)</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Diskon tiket kereta antarkota khusus mahasiswa universitas mitra.
                  </p>
                </div>

                <div className="promo-card">
                  <span className="promo-badge">Gratis 100%</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700" }}>GitHub Student Developer Pack</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Akses domain gratis, cloud hosting, dan Copilot untuk mahasiswa IT.
                  </p>
                </div>

                <div className="promo-card">
                  <span className="promo-badge">Diskon 60%</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Adobe Creative Cloud Student</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Potongan harga langganan Premiere Pro & Photoshop untuk tugas kampus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: CATAT TRANSAKSI / SCAN STRUK (PRD #17, #19)
          ======================================================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{modalMode === "manual" ? "✍️" : "🧾"}</span>
                <span className="modal-title">
                  {modalMode === "manual" ? "Catat Transaksi Finansial" : "Simulasi Scan Struk (AI OCR)"}
                </span>
              </div>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            {/* Modal Mode Selector */}
            <div style={{ padding: "12px 24px 0 24px" }}>
              <div className="type-toggle-group">
                <button
                  type="button"
                  className={`type-toggle-btn ${modalMode === "manual" ? "active-expense" : ""}`}
                  onClick={() => setModalMode("manual")}
                >
                  Input Manual
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${modalMode === "ocr" ? "active-income" : ""}`}
                  onClick={() => setModalMode("ocr")}
                >
                  Scan Struk (Demo OCR)
                </button>
              </div>
            </div>

            {modalMode === "manual" ? (
              <form onSubmit={handleAddTransaction}>
                <div className="modal-body">
                  {/* Tipe Transaksi: Pengeluaran vs Pemasukan */}
                  <div className="form-group">
                    <label className="form-label">Jenis Transaksi</label>
                    <div className="type-toggle-group">
                      <button
                        type="button"
                        className={`type-toggle-btn ${formType === "expense" ? "active-expense" : ""}`}
                        onClick={() => setFormType("expense")}
                      >
                        - Pengeluaran
                      </button>
                      <button
                        type="button"
                        className={`type-toggle-btn ${formType === "income" ? "active-income" : ""}`}
                        onClick={() => setFormType("income")}
                      >
                        + Pemasukan
                      </button>
                    </div>
                  </div>

                  {/* Judul Transaksi */}
                  <div className="form-group">
                    <label className="form-label">Keterangan / Nama Transaksi</label>
                    <input
                      type="text"
                      className="input-tactile"
                      placeholder="cth: Makan Siang Nasi Padang / Kopi Kampus"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Nominal with Quick Presets */}
                  <div className="form-group">
                    <label className="form-label">Nominal (Rupiah)</label>
                    <input
                      type="number"
                      className="input-tactile"
                      placeholder="cth: 20000"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      required
                    />
                    <div className="preset-chip-row">
                      <span className="preset-chip" onClick={() => setFormAmount("15000")}>+15k (Warteg)</span>
                      <span className="preset-chip" onClick={() => setFormAmount("25000")}>+25k (Kopi)</span>
                      <span className="preset-chip" onClick={() => setFormAmount("50000")}>+50k (Bensin/Pulsa)</span>
                      <span className="preset-chip" onClick={() => setFormAmount("100000")}>+100k (Belanja)</span>
                    </div>
                  </div>

                  {/* Quick Student Shortcuts */}
                  <div className="form-group">
                    <label className="form-label">Jajan Favorit Mahasiswa (Shortcut Cepat)</label>
                    <div className="preset-chip-row">
                      <span
                        className="preset-chip"
                        onClick={() => applyPreset("Makan Siang Nasi Padang", 18000, "Makanan & Minuman", "Tunai")}
                      >
                        🍛 Nasi Padang (18k)
                      </span>
                      <span
                        className="preset-chip"
                        onClick={() => applyPreset("Es Kopi Susu Tetangga", 20000, "Kopi & Nongkrong", "GoPay")}
                      >
                        ☕ Es Kopi (20k)
                      </span>
                      <span
                        className="preset-chip"
                        onClick={() => applyPreset("Token Listrik Kos", 50000, "Kosan & Tagihan", "BCA")}
                      >
                        ⚡ Listrik Kos (50k)
                      </span>
                    </div>
                  </div>

                  {/* Kategori & Dompet */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="form-group">
                      <label className="form-label">Kategori</label>
                      <select
                        className="filter-select"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                      >
                        <option value="Makanan & Minuman">🍛 Makanan & Minuman</option>
                        <option value="Kopi & Nongkrong">☕ Kopi & Nongkrong</option>
                        <option value="Kuliah & Tugas">📚 Kuliah & Tugas</option>
                        <option value="Transportasi">🛵 Transportasi</option>
                        <option value="Kosan & Tagihan">🏠 Kosan & Tagihan</option>
                        <option value="Hiburan & Belanja">🛍️ Hiburan & Belanja</option>
                        <option value="Uang Saku Ortu">🏦 Uang Saku Ortu</option>
                        <option value="Gaji / Freelance">💼 Gaji / Freelance</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sumber Dana</label>
                      <select
                        className="filter-select"
                        value={formWallet}
                        onChange={(e) => setFormWallet(e.target.value)}
                      >
                        <option value="Tunai">💵 Dompet Tunai</option>
                        <option value="BCA">💳 Rekening BCA</option>
                        <option value="GoPay">📱 GoPay</option>
                        <option value="OVO">📱 OVO</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-add-action">
                    Simpan Transaksi
                  </button>
                </div>
              </form>
            ) : (
              <div className="modal-body">
                <div style={{ border: "2px dashed var(--border-medium)", borderRadius: "12px", padding: "32px", textAlign: "center", background: "var(--bg-elevated)" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>📸</div>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px" }}>Upload / Foto Struk Belanja</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                    AI Gemini Vision akan membaca merchant, tanggal, dan total belanja secara otomatis.
                  </p>
                  <button
                    type="button"
                    className="btn-add-action"
                    style={{ margin: "0 auto" }}
                    onClick={() => {
                      applyPreset("Struk Indomaret Point (Roti + Air + Kopi)", 34500, "Makanan & Minuman", "GoPay");
                      setModalMode("manual");
                      showToast("✨ AI OCR berhasil mendeteksi transaksi dari struk!");
                    }}
                  >
                    Simulasikan Baca Struk Belanja Indomaret
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TOAST NOTIFICATION (Instant Feedback)
          ======================================================== */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast-box">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
