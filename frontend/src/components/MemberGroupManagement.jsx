import { useState, useEffect } from 'react';
import { fetchMemberGroups, createMemberGroup, updateMemberGroup, deleteMemberGroup, fetchMembers, fetchCooperativeGroups } from '../services/api';

const MemberGroupManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fkMembers, setFkMembers] = useState([]);
    const [fkCooperativeGroups, setFkCooperativeGroups] = useState([]);
    const [formData, setFormData] = useState({ memberId: '', groupId: '', role: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMemberGroups();
            setRecords(data);
            setFkMembers(await fetchMembers());
            setFkCooperativeGroups(await fetchCooperativeGroups());
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
            groupId: record.groupId !== null && record.groupId !== undefined ? record.groupId : '',
            role: record.role !== null && record.role !== undefined ? record.role : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ memberId: '', groupId: '', role: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            memberId: formData.memberId ? (isNaN(Number(formData.memberId)) ? formData.memberId : Number(formData.memberId)) : null,
            groupId: formData.groupId ? (isNaN(Number(formData.groupId)) ? formData.groupId : Number(formData.groupId)) : null,
            role: formData.role || null,
        };

        try {
            if (editingRecord) {
                await updateMemberGroup(editingRecord.memberId, editingRecord.groupId, dataToSend);
                setSuccess('MemberGroup updated successfully!');
            } else {
                await createMemberGroup(dataToSend);
                setSuccess('MemberGroup added successfully!');
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
            await deleteMemberGroup(record.memberId, record.groupId);
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
                    <h2>Member Group Management</h2>
                    <p>Manage registered member groups and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Member Group'}
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
                        <label className="form-label">Group:</label>
                        <select name="groupId" value={formData.groupId} onChange={handleChange} required className="form-select" >
                            <option value="">-- Select Group --</option>
                            {fkCooperativeGroups.map(fk => (
                                <option key={fk.groupId} value={fk.groupId}>
                                    {fk.groupId} - {fk.groupName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role:</label>
                        <input type="text" name="role" value={formData.role} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Member Groups</h3>
                <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>Refresh</button>
            </div>
            {loading && !records.length ? <div className="status-message">Loading member groups...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Member</th>
                            <th >Group</th>
                            <th >Role</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.memberId}</td>
                                <td >{r.groupId}</td>
                                <td >{r.role}</td>
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

export default MemberGroupManagement;
