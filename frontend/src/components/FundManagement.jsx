import { useState, useEffect } from 'react';
import { fetchFunds, createFund, updateFund, deleteFund } from '../services/api';

const FundManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ fundId: '', fundType: '', totalAmount: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFunds();
            setRecords(data);
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
            fundId: record.fundId !== null && record.fundId !== undefined ? record.fundId : '',
            fundType: record.fundType !== null && record.fundType !== undefined ? record.fundType : '',
            totalAmount: record.totalAmount !== null && record.totalAmount !== undefined ? record.totalAmount : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ fundId: '', fundType: '', totalAmount: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            fundId: formData.fundId ? (isNaN(Number(formData.fundId)) ? formData.fundId : Number(formData.fundId)) : null,
            fundType: formData.fundType || null,
            totalAmount: formData.totalAmount ? (isNaN(Number(formData.totalAmount)) ? formData.totalAmount : Number(formData.totalAmount)) : null,
        };

        try {
            if (editingRecord) {
                await updateFund(editingRecord.fundId, dataToSend);
                setSuccess('Fund updated successfully!');
            } else {
                await createFund(dataToSend);
                setSuccess('Fund added successfully!');
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
            await deleteFund(record.fundId);
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
                    <h2>Fund Management</h2>
                    <p>Manage registered funds and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Fund'}
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
                        <label className="form-label">Fund ID:</label>
                        <input type="number" step="1" name="fundId" value={formData.fundId} onChange={handleChange} required disabled={editingRecord !== null} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fund Type:</label>
                        <input type="text" name="fundType" value={formData.fundType} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Total Amount:</label>
                        <input type="number" step="0.01" name="totalAmount" value={formData.totalAmount} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Funds</h3>
                <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>Refresh</button>
            </div>
            {loading && !records.length ? <div className="status-message">Loading records...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Fund ID</th>
                            <th >Fund Type</th>
                            <th >Total Amount</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.fundId}</td>
                                <td >{r.fundType}</td>
                                <td >{r.totalAmount}</td>
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

export default FundManagement;
