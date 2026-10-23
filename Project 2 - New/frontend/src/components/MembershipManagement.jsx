import { useState, useEffect } from 'react';
import { fetchMemberships, createMembership, updateMembership, deleteMembership, fetchMembers, fetchCooperativeSocietys } from '../services/api';

const MembershipManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [fkCooperativeSocietys, setFkCooperativeSocietys] = useState([]);
    const [formData, setFormData] = useState({ memberId: '', societyId: '', joinDate: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMemberships();
            setRecords(data);
            setLastRefreshed(new Date().toLocaleTimeString());
            setFkMembers(await fetchMembers());
            setFkCooperativeSocietys(await fetchCooperativeSocietys());
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
            memberId: record.memberId !== null && record.memberId !== undefined ? record.memberId : '',
            societyId: record.societyId !== null && record.societyId !== undefined ? record.societyId : '',
            joinDate: record.joinDate !== null && record.joinDate !== undefined ? record.joinDate : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ memberId: '', societyId: '', joinDate: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            societyId: formData.societyId ? (isNaN(Number(formData.societyId)) ? formData.societyId : Number(formData.societyId)) : null,
            joinDate: formData.joinDate || null,
        };

        try {
            if (editingRecord) {
                await updateMembership(editingRecord.memberId, editingRecord.societyId, dataToSend);
                setSuccess('Membership updated successfully!');
            } else {
                await createMembership(dataToSend);
                setSuccess('Membership added successfully!');
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
            await deleteMembership(record.memberId, record.societyId);
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
                    <h2>Membership Management</h2>
                    <p>Manage registered memberships and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Membership'}
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
                        <label className="form-label">Society:</label>
                        <select name="societyId" value={formData.societyId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Society --</option>
                            {fkCooperativeSocietys.map(fk => (
                                <option key={fk.societyId} value={fk.societyId}>
                                    {fk.societyId} - {fk.societyName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Join Date:</label>
                        <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Memberships</h3>
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
                            <th >Member</th>
                            <th >Society</th>
                            <th >Join Date</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.memberId}</td>
                                <td >{r.societyId}</td>
                                <td >{r.joinDate}</td>
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

export default MembershipManagement;
