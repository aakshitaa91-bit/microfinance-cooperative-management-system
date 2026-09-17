import { useState, useEffect } from 'react';
import { fetchLoanFunds, createLoanFund, updateLoanFund, deleteLoanFund, fetchLoans, fetchFunds } from '../services/api';

const LoanFundManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkLoans, setFkLoans] = useState([]);
    const [fkFunds, setFkFunds] = useState([]);
    const [formData, setFormData] = useState({ loanId: '', fundId: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLoanFunds();
            setRecords(data);
            setFkLoans(await fetchLoans());
            setFkFunds(await fetchFunds());
        } catch (err) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            loanId: record.loanId !== null && record.loanId !== undefined ? record.loanId : '',
            fundId: record.fundId !== null && record.fundId !== undefined ? record.fundId : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setFormData({ loanId: '', fundId: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            loanId: formData.loanId ? (isNaN(Number(formData.loanId)) ? formData.loanId : Number(formData.loanId)) : null,
            fundId: formData.fundId ? (isNaN(Number(formData.fundId)) ? formData.fundId : Number(formData.fundId)) : null,
        };

        try {
            if (editingRecord) {
                await updateLoanFund(editingRecord.loanId, editingRecord.fundId, dataToSend);
                setSuccess('LoanFund updated successfully!');
            } else {
                await createLoanFund(dataToSend);
                setSuccess('LoanFund added successfully!');
            }
            handleCancelEdit();
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await deleteLoanFund(record.loanId, record.fundId);
            setSuccess('Record deleted successfully!');
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Loan Fund Management</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', border: '1px solid green', backgroundColor: '#e6ffe6' }}>{success}</div>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Loan:</label><br/>
                        <select name="loanId" value={formData.loanId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Loan --</option>
                            {fkLoans.map(fk => (
                                <option key={fk.loanId} value={fk.loanId}>
                                    {fk.loanId} - {fk.loanId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Fund:</label><br/>
                        <select name="fundId" value={formData.fundId} onChange={handleChange} required style={{width: '100%'}}>
                            <option value="">-- Select Fund --</option>
                            {fkFunds.map(fk => (
                                <option key={fk.fundId} value={fk.fundId}>
                                    {fk.fundId} - {fk.fundType}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>{loading ? 'Saving...' : (editingRecord ? 'Update' : 'Add')}</button>
                    {editingRecord && <button type="button" onClick={handleCancelEdit} disabled={loading}>Cancel</button>}
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Existing Records</h3>
                <button onClick={loadData} disabled={loading}>Refresh</button>
            </div>
            {loading && !records.length ? <p>Loading...</p> : (
                <div style={{overflowX: 'auto'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border="1">
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '8px' }}>Loan</th>
                            <th style={{ padding: '8px' }}>Fund</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '8px' }}>{r.loanId}</td>
                                <td style={{ padding: '8px' }}>{r.fundId}</td>
                                <td style={{ padding: '8px' }}>
                                    <button onClick={() => handleEdit(r)} style={{ marginRight: '5px' }}>Edit</button>
                                    <button onClick={() => handleDelete(r)} style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
};

export default LoanFundManagement;
