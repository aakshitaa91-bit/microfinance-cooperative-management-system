import { useState, useEffect } from 'react';
import { fetchSavingsAccounts, createSavingsAccount, updateSavingsAccount, deleteSavingsAccount, fetchMembers } from '../services/api';

const SavingsAccountManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [formData, setFormData] = useState({ accountNo: '', memberId: '', openingDate: '', accountType: '', nomineeId: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSavingsAccounts();
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
            accountNo: record.accountNo !== null && record.accountNo !== undefined ? record.accountNo : '',
            memberId: record.memberId !== null && record.memberId !== undefined ? record.memberId : '',
            openingDate: record.openingDate !== null && record.openingDate !== undefined ? record.openingDate : '',
            accountType: record.accountType !== null && record.accountType !== undefined ? record.accountType : '',
            nomineeId: record.nomineeId !== null && record.nomineeId !== undefined ? record.nomineeId : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ accountNo: '', memberId: '', openingDate: '', accountType: '', nomineeId: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            accountNo: formData.accountNo ? (isNaN(Number(formData.accountNo)) ? formData.accountNo : Number(formData.accountNo)) : null,
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            openingDate: formData.openingDate || null,
            accountType: formData.accountType || null,
            nomineeId: formData.nomineeId ? Number(formData.nomineeId) : null,
        };

        try {
            if (editingRecord) {
                await updateSavingsAccount(editingRecord.accountNo, dataToSend);
                setSuccess('SavingsAccount updated successfully!');
            } else {
                await createSavingsAccount(dataToSend);
                setSuccess('SavingsAccount added successfully!');
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
            await deleteSavingsAccount(record.accountNo);
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
                    <h2>Savings Account Management</h2>
                    <p>Manage registered savings accounts and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Savings Account'}
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
                        <label className="form-label">Account No:</label>
                        <input type="number" step="1" name="accountNo" value={formData.accountNo} onChange={handleChange} required disabled={editingRecord !== null} className="form-input" />
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
                        <label className="form-label">Opening Date:</label>
                        <input type="date" name="openingDate" value={formData.openingDate} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Account Type:</label>
                        <input type="text" name="accountType" value={formData.accountType} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nominee (Optional):</label>
                        <select name="nomineeId" value={formData.nomineeId} onChange={handleChange}  className="form-select" >
                            <option value="">-- Select Nominee (Optional) --</option>
                            {fkMembers.map(fk => (
                                <option key={fk.memberId} value={fk.memberId}>
                                    {fk.memberId} - {fk.name}
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Savings Accounts</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {lastRefreshed && <span style={{ fontSize: '0.85em', color: '#666' }}>Last refreshed: {lastRefreshed}</span>}
                    <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
                </div>
            </div>
            {loading && !records.length ? <div className="status-message">Loading savings accounts...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Account No</th>
                            <th >Member</th>
                            <th >Opening Date</th>
                            <th >Account Type</th>
                            <th >Nominee (Optional)</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.accountNo}</td>
                                <td >{r.memberId}</td>
                                <td >{r.openingDate}</td>
                                <td >{r.accountType}</td>
                                <td >{r.nomineeId}</td>
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

export default SavingsAccountManagement;
