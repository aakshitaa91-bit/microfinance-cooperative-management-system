import { useState, useEffect } from 'react';
import { fetchStaffs, createStaff, updateStaff, deleteStaff } from '../services/api';

const StaffManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ staffId: '', name: '', designation: '', street: '', city: '', state: '', pin: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStaffs();
            setRecords(data);
            setLastRefreshed(new Date().toLocaleTimeString());
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
            staffId: record.staffId !== null && record.staffId !== undefined ? record.staffId : '',
            name: record.name !== null && record.name !== undefined ? record.name : '',
            designation: record.designation !== null && record.designation !== undefined ? record.designation : '',
            street: record.street !== null && record.street !== undefined ? record.street : '',
            city: record.city !== null && record.city !== undefined ? record.city : '',
            state: record.state !== null && record.state !== undefined ? record.state : '',
            pin: record.pin !== null && record.pin !== undefined ? record.pin : '',
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingRecord(null);
        setFormData({ staffId: '', name: '', designation: '', street: '', city: '', state: '', pin: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            staffId: formData.staffId ? (isNaN(Number(formData.staffId)) ? formData.staffId : Number(formData.staffId)) : null,
            name: formData.name || null,
            designation: formData.designation || null,
            street: formData.street || null,
            city: formData.city || null,
            state: formData.state || null,
            pin: formData.pin || null,
        };

        try {
            if (editingRecord) {
                await updateStaff(editingRecord.staffId, dataToSend);
                setSuccess('Staff updated successfully!');
            } else {
                await createStaff(dataToSend);
                setSuccess('Staff added successfully!');
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
            await deleteStaff(record.staffId);
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
                    <h2>Staff Management</h2>
                    <p>Manage registered staffs and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Staff'}
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
                        <label className="form-label">Staff ID:</label>
                        <input type="number" step="1" name="staffId" value={formData.staffId} onChange={handleChange} required disabled={editingRecord !== null} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Designation:</label>
                        <input type="text" name="designation" value={formData.designation} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Street:</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">State:</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">PIN:</label>
                        <input type="text" name="pin" value={formData.pin} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Staffs</h3>
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
                            <th >Staff ID</th>
                            <th >Name</th>
                            <th >Designation</th>
                            <th >Street</th>
                            <th >City</th>
                            <th >State</th>
                            <th >PIN</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>No records found.</td></tr>
                        ) : records.map((r, idx) => (
                            <tr key={idx}>
                                <td >{r.staffId}</td>
                                <td >{r.name}</td>
                                <td >{r.designation}</td>
                                <td >{r.street}</td>
                                <td >{r.city}</td>
                                <td >{r.state}</td>
                                <td >{r.pin}</td>
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

export default StaffManagement;
