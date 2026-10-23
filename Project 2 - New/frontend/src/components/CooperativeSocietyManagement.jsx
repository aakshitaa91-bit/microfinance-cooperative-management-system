import { useState, useEffect } from 'react';
import { fetchCooperativeSocietys, createCooperativeSociety, updateCooperativeSociety, deleteCooperativeSociety } from '../services/api';

const CooperativeSocietyManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ societyId: '', societyName: '', registrationDate: '', street: '', city: '', state: '', pin: '' });

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCooperativeSocietys();
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
            societyId: record.societyId !== null && record.societyId !== undefined ? record.societyId : '',
            societyName: record.societyName !== null && record.societyName !== undefined ? record.societyName : '',
            registrationDate: record.registrationDate !== null && record.registrationDate !== undefined ? record.registrationDate : '',
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
        setFormData({ societyId: '', societyName: '', registrationDate: '', street: '', city: '', state: '', pin: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = {
            societyId: formData.societyId ? (isNaN(Number(formData.societyId)) ? formData.societyId : Number(formData.societyId)) : null,
            societyName: formData.societyName || null,
            registrationDate: formData.registrationDate || null,
            street: formData.street || null,
            city: formData.city || null,
            state: formData.state || null,
            pin: formData.pin || null,
        };

        try {
            if (editingRecord) {
                await updateCooperativeSociety(editingRecord.societyId, dataToSend);
                setSuccess('CooperativeSociety updated successfully!');
            } else {
                await createCooperativeSociety(dataToSend);
                setSuccess('CooperativeSociety added successfully!');
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
            await deleteCooperativeSociety(record.societyId);
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
                    <h2>Cooperative Society Management</h2>
                    <p>Manage registered cooperative societys and their information.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Cooperative Society'}
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
                        <label className="form-label">Society ID:</label>
                        <input type="number" step="1" name="societyId" value={formData.societyId} onChange={handleChange} required disabled={editingRecord !== null} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Society Name:</label>
                        <input type="text" name="societyName" value={formData.societyName} onChange={handleChange}  className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Registration Date:</label>
                        <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange}  className="form-input" />
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
                <h3 className="section-title" style={{ margin: 0 }}>Existing Cooperative Societys</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {lastRefreshed && <span style={{ fontSize: '0.85em', color: '#666' }}>Last refreshed: {lastRefreshed}</span>}
                    <button className="btn-secondary" onClick={() => { loadData() }} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
                </div>
            </div>
            {loading && !records.length ? <div className="status-message">Loading cooperative societys...</div> : (
                <div className="table-wrapper">
                <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th >Society ID</th>
                            <th >Society Name</th>
                            <th >Registration Date</th>
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
                                <td >{r.societyId}</td>
                                <td >{r.societyName}</td>
                                <td >{r.registrationDate}</td>
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

export default CooperativeSocietyManagement;
