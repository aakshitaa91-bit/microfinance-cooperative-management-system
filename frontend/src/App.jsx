import { useState } from 'react';
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

  const navStyle = {
    padding: '10px',
    backgroundColor: '#333',
    color: 'white',
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  };

  const btnStyle = (isActive) => ({
    background: 'none',
    border: 'none',
    color: isActive ? '#4da6ff' : 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none'
  });

  return (
    <div>
      <header style={{ backgroundColor: '#222', color: 'white', padding: '15px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Microfinance and Cooperative Society Management System</h1>
      </header>
      
      <nav style={navStyle}>
        <button style={btnStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button style={btnStyle(activeTab === 'members')} onClick={() => setActiveTab('members')}>Members</button>
        <button style={btnStyle(activeTab === 'societies')} onClick={() => setActiveTab('societies')}>Cooperative Societies</button>
        <button style={btnStyle(activeTab === 'village-areas')} onClick={() => setActiveTab('village-areas')}>Village Areas</button>
        <button style={btnStyle(activeTab === 'staff')} onClick={() => setActiveTab('staff')}>Staff</button>
        <button style={btnStyle(activeTab === 'funds')} onClick={() => setActiveTab('funds')}>Funds</button>
        <button style={btnStyle(activeTab === 'savings')} onClick={() => setActiveTab('savings')}>Savings Accounts</button>
        <button style={btnStyle(activeTab === 'loans')} onClick={() => setActiveTab('loans')}>Loans</button>
        <button style={btnStyle(activeTab === 'repayments')} onClick={() => setActiveTab('repayments')}>Repayments</button>
        <button style={btnStyle(activeTab === 'groups')} onClick={() => setActiveTab('groups')}>Groups</button>
        <button style={btnStyle(activeTab === 'memberships')} onClick={() => setActiveTab('memberships')}>Memberships</button>
        <button style={btnStyle(activeTab === 'member-phones')} onClick={() => setActiveTab('member-phones')}>Member Phones</button>
        <button style={btnStyle(activeTab === 'member-groups')} onClick={() => setActiveTab('member-groups')}>Member Groups</button>
        <button style={btnStyle(activeTab === 'loan-funds')} onClick={() => setActiveTab('loan-funds')}>Loan Funds</button>
        <button style={btnStyle(activeTab === 'staff-phones')} onClick={() => setActiveTab('staff-phones')}>Staff Phones</button>
      </nav>

      <main style={{ padding: '20px' }}>
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
