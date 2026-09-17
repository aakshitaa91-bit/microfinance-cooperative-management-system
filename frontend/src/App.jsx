import { useState } from 'react';
import './App.css';
import MemberManagement from './components/MemberManagement';
import CooperativeSocietyManagement from './components/CooperativeSocietyManagement';
import VillageAreaManagement from './components/VillageAreaManagement';
import StaffManagement from './components/StaffManagement';
import FundManagement from './components/FundManagement';
import SavingsAccountManagement from './components/SavingsAccountManagement';
import LoanManagement from './components/LoanManagement';
import RepaymentManagement from './components/RepaymentManagement';
import MemberPhoneManagement from './components/MemberPhoneManagement';
import MembershipManagement from './components/MembershipManagement';
import CooperativeGroupManagement from './components/CooperativeGroupManagement';
import MemberGroupManagement from './components/MemberGroupManagement';
import LoanFundManagement from './components/LoanFundManagement';
import StaffPhoneManagement from './components/StaffPhoneManagement';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'societies', label: 'Cooperative Societies' },
    { id: 'village-areas', label: 'Village Areas' },
    { id: 'staff', label: 'Staff' },
    { id: 'funds', label: 'Funds' },
    { id: 'member-phones', label: 'Member Phones' },
    { id: 'memberships', label: 'Memberships' },
    { id: 'groups', label: 'Cooperative Groups' },
    { id: 'member-groups', label: 'Member Groups' },
    { id: 'savings', label: 'Savings Accounts' },
    { id: 'loans', label: 'Loans' },
    { id: 'loan-funds', label: 'Loan Funds' },
    { id: 'staff-phones', label: 'Staff Phones' },
    { id: 'repayments', label: 'Repayments' }
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          Microfinance & Cooperative Society
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'members' && <MemberManagement />}
        {activeTab === 'societies' && <CooperativeSocietyManagement />}
        {activeTab === 'village-areas' && <VillageAreaManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'funds' && <FundManagement />}
        {activeTab === 'savings' && <SavingsAccountManagement />}
        {activeTab === 'loans' && <LoanManagement />}
        {activeTab === 'repayments' && <RepaymentManagement />}
        {activeTab === 'groups' && <CooperativeGroupManagement />}
        {activeTab === 'memberships' && <MembershipManagement />}
        {activeTab === 'member-phones' && <MemberPhoneManagement />}
        {activeTab === 'member-groups' && <MemberGroupManagement />}
        {activeTab === 'loan-funds' && <LoanFundManagement />}
        {activeTab === 'staff-phones' && <StaffPhoneManagement />}
      </main>
    </div>
  );
}

export default App;
