import { useState, useEffect } from 'react';
import { fetchDashboardSummary } from '../services/api';

const Dashboard = ({ setActiveTab }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const data = await fetchDashboardSummary();
                setSummary(data);
            } catch (err) {
                setError('Unable to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        loadSummary();
    }, []);

    if (loading) return <div className="status-message">Loading dashboard...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const isZeroData = summary && 
        summary.totalMembers === 0 && 
        summary.totalSocieties === 0 && 
        summary.totalVillageAreas === 0 && 
        summary.totalStaff === 0 && 
        summary.totalFunds === 0 && 
        summary.totalGroups === 0 && 
        summary.totalSavingsAccounts === 0 && 
        summary.totalLoans === 0 && 
        summary.totalRepayments === 0;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Dashboard</h1>
            <p className="dashboard-subheading">Overview of the Microfinance and Cooperative Society Management System</p>
            
            {isZeroData ? (
                <div className="status-message">No records available.</div>
            ) : (
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-title">Total Members</div>
                        <div className="card-number">{summary.totalMembers}</div>
                        <p className="card-desc">Registered members</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Societies</div>
                        <div className="card-number">{summary.totalSocieties}</div>
                        <p className="card-desc">Active cooperative societies</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Village Areas</div>
                        <div className="card-number">{summary.totalVillageAreas}</div>
                        <p className="card-desc">Operating village areas</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Staff Members</div>
                        <div className="card-number">{summary.totalStaff}</div>
                        <p className="card-desc">Employed staff members</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Funds</div>
                        <div className="card-number">{summary.totalFunds}</div>
                        <p className="card-desc">Total managed funds</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Cooperative Groups</div>
                        <div className="card-number">{summary.totalGroups}</div>
                        <p className="card-desc">Active cooperative groups</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Savings Accounts</div>
                        <div className="card-number">{summary.totalSavingsAccounts}</div>
                        <p className="card-desc">Member savings accounts</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Total Loans</div>
                        <div className="card-number">{summary.totalLoans}</div>
                        <p className="card-desc">Issued loans</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-title">Total Repayments</div>
                        <div className="card-number">{summary.totalRepayments}</div>
                        <p className="card-desc">Recorded repayments</p>
                    </div>
                </div>
            )}

            <div className="section-title">Quick Actions</div>
            <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => setActiveTab('members')}>Add Member</button>
                <button className="quick-action-btn" onClick={() => setActiveTab('societies')}>Add Society</button>
                <button className="quick-action-btn" onClick={() => setActiveTab('staff')}>Add Staff</button>
                <button className="quick-action-btn" onClick={() => setActiveTab('funds')}>Add Fund</button>
                <button className="quick-action-btn" onClick={() => setActiveTab('loans')}>Add Loan</button>
            </div>
        </div>
    );
};

export default Dashboard;
