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
                setError('Failed to load dashboard data. Please check backend connection.');
            } finally {
                setLoading(false);
            }
        };
        loadSummary();
    }, []);

    const cardStyle = {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        flex: '1 1 200px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const numStyle = {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#4da6ff',
        margin: '10px 0 0 0'
    };

    const actionBtnStyle = {
        padding: '12px 20px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        flex: '1 1 150px'
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Dashboard Overview</h2>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Total Members</div>
                    <div style={numStyle}>{summary.totalMembers}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Societies</div>
                    <div style={numStyle}>{summary.totalSocieties}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Village Areas</div>
                    <div style={numStyle}>{summary.totalVillageAreas}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Staff Members</div>
                    <div style={numStyle}>{summary.totalStaff}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Funds</div>
                    <div style={numStyle}>{summary.totalFunds}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Cooperative Groups</div>
                    <div style={numStyle}>{summary.totalGroups}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Savings Accounts</div>
                    <div style={numStyle}>{summary.totalSavingsAccounts}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Total Loans</div>
                    <div style={numStyle}>{summary.totalLoans}</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>Total Repayments</div>
                    <div style={numStyle}>{summary.totalRepayments}</div>
                </div>
            </div>

            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button style={actionBtnStyle} onClick={() => setActiveTab('members')}>+ Add Member</button>
                <button style={actionBtnStyle} onClick={() => setActiveTab('societies')}>+ Add Society</button>
                <button style={actionBtnStyle} onClick={() => setActiveTab('staff')}>+ Add Staff</button>
                <button style={actionBtnStyle} onClick={() => setActiveTab('funds')}>+ Add Fund</button>
                <button style={actionBtnStyle} onClick={() => setActiveTab('savings')}>+ Add Savings Account</button>
                <button style={actionBtnStyle} onClick={() => setActiveTab('loans')}>+ Add Loan</button>
            </div>
        </div>
    );
};

export default Dashboard;
