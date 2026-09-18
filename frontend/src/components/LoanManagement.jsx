import { useState, useEffect } from 'react';
import { fetchLoans, createLoan, updateLoan, deleteLoan, fetchMembers } from '../services/api';

const LoanManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [formData, setFormData] = useState({ loanId: '', memberId: '', loanType: '', amount: '', startDate: '', tenure: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLoans();
            setRecords(data);
            setLastRefreshed(new Date().toLocaleTimeString());
            setFkMembers(await fetchMembers());
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
            memberId: record.memberId !== null && record.memberId !== undefined ? record.memberId : '',
            loanType: record.loanType !== null && record.loanType !== undefined ? record.loanType : '',
            amount: record.amount !== null && record.amount !== undefined ? record.amount : '',
            startDate: record.startDate !== null && record.startDate !== undefined ? record.startDate : '',
            tenure: record.tenure !== null && record.tenure !== undefined ? record.tenure : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ loanId: '', memberId: '', loanType: '', amount: '', startDate: '', tenure: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            loanId: formData.loanId ? (isNaN(Number(formData.loanId)) ? formData.loanId : Number(formData.loanId)) : null,
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            loanType: formData.loanType || null,
            amount: formData.amount ? (isNaN(Number(formData.amount)) ? formData.amount : Number(formData.amount)) : null,
            startDate: formData.startDate || null,
            tenure: formData.tenure ? (isNaN(Number(formData.tenure)) ? formData.tenure : Number(formData.tenure)) : null,
        };

        try {
            if (editingRecord) {
                await updateLoan(editingRecord.loanId, dataToSend);
                setSuccess('Loan updated successfully!');
            } else {
                await createLoan(dataToSend);
                setSuccess('Loan added successfully!');
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
            await deleteLoan(record.loanId);
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
                    <h2>Loan Management</h2>
                    <p>Manage registered loans and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Loan'}
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
                        <label className="form-label">Loan ID:</label>
                        <input type="number" step="1" name="loanId" value={formData.loanId} onChange={handleChange} required disabled={editingRecord !== null} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Member:</label>
                        <select name="memberId" value={formData.memberId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Member --</option>
                            {fkMembers.map(fk => (
                                <option key={fk.memberId} value={fk.memberId}>
                                    {fk.memberId} - {fk.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Loan Type:</label>
                        <input type="text" name="loanType" value={formData.loanType} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Amount:</label>
                        <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start Date:</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tenure (Months):</label>
                        <input type="number" step="1" name="tenure" value={formData.tenure} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Loans</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {lastRefreshed && <span style={{ fontSize: '0.85em', color: '#666' }}>Last refreshed: {lastRefreshed}</span>}
                    <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
                </div>
            </div>
            {loading && !records.length ? <div className="status-message">Loading records...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Loan ID</th>
                            <th >Member</th>
                            <th >Loan Type</th>
                            <th >Amount</th>
                            <th >Start Date</th>
                            <th >Tenure (Months)</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.loanId}</td>
                                <td >{r.memberId}</td>
                                <td >{r.loanType}</td>
                                <td >{r.amount}</td>
                                <td >{r.startDate}</td>
                                <td >{r.tenure}</td>
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

export default LoanManagement;
