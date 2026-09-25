export default function Home() {
  return (
    <div className="app-container">
      {/* Sidebar Glassmorphism */}
      <aside className="sidebar glass-panel">
        <div className="logo">
          <h2>Mhs<span>Hemat</span></h2>
        </div>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Transaksi</li>
            <li>Anggaran</li>
            <li>Analitik AI</li>
            <li>Pengaturan</li>
          </ul>
        </nav>
        <div className="user-profile">
          <div className="avatar neumorph-circle"></div>
          <p>Halo, Mahasiswa!</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header>
          <h1>Dashboard Keuangan</h1>
          <div className="theme-toggle neumorph-button">🌙 Dark Mode</div>
        </header>

        <section className="dashboard-grid">
          {/* Skeuomorphic ATM Card */}
          <div className="card atm-card skeuomorphic">
            <div className="card-chip"></div>
            <p className="card-label">Saldo Saat Ini</p>
            <h2 className="balance">Rp 1.500.000</h2>
            <div className="card-footer">
              <span>Bulan: Sept 2026</span>
              <span>Visa</span>
            </div>
          </div>

          {/* Glassmorphism Stats */}
          <div className="card stats-card glass-panel">
            <h3>Pengeluaran Bulan Ini</h3>
            <p className="expense">Rp 450.000</p>
            <div className="progress-bar neumorph-inset">
              <div className="progress" style={{ width: '30%' }}></div>
            </div>
            <p className="warning-text">Aman! Masih sisa 70% dari budget.</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Aksi Cepat</h2>
          <div className="action-buttons">
            <button className="neumorph-button primary">+ Pemasukan</button>
            <button className="neumorph-button danger">- Pengeluaran</button>
            <button className="neumorph-button">Scan Struk</button>
          </div>
        </section>
      </main>
    </div>
  );
}
