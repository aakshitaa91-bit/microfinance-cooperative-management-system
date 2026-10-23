import { useState, useEffect } from 'react';
import { fetchLoanFunds, createLoanFund, updateLoanFund, deleteLoanFund, fetchLoans, fetchFunds } from '../services/api';

const LoanFundManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
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
            setLastRefreshed(new Date().toLocaleTimeString());
            setFkLoans(await fetchLoans());
            setFkFunds(await fetchFunds());
        } catch (err) {
            setError('Unable to load records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleEdit = (record) => {
        setShowForm(true);
        setEditingRecord(record);
        setFormData({
            loanId: record.loanId !== null && record.loanId !== undefined ? record.loanId : '',
            fundId: record.fundId !== null && record.fundId !== undefined ? record.fundId : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
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
            setShowForm(false);
            await loadData();
        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (record) => {
        setRecordToDelete(record);
    };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        const record = recordToDelete;
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
        <div className="module-container">
            <div className="module-header">
                <div className="module-title-section">
                    <h2>Loan Fund Management</h2>
                    <p>Manage registered loan funds and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Loan Fund'}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {showForm && (
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h3>{editingRecord ? 'Edit Record' : 'Add New Record'}</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Loan:</label>
                        <select name="loanId" value={formData.loanId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Loan --</option>
                            {fkLoans.map(fk => (
                                <option key={fk.loanId} value={fk.loanId}>
                                    {fk.loanId} - {fk.loanId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fund:</label>
                        <select name="fundId" value={formData.fundId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Fund --</option>
                            {fkFunds.map(fk => (
                                <option key={fk.fundId} value={fk.fundId}>
                                    {fk.fundId} - {fk.fundType}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-actions">
                    {editingRecord ? <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={loading}>Cancel</button> : null}
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : (editingRecord ? 'Update' : 'Add')}</button>
                </div>
                           </form>
            </div>
        )}
            <div className="module-header" style={{ marginTop: '30px', borderBottom: 'none' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Existing Loan Funds</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {lastRefreshed && <span style={{ fontSize: '0.85em', color: '#666' }}>Last refreshed: {lastRefreshed}</span>}
                    <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
                </div>
            </div>
            {loading && !records.length ? <div className="status-message">Loading loan funds...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Loan</th>
                            <th >Fund</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.loanId}</td>
                                <td >{r.fundId}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-text-edit" onClick={() => handleEdit(r)}>[Edit]</button>
                                        <button className="btn-text-delete" onClick={() => confirmDelete(r)}>[Delete]</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                </div>
            )}
        
            {recordToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this record?</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setRecordToDelete(null)}>Cancel</button>
                            <button className="btn-danger" onClick={() => { handleDelete(); setRecordToDelete(null); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanFundManagement;
